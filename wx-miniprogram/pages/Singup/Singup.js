// pages/Singup/Singup.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        password: '',
        telephone: '',
        singupname:''
    },
    formSubmit(e) {
        // 调用函数时，传入new Date()参数，返回值是日期和时间
        var reportData = e.detail.value;
        wx.showModal({
            title: '提示',
            content: '是否确定注册',
            success (res) {
              if (res.confirm) {
                wx.request({
                    url: 'http://localhost:8084/User/Singup',
                    method:"post",
                    data:reportData,
                    timeout: 0,
                    success: (result) => {
                        console.log(result.data)
                        if(result.data.code==100){
                            app.singupname = reportData.name
                            wx.redirectTo({
                                url: '../Login/Login',
                            })
                        }else{
                            wx.showToast({
                                icon: 'none',
                                title: '用户名已存在',
                                duration: 2000,
                            })
                        }
                    },
                    fail: (res) => {
                    },
                    complete: (res) => {},
                  })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
        })

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