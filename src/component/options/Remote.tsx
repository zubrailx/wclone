import { For, Setter, createEffect } from "solid-js"
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

  createEffect(() => {
    if (remotes.length > 0 && props.remote === undefined) {
      props.setRemote(remotes[0]);
    }
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
