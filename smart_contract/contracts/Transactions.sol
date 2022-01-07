// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    // function that we are going to emit later on
    // An event is emitted, it stores the arguments passed in transaction logs. 
    //These logs are stored on blockchain and are accessible using address of the contract till the contract is present on the blockchain
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    // object that we are going to
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    // array of TransferStruct object
    TransferStruct[] transactions;

    // 
    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public { // message and keyword are data that stored in the memory of the specific transaction
       transactionCount += 1;
       transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword)); // msg and block are objects that the blockchain immediately have
    
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) { // from the memory
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}