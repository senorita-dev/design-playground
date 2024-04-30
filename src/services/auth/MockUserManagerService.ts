import { UserManagerService } from './UserManagerService'

export class MockUserManagerService extends UserManagerService {
  public login(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public logout(): void {
    throw new Error('Method not implemented.')
  }
}
