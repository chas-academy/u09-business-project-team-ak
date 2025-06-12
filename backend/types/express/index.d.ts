import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      _id: string; // or whatever other fields you store in session
    };
  }
}
