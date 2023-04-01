require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const BNB_TESTNET_RPC_URL = process.env.BNB_TESTNET_RPC_URL;
const BNB_TESTNET_PRIVATE_KEY = process.env.BNB_TESTNET_PRIVATE_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    bnbtestnet: {
      url: BNB_TESTNET_RPC_URL,
      chainId: 97,
      accounts: [
        BNB_TESTNET_PRIVATE_KEY
      ]
    }
  },
  etherscan: {
    apiKey: BSCSCAN_API_KEY
  }
};
