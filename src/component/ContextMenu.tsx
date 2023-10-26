import { Setter, createEffect } from "solid-js";
import { FILE_NOT_SELECTED } from "./Explorer.jsx";

type Props = { selFile: number, CMPosition: any, setCMVisible: Setter<boolean>, CMVisible: boolean, root: any, children?: any };

// ContextMenu handler
function ContextMenu(props: Props) {

  createEffect(() => {
    if (props.selFile == FILE_NOT_SELECTED) {
      props.setCMVisible(false);
    } else {
      props.setCMVisible(true);
    }
  })

  createEffect(() => {
    if (props.CMVisible) {
      setContextMenuPosition(props.CMPosition.x, props.CMPosition.y);
    }
  })

  function setContextMenuPosition(x: number, y: number) {
    props.root!.style.left = `${x}px`;
    props.root!.style.top = `${y}px`;
  }

  return (<>{...props.children}</>)

}

export default ContextMenu
