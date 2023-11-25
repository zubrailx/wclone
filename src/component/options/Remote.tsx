import { For, Setter, createEffect, createSignal } from "solid-js"
import { DriveRemote } from "../../remote/base.js"
import { useRemoteContext } from "../provider/Remote.jsx";

type Props = {
  remote: DriveRemote | undefined,
  setRemote: Setter<DriveRemote | undefined>,
}

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

function SelectSection(props: Props) {
  const [remotes, { }] = useRemoteContext();
  const [getRemote, setRemote] = createSignal<DriveRemote>();

  createEffect(() => {
    let cur;
    const prev = getRemote();
    if (prev !== undefined) {
      cur = remotes.find(rem => prev.getName() === rem.getName());
    }
    if (cur === undefined && remotes.length > 0 && props.remote === undefined) {
      cur = remotes[0];
    }
    setRemote(cur);
  })

  createEffect(() => {
    props.setRemote(getRemote());
  })

  function findRemoteByValue(value: string) {
    return remotes.find((remote) => remote.getName() === value);
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findRemoteByValue(e.target.value)!;
    props.setRemote(entry);
  }

  return (
    <div>
      <h3>Remote</h3>
      <label>Existing remotes:</label>
      <select onChange={displaySelectedRemote} value={props.remote?.getName()}>
        <For each={remotes}>{(remote, _) =>
          <option value={remote.getName()}>{remote.getName()}</option>
        }</For>
      </select>
    </div>
  )
}

export default SelectSection
