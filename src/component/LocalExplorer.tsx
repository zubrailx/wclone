import { createEffect, createSignal } from "solid-js";
import { For } from "solid-js";
import { EncryptedLocalFile, fromFile } from "../file.js";
import LocalContextMenu from "./LocalContextMenu.jsx";
import { Algorithm } from "../cypher/base.js";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";

function log(...msg: any) {
  return console.log('[LocalExplorer]:', ...msg)
}

function LocalExplorer() {
  const [files, setFiles] = createSignal<EncryptedLocalFile[]>([], { equals: false });
  const [selFile, setSelFile] = createSignal(FILE_NOT_SELECTED);
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = createSignal();
  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);

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
    <Explorer setCMPosition={setCMPosition} files={files()} selFile={selFile()}
      setSelFile={setSelFile} contextMenu={contextMenu()} table={table}
      setFunctions={setExplorerFunctions} setHeaderVisible={setHeaderVisible} log={log}>

      <div class='localfile'>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <Table ref={table}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Algorithm</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Modified Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={files()}>{(file, i) =>
            <TableRow onContextMenu={explorerFunctions().onRowClick(i())}>
              <TableCell>{Algorithm[file.getEncryptAlgorithm()]}</TableCell>
              <TableCell>{file.getName()}</TableCell>
              <TableCell>{file.getSize()}</TableCell>
              <TableCell>{file.getModifiedTime().toLocaleString()}</TableCell>
              <TableCell>{file.getMimeType().toLocaleString()}</TableCell>
            </TableRow>
          }</For>
        </Table>
        <LocalContextMenu files={files()} setFiles={setFiles} selFile={selFile()}
          CMPosition={CMPosition()} setRef={setContextMenu} Ref={contextMenu()} />
      </div>
    </Explorer>
  )
}

export default LocalExplorer
