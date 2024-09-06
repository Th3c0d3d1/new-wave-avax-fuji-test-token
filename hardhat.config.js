require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS || '';

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    avalancheFuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: privateKeys.split(',')
    }
  }
};