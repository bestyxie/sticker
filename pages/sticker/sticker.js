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
    naturalW: 0,
    naturalH: 0,
    scale: 1,
    pixelRatio: app.globalData.device.pixelRatio || 1,
    maxHeight: 400,
    maxWidth: 0,
    start_time: 0,
    end_time: 0,
    sticker_w: 80,
    sticker_h: 80,
    canvasId: "canvas",
    tempFile: "",
    saveSuccess: false,

    stickers: ["../../imgs/1.png", "../../imgs/2.png", "../../imgs/3.png", "../../imgs/4.png", "../../imgs/5.png", "../../imgs/6.png", "../../imgs/7.png"],
    selected_stick: [],

    touches0: {
      x: 0,
      y:0
    },
    defaultAngle: 0
  },

  fn_select(e){
    var _this = this;
    var list = _this.data.selected_stick;

    var animation = wx.createAnimation({
      duration: 0,

      timingFunction: 'linear'
    });

    animation.scale(1, 1).rotate(0).translate(0,0).step();

    for(var i = 0, len = list.length; i<len; i++){
      list[i].focus = false;
    }

    wx.getImageInfo({
      src: e.target.dataset.img,
      success(res){
        var scale = res.width/_this.data.sticker_w;
        list.push({
          url: e.target.dataset.img,
          rotate: 0,
          width: _this.data.sticker_w,
          height: res.height/scale,
          x: _this.width/2,
          y: _this.height/2,
          distance: 0,
          translateX: 0,
          translateY: 0,
          scale: 1,
          rectX: 0,
          rectY: 0,
          oldRotate: 0,
          oldScale: 1,
          oldDistance: 0,
          animation: animation,
          animationData: animation.export(),
          focus: true
        });

        _this.setData({
          selected_stick: list
        });
      }
    })

  },
  fn_touchstart(e){
    var _this = this;
    var i = e.target.dataset.i;

    if(i != undefined){
      var imgobj = _this.data.selected_stick[i];
      var touches1 = {
        clientX: _this.data.width/2 + _this.data.sticker_w/2 + imgobj.translateX,
        clientY: _this.data.height/2 + _this.data.sticker_h/2 + imgobj.translateY
      };

      _this.defaultAngle = _this.getAngle(e.touches[0].clientX, e.touches[0].clientY, touches1.clientX, touches1.clientY);
      _this.fn_focus(e);
    }


    _this.data.touches0.x = e.touches[0].clientX;
    _this.data.touches0.y = e.touches[0].clientY;

    _this.setData({
      touches0: _this.data.touches0
    });
  },
  fn_touchmove(e){
    var _this = this;
    /*var xMove, yMove, i = e.target.dataset.i;

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
    });*/

    var i = e.target.dataset.i;
    var imgobj = _this.data.selected_stick[i];
    var touches1 = {
      clientX: (_this.data.width/2 + _this.data.sticker_w/2 + imgobj.rectX + imgobj.translateX)/_this.data.pixelRatio,
      clientY: (_this.data.height/2 + _this.data.sticker_h/2 + imgobj.rectY + imgobj.translateY)/_this.data.pixelRatio
    };

    var scale_msg = _this.getNewScale(imgobj.oldScale, imgobj.oldDistance, e.touches[0], touches1);

    imgobj.scale = scale_msg.newScale > 2 ? 2 : (scale_msg.newScale<0.5? 0.5 : scale_msg.newScale);
    imgobj.distance = scale_msg.newDistance;
    imgobj.rotate = _this.getNewRotate(e.touches[0], {clientX: _this.data.touches0.x, clientY: _this.data.touches0.y}, imgobj.oldRotate, _this.data.defaultAngle);

    imgobj.animation.scale(imgobj.scale, imgobj.scale).rotate(imgobj.rotate).step();
    imgobj.animationData = imgobj.animation.export();

    _this.setData({
      selected_stick: _this.data.selected_stick
    });

  },
  fn_touchend(e){
    var _this = this;

    var i = e.target.dataset.i,
      imgobj = _this.data.selected_stick[i];

    imgobj.rectX = imgobj.translateX;
    imgobj.rectY = imgobj.translateY;
    imgobj.oldDistance = imgobj.distance;
    imgobj.oldScale = imgobj.scale;
    imgobj.oldRotate = imgobj.rotate;

    _this.setData({
      selected_stick: _this.data.selected_stick
    })
  },
  fn_translate(e){
    var _this = this;
    var xMove, yMove;
    var i = e.target.dataset.i,
        imgobj = _this.data.selected_stick[i];

    xMove = e.touches[0].clientX - _this.data.touches0.x;
    yMove = e.touches[0].clientY - _this.data.touches0.y;

    var imgLeft = Math.round(_this.data.selected_stick[i].rectX + xMove);
    var imgTop = Math.round(_this.data.selected_stick[i].rectY + yMove);

    imgobj.translateX = imgLeft;
    imgobj.translateY = imgTop;
    imgobj.x = _this.data.width/2 + imgLeft*_this.data.pixelRatio;
    imgobj.y = _this.data.height/2 + imgTop*_this.data.pixelRatio;

    //imgobj.animation.translate(imgLeft, imgTop).step();
    //imgobj.animationData = imgobj.animation.export();


    _this.setData({
      selected_stick: _this.data.selected_stick
    });

  },
  fn_delete(e){
    var _this = this;
    var i = e.target.dataset.i;

    _this.data.selected_stick.splice(i, 1);

    _this.setData({
      selected_stick: _this.data.selected_stick
    })
  },
  fn_focus(e){
    var _this = this;
    var i = e.target.dataset.i,
        list = _this.data.selected_stick;

    for(var n=0, len=list.length; n< len; n++){
      list[n].focus = false;
    }

    list[i].focus = true;

    _this.setData({
      selected_stick: list
    })
  },
  fn_confirm(e){
    var _this = this;
    var list = _this.data.selected_stick;
    var data = _this.data,
        pixelRatio = data.pixelRatio,
        base_scale = data.scale,
        c_w = data.naturalW,
        c_h = data.naturalH,
        w, h, t_x, t_y, scale, c_t_x, c_t_y;

    const ctx = wx.createCanvasContext(_this.data.canvasId);

    ctx.drawImage( data.img, 0,0, c_w*pixelRatio, c_h*pixelRatio);

    for(var i=0, len = list.length; i< len; i++){
      w = list[i].width;
      h = list[i].height;
      t_x = list[i].translateX;
      t_y = list[i].translateY;
      scale = list[i].scale;
      
      c_t_x = Math.round(c_w/2+w*base_scale/2+t_x*pixelRatio*base_scale+base_scale*scale)*pixelRatio;
      c_t_y = Math.round(c_h/2+h*base_scale/2+t_y*pixelRatio*base_scale+base_scale*scale)*pixelRatio;

      ctx.save();
      //ctx.scale(base_scale, base_scale);
      //ctx.translate(c_w/2+w*base_scale*scale/2+t_x*base_scale, c_h/2+data.sticker_h*base_scale*scale/data.pixelRatio/2+t_y*base_scale);
      ctx.translate(c_t_x, c_t_y);
      ctx.rotate(list[i].rotate * Math.PI / 180);

      /*ctx.rect(0, 0, data.naturalW, data.naturalH);
      ctx.setFillStyle('red');
      ctx.fill();*/

      ctx.drawImage(list[i].url, -w*pixelRatio*base_scale*scale/2, -h*pixelRatio*base_scale*scale/2, w*pixelRatio*base_scale*scale, h*pixelRatio*base_scale*scale);
      ctx.restore();
    }

    ctx.draw(false, function (){
      wx.canvasToTempFilePath({
        destWidth: _this.data.naturalW,
        destHeight: _this.data.naturalH,
        canvasId: _this.data.canvasId,
        fileType: "jpg",
        success: function (res) {
          _this.setData({
            tempFile: res.tempFilePath
          });

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              /*wx.navigateTo({
                url: "/pages/upload/upload"
              })*/
            },
            fail: function (res) {
              wx.showToast({
                icon: "none",
                title: "保存失败"
              })
            }
          })
        }
      })
    });

  },
  /**
   * 获取缩放值
   * */
  getNewScale(oldScale, oldDistance, touch0, touch1) {
    var xMove, yMove, newDistance;

    // 计算二指最新距离
    xMove = Math.round(touch1.clientX - touch0.clientX);
    yMove = Math.round(touch1.clientY - touch0.clientY);
    newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));

    return {
      newScale: oldScale + 0.005 * (newDistance - oldDistance),
      newDistance: newDistance
    }
  },
  /**
   * 获取旋转值
   * @param touch0 {Object} 第一根手指的坐标
   * @param touch1 {Object} 第二根手指的坐标
   * @param oldAngle {Number}
   * @param defaultAngle {Number} 两指的线段与x轴之间形成的角度
   * */
  getNewRotate(touch0, touch1, oldAngle, defaultAngle){
    var _this = this;

    var newAngle = _this.getAngle(touch1.clientX, touch1.clientY, touch0.clientX, touch0.clientY) - defaultAngle + oldAngle;
    newAngle = newAngle > 360 ? newAngle-360 : newAngle;

    return newAngle;
  },
  /**
   * @param px {Number} 第二个点的x坐标
   * @param py {Number} 第二个点的y坐标
   * @param mx {Number} 第一个点的x坐标
   * @param my {Number} 第一个点的y坐标
   * */
  getAngle(px, py, mx, my){
    var angle = 0;

    if(mx == px && my > py){ /*-y轴*/
      angle = 90;
    }
    else if(mx == px && my < py){/*y轴*/
      angle = 270;
    }
    else if(mx < px && my == py){/*-x轴*/
      angle = 180;
    }
    else if(mx > px && my == py){/*x轴*/
      angle = 0;
    }
    else {
      if(mx > px && my < py){/*第一象限*/
        angle = 360 - 180*Math.atan(Math.abs(my-py)/Math.abs(mx-px))/Math.PI
      }
      if(mx > px && my > py){/*第二象限*/
        angle = 180*Math.atan(Math.abs(my-py)/Math.abs(mx-px))/Math.PI
      }
      if(mx < px && my > py){/*第三象限*/
        angle = 180 - 180*Math.atan(Math.abs(my-py)/Math.abs(mx-px))/Math.PI
      }
      if(mx < px && my < py){/*第四象限*/
        angle = 180 + 180*Math.atan(Math.abs(my-py)/Math.abs(mx-px))/Math.PI
      }
    }


    return angle;

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
      naturalW: option.w,
      naturalH: option.h,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      scale: option.w/width
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