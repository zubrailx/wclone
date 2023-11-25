import { Setter } from "solid-js"
import { AESEncryptor } from "../../../cypher/aes.js"
import { clone } from "../../../utils.js"

type Props = {
  value: AESEncryptor,
  setValue: Setter<AESEncryptor>
}

function AES(props: Props) {
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

export default AES
