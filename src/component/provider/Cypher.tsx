import { createStore } from "solid-js/store";
import { createContext, useContext, createEffect } from "solid-js";
import { Encryptor } from "../../cypher/base.js";
import { storageSetCyphersConfigured } from "../../localstorage/cypher.js"; 


const context = createContext();

type Props = {
  children?: any
}

type CypherContext = [
  Encryptor[],
  {
    refresh: (curs: Encryptor[]) => void,
    update: (prev: Encryptor, cur: Encryptor) => void,
  }
]

function CypherProvider(props: Props) {
  const [cyphers, setCyphers] = createStore<Encryptor[]>([]);

  createEffect(() => {
    storageSetCyphersConfigured(cyphers);
  })

  function refresh(curs: Encryptor[]) {
    setCyphers(curs);
  }

  function update(prev: Encryptor, cur: Encryptor) {
    setCyphers(
      cyphers.map(cypher =>
        cypher == prev ? cur : cypher
      )
    )
  }

  const cypherContext: CypherContext = [
    cyphers,
    {
      refresh: refresh,
      update: update
    }
  ]

  return <context.Provider value={cypherContext} >
    {...props.children}
  </context.Provider>
}

function useCypherContext(): CypherContext {
  return useContext(context) as CypherContext;
}

export default CypherProvider
export { useCypherContext }
export type { CypherContext }
