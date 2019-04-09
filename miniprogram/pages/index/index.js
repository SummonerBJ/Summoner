//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '', 
  },

  onReady: function(){
    var that = this;
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'detail',
      // 成功回调
      success: function (res) {
        console.log(res.result.data)
        that.setData({
          activities : res.result.data
        });
      }
    })
  },

  onLoad: function() {  
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        app.globalData.appid = res.result.appid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

    
  },


  toDetail: function (e) { 
        var that = this
        //拿到点击的index下标
        var index = parseInt(e.currentTarget.dataset.index);  
        //将对象转为string
        var activity =  that.data.activities[index] 
        wx.navigateTo({
          url: '../detail/detail?_id='+activity._id,
        }) 
  },

})
