import { Avatar, Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react"
import { useContext } from "react"
import { Link, NavLink } from 'react-router-dom'
import { ContractContext } from "../../App"

const Navbar = () => {
    const { signer } = useContext(ContractContext)
    return (
        <Flex backgroundImage="linear-gradient(to right, #4F3BA3, #2C2E3E)" color='white' alignItems='center'>
            <Box p='2' fontSize='x-large'>
                <NavLink to='/'>NFT Marketplace</NavLink>
            </Box>
            <Box p='4' fontSize='medium'>
                <NavLink to='/list-nft'>List NFT</NavLink>
            </Box>
            <Spacer />
            <Box p='4' fontSize='medium'>
                <Text>Your address: {signer?.address}</Text>
            </Box>
        </Flex>
    )
}

export default Navbar