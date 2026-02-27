# DeFi Backend Security Integration

This backend provides comprehensive security and integration features for DeFi platforms including Radium, ORCA, Pump, and Meteors, with real-time financial security monitoring and Jupiter API integration.

## Features

### 1. Platform List Aggregation
- **Supported Platforms**: Radium, ORCA, Pump, Meteors
- **Metadata Collection**: Contract name, deployer, age, transaction volume
- **Trust Levels**: Color-coded (Red/Yellow/Green)
- **Safety Indicators**: Comprehensive scoring system

### 2. Rug Pull Checker
- **Real-time Monitoring**: Live metadata sync for smart contracts
- **Risk Detection**: Flags unsafe interactions automatically
- **Miter Signals**: Trust ranking based signal system
- **Continuous Updates**: Configurable check intervals

### 3. Wallet Transaction Enhancement
- **Secure Endpoints**: Safety-checked transaction execution
- **Jupiter API Integration**: Both Basic and Ultra API support
- **API Key**: Configured with `d92068e7-00f8-4f44-a5d3-098a91cf28f7`
- **Profitability Analysis**: Pre-transaction profit estimation

### 4. Contract Analysis
- **Live Safety Assessment**: Real-time contract evaluation
- **Profitability Checking**: Score-based recommendation system
- **Gas Slippage Safety**: Pre-check before transactions
- **Token Libraries**: Integrated Radium and ORCA token lists
- **Jupiter Routing**: Full address routing support

## Directory Structure

```
backend/
├── api/                    # API endpoint handlers
│   ├── contract-endpoints.ts
│   ├── platform-endpoints.ts
│   ├── rug-pull-endpoints.ts
│   ├── wallet-endpoints.ts
│   └── index.ts
├── services/              # Core business logic
│   ├── contract-analyzer.ts
│   ├── jupiter-integration.ts
│   ├── platform-aggregator.ts
│   └── rug-pull-checker.ts
├── types/                 # TypeScript type definitions
│   └── defi.d.ts
├── utils/                 # Utility functions
│   └── trust-level.ts
├── config/               # Configuration files
│   └── platforms.ts
├── index.ts             # Main entry point
└── README.md           # This file
```

## API Endpoints

### Platform Endpoints

#### Get All Platforms
```typescript
await platformEndpoints.getAllPlatforms()
// Returns: { success: boolean, data?: PlatformList[], error?: string }
```

#### Get Specific Platform
```typescript
await platformEndpoints.getPlatform('radium')
// Returns: { success: boolean, data?: PlatformList, error?: string }
```

### Rug Pull Checker Endpoints

#### Check Contract
```typescript
await rugPullEndpoints.checkContract('contract-address')
// Returns: { success: boolean, data?: RugPullCheckResult, error?: string }
```

#### Start Monitoring
```typescript
await rugPullEndpoints.startMonitoring('contract-address')
// Returns: { success: boolean, message?: string, error?: string }
```

#### Get Trust Rankings
```typescript
await rugPullEndpoints.getTrustRankings(['address1', 'address2'])
// Returns: { success: boolean, data?: Record<string, TrustLevel>, error?: string }
```

### Wallet Endpoints

#### Get Quote (Basic API)
```typescript
await walletEndpoints.getQuote({
  inputMint: 'token-address',
  outputMint: 'token-address',
  amount: 1000000,
  slippageBps: 50
})
// Returns: { success: boolean, data?: JupiterQuote, error?: string }
```

#### Get Quote (Ultra API)
```typescript
await walletEndpoints.getQuote({
  inputMint: 'token-address',
  outputMint: 'token-address',
  amount: 1000000,
  useUltraApi: true
})
// Returns: { success: boolean, data?: JupiterQuote, error?: string }
```

#### Execute Swap
```typescript
await walletEndpoints.executeSwap({
  quote: jupiterQuote,
  walletAddress: 'wallet-address'
})
// Returns: { success: boolean, data?: WalletTransaction, error?: string }
```

#### Check Profitability
```typescript
await walletEndpoints.checkProfitability({
  inputMint: 'token-address',
  outputMint: 'token-address',
  amount: 1000000
})
// Returns: { success: boolean, data?: ProfitabilityResult, error?: string }
```

### Contract Endpoints

#### Analyze Contract
```typescript
await contractEndpoints.analyzeContract('contract-address')
// Returns: { success: boolean, data?: ContractAnalysis, error?: string }
```

#### Check Slippage Safety
```typescript
await contractEndpoints.checkSlippageSafety('contract-address')
// Returns: { success: boolean, data?: { safe: boolean }, error?: string }
```

#### Get Swap Route
```typescript
await contractEndpoints.getSwapRoute({
  inputToken: 'token-address',
  outputToken: 'token-address',
  amount: 1000000
})
// Returns: { success: boolean, data?: SwapRouteResult, error?: string }
```

#### Get Verified Tokens
```typescript
contractEndpoints.getVerifiedTokens('radium')
// Returns: { success: boolean, data?: TokenLibraryEntry[], error?: string }
```

## Trust Level System

### Color Codes
- **🔴 Red (High Risk)**: Scam contracts, high rug-pull risk
- **🟡 Yellow (Caution)**: Medium risk, proceed with care
- **🟢 Green (Safe)**: Verified, low risk contracts

### Trust Level Criteria

**Green Level Requirements:**
- Safety Score ≥ 80
- Rug Pull Risk ≤ 20
- Contract Age ≥ 30 days
- Transaction Volume ≥ 100,000

**Yellow Level Requirements:**
- Safety Score ≥ 50
- Rug Pull Risk ≤ 50
- Contract Age ≥ 7 days
- Transaction Volume ≥ 10,000

**Red Level:**
- Anything below yellow thresholds
- Honeypot detected
- Unverified contract

## Miter Signals

The system generates the following miter signals based on contract analysis:

- `HIGH_RISK`: Red trust level detected
- `HONEYPOT_DETECTED`: Contract identified as honeypot
- `UNVERIFIED_CONTRACT`: Contract not verified on blockchain
- `CRITICAL_RUG_RISK`: Rug pull risk > 70%
- `ELEVATED_RUG_RISK`: Rug pull risk > 40%
- `LOW_LIQUIDITY`: Liquidity score < 30
- `CONCENTRATED_HOLDERS`: Holder distribution < 30
- `OWNERSHIP_NOT_RENOUNCED`: Contract ownership not renounced

## Jupiter API Integration

### API Configuration
- **API Key**: Configure via `JUPITER_API_KEY` environment variable
  - Default reference key: `d92068e7-00f8-4f44-a5d3-098a91cf28f7`
- **Basic API**: `https://quote-api.jup.ag/v6`
- **Ultra API**: `https://lite.jup.ag/v6`
- **Program Address**: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`

### Environment Variables
Set the following environment variables for production use:
```bash
export JUPITER_API_KEY="your-api-key-here"
```

### Features
- Quote aggregation from multiple DEXs
- Route optimization
- Slippage protection
- Transaction safety verification
- Profitability analysis

## Safety Checks

### Pre-Transaction Checks
1. Contract verification
2. Rug pull risk assessment
3. Honeypot detection
4. Holder distribution analysis
5. Liquidity verification
6. Gas cost estimation
7. Slippage safety
8. Price impact calculation

### Real-time Monitoring
- Configurable check intervals (default: 5 minutes)
- Automatic metadata synchronization
- Live risk updates
- Contract behavior tracking

## Usage Example

```typescript
import {
  platformEndpoints,
  rugPullEndpoints,
  walletEndpoints,
  contractEndpoints
} from './backend/index.ts'

// 1. Check platform lists
const platforms = await platformEndpoints.getAllPlatforms()

// 2. Verify contract safety
const rugCheck = await rugPullEndpoints.checkContract('contract-address')
if (rugCheck.data?.isUnsafe) {
  console.log('⚠️ Unsafe contract detected!')
}

// 3. Analyze contract
const analysis = await contractEndpoints.analyzeContract('contract-address')
console.log(`Recommended action: ${analysis.data?.recommendedAction}`)

// 4. Get swap quote
const quote = await walletEndpoints.getQuote({
  inputMint: 'input-token',
  outputMint: 'output-token',
  amount: 1000000,
  useUltraApi: true
})

// 5. Check profitability
const profitability = await walletEndpoints.checkProfitability({
  inputMint: 'input-token',
  outputMint: 'output-token',
  amount: 1000000
})

if (profitability.data?.profitable) {
  // 6. Execute swap
  const swap = await walletEndpoints.executeSwap({
    quote: quote.data!,
    walletAddress: 'my-wallet'
  })
  console.log(`Transaction ID: ${swap.data?.id}`)
}
```

## Configuration

### Platform Check Intervals
Edit `backend/config/platforms.ts` to adjust check intervals:

```typescript
export const SAFETY_CHECK_INTERVALS = {
  rugPullCheck: 5 * 60 * 1000,      // 5 minutes
  contractAnalysis: 10 * 60 * 1000,  // 10 minutes
  platformListSync: 15 * 60 * 1000   // 15 minutes
}
```

### Trust Level Thresholds
Adjust thresholds in `backend/config/platforms.ts`:

```typescript
export const TRUST_LEVEL_THRESHOLDS = {
  green: {
    minSafetyScore: 80,
    maxRugPullRisk: 20,
    minContractAge: 30,
    minTransactionVolume: 100000
  },
  // ... more configurations
}
```

## Integration Notes

### Token Libraries
The system includes integrated token libraries from:
- **Radium**: RAY and other verified tokens
- **ORCA**: ORCA and other verified tokens

Add custom tokens using:
```typescript
contractEndpoints.addToken({
  symbol: 'TOKEN',
  address: 'token-address',
  decimals: 6,
  platform: 'radium',
  verified: true
})
```

### Future Optional Jupiter Addresses
The system is designed to support future Jupiter address routing with merged fallbacks for comprehensive route coverage.

## Security Considerations

1. **API Key Security**: 
   - Store Jupiter API key in environment variables (`JUPITER_API_KEY`)
   - Never commit API keys to source control
   - Rotate keys regularly
2. **Rate Limiting**: Implement rate limiting for public endpoints
3. **Input Validation**: All inputs are validated before processing
4. **Error Handling**: Comprehensive error handling with fallbacks
5. **Cache Management**: Intelligent caching with configurable TTL
6. **Transaction Verification**: Multi-layer safety checks before execution

## License

MIT
