import {
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NftButton from "components/common/NftButton"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import { NFT } from "temporaryData/types"
import useUnstakeWithdrawClaim from "./hooks/useUnstakeWithdrawClaim"
import useUserNfts from "./hooks/useUserNfts"

type Props = {
  isOpen: boolean
  onClose: () => void
  depositData: Array<NFT>
}

const UnstakeModal = ({ isOpen, onClose, depositData }: Props): JSX.Element => {
  const { account, chainId, active } = useWeb3React()

  const { isValidating: isUserNftsLoading } = useUserNfts()
  const [pickedUnstakeNft, setPickedUnstakeNft] = useState(null)

  const {
    isLoading: isClaimLoading,
    onSubmit: onClaimSubmit,
    response: claimResponse,
  } = useUnstakeWithdrawClaim(pickedUnstakeNft)

  useEffect(() => {
    if (claimResponse) {
      setPickedUnstakeNft(null)
      onClose()
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
    }
  }, [claimResponse])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setPickedUnstakeNft(null)
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim & Unstake</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isUserNftsLoading ? (
            <Flex alignItems="center" justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <VStack alignItems="start">
              {depositData?.length > 0 ? (
                depositData.map((nft) => (
                  <NftButton
                    key={nft.tokenId}
                    nft={nft}
                    active={pickedUnstakeNft === nft.tokenId}
                    onClick={() => setPickedUnstakeNft(nft.tokenId)}
                  />
                ))
              ) : (
                <Text>Seems like you don't have any staked NFTs.</Text>
              )}
            </VStack>
          )}

          {pickedUnstakeNft && (
            <ScaleFade in={pickedUnstakeNft}>
              <HStack mt={4} spacing={3}>
                <Button
                  fontFamily="display"
                  w="max-content"
                  colorScheme="gray"
                  onClick={() => {
                    onClose()
                    setPickedUnstakeNft(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fontFamily="display"
                  w="max-content"
                  isLoading={isClaimLoading}
                  loadingText="Claiming"
                  colorScheme="seedclub"
                  onClick={onClaimSubmit}
                >
                  Claim & unstake
                </Button>
              </HStack>
            </ScaleFade>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UnstakeModal
