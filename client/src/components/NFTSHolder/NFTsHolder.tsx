import { Flex, Box, Center, Heading } from "@chakra-ui/react"
import { NFTCard } from "./NFTCard"

interface PropsNFTsHolder {
    nfts: Array<any>;
}

export const NFTsHolder: React.FC<PropsNFTsHolder> = ({ nfts }) => {
    if (nfts.length < 1) return (
        <Center h="50vh">
            <Box maxW="md" textAlign="center">
                <Heading>
                    No NFTs listed yet. Be the first to list and take over the market
                </Heading>
            </Box>
        </Center>
    )

    for (const i of nfts) {
        console.log(console.log(i[1]))
    }
    const nftElements = [...nfts].reverse().map(nft => 
        <NFTCard key={nft[0]} id={nft[0]} uri={nft[1]} price={nft[2]} owner={nft[3]} creator={nft[4]} isListed={nft[5]}  />
    )

    return (
        <Flex direction='column' width='100%'>
            {nftElements}
        </Flex>
    )
}