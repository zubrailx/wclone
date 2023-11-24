import { createStore } from "solid-js/store";
import { createContext, useContext, createEffect } from "solid-js";
import { DriveRemote } from "../../remote/base.js";
import { storageGetRemotes, storageSetRemotes } from "../../localstorage/remotes.js";


const context = createContext();

type Props = {
  children?: any
}

type RemoteContext = [
  DriveRemote[],
  {
    add: (cur: DriveRemote) => void,
    update: (prev: DriveRemote, cur: DriveRemote) => void,
    delete: (prev: DriveRemote) => void
  }
]

function RemoteProvider(props: Props) {
  const [remotes, setRemotes] = createStore<DriveRemote[]>(storageGetRemotes());

  createEffect(() => {
    storageSetRemotes(remotes);
  })

  function addRemote(cur: DriveRemote) {
    setRemotes([...remotes, cur]);
  }

  function updateRemote(prev: DriveRemote, cur: DriveRemote) {
    setRemotes(
      remotes.map(remote =>
        remote.getName() == prev.getName() ? cur : remote
      )
    )
  }

  function deleteRemote(prev: DriveRemote) {
    setRemotes(
      remotes.filter((r) => r != prev)
    )
  }

  const remoteContext: RemoteContext = [
    remotes,
    {
      add: addRemote,
      update: updateRemote,
      delete: deleteRemote,
    }
  ]

  return <context.Provider value={remoteContext} >
    {...props.children}
  </context.Provider>
}

function useRemoteContext(): RemoteContext {
  return useContext(context) as RemoteContext;
}

export default RemoteProvider
export { useRemoteContext }
export type { RemoteContext }
