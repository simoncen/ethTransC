// https://eth-ropsten.alchemyapi.io/v2/lnk3DZy3m3igDXwgtrcRqNQPkEmCX6aX
// 148acc2d49db5ac26378f80d76b343464c970920f7a4c8c81212b20c56d0fbea is the private key for my ropsten test network

require('@nomiclabs/hardhat-waffle'); // a plugin to build smart contract tests

// deploy to rropsten test network instead of the main ethereum network
module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/lnk3DZy3m3igDXwgtrcRqNQPkEmCX6aX',
      accounts: ['148acc2d49db5ac26378f80d76b343464c970920f7a4c8c81212b20c56d0fbea'],
    },
  },
};
