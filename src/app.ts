import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.less'
import { getCurrentUser } from './services/auth'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    if (!getCurrentUser()) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  })

  return children
}

export default App
