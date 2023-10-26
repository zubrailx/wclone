import { Setter, createSignal, onMount } from "solid-js";
import { EncryptedLocalFile } from "../file.js";
import ContextMenu from "./ContextMenu.jsx";

type Props = { files: EncryptedLocalFile[], setFiles: Setter<EncryptedLocalFile[]>, selFile: number, CMPosition: any, setRef: any, Ref: any };

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
  }

  function decryptFileOnClick() {
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
