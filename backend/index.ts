/**
 * DeFi Backend Security Integration
 * Main entry point for all backend services and APIs
 */

// Export all API endpoints
export {
	platformEndpoints,
	rugPullEndpoints,
	walletEndpoints,
	contractEndpoints,
} from './api/index.ts'

// Export all services
export { platformAggregator } from './services/platform-aggregator.ts'
export { rugPullChecker } from './services/rug-pull-checker.ts'
export { jupiterIntegration } from './services/jupiter-integration.ts'
export { contractAnalyzer } from './services/contract-analyzer.ts'

// Export configuration
export { PLATFORM_CONFIGS, JUPITER_CONFIG } from './config/platforms.ts'

// Export utilities
export {
	calculateTrustLevel,
	calculateSafetyScore,
	getTrustLevelColor,
	generateMiterSignals,
} from './utils/trust-level.ts'

// Export types
export type * from './types/defi.d.ts'
