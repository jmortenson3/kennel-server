export interface IUser {
  email: string;
  password: string;
  repassword?: string;
}

export interface IUserSafe {
  email: string;
  created_datetime?: string;
  updated_datetime?: string;
}
