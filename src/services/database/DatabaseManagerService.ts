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
    designObject: DesignObjectProps,
  ): Promise<void>
  public abstract deleteDesignObject(
    user: User,
    designId: string,
    designObjectId: string,
  ): Promise<void>
  public abstract observeDesignObjects(user: User, designId: string): Observable<DesignObject[]>
  public abstract setSelectedDesignObject(designObjectId: string): void
  public abstract clearSelectedDesignObject(): void
  public abstract observeSelectedDesignObject(): Observable<DesignObject | null>
}

export interface DesignData {
  id: string
  objects: DesignObject[]
}

type DesignObjectType = 'rectangle'

interface BaseDesignObject {
  id: string
  type: DesignObjectType
  x: number
  y: number
}

interface RectangleObject extends BaseDesignObject {
  type: 'rectangle'
}

export type DesignObject = RectangleObject

export type DesignObjectProps = Omit<DesignObject, 'id'>
