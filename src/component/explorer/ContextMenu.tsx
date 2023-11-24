import { createEffect } from "solid-js";

function ContextMenu(props: { position: any, visible: boolean, root: HTMLElement, children?: any }) {

  createEffect(() => {
    if (props.visible) {
      setContextMenuPosition(props.position.x, props.position.y);
    }
  })

  function setContextMenuPosition(x: number, y: number) {
    props.root!.style.left = `${x}px`;
    props.root!.style.top = `${y}px`;
  }

  return (<>{...props.children}</>)

}

export default ContextMenu
