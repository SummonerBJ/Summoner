// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = wx.cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('user_info').get();
  } catch (e) {
    console.error(e);
  }
}