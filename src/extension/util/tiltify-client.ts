import axios from 'axios';
import { get } from './nodecg';
import { tiltifyTokens } from './replicants';
import { Configschema } from '../../types/generated/configschema';
import {
  TiltifyTokenResponse,
  TiltifyCampaignData,
  TiltifyRawDonation,
  TiltifyMilestone,
  TiltifyDonation
} from '../../types/custom/Tiltify-Types';

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).tiltify;

export class TiltifyClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  public readonly campaignId: string;
  private readonly TOKEN_EXPIRY_BUFFER = 120;

  constructor() {
    if (!config?.enable) throw new Error('Tiltify integration disabled');
    if (!config.clientId || !config.clientSecret || !config.campaign) {
      throw new Error('Missing Tiltify configuration values');
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.campaignId = config.campaign;
    
    // Initialize replicant with proper type
    tiltifyTokens.value = tiltifyTokens.value || {
      access_token: '',
      expires_at: new Date(0)
    };
  }

  /**
   * Helper function to get the access token for the Tiltify API.
   * @returns valid Tiltify API Access Token.
   */
  public async getValidToken(): Promise<string> {
    if (this.isTokenExpired() || !tiltifyTokens.value?.access_token) {
      await this.refreshToken();
    }
    return tiltifyTokens.value!.access_token;
  }

  /**
   * Helper function to check if the token it's called on is expired.
   * @returns whether or not the token expired.
   */
  private isTokenExpired(): boolean {
    const expiresAt = tiltifyTokens.value?.expires_at;
    if (!expiresAt) return true;
    const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    return Date.now() >= expiryDate.getTime() - this.TOKEN_EXPIRY_BUFFER * 1000;
  }

  /**
   * Helper function to update the access token.
   */
  private async refreshToken(): Promise<void> {
    try {
      const { data } = await axios.post<TiltifyTokenResponse>(
        'https://v5api.tiltify.com/oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'public'
        }
      );

      tiltifyTokens.value = {
        access_token: data.access_token,
        expires_at: new Date(Date.now() + (data.expires_in * 1000))
      };

      nodecg.log.info('[Tiltify] Tokens refreshed successfully');
    } catch (error) {
      nodecg.log.error('[Tiltify] Failed to refresh token:', error);
      throw error;
    }
  }

  /**
   * Fetches the total amount of raised money.
   * @returns amount of money.
   */
  public async fetchCampaignTotal(): Promise<number> {
    const token = await this.getValidToken();
    const { data } = await axios.get<TiltifyCampaignData>(
      `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return parseFloat(data.data.total_amount_raised.value);
  }

  /**
   * Fetches milestones for the event.
   * @returns all milestones.
   */
  public async fetchMilestones(): Promise<TiltifyMilestone[]> {
    const token = await this.getValidToken();
    const { data } = await axios.get<{ data: TiltifyMilestone[] }>(
      `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}/milestones`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.data;
  }

  /***
   * Fetches a maximum of 5 recent donations.
   */
  public async fetchRecentDonations(limit = 5): Promise<TiltifyDonation[]> {
    const token = await this.getValidToken();
    const { data } = await axios.get<{ data: TiltifyRawDonation[] }>(
      `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}/donations?limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data.data.map(d => ({
      id: d.id,
      name: d.donor_name,
      amount: parseFloat(d.amount.value),
      currency: d.amount.currency,
      timestamp: new Date(d.completed_at)
    }));
  }
}