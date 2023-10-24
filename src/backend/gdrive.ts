import { loadScript } from "../utils.js";

declare var gapi: any;
declare var google: any;

export class File {
  id: string;
  name: string;
  mimeType: string;
  createdTime: Date;

  constructor(id: string, name: string, mimeType: string, createdTime: Date) {
    this.id = id;
    this.name = name;
    this.mimeType = mimeType;
    this.createdTime = createdTime;
  }
};

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive';

let CLIENT_ID: String;
let API_KEY: String;

let tokenClient: any;
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

export async function init(client_id: String, api_key: String) {
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

export async function listFiles(pageSize: number, q: String) {
  let response;
  response = await gapi.client.drive.files.list({
    'pageSize': pageSize,
    'q': q,
    'fields': 'files(id, name, mimeType, createdTime)',
  });
  let res: File[] = response.result.files.map(
    (file: any) => new File(file.id, file.name, file.mimeType, new Date(file.createdTime))
  );
  return res;
}

