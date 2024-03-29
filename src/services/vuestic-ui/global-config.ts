import VaIcon from './components/va-icon'
import iconsConfig from './icons-config/icons-config'
import colors from './themes'

export default {
  colors,
  icons: iconsConfig,
  breakpoint: {
    enabled: true,
    bodyClass: true,
    thresholds: {
      xs: 0,
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    VaIcon,
  },
}
