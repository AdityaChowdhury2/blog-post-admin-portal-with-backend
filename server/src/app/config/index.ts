interface DeepFreezeObject {
  [key: string]: string | number | DeepFreezeObject;
}

function deepFreeze<T>(obj: T): T {
  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const value = (obj as unknown as DeepFreezeObject)[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Object.isFrozen(value)
      ) {
        deepFreeze(value);
      }
    });
    return Object.freeze(obj);
  }
  return obj;
}

export default deepFreeze({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    uri: process.env.DB_URI as string,
  },
  email: {
    host: process.env.EMAIL_HOSTNAME,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
    user: process.env.EMAIL_AUTH_USER ? process.env.EMAIL_AUTH_USER : "",
    pass: process.env.EMAIL_AUTH_PASSWORD
      ? process.env.EMAIL_AUTH_PASSWORD
      : "",
    to: process.env.EMAIL_TO ? process.env.EMAIL_TO : "",
  },
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
});
