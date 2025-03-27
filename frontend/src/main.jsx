import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import store from './store/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "1017411108298-im20caml3866cc4pfdevoh6h674d4t70.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <Provider store={store}>
  <StrictMode>
    <App/>
    <Toaster />
  </StrictMode>
  </Provider>
  </GoogleOAuthProvider>,
)
