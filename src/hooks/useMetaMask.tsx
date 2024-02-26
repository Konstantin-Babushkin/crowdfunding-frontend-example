import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback } from 'react'

import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { LOCAL_CHAIN } from 'blockchainInfo/chainConfig'

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}

type AccountsType = string[] | null

interface MetaMaskContextData {
  accounts: AccountsType
  hasProvider: boolean | null
  error: boolean
  errorMessage: string
  isConnecting: boolean
  connectMetaMask: () => void
  clearError: () => void
}

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData)

export const MetaMaskContextProvider = ({ children }: PropsWithChildren) => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => setErrorMessage('')

  const makeEthereumRequest = async (method: string, params?: unknown[]) => await window.ethereum?.request({
    method,
    params: params ? params : undefined,
  })

  const connectToChain = async () => {
    await makeEthereumRequest('wallet_addEthereumChain', [LOCAL_CHAIN])
    await makeEthereumRequest('wallet_switchEthereumChain', [{ chainId: LOCAL_CHAIN.chainId }])
  }

  const [accounts, setAccounts] = useState<string[]>([])

  const updateAccounts = useCallback(async (providedAccounts?: AccountsType) => {
    const _accounts = providedAccounts || await makeEthereumRequest('eth_accounts') as AccountsType

    if (!_accounts || _accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setAccounts([])
      return
    }

    await connectToChain()

    setAccounts(_accounts)
  }, [])

  // checks if MetaMask is installed. If it is, listen to MetaMask changes
  useEffect(() => {
    const _handleAccountsChanged = async () => {
      const accounts = await makeEthereumRequest('eth_requestAccounts') as AccountsType
      await updateAccounts(accounts)
      // here you can add custom handler for metamask account update
    }

    const _getProvider = async () => {
      setIsConnecting(true)
      try {
        const provider = await detectEthereumProvider({ silent: true })
        setHasProvider(Boolean(provider))

        if (!provider) return

        await updateAccounts()

        window.ethereum?.on('accountsChanged', _handleAccountsChanged)
      } finally {
        setIsConnecting(false)
      }
    }

    void _getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', _handleAccountsChanged)
    }
  }, [updateAccounts])

  const connectMetaMask = async () => {
    setIsConnecting(true)

    try {
      const accounts = await makeEthereumRequest('eth_requestAccounts') as AccountsType
      await updateAccounts(accounts)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <MetaMaskContext.Provider
      value={{
        accounts,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectMetaMask,
        clearError,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  )
}

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext)
  if (context === undefined)
    throw new Error('useMetaMask must be used within a "MetaMaskContextProvider"')

  return context
}
