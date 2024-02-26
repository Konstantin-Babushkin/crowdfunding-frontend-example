import React from 'react'
import { MetaMaskContextProvider } from 'hooks/useMetaMask'
import { MainPage } from 'pages/MainPage'

export const App = () => {
  return (
    <MetaMaskContextProvider>
      <MainPage/>
    </MetaMaskContextProvider>
  )
}
