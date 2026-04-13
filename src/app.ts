import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'

import './app.less'
import { getCurrentUser } from './services/auth'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    if (!getCurrentUser()) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
