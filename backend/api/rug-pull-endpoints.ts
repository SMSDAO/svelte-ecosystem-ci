/**
 * Rug Pull Checker API Endpoints
 */

import type { RugPullCheckResult, TrustLevel } from '../types/defi.d.ts'
import { rugPullChecker } from '../services/rug-pull-checker.ts'

export class RugPullEndpoints {
	/**
	 * POST /api/rug-check - Check contract for rug pull indicators
	 */
	async checkContract(contractAddress: string): Promise<{
		success: boolean
		data?: RugPullCheckResult
		error?: string
	}> {
		try {
			if (!contractAddress || typeof contractAddress !== 'string') {
				throw new Error('Invalid contract address')
			}

			const result = await rugPullChecker.checkContract(contractAddress)
			return {
				success: true,
				data: result,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/rug-check/monitor - Start monitoring a contract
	 */
	async startMonitoring(contractAddress: string): Promise<{
		success: boolean
		message?: string
		error?: string
	}> {
		try {
			await rugPullChecker.startMonitoring(contractAddress)
			return {
				success: true,
				message: `Started monitoring ${contractAddress}`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * DELETE /api/rug-check/monitor/:address - Stop monitoring a contract
	 */
	stopMonitoring(contractAddress: string): {
		success: boolean
		message: string
	} {
		rugPullChecker.stopMonitoring(contractAddress)
		return {
			success: true,
			message: `Stopped monitoring ${contractAddress}`,
		}
	}

	/**
	 * GET /api/rug-check/monitored - Get all monitored contracts
	 */
	getMonitoredContracts(): {
		success: boolean
		data: string[]
	} {
		const contracts = rugPullChecker.getMonitoredContracts()
		return {
			success: true,
			data: contracts,
		}
	}

	/**
	 * POST /api/rug-check/flag - Flag unsafe interactions
	 */
	async flagUnsafeInteractions(contractAddress: string): Promise<{
		success: boolean
		data?: { shouldBlock: boolean; reason: string }
		error?: string
	}> {
		try {
			const result =
				await rugPullChecker.flagUnsafeInteractions(contractAddress)
			return {
				success: true,
				data: result,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/rug-check/rankings - Get trust rankings for multiple contracts
	 */
	async getTrustRankings(contractAddresses: string[]): Promise<{
		success: boolean
		data?: Record<string, TrustLevel>
		error?: string
	}> {
		try {
			const rankings = await rugPullChecker.getTrustRankings(contractAddresses)
			const rankingsObj: Record<string, TrustLevel> = {}

			rankings.forEach((level, address) => {
				rankingsObj[address] = level
			})

			return {
				success: true,
				data: rankingsObj,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/rug-check/sync - Sync live metadata for monitored contracts
	 */
	async syncLiveMetadata(): Promise<{
		success: boolean
		message?: string
		error?: string
	}> {
		try {
			await rugPullChecker.syncLiveMetadata()
			return {
				success: true,
				message: 'Live metadata synced successfully',
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}
}

export const rugPullEndpoints = new RugPullEndpoints()
