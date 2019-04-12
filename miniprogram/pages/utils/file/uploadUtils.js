module.exports = {

  /**
   * 上传文件
   * 
   * @param fileName 文件名
   * @param filePath 文件路径
   * @return {"errMsg": String, "fileID": String, "statusCode": Number}
   */
  upload: function (fileName, filePath) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath
    })
  },

  /**
   * 下载文件
   * 
   * @param fileID 文件名
   * @return {"tempFilePath": String, "statusCode": Number}
   */
  download: function (fileID) {
    return wx.cloud.downloadFile({
      fileID: fileID
    })
  }
}