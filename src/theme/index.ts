import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import colors from "./colors"
import components from "./components"
import styles from "./styles"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors,
  space: {
    11: "2.75rem",
  },
  sizes: {
    22: "5.5rem",
  },
  fonts: {
    body: "GT America, sans-serif",
    heading: "ITC Garamond Condensed, sans-serif",
    display: "ITC Garamond Book Narrow, sans-serif",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components,
  styles,
})

export default theme
