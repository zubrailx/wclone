import { onMount } from "solid-js";
import ContextMenu from "./ContextMenu.jsx";
import { Position } from "./Explorer.jsx";

type Props = {
  fn: {
    downloadFileOnClick: any,
    removeFileOnClick: any,
    encryptFileOnClick: any,
    decryptFileOnClick: any,
    uploadFileOnClick: any,
  },
  Ref: any,
  setRef: any,
  visible: boolean,
  position: Position,
};

function LocalContextMenu(props: Props) {

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  return (
    <ContextMenu position={props.position} visible={props.visible} root={props.Ref}>
      <div ref={root} class='contextmenu' style={{ visibility: props.visible ? 'visible' : 'hidden' }}>
        <div onClick={props.fn.uploadFileOnClick} class='element'>
          <span>Upload</span>
        </div>
        <div onClick={props.fn.downloadFileOnClick} class='element'>
          <span>Download</span>
        </div>
        <div onClick={props.fn.removeFileOnClick} class='element'>
          <span>Remove</span>
        </div>
        <div onClick={props.fn.encryptFileOnClick} class='element'>
          <span>Encrypt</span>
        </div>
        <div onClick={props.fn.decryptFileOnClick} class='element'>
          <span>Decrypt</span>
        </div>
      </div>
    </ContextMenu >
  )
}

export default LocalContextMenu
