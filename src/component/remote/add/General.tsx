import { Setter } from "solid-js"
import { DriveRemote } from "../../../remote/base.js";

type Props = {
  setName: Setter<string>
}

type CreateRemoteFN = () => DriveRemote;

function General(props: Props) {

  function remoteNameOnChange(e: any) {
    props.setName(e.target.value);
  }

  return (
    <>
      <div>
        <label>Remote name:</label>
        <input type="text" onChange={remoteNameOnChange} />
      </div>
    </>
  )
}

export default General
export type { CreateRemoteFN };
