import { Setter, createEffect, createSignal } from "solid-js";
import { LocalFile } from "../file.js";

const NOT_SELECTED = -1;

function LocalContextMenu(props: { files: LocalFile[], setFiles: Setter<LocalFile[]>, selFile: number, CMPosition: any }) {

  const [CMVisible, setCMVisible] = createSignal(false);

  let contextMenu: HTMLDivElement | undefined;

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
  }

  function removeFileOnClick() {
    props.setFiles((files) => {
      files.splice(props.selFile, 1);
      return files
    });
  }

  function setContextMenuPosition(x: number, y: number) {
    contextMenu!.style.left = `${x}px`;
    contextMenu!.style.top = `${y}px`;
  }


  return (
    <>
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

export default LocalContextMenu
