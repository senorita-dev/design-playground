import { Firestore, addDoc, collection, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore'
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
    const designsCollection = this.getDesignsCollection(user)
    await addDoc(designsCollection, { design: 'new design' })
  }

  public async getDesigns(user: User): Promise<DesignData[]> {
    const designsCollection = this.getDesignsCollection(user)
    const designs = await getDocs(designsCollection)
    const designList: DesignData[] = []
    designs.forEach((design) => designList.push({ id: design.id }))
    return designList
  }

  public observeDesigns(user: User): Observable<DesignData[]> {
    // Have to unsubscribe previous subscription because of React Strict Mode in development.
    // Simply checking if the subscription exists results in multiple subscriptions.
    this.designsSubscription?.()
    const designsCollection = this.getDesignsCollection(user)
    this.designsSubscription = onSnapshot(
      designsCollection,
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

  private getDesignsCollection(user: User) {
    return collection(this.firestore, 'users', user.uid, 'designs')
  }
}
