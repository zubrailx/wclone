import { createEffect, createSignal, onMount } from "solid-js";
import { FILE_NOT_SELECTED } from "./Explorer.jsx";
import ContextMenu from "./ContextMenu.jsx";

type Props = { CMPosition: any, selFile: number, setRef: any, Ref: any };

function RemoteContextMenu(props: Props) {

  const [CMVisible, setCMVisible] = createSignal(false);

  let root: any

  onMount(() => {
    props.setRef(root);
  })

  // create encrypt window
  function downloadFileOnClick() {
  }

  function removeFileOnClick() {
  }

  return (
    <ContextMenu selFile={props.selFile} CMPosition={props.CMPosition}
      setCMVisible={setCMVisible} CMVisible={CMVisible()} root={props.Ref}>

      <div ref={root} class='contextmenu' style={{ visibility: CMVisible() ? 'visible' : 'hidden' }}>
        <div onClick={downloadFileOnClick} class='element'>
          <span>Download</span>
        </div>
        <div onClick={removeFileOnClick} class='element'>
          <span>Remove</span>
        </div>
      </div>

    </ContextMenu>
  )
}

export default RemoteContextMenu
