import { createEffect, createSignal, onCleanup } from "solid-js";
import { For } from "solid-js";
import { EncryptedLocalFile, fromFile } from "../file.js";
import LocalContextMenu from "./LocalContextMenu.jsx";
import { Algorithm } from "../cypher/base.js";

const NOT_SELECTED = -1;

function log(...msg: any) {
  return console.log('[LocalExplorer]:', ...msg)
}

function LocalExplorer() {
  const [files, setFiles] = createSignal<EncryptedLocalFile[]>([], { equals: false });
  const [selFile, setSelFile] = createSignal(NOT_SELECTED);
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = createSignal();

  let inputFile: HTMLInputElement | undefined;
  let table: HTMLDivElement | undefined;

  // setSelectedFile to not selected when files change
  createEffect(() => {
    if (files()) {
      setSelFile(NOT_SELECTED);
    }
  });

  createEffect(() => {
    if (selFile() == NOT_SELECTED) {
      window.removeEventListener('contextmenu', unselectIfClickedOutsidePrevent);
      window.removeEventListener('click', unselectIfClickedOutside);
    }
    log('selected file =', selFile());
  })

  onCleanup(() => {
    window.removeEventListener('contextmenu', unselectIfClickedOutsidePrevent);
    window.removeEventListener('click', unselectIfClickedOutside);
  })


  async function inputFileOnChange(event: any) {
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const newFile = new EncryptedLocalFile(await fromFile(file), Algorithm.NONE);
      setFiles((files) => {
        return [...files, newFile]
      });
    }
  }

  function onRowClick(i: number) {
    return function(e: MouseEvent) {
      setCMPosition(() => {
        return {
          x: e.clientX,
          y: e.clientY
        };
      })
      if (selFile() == NOT_SELECTED) {
        window.addEventListener('contextmenu', unselectIfClickedOutsidePrevent);
        window.addEventListener('click', unselectIfClickedOutside);
      }
      setSelFile(i);
    }
  }

  function unselectIfClickedOutside(ev: MouseEvent) {
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    console.log(contextMenu());
    for (const elem of elementsUnder) {
      if (elem == table || elem == contextMenu()) {
        return;
      }
    }
    setSelFile(NOT_SELECTED);
  }

  function unselectIfClickedOutsidePrevent(ev: MouseEvent) {
    ev.preventDefault();
    unselectIfClickedOutside(ev);
  }

  return (
    <>
      <div class='localfile'>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <div ref={table} class='table'>
          <For each={files()}>{(file, i) =>
            <tr onContextMenu={onRowClick(i())} class='row'>
              <td class='cell'>{file.getName()}</td>
              <td class='cell'>{file.getSize()}</td>
              <td class='cell'>{file.getModifiedTime().toLocaleString()}</td>
              <td class='cell'>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
        <LocalContextMenu setRef={setContextMenu} files={files()} setFiles={setFiles} selFile={selFile()} CMPosition={CMPosition()} />
      </div>
    </>
  )
}

export default LocalExplorer
