import jwt from 'jsonwebtoken';
import { IUser, IUserSafe } from '../interfaces/IUser';
import { nowISO, hashPassword, comparePasswords, decodeToken } from '../utils';
import config from '../../config';
import User from '../models/user';

export default class AuthService {
  constructor() {}

  public async SignUp(
    user: IUser
  ): Promise<{ newUser: IUserSafe; token: string }> {
    try {
      if (!user.email) {
        throw new Error('email not provided for signup');
      }

      const emailLower = user.email.toLowerCase();

      const potentialUser = await User.findOne({
        where: { email: emailLower },
      });

      if (potentialUser) {
        throw new Error('user already exists');
      }

      const hashedPassword = await hashPassword(user.password);
      const now = nowISO();
      const userModel: IUserSafe = {
        email: emailLower,
        hashed_password: hashedPassword,
        created_datetime: now,
        updated_datetime: now,
      };

      const newUser = await User.create(userModel);
      const userSafe = <IUserSafe>newUser.toJSON();
      const token = this.CreateToken(userSafe);
      return { newUser: userSafe, token };
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
