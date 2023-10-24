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

  onMount(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleMouseClick);
  })

  onCleanup(() => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('click', handleMouseClick);
  })

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    var pe = document.elementsFromPoint(e.clientX, e.clientY);
    console.log(pe);
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

  return (
    <>
      <div class='localfile'>
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
        <div class='element'>
          <span>Upload</span>
        </div>
        <div class='element'>
          <span>Download</span>
        </div>
        <div class='element'>
          <span>Remove</span>
        </div>
        <div class='element'>
          <span>Encrypt</span>
        </div>
        <div class='element'>
          <span>Decrypt</span>
        </div>
      </div>
    </>
  )
}

export default LocalExplorer
