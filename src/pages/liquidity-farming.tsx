import {
  Button,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
import Countdown from "components/index/Countdown"
import useCreateIncentive from "components/liquidity-farming/hooks/useCreateIncentive"
import useEndIncentive from "components/liquidity-farming/hooks/useEndIncentive"
import useStakingRewards from "components/liquidity-farming/hooks/useStakingRewards"
import useSumLiquidity from "components/liquidity-farming/hooks/useSumLiquidity"
import useSumUnclaimedRewards from "components/liquidity-farming/hooks/useSumUnclaimedRewards"
import useUserNfts from "components/liquidity-farming/hooks/useUserNfts"
import StakeModal from "components/liquidity-farming/StakeModal"
import UnstakeModal from "components/liquidity-farming/UnstakeModal"
import useTokenData from "hooks/useTokenData"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useMemo, useState } from "react"
import incentiveKey from "temporaryData/incentiveKey"
import unique from "utils/uniqueFilter"

const LiquidityFarmingPage = (): JSX.Element => {
  // Modals
  const {
    onOpen: onNftListModalOpen,
    onClose: onNftListModalClose,
    isOpen: isNftListModalOpen,
  } = useDisclosure()
  const {
    onOpen: onDepositNftsModalOpen,
    onClose: onDepositNftsModalClose,
    isOpen: isDepositNftsModalOpen,
  } = useDisclosure()

  const { account } = useWeb3React()
  const {
    data: [, rewardTokenSymbol],
  } = useTokenData(process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS)
  const {
    isLoading: isToken0Loading,
    tokenSymbol: liquidityToken0Symbol,
    tokenImage: liquidityToken0Image,
  } = useTokenDataWithImage(process.env.NEXT_PUBLIC_TOKEN0_ADDRESS)
  const {
    isLoading: isToken1Loading,
    tokenSymbol: liquidityToken1Symbol,
    tokenImage: liquidityToken1Image,
  } = useTokenDataWithImage(process.env.NEXT_PUBLIC_TOKEN1_ADDRESS)

  const [ended, setEnded] = useState(false)

  const { data: userNfts } = useUserNfts()

  const {
    isValidating,
    data: [incentiveInfo, depositTransferred, nftName],
  } = useStakingRewards()

  const incentiveData = useMemo(
    () =>
      incentiveInfo?.find(
        (i) => parseFloat(i.args.endTime) === parseFloat(incentiveKey.endTime)
      ),
    [incentiveInfo]
  )

  const depositData = useMemo(
    () =>
      depositTransferred
        ?.filter(unique)
        ?.filter((tokenId) => !userNfts?.includes(tokenId)) || [],
    [depositTransferred, userNfts]
  )

  const sumLiquidity = useSumLiquidity(depositData)
  const sumUnclaimedRewards = useSumUnclaimedRewards(depositData)

  // For development testing only!
  const { isLoading: isCreateIncentiveLoading, onSubmit: onCreateIncentive } =
    useCreateIncentive()
  const { isLoading: isEndIncentiveLoading, onSubmit: onEndIncentive } =
    useEndIncentive()

  return (
    <PageContent
      title={
        <>
          Seed Club <br />
          Liquidity Farming
        </>
      }
      layoutTitle="Liquidity Farming"
      header={
        <SimpleGrid gridTemplateColumns="3rem 3rem">
          {account && (
            <>
              <TokenImage
                isLoading={isToken0Loading}
                tokenSymbol={liquidityToken0Symbol}
                tokenImage={liquidityToken0Image}
              />
              <TokenImage
                isLoading={isToken1Loading}
                tokenSymbol={liquidityToken1Symbol}
                tokenImage={liquidityToken1Image}
              />
            </>
          )}
        </SimpleGrid>
      }
      subTitle={`Stake ${nftName} to earn ${rewardTokenSymbol}`}
    >
      {isValidating && <Spinner size="lg" />}

      {incentiveData && !isValidating && !ended && (
        <>
          <VStack spacing={1} fontSize="xl">
            <Countdown
              timestamp={parseFloat(incentiveKey.endTime)}
              endText="Liquidity Farming ended"
              long
              onEnd={() => setEnded(true)}
            />
            <Text>
              Pool reward: {formatUnits(incentiveData.args?.reward, 18)}{" "}
              {rewardTokenSymbol}
            </Text>
          </VStack>

          <SimpleGrid gridTemplateColumns="1fr 1fr" gap={8}>
            <VStack>
              <Text as="span" fontSize="3xl">
                {parseFloat(sumUnclaimedRewards) > 0.0 ? sumLiquidity : "-"}
              </Text>
              <Text as="span">Staked liquidity</Text>
            </VStack>

            <VStack>
              <Text as="span" fontSize="3xl">
                {parseFloat(sumUnclaimedRewards) > 0.0 ? sumUnclaimedRewards : "-"}
              </Text>
              <Text as="span">Unclaimed {rewardTokenSymbol}</Text>
            </VStack>
          </SimpleGrid>

          <SimpleGrid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={2}
            pt={4}
          >
            <Button
              letterSpacing="wide"
              colorScheme="seedclub"
              onClick={onNftListModalOpen}
            >
              Deposit & Stake
            </Button>

            <Button
              isDisabled={!depositData || depositData.length === 0}
              letterSpacing="wide"
              colorScheme="gray"
              variant="outline"
              onClick={onDepositNftsModalOpen}
            >
              Claim & Unstake
            </Button>
          </SimpleGrid>
        </>
      )}
      {(!account || isValidating) && !ended && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}
      {ended && (
        <>
          <Text fontSize="xl">This incentive has ended!</Text>
          {depositData?.length > 0 && (
            <Button
              colorScheme="seedclub"
              letterSpacing="wide"
              onClick={onDepositNftsModalOpen}
            >
              Claim rewards & Unstake NFTs
            </Button>
          )}
        </>
      )}

      <StakeModal isOpen={isNftListModalOpen} onClose={onNftListModalClose} />
      <UnstakeModal
        isOpen={isDepositNftsModalOpen}
        onClose={onDepositNftsModalClose}
        depositData={depositData}
      />

      {false && (
        <>
          <Button isLoading={isCreateIncentiveLoading} onClick={onCreateIncentive}>
            Create Incentive
          </Button>
          <Button isLoading={isEndIncentiveLoading} onClick={onEndIncentive}>
            End Incentive
          </Button>
        </>
      )}
    </PageContent>
  )
}

export default LiquidityFarmingPage
