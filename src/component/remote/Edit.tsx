import { For, createEffect, createSignal } from "solid-js";
import { useRemoteContext } from "../provider/Remote.jsx";
import { DriveRemote } from "../../remote/base.js";
import { clone } from "../../utils.js";
import { useDriveAPIContext } from "../provider/DriveAPI.jsx";

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

type Props = {}


function Main(props: Props) {
  const [remotes, {update: updateRemote, delete: deleteRemote}] = useRemoteContext();
  const [getRemote, setRemote] = createSignal<DriveRemote>();
  const [_, {getRequiredApi: getRequiredApi}] = useDriveAPIContext();

  createEffect(() => {
    if (remotes.length > 0 && getRemote() === undefined) {
      setRemote(remotes[0]);
    }
  })

  function findRemoteByValue(value: string) {
    return remotes.find((remote) => remote.getName() === value);
  }

  function findRemoteBySelected(remotes: DriveRemote[], remote: DriveRemote) {
    return remotes.find((rem) => rem.getName() == remote.getName());
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findRemoteByValue(e.target.value)!;
    console.log("selected remote:", entry);
    setRemote(entry);
  }

  async function refreshAccessEvent() {
    const prev = getRemote();
    if (prev === undefined) {
      console.warn("remote is undefined");
      return;
    }
    const cur = clone(findRemoteBySelected(remotes, prev))!;
    await getRequiredApi(cur)
      .then((api) => {
        api.access(cur, () => {
          updateRemote(prev, cur);
          setRemote(cur);
        });
        return api;
      });
  }

  async function revokeAccessEvent() {
    const prev = getRemote();
    if (prev === undefined) {
      console.warn("remote is undefined");
      return;
    }
    const cur = clone(findRemoteBySelected(remotes, prev)!);
    getRequiredApi(cur)
      .then((api) => {
        api.revoke(cur);
        updateRemote(prev, cur);
        setRemote(cur);
      })
  }

  async function deleteRemoteEvent() {
    await revokeAccessEvent();
    const prev = getRemote();
    if (prev != undefined) {
      const rem = findRemoteBySelected(remotes, prev!)!;
      deleteRemote(rem);
    }
    setRemote(undefined);
  }

  return (
    <div>
      <h3>Edit remote</h3>
      <label>Existing remotes:</label>
      <select onChange={displaySelectedRemote} value={getRemote()?.getName()}>
        <For each={remotes}>{(remote, _) =>
          <option value={remote.getName()}>{remote.getName()}</option>
        }</For>
      </select>
      <div>
        <button onClick={refreshAccessEvent}>Refresh access</button>
        <button onClick={revokeAccessEvent}>Revoke access</button>
        <button onClick={deleteRemoteEvent}>Delete remote</button>
      </div>
    </div>
  )
}

export default Main
