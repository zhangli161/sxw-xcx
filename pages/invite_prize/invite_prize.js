// pages/invite_prize/invite_prize.js
const app = getApp()
const util = require('../../utils/util.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Img_code: '',
    gold: '60',
    user: '12'
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

    //获得图片
    util.getInviteQR({}, function(res) {
      console.log(res)
      wx.downloadFile({
        url: res,
        success: function(res1) {
          that.setData({
            Img_code: res1.tempFilePath
          })
          var canvas = wx.createCanvasContext('canvas');
          that.drawCanvas(canvas);
        }
      });
    }, null)

    //获得设备宽高
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowW: res.windowWidth,
          canvasW:res.windowWidth,
          windowH: res.windowHeight,
          canvasH:res.windowWidth
        })
      },
    })
  },

  drawCanvas: function(canvas) {
    var that = this;
    var windowW = that.data.canvasW;
    var windowH = that.data.canvasH;
    var qr = that.data.Img_code;
    canvas.setFillStyle('#01C46C')
    canvas.fillRect(0, 0, windowW, windowH);
    canvas.drawImage(qr, windowW / 2 - 80, windowW / 2 - 100, 160, 160);
    canvas.setFillStyle('white');
    canvas.setFontSize(18);
    canvas.fillText('买纱卖纱到中国纱线网', windowW / 2 - 110, windowW / 2 - 120)
    canvas.fillText('长按识别进入小程序', windowW / 2 - 89, windowW / 2+102)
    canvas.draw(true, setTimeout(function() {
      // that.daochu()
    }, 500));

  },


  // src: 'https://i03picsos.sogoucdn.com/fd902999d59c1dc2'


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log();
  },

  daochu: function () {
    console.log('导出');
    var that = this;
    var windowW = that.data.canvasW;
    var windowH = that.data.canvasH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowH,
      destWidth: windowW,
      destHeight: windowH,
      canvasId: 'canvas',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
          }
        })
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
    const that = this;
    return {
      title: '我分享了纱线网小程序',
      path: 'pages/index/index?userid=' +app.globalData.DTuserInfo.userid,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          duration: 1000
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})