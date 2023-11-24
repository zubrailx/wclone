import { createStore } from "solid-js/store";
import { createContext, useContext, createEffect } from "solid-js";
import { LocalFileEncryptor } from "../../cypher/base.js";
import { storageSetCyphersConfigured } from "../../localstorage/cypher.js"; 


const context = createContext();

type Props = {
  children?: any
}

type CypherContext = [
  LocalFileEncryptor[],
  {
    refresh: (curs: LocalFileEncryptor[]) => void,
    update: (prev: LocalFileEncryptor, cur: LocalFileEncryptor) => void,
  }
]

function CypherProvider(props: Props) {
  const [cyphers, setCyphers] = createStore<LocalFileEncryptor[]>([]);

  createEffect(() => {
    storageSetCyphersConfigured(cyphers);
  })

  function refresh(curs: LocalFileEncryptor[]) {
    setCyphers(curs);
  }

  function update(prev: LocalFileEncryptor, cur: LocalFileEncryptor) {
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
