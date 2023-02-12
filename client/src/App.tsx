import { BrowserProvider, Contract, ethers, formatEther, JsonRpcProvider, JsonRpcSigner } from "ethers"
import { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'


const abi = [
  "function userCount() view returns (uint256)",
  "function addUser(address walletAddr)",
  "function getUserDetails(address walletAddr) view returns (tuple(address a, uint256[] b, uint256[] c, uint256[] e, uint256[] f))"
]

const contractAddress = '0xd898720d88238228111611770f61838C82b2d97F'

const App = () => {
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [balance, setBalance] = useState<string>()
  const [userCount, setUserCount] = useState<number>()
  const [userDetails, setUserDetails] = useState<any>()
  const [inputText, setInputText] = useState<string>('')
  const [noDetailsFound, setNoDetailsFound] = useState<boolean>(false)

  const getUserCount = async () => {
    const contract = new Contract(contractAddress, abi, signer)
    const response = await contract.userCount()
    setUserCount(Number(response))
  }

  useEffect(() => {
    const getWallet = async () => {
      // @ts-ignore
      if (window.ethereum == null) {
        console.log('Ethereum not installed!')
        return
      }
      const provider = new ethers.JsonRpcProvider()
      const signer = await provider.getSigner()
      setProvider(provider)
      setSigner(signer)

      const balance = await provider.getBalance(signer.address)
      setBalance(formatEther(balance))
      const contract = new Contract(contractAddress, abi, signer)
      const response = await contract.userCount()
      setUserCount(Number(response))
    }
    getWallet()
  }, [setProvider, setSigner, setUserCount])

  const addUser = async () => {
    const contract = new Contract(contractAddress, abi, signer)
    await contract.addUser(signer?.address)
    await getUserCount()
  }

  const getUserDetails = async () => {
    const contract = new Contract(contractAddress, abi, signer)
    try {
      const response = await contract.getUserDetails(inputText)
      setUserDetails(response)
      setNoDetailsFound(false)
    } catch (err) {
      setNoDetailsFound(true)
      console.log(err)
    }
  }

  const handleInput = (event: any) => {
    const value = event.target.value
    setInputText(value)
  }

  return (
    <Box p={5}>
      <Box>
        <Text>Address: {signer?.address}</Text>
        <Text>Balance: {balance}</Text>
        <Text>User count: {userCount}</Text>
        <Button colorScheme='blue' onClick={addUser}>Add User</Button>
      </Box>
      <Box mt={5}>
        <Flex>
        <Input w={'600px'} onChange={handleInput} placeholder='User Address' />
        <Button colorScheme='blue' onClick={getUserDetails}>Get User Details</Button>
        </Flex>
        {
          userDetails ?
            <Box p={5}>
              <Text>Got Details</Text>
              <Text>Address: {userDetails[0]}</Text>
              <Text>Owned nfts: {userDetails[1].length}</Text>
              <Text>ListedNfts nfts: {userDetails[1].length}</Text>
              <Text>BoughtNfts nfts: {userDetails[2].length}</Text>
              <Text>BoughtNfts nfts: {userDetails[3].length}</Text>
            </Box>
            : noDetailsFound ? <Box p={5}><Text>No details found</Text></Box> : <></>
        }
      </Box>
    </Box>
  )
}

export default App
