import './App.scss'

import { createSignal } from 'solid-js';
import AddRemoteSection from './remote/AddRemoteSection.jsx';
import { DriveRemote } from '../remote/base.js';
import SelectRemoteSection from './remote/SelectRemoteSection.jsx';
import { ApiProvider } from './DriveProvider.jsx';


function App() {
  const [remotes, setRemotes] = createSignal<DriveRemote[]>([]);

  return (
    <>
      <ApiProvider>
        <AddRemoteSection setRemotes={setRemotes} />
        <SelectRemoteSection remotes={remotes()} setRemotes={setRemotes} />
      </ApiProvider>
    </>
  )
}

export default App
