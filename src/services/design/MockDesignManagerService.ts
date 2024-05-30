import { Observable } from 'rxjs'
import { DesignManagerService, DesignObject } from './DesignManagerService'

export class MockDesignManagerService extends DesignManagerService {
  public setCurrentObject() {
    throw new Error('Method not implemented.')
  }
  public clearCurrentObject() {
    throw new Error('Method not implemented.')
  }
  public observeCurrentObject(): Observable<DesignObject | null> {
    throw new Error('Method not implemented.')
  }
}
