import { Asset } from '@gtam-layouts/types';
import type { DonationTotal, Host } from '@gtam-layouts/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import type { Store } from 'vuex';
import { namespace } from 'vuex-class';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { RunDataActiveRun, RunDataArray } from '../../../nodecg-speedcontrol/src/types';
import { RunDataActiveRunSurrounding, Timer } from '../../../nodecg-speedcontrol/src/types/schemas';

// Declaring replicants.
export const reps: {
  assetsSponsorLogos: ReplicantBrowser<Asset[]>;
  donationTotal: ReplicantBrowser<DonationTotal>;
  host: ReplicantBrowser<Host>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  runDataActiveRunSurrounding: ReplicantBrowser<RunDataActiveRunSurrounding>;
  runDataArray: ReplicantBrowser<RunDataArray>;
  timer: ReplicantBrowser<Timer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  assetsSponsorLogos: nodecg.Replicant('assets:sponsor-logos'),
  donationTotal: nodecg.Replicant('donationTotal'),
  host: nodecg.Replicant('host'),
  runDataActiveRun: nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runDataActiveRunSurrounding: nodecg.Replicant('runDataActiveRunSurrounding', 'nodecg-speedcontrol'), // eslint-disable-line max-len
  runDataArray: nodecg.Replicant('runDataArray', 'nodecg-speedcontrol'),
  timer: nodecg.Replicant('timer', 'nodecg-speedcontrol'),
};

// All the replicant types.
export interface ReplicantTypes {
  assetsSponsorLogos: Asset[];
  donationTotal: DonationTotal;
  host: Host;
  runDataActiveRun: RunDataActiveRun;
  runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
  runDataArray: RunDataArray;
  timer: Timer;
}

@Module({ name: 'ReplicantModule', namespaced: true })
export class ReplicantModule extends VuexModule {
  // Replicant values are stored here.
  reps: { [k: string]: unknown } = {};

  // This sets the state object above when a replicant sends an update.
  @Mutation
  setState({ name, val }: { name: string, val: unknown }): void {
    Vue.set(this.reps, name, clone(val));
  }

  // This is a generic mutation to update a named replicant.
  @Mutation
  setReplicant<K>({ name, val }: { name: string, val: K }): void {
    Vue.set(this.reps, name, clone(val)); // Also update local copy, although no schema validation!
    reps[name].value = clone(val);
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let replicantModule!: ReplicantModule;
export const replicantNS = namespace('ReplicantModule');

export async function setUpReplicants(store: Store<unknown>): Promise<void> {
  // Listens for each declared replicants "change" event, and updates the state.
  Object.keys(reps).forEach((name) => {
    reps[name].on('change', (val) => {
      store.commit('ReplicantModule/setState', { name, val });
    });
  });
  // We should make sure the replicant are ready to be read, needs to be done in browser context.
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  replicantModule = getModule(ReplicantModule, store);
}
