import { createEffect, createSignal, JSXElement, Setter } from "solid-js"
import CypherSelectSection from "./Cypher.jsx"
import RemoteSelectSection from "./Remote.jsx"
import { CypherElem, CypherEntry } from "./Cypher.jsx"
import { storageGetCypherConfigured } from "../../localstorage/cypher.js"
import { NoneFileEncryptor } from "../../cypher/none.js"
import { AESFileEncryptor } from "../../cypher/aes.js"
import AESConfig from "./cypher/AES.jsx"
import { LocalFileEncryptor } from "../../cypher/base.js"
import { DriveRemote } from "../../remote/base.js"
import { useCypherContext } from "../provider/Cypher.jsx"


type Props = {
  cypher: LocalFileEncryptor | undefined,
  setCypher: Setter<LocalFileEncryptor | undefined>,
  remote: DriveRemote | undefined,
  setRemote: Setter<DriveRemote | undefined>,
  encr: boolean,
  setEncr: Setter<boolean>,
}

function setCyphers(): CypherElem[] {
  const cypherEncrytors: [LocalFileEncryptor, string, (props: any) => JSXElement][] = [
    [new NoneFileEncryptor(), "None", () => <div></div>],
    [new AESFileEncryptor("secret"), "AES Passphrase(256)", AESConfig],
  ]

  return cypherEncrytors.map((encryptor) => {
    const [val, change] = createSignal(storageGetCypherConfigured(encryptor[0]));
    return [val, change,
      new CypherEntry(encryptor[1], encryptor[2])]
  });
}

function Main(props: Props) {
  const [cyphers, { refresh: refreshCyphers, update: updateCyphers }] = useCypherContext();

  const cypherElems = setCyphers();
  const [getCypher, setCypher] = createSignal<CypherElem>(cypherElems[0]);

  if (cyphers.length != cypherElems.length) {
    refreshCyphers(cypherElems.map(cypher => cypher[0]()));
  }

  createEffect(() => {
    const cypherElem = getCypher();
    const idx = cypherElems.indexOf(cypherElem);
    const cypher = cypherElem[0]();
    updateCyphers(cyphers[idx], cypher);
    props.setCypher(cypher);
  })


  function checkAutoEncrOnChange() {
    props.setEncr((val) => !val);
  }

  return (
    <div>
      <h2>Options</h2>
      <div>
        <input type="checkbox" checked={props.encr} onChange={checkAutoEncrOnChange} />
        <span>
          Enable auto encryption
        </span>
      </div>
      <CypherSelectSection cyphers={cypherElems} cypher={getCypher()} setCypher={setCypher} />
      <RemoteSelectSection remote={props.remote} setRemote={props.setRemote} />
    </div>
  )
}

export default Main
export type { Props }
