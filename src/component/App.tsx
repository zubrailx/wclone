import './App.scss'

import AddRemoteSection from './remote/AddRemoteSection.jsx';
import { DriveRemote } from '../remote/base.js';
import SelectRemoteSection from './remote/SelectRemoteSection.jsx';
import { ApiProvider } from './DriveProvider.jsx';
import { createStore } from 'solid-js/store';
import { createEffect, createSignal } from 'solid-js';
import { storageGetRemotes, storageSetRemotes } from '../localstorage/remotes.js';
import LocalExplorer from './explorer/LocalExplorer.jsx';
import RemoteExplorer from './explorer/RemoteExplorer.jsx';
import SelectCypherSection from './cypher/SelectCypherSection.jsx';

function App() {
  const [remotes, setRemotes] = createStore<DriveRemote[]>(storageGetRemotes());
  const [curRemote, setCurRemote] = createSignal<DriveRemote>();

  createEffect(() => {
    if (remotes) {
      storageSetRemotes(remotes);
    }
  })

  return (
    <>
      <ApiProvider>
        <AddRemoteSection setRemotes={setRemotes} />
        <SelectRemoteSection remotes={remotes} setRemotes={setRemotes} setCurRemote={setCurRemote} />
        <SelectCypherSection />
        <RemoteExplorer curRemote={curRemote()} />
        <LocalExplorer curRemote={curRemote()} />
      </ApiProvider>
    </>
  )
}

export default App
