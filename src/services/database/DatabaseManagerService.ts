import { User } from 'firebase/auth'
import { Observable } from 'rxjs'

export abstract class DatabaseManagerService {
  public abstract dispose(): void
  public abstract addDesign(user: User): Promise<void>
  public abstract getDesigns(user: User): Promise<DesignData[]>
  public abstract observeDesigns(user: User): Observable<DesignData[]>
}

export interface DesignData {
  id: string
}
