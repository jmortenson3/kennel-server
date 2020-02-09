import jwt from 'jsonwebtoken';
import { IUser, IUserSafe } from '../interfaces/IUser';
import { comparePasswords, decodeToken } from '../utils';
import config from '../../config';
import User from '../models/user';
import { UserService } from './user';

export default class AuthService {
  constructor() {}

  public async SignUp(
    user: IUser
  ): Promise<{ newUser: IUserSafe; token: string }> {
    try {
      if (user.password != user.repassword) {
        throw new Error('signup password mismatch');
      }
      const userService = new UserService();
      const newUserSafe = await userService.CreateUser(user);
      const token = this.CreateToken(newUserSafe);

      delete newUserSafe.hashed_password;

      return { newUser: newUserSafe, token };
    } catch (err) {
      throw err;
    }
  }

  public async Login(user: IUser): Promise<{ user: IUserSafe; token: string }> {
    try {
      if (!user.email) {
        throw new Error('email not provided for login');
      }

      let emailLower = user.email.toLowerCase();
      const userRecord = await User.findOne({ where: { email: emailLower } });

      if (!userRecord) {
        throw new Error('user not found');
      }

      if (!userRecord.hashed_password) {
        throw new Error('no hashed password from db');
      }

      const correctPassword = await comparePasswords(
        user.password,
        userRecord.hashed_password
      );

      if (!correctPassword) {
        throw new Error('password incorrect');
      }

      const userSafe = <IUserSafe>userRecord.toJSON();
      const token = this.CreateToken(userSafe);

      delete userSafe.hashed_password;

      return { user: userSafe, token };
    } catch (err) {
      throw err;
    }
  }

  public async Recall(
    token: string
  ): Promise<{ user: IUserSafe; token: string }> {
    try {
      const decodedToken = await decodeToken(token, config.tokenKey);
      if (!decodedToken) {
        throw new Error('token could not be decoded');
      }

      console.log(decodeToken);

      const userPayload = <any>decodedToken;
      if (!userPayload.email) {
        throw new Error('email not found in token');
      }
      const emailLower = userPayload.email.toLowerCase();
      const userRecord = await User.findOne({
        where: {
          email: emailLower,
        },
      });

      const userSafe = <IUserSafe>userRecord.toJSON();
      const newToken = this.CreateToken(userSafe);

      delete userSafe.hashed_password;

      return { user: userSafe, token: newToken };
    } catch (err) {
      throw err;
    }
  }

  private CreateToken(user: IUserSafe): string {
    const token = jwt.sign(user, config.tokenKey, config.jwtSignOptions);
    return token;
  }
}
