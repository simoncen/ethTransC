//const hre = require('hardhat')

const main = async () => {
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);

  // deploy using hardhat
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions address: ", transactions.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0); // the process went successfully
  } catch (error) {
    console.error(error);
    process.exit(1); // there is an error
  }
}

runMain();
