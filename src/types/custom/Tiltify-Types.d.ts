export interface TiltifyTokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

export interface TiltifyTokenData {
  access_token: string
  expires_at: Date
}

export interface TiltifyCampaignData {
  data: {
    total_amount_raised: {
      currency: string
      value: string
    }
  }
}

export interface TiltifyRawDonation {
  id: string
  donor_name: string
  amount: {
    value: string
    currency: string
  }
  completed_at: string
}

export interface TiltifyDonation {
  id: string
  name: string
  amount: number
  currency: string
  timestamp: Date
}

export interface TiltifyMilestone {
  id: string
  name: string
  amount: { value: string }
}

export interface DonationGoal {
  name: string
  amount: number
}
