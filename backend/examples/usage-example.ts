/**
 * Usage Examples for DeFi Backend Security Integration
 * 
 * This file demonstrates how to use the various services and endpoints
 * provided by the DeFi backend.
 */

import {
	platformEndpoints,
	rugPullEndpoints,
	walletEndpoints,
	contractEndpoints,
} from '../index.ts'

/**
 * Example 1: Check all platforms for contract lists
 */
async function example1_checkPlatforms() {
	console.log('=== Example 1: Platform Lists ===')

	// Get all platform lists
	const platforms = await platformEndpoints.getAllPlatforms()

	if (platforms.success && platforms.data) {
		platforms.data.forEach((platform) => {
			console.log(`\n${platform.platform.toUpperCase()} Platform:`)
			console.log(`  Last Updated: ${platform.lastUpdated}`)
			console.log(`  Total Contracts: ${platform.contracts.length}`)

			// Show top 3 contracts by trust level
			const safeContracts = platform.contracts
				.filter((c) => c.trustLevel === 'green')
				.slice(0, 3)

			console.log(`  Safe Contracts (Green):`)
			safeContracts.forEach((c) => {
				console.log(`    - ${c.name}: ${c.address}`)
			})
		})
	}
}

/**
 * Example 2: Perform rug pull check on a contract
 */
async function example2_rugPullCheck() {
	console.log('\n=== Example 2: Rug Pull Check ===')

	const contractAddress = 'example-contract-address'

	// Check contract for rug pull indicators
	const result = await rugPullEndpoints.checkContract(contractAddress)

	if (result.success && result.data) {
		const { riskLevel, isUnsafe, indicators, miterSignals } = result.data

		console.log(`\nContract: ${contractAddress}`)
		console.log(`Trust Level: ${riskLevel.toUpperCase()}`)
		console.log(`Is Unsafe: ${isUnsafe}`)
		console.log(`\nSafety Indicators:`)
		console.log(`  Rug Pull Risk: ${indicators.rugPullRisk}%`)
		console.log(`  Liquidity Score: ${indicators.liquidityScore}`)
		console.log(`  Contract Verified: ${indicators.contractVerified}`)
		console.log(`  Honeypot Detected: ${indicators.honeypotDetected}`)

		if (miterSignals.length > 0) {
			console.log(`\n⚠️  Warning Signals:`)
			miterSignals.forEach((signal) => console.log(`  - ${signal}`))
		}
	}
}

/**
 * Example 3: Monitor multiple contracts
 */
async function example3_monitorContracts() {
	console.log('\n=== Example 3: Contract Monitoring ===')

	const contractsToMonitor = [
		'contract-address-1',
		'contract-address-2',
		'contract-address-3',
	]

	// Start monitoring
	for (const address of contractsToMonitor) {
		await rugPullEndpoints.startMonitoring(address)
		console.log(`✓ Started monitoring: ${address}`)
	}

	// Get trust rankings
	const rankings = await rugPullEndpoints.getTrustRankings(contractsToMonitor)

	if (rankings.success && rankings.data) {
		console.log('\nTrust Rankings:')
		Object.entries(rankings.data).forEach(([address, level]) => {
			const emoji = level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'
			console.log(`  ${emoji} ${address}: ${level.toUpperCase()}`)
		})
	}

	// Get monitored contracts
	const monitored = rugPullEndpoints.getMonitoredContracts()
	console.log(`\nTotal Monitored: ${monitored.data.length}`)
}

/**
 * Example 4: Get swap quote and check profitability
 */
async function example4_swapQuote() {
	console.log('\n=== Example 4: Swap Quote & Profitability ===')

	const inputMint = 'input-token-address'
	const outputMint = 'output-token-address'
	const amount = 1000000 // in smallest unit

	// Check profitability first
	const profitCheck = await walletEndpoints.checkProfitability({
		inputMint,
		outputMint,
		amount,
	})

	if (profitCheck.success && profitCheck.data) {
		console.log('\nProfitability Analysis:')
		console.log(`  Profitable: ${profitCheck.data.profitable}`)
		console.log(`  Estimated Profit: ${profitCheck.data.estimatedProfit}`)
		console.log(`  Price Impact: ${profitCheck.data.priceImpact}%`)
	}

	// Get quote using Ultra API
	const quote = await walletEndpoints.getQuote({
		inputMint,
		outputMint,
		amount,
		slippageBps: 50, // 0.5% slippage
		useUltraApi: true,
	})

	if (quote.success && quote.data) {
		console.log('\nJupiter Quote (Ultra API):')
		console.log(`  Input Amount: ${quote.data.inAmount}`)
		console.log(`  Output Amount: ${quote.data.outAmount}`)
		console.log(`  Price Impact: ${quote.data.priceImpactPct}%`)
		console.log(`  Slippage: ${quote.data.slippageBps} bps`)

		// Execute swap if profitable and safe
		if (profitCheck.data?.profitable) {
			const swap = await walletEndpoints.executeSwap({
				quote: quote.data,
				walletAddress: 'your-wallet-address',
			})

			if (swap.success && swap.data) {
				console.log(`\n✓ Swap executed successfully!`)
				console.log(`  Transaction ID: ${swap.data.id}`)
				console.log(`  Status: ${swap.data.status}`)
			}
		}
	}
}

/**
 * Example 5: Analyze contract safety and get recommendations
 */
async function example5_contractAnalysis() {
	console.log('\n=== Example 5: Contract Analysis ===')

	const contractAddress = 'contract-to-analyze'

	// Perform comprehensive analysis
	const analysis = await contractEndpoints.analyzeContract(contractAddress)

	if (analysis.success && analysis.data) {
		const {
			safetyAssessment,
			profitabilityScore,
			gasEstimate,
			slippageSafety,
			recommendedAction,
		} = analysis.data

		console.log(`\nContract Analysis: ${contractAddress}`)
		console.log(`  Safety Assessment: ${safetyAssessment.toUpperCase()}`)
		console.log(`  Profitability Score: ${profitabilityScore}/100`)
		console.log(`  Gas Estimate: ${gasEstimate} SOL`)
		console.log(`  Slippage Safe: ${slippageSafety}`)
		console.log(`\n💡 Recommended Action: ${recommendedAction.toUpperCase()}`)

		// Check slippage safety separately
		const slippageCheck = await contractEndpoints.checkSlippageSafety(
			contractAddress,
		)

		if (slippageCheck.success) {
			console.log(
				`\nSlippage Safety: ${slippageCheck.data?.safe ? '✓ Safe' : '✗ Risky'}`,
			)
		}
	}
}

/**
 * Example 6: Get swap route with safety checks
 */
async function example6_safeSwapRoute() {
	console.log('\n=== Example 6: Safe Swap Route ===')

	const inputToken = 'input-token-address'
	const outputToken = 'output-token-address'
	const amount = 1000000

	// Get safe swap route
	const route = await contractEndpoints.getSwapRoute({
		inputToken,
		outputToken,
		amount,
	})

	if (route.success && route.data) {
		console.log(`\nSwap Route Analysis:`)
		console.log(`  Safe: ${route.data.safe ? '✓ Yes' : '✗ No'}`)
		console.log(`  Route: ${route.data.route.join(' → ')}`)
		console.log(`  Estimated Output: ${route.data.estimatedOutput}`)

		if (!route.data.safe) {
			console.log(`\n⚠️  Warning: This swap route is not considered safe!`)
		}
	}
}

/**
 * Example 7: Work with token library
 */
async function example7_tokenLibrary() {
	console.log('\n=== Example 7: Token Library ===')

	// Get verified tokens from Radium
	const radiumTokens = contractEndpoints.getVerifiedTokens('radium')

	if (radiumTokens.success && radiumTokens.data) {
		console.log('\nRadium Verified Tokens:')
		radiumTokens.data.forEach((token) => {
			console.log(`  ${token.symbol}: ${token.address}`)
			console.log(`    Decimals: ${token.decimals}`)
			console.log(`    Verified: ${token.verified}`)
		})
	}

	// Get verified tokens from ORCA
	const orcaTokens = contractEndpoints.getVerifiedTokens('orca')

	if (orcaTokens.success && orcaTokens.data) {
		console.log('\nORCA Verified Tokens:')
		orcaTokens.data.forEach((token) => {
			console.log(`  ${token.symbol}: ${token.address}`)
		})
	}

	// Add a custom token
	const newToken = {
		symbol: 'CUSTOM',
		address: 'custom-token-address',
		decimals: 9,
		platform: 'radium' as const,
		verified: true,
	}

	const addResult = contractEndpoints.addToken(newToken)
	if (addResult.success) {
		console.log(`\n✓ ${addResult.message}`)
	}
}

/**
 * Example 8: Batch operations
 */
async function example8_batchOperations() {
	console.log('\n=== Example 8: Batch Operations ===')

	const contractAddresses = [
		'contract-1',
		'contract-2',
		'contract-3',
		'contract-4',
		'contract-5',
	]

	// Batch analyze contracts
	const analyses = await contractEndpoints.batchAnalyzeContracts(
		contractAddresses,
	)

	if (analyses.success && analyses.data) {
		console.log('\nBatch Analysis Results:')

		let greenCount = 0
		let yellowCount = 0
		let redCount = 0

		Object.entries(analyses.data).forEach(([address, analysis]) => {
			const level = analysis.safetyAssessment
			if (level === 'green') greenCount++
			else if (level === 'yellow') yellowCount++
			else redCount++

			const emoji =
				level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'
			console.log(`  ${emoji} ${address}: ${analysis.recommendedAction}`)
		})

		console.log(`\nSummary:`)
		console.log(`  🟢 Safe (Green): ${greenCount}`)
		console.log(`  🟡 Caution (Yellow): ${yellowCount}`)
		console.log(`  🔴 Risky (Red): ${redCount}`)
	}
}

/**
 * Main function to run all examples
 */
async function runExamples() {
	try {
		// Uncomment the examples you want to run

		// await example1_checkPlatforms()
		// await example2_rugPullCheck()
		// await example3_monitorContracts()
		// await example4_swapQuote()
		// await example5_contractAnalysis()
		// await example6_safeSwapRoute()
		// await example7_tokenLibrary()
		// await example8_batchOperations()

		console.log('\n✓ All examples completed!')
	} catch (error) {
		console.error('Error running examples:', error)
	}
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	runExamples()
}

export {
	example1_checkPlatforms,
	example2_rugPullCheck,
	example3_monitorContracts,
	example4_swapQuote,
	example5_contractAnalysis,
	example6_safeSwapRoute,
	example7_tokenLibrary,
	example8_batchOperations,
}
