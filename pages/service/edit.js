var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        formData: null,
        settingData: null,
        categoryData: []
    },
    toPage: function(a) {
        app.superman.toPage(a);
    },
    goTop: function(a) {
        app.superman.goTop(a);
    },
    copy: function(a) {
        app.superman.copy(a);
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        var t = this;
        t.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            checkAudit: "audit" != a.for
        }), t.data.userInfo ? (t.getLocation(), t.getSettingData(), t.getCategoryData(), 
        app.viewCount()) : app.util.getUserInfo(function() {
            t.onLoad(a);
        });
    },
    getLocation: function() {
        var e = this;
        app.getLocation(function() {
            var a, t = wx.getStorageSync("LocationInfo");
            t && (a = {
                address: t.address,
                lat: t.location.lat,
                lng: t.location.lng,
                province: t.address_component.province,
                city: t.address_component.city,
                district: t.address_component.district
            }, e.setData({
                locationInfo: a
            }), console.log("getLocation: init", t, a));
        });
    },
    getSettingData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    settingData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getCategoryData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "category",
                op: "list"
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    categoryData: a.list
                }), t.getFormData();
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getFormData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "edit",
                id: t.data.serviceId
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                a.service_id = a.id, delete a.id, t.data.checkAudit && 0 == a.status ? app.util.message("正在审核中，请稍等", "redirect:/pages/service/admin", "error") : t.setData({
                    Loading: !1,
                    formData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    }
});