import { createSignal, onCleanup, onMount } from "solid-js";
import { For } from "solid-js";
import { LocalFile } from "../file.js";
import { matchesClassNames } from "../utils.js";

function LocalExplorer() {
  const [files, changeFiles] = createSignal<LocalFile[]>([]);
  const [CMVisible, setCMVisible] = createSignal(false);

  let inputFile: any;
  let divRows: any;
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

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    var pe = document.elementsFromPoint(e.clientX, e.clientY);
    if (matchesClassNames(pe, ['localfile', 'cell'])) {
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

  async function inputFileOnChange(event: any) {
    const tf: FileList = event.target.files;
    for (const file of tf) {
      const lf = new LocalFile(
        file.name, file.size, file.type, new Date(file.lastModified), await file.text()
      );
      changeFiles((files) => {
        return [...files, lf]
      });
    }
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
      <div ref={root} class='localfile'>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <div ref={divRows} class='table'>
          <For each={files()}>{(file, i) =>
            <tr class='row'>
              <td class='cell' data-idx={i()}>{file.getName()}</td>
              <td class='cell' data-idx={i()}>{file.getSize()}</td>
              <td class='cell' data-idx={i()}>{file.getCreatedTime().toLocaleString()}</td>
              <td class='cell' data-idx={i()}>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
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
    </>
  )
}

export default LocalExplorer