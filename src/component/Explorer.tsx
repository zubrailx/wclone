import { Setter, createEffect, onMount } from "solid-js";

const FILE_NOT_SELECTED = -1;

type Position = {
  x: number;
  y: number;
};

type ExplorerFunctions = {
  onRowClick: Function
}

type Props = {
  setCMPosition: Setter<Position>,
  files: any[],
  selFile: number,
  setSelFile: Setter<number>,
  contextMenu: unknown,
  table: unknown,
  setFunctions: Setter<ExplorerFunctions>,
  log: Function
};


function Explorer(props: Props) {

  onMount(() => {
    props.setFunctions({
      onRowClick: onRowClick
    })
  })

  // Files
  createEffect(() => {
    if (props.files) {
      props.setSelFile(FILE_NOT_SELECTED);
    }
  });

  function onRowClick(i: number) {
    return function(e: MouseEvent) {
      props.setCMPosition(() => {
        return {
          x: e.clientX,
          y: e.clientY
        };
      })
      if (props.selFile == FILE_NOT_SELECTED) {
        window.addEventListener('contextmenu', unselectForContextMenu);
        window.addEventListener('click', unselectForClick);
      }
      props.setSelFile(i);
    }
  }

  // Context Menu
  createEffect(() => {
    if (props.selFile == FILE_NOT_SELECTED) {
      window.removeEventListener('contextmenu', unselectForContextMenu);
      window.removeEventListener('click', unselectForClick);
    }
    props.log('selected file =', props.selFile);
  })

  function unselectForClick(ev: MouseEvent) {
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == props.contextMenu) {
        return;
      }
    }
    props.setSelFile(FILE_NOT_SELECTED);
  }

  function unselectForContextMenu(ev: MouseEvent) {
    ev.preventDefault();
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == props.table || elem == props.contextMenu) {
        return;
      }
    }
    props.setSelFile(FILE_NOT_SELECTED);
  }

  return (<></>)
}

export default Explorer

export { FILE_NOT_SELECTED }
export type { Position, ExplorerFunctions }
