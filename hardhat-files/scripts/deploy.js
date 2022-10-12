const { ethers } = require("hardhat");

async function main() {
  const whiteListContract = await ethers.getContractFactory("WhiteList");

  const deployedContract = await whiteListContract.deploy(10); // send 10 to the constructor

  await deployedContract.deployed();

  console.log("Whitelist contract deployed to ", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  // whitelist goerli address : 0xcC759Ce1cCEcb63060334CA1660bfC6B92d39220