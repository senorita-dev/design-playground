import { User } from 'firebase/auth'
import { Observable } from 'rxjs'

export abstract class DatabaseManagerService {
  public abstract dispose(): void
  public abstract createDesign(user: User, name: string): Promise<void>
  public abstract observeDesigns(user: User): Observable<DesignDataMetadata[]>
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
  public abstract editDesignObject(
    user: User,
    designId: string,
    designObject: DesignObject,
  ): Promise<void>
  public abstract observeDesignObjects(user: User, designId: string): Observable<DesignObject[]>
  public abstract setSelectedDesignObject(designObjectId: string): void
  public abstract clearSelectedDesignObject(): void
  public abstract observeSelectedDesignObject(): Observable<DesignObject | null>
}
export interface DesignDataMetadata {
  id: string
  name: string
  createdAt: Date
}

export type DesignData = DesignDataMetadata & { objects: DesignObject[] }

export type GetDesignDataType = DesignDataMetadata

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
