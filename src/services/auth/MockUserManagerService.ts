import { User } from 'firebase/auth'
import { UserManagerService } from './UserManagerService'
import { Observable } from 'rxjs'

export class MockUserManagerService extends UserManagerService {
  public initialise(): void {
    throw new Error('Method not implemented.')
  }
  public dispose(): void {
    throw new Error('Method not implemented.')
  }
  public observeUser(): Observable<User | null> {
    throw new Error('Method not implemented.')
  }
  public login(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public logout(): void {
    throw new Error('Method not implemented.')
  }
}
