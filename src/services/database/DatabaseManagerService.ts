export abstract class DatabaseManagerService {
  public abstract addDesign(): Promise<void>
  public abstract getDesigns(): Promise<DesignData[]>
}

export interface DesignData {
  id: string
}
