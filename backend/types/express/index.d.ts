import { IUser } from '../../models/User'; // adjust if needed

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
