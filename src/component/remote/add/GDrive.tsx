import { Setter, createSignal, onMount } from "solid-js"
import General, { CreateRemoteFN } from "./General.jsx";
import { GDriveRemote } from "../../../remote/gdrive.js";

type Props = {
  setCreateRemote: Setter<CreateRemoteFN | undefined>
}

function GDrive(props: Props) {

  const [clientId, setClientId] = createSignal<string>("");
  const [apiKey, setApiKey] = createSignal<string>("");
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
        <General setName={setName} />
      </div>
    </>
  )
}

export default GDrive
