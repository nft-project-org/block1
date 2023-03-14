import { Box, Image, Text, VStack, Button, Flex } from '@chakra-ui/react';
import { useContext } from 'react';
import { ContractContext } from '../../App';

interface NFTCardProps {
    id: BigInt;
    uri: string;
    owner: string;
    creator: string;
    price: BigInt;
    isListed: boolean;
}

export const NFTCard = ({ id, uri, creator, price, owner, isListed }: NFTCardProps) => {
    const { signer, setSelectedNFT, onOpen } = useContext(ContractContext)

    const buyClicked = () => {
        setSelectedNFT({
            id,
            uri,
            creator,
            price,
            owner
        })
        onOpen()
    }

    return (
        <VStack borderWidth="1px" borderRadius="lg" p='5' m={5} backgroundColor={ isListed ? "#fcfcfc" : "#e8e6e6" }>
            <Image src={uri} alt={`NFT for sale`} />
            <Flex flexDirection='column'>
                <Box alignItems="baseline" mt={3}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                        URI:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">{uri}</Text>
                </Box>
                <Box alignItems="baseline">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                        Creator:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">{creator}</Text>
                </Box>
                <Box alignItems="baseline">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                        Owner:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">{owner}</Text>
                </Box>
                <Box alignItems="baseline">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mr={2}>
                        Price:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                        {isListed ? price.toString() + "WEI" : "Sold"} 
                    </Text>
                </Box>
                { isListed ? 
                    <Button mt={5} isDisabled={owner.toLowerCase() === signer?.address?.toLowerCase()} onClick={buyClicked}>Buy</Button> :
                    <></>
                }
            </Flex>
        </VStack>
    );
};
