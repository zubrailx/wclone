import { createSignal, onMount, For } from "solid-js";
import { loadScript } from "./util";
import { listFiles } from "./gdrive";
import './App.scss'

function App() {
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/drive';
  let CLIENT_ID;
  let API_KEY;

  let tokenClient;
  let gapiLoaded = false;
  let gisLoaded = false;

  let gapiInited = false;
  let gisInited = false;

  onMount(async () => {
    loadScript("https://apis.google.com/js/api.js", loadGapi)
    loadScript("https://accounts.google.com/gsi/client", loadGis)
  })

  function loadGapi() {
    gapiLoaded = true;
  }

  function loadGis() {
    gisLoaded = true;
  }

  function loadClient() {
    CLIENT_ID = document.getElementById('client_id').value
    API_KEY = document.getElementById('api_key').value

    if (gapiLoaded && gisLoaded) {
      gapi.load('client', initializeGapiClient);

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
      });
      gisInited = true;
      maybeEnableButtons();
    } else {
      alert('gapi or gis is not inited')
    }
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
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

  return (
    <>
      <div>
        <div>
          Client ID:
          <input type="text" id="client_id" value="695678300880-k19jfgsgnob6fil49kpilb3r04aior9v.apps.googleusercontent.com" />
        </div>
        <div>
          API Key:
          <input type="text" id="api_key" value="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" />
        </div>
        <button id="load_client" onClick={loadClient}>Load client</button>
      </div >
      <div>
        <button id="authorize_button" onClick={handleAuthClick}>Authorize</button>
        <button id="signout_button" onClick={handleSignoutClick}>Sign Out</button>
        <div id="content"></div>
        <form className='upload'>
          <div>
            <input type="file" name="uploadFile" required />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  )
}

export default App
