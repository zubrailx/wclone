import { load, init, revoke } from "../backend/gdrive";
import { onMount } from "solid-js";

function BackendAuth() {
  onMount(() => {
    load();
  })

  function enableButtons() {
    document.getElementById('signout_button').style.visibility = 'visible';
  }

  function disableButtons() {
    document.getElementById('content').innerText = '';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }

  function signIn() {
    let client_id = document.getElementById('client_id').value;
    let api_key = document.getElementById('api_key').value;

    init(client_id, api_key)
      .then(() => enableButtons());
  }

  function signOut() {
    revoke()
      .then(() => disableButtons());
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
        <button id="init_client" onClick={signIn}>Sign in</button>
        <button id="signout_button" onClick={signOut}>Sign Out</button>
      </div >
    </>

  )
}

export default BackendAuth
