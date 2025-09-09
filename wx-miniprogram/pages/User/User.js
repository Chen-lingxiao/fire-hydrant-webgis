// pages/User/User.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgsrc:"../../icon/未注册用户.png",
        txtbt: "注册 / 登录",
        uname: '',
        uphone:'',
        islogin: ''
    },
    getPhoneNumber (e) {
        //encrytedata加密数据 iv加密向量
        console.log(e.detail.code)
        wx.request({ //向后台发送请求
            url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=ACCESS_TOKEN',
            method: "post",
            timeout: 0,
            success: (result) => {
                console.log(result.data)
            }
        })
      },
    logout:function(){
        var islogin = app.islogin;
        if (islogin == 1) {
            app.islogin = 0;
            app.uname ='';
            app.uphone='';
            app.imgsrc ="../../icon/未注册用户.png"
        this.setData({
            txtbt: "注册 / 登录",
            imgsrc:"../../icon/未注册用户.png"
        })
        } else {
            wx.showToast({
                icon: 'none',
                title: '请先登录',
                duration: 2000,
            })
        }
    },
    helpinfo:function(){
        wx.showToast({
            icon: 'none',
            title: '系统功能完善中',
            duration: 2000,
        })
    },
    toEsr: function () {
        var islogin = app.islogin;
        if (islogin == 1) {
            wx.navigateTo({
                url: '../Escalaterecords/Escalaterecords',
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '请先登录',
                duration: 2000,
            })
        }
    },
    toPersonlData: function () {
        var islogin = app.islogin;
        if (islogin == 1) {
            wx.navigateTo({
                url: '../PersonalData/PersonalData',
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '请先登录',
                duration: 2000,
            })
        }
    },
    toLogin: function () {
        var islogin = app.islogin;
        if (islogin == 1) {
            wx.showToast({
                icon: 'none',
                title: '已登录',
                duration: 1000,
            })
        } else {
            wx.navigateTo({
                url: '../Login/Login',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
    },
    /**
     * 获取数据方法
     */
    /*
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var uname = app.uname;
        var islogin = app.islogin;
        var imgsrc = app.imgsrc;
        if (islogin == 1) {
            this.setData({
                txtbt: uname,
                imgsrc:imgsrc
            })
        } else {
        }
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