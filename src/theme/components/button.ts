import { mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantSolid(props: Dict) {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)
    const disabledBg = mode(`gray.200`, `whiteAlpha.300`)(props)

    return {
      bg,
      _disabled: { bg: disabledBg },
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg: disabledBg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    }
  }

  if (c === "seedclub") {
    return {
      bg: "seedclub.green.900",
      borderColor: "seedclub.green.900",
      borderWidth: 2,
      _disabled: {
        bg: "seedclub.green.900",
      },
      color: "white",
      _hover: {
        bg: "seedclub.white",
        color: "seedclub.green.900",
        _disabled: {
          bg: "seedclub.green.900",
        },
      },
      _active: { bg: "seedclub.white", color: "seedclub.green.900" },
    }
  }

  if (c === "white") {
    return {
      bg: "seedclub.white",
      _disabled: {
        bg: "seedclub.white",
      },
      color: "seedclub.green.900",
      _hover: {
        bg: "gray.200",
        _disabled: {
          bg: "seedclub.white",
        },
      },
      _active: { bg: "gray.300" },
    }
  }

  const bg = `${c}.500`

  return {
    bg,
    color: "white",
    _hover: {
      bg: mode(`${c}.600`, `${c}.400`)(props),
      _disabled: { bg },
    },
    _active: { bg: mode(`${c}.700`, `${c}.300`)(props) },
  }
}

const variantSolidStatic = (props: Dict) => {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)

    return {
      bg,
    }
  }

  return {
    bg: mode(`${c}.500`, `${c}.200`)(props),
    color: mode("white", `gray.800`)(props),
  }
}

const variantOutline = (props: Dict) => {
  const { theme, colorScheme: c } = props

  return {
    border: "2px solid",
    borderColor:
      c !== "gray"
        ? mode(`${c}.500`, transparentize(`${c}.300`, 0.8)(theme))(props)
        : undefined,
  }
}

const styles = {
  baseStyle: {
    borderRadius: "md",
    fontFamily: "display",
    fontWeight: "normal",
  },
  sizes: {
    md: {
      fontFamily: "heading",
      fontSize: "xl",
      h: 10,
    },
    xl: {
      fontFamily: "heading",
      fontSize: "2rem",
      h: "3.25rem",
      lineHeight: "3.25rem",
      px: 8,
    },
  },
  variants: {
    solid: variantSolid,
    solidStatic: variantSolidStatic,
    outline: variantOutline,
  },
}

export default styles
