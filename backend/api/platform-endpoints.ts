/**
 * Platform List API Endpoints
 */

import type { PlatformList } from '../types/defi.d.ts'
import { platformAggregator } from '../services/platform-aggregator.ts'

export class PlatformEndpoints {
	/**
	 * GET /api/platforms - Get all platform lists
	 */
	async getAllPlatforms(): Promise<{
		success: boolean
		data?: PlatformList[]
		error?: string
	}> {
		try {
			const platforms = await platformAggregator.fetchAllPlatforms()
			return {
				success: true,
				data: platforms,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * GET /api/platforms/:name - Get specific platform list
	 */
	async getPlatform(
		name: 'radium' | 'orca' | 'pump' | 'meteors',
	): Promise<{
		success: boolean
		data?: PlatformList
		error?: string
	}> {
		try {
			const platform = await platformAggregator.fetchPlatformList(name)
			return {
				success: true,
				data: platform,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * GET /api/platforms/cached - Get all cached platform lists
	 */
	getCachedPlatforms(): {
		success: boolean
		data: PlatformList[]
	} {
		const platforms = platformAggregator.getAllPlatformLists()
		return {
			success: true,
			data: platforms,
		}
	}

	/**
	 * POST /api/platforms/refresh - Refresh all platform lists
	 */
	async refreshAllPlatforms(): Promise<{
		success: boolean
		data?: PlatformList[]
		error?: string
	}> {
		try {
			const platforms = await platformAggregator.fetchAllPlatforms()
			return {
				success: true,
				data: platforms,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}
}

export const platformEndpoints = new PlatformEndpoints()
