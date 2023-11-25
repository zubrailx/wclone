import { For, JSXElement, Setter, Accessor } from "solid-js"
import { Encryptor } from "../../cypher/base.js"

class CypherEntry {
  text: string;
  jsx: (props: any) => JSXElement;

  constructor(t: string, j: (props: any) => JSXElement) {
    this.text = t;
    this.jsx = j;
  }
}

type CypherElem = [Accessor<Encryptor>, Setter<Encryptor>, CypherEntry];

type SelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: HTMLSelectElement;
};

type Props = {
  cyphers: CypherElem[],
  cypher: CypherElem,
  setCypher: Setter<CypherElem>
}

function SelectSection(props: Props) {

  function displaySelectedCypher(e: SelectEvent) {
    const entry = props.cyphers.find(cypher => cypher[2].text === e.target.value);
    if (entry === undefined) {
      console.warn("entry is undefined");
      return;
    }
    props.setCypher(entry);
  }

  return (
    <div>
      <h3>Cypher</h3>
      <label>Algorithm:</label>
      <select onChange={displaySelectedCypher}>
        <For each={props.cyphers}>{(entry, _) =>
          <option value={entry[2].text}>{entry[2].text}</option>
        }</For>
      </select>
      {props.cypher[2].jsx({ value: props.cypher[0](), setValue: props.cypher[1] })}
    </div>
  )
}

export default SelectSection
export { CypherEntry }
export type { CypherElem, Props }
