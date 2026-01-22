// Google Drive Service for file uploads
// Uses Google Identity Services (GIS) for OAuth and Google Drive API for file operations

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
}

interface TokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface UploadResult {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink?: string;
}

// Global state for Google API
let tokenClient: TokenClient | null = null;
let accessToken: string | null = null;
let gapiLoaded = false;
let gisLoaded = false;

// Check if Google Drive is configured
export function isGoogleDriveConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_API_KEY);
}

// Load the Google API script
function loadGapiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (gapiLoaded) {
      resolve();
      return;
    }

    if (document.getElementById('gapi-script')) {
      // Script already exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.gapi) {
          gapiLoaded = true;
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'gapi-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gapiLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.head.appendChild(script);
  });
}

// Load the Google Identity Services script
function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (gisLoaded) {
      resolve();
      return;
    }

    if (document.getElementById('gis-script')) {
      // Script already exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          gisLoaded = true;
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gisLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
}

// Initialize GAPI client
async function initializeGapiClient(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    window.gapi.load('client', {
      callback: resolve,
      onerror: () => reject(new Error('Failed to load GAPI client')),
    });
  });

  await window.gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  });
}

// Initialize the token client
function initializeTokenClient(): Promise<void> {
  return new Promise((resolve) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response: { access_token?: string; error?: string }) => {
        if (response.error) {
          console.error('Token error:', response.error);
          accessToken = null;
        } else if (response.access_token) {
          accessToken = response.access_token;
        }
      },
    });
    resolve();
  });
}

// Initialize Google APIs
export async function initializeGoogleDrive(): Promise<void> {
  if (!isGoogleDriveConfigured()) {
    throw new Error('Google Drive is not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY environment variables.');
  }

  await Promise.all([loadGapiScript(), loadGisScript()]);
  await initializeGapiClient();
  await initializeTokenClient();
}

// Request access token (triggers OAuth flow if needed)
export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    // Set up a temporary callback to capture the token
    const originalCallback = tokenClient;

    // Override the token client callback temporarily
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response: { access_token?: string; error?: string }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else if (response.access_token) {
          accessToken = response.access_token;
          resolve(response.access_token);
        }
      },
    });

    // Request the token
    if (accessToken) {
      // We have a token, use it
      resolve(accessToken);
    } else {
      // Request a new token
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
}

// Upload file to Google Drive
export async function uploadToGoogleDrive(
  content: string,
  filename: string,
  mimeType: string = 'text/plain',
  folderId?: string
): Promise<UploadResult> {
  // Ensure we have an access token
  if (!accessToken) {
    await requestAccessToken();
  }

  const metadata: {
    name: string;
    mimeType: string;
    parents?: string[];
  } = {
    name: filename,
    mimeType: mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  // Create multipart request
  const boundary = '-------314159265358979323846';
  const delimiter = '\r\n--' + boundary + '\r\n';
  const closeDelimiter = '\r\n--' + boundary + '--';

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    // Check if token expired
    if (response.status === 401) {
      accessToken = null;
      throw new Error('Сесія закінчилась. Будь ласка, спробуйте ще раз.');
    }
    throw new Error(`Upload failed: ${errorText}`);
  }

  const result = await response.json();
  return result as UploadResult;
}

// Upload both txt and html files
export async function uploadExportToGoogleDrive(
  textContent: string,
  htmlContent: string,
  baseFilename: string
): Promise<{ txt: UploadResult; html: UploadResult }> {
  const txtResult = await uploadToGoogleDrive(
    textContent,
    `${baseFilename}.txt`,
    'text/plain'
  );

  const htmlResult = await uploadToGoogleDrive(
    htmlContent,
    `${baseFilename}.html`,
    'text/html'
  );

  return { txt: txtResult, html: htmlResult };
}

// Check if user is authorized
export function isAuthorized(): boolean {
  return Boolean(accessToken);
}

// Sign out (revoke token)
export function signOut(): void {
  if (accessToken) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      accessToken = null;
    });
  }
}

// Declare global types for Google APIs
declare global {
  interface Window {
    gapi: {
      load: (api: string, options: { callback: () => void; onerror?: () => void }) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        drive?: {
          files: {
            create: (params: unknown) => Promise<{ result: UploadResult }>;
          };
        };
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => TokenClient;
          revoke: (token: string, callback: () => void) => void;
        };
      };
    };
  }
}
