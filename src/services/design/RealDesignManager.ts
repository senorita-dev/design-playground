import { BehaviorSubject, Observable } from 'rxjs'
import { DesignManagerService, DesignObject } from './DesignManagerService'

export class RealDesignManagerService extends DesignManagerService {
  private currentObjectSubject: BehaviorSubject<DesignObject | null> =
    new BehaviorSubject<DesignObject | null>(null)

  public setCurrentObject(designObject: DesignObject): void {
    this.currentObjectSubject.next(designObject)
  }

  public clearCurrentObject() {
    this.currentObjectSubject.next(null)
  }

  public observeCurrentObject(): Observable<DesignObject | null> {
    return this.currentObjectSubject
  }
}
