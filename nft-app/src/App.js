import React, { useState, useEffect } from "react"
import "./App.css"
import Web3 from "web3"
import { useWeb3React } from "@web3-react/core"
import { injected } from "../src/components/WalletConnectors"
import { Web3ReactProvider } from "@web3-react/core"
import { USER_LIST_ABI, USER_LIST_ADDR } from "./config"

function WalletConnect({ balance, contract }) {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={connect}
        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
      >
        Connect to MetaMask
      </button>
      {active ? (
        <div>
          <span>
            Connected with <b>{account}</b>
          </span>
          <p>Balance: {balance} ETH</p>
        </div>
      ) : (
        <span>Not connected</span>
      )}
      <button
        onClick={disconnect}
        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
      >
        Disconnect
      </button>
    </div>
  )
}

const getLibrary = ({ provider }) => {
  return new Web3(provider)
}

const ListUsers = ({ userList }) => {
  return (
    <div>
      <h3>List of users (wallet addresses)</h3>
      {userList.map((user) => {
        return <span key={user.id}>{user.walletAddr}</span>
      })}
    </div>
  )
}

const App = () => {
  const [balance, setBalance] = useState(0)
  const [account, setAccount] = useState("")
  const [userList, setUserList] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [contract, setContract] = useState("")

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      const balance = await web3.eth.getBalance(accounts[0])
      setBalance(web3.utils.fromWei(balance, "ether"))

      // use the contract
      const userListContract = new web3.eth.Contract(
        USER_LIST_ABI,
        USER_LIST_ADDR
      )

      setContract(userListContract)

      // call contract methods
      let userAmount = await userListContract.methods.userCount().call()
      setUserCount(userAmount)

      for (let i = 1; i <= userCount; i++) {
        console.log(userList)
        console.log(userCount)
        const user = await userListContract.methods.users(i).call()
        console.log(user)
        setUserList((prevUserList) => [...prevUserList, user])
      }
    }
    loadBlockchainData()
  }, [userCount, account])

  useEffect(() => {
    const addUser = async () => {
      console.log("adding user")
      if (contract) {
        await contract.methods
          .addUser(account)
          .call()
          .then(() => {
            console.log("added account", account)
            setUserList((prevUserList) => [...prevUserList, account])
            setUserCount((prevCount) => prevCount + 1)
          })
      }
      console.log("user count", userCount)
    }
    addUser()
  }, [account])

  return (
    <div className="App">
      <p>Your wallet: {account}</p>
      <p>User count: {userCount} </p>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletConnect balance={balance} />
      </Web3ReactProvider>
      <ListUsers userList={userList} />
    </div>
  )
}

export default App
