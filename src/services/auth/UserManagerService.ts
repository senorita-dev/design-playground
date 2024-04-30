export abstract class UserManagerService {
  public abstract login(): Promise<void>
  public abstract logout(): void
}
