# Sample Crowdfunding Front-end project
[![Developed by Mad Devs](https://maddevs.io/badge-dark.svg)](https://maddevs.io/blockchain/)

[//]: # TODO add links to writeup

> [!NOTE]
> This repository was developed as a practical example for an article [Challenges and Pitfalls for Beginner Front-End Blockchain Developers](url-to-writeup).

This project demonstrates a basic frontend app connected to local blockchain using Metamask.

### Installation and local development:
(1) install and run locally [crowdfunding-hardhat-example](https://github.com/maddevsio/crowdfunding-hardhat-example),

(2) make sure `LOCAL_CHAIN` config in `src/blockchainInfo/chainConfig.ts` corresponds to configs for `crowdfunding-hardhat-example` (e.g., `chainId` or `rpcUrls`). Otherwise, front-end app wouldn't be able to connect to the hardhat local node 

(3) install dependencies
`npm install`

(4) run front-end app
`npm run dev`

NOTE: On every hardhat node restart, you should clear activity tab data in your MetaMask client. It will reset the nonce for transactions
 

### Other commands:

`npm run build` - build the app

`npm run preview` - preview built version of the app

`npm run lint` - run linter check

`npm run lint:fix` - run linter check and enforce fix

`npm run typechain` - build TS types for smart-contracts
