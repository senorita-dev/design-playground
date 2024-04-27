import { Firestore, addDoc, collection, getDocs } from 'firebase/firestore'
import { DatabaseManagerService, DesignData } from './DatabaseManagerService'

export class FirebaseDatabaseManagerService extends DatabaseManagerService {
  private firestore: Firestore
  public constructor(firestore: Firestore) {
    super()
    this.firestore = firestore
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
