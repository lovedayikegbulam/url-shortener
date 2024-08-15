import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import CONFIG from "../config/config";

const JWT_SECRET = CONFIG.JWT_SECRET || 'your_secret_key';

// export interface AuthRequest extends Request {
//   user?: any;
// }

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;