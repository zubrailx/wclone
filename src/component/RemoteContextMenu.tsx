import { createEffect, createSignal, onMount } from "solid-js";

const NOT_SELECTED = -1;

function RemoteContextMenu(props: { CMPosition: any, selFile: number, setRef: any }) {

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

  // create encrypt window
  function downloadFileOnClick() {
  }

  function removeFileOnClick() {
  }

  return (
    <div ref={root} class='contextmenu' style={{ visibility: CMVisible() ? 'visible' : 'hidden' }}>
      <div onClick={downloadFileOnClick} class='element'>
        <span>Download</span>
      </div>
      <div onClick={removeFileOnClick} class='element'>
        <span>Remove</span>
      </div>
    </div>
  )
}

export default RemoteContextMenu
