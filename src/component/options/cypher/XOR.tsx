import { Setter } from "solid-js"
import { clone } from "../../../utils.js"
import { XOREncryptor } from "../../../cypher/xor.js"

type Props = {
  value: XOREncryptor,
  setValue: Setter<XOREncryptor>
}

function XOR(props: Props) {
  return (
    <div>
      <label>Secret Key:</label>
      <input type="text" value={props.value.secretKey} onChange={(e) => {
        props.setValue((value) => {
          value.secretKey = e.target.value;
          return clone(value);
        });
      }} />
    </div>
  )
}

export default XOR
