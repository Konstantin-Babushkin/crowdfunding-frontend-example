import { BigNumber } from 'ethers'
import { Input } from 'components/reusable/Input'
import { useContext, useState } from 'react'
import { MyToken } from '../../typechain-types'
import { listenToContractEvent } from 'components/reusable/useEventHandler'
import { CrowdfundingContext } from 'components/reusable/CrowdfundingContext'

interface Props {
  myToken?: MyToken
}

export const PledgeButton = ({ myToken }: Props) => {
  const { contract, provider, setIsLoading } = useContext(CrowdfundingContext)
  const [chosenCampaignId, setChosenCampaignId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)

  const pledge = async () => {
    if (!provider || !contract || !myToken || !chosenCampaignId || !amount) return

    try {
      setIsLoading(true)

      // before transferring user's tokens, we need to ask for approval
      await myToken.approve(contract.address, amount)
      listenToContractEvent(provider, contract, 'Pledge')
      await contract.pledge(BigNumber.from(chosenCampaignId), BigNumber.from(amount))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h3>Pledge</h3>
      <Input type="number" onChangeCallback={setChosenCampaignId} label="Campaign's ID" />
      <Input type="number" onChangeCallback={setAmount} label="Amount"/>
      <button onClick={pledge}>Pledge</button>
    </div>
  )
}
