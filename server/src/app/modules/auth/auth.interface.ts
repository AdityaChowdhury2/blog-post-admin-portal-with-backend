export interface IAuthService {
    loginService: (email: string, password: string) => Promise<{ token: string }>;
    registerService: (
        email: string,
        password: string
    ) => Promise<{ id: string; email: string }>;
}