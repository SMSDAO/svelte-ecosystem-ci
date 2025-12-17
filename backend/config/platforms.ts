/**
 * Platform Configuration for DeFi integrations
 */

export const PLATFORM_CONFIGS = {
	radium: {
		name: 'Radium',
		apiEndpoint: 'https://api.raydium.io/v2',
		rpcEndpoint: 'https://api.mainnet-beta.solana.com',
		programId: 'RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr',
	},
	orca: {
		name: 'ORCA',
		apiEndpoint: 'https://api.orca.so',
		rpcEndpoint: 'https://api.mainnet-beta.solana.com',
		programId: 'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1',
	},
	pump: {
		name: 'Pump',
		apiEndpoint: 'https://api.pump.fun',
		rpcEndpoint: 'https://api.mainnet-beta.solana.com',
		programId: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
	},
	meteors: {
		name: 'Meteors',
		apiEndpoint: 'https://api.meteors.app',
		rpcEndpoint: 'https://api.mainnet-beta.solana.com',
		programId: 'METzRpA9qFMXv7Qq1KCFYfLzZvxW6FBRwJxFxLCPjVZ',
	},
}

export const JUPITER_CONFIG = {
	apiKey: 'd92068e7-00f8-4f44-a5d3-098a91cf28f7',
	basicApiEndpoint: 'https://quote-api.jup.ag/v6',
	ultraApiEndpoint: 'https://lite.jup.ag/v6',
	swapEndpoint: 'https://quote-api.jup.ag/v6/swap',
}

export const TRUST_LEVEL_THRESHOLDS = {
	green: {
		minSafetyScore: 80,
		maxRugPullRisk: 20,
		minContractAge: 30, // days
		minTransactionVolume: 100000,
	},
	yellow: {
		minSafetyScore: 50,
		maxRugPullRisk: 50,
		minContractAge: 7,
		minTransactionVolume: 10000,
	},
	red: {
		// Everything below yellow thresholds
	},
}

export const SAFETY_CHECK_INTERVALS = {
	rugPullCheck: 5 * 60 * 1000, // 5 minutes
	contractAnalysis: 10 * 60 * 1000, // 10 minutes
	platformListSync: 15 * 60 * 1000, // 15 minutes
}
