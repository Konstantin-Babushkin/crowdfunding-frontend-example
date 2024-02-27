import { useMetaMask } from 'hooks/useMetaMask'
import { CrowdFund, CrowdFund__factory, MyToken, MyToken__factory } from '../../typechain-types'
import { CrowdFund as crowdFundAddress } from 'blockchainInfo/addresses.json'
import { MyToken as myTokenAddress } from 'blockchainInfo/addresses.json'
import { providers } from 'ethers'
import { LaunchButton } from 'components/LaunchButton'
import { useEffect, useState } from 'react'
import { Campaigns } from 'components/Campaigns'
import { PledgeButton } from 'components/PledgeButton'
import { ClaimButton } from 'components/ClaimButton'
import { CrowdfundingContext } from 'components/reusable/CrowdfundingContext'

export const CrowdFundingPage = () => {
  const { accounts, hasProvider, isConnecting, connectMetaMask } = useMetaMask()
  const [crowdFundContract, setCrowdFundContract] = useState<CrowdFund | undefined>()
  const [myToken, setMyToken] = useState<MyToken | undefined>()
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const noMetamask = !isConnecting && !hasProvider
  const notConnected = !isConnecting && window.ethereum?.isMetaMask && accounts && accounts.length < 1
  const isConnected = !!(!isConnecting && hasProvider && accounts && accounts.length > 0)

  const renderLink = () => {
    switch (true) {
    case noMetamask:
      return (
        <a href="https://metamask.io" target="_blank" rel="noreferrer">
          Install Metamask
        </a>
      )
    case notConnected:
      return (
        <button disabled={isConnecting} onClick={connectMetaMask}>
          Connect Metamask
        </button>
      )
    case isConnected:
      return <span>{accounts && accounts[0]}</span>
    default:
      return null
    }
  }

  const getContracts = async () => {
    const provider = new providers.Web3Provider(window.ethereum as unknown as providers.ExternalProvider, 'any')
    setProvider(provider)
    const signer = await provider?.getSigner()
    if (!signer) return {}
    // use Typechain-generated contract factory to instantiate contracts
    return { crowdFund: CrowdFund__factory.connect(crowdFundAddress, signer), myToken: MyToken__factory.connect(myTokenAddress, signer) }
  }

  useEffect(()=>{
    const startConnection = async () => {
      const { crowdFund, myToken } = await getContracts()
      setCrowdFundContract(crowdFund)
      setMyToken(myToken)
      setIsLoading(false)
    }

    void startConnection()
  } ,[])

  return (
    <main>
      <div>{renderLink()}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
        <CrowdfundingContext.Provider value={{ contract: crowdFundContract, provider, isLoading, setIsLoading } }>
          <Campaigns/>
          <div>{isLoading && 'Wait please...'}</div>
          <LaunchButton />
          <PledgeButton myToken={myToken} />
          <ClaimButton />
        </CrowdfundingContext.Provider>
      </div>
    </main>
  )
}
