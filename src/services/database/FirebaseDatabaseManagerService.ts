import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  Unsubscribe,
  doc,
  getDoc,
} from 'firebase/firestore'
import { DatabaseManagerService, DesignData, DesignObject } from './DatabaseManagerService'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from 'firebase/auth'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  private designsSubscription?: Unsubscribe
  private designsSubject: BehaviorSubject<DesignData[]>
  private designObjectsSubscription?: Unsubscribe
  private designObjectsSubject: BehaviorSubject<DesignObject[]>

  public constructor(firestore: Firestore) {
    super()
    this.firestore = firestore
    this.designsSubject = new BehaviorSubject<DesignData[]>([])
    this.designObjectsSubject = new BehaviorSubject<DesignObject[]>([])
  }

  public dispose(): void {
    this.designsSubscription?.()
    this.designObjectsSubscription?.()
  }

  public async addDesign(user: User): Promise<void> {
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    await addDoc(designsCollectionReference, { design: 'new design' })
  }

  public async getDesigns(user: User): Promise<DesignData[]> {
    const designsCollection = this.getDesignsCollectionReference(user)
    const designDocs = await getDocs(designsCollection)
    const designs: DesignData[] = []
    designDocs.forEach((designDoc) => {
      console.log('designDoc', designDoc.data())
      const designData: DesignData = { id: designDoc.id, objects: [] }
      designs.push(designData)
    })
    return designs
  }

  public observeDesigns(user: User): Observable<DesignData[]> {
    // Have to unsubscribe previous subscription because of React Strict Mode in development.
    // Simply checking if the subscription exists results in multiple subscriptions.
    this.designsSubscription?.()
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    this.designsSubscription = onSnapshot(
      designsCollectionReference,
      (snapshot) => {
        const docs = snapshot.docs
        const designs: DesignData[] = docs.map((doc) => ({ id: doc.id, objects: [] }))
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
      const designObject = objectDoc.data() as DesignObject
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

  public observeDesignObjects(user: User, designId: string): Observable<DesignObject[]> {
    this.designObjectsSubscription?.()
    const designObjectsCollectionReference = this.getObjectsCollectionReference(user, designId)
    this.designsSubscription = onSnapshot(
      designObjectsCollectionReference,
      (snapshot) => {
        const docs = snapshot.docs
        const designObjects: DesignObject[] = docs.map((doc) => doc.data() as DesignObject)
        this.designObjectsSubject.next(designObjects)
      },
    )
    return this.designObjectsSubject
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
}
