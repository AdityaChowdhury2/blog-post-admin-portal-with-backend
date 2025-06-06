import type { UserRole } from "@prisma/client";

export interface IAuthLoginPayload {
  email: string;
  password: string;
}

export interface IAuthRegisterPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
export interface IAuthService {
  loginService: (payload: IAuthLoginPayload) => Promise<{ token: string }>;
  registerService: (
    payload: IAuthRegisterPayload
  ) => Promise<{ id: string; email: string; role: UserRole }>;
}
