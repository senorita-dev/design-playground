export abstract class AbstractDesignManagerService {
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
