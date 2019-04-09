// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database()

exports.main = (event, context) => {
  try {
    return  db.collection('user_info').where({
      parent_id: '0'
    }).get()
  } catch (e) {
    console.log(e)
  }
}
