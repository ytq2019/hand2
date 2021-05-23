var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        profile: null,
        settingData: null,
        currentRenew: 0
    },
    toPage: function(e) {
        app.superman.toPage(e);
    },
    goTop: function(e) {
        app.superman.goTop(e);
    },
    copy: function(e) {
        app.superman.copy(e);
    },
    onLoad: function(e) {
        console.log("onLoad", e);
        var t = this;
        t.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), t.data.userInfo ? (t.getIndexData(), app.viewCount()) : app.util.getUserInfo(function() {
            t.onLoad(e);
        });
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "profile"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                if (t.setData({
                    profile: e
                }), -1 == e.status) t.showAuditReason(); else if (-3 == e.status) return void app.util.message("服务已关闭，请重新提交入驻", "redirect:/pages/service/edit", "error");
                t.getSettingData();
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
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
            showLoading: !1,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                t.setData({
                    Loading: !1,
                    settingData: e
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            Paging: !1,
            itemList: []
        }), this.onLoad(), wx.stopPullDownRefresh();
    },
    toEdit: function(e) {
        0 != this.data.profile.status ? this.data.profile.update_remain_total <= 0 ? app.util.message("本年度修改次数已用完", "", "error") : wx.showModal({
            title: "提示信息",
            content: "确定要花费1次修改机会吗？",
            showCancel: !0,
            confirmText: "确定",
            success: function(e) {
                e.confirm && wx.navigateTo({
                    url: "/pages/service/edit"
                });
            }
        }) : app.util.message("资料审核中，请稍等", "", "error");
    },
    showAuditReason: function() {
        app.util.Dialog.confirm({
            title: "审核提示",
            message: this.data.profile.audit_reason,
            showCancelButton: !1,
            confirmButtonText: "知道了，立即去修改",
            confirmButtonColor: "bg-gradual-" + this.data.ThemeStyle.gradual,
            asyncClose: !0
        }).then(function() {
            app.util.Dialog.close(), wx.navigateTo({
                url: "/pages/service/edit?for=audit"
            });
        }).catch(function() {
            app.util.Dialog.close();
        });
    },
    closeService: function(t) {
        var a = this;
        wx.showModal({
            title: "关闭提醒",
            content: "关闭服务后，用户将无法联系到您，再次入驻开启需重新审核，确定关闭吗？",
            showCancel: !0,
            confirmText: "确定",
            success: function(e) {
                e.confirm && a.offline(t);
            }
        });
    },
    offline: function(e) {
        app.util.request({
            method: "POST",
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "offline"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), app.util.message("服务已关闭，感谢您的支持！", "redirect:/pages/service/list", "error");
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    calcRenewExpireDate: function(e, t) {
        var a = app.util.date.strFormatToDate("yyyy-MM-dd", e), e = this.data.settingData.renew_list[t], t = parseInt(e.cycle), e = parseInt(e.extra_days), a = app.util.date.dateAdd("m", t, a);
        return 0 < e && (a = app.util.date.dateAdd("d", e, a)), app.util.date.dateToStr("yyyy-MM-dd", a);
    },
    showRenewModal: function(e) {
        this.setData({
            renewExpireDate: this.calcRenewExpireDate(this.data.profile.expire_date, this.data.currentRenew),
            showRenewModal: !0
        });
    },
    hideRenewModal: function(e) {
        this.setData({
            showRenewModal: !1
        });
    },
    changeRenewCycle: function(e) {
        this.setData({
            currentRenew: e.detail.value,
            renewExpireDate: this.calcRenewExpireDate(this.data.profile.expire_date, e.detail.value)
        });
    },
    toRenew: function() {
        var t = this;
        app.superman.requestPromise({
            url: "entry/wxapp/service",
            method: "POST",
            data: {
                m: "superman_hand2",
                act: "renew",
                cycle: t.data.settingData.renew_list[t.data.currentRenew].cycle
            },
            showLoading: !0
        }).then(function(e) {
            console.log(e), wx.requestPayment({
                timeStamp: e.data.timeStamp,
                nonceStr: e.data.nonceStr,
                package: e.data.package,
                signType: e.data.signType,
                paySign: e.data.paySign,
                success: function() {
                    t.setData({
                        showRenewModal: !1
                    }), t.getIndexData();
                }
            });
        }).catch(function(e) {
            console.log(e), app.util.message(e.data.errmsg, "", "error");
        });
    }
});