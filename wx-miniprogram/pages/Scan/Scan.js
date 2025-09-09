// pages/Scan/Scan.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        scanCode:'扫码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.scanCode({
            onlyFromCamera: false,// 只允许从相机扫码
            success: (result) => {
              console.log("扫码成功："+JSON.stringify(result))
              app.hyid = result.result;
              console.log(app.hyid)
              wx.redirectTo({
                url: '../Hydrants/Hydrants',
              })
            },
          })
    },
//     getData(id){
//       wx.request({
//         url: 'http://localhost:8084/Hydrants/all'+'/'+id,
//         method:"GET",
//         timeout: 0,
//         success: (result) => {
//           console.log(result.data)
//           this.setData({
//             HydrantId:result.data.data.id,
//             currentStatus:result.data.data.currentStatus,
//             currentPressure:result.data.data.currentPressure,
//             installDate:result.data.data.installDate,
//             installAddress:result.data.data.installAddress,
//             CompaniesName:result.data.data.name,
//             CompaniesTelephone:result.data.data.telephone,
//             CompaniesAddress:result.data.data.address,
//             CompaniesContacts:result.data.data.contacts,
//             Companiesemail:result.data.data.email
//           })
//         },
//         fail: (res) => {},
//         complete: (res) => {},
//       })
//   },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    // tomap:function(){
    //     wx.redirectTo({
    //         url: '../Map/Map',
    //     })
    // },
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