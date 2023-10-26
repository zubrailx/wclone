import { Setter, createSignal, onMount } from "solid-js";
import { EncryptableLocalFile } from "../file.js";
import ContextMenu from "./ContextMenu.jsx";
import { AESFileEncryptor } from "../cypher/aes.js";
import { Algorithm } from "../cypher/base.js";

type Props = { files: EncryptableLocalFile[], setFiles: Setter<EncryptableLocalFile[]>, selFile: number, CMPosition: any, setRef: any, Ref: any };

function LocalContextMenu(props: Props) {

  const [CMVisible, setCMVisible] = createSignal(false);

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  function downloadFileOnClick() {
    const localFile = props.files[props.selFile];
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
      files.splice(props.selFile, 1);
      return files
    });
  }

  // create encrypt window
  function encryptFileOnClick() {
    const aesEncryptor = new AESFileEncryptor("secret")
    const file = props.files[props.selFile];
    const encryptedFile = aesEncryptor.encryptFile(file);
    props.setFiles((files) => {
      files[props.selFile] = encryptedFile;
      return files;
    })
  }

  function decryptFileOnClick() {
    const aesEncryptor = new AESFileEncryptor("secret")
    const file = props.files[props.selFile];
    const decrFile = aesEncryptor.decryptFile(file);
    props.setFiles((files) => {
      files[props.selFile] = decrFile;
      return files;
    })
  }

  function uploadFileOnClick() {
  }

  return (
    <ContextMenu selFile={props.selFile} CMPosition={props.CMPosition}
      setCMVisible={setCMVisible} CMVisible={CMVisible()} root={props.Ref}>

      <div ref={root} class='contextmenu' style={{ visibility: CMVisible() ? 'visible' : 'hidden' }}>
        <div onClick={uploadFileOnClick} class='element'>
          <span>Upload</span>
        </div>
        <div onClick={downloadFileOnClick} class='element'>
          <span>Download</span>
        </div>
        <div onClick={removeFileOnClick} class='element'>
          <span>Remove</span>
        </div>
        <div onClick={encryptFileOnClick} class='element'>
          <span>Encrypt</span>
        </div>
        <div onClick={decryptFileOnClick} class='element'>
          <span>Decrypt</span>
        </div>
      </div>

    </ContextMenu>

  )
}

export default LocalContextMenu
