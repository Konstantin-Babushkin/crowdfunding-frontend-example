import { BigNumber } from 'ethers'
import { Input } from 'components/reusable/Input'
import { useContext, useState } from 'react'
import { listenToContractEvent } from 'components/reusable/useEventHandler'
import { CrowdfundingContext } from 'components/reusable/CrowdfundingContext'

export const LaunchButton = () => {
  const { contract, provider, setIsLoading } = useContext(CrowdfundingContext)
  const [goal, setGoal] = useState<number | null>(null)
  const [start, setStart] = useState<string | null>(null)
  const [end, setEnd] = useState<string | null>(null)

  const dateToUint32 = (dateString: string) => {
    const date = new Date(dateString)
    const unixTimestamp = date.getTime() / 1000
    return BigNumber.from(Math.floor(unixTimestamp))
  }

  const launchCampaign = async () => {
    if (!provider || !contract || !goal || !start || !end) return
    try {
      setIsLoading(true)
      listenToContractEvent(provider, contract, 'Launch')
      await contract.launch(BigNumber.from(goal), dateToUint32(start), dateToUint32(end))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h3>Launch</h3>
      <Input type="number" onChangeCallback={setGoal} label="Goal" />
      <Input type="datetime-local" onChangeCallback={setStart} label="Start Date"/>
      <Input type="datetime-local" onChangeCallback={setEnd} label="End Date" />
      <button onClick={() => launchCampaign()}>Launch Campaign</button>
    </div>
  )
}
