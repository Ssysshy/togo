export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/map/index',
    'pages/post/index',
    'pages/post-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '同邀',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.userLocation': {
      desc: '需要获取您的位置以便展示附近的同邀'
    }
  }
})