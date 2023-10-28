import { Setter, createSignal, onMount } from "solid-js"
import GeneralAdd, { CreateRemoteFN } from "./GeneralAdd.jsx";
import { GDriveRemote } from "../../remote/gdrive.js";

type Props = {
  setCreateRemote: Setter<CreateRemoteFN | undefined>
}

const _clientId = "695678300880-k19jfgsgnob6fil49kpilb3r04aior9v.apps.googleusercontent.com"
const _apiKey = "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"

function GDriveAdd(props: Props) {

  const [clientId, setClientId] = createSignal<string>(_clientId);
  const [apiKey, setApiKey] = createSignal<string>(_apiKey);
  const [name, setName] = createSignal<string>("");

  onMount(() => {
    props.setCreateRemote(() => createRemote);
  })

  function createRemote() {
    return new GDriveRemote(name(), clientId(), apiKey());
  }

  return (
    <>
      <div>
        <div>
          <span>Client ID:</span>
          <input type="text" value={clientId()} onChange={(e) => {
            setClientId(e.target.value);
          }} />
        </div>
        <div>
          <span>API Key:</span>
          <input type="text" value={apiKey()} onChange={(e) => {
            setApiKey(e.target.value);
          }} />
        </div>
        <GeneralAdd setName={setName} />
      </div>
    </>
  )
}

export default GDriveAdd
