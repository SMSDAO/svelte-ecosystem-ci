# svelte-ecosystem-ci

This repository is used to run integration tests for svelte ecosystem projects

## 🔐 DeFi Backend Security Integration

This repository now includes a comprehensive DeFi backend security system with real-time monitoring and safe transaction capabilities. See [backend/README.md](./backend/README.md) for complete documentation.

### Key Features
- **Platform Integration**: Support for Radium, ORCA, Pump, and Meteors with metadata tracking
- **Rug Pull Checker**: Real-time smart contract monitoring with trust level indicators (🔴 Red, 🟡 Yellow, 🟢 Green)
- **Wallet Transactions**: Secure Jupiter API integration for safe swap execution
- **Contract Analysis**: Live safety assessment, profitability checking, and gas optimization

### Quick Start
```typescript
import { rugPullEndpoints, walletEndpoints } from './backend/index.ts'

// Check contract safety
const check = await rugPullEndpoints.checkContract('contract-address')
console.log(`Trust Level: ${check.data?.riskLevel}`)

// Get safe swap quote
const quote = await walletEndpoints.getQuote({
  inputMint: 'token-in',
  outputMint: 'token-out',
  amount: 1000000,
  useUltraApi: true
})
```

---

## Svelte Ecosystem CI

## via github workflow

### scheduled

Workflows are scheduled to run automatically every Monday, Wednesday and Friday

### manually

- open [workflow](../../actions/workflows/ecosystem-ci-selected.yml)
- click 'Run workflow' button on top right of the list
- select suite to run in dropdown
- start workflow

## via shell script

- clone this repo
- run `pnpm i`
- run `pnpm test` to run all suites
- or `pnpm test <suitename>` to select a suite
- or `tsx ecosystem-ci.ts`

You can pass `--tag v2.8.0-beta.1`, `--branch somebranch` or `--commit abcd1234` option to select a specific svelte version to build.
If you pass `--release 2.7.13`, svelte build will be skipped and svelte is fetched from the registry instead

The repositories are checked out into `workspace` subdirectory as shallow clones

## via comment on PR

- comment `/ecosystem-ci run` on a PR
- or `/ecosystem-ci run <suitename>` to select a suite

Users with triage permission to sveltejs/svelte repository can only use this.

See [docs/pr-comment-setup.md](./docs/pr-comment-setup.md) for how to setup this feature.

# how to add a new integration test

- check out the existing [tests](./tests) and add one yourself. Thanks to some utilities it is really easy
- once you are confident the suite works, add it to the lists of suites in the [workflows](../../actions/)

# reporting results

## Discord

Results are posted automatically to `#ecosystem-ci` on [svelte discord](https://svelte.dev/chat/)

### on your own server

- Go to `Server settings > Integrations > Webhooks` and click `New Webhook`
- Give it a name, icon and a channel to post to
- copy the webhook url
- get in touch with admins of this repo so they can add the webhook

#### how to add a discord webhook here

- Go to `<github repo>/settings/secrets/actions` and click on `New repository secret`
- set `Name` as `DISCORD_WEBHOOK_URL`
- paste the discord webhook url you copied from above into `Value`
- Click `Add secret`
