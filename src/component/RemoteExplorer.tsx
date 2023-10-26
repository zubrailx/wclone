import { For, createEffect, createSignal } from "solid-js";
import { DriveFileInfo } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";
import RemoteContextMenu from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

function RemoteExplorer() {
  const [ctx, _] = useDriveCtx();
  const [selFile, setSelFile] = createSignal(FILE_NOT_SELECTED);
  const [files, changeFiles] = createSignal<DriveFileInfo[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");
  const [contextMenu, setContextMenu] = createSignal();
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);

  let table: HTMLDivElement | undefined;

  // Files
  createEffect(() => {
    if (ctx.isLogged() == false) {
      changeFiles((_) => []);
    }
  });

  async function handleListClick() {
    changeFiles(await ctx.ls(10, query()));
  }

  return (
    <Explorer setCMPosition={setCMPosition} files={files()} selFile={selFile()}
      setSelFile={setSelFile} contextMenu={contextMenu()} table={table}
      setFunctions={setExplorerFunctions} setHeaderVisible={setHeaderVisible} log={log}>

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
        <RemoteContextMenu selFile={selFile()} CMPosition={CMPosition()}
          setRef={setContextMenu} Ref={contextMenu()} />
      </div>
    </Explorer>
  );
}

export default RemoteExplorer
