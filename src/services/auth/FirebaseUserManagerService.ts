import {
  Auth,
  GoogleAuthProvider,
  Unsubscribe,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import { UserManagerService } from './UserManagerService'
import { BehaviorSubject, Observable } from 'rxjs'

export class FirebaseUserManagerService extends UserManagerService {
  private auth: Auth
  private provider: GoogleAuthProvider
  private authStateSubscription?: Unsubscribe
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)
  public constructor(auth: Auth) {
    super()
    this.auth = auth
    this.provider = new GoogleAuthProvider()
  }

  public initialise(): void {
    this.authStateSubscription?.()
    const unsubscribe = onAuthStateChanged(this.auth, (user) => this.userSubject.next(user))
    this.authStateSubscription = unsubscribe
  }

  public dispose(): void {
    this.authStateSubscription?.()
  }

  public observeUser(): Observable<User | null> {
    return this.userSubject
  }

  public async login(): Promise<void> {
    await signInWithPopup(this.auth, this.provider)
  }

  public logout(): void {
    this.auth.signOut()
  }
}
