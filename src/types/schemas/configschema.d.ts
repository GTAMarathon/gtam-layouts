/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Audio = string[];

export interface Configschema {
	twitchExt: {
		enable: boolean;
		token: string;
	};
	highlight: {
		enable: boolean;
		gqlOAuth: string;
		clientID: string;
		offsetStart: number;
		offsetEnd: number;
	};
	obs: {
		enable: boolean;
		address: string;
		password?: string;
		names: {
			scenes: {
				intermission: string;
				quiz: string;
				_1p32: string;
				_1p43: string;
				_2p43: string;
				_3p43: string;
				_1p169: string;
				_2p169: string;
				_3p169: string;
				_4p169_1: string;
				_4p169_2: string;
				_4p169_3: string;
				_4p169_4: string;
				vcbingo: string;
				vchundo: string;
				vbingo: string;
			};
			sources: {
				intermissionVideo: string;
				intermissionMusic: string;
				runner1_169: string;
				runner2_169: string;
				runner3_169: string;
				runner4_169: string;
				runner1_32: string;
				runner1_43: string;
				runner2_43: string;
				runner3_43: string;
				runner4_43: string;
				runner5_43: string;
			};
			paths: {
				intermissionVideo: string;
				intermissionMusic: string;
			};
			audioToMute: Audio;
			audioToUnmute: Audio;
		};
	};
	feeds: {
		playerUrl: string;
		streams: {
			name: string;
			twitchAccount: string;
		}[];
	};
	betting: {
		enable: boolean;
		broadcaster_id: string;
	};
	schedule: {
		enable: boolean;
		marathonShort: string;
	};
	hundo: {
		enabled: boolean;
		port: number;
	};
}
