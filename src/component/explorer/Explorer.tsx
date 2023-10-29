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
  filesList: any[],
  filesSelected: number,
  filesSetSelected: Setter<number>,

  table: unknown,
  tableSetHeaderVisible: Setter<boolean>,
  tableFunctions: Setter<ExplorerFunctions>,

  CMVisible: boolean,
  CMSetVisible: Setter<boolean>,
  CMPosition: Position,
  CMSetPosition: Setter<Position>,
  CMElement: any,

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
    if (props.filesList) {
      props.filesSetSelected(FILE_NOT_SELECTED);
    }
  });

  createEffect(() => {
    props.tableSetHeaderVisible(props.filesList.length > 0)
  })

  // Context Menu
  function onRowClick(file: any) {
    return function(e: MouseEvent) {
      // TODO: reformat to position context menu properly
      let x = e.pageX;
      let y = e.pageY;
      props.CMSetPosition({ x: x, y: y });
      if (props.filesSelected == FILE_NOT_SELECTED) {
        window.addEventListener('contextmenu', unselectForContextMenu);
        window.addEventListener('click', unselectForClick);
      }
      const selFile = props.filesList.indexOf(file);
      props.filesSetSelected(selFile);
    }
  }

  createEffect(() => {
    if (props.filesSelected == FILE_NOT_SELECTED) {
      window.removeEventListener('contextmenu', unselectForContextMenu);
      window.removeEventListener('click', unselectForClick);
    }
    props.log('selected file =', props.filesSelected);
  })

  function unselectForClick(ev: MouseEvent) {
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == props.CMElement) {
        return;
      }
    }
    props.filesSetSelected(FILE_NOT_SELECTED);
  }

  function unselectForContextMenu(ev: MouseEvent) {
    ev.preventDefault();
    const x = ev.clientX;
    const y = ev.clientY;
    const elementsUnder = document.elementsFromPoint(x, y);
    for (const elem of elementsUnder) {
      if (elem == props.table || elem == props.CMElement) {
        return;
      }
    }
    props.filesSetSelected(FILE_NOT_SELECTED);
  }

  createEffect(() => {
    if (props.filesSelected == FILE_NOT_SELECTED) {
      props.CMSetVisible(false);
    } else {
      props.CMSetVisible(true);
    }
  })

  return (<>{...props.children}</>)
}

export default Explorer

export { FILE_NOT_SELECTED }
export type { Position, ExplorerFunctions }
