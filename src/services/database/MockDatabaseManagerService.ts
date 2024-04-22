import { DatabaseManagerService, DesignData } from './DatabaseManagerService'

export class MockDatabaseManagerService extends DatabaseManagerService {
  public addDesign(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public getDesigns(): Promise<DesignData[]> {
    throw new Error('Method not implemented.')
  }
}
