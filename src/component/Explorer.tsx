import { Setter, createEffect, onCleanup, onMount } from "solid-js";

const FILE_NOT_SELECTED = -1;

type Position = {
  x: number;
  y: number;
};

type ExplorerFunctions = {
  onRowClick: Function
}

type Props = {
  files: any[],
  selFile: number,
  setSelFile: Setter<number>,

  table: unknown,
  setHeaderVisible: Setter<boolean>,
  tableFunctions: Setter<ExplorerFunctions>,

  CMVisible: boolean,
  setCMVisible: Setter<boolean>,
  CMPosition: Position,
  setCMPosition: Setter<Position>,
  contextMenu: any,

  log: Function,

  children?: any
};


// Explorer handler
function Explorer(props: Props) {

  onMount(() => {
    props.tableFunctions({
      onRowClick: onRowClick
    })
  })

  onCleanup(() => {
    // Context Menu
    window.removeEventListener('contextmenu', unselectForContextMenu);
    window.removeEventListener('click', unselectForClick);
  })

  // Files
  createEffect(() => {
    if (props.files) {
      props.setSelFile(FILE_NOT_SELECTED);
    }
  });

  createEffect(() => {
    props.setHeaderVisible(props.files.length > 0)
  })

  // Context Menu
  function onRowClick(file: any) {
    return function(e: MouseEvent) {
      props.setCMPosition({ x: e.clientX, y: e.clientY });
      if (props.selFile == FILE_NOT_SELECTED) {
        window.addEventListener('contextmenu', unselectForContextMenu);
        window.addEventListener('click', unselectForClick);
      }
      props.setSelFile(props.files.indexOf(file));
    }
  }

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

  createEffect(() => {
    if (props.selFile == FILE_NOT_SELECTED) {
      props.setCMVisible(false);
    } else {
      props.setCMVisible(true);
    }
  })

  return (<>{...props.children}</>)
}

export default Explorer

export { FILE_NOT_SELECTED }
export type { Position, ExplorerFunctions }
