// pages/savePhoto/savePhoto.js
import WxValidate from '../../js/WxValidate.js';
import FileUtils from '../utils/file/fileUtils.js';
import UploadUtils from '../utils/file/uploadUtils.js';
import Db from '../utils/db/db.js';
var adds = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    albums: [],
    chooseAblums: "",
    parent_id: "",
    mask: false
  },
  chooseImage: function(e) {
    var that = this;
    if (that.data.files.length < 9) {
      FileUtils.chooseImage().then(res =>
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        }));
    } else {
      wx.showToast({
        title: '最多上传九张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  previewImage: function(e) {
    FileUtils.previewImage(e.currentTarget.id, this.data.files)
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
  },
  upload: function() {
    var that = this;
    for (var i = 0; i < that.data.files.length; i++) {
      const filePath = that.data.files[i];
      var num = Math.floor(Math.random() * 100000 + 1);
      // 上传图片
      const cloudPath = 'disney/disney' + num + filePath.match(/\.[^.]+?$/)[0];
      UploadUtils.upload(cloudPath, filePath).then(res => {
          console.log('[上传文件] 成功：', res);
          adds.field = res.fileID;
          adds.create_time = new Date();
          Db.add(adds, 'user_photo').then(
            res => {
              console.log('[相册图片] 保存成功：', res);
            },
            err => {
              console.error('[保存] 失败：', err)
              wx.showToast({
                icon: 'none',
                title: '保存失败'
              });
            }) 
        },
        err => {
          console.error('[上传] 失败：', err)
          wx.showToast({
            icon: 'none',
            title: '上传失败'
          });
        }
      )
    }
    wx.showToast({
      title: '已提交发布！',
      duration: 3000,
      success:function(){  
        setTimeout(wx.redirectTo({
          url: '../detail/detail?_id=' + that.data.parent_id,
        }), 2000)
      }
    })
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
    if (that.data.albums.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先添加相册'
      });
      return;
    }
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
    var where = {
      parent_id: "0"
    };
    Db.query('user_info', where).then(
      res => {
        that.data.albums = res.data;
      },
      err => {
        console.error('[相册数据] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '相册数据获取失败'
        });
      }
    )
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
      parent_id: {
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