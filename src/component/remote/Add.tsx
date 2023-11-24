import { For, Match, Setter, Switch } from "solid-js";
import { useRemoteContext } from "../provider/Remote.jsx";
import { DriveElem } from "./driveTypes.js";

type Props = {
  drives: DriveElem[],
  drive: DriveElem,
  setDrive: Setter<DriveElem>
}

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};


function Main(props: Props) {
  const [_, { add: addRemote }] = useRemoteContext();

  function findDriveByValue(value: string) {
    props.drives.find((e) => e[2].value === value);
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findDriveByValue(e.target.value);
    if (entry === undefined) {
      console.warn("drive entry is undefined")
      return;
    }
    props.setDrive(entry);
  }

  function createRemote() {
    const remote = props.drive[0]()!();
    addRemote(remote);
  }

  return (
    <div>
      <h3>Add</h3>
      <label>Drive backend:</label>
      <select onChange={displaySelectedRemote} value={props.drive[2].value} name="drive-backends">
        <For each={props.drives}>{(drive, _) =>
          <option value={drive[2].value}>{drive[2].text}</option>
        }</For>
      </select>
      <Switch>
        <For each={props.drives}>{(entry, _) =>
          <Match when={props.drive[2].value === entry[2].value}>
            {entry[2].jsx}
          </Match>
        }</For>
      </Switch>
      <button onClick={createRemote}>Create remote</button>
    </div>
  )
}

export default Main
