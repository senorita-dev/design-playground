import { User } from "firebase/auth";
import { Observable } from "rxjs";

export abstract class UserManagerService {
  public abstract initialise(): void
  public abstract dispose(): void
  public abstract observeUser(): Observable<User | null>
  public abstract login(): Promise<void>
  public abstract logout(): void
}
