import { AppConst } from '../configs'

const getScreenSize = () => {
  const screenPx = window.innerWidth
  if (screenPx <= AppConst.screens['xs-max']) { return 'xs' }
  if ((screenPx >= AppConst.screens['sm-min'])
    && (screenPx <= AppConst.screens['sm-max'])) { return 'sm' }
  if ((screenPx >= AppConst.screens['md-min'])
    && (screenPx <= AppConst.screens['md-max'])) { return 'md' }
  if ((screenPx >= AppConst.screens['lg-min'])
    && (screenPx <= AppConst.screens['lg-max'])) { return 'lg' }
  if (screenPx >= AppConst.screens['xl-min']) { return 'xl' }
}

const isMobileScreen = () => {
  return ['xs', 'sm'].includes(getScreenSize())
}

export default () => {
  return isMobileScreen()
}
