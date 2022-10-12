require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",

  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli:{
      url: process.env.GOERLI_RPC_URL,
      accounts:[process.env.PRIVATE_KEY]
    }
  },
};