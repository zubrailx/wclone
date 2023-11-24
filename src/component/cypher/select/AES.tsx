import { Setter } from "solid-js"
import { AESFileEncryptor } from "../../../cypher/aes.js"
import { clone } from "../../../utils.js"

type Props = {
  value: AESFileEncryptor,
  setValue: Setter<AESFileEncryptor>
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
