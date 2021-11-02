import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import ERC20_ABI from "static/abis/erc20abi.json"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const useCreateIncentive = () => {
  const { active, account } = useWeb3React()

  const erc20Contract = useContract(
    active ? addresses.REWARD_TOKEN_ADDRESS : null,
    ERC20_ABI,
    true
  )

  const stakerContract = useContract(
    active ? addresses.STAKER_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const toast = useToast()

  const createIncentive = async () => {
    // DEV: creating an incentive
    const reward = parseEther("200")
    const approve = await erc20Contract.approve(addresses?.STAKER_ADDRESS, reward)
    await approve.wait()
    const START_TIME = Math.ceil(+new Date() / 1000 + 120)
    const END_TIME = Math.ceil(+new Date() / 1000 + 120 + 24 * 60 * 60)
    console.log(START_TIME, END_TIME) // Don't forget to copy it from the console LOL
    return stakerContract.createIncentive(
      {
        ...dev.INCENTIVEKEY,
        startTime: START_TIME,
        endTime: END_TIME,
      },
      reward
    )
  }

  return useSubmit<null, any>(createIncentive, {
    onError: (e) => {
      console.log(e)
      toast({
        title: "Error creating incentive",
        description: e?.message,
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfully submitted transaction!",
        description:
          "It might take some time to finalize the transaction. Please check your wallet for more details.",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useCreateIncentive