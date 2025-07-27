import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './utils/i18n.ts';

import Providers from './utils/Providers.tsx'
createRoot(document.getElementById('root')!).render(
  <>
    <Providers>
      <App />
    </Providers>
  </>,
)
