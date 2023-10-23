import { createSignal, onMount, For } from "solid-js";
import { loadScript } from "./util";
import './App.scss'

function App() {
  const CLIENT_ID = '695678300880-k19jfgsgnob6fil49kpilb3r04aior9v.apps.googleusercontent.com';
  const API_KEY = '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';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/drive';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  onMount(async () => {
    loadScript("https://apis.google.com/js/api.js", gapiLoaded)
    loadScript("https://accounts.google.com/gsi/client", gisLoaded)
  })

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listFiles();
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  async function listFiles() {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
      document.getElementById('content').innerText = 'No files found.';
      return;
    }
    const output = files.reduce(
      (str, file) => `${str}${file.name} (${file.id})\n`,
      'Files:\n');
    document.getElementById('content').innerText = output;
  }

  return (
    <>
      <div>
      </div>
      <h1>wclone</h1>
      <button id="authorize_button" onClick={handleAuthClick}>Authorize</button>
      <button id="signout_button" onClick={handleSignoutClick}>Sign Out</button>
      <br />
      <div id="content"></div>
      <form className='upload'>
        <input type="file" name="uploadFile" required />
        <br />
        <input type="submit" />
      </form>
    </>
  )
}

export default App
