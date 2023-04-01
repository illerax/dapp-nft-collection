# NFT Collection

NFT collection contract with simple frontend to mint tokens

## Demo
**Application**: [https://illerax.github.io/dapp-nft-collection/](https://illerax.github.io/dapp-nft-collection/)

**Contract**: [https://testnet.bscscan.com/address/0x096D29B3683809BB75317A03873dcdB9f5ed4B39](https://testnet.bscscan.com/address/0x096D29B3683809BB75317A03873dcdB9f5ed4B39)

**Collection**: [https://testnets.opensea.io/collection/carddeck-1](https://testnets.opensea.io/collection/carddeck-1)


## Contracts

### Development

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

### Deploy to BNB testnet

1. Configure environment variables
   - BNB_TESTNET_RPC_URL
   - BNB_TESTNET_PRIVATE_KEY
   - BSCSCAN_API_KEY
2. Run deploy script
```shell
npx hardhat run scripts/deploy.js --network bnbtestnet
```

## Frontend

### Development
```shell
npm --prefix frontend start
```

### Deploy
```shell
npm --prefix frontend run deploy
```