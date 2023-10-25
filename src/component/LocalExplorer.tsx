import { createSignal, onCleanup, onMount } from "solid-js";
import { For } from "solid-js";
import { LocalFile, fromFile } from "../file.js";
import { matchesClassNames } from "../utils.js";

const ATTR_FILE_IDX = 'data-idx';

function LocalExplorer() {
  const [files, setFiles] = createSignal<LocalFile[]>([], {equals: false});
  const [CMVisible, setCMVisible] = createSignal(false);

  let inputFile: HTMLInputElement | undefined;
  let divRows: HTMLDivElement | undefined;
  let contextMenu: HTMLDivElement | undefined;
  let root: HTMLDivElement | undefined;

  onMount(() => {
    root!.addEventListener('contextmenu', handleContextMenu);
    root!.addEventListener('click', handleMouseClick);
  })

  onCleanup(() => {
    root!.removeEventListener('contextmenu', handleContextMenu);
    root!.removeEventListener('click', handleMouseClick);
  })

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    if (matchesClassNames(elements, ['localfile', 'cell'])) {
      const rowElem = (elements[0].parentNode! as HTMLElement);
      if (rowElem === null) {
        return;
      }
      const attrDataIdx = rowElem.getAttribute(ATTR_FILE_IDX)
      if (attrDataIdx === null) {
        return;
      }
      closeContextMenu();
      openContextMenuForRow(Number(attrDataIdx), e);
    }
  }

  function handleMouseClick(e: MouseEvent) {
    const pe = document.elementsFromPoint(e.clientX, e.clientY);

    if (!matchesClassNames(pe, ['contextmenu', 'element'])) {
      closeContextMenu();
    }
  }

  async function inputFileOnChange(event: any) {
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const localFile = await fromFile(file);
      setFiles((files) => {
        return [...files, localFile]
      });
    }
  }

  function downloadFileOnClick() {
    const localFile = getLocalFileFromContextMenu();
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(localFile.toFile());
    downloadLink.setAttribute('download', '');
    downloadLink.style.visibility = 'none';
    downloadLink.style.position = 'absolute';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    closeContextMenu();
  }

  function removeFileOnClick() {
    const idx = getFileIdxFromContextMenu();
    setFiles((files) => { 
      files.splice(idx, 1); 
      return files 
    });
    closeContextMenu();
  }

  function getFileIdxFromContextMenu() {
    return Number(contextMenu!.getAttribute(ATTR_FILE_IDX));
  }

  function getLocalFileFromContextMenu() {
    return files()[getFileIdxFromContextMenu()];
  }

  function openContextMenuForRow(attrDataIdx: number, e: MouseEvent) {
    setCMVisible(true);
    const x = e.clientX;
    const y = e.clientY;
    contextMenu!.style.left = `${x}px`;
    contextMenu!.style.top = `${y}px`;
    contextMenu!.setAttribute('data-idx', String(attrDataIdx));
  }

  function closeContextMenu() {
    setCMVisible(false);
  }

  return (
    <>
      <div ref={root} class='localfile'>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <div ref={divRows} class='table'>
          <For each={files()}>{(file, i) =>
            <tr class='row' data-idx={i()}>
              <td class='cell'>{file.getName()}</td>
              <td class='cell'>{file.getSize()}</td>
              <td class='cell'>{file.getCreatedTime().toLocaleString()}</td>
              <td class='cell'>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
      </div>
      <div ref={contextMenu} class='contextmenu' style={{ visibility: CMVisible() ? 'visible' : 'hidden' }}>
        <div class='element'>
          <span>Upload</span>
        </div>
        <div onClick={downloadFileOnClick} class='element'>
          <span>Download</span>
        </div>
        <div onClick={removeFileOnClick} class='element'>
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
