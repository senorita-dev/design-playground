import { User } from 'firebase/auth'
import { Observable } from 'rxjs'

export abstract class DatabaseManagerService {
  public abstract dispose(): void
  public abstract addDesign(user: User): Promise<void>
  public abstract getDesigns(user: User): Promise<DesignData[]>
  public abstract observeDesigns(user: User): Observable<DesignData[]>
  public abstract getDesign(user: User, designId: string): Promise<DesignData>
  public abstract createDesignObject(user: User, designId: string, designObjectType: DesignObjectType): Promise<void>
}

export interface DesignData {
  id: string
}

export type DesignObjectType = 'rectangle'
