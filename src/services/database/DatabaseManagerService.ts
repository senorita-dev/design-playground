import { User } from 'firebase/auth'
import { Observable } from 'rxjs'

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

export interface DesignData {
  id: string
  objects: DesignObject[]
}

type DesignObjectType = 'rectangle'

interface BaseDesignObject {
  type: DesignObjectType
  x: number
  y: number
}

interface Rectangle extends BaseDesignObject {
  type: 'rectangle'
}

export type DesignObject = Rectangle
