import { BigNumber } from 'ethers'
import { Input } from 'components/reusable/Input'
import { useContext, useState } from 'react'
import { listenToContractEvent } from 'components/reusable/useEventHandler'
import { CrowdfundingContext } from 'components/reusable/CrowdfundingContext'

export const ClaimButton = () => {
  const { contract, provider, setIsLoading } = useContext(CrowdfundingContext)
  const [chosenCampaignId, setChosenCampaignId] = useState<number | null>(null)

  const claim = async () => {
    if (!provider || !contract || !chosenCampaignId) return
    try {
      setIsLoading(true)
      listenToContractEvent(provider, contract, 'Claim')
      await contract.claim(BigNumber.from(chosenCampaignId))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h3>Claim</h3>
      <Input type="number" onChangeCallback={setChosenCampaignId} label="Campaign's ID" />
      <button onClick={claim}>Claim</button>
    </div>
  )
}
