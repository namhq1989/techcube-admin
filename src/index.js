import dva from 'dva'
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import 'antd/dist/antd.less'
import './assets/styles/app.less'
import { LayoutModel } from './screens/layout'

// 1. Initialize
const app = dva({
  history: createHistory(),
  ...createLoading({
    effects: true,
  }),
  onError(error) {
    console.log('APP ERROR', error.message)
  }
})

// 2. Plugins
// app.use({})

// 3. Model
app.model(LayoutModel)

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')
