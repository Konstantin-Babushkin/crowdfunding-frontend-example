import { BigNumber, providers } from 'ethers'
import { toast } from 'react-toastify'
import { CrowdFund } from '../../../typechain-types'

export const listenToContractEvent = (provider: providers.Web3Provider, contract: CrowdFund, eventName: string) => {
  const genericEventHandler = (id: BigNumber, caller?: string, amount?: number, event?: Event) => {
    toast(
      `${eventName} event detected! 
      ${caller && typeof caller === 'string' ? `Caller: ${caller}` : ''}
      ${amount ? `passed data: ${amount}` : ''}`,
    )
    console.log(event)
  }

  const removeEventHandler = () => {
    provider.once('block', () => {
      contract.off(eventName, genericEventHandler)
    })
  }
  const setEventHandler = () => {
    removeEventHandler()

    // tricky moment: to avoid trigger on page reload, we add a listener for only a new block is detected
    provider.once('block', () => {
      contract.on(eventName, genericEventHandler)
    })
  }

  setEventHandler()
}
