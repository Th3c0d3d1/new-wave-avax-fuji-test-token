require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS || '';

module.exports = {
  solidity: "0.8.9",
  networks: {
    avalanchefuji: {
      url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 43113,
      accounts: privateKeys.split(',')
    },
    avalanchemainnet: {
      url: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 43113,
      accounts: privateKeys.split(',')
    }
  }
};
