import { Show, onMount } from "solid-js";
import { Position } from "./Explorer.jsx";
import ContextMenu from "./ContextMenu.jsx";

export enum RFileCap {
  DOWNLOAD = 1,
  REMOVE,
  CHANGE_DIRECTORY
}

type Props = {
  fn: {
    downloadFileOnClick: any,
    removeFileOnClick: any,
    changeDirectoryOnClick: any,
  },
  position: Position,
  visible: boolean,
  setRef: any,
  Ref: any,
  capabilities: RFileCap[]
};

function RemoteContextMenu(props: Props) {

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  function hasCapability(capability: RFileCap): boolean {
    return props.capabilities.includes(capability);
  }

  return (
    <ContextMenu position={props.position} visible={props.visible} root={props.Ref}>
      <div ref={root} class='contextmenu' style={{ visibility: props.visible ? 'visible' : 'hidden' }}>
        <div>
          Global capabilities:
        </div>
        <Show when={hasCapability(RFileCap.DOWNLOAD)}>
          <div onClick={props.fn.downloadFileOnClick} class='element'>
            <span>Download</span>
          </div>
        </Show>
        <Show when={hasCapability(RFileCap.REMOVE)}>
          <div onClick={props.fn.removeFileOnClick} class='element'>
            <span>Remove</span>
          </div>
        </Show>
        <Show when={hasCapability(RFileCap.CHANGE_DIRECTORY)}>
          <div onClick={props.fn.changeDirectoryOnClick} class='element'>
            <span>Change Directory</span>
          </div>
        </Show>
      </div>

    </ContextMenu>
  )
}

export default RemoteContextMenu
