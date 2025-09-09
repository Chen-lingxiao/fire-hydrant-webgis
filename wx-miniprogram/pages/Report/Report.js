// pages/Report/Report.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hydrantId: '',
        faultDesc: '',
        reporterName: '',
        reporterTelephone:'',
        remark: '',
        uname:'',
        uphone:'',
        post:{
            hydrantId:'',
            FaultDesc:'',
            ReporterName:'',
            ReporterTelephone:'',
            Remark:''
        }
    },
    bindid(e){
       var binid= e.detail.value
       if(binid == null){
        wx.showToast({ //弹框提示
            icon: 'none',
            title: '消防栓ID不能为空！',
            duration: 1000,
        })
       }
    },
    //表单提交
    formSubmit(e) {
        // 调用函数时，传入new Date()参数，返回值是日期和时间
        var reportData = e.detail.value;
        var hydrantId = e.detail.value.hydrantId;
        var faultDesc = e.detail.value.faultDesc;
        console.log(reportData)
        this.setData({
            hydrantId:reportData.hydrantId,
            FaultDesc:reportData.FaultDesc,
            ReporterName:reportData.ReporterName,
            ReporterTelephone:reportData.ReporterTelephone,
            Remark:reportData.Remark
        })
        if (hydrantId==""||faultDesc==""){
            wx.showToast({ //弹框提示
                icon: 'none',
                title: '请输入有效上报信息！',
                duration: 2000,
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '是否确定上报',
                success (res) {
                  if (res.confirm) {
                    wx.request({
                        url: 'http://localhost:8084/Faults/report',
                        method:"post",
                        data:reportData,
                        timeout: 0,
                        success: (result) => {
                          console.log(result.data)
                          wx.showToast({ //弹框提示
                            icon: 'success',
                            title: '上报成功！',
                            duration: 2000,
                        })
                        },
                        fail: (res) => {},
                        complete: (res) => {},
                      })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
            })
        }

    },
    /**
     *  wx.request({
                    url: 'http://localhost:8084/Faults'
                    +'/'+reportData.HydrantId 
                    +'/'+reportData.FaultDesc
                    +'/'+reportData.ReporterName
                    +'/'+reportData.ReporterTelephone
                    +'/'+reportData.Remark,
                    method:"GET",
                    timeout: 0,
                    success: (result) => {
                      console.log(result.data)
                    },
                    fail: (res) => {},
                    complete: (res) => {},
                  })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
     * 生命周期函数--监听页面加载
     */
    scan:function(){
        wx.scanCode({
            onlyFromCamera: false, // 只允许从相机扫码
            success: (result) => {
                console.log("扫码成功：" + JSON.stringify(result))
                this.setData({
                    ScanResult: result.result,
                    hydrantId: result.result
                })
            },
        })
    },
    onLoad: function (options) {
    
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
        var islogin = app.islogin;
        if (islogin == 1) {
            console.log(app.uname)
            console.log(app.uphone)
            this.setData({
                reporterName:app.uname,
                reporterTelephone:app.uphone,
            })
        } else {
            this.setData({
                reporterName:"",
                reporterTelephone:"",
            })
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