import { User } from 'firebase/auth'
import { Observable } from 'rxjs'
import { DesignData, DesignObject } from '../design/DesignManagerService'

export abstract class DatabaseManagerService {
  public abstract dispose(): void
  public abstract addDesign(user: User): Promise<void>
  public abstract getDesigns(user: User): Promise<DesignData[]>
  public abstract observeDesigns(user: User): Observable<DesignData[]>
  public abstract getDesign(user: User, designId: string): Promise<DesignData>
  public abstract createDesignObject(
    user: User,
    designId: string,
    designObject: DesignObject,
  ): Promise<void>
  public abstract observeDesignObjects(user: User, designId: string): Observable<DesignObject[]>
}
