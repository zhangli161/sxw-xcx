// pages/search/search.js
const app = getApp();
const util = require('../../utils/util.js')
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    supply_next_page: [{
      mid: 5,
      next_page: 1
    }],
    buy_next_page: [{
      mid: 6,
      next_page: 1
    }],
    fjmy_next_page: [{
      mid: 88,
      next_page: 1
    }],
    all_next_page: {
      mid: 0,
      next_page: 1
    },
    BCPage: 1,
    hint: '',
    array: ['全部', '供应', '求购','名片'],
    objectArray: [{
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '供应'
      },
      {
        id: 2,
        name: '求购'
      },
      // {
      //   id: 3,
      //   name: '纺机'
      // },
      {
        id: 4,
        name: '名片'
      }
    ],
    index: '0',
    recently_history: [],
    hot_word: [],
    lable: [{
      id: '0',
      lable_Info: '面纱'
    }, {
      id: '1',
      lable_Info: '进口棉'
    }, {
      id: '2',
      lable_Info: '包漂'
    }, {
      id: '3',
      lable_Info: '面纱'
    }, {
      id: '4',
      lable_Info: '气流纺'
    }, {
      id: '5',
      lable_Info: '针织纱用'
    }, {
      id: '6',
      lable_Info: '涡流纺'
    }, {
      id: '7',
      lable_Info: '环锭纱'
    }, {
      id: '8',
      lable_Info: '免费拿样'
    }, {
      id: '9',
      lable_Info: '送货上门'
    }, {
      id: '10',
      lable_Info: '面纱'
    }, {
      id: '11',
      lable_Info: '进口棉'
    }, ],

    messageList: [],
    searching: false,
    hint: ''
  },

  //联系商家
  phoneClick: function(e) {
    if (e.currentTarget.dataset.mobile == '') {
      wx.showToast({
        title: '暂无手机号',
        icon: 'none',
        duration: 1500
      })
    } else {
    util.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    }, e.currentTarget.dataset.buys > 0 || e.currentTarget.dataset.mid != 5)
    }
  },

//获取输入框的值
  seekInput: function(e) {
    that.setData({
      seekInp: e.detail.value
    })
  },

  addHistory: function() {
    var s = new Set();
    var arrb = [];
    var arr = wx.getStorageSync('history') ? wx.getStorageSync('history') : []
    s = arr;
    arr.unshift(that.data.seekInp);
    s.forEach(function(data){
      arrb.unshift(data)
    })
    console.log(arrb)
    that.setData({
      recently_history: arrb
    });
    wx.setStorage({
      key: 'history',
      data: arrb,
    })
  },

  sethistoryClick: function(e) {
    that.data.seekInp = e.currentTarget.dataset.history;
    that.seekClick();
    that.setData({
      seekInp: that.data.seekInp
    })
  },

//清空记录
  clear: function() {
    that.setData({
      recently_history: []
    });
    wx.setStorage({
      key: 'history',
      data: [],
    })
  },

  seekClick: function() {
    console.log(that.data.seekInp)
    if (that.data.seekInp != undefined && that.data.seekInp != ''){
    console.log('点击搜索', that.data.index)
    that.setData({
      messageList: [],
      hint: '',
      supply_next_page: [{
        mid: 5,
        next_page: 1
      }],
      buy_next_page: [{
        mid: 6,
        next_page: 1
      }],
      fjmy_next_page: [{
        mid: 88,
        next_page: 1
      }],
      all_next_page: {
        mid: 0,
        next_page: 1
      },
      BCPage: 1
    });
    switch (that.data.index) {
      case '0':
        that.ALLSearch();
        break;
      case '1':
        that.setData({
          sell_next_page: 1
        })
        that.SupplySearch();
        break;

      case '2':
        that.BuySearch();
        break;
      case '3':
      that.BussinessCardSearch();
        break;

      // case '3':
      //   that.FrameSearch();
      //   break;
      // case '4':
      //   that.BussinessCardSearch();
      //   break
    
    }
    that.addHistory();
    setTimeout(function() {
      that.setData({
        hint: '未找到对应搜索结果'
      })
    }, 2000)
    }else{
      wx.showToast({
        title: '输入为空',
        icon:'none',
        duration: 1500
      })
    }
  },

  //查询全部 
  ALLSearch: function() {
    console.log('搜索全部')
    that.setData({
      searching: true
    })
    if (that.data.all_next_page.next_page !== null) {
      var param = {
        page: that.data.all_next_page.next_page,
        keyword: that.data.seekInp,
      };
      console.log(param)

      util.showLoading();
      util.InfoSearch(param, function(datas) {
        console.log("全部列表获取完成", datas)
        wx.hideLoading()
        if (typeof(datas) == 'undefined') {
          that.data.all_next_page.next_page = null;
          that.setData({
            all_next_page: that.data.all_next_page,
          })
          return;
        }

        var messageList = []

        that.data.all_next_page.next_page++;
        if (datas.length < 1) {
          that.data.all_next_page.next_page = null;
        }

        for (var idx in datas) {
          var data = datas[idx];
          if (data.businesscard) {
            if (data.mid != 2) {
              messageList.push({
                id: data.itemid, //信息id
                mid: data.mid,
                userid: data.businesscard.userid, //userid
                head_portrait_icon: data.businesscard ? (data.businesscard.avatarUrl ? data.businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
                icon_vip: data.businesscard.vip, //  0===非vip 1-3==vip  
                name: data.businesscard ? data.businesscard.truename : "未知", //用户姓名
                position: data.businesscard ? data.businesscard.career : "", //职位
                demand: '纺机', //发布类别  ()
                mobile: data.mobile,
                company: data.businesscard.buys > 0 ? util.hiddenCompany(data.businesscard.company) : data.businesscard.company, //公司
                buys: data.businesscard.buys,//发布供应信息的总条数
                lableList: data.tags,
                details: data.introduce, //信息详情描述
                I_agree: data.I_agree,
                I_favortie: data.I_favortie,
                message_Img: //详情图片  后续跟进
                  [{
                      message_Image: data.thumb
                    },
                    {
                      message_Image: data.thumb1
                    },
                    {
                      message_Image: data.thumb2
                    }
                  ],
                time: util.formatTime(new Date(data.addtime * 1000)), //发布时间
                addtime: data.addtime, //发布详细时间
                address: data.address, //货物存放地
                page_view: data.hits, //浏览量
                favorite: data.favorite, //收藏
                like: data.agree //点赞
              })
            } else {
              messageList.push({
                id: data.businesscard.userid, //信息id
                  mid: 2,
                head_portrait_icon: data.businesscard ? (data.businesscard.avatarUrl ? data.businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
                //   icon_vip: data.vip, //  0===非vip 1-3==vip  
                name: data.businesscard ? data.businesscard.truename : "未知", //用户姓名
                position: data.businesscard ? data.businesscard.career : "", //职位
                //   demand: '纺机', //发布类别  ()
                //   mobile: data.mobile,
                company: data.businesscard.buys > 0 ? util.hiddenCompany(data.businesscard.company) : data.businesscard.company, //公司
                //   lableList: data.tags,
                business: data.businesscard.business,
                businesscard: data.businesscard,
                //   details: data.introduce, //信息详情描述
                //   message_Img: //详情图片  后续跟进
                //     [{
                //       message_Image: ret.data[i].thumb
                //     },
                //     {
                //       message_Image: ret.data[i].thumb1
                //     },
                //     {
                //       message_Image: ret.data[i].thumb2
                //     }
                //     ],
                //   time: ret.data[i].adddate, //发布时间
                //   addtime: ret.data[i].addtime, //发布详细时间
                //   address: ret.data[i].address, //货物存放地
                //   page_view: ret.data[i].hits, //浏览量
                //   like: ret.data[i].agree //点赞
              })
            }
          }
        }
        // messageList = that.sort(messageList)
        messageList = that.data.messageList.concat(messageList)
        console.log("消息列表",messageList)
        that.setData({
          all_next_page: that.data.all_next_page,
          messageList: messageList,

        })
      }, null)
    }
  },

//搜索供应
  SupplySearch: function() {
    that.setData({
      searching: true
    })
    var interfaces = [];
    for (var i in that.data.supply_next_page) {
      interfaces.push({
        param: {
          keyword: that.data.seekInp,
          page: that.data.supply_next_page[i].next_page
        },
        func: that.data.supply_next_page[i].mid == 5 ? util.SupplySearch : (
          that.data.supply_next_page[i].mid == 6 ? util.BuySearch : (
            that.data.supply_next_page[i].mid == 88 ? util.FrameSearch : null
          )
        )
      })
    }
    var checkparam = function(Interface) {
      if (Interface.param.page)
        return true;
      else
        return false;
    }
    var callback = function(rets) {
      wx.hideLoading()
      var messageList = []
      var supply_next_page = that.data.supply_next_page;

      for (var idx in rets) {
        var ret = rets[idx];
        if (ret) {
          for (var i in ret.data)
            if (ret.data[i].businesscard)
              messageList.push({
                id: ret.data[i].itemid, //信息id
                mid: that.data.supply_next_page[idx].mid,
                userid: ret.data[i].businesscard.userid, //userid
                head_portrait_icon: ret.data[i].businesscard ? (ret.data[i].businesscard.avatarUrl ? ret.data[i].businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
                icon_vip: ret.data[i].businesscard.vip, //  0===非vip 1-3==vip  
                name: ret.data[i].businesscard ? ret.data[i].businesscard.truename : "未知", //用户姓名
                position: ret.data[i].businesscard ? ret.data[i].businesscard.career : "", //职位
                demand: '供应', //发布类别
                mobile: ret.data[i].mobile,
                company: ret.data[i].businesscard.buys > 0 ? util.hiddenCompany(ret.data[i].businesscard.company) : ret.data[i].businesscard.company, //公司
                buys: ret.data[i].businesscard.buys,//发布供应信息的总条数
                lableList: ret.data[i].tags,
                details: ret.data[i].introduce, //信息详情描述
                I_agree: ret.data[i].I_agree,
                I_favortie: ret.data[i].I_favortie,
                message_Img: //详情图片  后续跟进
                  [{
                      message_Image: ret.data[i].thumb
                    },
                    {
                      message_Image: ret.data[i].thumb1
                    },
                    {
                      message_Image: ret.data[i].thumb2
                    }
                  ],
                time: util.formatTime(new Date(ret.data[i].addtime * 1000)), //发布时间
                addtime: ret.data[i].addtime, //发布详细时间
                address: ret.data[i].address, //货物存放地
                page_view: ret.data[i].hits, //浏览量
                favorite: ret.data[i].favorite, //收藏
                like: ret.data[i].agree //点赞
              })
        }
        supply_next_page[idx].next_page = ret ? (ret.current_page < ret.last_page ? ret.current_page + 1 : null) : null
      }
      messageList = that.sort(messageList)
      messageList = that.data.messageList.concat(messageList)
      that.setData({
        supply_next_page: supply_next_page,
        messageList: messageList,

      })

    }
    util.showLoading();
    that.requestInterfaces(interfaces, checkparam, callback)
  },


  BuySearch: function() {
    console.log('搜索求购')
    that.setData({
      searching: true
    })
    var interfaces = [];
    for (var i in that.data.buy_next_page) {
      interfaces.push({
        param: {
          keyword: that.data.seekInp,
          page: that.data.buy_next_page[i].next_page
        },
        func: that.data.buy_next_page[i].mid == 5 ? util.SupplySearch : (
          that.data.buy_next_page[i].mid == 6 ? util.BuySearch : (
            that.data.buy_next_page[i].mid == 88 ? util.FrameSearch : null
          )
        )
      })
    }
    var checkparam = function(Interface) {
      if (Interface.param.page)
        return true;
      else
        return false;
    }
    var callback = function(rets) {
      console.log("求购列表获取完成", rets)
      wx.hideLoading()
      var messageList = []
      var buy_next_page = that.data.buy_next_page;

      for (var idx in rets) {
        var ret = rets[idx];
        if (ret) {
          for (var i in ret.data)
            if (ret.data[i].businesscard)
              messageList.push({
                id: ret.data[i].itemid, //信息id
                mid: that.data.buy_next_page[idx].mid,
                userid: ret.data[i].businesscard.userid, //userid
                head_portrait_icon: ret.data[i].businesscard ? (ret.data[i].businesscard.avatarUrl ? ret.data[i].businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
                icon_vip: ret.data[i].businesscard.vip, //  0===非vip 1-3==vip  
                name: ret.data[i].businesscard ? ret.data[i].businesscard.truename : "未知", //用户姓名
                position: ret.data[i].businesscard ? ret.data[i].businesscard.career : "", //职位
                demand: '纺机', //发布类别  ()
                mobile: ret.data[i].mobile,
                company: ret.data[i].businesscard ? util.hiddenCompany(ret.data[i].businesscard.company) : "", //公司
                buys:ret.data[i].businesscard.buys,//发布供应信息的总条数
                lableList: ret.data[i].tags,
                details: ret.data[i].introduce, //信息详情描述
                I_agree: ret.data[i].I_agree,
                I_favortie: ret.data[i].I_favortie,
                message_Img: //详情图片  后续跟进
                  [{
                      message_Image: ret.data[i].thumb
                    },
                    {
                      message_Image: ret.data[i].thumb1
                    },
                    {
                      message_Image: ret.data[i].thumb2
                    }
                  ],
                time: util.formatTime(new Date(ret.data[i].addtime * 1000)), //发布时间
                addtime: ret.data[i].addtime, //发布详细时间
                address: ret.data[i].address, //货物存放地
                page_view: ret.data[i].hits, //浏览量
                favorite: ret.data[i].favorite, //收藏
                like: ret.data[i].agree //点赞
              })
        }
        buy_next_page[idx].next_page = ret ? (ret.current_page < ret.last_page ? ret.current_page + 1 : null) : null
      }
      messageList = that.sort(messageList)
      messageList = that.data.messageList.concat(messageList)
      that.setData({
        buy_next_page: buy_next_page,
        messageList: messageList,

      })

    }
    util.showLoading();
    that.requestInterfaces(interfaces, checkparam, callback)
  },

//搜索纺机(暂时去掉该模块隐藏)
  FrameSearch: function() {
    console.log('搜索纺机')
    that.setData({
      searching: true
    })
    var interfaces = [];
    for (var i in that.data.fjmy_next_page) {
      interfaces.push({
        param: {
          keyword: that.data.seekInp,
          page: that.data.fjmy_next_page[i].next_page
        },
        func: that.data.fjmy_next_page[i].mid == 5 ? util.SupplySearch : (
          that.data.fjmy_next_page[i].mid == 6 ? util.BuySearch : (
            that.data.fjmy_next_page[i].mid == 88 ? util.FrameSearch : null
          )
        )
      })
    }
    var checkparam = function(Interface) {
      if (Interface.param.page)
        return true;
      else
        return false;
    }
    var callback = function(rets) {
      console.log("纺机获取完成", rets)
      wx.hideLoading()
      var messageList = []
      var fjmy_next_page = that.data.fjmy_next_page;

      for (var idx in rets) {
        var ret = rets[idx];
        if (ret) {
          for (var i in ret.data)
            if (ret.data[i].businesscard)
              messageList.push({
                id: ret.data[i].itemid, //信息id
                mid: that.data.fjmy_next_page[idx].mid,
                userid: ret.data[i].businesscard.userid, //userid
                head_portrait_icon: ret.data[i].businesscard ? (ret.data[i].businesscard.avatarUrl ? ret.data[i].businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
                icon_vip: ret.data[i].businesscard.vip, //  0===非vip 1-3==vip  
                name: ret.data[i].businesscard ? ret.data[i].businesscard.truename : "未知", //用户姓名
                position: ret.data[i].businesscard ? ret.data[i].businesscard.career : "", //职位
                demand: '纺机', //发布类别  ()
                mobile: ret.data[i].mobile,
                company: ret.data[i].businesscard ? util.hiddenCompany(ret.data[i].businesscard.company) : "", //公司
                buys: ret.data[i].businesscard.buys,//发布供应信息的总条数
                lableList: ret.data[i].tags,
                details: ret.data[i].introduce, //信息详情描述
                I_agree: ret.data[i].I_agree,
                I_favortie: ret.data[i].I_favortie,
                message_Img: //详情图片  后续跟进
                  [{
                      message_Image: ret.data[i].thumb
                    },
                    {
                      message_Image: ret.data[i].thumb1
                    },
                    {
                      message_Image: ret.data[i].thumb2
                    }
                  ],
                time: util.formatTime(new Date(ret.data[i].addtime * 1000)), //发布时间
                addtime: ret.data[i].addtime, //发布详细时间
                address: ret.data[i].address, //货物存放地
                page_view: ret.data[i].hits, //浏览量
                favorite: ret.data[i].favorite, //收藏
                like: ret.data[i].agree //点赞
              })
        }
      fjmy_next_page[idx].next_page = ret ? (ret.current_page < ret.last_page ? ret.current_page + 1 : null) : null
      }
      messageList = that.sort(messageList)
      messageList = that.data.messageList.concat(messageList)
      that.setData({
        fjmy_next_page: fjmy_next_page,
        messageList: messageList,

      })

    }
    util.showLoading();
    that.requestInterfaces(interfaces, checkparam, callback)
  },

//搜索名片信息
  BussinessCardSearch: function() {
    var param = {
      userid: wx.getStorageSync('DTUserinfo').userid,
      _token: wx.getStorageSync('DTUserinfo')._token,
      keyword: that.data.seekInp,
      page: that.data.BCPage
    };
    if (!param.page) {
      console.log(param);
      return
    }
    util.showLoading();
    that.setData({
      searching: true
    })
    util.BussinessCardSearch(param, function(ret) {
      console.log('名片信息返回', ret)
      // that.data.messageList.push(ret.data)
      if (ret)
        for (var i in ret.data) {
          that.data.messageList.push({
            id: ret.data[i].businesscard.userid, //信息id
            //   mid: 2,
            head_portrait_icon: ret.data[i].businesscard ? (ret.data[i].businesscard.avatarUrl ? ret.data[i].businesscard.avatarUrl : '../../images/index/head_portrait.png') : '../../images/index/head_portrait.png', //头像，后面是默认头像
            //   icon_vip: ret.data[i].vip, //  0===非vip 1-3==vip  
            name: ret.data[i].businesscard ? ret.data[i].businesscard.truename : "未知", //用户姓名
            position: ret.data[i].businesscard ? ret.data[i].businesscard.career : "", //职位
            //   demand: '纺机', //发布类别  ()
            //   mobile: ret.data[i].mobile,
            company: ret.data[i].businesscard.buys > 0 ? util.hiddenCompany(ret.data[i].businesscard.company) : ret.data[i].businesscard.company, //公司
            //   lableList: ret.data[i].tags,
            business: ret.data[i].businesscard.business,
            businesscard: ret.data[i].businesscard,
            //   details: ret.data[i].introduce, //信息详情描述
            //   message_Img: //详情图片  后续跟进
            //     [{
            //       message_Image: ret.data[i].thumb
            //     },
            //     {
            //       message_Image: ret.data[i].thumb1
            //     },
            //     {
            //       message_Image: ret.data[i].thumb2
            //     }
            //     ],
            //   time: ret.data[i].adddate, //发布时间
            //   addtime: ret.data[i].addtime, //发布详细时间
            //   address: ret.data[i].address, //货物存放地
            //   page_view: ret.data[i].hits, //浏览量
            //   like: ret.data[i].agree //点赞
          })
        }
      that.data.messageList = that.sort(that.data.messageList)
      that.data.BCPage = ret.current_page < ret.last_page ? that.data.BCPage + 1 : null;
      that.setData({
        BCPage: that.data.BCPage,
        messageList: that.data.messageList
      })
      wx.hideLoading();
    });
  },

  //排序
  sort: function(messageALL) {
    var arr = messageALL;
    console.log("排序", arr);
    for (var i = 0; i < arr.length; i++)
      for (var u = i + 1; u < arr.length; u++) {
        if (arr[i].addtime < arr[u].addtime) {
          //如果 array[i] > <array[u] ，就声明一个缓存遍历 num 存放大的数据，然后把两个数据的下标进行更换，达到升序排序的效果。
          var num = arr[i];
          arr[i] = arr[u];
          arr[u] = num;
        }
      }

    for (var i = 0; i < arr.length; i++) {
      for (var u = i + 1; u < arr.length; u++) {
        if (arr[i].icon_vip < arr[u].icon_vip) {
          //如果 array[i] > <array[u] ，就声明一个缓存遍历 num 存放大的数据，然后把两个数据的下标进行更换，达到升序排序的效果。
          var num = arr[i];
          arr[i] = arr[u];
          arr[u] = num;
        }
      }
    }

    return arr;
  },

  getSystemKeyValue: function() {
    util.getSystemKeyValue({
      id: 7
    }, function(ret) {
      console.log(ret)
      var arrb = [];
      if (ret.value) {
        arrb = ret.value.split(",")
      }
      that.setData({
        hot_word: arrb,
      })
    }, null)

  },

  //选择
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: '' + e.detail.value,
      messageList: [],
      hint:''
    })
    that.seekClick();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var index = options.index
    that.setData({
      index: '' + (index ? index : 0)
    })
    console.log(33333333333, index, that.data.index);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var history = wx.getStorageSync("history") ? wx.getStorageSync("history") : [];
    that.setData({
      recently_history: history
    })
    that.getSystemKeyValue();
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
  onReachBottom: function(e) {
    console.log("触底加载", that.data.index)
    switch (that.data.index) {
      case '0':
        that.ALLSearch();
        break;
      case '1':
        that.SupplySearch();
        break;
      case '2':
        that.BuySearch();
        break;
      case '3':
        that.FrameSearch();
        break;
      case '4':
        that.BussinessCardSearch();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //查看
  messageList_click: function(e) {
    wx.navigateTo({
      url: '../store_particulars/store_particulars?id=' + e.currentTarget.dataset.id,
    })
    for (var i in that.data.messageList) {
      if (that.data.messageList[i].id == e.currentTarget.dataset.id) {
        that.data.messageList[i].businesscard.view++;
      }
    }
    that.setData({
      messageList: that.data.messageList
    })
  },

  //点赞 取消
  setLikeClick: function(e) {
    const that = this;
    var index = e.currentTarget.dataset.index
    console.log("改变收藏信息", index, that.data.messageList[index])
    console.log(e.currentTarget.dataset.mid, e.currentTarget.dataset.id)

    if (that.data.messageList[index].id == e.currentTarget.dataset.id && that.data.messageList[index].mid == e.currentTarget.dataset.mid) {
      if (that.data.messageList[index].I_agree == false) {
        var param = {
          item_mid: e.currentTarget.dataset.mid,
          item_id: e.currentTarget.dataset.id
        };
        util.setLike(param, function(res) {
          console.log('点赞', res, that.data.messageList[index]);
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000
          })
          that.data.messageList[index].I_agree = true;
          that.data.messageList[index].like++;

          that.setData({
            messageList: that.data.messageList
          })
        }, null)
      } else {
        var param = {
          item_mid: e.currentTarget.dataset.mid,
          item_id: e.currentTarget.dataset.id,
          cancle: '1'
        };
        util.setLike(param, function(res) {
          console.log('取消点赞', res, that.data.messageList[index], that.data.messageList);
          that.data.messageList[index].I_agree = false;
          that.data.messageList[index].like--;
          that.setData({
            messageList: that.data.messageList
          })
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          })
        }, null)
      }
      that.setData({
        messageList: that.data.messageList
      })
    }
  },

  //关注 取消
  enshrineClick: function(e) {
    const that = this;
    var index = e.currentTarget.dataset.index
    console.log("改变收藏信息", index, that.data.messageList[index])
    console.log(e.currentTarget.dataset.mid, e.currentTarget.dataset.id)

    if (that.data.messageList[index].id == e.currentTarget.dataset.id && that.data.messageList[index].mid == e.currentTarget.dataset.mid) {
      if (that.data.messageList[index].I_favortie == false) {
        var param = {
          // userid: wx.getStorageSync('DTUserinfo').userid.userid,
          // _token: wx.getStorageSync('DTUserinfo')._token,
          mid: e.currentTarget.dataset.mid,
          tid: e.currentTarget.dataset.id
        };
        util.enshrine(param, function(res) {
          console.log('收藏', res, that.data.messageList[index]);
          wx.showToast({
            title: '关注成功',
            icon: 'none',
            duration: 2000
          })
          that.data.messageList[index].I_favortie = true;
          that.data.messageList[index].favorite++;

          that.setData({
            messageList: that.data.messageList
          })
        }, null)
      } else {
        var param = {
          // userid: wx.getStorageSync('DTUserinfo').userid.userid,
          // _token: wx.getStorageSync('DTUserinfo')._token,
          mid: e.currentTarget.dataset.mid,
          tid: e.currentTarget.dataset.id,
          cancle: '1'
        };
        util.enshrine(param, function(res) {
          console.log('取消收藏', res, that.data.messageList[index], that.data.messageList);

          that.data.messageList[index].I_favortie = false;
          that.data.messageList[index].favorite--;

          that.setData({
            messageList: that.data.messageList
          })
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          })

        }, null)
      }
      that.setData({
        messageList: that.data.messageList
      })

    }

  },


  //查看详情
  see_details_click: function(e) {
    wx.navigateTo({
      url: '../particulars/particulars?id=' + e.currentTarget.dataset.id + '&mid=' + e.currentTarget.dataset.mid,
    })
    for (var i in that.data.messageList) {
      if (that.data.messageList[i].id == e.currentTarget.dataset.id && that.data.messageList[i].mid == e.currentTarget.dataset.mid) {
        that.data.messageList[i].page_view++;
      }
    }
    that.setData({
      messageList: that.data.messageList
    })
  },
  searching: function() {
    that.setData({
      searching: false
    })
  },

  requestInterfaces: function(interfaces, checkparam, callback, rets) {
    console.log("请求", interfaces, checkparam, callback, rets)
    if (typeof(rets) == 'undefined') {
      rets = [];
      //默认返回数组为空
    }

    if (interfaces.length == 0) {
      //全部接口请求完，执行函数
      callback(rets)
    } else {

      var IFC = interfaces.shift()
      //取出首个接口
      if (!checkparam(IFC)) {
        rets.push(null)
        that.requestInterfaces(interfaces, checkparam, callback, rets)
      } else IFC.func(IFC.param,
        function(ret) {
          rets.push(ret)
          that.requestInterfaces(interfaces, checkparam, callback, rets)
        },
        function(ret) {
          rets.push(null)
          that.requestInterfaces(interfaces, checkparam, callback, rets)
        });

    }
  },

  //图片预览
  previewImClick: function(e) {
    console.log(1111, e.currentTarget)
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var index = e.currentTarget.dataset.index;
    var urls = [];
    for (var i in that.data.messageList[idx].message_Img) {
      urls.push(that.data.messageList[idx].message_Img[i].message_Image)
    }
    console.log(that.data.messageList[idx].message_Img[index],
      that.data.messageList[idx].message_Img)
    wx.previewImage({
      current: that.data.messageList[idx].message_Img[index].message_Image,
      urls: urls // 需要预览的图片http链接列表
    })
  }
})