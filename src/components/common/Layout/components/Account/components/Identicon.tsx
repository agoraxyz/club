import { Center, useBreakpointValue } from "@chakra-ui/react"
import Jazzicon from "@metamask/jazzicon"
import { useEffect, useRef } from "react"

type Props = {
  address: string
  size?: number
}

const Identicon = ({ address, size = 40 }: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>()
  const maxSize = useBreakpointValue({ base: "2.5rem", sm: "3.25rem" })

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(Jazzicon(size, parseInt(address.slice(2, 10), 16)))
    }
  }, [address, size])

  return (
    <Center
      boxSize={maxSize}
      maxW={maxSize}
      maxH={maxSize}
      overflow="hidden"
      rounded="full"
      ref={ref}
    />
  )
}

export default Identicon
