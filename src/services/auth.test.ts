import User from '../models/user';
import { IUser } from '../interfaces/IUser';
import AuthService from '../services/auth';
/**
 * Setup
 *  Login
 *    1. create user
 *  Signup none
 */

let mockIds = {
  userEmail: 'test@test.com',
};

const user: IUser = {
  email: mockIds.userEmail,
  password: 'test',
  repassword: 'test',
};

afterAll(async () => {
  try {
    await User.destroy({ where: { email: mockIds.userEmail } });
  } catch (err) {
    console.log(err);
  }
});

describe('Test the auth service', () => {
  const authService = new AuthService();
  test('user should be created via signup', async () => {
    const { newUser, token } = await authService.SignUp(user);
    expect(token).toBeDefined();
    expect(newUser).toEqual(
      expect.objectContaining({
        email: user.email,
      })
    );
  });

  test('signup should fail since passwords dont match', async () => {
    async function signup() {
      const badUser: IUser = {
        email: 'a_user_with_mismatching_passwords',
        password: 'this',
        repassword: 'that',
      };
      await authService.SignUp(badUser);
    }
    await expect(signup()).rejects.toThrowError();
  });

  test('login should not throw error with correct credentials', async () => {
    const { user: loggedInUser, token } = await authService.Login(user);
    expect(token).toBeDefined();
    expect(loggedInUser).toEqual(
      expect.objectContaining({
        email: user.email,
      })
    );
  });

  test('login should fail for wrong password', async () => {
    async function login() {
      const badUser: IUser = {
        email: user.email,
        password: 'this_is_the_wrong_password',
      };
      await authService.Login(badUser);
    }
    await expect(login()).rejects.toThrowError();
  });
});
