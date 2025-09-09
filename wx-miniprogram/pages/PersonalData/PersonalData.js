// pages/PersonalData/PersonalData.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgsrc:"../../icon/未注册用户.png",
        manchecked:'false',
        falmanchecked:'false',
        checked:'false',
        uname:'',
        uphone:'',
        date: '',
        userid:'',
        usersex:'',
        userpost: {
            id: '',
            birthDate: "",
            department: "",
            email: "",
            name: "",
            sex: "",
            telephone: ""
        }
    },
    /**
     * 获取数据方法
     */
    bandleChange(e){
        // 2 把值赋值给 data 中的数据
        this.setData({
          // gender:gender
          usersex:e.detail.value
        })
      },
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value,
            BirthDate: e.detail.value
        })
    },
    //表单提交
    formSubmit(e) {
        // 调用函数时，传入new Date()参数，返回值是日期和时间
        var reportData = e.detail.value;
        console.log(reportData);
        this.setData({
            userpost: {
                id: this.data.userid,
                postbirthDate: reportData.postbirthDate,
                department: reportData.department,
                email: reportData.email,
                name: reportData.name,
                sex: this.data.usersex,
                telephone: reportData.telephone
            }
        })
        console.log(this.data.userpost);
        wx.request({
            url: 'http://localhost:8084/User/update',
            method: "post",
            data: this.data.userpost,
            timeout: 0,
            success: (result) => {
                app.uname =result.data.data.name;
                app.uphone = result.data.data.telephone;
                wx.showToast({ //弹框提示
                    icon: 'success',
                    title: '修改成功！',
                    duration: 2000,
                })
            },
            fail: (res) => {},
            complete: (res) => {},
        })
    },
    getUserData(name) {
        wx.request({
            url: 'http://localhost:8084/User' + '/' + name,
            method: "GET",
            timeout: 0,
            success: (result) => {
                console.log(result)
                if(result.data.data.sex == '男'){
                    this.setData({
                        manchecked:'true'
                    })
                }else if(result.data.data.sex == '女'){
                    this.setData({
                        falmanchecked:'true'
                    })
                }else{
                    this.setData({
                        checked:'true'
                    })
                }
                //app.appuserid = result.data.data.id;
                this.setData({
                    userid: result.data.data.id,
                    Name: result.data.data.name,
                    BirthDate: result.data.data.postbirthDate,
                    Department: result.data.data.department,
                    Telephone: result.data.data.telephone,
                    Email: result.data.data.email
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
        this.getUserData(uname)
        var islogin = app.islogin;
        var imgsrc = app.imgsrc;
        if (islogin == 1) {
            this.setData({
                imgsrc:imgsrc
            })
        } else {
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