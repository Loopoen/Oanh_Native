const DEV_FALLBACK_SECRET = "oanh";

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production.");
  }
  return DEV_FALLBACK_SECRET;
};
