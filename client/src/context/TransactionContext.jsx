import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext(); // pass the value all accross the components

const { ethereum } = window; // we can access window.ethereum on the info section on the console on chrome b/c metamask is installed

// fetch the ethereum contract
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer); // see he solidity code from this project

    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });
    return transactionContract; // return the contract we created using solidity
}

// called in the checkIfWalletIsConnect function
export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false); // it takes time for the transaction to go through, therefore, loading required in the sendTransaction function
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount")); // this value is initialized with the variable from checkIfTransactionsExists function
    const [transactions, setTransactions] = useState([]);

    // used in welcome page and set the field change
    const handleChange = (e, name) => {
        // update new state using old state, we need callback function () => ()
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        try{
            if (!ethereum) return alert("Please install MetaMask.");

            const transactionsContract = getEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();

            //console.log(availableTransactions);

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18) // number -> hexidecimal wei -> eth
            }));

            console.log(structuredTransactions);

            setTransactions(structuredTransactions);

        } catch (error) {
            console.log(error);
        }
    }

    // check at the first load of the web page
    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                //console.log(accounts[0]);
                setCurrentAccount(accounts[0]);

              getAllTransactions();
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    // check at the first load of the web page
    const checkIfTransactionsExists = async () => {
        try{
            const transactionContract = getEthereumContract(); // get the solidity contract we created
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount); // use localstorage because we don't want it to be lost when the webpage is closed
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    // called when user click on the connect wallet button, if connected, the button would not be shown
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
    
            const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
            setCurrentAccount(accounts[0]); // connect the first account
        } catch (error) {
            console.log(error);
    
            throw new Error("No ethereum object");
        }
    };

    // logic for sending and storing transaction
    // all the transaction related functions will be called here ( the function defined using solidity on our smart_contract )
    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");

            // get the data from the form...
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract(); // get the solidity contract we created
            const parsedAmount = ethers.utils.parseEther(amount); // eth -> gwei

            // send ethereum from one address to another
            await ethereum.request({ 
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount, // from metaMask
                    to: addressTo, // from the input form
                    gas: "0x5208", // 21000 gas = 21000 gwei = 0.07usd
                    value: parsedAmount._hex // gwei -> hex
                }]
            });

            // store the transaction on the blockchain
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword); // transaction id (event emitted )

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const transactionsCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionsCount.toNumber());

            //window.reload();

        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }
    
    // check only at the load of the application due to the empty array
    useEffect(() => {
        checkIfWalletIsConnect(); 
        checkIfTransactionsExists();
    }, []);

    // inside value: if key and value are the same, we only need to provide the key 
    // e.g. connectWallet: connectWallet -> connectWallet
    return(
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                formData,
                handleChange,
                sendTransaction,
                transactions,
                isLoading
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}