var app = getApp();

Page({
    data: {
        charge: 0,
        idx: 0
    },
    onLoad: function() {
        this.setData({
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/finance",
            data: {
                m: "superman_hand2",
                act: "getcash"
            },
            complete: function() {
                n.setData({
                    completed: !0
                });
            },
            success: function(a) {
                console.log(a);
                a = a.data.data;
                if (a.getcash && a.getcash.getcash_type) {
                    for (var e = Object.keys(a.getcash.getcash_type), t = 0; t < e.length; t++) 1 == e[t] ? e[t] = "微信" : 2 == e[t] ? e[t] = "支付宝" : e[t] = "银行卡";
                    n.setData({
                        account: e,
                        balance: parseFloat(a.member_info.balance),
                        rate: a.getcash.fee_rate || "",
                        fee_max: a.getcash.fee_max ? parseFloat(a.getcash.fee_max) : 0,
                        fee_min: a.getcash.fee_min ? parseFloat(a.getcash.fee_min) : 0,
                        SubscribeMsgIds: a.subscribe_msg_ids,
                        currencyInfo: a.currency_info
                    });
                } else wx.showModal({
                    title: "系统提示",
                    content: "提现参数未设置，请联系管理员",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "../my/index"
                        });
                    }
                });
            },
            fail: function(a) {
                console.error(a);
                var e = "";
                40 == a.data.errno && (e = "/pages/my/index"), app.util.message(a.data.errmsg, e, "error");
            }
        });
    },
    showAccount: function(a) {
        this.setData({
            idx: a.detail.value
        });
    },
    calCharge: function(a) {
        var e, t = this, n = "" != a.detail.value ? parseFloat(a.detail.value) : 0;
        n <= 0 || (e = parseFloat(t.data.rate), a = (parseFloat(n) * e / 100).toFixed(2), 
        n = parseFloat(t.data.fee_max), (e = parseFloat(t.data.fee_min)) && a < e ? a = e : n && n < a && (a = n), 
        t.setData({
            charge: a
        }));
    },
    getCash: function(a) {
        console.log(a.detail.value);
        var t = this, e = a.detail.value, a = "" != e.money ? parseFloat(e.money) : 0;
        if (1 == t.data.idx) {
            if ("" == e.alipay_account) return void app.toast("请填写支付宝账号");
            if ("" == e.alipay_username) return void app.toast("请填写支付宝昵称");
        }
        if (2 == t.data.idx) {
            if ("" == e.bank_name) return void app.toast("请填写银行名称");
            if ("" == e.bank_account) return void app.toast("请填写开户行名称");
            if ("" == e.bank_cardno) return void app.toast("请填写银行卡号");
            if ("" == e.bank_username) return void app.toast("请填写开卡人姓名");
        }
        a <= 0 ? app.toast("请填写提现金额") : a > t.data.balance ? app.toast("提现金额超过账户余额") : app.util.request({
            url: "entry/wxapp/finance",
            data: {
                m: "superman_hand2",
                act: "getcash",
                account_type: e.account_type,
                alipay_account: e.alipay_account || "",
                alipay_username: e.alipay_username || "",
                bank_name: e.bank_name || "",
                bank_account: e.bank_account || "",
                bank_cardno: e.bank_cardno || "",
                bank_username: e.bank_username || "",
                money: a,
                apply_remark: e.apply_remark,
                submit: "yes"
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            },
            success: function(a) {
                var e = t.data.SubscribeMsgIds;
                console.log(a, e), void 0 !== e.getcash_audit && e.getcash_audit ? wx.showModal({
                    title: "提交成功",
                    content: "是否接收提现审核通知消息？",
                    showCancel: !0,
                    cancelText: "不需要",
                    confirmText: "需要",
                    success: function() {
                        wx.requestSubscribeMessage({
                            tmplIds: [ e.getcash_audit ],
                            success: function(a) {
                                console.log(a), app.util.message("订阅成功", "redirect:/pages/my/index");
                            },
                            fail: function(a) {
                                console.error(a), app.util.message(a.errMsg, "", "error");
                            }
                        });
                    }
                }) : app.util.message("已提交，审核中", "redirect:/pages/my/index");
            }
        });
    }
});