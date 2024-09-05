const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");

async function main() {
  const Token = await getContractFactory('Token');

  const name = 'New Wave';
  const symbol = 'NWV';
  const initialSupply = ethers.utils.parseUnits('1000000', 18);

  const token = await Token.deploy(name, symbol, initialSupply);
  await token.deployed();
  console.log(`Token deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});