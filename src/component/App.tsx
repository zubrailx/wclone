import './App.scss'

import BackendAuth from "./BackendAuth.jsx";
import { DriveProvider } from './DriveProvider.jsx';
import { GDriveCtx } from '../backend/gdrive.js';
import RemoteExplorer from './RemoteExplorer.jsx';
import LocalExplorer from './LocalExplorer.jsx';


function App() {
  return (
    <DriveProvider ctx={new GDriveCtx()} >
      <BackendAuth />
      <RemoteExplorer />
      <LocalExplorer />
    </DriveProvider>
  )
}

export default App
