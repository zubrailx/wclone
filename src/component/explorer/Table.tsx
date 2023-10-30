import { Setter, createSignal, onMount } from "solid-js"

function Table(props: { setRef: Setter<any>, children: any }) {
  let ref: any;

  onMount(() => {
    props.setRef(ref);
  })

  return (
    <div ref={ref} class='table'>
      {...props.children}
    </div>
  )
}

type onContextMenu = (row: HTMLElement) => ((e: MouseEvent) => void);

type TableRowProps = {
  class?: string,
  children: any,
  style?: any,
  onContextMenu?: onContextMenu,
}

function TableRow(props: TableRowProps) {
  let [divRef, setDivRef] = createSignal<HTMLElement>();

  function onContextMenu(e: MouseEvent) {
    if (props.onContextMenu !== undefined) {
      return props.onContextMenu(divRef()!)(e)
    }
  }

  return (
    <div ref={setDivRef} class={"row" + (props.class == null ? "" : " " + props.class)} style={props.style} onContextMenu={onContextMenu} >
      {...props.children}
    </div >
  )
}

function TableCell(props: { class?: string, children: any }) {
  return (
    <div class={"cell" + (props.class == null ? "" : " " + props.class)}>
      {...props.children}
    </div>
  )
}

function TableHeadRow(props: { children: any, visible?: boolean }) {
  return (
    <TableRow class='head'
      style={{ display: props.visible === undefined || props.visible ? '' : 'none' }} >
      {...props.children}
    </TableRow>
  )
}

type TableBodyRowProps = {
  children: any,
  onContextMenu?: (row: HTMLElement) => ((e: MouseEvent) => void)
}

function TableBodyRow(props: TableBodyRowProps) {
  return (
    <TableRow class='body' onContextMenu={props.onContextMenu}>
      {...props.children}
    </TableRow>
  )
}

function TableHeadCell(props: { children: any }) {
  return (
    <TableCell class='head'>{...props.children}</TableCell>
  )
}

export { Table, TableRow, TableCell, TableHeadRow, TableHeadCell, TableBodyRow }
