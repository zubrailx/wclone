import { For, Setter, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../../api/base.js";
import { useApiContext } from "./../DriveProvider.jsx";
import RemoteContextMenu, { RFileCap } from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";
import { DriveRemote } from "../../remote/base.js";
import { LocalFileEncryptor } from "../../cypher/base.js";
import { EncryptableLocalFile } from "../../localfile.js";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

type Props = {
  curRemote: DriveRemote | undefined,
  cypher: LocalFileEncryptor,
  setLocal: Setter<EncryptableLocalFile[]>
}

function RemoteExplorer(props: Props) {
  const [_, { getRequiredApi }] = useApiContext();

  const [files, setFiles] = createSignal<DriveFileMeta[]>([]);
  const [selFile, setSelFile] = createSignal(FILE_NOT_SELECTED);

  const [pwd, setPwd] = createSignal<DriveFileMeta[]>([], { equals: false });

  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [CMVisible, setCMVisible] = createSignal<boolean>(false);
  const [contextMenu, setContextMenu] = createSignal();

  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);
  const [table, setTable] = createSignal();

  const [capabilities, setCapabilities] = createSignal<RFileCap[]>([]);

  // Files
  createEffect(() => {
    if (props.curRemote !== undefined) {
      setFiles([]);
    }
  })

  async function handleListClick() {
    if (props.curRemote !== undefined) {
      getRequiredApi(props.curRemote)
        .then(api => {
          return api.list(props.curRemote!, pwd());
        })
        .then(res => {
          setFiles(res);
        })
    }
  }

  const fn = {
    downloadFileOnClick: () => {
      const file = files()[selFile()];
      if (props.curRemote !== undefined && file != null) {
        getRequiredApi(props.curRemote)
          .then(api => {
            return api.download(props.curRemote!, file);
          })
          .then((r) => {
            props.setLocal((files) => [...files, r])
            console.log(r);
          })
      }
      setCMVisible(false);
    },

    removeFileOnClick: () => {
      const file = files()[selFile()];
      if (props.curRemote !== undefined && file != null) {
        getRequiredApi(props.curRemote)
          .then(api => {
            api.remove(props.curRemote!, file);
          }).then((r) => {
            console.log(r);
          })
      }
      setCMVisible(false);
    },

    changeDirectoryOnClick: () => {
      const file = files()[selFile()];
      if (props.curRemote !== undefined && file != null) {
        getRequiredApi(props.curRemote)
          .then(api => {
            return api.list(props.curRemote!, [...pwd(), file]);
          })
          .then((r) => {
            setFiles(r);
            setPwd([...pwd(), file]);
          })
      }
      setCMVisible(false);
    },
  }

  function getPwdString(pwd: DriveFileMeta[]) {
    let res = "/"
    for (const e of pwd) {
      res += e.getName() + "/"
    }
    return res;
  }

  function onRowClick(callback: any, file: DriveFileMeta): (e: MouseEvent) => any {
    return function(e: Event) {
      if (file.isFolder()) {
        setCapabilities([RFileCap.CHANGE_DIRECTORY]);
      } else {
        setCapabilities([RFileCap.REMOVE, RFileCap.DOWNLOAD]);

      }
      return callback(file)(e)
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
          <button onClick={handleListClick}>List remote files</button>
          <span>Working directory: {getPwdString(pwd())}</span>
        </div>
        <Table setRef={setTable}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Created Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={files()}>{(file, _) =>
            <TableRow onContextMenu={onRowClick(explorerFunctions().onRowClick, file)}>
              <TableCell>{file.getName()}</TableCell>
              <TableCell>{file.getSize()}</TableCell>
              <TableCell>{file.getCreatedTime().toLocaleString()}</TableCell>
              <TableCell>{file.getMimeType().toLocaleString()}</TableCell>
            </TableRow>
          }</For>
        </Table>
        <RemoteContextMenu fn={fn} position={CMPosition()} visible={CMVisible()}
          setRef={setContextMenu} Ref={contextMenu()} capabilities={capabilities()} />
      </div>
    </Explorer>
  );
}

export default RemoteExplorer
