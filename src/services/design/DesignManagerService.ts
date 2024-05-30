import { Observable } from "rxjs"

export abstract class DesignManagerService {
  public abstract setCurrentObject(designObject: DesignObject): void
  public abstract clearCurrentObject(): void
  public abstract observeCurrentObject(): Observable<DesignObject | null>
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

interface RectangleObject extends BaseDesignObject {
  type: 'rectangle'
}

export type DesignObject = RectangleObject
