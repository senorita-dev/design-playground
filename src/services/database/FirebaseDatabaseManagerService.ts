import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import { DatabaseManagerService, DesignData } from './DatabaseManagerService'
import { BehaviorSubject, Observable } from 'rxjs'

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

  public async addDesign(): Promise<void> {
    await addDoc(collection(this.firestore, 'designs'), {
      design: 'new design',
    })
  }

  public async getDesigns(): Promise<DesignData[]> {
    const designs = await getDocs(collection(this.firestore, 'designs'))
    const designList: DesignData[] = []
    designs.forEach((design) => designList.push({ id: design.id }))
    return designList
  }

  public observeDesigns(): Observable<DesignData[]> {
    // Have to unsubscribe previous subscription because of React Strict Mode in development.
    // Simply checking if the subscription exists results in multiple subscriptions.
    if (this.designsSubscription) {
      this.designsSubscription()
    }
    this.designsSubscription = onSnapshot(
      collection(this.firestore, 'designs'),
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
}
