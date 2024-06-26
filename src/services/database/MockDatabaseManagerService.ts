import { Observable } from 'rxjs'
import { DatabaseManagerService, DesignObject, DesignDataMetadata } from './DatabaseManagerService'

export class MockDatabaseManagerService extends DatabaseManagerService {
  public dispose(): void {
    throw new Error('Method not implemented.')
  }
  public createDesign(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public observeDesigns(): Observable<DesignDataMetadata[]> {
    throw new Error('Method not implemented.')
  }
  public setCurrentDesign(): void {
    throw new Error('Method not implemented.')
  }
  public observeCurrentDesign(): Observable<DesignDataMetadata | null> {
    throw new Error('Method not implemented.')
  }
  public observeCurrentDesignObjects(): Observable<DesignObject[]> {
    throw new Error('Method not implemented.')
  }
  public createDesignObject(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public deleteDesignObject(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public editDesignObject(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public setSelectedDesignObject(): void {
    throw new Error('Method not implemented.')
  }
  public clearSelectedDesignObject(): void {
    throw new Error('Method not implemented.')
  }
  public observeSelectedDesignObject(): Observable<DesignObject | null> {
    throw new Error('Method not implemented.')
  }
}
