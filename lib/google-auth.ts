import { google } from "googleapis";
import fs from "fs";
import path from "path";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKENS_PATH = path.join(process.cwd(), ".gmail_tokens.json");

// Scopes for retrieving, sending emails, and calendar readonly access
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.readonly",
];

/**
 * Parses credentials.json and initializes the OAuth2 Client
 */
export function getOAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("credentials.json is missing in the project root.");
  }

  const credentialsContent = fs.readFileSync(CREDENTIALS_PATH, "utf8");
  const credentials = JSON.parse(credentialsContent);
  
  // Google Credentials format supports 'installed' or 'web' descriptors
  const clientInfo = credentials.installed || credentials.web;
  if (!clientInfo) {
    throw new Error("Invalid credentials.json format. Expected 'installed' or 'web' node.");
  }

  const { client_id, client_secret } = clientInfo;
  const redirectUri = "http://localhost:3000/api/auth/callback/google";

  return new google.auth.OAuth2(client_id, client_secret, redirectUri);
}

/**
 * Generates the Google OAuth Consent authentication URL
 */
export function getAuthUrl(): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

/**
 * Saves authentication tokens (integrating refresh token validation merge)
 */
export function saveTokens(tokens: any) {
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

/**
 * Loads stored authentication tokens from project file cache
 */
export function loadSavedTokens() {
  if (fs.existsSync(TOKENS_PATH)) {
    try {
      const tokensContent = fs.readFileSync(TOKENS_PATH, "utf8");
      return JSON.parse(tokensContent);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Confirms whether the project holds verified authentication tokens
 */
export function isClientAuthenticated(): boolean {
  return loadSavedTokens() !== null;
}
