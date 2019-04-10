// pages/savePhoto/savePhoto.js
import WxValidate from '../../js/WxValidate.js'
var adds = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    albums: [],
    chooseAblums: "",
    parent_id: ""
  },
  chooseImage: function(e) {
    var that = this;
    if (that.data.files.length < 9) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }
      })
    } else {
      wx.showToast({
        title: '最多上传九张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 保存照片提交
   */
  confirm: function(e) {
    var that = this;
    that.data.filesSuccess = [];
    var formData = e.detail.value; //获取表单所有input的值 
    if (!this.WxValidate.checkForm(formData)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    adds = formData;
    this.upload();
    wx.showToast({
      title: '已提交发布！',
      duration: 3000
    });
  },
  upload: function() {
    var that = this;
    for (var i = 0; i < that.data.files.length; i++) {
      const filePath = that.data.files[i];
      // 上传图片
      const cloudPath = 'disney/disney' + i + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res);
          adds.field = res.fileID;
          const db = wx.cloud.database()
          db.collection('user_photo').add({
            // data 字段表示需新增的 JSON 数据
            data: adds,
            success: res => { 
            },
            fail: e => {
              console.error('[保存] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '保存',
              })
            }
          })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },
  /**
   * 显示错误信息
   */
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  /**
   * 选择相册
   */
  openAlbum: function() {
    var that = this;
    var list = [];
    for (var index in that.data.albums) {
      list.push(that.data.albums[index].image_name);
    }
    wx.showActionSheet({
      itemList: list,
      success: function(res) {
        if (!res.cancel) {
          //选中赋值
          that.setData({
            chooseAblums: that.data.albums[res.tapIndex].image_name,
            parent_id: that.data.albums[res.tapIndex]._id
          });
        } else {
          that.setData({
            chooseAblums: "",
            parent_id: ""
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //查询相册数据
    var that = this;
    const db = wx.cloud.database()
    db.collection('user_info').where({
      parent_id: "0"
    }).get({
      success(res) {
        // res.data 是包含以上定义的两条记录的数组 
        that.data.albums = res.data;
      }
    })
    //初始化验证
    this.initValidate();
  },
  /**
   * 表单验证
   */
  initValidate() {
    const rules = {
      image_name: {
        required: true,
        rangelength: [2, 6]
      },
      author: {
        required: true,
        rangelength: [2, 4]
      },
      parent_id:{
        required: true
      }
    }

    const messages = {
      image_name: {
        required: '请输入图片名字',
        rangelength: '图片名称长度2-6个字符或汉字'
      },
      author: {
        required: '请输入作者',
        rangelength: '作者长度2-4个字符或汉字'
      },
      parent_id: {
        required: '请选择相册'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})