// pages/sticker/sticker.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    width: 0,
    height: 0,
    scaleW: 0,
    scaleH: 0,
    pixelRatio: app.globalData.device.pixelRatio || 1,
    maxHeight: 400,
    maxWidth: 0,

    stickers: ["../../imgs/1.png", "../../imgs/2.png", "../../imgs/3.png", "../../imgs/4.png", "../../imgs/5.png", "../../imgs/6.png", "../../imgs/7.png"],
    selected_stick: [],

    touches0: {
      x: 0,
      y:0
    }
  },

  fn_select(e){
    var _this = this;

    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "step-end"
    });

    animation.scale(1, 1).rotate(0).translate(0,0).step();

    _this.data.selected_stick.push({
      url: e.target.dataset.img,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
      rectX: 0,
      rectY: 0,
      animation: animation,
      animationData: animation.export()
    });

    _this.setData({
      selected_stick: _this.data.selected_stick
    })

  },
  fn_touchstart(e){
    var _this = this;

    _this.data.touches0.x = e.touches[0].clientX;
    _this.data.touches0.y = e.touches[0].clientY;

    _this.setData({
      touches0: _this.data.touches0
    });

  },
  fn_touchmove(e){
    var _this = this;
    var xMove, yMove, i = e.target.dataset.i;

    xMove = e.touches[0].clientX - _this.data.touches0.x;
    yMove = e.touches[0].clientY - _this.data.touches0.y;

    var imgLeft = Math.round(_this.data.selected_stick[i].rectX + xMove);
    var imgTop = Math.round(_this.data.selected_stick[i].rectY + yMove);

    _this.data.selected_stick[i].translateX = imgLeft;
    _this.data.selected_stick[i].translateY = imgTop;

    _this.data.selected_stick[i].animation.translate(imgLeft, imgTop).step();
    _this.data.selected_stick[i].animationData = _this.data.selected_stick[i].animation.export();


    _this.setData({
      selected_stick: _this.data.selected_stick
    })
  },
  fn_touchend(i, e){
    var _this = this;

    _this.data.selected_stick[i].rectX = _this.data.selected_stick[i].translateX;
     _this.data.selected_stick[i].rectY = _this.data.selected_stick[i].translateY;

    _this.setData({
      selected_stick: _this.data.selected_stick
    })
  },
  fn_translate(i, e){
    var _this = this;
    var xMove, yMove;

    xMove = e.touches[0].clientX - _this.touches0.x;
    yMove = e.touches[0].clientY - _this.touches0.y;

    var imgLeft = Math.round(_this.selected_stick[i].rectX + xMove);
    var imgTop = Math.round(_this.selected_stick[i].rectY + yMove);

    _this.selected_stick[i].translateX = imgLeft;
    _this.selected_stick[i].translateY = imgTop;

    _this.selected_stick[i].animation.translate(imgLeft, imgTop).step();
    _this.selected_stick[i].animationData = _this.selected_stick[i].animation.export();

    _this.$apply();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var _this = this;

    var width = option.w,
        height = option.h,
        maxWidth = app.globalData.device.windowWidth * _this.data.pixelRatio,
        maxHeight = _this.data.maxHeight * _this.data.pixelRatio;


    var scale = width/maxWidth;

    if(height/scale > maxHeight) {
      width = width * maxHeight/height;
      height = maxHeight;
    }
    else{
      height = height / (width/maxWidth);
      width = maxWidth;
    }

    _this.setData({
      img: option.img,
      width: width,
      height: height,
      maxWidth: maxWidth,
      maxHeight: maxHeight
    });
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