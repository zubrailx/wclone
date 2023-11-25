import { For, Setter, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../../api/base.js";
import { DriveRemote } from "../../remote/base.js";
import { Encryptor } from "../../cypher/base.js";
import { useDriveAPIContext } from "../provider/DriveAPI.jsx";
import { downloadFile } from "../../utils.js";

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
  const [_, { getRequiredApi: getRequiredApi }] = useDriveAPIContext();

  const [getFiles, setFiles] = createSignal<DriveFileMeta[]>([], { equals: false });

  // selected files by checkbox
  const [getSelFiles, setSelFiles] = createSignal<DriveFileMeta[]>([],
    { equals: false });

  createEffect(() => {
    const _ = getFiles();
    unselectFiles();
  })

  function unselectFiles() {
    setSelFiles([]);
  }

  const columns = ["", "Name", "Size", "Created Time", "Mime Type"]
  function columnValues(meta: DriveFileMeta): string[] {
    return [
      meta.getName(),
      meta.getSize() == undefined ? "" : String(meta.getSize()),
      meta.getCreatedTime().toUTCString(),
      meta.getMimeType(),
    ]
  }

  function refreshOnClick() {
    const remote = props.remote;
    if (remote != null) {
      getRequiredApi(remote)
        .then(api => api.list(remote, props.pwd))
        .then(files => setFiles(files))
        .catch(e => alert(JSON.stringify(e)));
    }
  }

  function downloadSelectedOnClick() {
    const remote = props.remote;
    if (remote != null) {
      const selFiles = getSelFiles();
      unselectFiles();
      getRequiredApi(remote)
        .then(api => {
          for (const file of selFiles) {
            api.download(remote, file)
              .then(file => downloadFile(file))
              .catch(e => console.error(e))
          }
        })
    }
  }

  function removeSelectedOnClick() {
    const remote = props.remote;
    if (remote != null) {
      const selFiles = getSelFiles();
      unselectFiles();
      getRequiredApi(remote)
        .then(api => {
          for (const file of selFiles) {
            api.remove(remote, file)
              .catch(e => console.error(e))
          }
        })
    }
  }

  function tableRowOnChange(file: DriveFileMeta) {
    return function eventHandler(_: Event) {
      const idx = getSelFiles().indexOf(file);
      if (idx == -1) {
        setSelFiles((files) => [file, ...files]);
      } else {
        setSelFiles((files) => { files.splice(idx, 1); return files; });
      }
    }
  }

  function tableEmpty() {
    return getFiles().length == 0;
  }

  function cdRootOnClick() {
    props.setPwd([])
    refreshOnClick()
  }

  function cdNodeOnClick(node: DriveFileMeta) {
    return function() {
      const idx = props.pwd.indexOf(node);
      props.setPwd(pwd => pwd.slice(idx));
    }
  }

  function isChecked(file: DriveFileMeta) {
    return getSelFiles().includes(file);
  }

  return (
    <div>
      <h2>Explorer</h2>
      <div>
        <button onClick={refreshOnClick}>Refresh</button>
        <span>Working directory: </span>
        <span>
          <button onClick={cdRootOnClick}>/</button>
          <For each={props.pwd}>{(node, _) =>
            <button onClick={cdNodeOnClick(node)}>{node.getName()}</button>
          }</For>
        </span>
      </div>
      <div>
        <span>Selected: </span>
        <button onClick={downloadSelectedOnClick}>Download</button>
        <button onClick={removeSelectedOnClick}>Remove</button>
      </div>
      <div class="table">
        <div class="row head" style={{ display: tableEmpty() ? "none" : "" }}>
          <For each={columns}>{(column, _) =>
            <div class="cell head">{column} </div>
          }</For>
        </div>
        <For each={getFiles()}>{(file, _) =>
          <div class="row body">
            <div class="cell body">
              <input type="checkbox" onChange={tableRowOnChange(file)} checked={isChecked(file)}></input>
            </div>
            <For each={columnValues(file)}>{(value, _) =>
              <div class="cell body">{value}</div>
            }</For>
          </div>
        }</For>
      </div>
    </div>
  )
}

export default Main
