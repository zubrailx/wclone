import { Setter, createEffect, onCleanup, onMount } from "solid-js";

const FILE_NOT_SELECTED = -1;

type Position = {
  x: number;
  y: number;
};

type ExplorerFunctions = {
  onRowContextMenu: (file: any) => ((row: HTMLElement) => ((e: MouseEvent) => void))
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

const SELECTED_CLASS = "selected";


// Explorer handler
function Explorer(props: Props) {

  onMount(() => {
    props.tableFunctions({
      onRowContextMenu: onRowContextMenu
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

  const selectedRows: HTMLElement[] = []

  function unselectRows() {
    // remove selection
    for (const row of selectedRows) {
      row.classList.remove(SELECTED_CLASS);
    }
    while (selectedRows.length) {
      selectedRows.pop();
    }
  }

  // Context Menu
  function onRowContextMenu(file: any) {
    return function(row: HTMLElement) {
      return function(e: MouseEvent) {
        unselectRows();
        row.classList.add(SELECTED_CLASS);
        selectedRows.push(row);

        props.CMSetPosition({ x: e.pageX + 1, y: e.pageY + 1 });

        if (props.filesSelected == FILE_NOT_SELECTED) {
          e.stopPropagation();
          e.preventDefault();
          window.addEventListener('contextmenu', unselectForContextMenu);
          window.addEventListener('click', unselectForClick);
        }
        const selFile = props.filesList.indexOf(file);
        props.filesSetSelected(selFile);
      }
    }
  }


  createEffect(() => {
    if (props.filesSelected == FILE_NOT_SELECTED) {
      window.removeEventListener('contextmenu', unselectForContextMenu);
      window.removeEventListener('click', unselectForClick);
      unselectRows();
    }
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
      if (elem == props.CMElement || elem == props.table) {
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
