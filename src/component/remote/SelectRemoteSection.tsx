import { For, Setter, createEffect, createSignal } from "solid-js"
import { DriveRemote } from "../../remote/base.js"
import { useApiContext } from "../DriveProvider.jsx";
import { SetStoreFunction } from "solid-js/store";
import { clone } from "../../utils.js";

type Props = {
  remotes: DriveRemote[],
  setRemotes: SetStoreFunction<DriveRemote[]>,
  setCurRemote: Setter<DriveRemote | undefined>,
}

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

function SelectRemoteSection(props: Props) {

  const [selRemote, setSelRemote] = createSignal<DriveRemote>();
  const [_, { getRequiredApi }] = useApiContext()

  createEffect(() => {
    if (props.remotes.length > 0 && selRemote() === undefined) {
      setSelRemote(props.remotes[0]);
    }
  })

  createEffect(() => {
    props.setCurRemote(selRemote());
  })

  function findRemoteByValue(value: string) {
    return props.remotes.find((remote) => remote.getName() === value);
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findRemoteByValue(e.target.value)!;
    setSelRemote(entry);
  }

  function findRemoteBySelected(remotes: DriveRemote[], remote: DriveRemote) {
    return remotes.find((rem) => rem.getName() == remote.getName());
  }

  async function refreshAccess() {
    const selRem = selRemote();
    if (selRem === undefined) {
      console.warn("remote is undefined");
      return;
    }
    const rem = clone(findRemoteBySelected(props.remotes, selRem))!;
    await getRequiredApi(rem)
      .then((api) => {
        api.access(rem, () => {
          updateRemote(rem);
          setSelRemote(rem);
        });
        return api;
      });
  }

  async function revokeAccess() {
    const selRem = selRemote();
    if (selRem === undefined) {
      console.warn("remote is undefined");
      return;
    }
    const rem = clone(findRemoteBySelected(props.remotes, selRem)!);
    getRequiredApi(rem)
      .then((api) => {
        api.revoke(rem);
        updateRemote(rem);
        setSelRemote(rem);
      })
  }

  async function deleteRemote() {
    await revokeAccess();
    const selRem = selRemote();
    if (selRem != undefined) {
      const rem = findRemoteBySelected(props.remotes, selRem!)!; // not cloning
      props.setRemotes(props.remotes.filter((r) => r != rem));
    }
    setSelRemote(undefined);
  }

  function updateRemote(rem: DriveRemote) {
    props.setRemotes(props.remotes.map(remote =>
      rem.getName() == remote.getName() ? rem : remote
    ));
  }

  return (
    <div>
      <h3>Select remote</h3>
      <label>Existing remotes:</label>
      <select onChange={displaySelectedRemote} value={selRemote()?.getName()}>
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
