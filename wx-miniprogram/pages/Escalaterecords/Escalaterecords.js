// pages/Escalaterecords/Escalaterecords.js
var app = getApp();
Page({

    /**
     * 页面的初始数据{"id":id,"faultDesc":faultDesc,"reportTime":reportTime},
     */
    data: {
        listData: [],
        uname: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        var uname = app.uname
        console.log(uname)
        wx.request({
            url: 'http://localhost:8084/Faults' + '/' + uname,
            method: "GET",
            timeout: 0,
            success: (result) => {
                console.log(result.data);
                this.setData({
                    listData:result.data
                })

            },
        })
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