import { Setter } from "solid-js";
import { DriveFileMeta } from "../../api/base.js";
import { DriveRemote } from "../../remote/base.js";
import { Encryptor } from "../../cypher/base.js";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

type Props = {
  remote: DriveRemote | undefined,
  cypher: Encryptor,
  pwd: DriveFileMeta[],
  setPwd: Setter<DriveFileMeta[]>,
}

function Main(props: Props) {
  return (
    <div>
      <h2>Explorer</h2>
    </div>
  )
}

export default Main
