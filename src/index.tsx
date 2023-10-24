import { render } from 'solid-js/web'

import './index.css'
import App from './component/App.jsx'

const root = document.getElementById('root')

if (root !== null) {
  render(() => <App />, root)
}
