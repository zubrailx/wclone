import './App.scss'

import BackendAuth from "./BackendAuth.jsx";
import { DriveProvider } from './DriveProvider.jsx';
import { GDriveAPI } from '../drive/gdrive.js';
import RemoteExplorer from './RemoteExplorer.jsx';
import LocalExplorer from './LocalExplorer.jsx';


function App() {
  return (
    <DriveProvider api={new GDriveAPI()} >
      <BackendAuth />
      <RemoteExplorer />
      <LocalExplorer />
    </DriveProvider>
  )
}

export default App
