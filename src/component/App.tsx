import './App.scss'

import FileExplorer from "./FileExplorer.jsx";
import BackendAuth from "./BackendAuth.jsx";
import { DriveProvider } from './DriveProvider.jsx';
import { GDriveCtx } from '../backend/gdrive.js';


function App() {
  return (
    <DriveProvider ctx={new GDriveCtx()} >
      <BackendAuth />
      <FileExplorer />
    </DriveProvider>
  )
}

export default App
