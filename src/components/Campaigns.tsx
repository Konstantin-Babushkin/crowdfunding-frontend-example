import { useContext, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { CrowdfundingContext } from 'components/reusable/CrowdfundingContext'

interface Campaign {
  // Address of campaign's creator
  creator: string;
  // Amount of tokens to raise
  goal: BigNumber;
  // Total amount pledged
  pledged: BigNumber;
  // Timestamp of start of campaign
  startAt: number;
  // Timestamp of end of campaign
  endAt: number;
  // True if goal was reached and creator has claimed the tokens.
  claimed: boolean;
}

export const Campaigns = () => {
  const { contract } = useContext(CrowdfundingContext)
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)

  const getCampaign = async () => {
    if (!contract) return

    const allCampaignIds = await contract.getCampaignIds()
    const campaignFetchingPromises = allCampaignIds.map(async (campaignId: BigNumber) => contract.getCampaignById(campaignId))
    const result = await Promise.all(campaignFetchingPromises) as Campaign[]
    setCampaigns(result)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)

    const localYear = date.getFullYear()
    const localMonth = date.getMonth() + 1 // Month is zero-based, so add 1
    const localDay = date.getDate()
    const localHours = date.getHours()
    const localMinutes = date.getMinutes()
    const localSeconds = date.getSeconds()

    const localDate = `${localYear}-${localMonth < 10 ? '0' + localMonth : localMonth}-${localDay < 10 ? '0' + localDay : localDay}`

    const localTime = `${localHours < 10 ? '0' + localHours : localHours}:${localMinutes < 10 ? '0' + localMinutes : localMinutes}:${localSeconds < 10 ? '0' + localSeconds : localSeconds}`
    return `${localDate} ${localTime}`
  }

  useEffect(()=>{
    void getCampaign()
  }, [contract])

  const renderCampaign = (campaign: Campaign, index: number) => {
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px solid black', padding: '1rem' }}>
        <span>ID: {index + 1}</span>
        <span>Creator: {campaign.creator}</span>
        <span>Goal: {campaign.goal.toString()}</span>
        <span>Pledged: {campaign.pledged.toString()}</span>
        <span>Start at: {formatDate(campaign.startAt)}</span>
        <span>End at: {formatDate(campaign.endAt)}</span>
        <span>Claimed: {String(campaign.claimed)}</span>
      </div>
    )

  }

  return (
    <div>
      <h3>Fundraising Campaigns</h3>
      {campaigns?.map(renderCampaign)}
    </div>
  )
}
