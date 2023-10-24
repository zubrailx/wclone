import { createSignal, onMount } from "solid-js";
import { useDriveCtx } from "./DriveProvider.jsx";
import { produce } from "solid-js/store";

function BackendAuth() {
  const [_, setCtx] = useDriveCtx()

  onMount(() => {
    setCtx(produce(ctx => {
      ctx.load();
    }));
  })

  let [isSignedIn, setIsSignIn] = createSignal(false);

  let clientId: any;
  let apiKey: any;

  function signIn() {
    let client_id = clientId.value;
    let api_key = apiKey.value;

    setCtx(produce(ctx => {
      ctx.init(client_id, api_key)
        .then(() => {
          setIsSignIn(true);
        });
    }))
  }

  function signOut() {
    setCtx(produce(ctx => {
      ctx.revoke()
        .then(() => {
          setIsSignIn(false);
        });
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
        <button onClick={signIn}>{isSignedIn() ? "Refresh" : "Sign in"}</button>
        <button style={{ "visibility": isSignedIn() ? 'visible' : 'hidden' }} onClick={signOut}>Sign Out</button>
      </div >
    </>

  )
}

export default BackendAuth
