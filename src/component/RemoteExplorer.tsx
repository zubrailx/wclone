import { For, createEffect, createSignal } from "solid-js";
import { DriveFileMeta } from "../drive/base.js";
import { useDriveAPI } from "./DriveProvider.jsx";
import RemoteContextMenu, { RFileCap } from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

function RemoteExplorer() {
  const [api, _] = useDriveAPI();

  const [files, changeFiles] = createSignal<DriveFileMeta[]>([]);
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
    if (api.isLogged() == false) {
      changeFiles((_) => []);
    }
  });

  async function handleListClick() {
    changeFiles(await api.ls(10, query()));
  }

  const fn = {
    downloadFileOnClick: () => { },
    removeFileOnClick: () => { },
    changeDirectoryOnClick: () => { },
  }

  return (
    <Explorer files={files()} selFile={selFile()} setSelFile={setSelFile}
      table={table} tableFunctions={setExplorerFunctions} setHeaderVisible={setHeaderVisible}
      CMVisible={CMVisible()} setCMVisible={setCMVisible} CMPosition={CMPosition()}
      setCMPosition={setCMPosition} contextMenu={contextMenu()} log={log}>

      <div class='remotefile'>
        <button onClick={handleListClick}>List remote files</button>
        <Table ref={table}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Created Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={files()}>{(file, i) =>
            <TableRow onContextMenu={explorerFunctions().onRowClick(i())}>
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
