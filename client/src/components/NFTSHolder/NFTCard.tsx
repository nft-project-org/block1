import { Box, Image, Text, VStack, Button, Flex } from '@chakra-ui/react';

interface NFTCardProps {
    id: BigInt;
    uri: string;
    owner: string;
    creator: string;
    price: BigInt;
}

export const NFTCard = ({ id, uri, creator, price, owner }: NFTCardProps) => {
    return (
        <VStack borderWidth="1px" borderRadius="lg" p='5'>
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
                        {price.toString()} ETH
                    </Text>
                </Box>
                <Button mt={5}>Buy</Button>
            </Flex>
        </VStack>
    );
};
