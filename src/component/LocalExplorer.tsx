import { createSignal } from "solid-js";
import { For } from "solid-js";
import { EncryptableLocalFile, fromFile } from "../localfile.js";
import LocalContextMenu, { LFileCap } from "./LocalContextMenu.jsx";
import { Algorithm } from "../cypher/base.js";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";
import { AESFileEncryptor } from "../cypher/aes.js";
import { useDriveAPI } from "./DriveProvider.jsx";

function log(...msg: any) {
  return console.log('[LocalExplorer]:', ...msg)
}

function LocalExplorer() {
  const [api, _] = useDriveAPI();

  const [files, setFiles] = createSignal<EncryptableLocalFile[]>([], { equals: false });
  const [selFile, setSelFile] = createSignal(FILE_NOT_SELECTED);

  const [CMVisible, setCMVisible] = createSignal<boolean>(false);
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = createSignal()

  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({
    onRowClick: Function,
  });
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);

  const [capabilities, setCapabilities] = createSignal<LFileCap[]>([
    LFileCap.DECRYPT, LFileCap.ENCRYPT, LFileCap.REMOVE, LFileCap.DOWNLOAD, LFileCap.UPLOAD
  ]);

  let inputFile: HTMLInputElement | undefined;
  let table: HTMLDivElement | undefined;

  // Files
  async function inputFileOnChange(event: any) {
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const newFile = new EncryptableLocalFile(await fromFile(file), Algorithm.NONE);
      setFiles((files) => {
        return [...files, newFile]
      });
    }
  }

  function downloadFileOnClick() {
    const localFile = files()[selFile()];
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(localFile.toFile());
    downloadLink.setAttribute('download', '');
    downloadLink.style.visibility = 'none';
    downloadLink.style.position = 'absolute';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setCMVisible(false);
  }

  function removeFileOnClick() {
    setFiles((files) => {
      files.splice(selFile(), 1);
      return files
    });
  }

  // create encrypt window
  function encryptFileOnClick() {
    const aesEncryptor = new AESFileEncryptor("secret")
    const file = files()[selFile()];
    const encryptedFile = aesEncryptor.encryptFile(file);
    setFiles((files) => {
      files[selFile()] = encryptedFile;
      return files;
    })
  }

  function decryptFileOnClick() {
    const aesEncryptor = new AESFileEncryptor("secret")
    const file = files()[selFile()];
    const decrFile = aesEncryptor.decryptFile(file);
    setFiles((files) => {
      files[selFile()] = decrFile;
      return files;
    })
  }

  async function uploadFileOnClick() {
    api.upload(files()[selFile()]).then((r) => console.log(r))
    setCMVisible(false);
  }

  const fn = {
    downloadFileOnClick: downloadFileOnClick,
    removeFileOnClick: removeFileOnClick,
    encryptFileOnClick: encryptFileOnClick,
    decryptFileOnClick: decryptFileOnClick,
    uploadFileOnClick: uploadFileOnClick
  }

  return (
    <Explorer files={files()} selFile={selFile()} setSelFile={setSelFile}
      table={table} tableFunctions={setExplorerFunctions} setHeaderVisible={setHeaderVisible}
      CMVisible={CMVisible()} setCMVisible={setCMVisible} CMPosition={CMPosition()}
      setCMPosition={setCMPosition} contextMenu={contextMenu()} log={log}>

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
              <TableCell>{file.getMimeType().toString()}</TableCell>
            </TableRow>
          }</For>
        </Table>
        <LocalContextMenu fn={fn} visible={CMVisible()} position={CMPosition()}
          Ref={contextMenu()} setRef={setContextMenu} capabilities={capabilities()} />
      </div>
    </Explorer>
  )
}

export default LocalExplorer
