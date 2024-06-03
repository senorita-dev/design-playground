import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  Unsubscribe,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  DatabaseManagerService,
  DesignData,
  DesignObject,
  DesignObjectProps,
  PartialDesignData,
} from './DatabaseManagerService'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from 'firebase/auth'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  private designsSubscription?: Unsubscribe
  private designsSubject: BehaviorSubject<PartialDesignData[]>
  private designObjectsSubscription?: Unsubscribe
  private designObjectsSubject: BehaviorSubject<DesignObject[]>
  private selectedDesignObjectSubject: BehaviorSubject<DesignObject | null>

  public constructor(firestore: Firestore) {
    super()
    this.firestore = firestore
    this.designsSubject = new BehaviorSubject<PartialDesignData[]>([])
    this.designObjectsSubject = new BehaviorSubject<DesignObject[]>([])
    this.selectedDesignObjectSubject = new BehaviorSubject<DesignObject | null>(null)
  }

  public dispose(): void {
    this.designsSubscription?.()
    this.designObjectsSubscription?.()
  }

  public async addDesign(user: User): Promise<void> {
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    await addDoc(designsCollectionReference, { design: 'new design' })
  }

  public async getDesigns(user: User): Promise<PartialDesignData[]> {
    const designsCollection = this.getDesignsCollectionReference(user)
    const designDocs = await getDocs(designsCollection)
    const designs: PartialDesignData[] = []
    designDocs.forEach((designDoc) => {
      console.log('designDoc', designDoc.data())
      const designData: PartialDesignData = { id: designDoc.id }
      designs.push(designData)
    })
    return designs
  }

  public observeDesigns(user: User): Observable<PartialDesignData[]> {
    // Have to unsubscribe previous subscription because of React Strict Mode in development.
    // Simply checking if the subscription exists results in multiple subscriptions.
    this.designsSubscription?.()
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    this.designsSubscription = onSnapshot(
      designsCollectionReference,
      (snapshot) => {
        const docs = snapshot.docs
        const designs: PartialDesignData[] = docs.map((doc) => ({ id: doc.id }))
        this.designsSubject.next(designs)
      },
      (error) => {
        console.error(error)
      },
    )
    return this.designsSubject
  }

  public async getDesign(user: User, designId: string): Promise<DesignData> {
    const designDocReference = this.getDesignDocReference(user, designId)
    const designDoc = await getDoc(designDocReference)
    const objectsCollectionReference = this.getObjectsCollectionReference(user, designId)
    const objectDocs = await getDocs(objectsCollectionReference)
    const designObjects: DesignObject[] = []
    objectDocs.forEach((objectDoc) => {
      const data: DesignObjectProps = objectDoc.data() as DesignObjectProps
      const designObject: DesignObject = { id: objectDoc.id, ...data }
      designObjects.push(designObject)
    })
    const designData: DesignData = { id: designDoc.id, objects: designObjects }
    return designData
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

  public observeDesignObjects(user: User, designId: string): Observable<DesignObject[]> {
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
    return this.designObjectsSubject
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
