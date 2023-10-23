import { createSignal, onMount, For } from "solid-js";
import './App.scss'
import { load, init, revoke, listFiles } from "./backend/gdrive";
import { encrypt, decrypt } from "./cypher/aes";

function App() {
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

  async function handleListClick() {
    let files = await listFiles(10, "parents in 'root'");
    document.getElementById("content").innerHTML = ''
    for (let file of files) {
      document.getElementById("content").innerHTML += 
        '<p>' + JSON.stringify(file) + '</p>'
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
        <button id="init_client" onClick={signIn}>Sign in</button>
        <button id="signout_button" onClick={signOut}>Sign Out</button>
      </div >
      <div>
        <button id="list_files_button" onClick={handleListClick}>List files</button>
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
