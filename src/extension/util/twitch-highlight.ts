import moment, { Moment } from 'moment';
import clone from 'clone';
import { get } from './nodecg';
import { Configschema } from '../../types/schemas/configschema';
import { GraphQLClient } from 'graphql-request'
import { RunData } from '../../../../nodecg-speedcontrol/src/types';
import { timer } from './replicants';
import NodeCG from '@nodecg/types';

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).highlight;
var userId: number;
var client: GraphQLClient;

if (config.enable) {

    if (!config.gqlOAuth || !config.clientID) {
        nodecg.log.warn('Twitch highlights will not be active due to your OAuth not being set correctly in the config.');
    } else {
        client = new GraphQLClient('https://gql.twitch.tv/gql',
            { headers: { 'Authorization': 'OAuth ' + config.gqlOAuth, 'Client-ID': config.clientID } });
        getUserId();
    }
}

var highlightRecording = nodecg.Replicant<Boolean>('twitchHighlightRecording', { defaultValue: false });
var startTimestamp = nodecg.Replicant<Moment | null>('twitchHighlightStartTimestamp', { defaultValue: null }) as unknown as NodeCG.ServerReplicant<Moment | null>;
var highlightRunData = nodecg.Replicant<RunData | null>('twitchHighlightRunData', { defaultValue: null }) as unknown as NodeCG.ServerReplicant<RunData | null>;
var highlightProcessing = nodecg.Replicant<Boolean>('twitchHighlightProcessing', { defaultValue: false, persistent: false });
var runDataActiveRun = nodecg.Replicant<RunData>('runDataActiveRun', 'nodecg-speedcontrol');

// Store the currently set run when the timer first starts if a highlight is being recorded, which we will use for the highlight info.
timer.on('change', (newVal, oldVal) => {
    if (highlightRecording.value && !highlightRunData.value && oldVal && oldVal.state === 'stopped' && newVal.state === 'running')
        highlightRunData.value = clone(runDataActiveRun.value);
});

function getUserId(): any {
    var query = `query() { currentUser { id login} }`;
    interface CurrentUserData {
        currentUser: { id: number, login: string }
    }

    client.request<CurrentUserData>(query)
        .then(data => {
            if (data && data.currentUser && data.currentUser.id) {
                userId = data.currentUser.id;
                nodecg.log.info('Twitch highlighting is enabled for ' + userId + '/' + data.currentUser.login);

            } else {
                nodecg.log.warn('Twitch highlights will not be active due to not being able to get the user ID.');
            }
        })
        .catch(err => nodecg.log.warn('Twitch highlights will not be active due to not being able to get the user ID.', err))

}
export function setStartHighlight(): void {
    // Cannot start a highlight if one is already being recorded, or if the timer isn't stopped.
    if (timer.value.state != 'stopped' || !userId && !client) {
        return;
    }

    highlightRecording.value = true;
    startTimestamp.value = moment.utc()
}
export function setEndAndCreateHighlight(): void {
    // Cannot stop a highlight if one isn't being recorded, or if the timer is running/paused.
    if (!highlightRecording.value || !startTimestamp.value || timer.value.state != 'finished' || !userId && !client) {
        return;
    }
    highlightRecording.value = false;

    // If no run data was set during the recording, don't process it.
    if (!highlightRunData.value) {
        nodecg.log.warn('Twitch highlight will not be made due to no run being done during the recording.');
        return;
    }

    var endTimestamp = moment.utc();
    queryStreamInfoAndCreateTwitchHighlight(startTimestamp.value, endTimestamp, clone(highlightRunData.value));


    startTimestamp.value = null;
    highlightRunData.value = null;
}

function queryStreamInfoAndCreateTwitchHighlight(startTimestamp: Moment, endTimestamp: Moment, runData: RunData) {

    var query = `query($userId: ID) {
		user(id: $userId) {
			stream {
                title
                broadcastLanguage
				game {
                    id
                }
                archiveVideo {
                    id
                    recordedAt
                }
			}
		}
	}`;
    var variables = {
        userId: userId,
    };
    interface StreamData {
        user: { stream: { game: { id: number }, title: string, broadcastLanguage: string, archiveVideo: { id: number, recordedAt: string } } }
    }

    client.request<StreamData>(query, variables)
        .then((data) => {
            if (!data || !data.user || !data.user.stream || !data.user.stream.archiveVideo || !data.user.stream.archiveVideo.recordedAt || !moment(data.user.stream.archiveVideo.recordedAt).isValid()
                || !data.user.stream.archiveVideo.id || !data.user.stream.game || !data.user.stream.game.id || !data.user.stream.title
                || !data.user.stream.broadcastLanguage) {
                throw new Error('error: ' + JSON.stringify(data));
            }

            var pastBroadcastRecordedAt = moment(data.user.stream.archiveVideo.recordedAt);
            var sourceVideoID = data.user.stream.archiveVideo.id;
            var gameID = data.user.stream.game.id;
            var title = data.user.stream.title;
            var description = "";
            var language = data.user.stream.broadcastLanguage;
            var tags = ['Speedrun', 'Marathon'];

            if (pastBroadcastRecordedAt.isAfter(startTimestamp)) {
                nodecg.log.warn('Twitch highlight will not be made because the last past broadcast started after the highlight recording.');
                return;
            }

            var startOffsetSeconds = startTimestamp.diff(pastBroadcastRecordedAt, 'seconds') + config.offsetStart;
            if (startOffsetSeconds < 0) {
                startOffsetSeconds = 0;
            }

            var endOffsetSeconds = endTimestamp.diff(pastBroadcastRecordedAt, 'seconds') + config.offsetEnd;


            // Create highlight after a 30s delay to make sure Twitch has caught up.
            nodecg.log.info('Twitch highlight will be made in 30s.');
            highlightProcessing.value = true;
            setTimeout(() => {
                createHightlight(sourceVideoID, startOffsetSeconds, endOffsetSeconds, title, description, gameID, language, tags);
            }, 30000);
        })
        .catch(err => {
            nodecg.log.warn('Twitch highlight will not be made because some stream infos wasnt received.', err);
        });
}

function createHightlight(sourceVideoID: number | undefined, startOffsetSeconds: number, endOffsetSeconds: number, title: string, description: string, gameID: number, language: string, tags: string[]) {
    var query = `mutation($createVideoHighlightInput: CreateVideoHighlightInput!) {
                                        createVideoHighlight(input: $createVideoHighlightInput) {
                                            highlight {
                                                id
                                            }
                                        }
                                }`;
    var variables = {
        createVideoHighlightInput: {
            sourceVideoID: sourceVideoID,
            startOffsetSeconds: startOffsetSeconds,
            endOffsetSeconds: endOffsetSeconds,
            metadata: {
                title: title,
                description: description,
                game: gameID,
                language: language,
                tags: tags
            }
        }
    };

    interface HighlightData {
        createVideoHighlight: { highlight: { id: string; }; };
    }

    nodecg.log.info('Twitch highlight info');
    nodecg.log.info(JSON.stringify(variables));
    client.request<HighlightData>(query, variables)
        .then(data => {
            if (data && data.createVideoHighlight && data.createVideoHighlight.highlight && data.createVideoHighlight.highlight.id) {
                nodecg.log.info('Twitch highlight success');
            } else {
                nodecg.log.warn('Twitch highlight may have failed');
            }
        })
        .catch(err => {
            nodecg.log.warn('Twitch highlight caused an error. but usually the highlighting worked');
            nodecg.log.debug('Twitch highlight caused an error', err);
        });
}
