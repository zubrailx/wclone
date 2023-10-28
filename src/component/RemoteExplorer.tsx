import { For, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../api/base.js";
import { useApiContext } from "./DriveProvider.jsx";
import RemoteContextMenu, { RFileCap } from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";
import { DriveRemote } from "../remote/base.js";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

type Props = {
  curRemote: DriveRemote | undefined,
}

function RemoteExplorer(props: Props) {
  const [_, { getRequiredApi }] = useApiContext();

  const [files, setFiles] = createSignal<DriveFileMeta[]>([]);
  const [selFile, setSelFile] = createSignal(FILE_NOT_SELECTED);

  const [query, changeQuery] = createSignal("parents in 'root'");

  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [CMVisible, setCMVisible] = createSignal<boolean>(false);
  const [contextMenu, setContextMenu] = createSignal();

  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);

  const [capabilities, setCapabilities] = createSignal<RFileCap[]>([]);

  let table: HTMLDivElement | undefined;

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
          return api.ls(props.curRemote!, 10, query())
        })
        .then(res => {
          setFiles(res);
        })
    }
  }

  const fn = {
    downloadFileOnClick: () => { },
    removeFileOnClick: () => { },
    changeDirectoryOnClick: () => { },
  }

  return (
    <Explorer filesList={files()} filesSelected={selFile()} filesSetSelected={setSelFile}
      table={table} tableFunctions={setExplorerFunctions} tableSetHeaderVisible={setHeaderVisible}
      CMVisible={CMVisible()} CMSetVisible={setCMVisible} CMPosition={CMPosition()}
      CMSetPosition={setCMPosition} CMElement={contextMenu()} log={log}>

      <div class='remotefile'>
        <h3>Remote explorer</h3>
        <button onClick={handleListClick}>List remote files</button>
        <Table ref={table}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Created Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={files()}>{(file, i) =>
            <TableRow onContextMenu={explorerFunctions().onRowClick(file)}>
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
