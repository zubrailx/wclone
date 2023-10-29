import { Accessor, For, JSXElement, Setter, createEffect, createSignal } from "solid-js"
import { LocalFileEncryptor } from "../../cypher/base.js"
import { AESFileEncryptor } from "../../cypher/aes.js";
import AESConfig from "./AESConfig.jsx";
import { NoneFileEncryptor } from "../../cypher/none.js";
import { storageSetCyphersConfigured } from "../../localstorage/cypher.js";

type Props = {
  setCypher: Setter<LocalFileEncryptor>
}

class CypherEntry {
  text: string;
  jsx: (props: any) => JSXElement;

  constructor(t: string, j: (props: any) => JSXElement) {
    this.text = t;
    this.jsx = j;
  }
}

type CypherElem = [Accessor<LocalFileEncryptor>, Setter<LocalFileEncryptor>, CypherEntry];

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

function setCyphers(): CypherElem[] {
  const cypherEncrytors: [LocalFileEncryptor, string, (props: any) => JSXElement][] = [
    [new NoneFileEncryptor(), "None", () => <div></div>],
    [new AESFileEncryptor("secret"), "AES Passphrase(256)", AESConfig],
  ]

  return cypherEncrytors.map((encryptor) => {
    const [val, change] = createSignal(encryptor[0]);
    return [val, change,
      new CypherEntry(encryptor[1], encryptor[2])]
  });
}

function SelectCypherSection(props: Props) {
  const cyphers = setCyphers();
  const [cypher, setCypher] = createSignal<CypherElem>(cyphers[0]);

  createEffect(() => {
    props.setCypher(cypher()[0]());
  })

  createEffect(() => {
    storageSetCyphersConfigured(cyphers.map((cypher) => cypher[0]()));
  })

  function displaySelectedCypher(e: SelectEvent) {
    const entry = cyphers.find(cypher => cypher[2].text === e.target.value);
    if (entry === undefined) {
      console.warn("entry is undefined");
      return;
    }
    setCypher(entry);
  }

  return (
    <div>
      <h3>Select cypher</h3>
      <label>Algorithm:</label>
      <select onChange={displaySelectedCypher}>
        <For each={cyphers}>{(entry, _) =>
          <option value={entry[2].text}>{entry[2].text}</option>
        }</For>
      </select>
      {cypher()[2].jsx({ value: cypher()[0](), setValue: cypher()[1] })}
    </div>
  )
}

export default SelectCypherSection
