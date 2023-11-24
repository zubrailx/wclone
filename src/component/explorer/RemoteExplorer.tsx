import { For, Setter, Show, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../../api/base.js";
import { useDriveAPIContext } from "./../provider/DriveAPI.jsx";
import RemoteContextMenu, { RFileCap } from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableBodyRow, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";
import { DriveRemote } from "../../remote/base.js";
import { LocalFileEncryptor } from "../../cypher/base.js";
import { EncryptableLocalFile } from "../../localfile.js";
import { clone } from "../../utils.js";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

type Props = {
  curRemote: DriveRemote | undefined,
  cypher: LocalFileEncryptor,
  pwd: DriveFileMeta[],
  setPwd: Setter<DriveFileMeta[]>,
  setLocal: Setter<EncryptableLocalFile[]>,
  isAutoEncr: boolean,
}

function RemoteExplorer(props: Props) {
  const [_, { getRequiredApi }] = useDriveAPIContext();

  const [files, setFiles] = createSignal<DriveFileMeta[]>([]);
  const [selFile, setSelFile] = createSignal<DriveFileMeta | null>(null);

  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [CMVisible, setCMVisible] = createSignal<boolean>(false);
  const [contextMenu, setContextMenu] = createSignal();

  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({} as ExplorerFunctions);
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);
  const [table, setTable] = createSignal();

  const [capabilities, setCapabilities] = createSignal<RFileCap[]>([]);

  // Files
  createEffect(() => { // on remote change
    if (props.curRemote !== undefined) {
      setFiles([]);
      props.setPwd([]);
    }
  })

  function hasParent() {
    return props.pwd.length > 0;
  }

  function getParent() {
    const parentFile = clone(props.pwd[props.pwd.length - 1]);
    parentFile.setName("..");
    return parentFile;
  }

  function listFilesOnClick() {
    if (props.curRemote !== undefined) {
      getRequiredApi(props.curRemote)
        .then(api => {
          return api.list(props.curRemote!, props.pwd);
        })
        .then(res => {
          console.log(res);
          if (hasParent()) {
            setFiles([getParent(), ...res]); // process parent directory
          } else {
            setFiles(res);
          }
        }).catch((e) => {
          alert(JSON.stringify(e));
        })
    }
  }

  async function processAutoEncryption(file: EncryptableLocalFile) {
    if (props.isAutoEncr) {
      return props.cypher.decryptFile(file);
    }
    return file;
  }

  function downloadFileOnClick() {
    const file = selFile();
    if (props.curRemote !== undefined && file != null) {
      getRequiredApi(props.curRemote)
        .then(api => {
          return api.download(props.curRemote!, file);
        })
        .then(file => processAutoEncryption(file))
        .then((r) => {
          props.setLocal((files) => [...files, r])
          console.log(r);
        }).catch((e) => {
          alert(JSON.stringify(e));
        })
    }
    setCMVisible(false);
  }

  function removeFileOnClick() {
    const file = selFile();
    if (props.curRemote !== undefined && file != null) {
      getRequiredApi(props.curRemote)
        .then(api => {
          api.remove(props.curRemote!, file);
        }).catch((e) => {
          alert(JSON.stringify(e));
        })
    }
    setCMVisible(false);
  }

  function changeDirectoryOnClick() {
    const file = selFile();
    if (props.curRemote !== undefined && file != null) {
      const toParent: boolean = props.pwd.length > 0
        && file.getId() == props.pwd[props.pwd.length - 1].getId();

      let newPwd: DriveFileMeta[];
      if (toParent) {
        newPwd = props.pwd.slice(0, props.pwd.length - 1);
      } else {
        newPwd = [...props.pwd, file];
      }
      props.setPwd(newPwd);
      listFilesOnClick();
    }
    setCMVisible(false);
  }

  const fn = {
    downloadFileOnClick: downloadFileOnClick,
    removeFileOnClick: removeFileOnClick,
    changeDirectoryOnClick: changeDirectoryOnClick
  }

  function getPwdString(pwd: DriveFileMeta[]) {
    let res = "/"
    for (const e of pwd) {
      res += e.getName() + "/"
    }
    return res;
  }

  function onRowContextMenu(callback: any, file: DriveFileMeta): (r: HTMLElement) => (e: MouseEvent) => any {
    return function(r: HTMLElement) {
      return function(e: Event) {
        if (file.isFolder()) {
          setCapabilities([RFileCap.CHANGE_DIRECTORY]);
        } else {
          setCapabilities([RFileCap.REMOVE, RFileCap.DOWNLOAD]);
        }
        return callback(file)(r)(e)
      }
    }
  }

  return (
    <Explorer filesList={files()} filesSelected={selFile()} filesSetSelected={setSelFile}
      table={table()} tableFunctions={setExplorerFunctions} tableSetHeaderVisible={setHeaderVisible}
      CMVisible={CMVisible()} CMSetVisible={setCMVisible} CMPosition={CMPosition()}
      CMSetPosition={setCMPosition} CMElement={contextMenu()} log={log}>

      <div class='remotefile'>
        <h3>Remote explorer</h3>
        <div>
          <button onClick={listFilesOnClick}>List remote</button>
          <span>Working directory: {getPwdString(props.pwd)}</span>
        </div>
        <Table setRef={setTable}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Created Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={files()}>{(file, _) =>
            <TableBodyRow onContextMenu={onRowContextMenu(explorerFunctions().onRowContextMenu, file)}>
              <TableCell>{file.getName()}</TableCell>
              <TableCell>{file.getSize()}</TableCell>
              <TableCell>{file.getCreatedTime().toLocaleString()}</TableCell>
              <TableCell>{file.getMimeType().toLocaleString()}</TableCell>
            </TableBodyRow>
          }</For>
        </Table>
        <RemoteContextMenu fn={fn} position={CMPosition()} visible={CMVisible()}
          setRef={setContextMenu} Ref={contextMenu()} capabilities={capabilities()} />
      </div>
    </Explorer>
  );
}

export default RemoteExplorer
