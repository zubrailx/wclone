import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { DriveFile } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";
import { matchesClassNames } from "../utils.js";

function RemoteExplorer() {
  const [ctx, _] = useDriveCtx();
  const [files, changeFiles] = createSignal<DriveFile[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");
  const [CMVisible, setCMVisible] = createSignal(false);

  let contextMenu: any;
  let root: any;

  onMount(() => {
    root.addEventListener('contextmenu', handleContextMenu);
    root.addEventListener('click', handleMouseClick);
  })

  onCleanup(() => {
    root.removeEventListener('contextmenu', handleContextMenu);
    root.removeEventListener('click', handleMouseClick);
  })

  createEffect(() => {
    if (ctx.isLogged() == false) {
      changeFiles((_) => []);
    }
  });

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    var pe = document.elementsFromPoint(e.clientX, e.clientY);
    if (matchesClassNames(pe, ['cell'])) {
      const attrVal = pe[0].getAttribute('data-idx');
      if (attrVal !== null) {
        closeContextMenu();
        openContextMenuForRow(Number(attrVal), e);
      }
    }
  }

  function handleMouseClick(e: MouseEvent) {
    var pe = document.elementsFromPoint(e.clientX, e.clientY);

    if (!matchesClassNames(pe, ['contextmenu', 'element'])) {
      closeContextMenu();
    }
  }

  async function handleListClick() {
    changeFiles(await ctx.ls(10, query()));
  }

  function openContextMenuForRow(i: number, e: MouseEvent) {
    setCMVisible(true);
    const file = files()[i];
    const x = e.clientX;
    const y = e.clientY;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
  }

  function closeContextMenu() {
    setCMVisible(false);
  }

  function hello() {
    setCMVisible(false);
  }

  return (
    <>
      <div ref={root} class='remotefile'>
        <button onClick={handleListClick}>List files</button>
        <div class='table'>
          <For each={files()}>{(file, i) =>
            <tr class='row'>
              <td class='cell' data-idx={i()}>{file.getName()}</td>
              <td class='cell' data-idx={i()}>{file.getSize()}</td>
              <td class='cell' data-idx={i()}>{file.getCreatedTime().toLocaleString()}</td>
              <td class='cell' data-idx={i()}>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
        <div ref={contextMenu} class='contextmenu' style={{ visibility: CMVisible() ? 'visible' : 'hidden' }}>
          <div onClick={hello} class='element'>
            <span>Upload</span>
          </div>
          <div onClick={hello} class='element'>
            <span>Download</span>
          </div>
          <div onClick={hello} class='element'>
            <span>Remove</span>
          </div>
          <div onClick={hello} class='element'>
            <span>Encrypt</span>
          </div>
          <div onClick={hello} class='element'>
            <span>Decrypt</span>
          </div>
        </div>
      </div>
    </>
  )

}

export default RemoteExplorer
