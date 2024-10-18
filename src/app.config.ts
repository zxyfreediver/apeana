export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/pb/index',
    'pages/plan/index',
    'pages/profile/index'
  ],
  tabBar: {
    color: '#333',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '练习',
      },
      // {
      //   pagePath: 'pages/plan/index',
      //   text: '制定'
      // },
      {
        pagePath: 'pages/pb/index',
        text: '挑战PB'
      },
      // {
      //   pagePath: 'pages/profile/index',
      //   text: '我的'
      // }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
