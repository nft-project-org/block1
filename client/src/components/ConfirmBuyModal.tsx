import { Box, Image, Text, VStack, Button, Flex, useToast, Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from "react-router"
import { ContractContext } from '../App';

interface ConfirmBuyModalProps {
    isOpen: boolean,
    onClose: any
    setListedNFTs: any
}

export const ConfirmBuyModal = ({ isOpen, onClose, setListedNFTs }: ConfirmBuyModalProps) => {
    const { contract, selectedNFT } = useContext(ContractContext)
    const toast = useToast()

    const buyNFT = async () => {
        if (!contract) return
        try {
            await contract.buyToken(selectedNFT?.id)
        } catch (err: any) {
            toast({
                title: err.message ? err.message : err,
                status: 'error',
                isClosable: true,
            })
            return
        }
        toast({
            title: 'NFT bought succesfully!',
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
                                {selectedNFT?.price.toString()} ETH
                            </Text>
                        </Box>
                        <Button mt={5} onClick={buyNFT}> Confirm</Button>
                    </Flex>
                </VStack>
            </ModalContent>
        </Modal>
    );
};