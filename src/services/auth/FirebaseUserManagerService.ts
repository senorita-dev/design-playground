import { Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { UserManagerService } from './UserManagerService'

export class FirebaseUserManagerService extends UserManagerService {
  private auth: Auth
  private provider: GoogleAuthProvider
  public constructor(auth: Auth) {
    super()
    this.auth = auth
    this.provider = new GoogleAuthProvider()
  }
  public async login(): Promise<void> {
    await signInWithPopup(this.auth, this.provider)
  }
  public logout(): void {
    this.auth.signOut()
  }
}
