import { Setter, createSignal } from "solid-js";
import { For } from "solid-js";
import { EncryptableLocalFile, fromFile } from "../../localfile.js";
import LocalContextMenu, { LFileCap } from "./LocalContextMenu.jsx";
import { Algorithm, LocalFileEncryptor } from "../../cypher/base.js";
import Explorer, { ExplorerFunctions, FILE_NOT_SELECTED } from "./Explorer.jsx";
import { Table, TableBodyRow, TableCell, TableHeadCell, TableHeadRow, TableRow } from "./Table.jsx";
import { DriveRemote } from "../../remote/base.js";
import { useApiContext } from "./../DriveProvider.jsx";
import { DriveFileMeta } from "../../api/base.js";
import { clone } from "../../utils.js";

type Props = {
  curRemote: DriveRemote | undefined,
  cypher: LocalFileEncryptor,
  files: EncryptableLocalFile[],
  pwd: DriveFileMeta[],
  setFiles: Setter<EncryptableLocalFile[]>,
}

function log(...msg: any) {
  return console.log('[LocalExplorer]:', ...msg)
}

function LocalExplorer(props: Props) {
  const [_, { getRequiredApi }] = useApiContext();

  const [selFile, setSelFile] = createSignal<EncryptableLocalFile | null>(null);

  const [CMVisible, setCMVisible] = createSignal<boolean>(false);
  const [CMPosition, setCMPosition] = createSignal({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = createSignal()

  const [explorerFunctions, setExplorerFunctions] = createSignal<ExplorerFunctions>({} as ExplorerFunctions);
  const [headerVisible, setHeaderVisible] = createSignal<boolean>(false);
  const [table, setTable] = createSignal();

  const [capabilities, setCapabilities] = createSignal<LFileCap[]>([
    LFileCap.DECRYPT, LFileCap.ENCRYPT, LFileCap.REMOVE, LFileCap.DOWNLOAD, LFileCap.UPLOAD
  ]);

  let inputFile: HTMLInputElement | undefined;

  // Files
  async function inputFileOnChange(event: any) {
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const newFile = new EncryptableLocalFile(await fromFile(file), Algorithm.NONE_OR_UNK);
      props.setFiles((files) => {
        return [...files, newFile]
      });
    }
  }

  function downloadFileOnClick() {
    const localFile = selFile()!;
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
    props.setFiles((files) => {
      const  index = files.indexOf(selFile()!);
      if (index !== -1) {
        files.splice(index, 1);
      }
      return files
    });
  }

  async function encryptFileOnClick() {
    const file = selFile()!;
    props.cypher.encryptFile(file)
      .then((r) => {
        props.setFiles((files) => files.map((f) => f == file ? r : f));
      })
    setCMVisible(false);
  }

  async function decryptFileOnClick() {
    const file = selFile()!;
    props.cypher.decryptFile(file)
      .then((r) => {
        props.setFiles((files) => files.map((f) => f == file ? r : f));
      })
    setCMVisible(false);
  }

  async function uploadFileOnClick() {
    if (props.curRemote !== undefined) {
      const file = selFile()!;
      getRequiredApi(props.curRemote)
        .then(api => {
          return api.upload(props.curRemote!, props.pwd, file);
        }).then((res) => {
          console.log(res);
        }).catch((e) => {
          alert(JSON.stringify(e));
        })
    }
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
    <Explorer filesList={props.files} filesSelected={selFile()} filesSetSelected={setSelFile}
      table={table()} tableFunctions={setExplorerFunctions} tableSetHeaderVisible={setHeaderVisible}
      CMVisible={CMVisible()} CMSetVisible={setCMVisible} CMPosition={CMPosition()}
      CMSetPosition={setCMPosition} CMElement={contextMenu()} log={log}>

      <div class='localfile'>
        <h3>Local explorer</h3>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
        <Table setRef={setTable}>
          <TableHeadRow visible={headerVisible()}>
            <TableHeadCell>Algorithm</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Size</TableHeadCell>
            <TableHeadCell>Modified Time</TableHeadCell>
            <TableHeadCell>Mime Type</TableHeadCell>
          </TableHeadRow>
          <For each={props.files}>{(file, _) =>
            <TableBodyRow onContextMenu={explorerFunctions().onRowContextMenu(file)}>
              <TableCell>{Algorithm[file.getEncryptAlgorithm()]}</TableCell>
              <TableCell>{file.getName()}</TableCell>
              <TableCell>{file.getSize()}</TableCell>
              <TableCell>{file.getModifiedTime().toLocaleString()}</TableCell>
              <TableCell>{file.getMimeType().toString()}</TableCell>
            </TableBodyRow>
          }</For>
        </Table>
        <LocalContextMenu fn={fn} visible={CMVisible()} position={CMPosition()}
          Ref={contextMenu()} setRef={setContextMenu} capabilities={capabilities()} />
      </div>
    </Explorer>
  )
}

export default LocalExplorer
