import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
  Unsubscribe,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import {
  DatabaseManagerService,
  DesignObject,
  DesignObjectProps,
  DesignDataMetadata,
} from './DatabaseManagerService'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from 'firebase/auth'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  private designsSubscription?: Unsubscribe
  private designsSubject: BehaviorSubject<DesignDataMetadata[]>
  private designSubscription?: Unsubscribe
  private designSubject: BehaviorSubject<DesignDataMetadata | null>
  private designObjectsSubscription?: Unsubscribe
  private designObjectsSubject: BehaviorSubject<DesignObject[]>
  private selectedDesignObjectSubject: BehaviorSubject<DesignObject | null>

  public constructor(firestore: Firestore) {
    super()
    this.firestore = firestore
    this.designsSubject = new BehaviorSubject<DesignDataMetadata[]>([])
    this.designSubject = new BehaviorSubject<DesignDataMetadata | null>(null)
    this.designObjectsSubject = new BehaviorSubject<DesignObject[]>([])
    this.selectedDesignObjectSubject = new BehaviorSubject<DesignObject | null>(null)
  }

  public dispose(): void {
    this.designsSubscription?.()
    this.designSubscription?.()
    this.designObjectsSubscription?.()
  }

  public async createDesign(user: User, name: string): Promise<void> {
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    const designDataProps: Omit<DesignDataMetadata, 'id'> = { name, createdAt: new Date() }
    await addDoc(designsCollectionReference, designDataProps)
  }

  public observeDesigns(user: User): Observable<DesignDataMetadata[]> {
    // Have to unsubscribe previous subscription because of React Strict Mode in development.
    // Simply checking if the subscription exists results in multiple subscriptions.
    this.designsSubscription?.()
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    this.designsSubscription = onSnapshot(
      query(designsCollectionReference, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const docs = snapshot.docs
        const designs: DesignDataMetadata[] = docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as DesignDataMetadata),
        )
        this.designsSubject.next(designs)
      },
      (error) => {
        console.error(error)
      },
    )
    return this.designsSubject
  }

  public setCurrentDesign(user: User, designId: string): void {
    this.updateCurrentDesign(user, designId)
    this.updateCurrentDesignObjects(user, designId)
  }

  private updateCurrentDesign(user: User, designId: string) {
    this.designSubscription?.()
    const designDocReference = this.getDesignDocReference(user, designId)
    this.designSubscription = onSnapshot(designDocReference, (doc) => {
      if (doc.exists() === false) {
        this.designSubject.next(null)
        return
      }
      const designData: DesignDataMetadata = { id: doc.id, ...doc.data() } as DesignDataMetadata
      this.designSubject.next(designData)
    })
  }

  private updateCurrentDesignObjects(user: User, designId: string) {
    this.designObjectsSubscription?.()
    const designObjectsCollectionReference = this.getObjectsCollectionReference(user, designId)
    this.designsSubscription = onSnapshot(designObjectsCollectionReference, (snapshot) => {
      const docs = snapshot.docs
      const designObjects: DesignObject[] = docs.map((doc) => {
        const data: DesignObjectProps = doc.data() as DesignObjectProps
        const designObject = { id: doc.id, ...data }
        return designObject
      })
      this.designObjectsSubject.next(designObjects)
      const updatedSelectedDesignObject = designObjects.find(
        ({ id }) => id === this.selectedDesignObjectSubject.value?.id,
      )
      if (updatedSelectedDesignObject === undefined) {
        this.clearSelectedDesignObject()
        return
      }
      this.setSelectedDesignObject(updatedSelectedDesignObject.id)
    })
  }

  public observeCurrentDesign(): Observable<DesignDataMetadata | null> {
    return this.designSubject
  }

  public observeCurrentDesignObjects(): Observable<DesignObject[]> {
    return this.designObjectsSubject
  }

  public async createDesignObject(
    user: User,
    designId: string,
    designObject: DesignObject,
  ): Promise<void> {
    const objectsCollectionReference = this.getObjectsCollectionReference(user, designId)
    await addDoc(objectsCollectionReference, designObject)
  }

  public async deleteDesignObject(
    user: User,
    designId: string,
    designObjectId: string,
  ): Promise<void> {
    const designObjectDocReference = this.getObjectDocReference(user, designId, designObjectId)
    await deleteDoc(designObjectDocReference)
  }

  public async editDesignObject(
    user: User,
    designId: string,
    designObject: DesignObject,
  ): Promise<void> {
    const designObjectDocReference = this.getObjectDocReference(user, designId, designObject.id)
    const updatedDesignObject: DesignObjectProps = designObject
    await updateDoc(designObjectDocReference, updatedDesignObject)
  }

  public setSelectedDesignObject(designObjectId: string): void {
    const designObjects = this.designObjectsSubject.value
    const designObject = designObjects.find(({ id }) => id === designObjectId)
    this.selectedDesignObjectSubject.next(designObject ?? null)
  }

  public clearSelectedDesignObject(): void {
    this.selectedDesignObjectSubject.next(null)
  }

  public observeSelectedDesignObject(): Observable<DesignObject | null> {
    return this.selectedDesignObjectSubject
  }

  private getDesignsCollectionReference(user: User) {
    return collection(this.firestore, 'users', user.uid, 'designs')
  }

  private getDesignDocReference(user: User, designId: string) {
    return doc(this.firestore, 'users', user.uid, 'designs', designId)
  }

  private getObjectsCollectionReference(user: User, designId: string) {
    return collection(this.firestore, 'users', user.uid, 'designs', designId, 'objects')
  }

  private getObjectDocReference(user: User, designId: string, designObjectId: string) {
    return doc(this.firestore, 'users', user.uid, 'designs', designId, 'objects', designObjectId)
  }
}
