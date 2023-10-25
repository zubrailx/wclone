import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { DriveFileInfo } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";
import RemoteContextMenu from "./RemoteContextMenu.jsx";

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

  let table: HTMLDivElement | undefined;

  onCleanup(() => {
    window.removeEventListener('contextmenu', unselectForContextMenu);
    window.removeEventListener('click', unselectForClick);
  });

  // Files
  // setSelectedFile to not selected when files change
  createEffect(() => {
    if (files()) {
      setSelFile(NOT_SELECTED);
    }
  });

  createEffect(() => {
    if (ctx.isLogged() == false) {
      changeFiles((_) => []);
    }
  });

  function onRowClick(i: number) {
    return function(e: MouseEvent) {
      setCMPosition(() => {
        return {
          x: e.clientX,
          y: e.clientY
        };
      })
      if (selFile() == NOT_SELECTED) {
        window.addEventListener('contextmenu', unselectForContextMenu);
        window.addEventListener('click', unselectForClick);
      }
      setSelFile(i);
    }
  }

  async function handleListClick() {
    changeFiles(await ctx.ls(10, query()));
  }

  // Context Menu
  createEffect(() => {
    if (selFile() == NOT_SELECTED) {
      window.removeEventListener('contextmenu', unselectForContextMenu);
      window.removeEventListener('click', unselectForClick);
    }
    log('selected file =', selFile());
  });

  function unselectForClick(ev: MouseEvent) {
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == contextMenu()) {
        return;
      }
    }
    setSelFile(NOT_SELECTED);
  }

  function unselectForContextMenu(ev: MouseEvent) {
    ev.preventDefault();
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == table || elem == contextMenu()) {
        return;
      }
    }
    setSelFile(NOT_SELECTED);
  }

  return (
    <div class='remotefile'>
      <button onClick={handleListClick}>List remote files</button>
      <div ref={table} class='table'>
        <For each={files()}>{(file, i) =>
          <tr onContextMenu={onRowClick(i())} class='row'>
            <td class='cell'>{file.getName()}</td>
            <td class='cell'>{file.getSize()}</td>
            <td class='cell'>{file.getCreatedTime().toLocaleString()}</td>
            <td class='cell'>{file.getMimeType().toLocaleString()}</td>
          </tr>
        }</For>
      </div>
      <RemoteContextMenu setRef={setContextMenu} selFile={selFile()} CMPosition={CMPosition()} />
    </div>
  );
}

export default RemoteExplorer
