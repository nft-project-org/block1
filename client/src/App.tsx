import { BrowserProvider, Contract, ethers, formatEther, JsonRpcProvider, JsonRpcSigner } from "ethers"
import { useEffect, useState, createContext } from "react";
import { Box, Button, Flex, Input, Text, Heading, Center } from '@chakra-ui/react'
import { nftContract } from './nftContractAbi'
import { BrowserRouter as Router } from "react-router-dom"
import { Navigate, Route, Routes } from "react-router"
import Navbar from "./components/Navbar/Navbar";
import { ListNFT } from "./components/ListNFT/ListNFT";
import { NFTsHolder } from "./components/NFTSHolder/NFTsHolder";


export const abi = nftContract.abi
export const contractAddress = '0x18E684366a8083dED54a085B56efC289A9E1BAF3'
type ContractContextType = {
  contract: Contract | null;
};
export const ContractContext = createContext<ContractContextType>({
  contract: null,
});

const App = () => {
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [balance, setBalance] = useState<string>()
  const [userCount, setUserCount] = useState<number>()
  const [userDetails, setUserDetails] = useState<any>()
  const [inputText, setInputText] = useState<string>('')
  const [noDetailsFound, setNoDetailsFound] = useState<boolean>(false)
  const [listedNFTs, setListedNFTs] = useState([])
  const [contract, setContract] = useState<Contract | null>(null)
  const [accounts, setAccounts] = useState<Array<any>>([])

  const getUserCount = async () => {
    const contract = new Contract(contractAddress, abi, signer)
    const response = await contract.getUserCount()
    setUserCount(Number(response))
  }

  useEffect(() => {
    tryInitSession()
  }, [setAccounts, setProvider, setSigner, setBalance, setUserCount, setListedNFTs, setContract])

  const tryInitSession = async () => {
    try {
      // @ts-ignore
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accs.length === 0) return
      setAccounts(accs)
    } catch (error: any) {
      console.log(error)
    }
    const provider = new ethers.JsonRpcProvider()
    const signer = await provider.getSigner()
    setProvider(provider)
    setSigner(signer)

    const balance = await provider.getBalance(signer.address)
    setBalance(formatEther(balance))
    const contract = new Contract(contractAddress, abi, signer)
    const response = await contract.getUserCount()
    setUserCount(Number(response))
    const resNTFs = await contract.getAllNftItems()
    setListedNFTs(resNTFs)
    setContract(contract)
  }

  if (accounts.length === 0) {
    return (
      <Center h="100vh" bg="linear-gradient(to right, #4F3BA3, #2C2E3E)">
        <Box maxW="md" textAlign="center">
          <Heading color="white">Ethereum Wallet Required</Heading>
          <Text color="white">
            To continue using this app, please install and connect your Ethereum wallet.
          </Text>
          <Button mt={4} colorScheme="blue" onClick={tryInitSession}>
            Connect Wallet
          </Button>
        </Box>
      </Center>
    )
  }
  console.log("last listed nft: ", listedNFTs[listedNFTs.length-1])
  return (
    <Router>
      <ContractContext.Provider value={{ contract }}>
        <Navbar />
        <Center width='100%'>
          <Flex width='50%'>
            <Routes>
              <Route path="/list-nft" element={<ListNFT setListedNFTs={setListedNFTs} />} />
              <Route path='/' element={<NFTsHolder nfts={listedNFTs} />} />
            </Routes>
          </Flex>
        </Center>
      </ContractContext.Provider>
    </Router>
  )
}

export default App
