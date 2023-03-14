import { Box, Button, Flex, Input, Text, Heading, InputGroup, InputRightElement, Image, useToast } from '@chakra-ui/react'
import { useEffect, useState, createContext, useContext } from "react"
import { useNavigate } from "react-router"
import { ContractContext } from '../../App'


interface ListNFTProps {
    setListedNFTs: any;
}

export const ListNFT = ({setListedNFTs}: ListNFTProps) => {
    const navigate = useNavigate()
    const toast = useToast()
    const [uri, setUri] = useState('')
    const [price, setPrice] = useState('')
    const [previewUri, setPreviewUri] = useState('')
    const { contract } = useContext(ContractContext)

    const tryListNFT = async () => {
        if (!contract) return
        try {
            await contract.createAndListToken(BigInt(price), uri);
        } catch (err: any) {
            toast({
                title: err.message ? err.message : err,
                status: 'error',
                isClosable: true,
            })
            return
        }
        toast({
            title: 'Processing new NFT. Metamask will notify when transction is ready',
            status: 'success',
            isClosable: true,
        })
        const resNTFs = await contract.getAllNftItems()
        setListedNFTs(resNTFs)
        navigate('/')
    }

    return (
        <Flex
            direction='column'
            width='100%'
            alignItems='center'
            borderWidth='1px' padding='4'
            height='50vh'
        >
            <Heading size='md' mb='12'>New NFT</Heading>
            <Image paddingBottom={15} w="250" h="250" src={previewUri} alt={`Show Image by clicking find`} />
            <InputGroup>
                <Input
                    placeholder='uri'
                    value={uri}
                    onChange={({ target }) => setUri(target.value)}
                />
                <InputRightElement>
                    <Button onClick={() => setPreviewUri(uri)}>Find</Button>
                </InputRightElement>
            </InputGroup>
            <Input
                placeholder='price in WEI'
                value={price}
                onChange={({ target }) => setPrice(target.value)}
            />
            <Button onClick={tryListNFT} mt='6' isDisabled={uri === '' || price === ''}>List</Button>
        </Flex>
    )
}