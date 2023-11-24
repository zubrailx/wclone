import './App.scss'

import AddRemoteSection from './remote/AddRemoteSection.jsx';
import { DriveRemote } from '../remote/base.js';
import SelectRemoteSection from './remote/SelectRemoteSection.jsx';
import { ApiProvider } from './DriveProvider.jsx';
import { createStore } from 'solid-js/store';
import { createEffect, createSignal } from 'solid-js';
import { storageGetRemotes, storageSetRemotes } from '../localstorage/remotes.js';
import LocalExecutor from './explorer/LocalExecutor.jsx';
import RemoteExplorer from './explorer/RemoteExplorer.jsx';
import SelectCypherSection from './cypher/SelectCypherSection.jsx';
import { LocalFileEncryptor } from '../cypher/base.js';
import { DriveFileMeta } from '../api/base.js';
import { storageGetAutoEncryption, storageSetAutoEncryption } from '../localstorage/cypher.js';

function App() {
  const [remotes, setRemotes] = createStore<DriveRemote[]>(storageGetRemotes());
  const [curRemote, setCurRemote] = createSignal<DriveRemote>();
  const [cypher, setCypher] = createSignal<LocalFileEncryptor>({} as LocalFileEncryptor);
  const [pwd, setPwd] = createSignal<DriveFileMeta[]>([], { equals: false });
  const [isAutoEncr, setIsAutoEncr] = createSignal(storageGetAutoEncryption());

  createEffect(() => {
    if (remotes) {
      storageSetRemotes(remotes);
    }
  })

  createEffect(() => {
    storageSetAutoEncryption(isAutoEncr());
  })

  return (
    <>
      <ApiProvider>
        <AddRemoteSection setRemotes={setRemotes} />
        <SelectRemoteSection remotes={remotes} setRemotes={setRemotes} setCurRemote={setCurRemote} />
        <SelectCypherSection setCypher={setCypher} />
        <RemoteExplorer curRemote={curRemote()} cypher={cypher()}
          pwd={pwd()} setPwd={setPwd} isAutoEncr={isAutoEncr()} />
        <LocalExecutor curRemote={curRemote()} cypher={cypher()}
          pwd={pwd()} isAutoEncr={isAutoEncr()} setIsAutoEncr={setIsAutoEncr} />
      </ApiProvider>
    </>
  )
}

export default App
