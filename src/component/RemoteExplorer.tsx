import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { DriveFileInfo } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";
import RemoteContextMenu from "./RemoteContextMenu.jsx";
import Explorer, { ExplorerFunctions } from "./Explorer.jsx";

const NOT_SELECTED = -1;

function log(...msg: any) {
  return console.log('[RemoteExplorer]:', ...msg)
}

function RemoteExplorer() {
  const [ctx, _] = useDriveCtx();
  const [selFile, setSelFile] = createSignal(NOT_SELECTED);
  const [files, changeFiles] = createSignal<DriveFileInfo[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");
  const [contextMenu, setContextMenu] = createSignal();
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });

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
    <>
      <Explorer setCMPosition={setCMPosition} files={files()} selFile={selFile()}
        setSelFile={setSelFile} contextMenu={contextMenu()} table={table}
        setFunctions={setExplorerFunctions} log={log}
      />
      <div class='remotefile'>
        <button onClick={handleListClick}>List remote files</button>
        <div ref={table} class='table'>
          <For each={files()}>{(file, i) =>
            <tr onContextMenu={explorerFunctions().onRowClick(i())} class='row'>
              <td class='cell'>{file.getName()}</td>
              <td class='cell'>{file.getSize()}</td>
              <td class='cell'>{file.getCreatedTime().toLocaleString()}</td>
              <td class='cell'>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
        <RemoteContextMenu setRef={setContextMenu} selFile={selFile()} CMPosition={CMPosition()} />
      </div>
    </>
  );
}

export default RemoteExplorer
