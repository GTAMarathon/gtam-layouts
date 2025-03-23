export type TiltifyTokenResponse = {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
  
export type TiltifyTokenData = {
    access_token: string;
    expires_at: Date;
  };
  
export type TiltifyCampaignData = {
    data: {
      total_amount_raised: {
        currency: string;
        value: string;
      };
    };
  };
  
export type TiltifyRawDonation = {
    id: string;
    donor_name: string;
    amount: {
      value: string;
      currency: string;
    };
    completed_at: string;
  };
  
export type TiltifyDonation = {
    id: string;
    name: string;
    amount: number;
    currency: string;
    timestamp: Date;
  };

export type TiltifyMilestone = {
    id: string;
    name: string;
    amount: { value: string };
  };

export interface DonationGoal {
    name: string;
    amount: number;
  }