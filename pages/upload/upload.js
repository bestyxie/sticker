// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    naturalWidth: 0,
    naturalHeight: 0
  },

  chooseImage(){
    var _this = this;

    var chooseimg = new Promise(function (resolve, reject) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

          _this.setData({
           img: res.tempFilePaths[0]
           });

          resolve(res.tempFilePaths);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
    chooseimg.then(function (files){
      return new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: files[0],
          success: function (msg){
            _this.setData({
              naturalWidth: msg.width,
              naturalHeight: msg.height
            });

            resolve();
          },
          fail: function (err){
            reject(err);
          }
        })
      });

    }).then(function (){
      wx.navigateTo({
        url: "/pages/sticker/sticker?img="+_this.data.img+"&w="+_this.data.naturalWidth+"&h="+_this.data.naturalHeight
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})