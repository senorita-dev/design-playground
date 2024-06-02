import { Observable } from "rxjs"

export abstract class DesignManagerService {
  public abstract setCurrentObject(designObject: DesignObject): void
  public abstract clearCurrentObject(): void
  public abstract observeCurrentObject(): Observable<DesignObject | null>
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