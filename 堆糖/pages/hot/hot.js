// pages/hot/hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //开始id  页码
    start:0,
    datalist:[],
    word:"杨幂"

  },
  getdata:function(start){
    // 获取原列表数据
    const datalist=this.data.datalist 

    // 获取关键字
    const word=this.data.word
    const that=this
    wx.request({
      url: "https://www.duitang.com/napi/blogv2/list/by_search/?kw="+word+"&after_id=0"+start+"&type=feed&include_fields=top_comments%2Cis_root%2Csource_link%2Citem%2Cbuyable%2Croot_id%2Cstatus%2Clike_count%2Clike_id%2Csender%2Calbum%2Creply_count%2Cfavorite_blog_id&_type=&_=1653556378347",
      dataType: "json", 
      success: (result) => {
      //  console.log(result.data.status)
      //  判断返回状态码为1则为拿到数据 为4则为没有数据
       if (result.data.status===1) {
         that.setData({
          // 进行原列表和新列表合并后重新赋值
          datalist:datalist.concat(result.data.data.object_list)
        })
       }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置页面title
    wx.setNavigationBarTitle({
      title: '堆糖热门推荐',
    })
    // 拿到页码数据
    const start= this.data.start
    this.getdata(start)
    
  },
  // 搜索关键词监听
  search:function(e){
    // console.log(e.detail.value)
    const word=e.detail.value
    if (!word) {
      this.setData({
        word:"迪丽热巴"
      })
      return
    }
    this.setData({
      word:word
    })
  },
  //搜索触发
  clickSearch:function(){
    // 清空数据
    //页码归0
    this.setData({
      datalist:[],
      start:0
    })
    // 拿到页码渲染
    const start= this.data.start
    this.getdata(start)
  },
  // 点击图片挑战详情页
  imgshow:function(e){
    const index=e.target.dataset.index
    // 拿到自定义属性绑定的id
    // 通过id查找数组当中的本条数据
    // console.log(this.data.datalist[index])
     
    // 解析有价值数据进行组合传递
    const title=this.data.datalist[index].msg
    const time=this.data.datalist[index].add_datetime_pretty
    const photo=this.data.datalist[index].photo.path
    const username=this.data.datalist[index].sender.username
    const userpic=this.data.datalist[index].sender.avatar
    // 定义参数对象
    const msgobj={
      title,
      time,
      photo,
      username,
      userpic
    }
    //挑转
    wx.navigateTo({
      url:  "../detail/detail",
      // 回调函数当中进行参数对象传递
      success:function(res){
           res.eventChannel.emit('dataFromOpenerPageA',{data:msgobj})
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
    })
    // console.log("触底")
    let start= this.data.start
    start+=24
    // console.log(start)
    this.getdata(start)
    this.setData({
      start:start
    })
    setTimeout(function(){
      wx.hideLoading()
    },1000)
    // 瞬移到顶部
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})