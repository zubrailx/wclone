import './App.scss'

import AddRemoteSection from './remote/AddRemoteSection.jsx';
import { DriveRemote } from '../remote/base.js';
import SelectRemoteSection from './remote/SelectRemoteSection.jsx';
import { ApiProvider } from './DriveProvider.jsx';
import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import { storageGetRemotes, storageSetRemotes } from '../localstorage/remotes.js';

function App() {
  const [remotes, setRemotes] = createStore<DriveRemote[]>(storageGetRemotes());

  createEffect(() => {
    if (remotes) {
      storageSetRemotes(remotes);
    }
    console.log(remotes);
  })

  return (
    <>
      <ApiProvider>
        <AddRemoteSection setRemotes={setRemotes} />
        <SelectRemoteSection remotes={remotes} setRemotes={setRemotes} />
      </ApiProvider>
    </>
  )
}

export default App
