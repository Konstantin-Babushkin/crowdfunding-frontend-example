import { createContext } from 'react'
import { CrowdFund } from '../../../typechain-types'
import { providers } from 'ethers'

interface CrowdfundingContext {
  contract?: CrowdFund
  provider?: providers.Web3Provider
  isLoading: boolean
  setIsLoading: (newVal: boolean) => void
}

export const CrowdfundingContext = createContext({} as CrowdfundingContext)
