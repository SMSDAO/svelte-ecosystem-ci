/**
 * Main API Router
 * Exports all API endpoint modules
 */

export { platformEndpoints } from './platform-endpoints.ts'
export { rugPullEndpoints } from './rug-pull-endpoints.ts'
export { walletEndpoints } from './wallet-endpoints.ts'
export { contractEndpoints } from './contract-endpoints.ts'

// Re-export types for convenience
export type * from '../types/defi.d.ts'
