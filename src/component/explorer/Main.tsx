import { For, Setter, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../../api/base.js";
import { DriveRemote } from "../../remote/base.js";
import { Encryptor } from "../../cypher/base.js";
import { useDriveAPIContext } from "../provider/DriveAPI.jsx";
import { downloadFile } from "../../utils.js";
import ActionMenu, { Action, CMPosition } from "./ActionMenu.jsx";

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

  const [getCMSelFile, setCMSelFile] = createSignal<DriveFileMeta>();
  const [getActions, setActions] = createSignal<Action[]>([]);
  const [getCMPos, setCMPos] = createSignal<CMPosition>([0, 0], { equals: false });
  const [getCMVisible, setCMVisible] = createSignal<boolean>(false);

  createEffect(() => {
    const _ = getFiles();
    unselectAll();
  })

  createEffect(() => {
    if (getCMSelFile() === undefined) {
      setCMVisible(false);
    }
  })

  function unselectAll() {
    unselectCheckbox()
    unselectAction()
  }

  function unselectCheckbox() {
    setSelFiles([]);
  }

  function unselectAction() {
    setCMSelFile(undefined);
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

  async function apiList(remote: DriveRemote, pwd: DriveFileMeta[]) {
    return getRequiredApi(remote)
      .then(api => api.list(remote, pwd))
  }

  async function apiDownload(remote: DriveRemote, file: DriveFileMeta) {
    return getRequiredApi(remote)
      .then(api => api.download(remote, file))
  }

  async function apiRemove(remote: DriveRemote, file: DriveFileMeta) {
    return getRequiredApi(remote)
      .then(api => api.remove(remote, file))
  }


  function refreshOnClick() {
    const remote = props.remote;
    if (remote != null) {
      apiList(remote, props.pwd)
        .then(files => setFiles(files))
        .catch(e => alert(JSON.stringify(e)));
    }
  }

  function downloadSelectedOnClick() {
    const remote = props.remote;
    const selFiles = getSelFiles();
    if (remote != null) {
      unselectCheckbox();
      for (const file of selFiles) {
        apiDownload(remote, file)
          .then(file => downloadFile(file))
          .catch(e => console.error(e))
      }
    }
  }

  function removeSelectedOnClick() {
    const remote = props.remote;
    const selFiles = getSelFiles();
    if (remote != null) {
      unselectCheckbox();
      for (const file of selFiles) {
        apiRemove(remote, file)
          .catch(e => console.error(e))

      }
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

  function cdRoot() {
    props.setPwd([])
    refreshOnClick()
  }

  function cdNodeBack(node: DriveFileMeta) {
    return function() {
      const idx = props.pwd.indexOf(node);
      props.setPwd(pwd => pwd.slice(idx));
      refreshOnClick();
    }
  }

  function cdNodeFront(node: DriveFileMeta) {
    props.setPwd(pwd => [...pwd, node]);
    refreshOnClick();
  }

  function isChecked(file: DriveFileMeta) {
    return getSelFiles().includes(file);
  }

  function actionMenuOnContextMenu(file: DriveFileMeta) {
    return function(ev: MouseEvent) {
      ev.preventDefault();
      ev.stopPropagation();

      setCMSelFile(file);
      setCMVisible(true);
      setCMPos([ev.pageX + 1, ev.pageY + 1])
    }
  }

  enum ActionEnum {
    DOWNLOAD = 1,
    REMOVE = 2,
    CHANGE_DIRECTORY = 3
  }

  const allActions: { [key in ActionEnum]: Action } = {
    [ActionEnum.DOWNLOAD]: new Action("Download", function(file) {
      return function(_: Event) {
        unselectAction()
        if (props.remote) {
          apiDownload(props.remote, file)
            .then(file => downloadFile(file))
            .catch(e => JSON.stringify(e))
        }
      }
    }),
    [ActionEnum.REMOVE]: new Action("Remove", function(file) {
      return function(_: Event) {
        unselectAction()
        if (props.remote) {
          apiRemove(props.remote, file)
            .catch(e => JSON.stringify(e))
        }
      }
    }),
    [ActionEnum.CHANGE_DIRECTORY]: new Action("Change Directory", function(file) {
      return function(_: Event) {
        unselectAction()
        if (props.remote) {
          cdNodeFront(file);
        }
      }
    })
  };

  function getCMActions() {
    const file = getCMSelFile();
    if (file === undefined) {
      return []
    } else if (file.isFolder()) {
      return [
        allActions[ActionEnum.CHANGE_DIRECTORY]
      ]
    }
    return [
      allActions[ActionEnum.DOWNLOAD],
      allActions[ActionEnum.REMOVE],
    ]
  }

  return (
    <div>
      <h2>Explorer</h2>
      <div>
        <button onClick={refreshOnClick}>Refresh</button>
        <span>Working directory: </span>
        <span>
          <button onClick={cdRoot}>/</button>
          <For each={props.pwd}>{(node, _) =>
            <button onClick={cdNodeBack(node)}>{node.getName()}</button>
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
          <div class="row body" onContextMenu={actionMenuOnContextMenu(file)}>
            <div class="cell body">
              <input type="checkbox" onChange={tableRowOnChange(file)} checked={isChecked(file)}></input>
            </div>
            <For each={columnValues(file)}>{(value, _) =>
              <div class="cell body">{value}</div>
            }</For>
          </div>
        }</For>
      </div>
      <ActionMenu actions={getCMActions()} selFile={getCMSelFile()!} visible={getCMVisible()} position={getCMPos()} />
    </div>
  )
}

export default Main
