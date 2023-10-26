import { onMount } from "solid-js";
import { Position } from "./Explorer.jsx";
import ContextMenu from "./ContextMenu.jsx";

type Props = {
  fn: {
    downloadFileOnClick: any,
    removeFileOnClick: any,
    changeDirectoryOnClick: any,
  },
  position: Position,
  visible: boolean,
  setRef: any,
  Ref: any
};

function RemoteContextMenu(props: Props) {

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  return (
    <ContextMenu position={props.position} visible={props.visible} root={props.Ref}>

      <div ref={root} class='contextmenu' style={{ visibility: props.visible ? 'visible' : 'hidden' }}>
        <div onClick={props.fn.downloadFileOnClick} class='element'>
          <span>Download</span>
        </div>
        <div onClick={props.fn.removeFileOnClick} class='element'>
          <span>Remove</span>
        </div>
        <div onClick={props.fn.changeDirectoryOnClick} class='element'>
          <span>Change Directory</span>
        </div>
      </div>

    </ContextMenu>
  )
}

export default RemoteContextMenu
