import { loadScript } from "../util";

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive';

let CLIENT_ID;
let API_KEY;

let tokenClient;
let gapiLoaded = false;
let gisLoaded = false;

let gapiInited = false;
let gisInited = false;

export function load() {
  loadScript("https://apis.google.com/js/api.js", loadGapi);
  loadScript("https://accounts.google.com/gsi/client", loadGis);
}

function loadGapi() {
  gapiLoaded = true;
}

function loadGis() {
  gisLoaded = true;
}

export async function init(client_id, api_key) {
  CLIENT_ID = client_id
  API_KEY = api_key

  if (gapiLoaded && gisLoaded) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
    });
    gisInited = true;

    gapi.load('client', {
      callback: async function() {
        await initializeGapiClient();

        if (gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      }
    });
  } else {
    throw 'gapi or gis is not inited';
  }
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
}

export async function revoke() {
  const token = gapi.client.getToken();
  if (token !== null) {
    await google.accounts.oauth2.revoke(token.access_token);
    await gapi.client.setToken('');
  }
}

export async function listFiles(pageSize, q) {
  let response;
  response = await gapi.client.drive.files.list({
    'pageSize': pageSize,
    'q': q,
    'fields': 'files(id, name, createdTime, mimeType)',
  });
  return response.result.files;
}

