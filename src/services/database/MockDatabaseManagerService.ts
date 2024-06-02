import { Observable } from 'rxjs'
import { DatabaseManagerService, DesignData } from './DatabaseManagerService'
import { DesignObject } from '../design/DesignManagerService'

export class MockDatabaseManagerService extends DatabaseManagerService {
  public dispose(): void {
    throw new Error('Method not implemented.')
  }
  public addDesign(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public getDesigns(): Promise<DesignData[]> {
    throw new Error('Method not implemented.')
  }
  public observeDesigns(): Observable<DesignData[]> {
    throw new Error('Method not implemented.')
  }
  public getDesign(): Promise<DesignData> {
    throw new Error('Method not implemented.')
  }
  public createDesignObject(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public observeDesignObjects(): Observable<DesignObject[]> {
    throw new Error('Method not implemented.')
  }
}
