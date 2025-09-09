// pages/Hydrants/Hydrants.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hid:''
    },
    getData(id){
        wx.request({
          url: 'http://localhost:8084/Hydrants/all'+'/'+id,
          method:"GET",
          timeout: 0,
          success: (result) => {
            console.log(result.data)
            var state;
            if (result.data.data.currentStatus == 0) {
                state = "正常"
            } else if (result.data.data.currentStatuss == 1) {
                state = "故障"
            } else {
                state = "报废"
            }
            this.setData({
              HydrantId:result.data.data.id,
              currentStatus:state,
              currentPressure:result.data.data.currentPressure,
              installDate:result.data.data.installDate,
              installAddress:result.data.data.installAddress,
              CompaniesName:result.data.data.name,
              CompaniesTelephone:result.data.data.telephone,
              CompaniesAddress:result.data.data.address,
              CompaniesContacts:result.data.data.contacts,
              Companiesemail:result.data.data.email
            })
          },
          fail: (res) => {},
          complete: (res) => {},
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    tomap:function(){
        wx.switchTab({
            url: '../Map/Map',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var hid = app.hyid
        if(hid != null){
            this.getData(hid);
        }else{
            wx.request({ //向后台发送请求
                url: 'http://localhost:8084/Post/get',
                method: "GET",
                timeout: 0,
                success: (result) => {
                    var  hd = result.data;
                    console.log(hd)
                    this.getData(hd)
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})