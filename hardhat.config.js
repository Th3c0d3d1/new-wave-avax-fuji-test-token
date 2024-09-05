require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [`0x${process.env.PRIVATE_KEY}`] // Your wallet's private key
    }
  }
};