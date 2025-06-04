import config from ".";

export const JWT_SECRET = config.jwt_access_secret || "supersecret";
export const JWT_EXPIRES_IN = "2h";
