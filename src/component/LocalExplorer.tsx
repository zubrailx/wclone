import { createEffect, createSignal, onCleanup } from "solid-js";
import { For } from "solid-js";
import { EncryptedLocalFile, fromFile } from "../file.js";
import LocalContextMenu from "./LocalContextMenu.jsx";
import { Algorithm } from "../cypher/base.js";
import Explorer, { ExplorerFunctions } from "./Explorer.jsx";

const NOT_SELECTED = -1;

function log(...msg: any) {
  return console.log('[LocalExplorer]:', ...msg)
}

function LocalExplorer() {
  const [files, setFiles] = createSignal<EncryptedLocalFile[]>([], { equals: false });
  const [selFile, setSelFile] = createSignal(NOT_SELECTED);
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = createSignal();
  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });

  let inputFile: HTMLInputElement | undefined;
  let table: HTMLDivElement | undefined;

  // Files
  async function inputFileOnChange(event: any) {
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const newFile = new EncryptedLocalFile(await fromFile(file), Algorithm.NONE);
      setFiles((files) => {
        return [...files, newFile]
      });
    }
  }

  return (
    <>
      <Explorer setCMPosition={setCMPosition} files={files()} selFile={selFile()}
        setSelFile={setSelFile} contextMenu={contextMenu()} table={table}
        setFunctions={setExplorerFunctions} log={log}
      />
      <div class='localfile'>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <div ref={table} class='table'>
          <For each={files()}>{(file, i) =>
            <tr onContextMenu={explorerFunctions().onRowClick(i())} class='row'>
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
