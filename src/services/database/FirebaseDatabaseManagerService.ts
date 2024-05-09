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
import { DatabaseManagerService, DesignData } from './DatabaseManagerService'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from 'firebase/auth'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  private designsSubscription?: Unsubscribe
  private designsSubject: BehaviorSubject<DesignData[]>

  public constructor(firestore: Firestore) {
    super()
    this.firestore = firestore
    this.designsSubject = new BehaviorSubject<DesignData[]>([])
  }

  public dispose(): void {
    this.designsSubscription?.()
  }

  public async addDesign(user: User): Promise<void> {
    const designsCollectionReference = this.getDesignsCollectionReference(user)
    await addDoc(designsCollectionReference, { design: 'new design' })
  }

  public async getDesigns(user: User): Promise<DesignData[]> {
    const designsCollection = this.getDesignsCollectionReference(user)
    const designDocs = await getDocs(designsCollection)
    const designs: DesignData[] = []
    designDocs.forEach((designDoc) => designs.push({ id: designDoc.id }))
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
        const designs: DesignData[] = docs.map((doc) => ({ id: doc.id }))
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
    const designData: DesignData = { id: designDoc.id }
    return designData
  }

  private getDesignsCollectionReference(user: User) {
    return collection(this.firestore, 'users', user.uid, 'designs')
  }

  private getDesignDocReference(user: User, designId: string) {
    return doc(this.firestore, 'users', user.uid, 'designs', designId)
  }
}
