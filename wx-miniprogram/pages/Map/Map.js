// pages/Map/Map.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        longitude: '117.17758413',
        latitude: '36.6820055',
    },

    onLoad: function (options) {
        this.getLocation()
    },
    /**
     *定位
     */

    getLocation: function (e) {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                // 获取经纬度
                var latitude = res.latitude
                var longitude = res.longitude
                console.log("经度:"+longitude, "纬度:"+latitude)
                // wx.showModal({
                //     title: '定位功能（展示用例）',
                //     content: '经度：' + longitude + '纬度：' + latitude,
                //     success(res) {
                //         if (res.confirm) {
                //             console.log('用户点击确定')
                //         } else if (res.cancel) {
                //             console.log('用户点击取消')
                //         }
                //     }
                // })
                that.setData({
                    latitude: latitude, //纬度 
                    longitude: longitude, //经度 
                })
                wx.request({
                    url: 'http://localhost:8084/Post/postlocation',
                    method: "post",
                    data: {
                        wxlatitude: latitude, //纬度 
                        wxlongitude: longitude, //经度 
                    },
                    timeout: 0,
                    success: (result) => {},
                    fail: (res) => {},
                })
                //弹框
                // wx.showToast({
                //     icon: 'none',
                //     title: '申请位置信息成功',
                //     duration: 2000,
                // })
            },
            fail: (res) => {
                // wx.showToast({
                //     icon: 'none',
                //     title: '用户拒绝位置信息授权',
                //     duration: 2000,
                // })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (e) {

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