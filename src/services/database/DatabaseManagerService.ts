import { Observable } from "rxjs";

export abstract class DatabaseManagerService {
  public abstract dispose(): void
  public abstract addDesign(): Promise<void>
  public abstract getDesigns(): Promise<DesignData[]>
  public abstract observeDesigns(): Observable<DesignData[]>
}

export interface DesignData {
  id: string
}
