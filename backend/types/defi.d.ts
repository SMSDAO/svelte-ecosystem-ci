/**
 * DeFi Backend Type Definitions
 */

export type TrustLevel = 'red' | 'yellow' | 'green'

export interface ContractMetadata {
	name: string
	address: string
	deployer: string
	contractAge: number // in days
	transactionVolume: number
	safetyScore: number // 0-100
	trustLevel: TrustLevel
}

export interface PlatformList {
	platform: 'radium' | 'orca' | 'pump' | 'meteors'
	contracts: ContractMetadata[]
	lastUpdated: Date
}

export interface SafetyIndicators {
	rugPullRisk: number // 0-100
	liquidityScore: number
	holderDistribution: number
	contractVerified: boolean
	honeypotDetected: boolean
	hasRenounced: boolean
}

export interface RugPullCheckResult {
	contractAddress: string
	isUnsafe: boolean
	riskLevel: TrustLevel
	indicators: SafetyIndicators
	miterSignals: string[]
	timestamp: Date
}

export interface WalletTransaction {
	id: string
	walletAddress: string
	transactionHash?: string
	status: 'pending' | 'completed' | 'failed'
	amount: number
	token: string
	safetyCheck: boolean
	profitability?: number
	timestamp: Date
}

export interface JupiterQuote {
	inputMint: string
	outputMint: string
	inAmount: string
	outAmount: string
	priceImpactPct: number
	slippageBps: number
	route: any[]
}

export interface ContractAnalysis {
	address: string
	safetyAssessment: TrustLevel
	profitabilityScore: number
	gasEstimate: number
	slippageSafety: boolean
	recommendedAction: 'buy' | 'sell' | 'hold' | 'avoid'
	updatedAt: Date
}

export interface TokenLibraryEntry {
	symbol: string
	address: string
	decimals: number
	platform: 'radium' | 'orca'
	verified: boolean
}
