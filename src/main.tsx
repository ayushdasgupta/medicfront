import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import {Toaster} from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <Toaster position='top-right' reverseOrder={false}/>
      <App />
    </Provider>
  </>,
)
