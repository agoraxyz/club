import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import useSWR from "swr"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const getNftData =
  (contract: Contract, address: string) =>
  async (_: string): Promise<Array<any>> => {
    const nfts = []

    try {
      const balanceOfRaw = await contract.balanceOf(address)
      const balanceOf = +formatUnits(balanceOfRaw, 0)

      for (let i = 0; i < balanceOf; i++) {
        const nftRaw = await contract.tokenOfOwnerByIndex(address, i)
        const nft = +formatUnits(nftRaw, 0)
        const positions = await contract.positions(nft)
        const { token0, token1 } = positions

        if (token0 === dev.TOKEN0_ADDRESS && token1 === dev.TOKEN1_ADDRESS)
          nfts.push(nft)
      }
    } catch (error) {
      if (error.code === Logger.errors.CALL_EXCEPTION) return []
      throw error
    }

    return nfts
  }

const useUserNfts = (userAddress: string) => {
  const { active, account, chainId } = useWeb3React()

  const contract = useContract(
    active ? addresses.NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI
  )

  const swrResponse = useSWR<Array<any>>(
    active ? ["nfts", chainId, account] : null,
    getNftData(contract, userAddress),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
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