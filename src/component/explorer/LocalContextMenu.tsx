import { Show, onMount } from "solid-js";
import ContextMenu from "./ContextMenu.jsx";
import { Position } from "./Explorer.jsx";

export enum LFileCap {
  UPLOAD = 1,
  DOWNLOAD = 2,
  REMOVE = 3,
  ENCRYPT = 4,
  DECRYPT = 5,
}

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
  capabilities: LFileCap[]
};

function LocalContextMenu(props: Props) {

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  function hasCapability(capability: LFileCap) {
    return props.capabilities.includes(capability);
  }

  return (
    <ContextMenu position={props.position} visible={props.visible} root={props.Ref}>
      <div ref={root} class='contextmenu' style={{ visibility: props.visible ? 'visible' : 'hidden' }}>
        <div>
          Local capabilities:
        </div>
        <Show when={hasCapability(LFileCap.UPLOAD)}>
          <div onClick={props.fn.uploadFileOnClick} class='element'>
            <span>Upload</span>
          </div>
        </Show>
        <Show when={hasCapability(LFileCap.DOWNLOAD)}>
          <div onClick={props.fn.downloadFileOnClick} class='element'>
            <span>Download</span>
          </div>
        </Show>
        <Show when={hasCapability(LFileCap.REMOVE)}>
          <div onClick={props.fn.removeFileOnClick} class='element'>
            <span>Remove</span>
          </div>
        </Show>
        <Show when={hasCapability(LFileCap.ENCRYPT)}>
          <div onClick={props.fn.encryptFileOnClick} class='element'>
            <span>Encrypt</span>
          </div>
        </Show>
        <Show when={hasCapability(LFileCap.DECRYPT)}>
          <div onClick={props.fn.decryptFileOnClick} class='element'>
            <span>Decrypt</span>
          </div>
        </Show>
      </div>
    </ContextMenu >
  )
}

export default LocalContextMenu
