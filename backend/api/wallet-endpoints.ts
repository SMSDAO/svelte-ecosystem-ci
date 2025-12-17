/**
 * Wallet Transaction API Endpoints
 */

import type { WalletTransaction, JupiterQuote } from '../types/defi.d.ts'
import { jupiterIntegration } from '../services/jupiter-integration.ts'
import { rugPullChecker } from '../services/rug-pull-checker.ts'

export class WalletEndpoints {
	private transactions: Map<string, WalletTransaction> = new Map()

	/**
	 * POST /api/wallet/quote - Get swap quote
	 */
	async getQuote(params: {
		inputMint: string
		outputMint: string
		amount: number
		slippageBps?: number
		useUltraApi?: boolean
	}): Promise<{
		success: boolean
		data?: JupiterQuote
		error?: string
	}> {
		try {
			// Safety check on both tokens
			const [inputCheck, outputCheck] = await Promise.all([
				rugPullChecker.flagUnsafeInteractions(params.inputMint),
				rugPullChecker.flagUnsafeInteractions(params.outputMint),
			])

			if (inputCheck.shouldBlock) {
				return {
					success: false,
					error: `Input token unsafe: ${inputCheck.reason}`,
				}
			}

			if (outputCheck.shouldBlock) {
				return {
					success: false,
					error: `Output token unsafe: ${outputCheck.reason}`,
				}
			}

			// Get quote from appropriate API
			const quote = params.useUltraApi
				? await jupiterIntegration.getUltraQuote(
						params.inputMint,
						params.outputMint,
						params.amount,
						{ slippageBps: params.slippageBps },
					)
				: await jupiterIntegration.getBasicQuote(
						params.inputMint,
						params.outputMint,
						params.amount,
						params.slippageBps,
					)

			// Verify transaction safety
			const safetyCheck = await jupiterIntegration.verifyTransactionSafety(quote)

			return {
				success: true,
				data: {
					...quote,
					safetyWarnings: safetyCheck.warnings,
				} as any,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * POST /api/wallet/swap - Execute swap transaction
	 */
	async executeSwap(params: {
		quote: JupiterQuote
		walletAddress: string
	}): Promise<{
		success: boolean
		data?: WalletTransaction
		error?: string
	}> {
		try {
			// Final safety check
			const safetyCheck = await jupiterIntegration.verifyTransactionSafety(
				params.quote,
			)

			if (!safetyCheck.safe) {
				return {
					success: false,
					error: `Transaction not safe: ${safetyCheck.warnings.join(', ')}`,
				}
			}

			// Execute the swap
			const transaction = await jupiterIntegration.executeSwap(
				params.quote,
				params.walletAddress,
			)

			// Store transaction
			this.transactions.set(transaction.id, transaction)

			return {
				success: true,
				data: transaction,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * GET /api/wallet/transaction/:id - Get transaction status
	 */
	getTransaction(transactionId: string): {
		success: boolean
		data?: WalletTransaction
		error?: string
	} {
		const transaction = this.transactions.get(transactionId)

		if (!transaction) {
			return {
				success: false,
				error: 'Transaction not found',
			}
		}

		return {
			success: true,
			data: transaction,
		}
	}

	/**
	 * GET /api/wallet/transactions/:address - Get all transactions for wallet
	 */
	getWalletTransactions(walletAddress: string): {
		success: boolean
		data: WalletTransaction[]
	} {
		const transactions = Array.from(this.transactions.values()).filter(
			(tx) => tx.walletAddress === walletAddress,
		)

		return {
			success: true,
			data: transactions,
		}
	}

	/**
	 * POST /api/wallet/profitability - Check profitability of potential swap
	 */
	async checkProfitability(params: {
		inputMint: string
		outputMint: string
		amount: number
	}): Promise<{
		success: boolean
		data?: {
			profitable: boolean
			estimatedProfit: number
			priceImpact: number
		}
		error?: string
	}> {
		try {
			const result = await jupiterIntegration.checkProfitability(
				params.inputMint,
				params.outputMint,
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
	 * POST /api/wallet/routes - Get best routes for swap
	 */
	async getBestRoutes(params: {
		inputMint: string
		outputMint: string
		amount: number
	}): Promise<{
		success: boolean
		data?: any[]
		error?: string
	}> {
		try {
			const routes = await jupiterIntegration.getBestRoutes(
				params.inputMint,
				params.outputMint,
				params.amount,
			)

			return {
				success: true,
				data: routes,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	/**
	 * GET /api/wallet/jupiter-address - Get Jupiter program address
	 */
	getJupiterAddress(): {
		success: boolean
		data: { address: string }
	} {
		return {
			success: true,
			data: {
				address: jupiterIntegration.getJupiterProgramAddress(),
			},
		}
	}
}

export const walletEndpoints = new WalletEndpoints()
