var app = getApp();
Page({
    data: {
        imgsrc: '',
        username: "",
        password: "",
        singupname: '',
        islogin: "0", //是否登录，0未登录，1登录
        user: {
            name: '',
            password: ''
        }
    },
    goRedirect: function (e) {
        wx.navigateTo({
            url: '../Singup/Singup',
        })
    },
    onLoad() {

    },
    getUserName: function (e) {
        var value = e.detail.value; //获取输入的内容
        this.setData({
            username: value, //改变page--data中username的值
        })
    },
    getPassword: function (e) {
        var value = e.detail.value;
        this.setData({
            password: value,
        })
    },
    // 登录
    getUserInfo() {
        wx.getUserProfile({
            desc: "获取你的昵称、头像、地区及性别", // 不写不弹提示框
            success: res => {
                console.log(res)
                app.uname = res.userInfo.nickName
                app.imgsrc = res.userInfo.avatarUrl
                console.log(app.uname)
                this.setData({
                    user: {
                        name: app.uname,
                        password: "000000"
                    }
                })
                wx.switchTab({
                    url: '../User/User', //跳转至首页
                })
                wx.request({
                    url: 'http://localhost:8084/User/Singup',
                    method: "post",
                    data: this.data.user,
                    timeout: 0,
                    success: (result) => {
                        console.log(result)
                    },
                    fail: (res) => {
                        console.log(res)
                    },
                })
                wx.request({ //向后台发送请求
                        url: 'http://localhost:8084/User' + '/' + app.uname,
                        method: "GET",
                        timeout: 0,
                        success: (result) => {
                            app.uphone = result.data.data.telephone
                        }
                    }),
                    wx.showToast({ //弹框提示
                        icon: 'success',
                        title: '登录成功！',
                        duration: 2000,
                    })
                    app.islogin = "1" //登陆状态
            },
            fail: res => {
                //拒绝授权
                wx.showToast({
                    title: '您拒绝了授权',
                    icon: 'none'
                })
                return;
            }
        })
    },
    loginGO: function () {
        var that = this;
        if (that.data.username.length == 0 || that.data.password.length == 0) { //校验非空
            wx.showToast({ //弹框提示
                icon: 'none',
                title: '用户名或密码不能为空！',
                duration: 2000,
            })
        } else {
            wx.request({ //向后台发送请求
                url: 'http://localhost:8084/User/Login' +
                    '/' + that.data.username +
                    '/' + that.data.password,
                method: "GET",
                timeout: 0,
                success: (result) => {
                    console.log(result.data)
                    switch (result.data.msg) {
                        case "登陆成功":
                            app.uname = result.data.data.name
                            app.uphone = result.data.data.telephone
                            wx.switchTab({
                                url: '../User/User', //跳转至首页
                            })
                            wx.showToast({ //弹框提示
                                icon: 'success',
                                title: '登录成功！',
                                duration: 2000,
                            })
                            app.islogin = "1"; //登陆状态
                            break;
                        case "用户名不存在":
                            wx.showToast({
                                icon: 'none',
                                title: '用户不存在',
                            })
                            break;
                        case "用户密码错误":
                            wx.showToast({
                                icon: 'none',
                                title: '用户密码错误',
                            })
                            break;
                        default:
                    }
                    // if (result.data.code == true) {
                    //     wx.showToast({
                    //         icon: 'none',
                    //         title: '登录成功',
                    //     })
                    //     app.uname = result.data.data.name
                    //     app.uphone = result.data.data.telephone
                    //     wx.switchTab({
                    //         url: '../User/User', //跳转至首页
                    //     })
                    //     app.islogin = "1"; //登陆状态
                    // }
                    // elif(result.data.msg = "用户名不存在") {
                    //     wx.showToast({
                    //         icon: 'none',
                    //         title: '用户不存在',
                    //     })
                    // } else {

                    // }
                    // //res为后台返回给前端的数据
                    // if (result.data.data == null) { //如果返回的data不为空，代表用户名密码验证成功
                    //     wx.showToast({
                    //         icon: 'none',
                    //         title: '用户名或密码错误',
                    //     })
                    // } else {
                    //     wx.showToast({
                    //         icon: 'none',
                    //         title: '登录成功',
                    //     })
                    //     app.uname = result.data.data.name
                    //     app.uphone = result.data.data.telephone
                    //     console.log(app.uname)
                    //     wx.switchTab({
                    //         url: '../User/User', //跳转至首页
                    //     })
                    //     app.islogin = "1" //登陆状态
                    // }
                }
            })
        }
    },
    onShareAppMessage: function () {
        common.share()
    },
    onShow() {
        var username = app.singupname;
        this.setData({
            uname: username,
            username: username
        })
    },
})