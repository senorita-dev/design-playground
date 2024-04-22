import { FirebaseApp } from 'firebase/app'
import { Firestore, addDoc, collection, getDocs, getFirestore } from 'firebase/firestore'
import { DatabaseManagerService, DesignData } from './DatabaseManagerService'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  public constructor(firebaseApp: FirebaseApp) {
    super()
    this.firestore = getFirestore(firebaseApp)
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
}
