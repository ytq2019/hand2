var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        Loading: !0,
        imgList: [],
        PhoneNumber: wx.getStorageSync("PhoneNumber") || "",
        UploadImgTotal: 3,
        UploadImgPaths: [],
        PostData: null
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/shop",
            data: {
                m: "superman_hand2",
                act: "get"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data.shop;
                a.id ? 0 == a.status ? wx.showModal({
                    title: "提示信息",
                    content: "申请已提交，请等待管理员审核！",
                    showCancel: !1,
                    confirmText: "我知道了",
                    success: function() {
                        app.util.showLoading(), wx.redirectTo({
                            url: "/pages/my/index"
                        });
                    }
                }) : 1 == a.status ? wx.showModal({
                    title: "提示信息",
                    content: "该账号已入驻，请勿重复提交申请！",
                    showCancel: !1,
                    confirmText: "我知道了",
                    success: function() {
                        app.util.showLoading(), wx.redirectTo({
                            url: "/pages/my/index"
                        });
                    }
                }) : (t.setData({
                    Loading: !1,
                    Shop: a
                }), wx.showModal({
                    title: "提示信息",
                    content: "审核未通过，请认真填写后重新提交！",
                    showCancel: !1,
                    confirmText: "我知道了"
                })) : t.setData({
                    Loading: !1
                });
            },
            fail: function(a) {
                app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getPhoneNumber: function(a) {
        var t = this;
        app.util.checkSession({
            success: function() {
                "getPhoneNumber:fail user deny" == a.detail.errMsg ? console.log(a) : app.util.request({
                    url: "entry/wxapp/phone",
                    data: {
                        m: "superman_hand2",
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv
                    },
                    success: function(a) {
                        console.log(a), t.setData({
                            PhoneNumber: a.data.data.phoneNumber
                        }), wx.setStorageSync("PhoneNumber", a.data.data.phoneNumber);
                    },
                    fail: function(a) {
                        app.util.message(a.data.errmsg, "", "error");
                    }
                });
            },
            fail: function() {
                wx.redirectTo({
                    url: "/pages/login/index?redirect=/pages/shop/join"
                });
            }
        });
    },
    ChooseImg: function(a) {
        var t = this;
        wx.chooseImage({
            count: t.data.UploadImgTotal,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                0 != t.data.imgList.length ? t.setData({
                    imgList: t.data.imgList.concat(a.tempFilePaths)
                }) : t.setData({
                    imgList: a.tempFilePaths
                });
            }
        });
    },
    DelImg: function(t) {
        var e = this;
        wx.showModal({
            title: "提示信息",
            content: "确定要删除吗？",
            cancelText: "取消",
            confirmText: "确定",
            success: function(a) {
                a.confirm && (e.data.imgList.splice(t.currentTarget.dataset.index, 1), e.setData({
                    imgList: e.data.imgList
                }));
            }
        });
    },
    submitForm: function(a) {
        console.log(a);
        var t = this, e = {
            m: "superman_hand2",
            act: "post"
        };
        e.realname = a.detail.value.realname, e.phone = a.detail.value.phone, e.title = a.detail.value.title, 
        e.address = a.detail.value.address, "" != e.realname ? "" != e.phone ? "" != e.title ? "" != e.address ? 3 == t.data.imgList.length ? (t.data.PostData = e, 
        app.util.showLoading(), 3 == t.data.UploadImgPaths.length ? t.doSubmit() : (t.data.UploadImgPaths.length = 0, 
        t.uploadImage(t.data.imgList, 0))) : app.util.message("请上传资质证照", "", "error") : app.util.message("请输入地址", "", "error") : app.util.message("请输入商家名称", "", "error") : app.util.message("请输入电话", "", "error") : app.util.message("请输入姓名", "", "error");
    },
    uploadImage: function(t, e) {
        var o = this;
        t.length ? app.uploadFile({
            url: app.getUploadUrl("entry/wxapp/upload", {
                m: "superman_hand2",
                act: "upload",
                type: "image"
            }),
            filePath: t[e],
            name: "image",
            success: function(a) {
                console.log("uploadFile", a), e += 1, 0 == a.errno ? (o.data.UploadImgPaths.push(a.data.path), 
                e < t.length ? o.uploadImage(t, e) : o.doSubmit()) : app.util.message(a.errmsg, "", "error");
            },
            fail: function(a) {
                console.error(a);
                a = JSON.parse(a.data);
                app.util.message(a.errmsg, "", "error");
            }
        }) : o.doSubmit();
    },
    doSubmit: function() {
        var a = this;
        a.data.PostData.cert_imgs = a.data.UploadImgPaths.join("|"), app.util.request({
            method: "POST",
            url: "entry/wxapp/shop",
            data: a.data.PostData,
            showLoading: !0,
            success: function(a) {
                console.log(a), wx.showModal({
                    title: "提示信息",
                    content: "申请已提交，请等待管理员审核！",
                    showCancel: !1,
                    confirmText: "确定",
                    success: function() {
                        app.util.showLoading(), wx.redirectTo({
                            url: "/pages/my/index"
                        });
                    }
                });
            },
            fail: function(a) {
                app.util.message(a.data.errmsg, "", "error");
            }
        });
    }
});