import { Setter } from "solid-js"

type Props = {
  setName: Setter<string>
}

function Generic(props: Props) {

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

export default Generic
