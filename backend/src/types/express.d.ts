// declare namespace Express {
//     export interface Request {
//         user: any;
//     }
//     export interface Response {
//         user: any;
//     }
//   }

import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; 
    }
  }
}
