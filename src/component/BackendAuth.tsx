import { createSignal, onMount } from "solid-js";
import { useDriveAPI } from "./DriveProvider.jsx";
import { produce } from "solid-js/store";

function BackendAuth() {
  const [api, setApi] = useDriveAPI()

  onMount(() => {
    setApi(produce(api => {
      api.load();
    }));
  })

  let clientId: any;
  let apiKey: any;

  function signIn() {
    let client_id = clientId.value;
    let api_key = apiKey.value;

    setApi(produce(api => {
      api.init(client_id, api_key);
    }))
  }

  function signOut() {
    setApi(produce(api => {
      api.revoke();
    }))
  }

  return (
    <>
      <div>
        <div>
          Client ID:
          <input type="text" ref={clientId} value="695678300880-k19jfgsgnob6fil49kpilb3r04aior9v.apps.googleusercontent.com" />
        </div>
        <div>
          API Key:
          <input type="text" ref={apiKey} value="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" />
        </div>
        <button onClick={signIn}>{api.isLogged() ? "Refresh" : "Sign in"}</button>
        <button style={{ "visibility": api.isLogged() ? 'visible' : 'hidden' }} onClick={signOut}>Sign Out</button>
      </div >
    </>

  )
}

export default BackendAuth
