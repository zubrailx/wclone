import { For } from "solid-js"
import { DriveFileMeta } from "../../api/base.js"

type ActionFunc = (meta: DriveFileMeta) => (ev: Event) => void;

type CMPosition = [number, number];

class Action {
  name: string
  func: ActionFunc

  constructor(name: string, func: ActionFunc) {
    this.name = name;
    this.func = func;
  }
}

type Props = {
  actions: Action[],
  selFile: DriveFileMeta,
  visible: boolean,
  position: CMPosition
}

function ActionMenu(props: Props) {

  return (
    <div style={
      {
        visibility: props.visible ? 'visible' : 'hidden',
        left: `${props.position[0]}px`,
        top: `${props.position[1]}px`
      }
    } class="actionmenu">
      <div>
        <span>Action Menu</span>
      </div>
      <For each={props.actions}>{(action, _) =>
        <div class="element" onClick={action.func(props.selFile)}>
          <span>{action.name}</span>
        </div>
      }</For>
    </div>
  )
}

export default ActionMenu
export { Action }
export type { CMPosition }
