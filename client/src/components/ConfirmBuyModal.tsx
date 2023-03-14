import { Box, Image, Text, VStack, Button, Flex, useToast, Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from "react-router"
import { ContractContext } from '../App';
import { ethers } from 'ethers';

interface ConfirmBuyModalProps {
    isOpen: boolean,
    onClose: any
    setListedNFTs: any
}

export const ConfirmBuyModal = ({ isOpen, onClose, setListedNFTs }: ConfirmBuyModalProps) => {
    const { contract, selectedNFT, signer, browserProvider } = useContext(ContractContext)
    const toast = useToast()

    const buyNFT = async () => {
        if (!contract) return
        try {
            console.log(selectedNFT?.id)
            const from = await signer?.getAddress()
            const options = { 
                from,
                gasLimit: BigInt(10000000),
                value: selectedNFT?.price
            };
           await contract.buyToken(selectedNFT?.id, options)
        } catch (err: any) {
            toast({
                title: err.message ? err.message : err,
                status: 'error',
                isClosable: true,
            })
            return
        }
        toast({
            title: 'Processing buy. Metamask will notify when transction is ready',
            status: 'success',
            isClosable: true,
        })
        const resNTFs = await contract.getAllNftItems()
        setListedNFTs(resNTFs)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <VStack borderWidth="1px" borderRadius="lg" p='5'>
                    <Image src={selectedNFT?.uri} alt={`NFT for buy`} w="250" h="250" />
                    <Flex flexDirection='column'>
                        <Box alignItems="baseline" mt={3}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                                URI:
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">{selectedNFT?.uri}</Text>
                        </Box>
                        <Box alignItems="baseline">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                                Creator:
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">{selectedNFT?.creator}</Text>
                        </Box>
                        <Box alignItems="baseline">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                                Owner:
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">{selectedNFT?.owner}</Text>
                        </Box>
                        <Box alignItems="baseline">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                                Price:
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">
                                {selectedNFT?.price.toString()} WEI
                            </Text>
                        </Box>
                        <Button mt={5} onClick={buyNFT}> Confirm</Button>
                    </Flex>
                </VStack>
            </ModalContent>
        </Modal>
    );
};