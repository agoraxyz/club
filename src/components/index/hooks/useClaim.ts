import { useWeb3React } from "@web3-react/core"
import MerkleDistributor from "constants/MerkleDistributor"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import MERKLE_ABI from "static/abis/MerkleDistributorAbi.json"
import parseError from "utils/parseError"

const useClaim = () => {
  const { active, account } = useWeb3React()
  const merkleDistributorData = useMemo(
    () => MerkleDistributor.claims[account],
    [account]
  )

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS : null,
    MERKLE_ABI,
    true
  )

  const toast = useToast()

  const claim = async () => {
    const claimRes = await contract?.claim(
      merkleDistributorData?.index,
      account,
      merkleDistributorData?.amount,
      merkleDistributorData?.proof
    )
    return claimRes?.wait()
  }

  return useSubmit<null, any>(claim, {
    onError: (e) => {
      toast({
        title: "Error claiming tokens",
        description: parseError(e),
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfully claimed tokens!",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useClaim
