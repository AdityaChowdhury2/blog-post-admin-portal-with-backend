import config from ".";

export const JWT_SECRET = config.jwt_access_secret || "supersecret";
export const JWT_REFRESH_SECRET = config.jwt_refresh_secret || "supersecret";
export const JWT_EXPIRES_IN = config.jwt_access_expires_in || "2h";
export const JWT_REFRESH_EXPIRES_IN = config.jwt_refresh_expires_in || "7d";
