/**
 * Trust Level Calculation Utilities
 */

import type {
	TrustLevel,
	ContractMetadata,
	SafetyIndicators,
} from '../types/defi.d.ts'
import { TRUST_LEVEL_THRESHOLDS } from '../config/platforms.ts'

/**
 * Calculate trust level based on contract metadata and safety indicators
 */
export function calculateTrustLevel(
	metadata: Omit<ContractMetadata, 'trustLevel'>,
	indicators: SafetyIndicators,
): TrustLevel {
	const { safetyScore, contractAge, transactionVolume } = metadata
	const { rugPullRisk, contractVerified, honeypotDetected } = indicators

	// Immediate red flags
	if (honeypotDetected || !contractVerified) {
		return 'red'
	}

	// High rug pull risk
	if (rugPullRisk > TRUST_LEVEL_THRESHOLDS.yellow.maxRugPullRisk) {
		return 'red'
	}

	// Check green thresholds
	if (
		safetyScore >= TRUST_LEVEL_THRESHOLDS.green.minSafetyScore &&
		rugPullRisk <= TRUST_LEVEL_THRESHOLDS.green.maxRugPullRisk &&
		contractAge >= TRUST_LEVEL_THRESHOLDS.green.minContractAge &&
		transactionVolume >= TRUST_LEVEL_THRESHOLDS.green.minTransactionVolume
	) {
		return 'green'
	}

	// Check yellow thresholds
	if (
		safetyScore >= TRUST_LEVEL_THRESHOLDS.yellow.minSafetyScore &&
		rugPullRisk <= TRUST_LEVEL_THRESHOLDS.yellow.maxRugPullRisk &&
		contractAge >= TRUST_LEVEL_THRESHOLDS.yellow.minContractAge &&
		transactionVolume >= TRUST_LEVEL_THRESHOLDS.yellow.minTransactionVolume
	) {
		return 'yellow'
	}

	// Default to red for safety
	return 'red'
}

/**
 * Calculate safety score based on multiple indicators
 */
export function calculateSafetyScore(indicators: SafetyIndicators): number {
	let score = 50 // Start at middle

	// Add points for positive indicators
	if (indicators.contractVerified) score += 15
	if (indicators.hasRenounced) score += 10
	if (indicators.liquidityScore > 70) score += 10
	if (indicators.holderDistribution > 60) score += 10

	// Subtract points for negative indicators
	if (indicators.honeypotDetected) score -= 40
	score -= indicators.rugPullRisk * 0.3

	// Clamp between 0 and 100
	return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Get color code for trust level
 */
export function getTrustLevelColor(level: TrustLevel): string {
	const colors = {
		red: '#FF4444',
		yellow: '#FFAA00',
		green: '#44FF44',
	}
	return colors[level]
}

/**
 * Generate miter signals based on trust analysis
 */
export function generateMiterSignals(
	indicators: SafetyIndicators,
	trustLevel: TrustLevel,
): string[] {
	const signals: string[] = []

	if (trustLevel === 'red') {
		signals.push('HIGH_RISK')
	}

	if (indicators.honeypotDetected) {
		signals.push('HONEYPOT_DETECTED')
	}

	if (!indicators.contractVerified) {
		signals.push('UNVERIFIED_CONTRACT')
	}

	if (indicators.rugPullRisk > 70) {
		signals.push('CRITICAL_RUG_RISK')
	} else if (indicators.rugPullRisk > 40) {
		signals.push('ELEVATED_RUG_RISK')
	}

	if (indicators.liquidityScore < 30) {
		signals.push('LOW_LIQUIDITY')
	}

	if (indicators.holderDistribution < 30) {
		signals.push('CONCENTRATED_HOLDERS')
	}

	if (!indicators.hasRenounced) {
		signals.push('OWNERSHIP_NOT_RENOUNCED')
	}

	return signals
}
