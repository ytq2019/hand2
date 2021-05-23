var _extends = Object.assign || function(a) {
    for (var t = 1; t < arguments.length; t++) {
        var e, i = arguments[t];
        for (e in i) Object.prototype.hasOwnProperty.call(i, e) && (a[e] = i[e]);
    }
    return a;
}, app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        settingData: {
            type: Object,
            value: null
        },
        formData: {
            type: Object,
            value: {
                name: "",
                phone: "",
                desc: "",
                category_ids: [],
                id_img: [],
                face_img: []
            }
        },
        categoryData: {
            type: Array,
            value: []
        },
        themeStyle: {
            type: Object,
            value: null
        },
        locationInfo: {
            type: Object,
            value: null
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        descMaxLength: 200,
        descCurLength: 0,
        isAgree: !1,
        maxSelectedCategory: 2,
        PhoneNumber: wx.getStorageSync("PhoneNumber")
    },
    observers: {
        formData: function(a) {
            var t = this;
            if (a.category_ids) {
                var e, i = t.data.categoryData;
                for (e in i) i[e].selected = -1 != a.category_ids.indexOf(parseInt(i[e].id));
                t.setData({
                    categoryData: i
                });
            }
            a.desc && t.setData({
                descCurLength: a.desc.length
            });
        }
    },
    ready: function() {
        var a = this;
        "" == a.data.formData.phone && a.data.PhoneNumber && (a.data.formData.phone = a.data.PhoneNumber), 
        a.applyFormData(a.data.formData);
    },
    methods: {
        applyFormData: function(a) {
            this.setData(_extends({}, a));
        },
        showHelpMsg: function(a) {
            app.util.Dialog.alert({
                title: "提示",
                message: a.currentTarget.dataset.msg,
                showCancelButton: !1,
                showConfirmButton: !1
            }).catch(function() {});
        },
        getLocation: function() {
            this.triggerEvent("location", null);
        },
        inputDesc: function(a) {
            this.setData({
                descCurLength: a.detail.value.length
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
                                phone: a.data.data.phoneNumber
                            }), wx.setStorageSync("PhoneNumber", a.data.data.phoneNumber);
                        },
                        fail: function(a) {
                            app.util.message(a.data.errmsg, "", "error");
                        }
                    });
                },
                fail: function() {
                    var a = "/pages/service/add";
                    t.data.formData.id && (a = "/pages/service/edit?id=" + t.data.formData.id), wx.redirectTo({
                        url: "/pages/login/index?redirect=" + encodeURIComponent(a)
                    });
                }
            });
        },
        setCategoryDataSelected: function() {
            var a, t = this.data.categoryData;
            for (a in t) t[a].selected = -1 != this.data.formData.category_ids.indexOf(t[a].id);
            return t;
        },
        selectCategory: function(a) {
            var e, i = this, r = a.target.dataset.index, o = i.data.category_ids || [];
            i.data.categoryData[r].selected ? (i.data.categoryData[r].selected = !1, o.length && o.forEach(function(a, t) {
                if (a == i.data.categoryData[r].id) return o.splice(t, 1), !1;
            })) : (o.length >= i.data.maxSelectedCategory && ((e = o.shift()) && i.data.categoryData.forEach(function(a, t) {
                if (a.id == e) return i.data.categoryData[t].selected = !1;
            })), o.push(i.data.categoryData[r].id), i.data.categoryData[r].selected = !0), i.setData({
                category_ids: o,
                categoryData: i.data.categoryData
            });
        },
        changeAgree: function(a) {
            this.setData({
                isAgree: !!a.detail.value.length
            });
        },
        showJoinRuleDialog: function(a) {
            this.setData({
                showJoinRuleDialog: !0
            });
        },
        hideJoinRuleDialog: function(a) {
            this.setData({
                showJoinRuleDialog: !1
            });
        },
        afterRead: function(e) {
            var i = this, a = e.detail.file;
            app.uploadFile({
                url: app.getUploadUrl("entry/wxapp/upload", {
                    m: "superman_hand2",
                    act: "upload",
                    type: a.type
                }),
                filePath: a.url,
                name: "image",
                success: function(a) {
                    var t;
                    console.log("uploadFile", a), 0 == a.errno ? "face_img" == e.currentTarget.dataset.type ? ((t = void 0 === (t = i.data.face_img) ? [] : t).push(a.data), 
                    i.setData({
                        face_img: t
                    })) : "id_img" == e.currentTarget.dataset.type && ((t = void 0 === (t = i.data.id_img) ? [] : t).push(a.data), 
                    i.setData({
                        id_img: t
                    })) : app.util.message(a.errmsg, "", "error");
                },
                fail: function(a) {
                    console.error(a);
                    a = JSON.parse(a.data);
                    app.util.message(a.errmsg, "", "error");
                }
            });
        },
        deleteMedia: function(t) {
            var e = this, i = t.detail.index, r = [];
            "face_img" == t.currentTarget.dataset.type ? r = e.data.face_img : "id_img" == t.currentTarget.dataset.type && (r = e.data.id_img), 
            app.superman.deleteMedia(i, r).then(function(a) {
                console.log(a), r.splice(i, 1), "face_img" == t.currentTarget.dataset.type ? e.setData({
                    face_img: r
                }) : "id_img" == t.currentTarget.dataset.type && e.setData({
                    id_img: r
                });
            }).catch(function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }).finally(function() {
                wx.hideLoading();
            });
        },
        submitForm: function(a) {
            var t = this, e = a.detail.value;
            "" != e.name ? "" != e.phone ? t.data.category_ids.length ? "" != e.desc ? (a = t.data.locationInfo, 
            e.province = a ? a.province : "", e.city = a ? a.city : "", e.district = a ? a.district : "", 
            e.address = a ? a.address : "", e.lng = a ? a.lng : "", e.lat = a ? a.lat : "", 
            "" != e.lng && "" != e.lat ? t.data.id_img.length ? t.data.face_img.length ? t.data.isAgree || t.data.service_id ? (e.category_ids = t.data.category_ids.join(","), 
            e.id_img = [], t.data.id_img.forEach(function(a) {
                e.id_img.push(a.path);
            }), e.id_img = e.id_img.join(","), e.face_img = t.data.face_img[0].path, t.data.service_id && (e.service_id = t.data.service_id), 
            console.log(e), 0 < t.data.settingData.fee && !t.data.service_id ? app.superman.requestPromise({
                url: "entry/wxapp/service",
                method: "POST",
                data: {
                    m: "superman_hand2",
                    act: "join",
                    op: "pay"
                },
                showLoading: !0
            }).then(function(a) {
                console.log(a), wx.requestPayment({
                    timeStamp: a.data.timeStamp,
                    nonceStr: a.data.nonceStr,
                    package: a.data.package,
                    signType: a.data.signType,
                    paySign: a.data.paySign,
                    success: function() {
                        t.doPost(e);
                    }
                });
            }).catch(function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }) : t.doPost(e)) : app.toast("请阅读并同意入驻公约") : app.toast("请上传本人正面照片") : app.toast("请上传资质照片") : app.toast("未获取所在位置")) : app.toast("请输入服务覆盖范围") : app.toast("请选择服务项目") : app.toast("未获取到手机号") : app.toast("请输入名称");
        },
        doPost: function(a) {
            app.util.request({
                method: "POST",
                url: "entry/wxapp/service",
                data: Object.assign({
                    m: "superman_hand2",
                    act: "post"
                }, a),
                showLoading: !0,
                success: function(a) {
                    console.log(a), app.util.message("提交成功，请等待管理员审核", "redirect:/pages/service/list", "error");
                },
                fail: function(a) {
                    console.error(a), app.util.message(a.data.errmsg, "", "error");
                }
            });
        }
    }
});