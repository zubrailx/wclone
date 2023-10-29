function Table(props: { ref?: any, children: any }) {
  return (
    <div ref={props.ref} class='table'>
      {...props.children}
    </div>
  )
}

function TableRow(props: { class?: string, children: any, style?: any, onContextMenu?: any }) {
  return (
    <div class='row' style={props.style} onContextMenu={props.onContextMenu}>
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

function TableHeadCell(props: { children: any }) {
  return (
    <TableCell class='head'>{...props.children}</TableCell>
  )
}

export { Table, TableRow, TableCell, TableHeadRow, TableHeadCell }
