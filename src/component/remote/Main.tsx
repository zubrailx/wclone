import { createSignal } from "solid-js";
import RemoteAddSection from "./Add.jsx"
import RemoteEditSection from "./Edit.jsx"

import GDrive from "./drive/GDrive.jsx";
import { CreateRemoteFN, DriveElem, DriveEntry } from "./driveTypes.js";

function setDriveElems() {
  const driveElems: DriveElem[] = []
  {
    const [val, change] = createSignal<CreateRemoteFN>();
    driveElems.push([val, change, new DriveEntry(
      "gdrive", "Google Drive API", <GDrive setCreateRemote={change} />)]);
  }
  return driveElems;
}

type Props = {}

function Main() {
  const driveElems = setDriveElems();
  const [getDrive, setDrive] = createSignal<DriveElem>(driveElems[0]);

  return (
    <div>
      <h2>Remotes</h2>
      <RemoteAddSection drives={driveElems} drive={getDrive()} setDrive={setDrive} />
      <RemoteEditSection />
    </div>
  )
}

export default Main
export type { Props }
