import './App.scss'

import { DriveRemote } from '../remote/base.js';
import { createEffect, createSignal } from 'solid-js';
import { LocalFileEncryptor } from '../cypher/base.js';
import { EncryptableLocalFile } from '../localfile.js';
import { DriveFileMeta } from '../api/base.js';
import { storageGetAutoEncryption, storageSetAutoEncryption } from '../localstorage/cypher.js';

import { DriveAPIProvider } from './provider/DriveAPI.jsx';
import RemoteProvider from './provider/Remote.jsx';
import CypherProvider from './provider/Cypher.jsx';

import OptionSection from './options/Main.jsx'
import RemoteSection from './remote/Main.jsx'

function App() {
  const [getRemote, setRemote] = createSignal<DriveRemote>();
  const [getCypher, setCypher] = createSignal<LocalFileEncryptor>();

  const [files, setFiles] = createSignal<EncryptableLocalFile[]>([], { equals: false });
  const [pwd, setPwd] = createSignal<DriveFileMeta[]>([], { equals: false });
  const [getEncr, setEncr] = createSignal(storageGetAutoEncryption());

  createEffect(() => {
    storageSetAutoEncryption(getEncr());
  })

  return (
    <>
      <DriveAPIProvider>
        <RemoteProvider>
          <CypherProvider>

            <RemoteSection />
            <OptionSection cypher={getCypher()} setCypher={setCypher} remote={getRemote()} setRemote={setRemote} encr={getEncr()} setEncr={setEncr} />

          </CypherProvider>
        </RemoteProvider>
      </DriveAPIProvider>
    </>
  )
}

export default App
