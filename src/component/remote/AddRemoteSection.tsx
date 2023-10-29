import { Accessor, For, JSXElement, Match, Setter, Switch, createSignal } from "solid-js";
import GDriveAdd from "./GDriveAdd.jsx";
import { CreateRemoteFN } from "./GeneralAdd.jsx";
import { DriveRemote } from "../../remote/base.js";

type Props = {
  setRemotes: Setter<DriveRemote[]>
}

class DriveEntry {
  value: string
  text: string
  jsx: JSXElement;

  constructor(v: string, t: string, j: JSXElement) {
    this.value = v;
    this.text = t;
    this.jsx = j;
  }
}

type CreateFN = CreateRemoteFN | undefined;
type DriveElem = [Accessor<CreateFN>, Setter<CreateFN>, DriveEntry];
type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

function setDriveArr() {
  const driveArr: DriveElem[] = []
  {
    const [val, change] = createSignal<CreateRemoteFN>();
    driveArr.push([val, change, new DriveEntry(
      "gdrive", "Google Drive API", <GDriveAdd setCreateRemote={change} />)]);
  }
  return driveArr;
}

function AddRemoteSection(props: Props) {
  const driveArr: DriveElem[] = setDriveArr();
  const [drive, setDrive] = createSignal<DriveElem>(driveArr[0]);

  function findDriveByValue(value: string) {
    driveArr.find((e) => e[2].value === value);
  }

  function displaySelectedRemote(e: SelectEvent) {
    const entry = findDriveByValue(e.target.value);
    if (entry === undefined) {
      console.warn("drive entry is undefined")
      return;
    }
    setDrive(entry);
  }

  function createRemote() {
    const remote = drive()[0]()!();
    props.setRemotes((remotes) => {
      return [...remotes, remote]
    })
  }

  return (
    <div>
      <h3>Add remote</h3>
      <label>Drive backend:</label>
      <select onChange={displaySelectedRemote} value={drive()[2].value} name="drive-backends">
        <For each={driveArr}>{(drive, _) =>
          <option value={drive[2].value}>{drive[2].text}</option>
        }</For>
      </select>
      <Switch>
        <For each={driveArr}>{(entry, _) =>
          <Match when={drive()[2].value === entry[2].value}>
            {entry[2].jsx}
          </Match>
        }</For>
      </Switch>
      <button onClick={createRemote}>Create remote</button>
    </div>
  )
}

export default AddRemoteSection
