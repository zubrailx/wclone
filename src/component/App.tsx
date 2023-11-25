import './App.scss'

import { DriveRemote } from '../remote/base.js';
import { createSignal } from 'solid-js';
import { Encryptor } from '../cypher/base.js';
import { DriveFileMeta } from '../api/base.js';

import { DriveAPIProvider } from './provider/DriveAPI.jsx';
import RemoteProvider from './provider/Remote.jsx';
import CypherProvider from './provider/Cypher.jsx';

import OptionSection from './options/Main.jsx'
import RemoteSection from './remote/Main.jsx'
import ExecutorSection from './executor/Main.jsx'
import ExplorerSection from './explorer/Main.jsx'

function App() {
  const [getRemote, setRemote] = createSignal<DriveRemote>();

  const [getCypher, setCypher] = createSignal<Encryptor>();

  const [getPwd, setPwd] = createSignal<DriveFileMeta[]>([], { equals: false });

  return (
    <>
      <DriveAPIProvider>
        <RemoteProvider>
          <CypherProvider>

            <RemoteSection />
            <OptionSection cypher={getCypher()} setCypher={setCypher} remote={getRemote()} setRemote={setRemote} />
            <ExplorerSection remote={getRemote()} cypher={getCypher()!} pwd={getPwd()} setPwd={setPwd} />
            <ExecutorSection remote={getRemote()} pwd={getPwd()} cypher={getCypher()!} />

          </CypherProvider>
        </RemoteProvider>
      </DriveAPIProvider>
    </>
  )
}

export default App
