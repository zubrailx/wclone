import { Setter, createEffect, createSignal, onMount } from "solid-js";
import { EncryptedLocalFile } from "../file.js";

const NOT_SELECTED = -1;

function LocalContextMenu(props: { files: EncryptedLocalFile[], setFiles: Setter<EncryptedLocalFile[]>, selFile: number, CMPosition: any, setRef: any }) {

  const [CMVisible, setCMVisible] = createSignal(false);
  let root: any

  onMount(() => {
    props.setRef(root);
  })

  createEffect(() => {
    if (props.selFile == NOT_SELECTED) {
      setCMVisible(false);
    } else {
      setCMVisible(true);
    }
  })

  createEffect(() => {
    if (CMVisible()) {
      setContextMenuPosition(props.CMPosition.x, props.CMPosition.y);
    }
  })

  function setContextMenuPosition(x: number, y: number) {
    root!.style.left = `${x}px`;
    root!.style.top = `${y}px`;
  }

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
  )
}

export default LocalContextMenu
