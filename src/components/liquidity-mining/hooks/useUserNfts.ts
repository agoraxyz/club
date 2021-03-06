import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { NFT } from "data/types"
import useContract from "hooks/useContract"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import useSWR from "swr"

const getNftData =
  (contract: Contract, address: string) =>
  async (_: string): Promise<Array<NFT>> => {
    const nfts = []

    try {
      const balanceOfRaw = await contract.balanceOf(address)
      const balanceOf = +formatUnits(balanceOfRaw, 0)

      for (let i = 0; i < balanceOf; i++) {
        const nftRaw = await contract.tokenOfOwnerByIndex(address, i)
        const nft = +formatUnits(nftRaw, 0)
        const positions = await contract.positions(nft)
        const { token0, token1, fee, liquidity } = positions

        nfts.push({
          tokenId: nft,
          fee,
          token0,
          token1,
          liquidity: parseFloat(formatUnits(liquidity)).toFixed(2),
          canStake:
            token0.toLowerCase() ===
              process.env.NEXT_PUBLIC_TOKEN0_ADDRESS.toLowerCase() &&
            token1.toLowerCase() ===
              process.env.NEXT_PUBLIC_TOKEN1_ADDRESS.toLowerCase(),
        })
      }
    } catch (error) {
      if (error.code === Logger.errors.CALL_EXCEPTION) return []
      throw error
    }

    return nfts
  }

const useUserNfts = () => {
  const { active, account, chainId } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI
  )

  const swrResponse = useSWR<Array<NFT>>(
    active ? ["nfts", chainId, account] : null,
    getNftData(contract, account),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? undefined,
  }
}

export default useUserNfts
