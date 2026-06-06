/**
 * Environment configuration for ConstiuINT
 * 
 * Centralizes access to environment variables with type safety.
 * Credentials are loaded from process.env; validation happens at runtime.
 */

export interface EnvConfig {
  // Database
  DATABASE_URL: string;
  
  // Auth
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  EMAIL_SERVER: string;
  EMAIL_FROM: string;
  ADMIN_EMAILS: string;
  
  // Providers
  GEOCODIO_API_KEY?: string;
}

/**
 * Gets the environment configuration with validation
 */
export function getEnv(): EnvConfig {
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "EMAIL_SERVER",
    "EMAIL_FROM",
    "ADMIN_EMAILS",
  ] as const;
  
  // Check required variables
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(", ")}`);
  }
  
  return {
    DATABASE_URL: process.env.DATABASE_URL || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    EMAIL_SERVER: process.env.EMAIL_SERVER || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    ADMIN_EMAILS: process.env.ADMIN_EMAILS || "",
    GEOCODIO_API_KEY: process.env.GEOCODIO_API_KEY,
  };
}

/**
 * Checks if Geocodio is configured for live mode
 */
export function isGeocodioConfigured(): boolean {
  return !!process.env.GEOCODIO_API_KEY;
}

/**
 * Gets the configured provider mode
 */
export function getProviderMode(): "geocodio" | "fixture" {
  if (isGeocodioConfigured()) {
    return "geocodio";
  }
  return "fixture";
}
