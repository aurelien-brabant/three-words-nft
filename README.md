![three words NFT mint screenshot](https://i.imgur.com/8I2vuT9.png)

# Three words NFT

A simple website that solds [non fungible tokens](https://en.wikipedia.org/wiki/Non-fungible_token) on the [ethereum](https://ethereum.org/en/developers/docs/intro-to-ethereum) rinkeby testnet.

Each NFT consists in a random combination of three words, which is supposed to give something funny and unique!

This project was built while following along the awesome [buildspace NFT project](https://app.buildspace.so/projects/CO961ddb5f-f428-4608-9949-a9a2f461eb3f) that made me discover the world of NFTs.

This project ships with the contract deployment logic as well as with a complete frontend built with the ReactJS framework.

# Demo!

I deployed the project [on Heroku](https://three-words-nft.herokuapp.com)! You should be able to mint some NFTs if you want too! (unless they are out of stock since I put a limit of 150).

# Getting started

## Setup

If you want to deploy this contract, you need to provide a few environment variables that are going to be used by the hardhat config (`./hardhat.config.js`).

- `ALCHEMY_API_KEY`: An [Alchemy API key](https://www.alchemy.com) which you can get by creating an account on their website and creating a project
- `ETH_PRIVATE_KEY`: The private key attached to your ethereum account, which of course **must stay private at any cost**.
- `ETHERSCAN_API_KEY`: Your [Etherscan](https://etherscan.io/) API key will be required by the config if you want to verify your solidity contract.

For that you can either `export` these variables into your current shell environment or use a `.env` file in conjunction with a package like [dotenv](https://www.npmjs.com/package/dotenv)
## Deploy contract locally

In case you want to make sure contract builds as expected and can be deployed, just run `deploy.sh` without any argument.

This script does the following three things:

1) It runs `./scripts/deploy.js` in the [Hardhat Runtime Environment](https://hardhat.org/advanced/hardhat-runtime-environment.html) and deploys the contract on a local blockchain if no argument is given to the script.
2) It copies the generated [Application Binary Interface](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html), making it automatically available to the frontend.
3) It gets the deployed contract's address and generates a javascript file that exports it as a string, making it available to the frontend.

## Deploy contract on rinkeby

This small NFT project is designed to run on the rinkeby ethereum testnet. Use `deploy.sh` in real mode to deploy the contract on the rinkeby network (you'll need to pay the required gas for that, so make sure you have enough funds).

```sh
./deploy.sh 'realmode'
```
The contract should have been deployed, and the frontend should automatically get the new contract address and ABI.

## Run the frontend

You can run the react app like you would run any react app, in development or production mode.

## Link to the actual OpenSea collection

[OpenSea](`https://opensea.io/`) is the most popular and largest NFT marketplace. Since we deployed our contract and started to have some NFT minted, the collection should be
viewable on the opensea testnet (testnet, because we deployed our contract on the rinkeby testnet - no real money was involved).

The link to the OpenSea collection can't be guessed from the informations the frontend receives, so it is required to hardcode it as I did in the `./frontend/src/App.js` file.
However, a more consistent solution would be to use the OpenSea API for that.
