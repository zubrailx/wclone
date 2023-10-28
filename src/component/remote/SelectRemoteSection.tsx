import { For, Setter, Switch, createEffect, createSignal } from "solid-js"
import { DriveRemote } from "../../remote/base.js"
import { useApiContext } from "../DriveProvider.jsx";

type Props = {
  remotes: DriveRemote[],
  setRemotes: Setter<DriveRemote[]>,
}

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

function SelectRemoteSection(props: Props) {

  const [remote, setRemote] = createSignal<DriveRemote>();
  const [_, { getRequiredApi }] = useApiContext()

  createEffect(() => {
    if (props.remotes.length > 0 && remote() === undefined) {
      setRemote(props.remotes[0]);
    }
  })

  function findRemoteByValue(value: string) {
    return props.remotes.find((remote) => remote.getName() === value);
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findRemoteByValue(e.target.value)!;
    setRemote(entry);
  }

  function refreshAccess() {
    const rem = remote();
    if (rem === undefined) {
      console.warn("remote is undefined");
      return;
    }
    getRequiredApi(rem)
      .then((api) => {
        api.access(rem);
        return api;
      });
  }

  function revokeAccess() {
    const rem = remote();
    if (rem === undefined) {
      console.warn("remote is undefined");
      return;
    }
    getRequiredApi(rem)
      .then((api) => {
        api.revoke(rem);
        setRemote(rem);
      })
  }

  function deleteRemote() {
    revokeAccess();
    if (remote() != undefined) {
      props.setRemotes((remotes) =>
        remotes.filter((r) => r.getName() !== remote()!.getName()));
      setRemote(undefined);
    }
  }

  return (
    <div>
      <h3>Select remote</h3>
      <label>Existing remotes:</label>
      <select onChange={displaySelectedRemote}>
        <For each={props.remotes}>{(remote, _) =>
          <option value={remote.getName()}>{remote.getName()}</option>
        }</For>
      </select>
      <div>
        <button onClick={refreshAccess}>Refresh access</button>
        <button onClick={revokeAccess}>Revoke access</button>
        <button onClick={deleteRemote}>Delete remote</button>
      </div>
    </div>
  )
}

export default SelectRemoteSection
