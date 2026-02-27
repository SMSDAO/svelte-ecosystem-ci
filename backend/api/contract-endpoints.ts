/**
 * Contract Analysis API Endpoints
 */

import type { ContractAnalysis, TokenLibraryEntry } from '../types/defi.d.ts'
import { contractAnalyzer } from '../services/contract-analyzer.ts'

export class ContractEndpoints {
	/**
	 * POST /api/contract/analyze - Analyze contract safety and profitability
	 */
	async analyzeContract(contractAddress: string): Promise<{
		success: boolean
		data?: ContractAnalysis
		error?: string
	}> {
		try {
			if (!contractAddress || typeof contractAddress !== 'string') {
				throw new Error('Invalid contract address')
			}

			const analysis = await contractAnalyzer.assessContractSafety(
				contractAddress,
			)

			return {
				success: true,
				data: analysis,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/contract/batch-analyze - Analyze multiple contracts
	 */
	async batchAnalyzeContracts(contractAddresses: string[]): Promise<{
		success: boolean
		data?: Record<string, ContractAnalysis>
		error?: string
	}> {
		try {
			const analyses =
				await contractAnalyzer.batchAnalyzeContracts(contractAddresses)

			const result: Record<string, ContractAnalysis> = {}
			analyses.forEach((analysis, address) => {
				result[address] = analysis
			})

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
	 * POST /api/contract/slippage-check - Check slippage safety
	 */
	async checkSlippageSafety(contractAddress: string): Promise<{
		success: boolean
		data?: { safe: boolean }
		error?: string
	}> {
		try {
			const safe = await contractAnalyzer.checkSlippageSafety(contractAddress)

			return {
				success: true,
				data: { safe },
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/contract/gas-estimate - Estimate gas costs
	 */
	async estimateGas(contractAddress: string): Promise<{
		success: boolean
		data?: { gasEstimate: number }
		error?: string
	}> {
		try {
			const gasEstimate =
				await contractAnalyzer.estimateGasCosts(contractAddress)

			return {
				success: true,
				data: { gasEstimate },
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/contract/swap-route - Get safe swap route
	 */
	async getSwapRoute(params: {
		inputToken: string
		outputToken: string
		amount: number
	}): Promise<{
		success: boolean
		data?: {
			safe: boolean
			route: string[]
			estimatedOutput: number
		}
		error?: string
	}> {
		try {
			const result = await contractAnalyzer.getSwapRoute(
				params.inputToken,
				params.outputToken,
				params.amount,
			)

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
	 * GET /api/contract/token/:address - Get token info from library
	 */
	getTokenInfo(address: string): {
		success: boolean
		data?: TokenLibraryEntry
		error?: string
	} {
		const token = contractAnalyzer.getToken(address)

		if (!token) {
			return {
				success: false,
				error: 'Token not found in library',
			}
		}

		return {
			success: true,
			data: token,
		}
	}

	/**
	 * GET /api/contract/tokens/:platform - Get verified tokens by platform
	 */
	getVerifiedTokens(platform: 'radium' | 'orca'): {
		success: boolean
		data?: TokenLibraryEntry[]
		error?: string
	} {
		try {
			const tokens = contractAnalyzer.getVerifiedTokensByPlatform(platform)

			return {
				success: true,
				data: tokens,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/contract/token/add - Add token to library
	 */
	addToken(token: TokenLibraryEntry): {
		success: boolean
		message?: string
		error?: string
	} {
		try {
			// Validate token data
			if (
				!token.address ||
				!token.symbol ||
				!token.platform ||
				token.decimals == null
			) {
				throw new Error('Invalid token data')
			}

			contractAnalyzer.addTokenToLibrary(token)

			return {
				success: true,
				message: `Token ${token.symbol} added to library`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}
}

export const contractEndpoints = new ContractEndpoints()
