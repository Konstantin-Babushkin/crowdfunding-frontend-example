import React from 'react'
import { MetaMaskContextProvider } from 'hooks/useMetaMask'
import { CrowdFundingPage } from 'pages/CrowdFundingPage'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export const App = () => {
  return (
    <MetaMaskContextProvider>
      <ToastContainer position="top-right" draggable={false} style={{ zIndex: 10000 }} />
      <CrowdFundingPage/>
    </MetaMaskContextProvider>
  )
}
