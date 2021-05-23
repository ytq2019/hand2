var app = getApp();

Page({
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        receiver: null,
        hasReceiver: !1,
        remarkOrder: {
            placeholder: "选填",
            inputCount: 0,
            maxlength: 100,
            inputValue: ""
        },
        itemCount: {
            quantity: 1,
            min: 1,
            max: 10
        },
        showOpenSetting: !1,
        TradeTypeCur: 0
    },
    onLoad: function(e) {
        var t = this, a = e.type;
        a && "wechat" == a && t.setData({
            wechatPay: !0
        }), t.setData({
            ThemeStyle: app.getThemeStyle(),
            ItemId: e.id,
            Type: e.type
        }), t.getIndexData(), t.getAddressData(), app.viewCount();
    },
    getIndexData: function() {
        var r = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                act: "detail",
                id: r.data.ItemId,
                from: "cashier",
                m: "superman_hand2"
            },
            success: function(e) {
                var t = e.data.data;
                console.log(t), t.item._price = app.formatPrice(t.item, t.currency_info.symbol);
                var e = [], a = !0, i = !0;
                switch (1 == t.item.trade_type1 && e.push({
                    title: "快递",
                    value: 1
                }), 1 == t.item.trade_type2 && e.push({
                    title: "自取",
                    value: 2
                }), 1 == t.item.trade_type3 && e.push({
                    title: "物流到付",
                    value: 3
                }), e[0].value) {
                  case 1:
                    1 == t.item.free_ship && (a = !1);
                    break;

                  case 2:
                    i = a = !1;
                    break;

                  case 3:
                    a = !1;
                }
                r.setData({
                    itemDetail: t.item,
                    credit_title: t.item.credit_title,
                    TradeTypeList: e,
                    showExpressFeeTips: a,
                    needAddress: i,
                    currencyInfo: t.currency_info
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getAddressData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/address",
            data: {
                m: "superman_hand2",
                act: "display"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                t.setData({
                    completed: !0,
                    receiver: e.receiver,
                    hasReceiver: e.receiver && e.receiver.userName
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    setAddress: function() {
        var t = this;
        wx.chooseAddress({
            success: function(e) {
                t.setData({
                    receiver: e,
                    hasReceiver: !0
                }), app.util.request({
                    method: "POST",
                    url: "entry/wxapp/address",
                    data: {
                        m: "superman_hand2",
                        act: "post",
                        userName: e.userName,
                        telNumber: e.telNumber,
                        provinceName: e.provinceName,
                        cityName: e.cityName,
                        countyName: e.countyName,
                        detailInfo: e.detailInfo
                    },
                    showLoading: !1,
                    success: function(e) {
                        console.log(e);
                    },
                    fail: function(e) {
                        console.error(e), app.util.message(e.data.errmsg, "", "error");
                    }
                });
            },
            fail: function(e) {
                console.log(e), t.data.showOpenSetting || t.setData({
                    showOpenSetting: !0
                });
            }
        });
    },
    hideOpenSetting: function() {
        this.data.showOpenSetting && this.setData({
            showOpenSetting: !1
        });
    },
    confirmOpenSetting: function() {
        this.data.showOpenSetting && this.setData({
            showOpenSetting: !1
        });
    },
    handleZanStepperChange: function(e) {
        e = e.detail;
        this.setData({
            "itemCount.quantity": e,
            fee: Math.floor(parseFloat(this.data.itemDetail.price) * e * 100) / 100
        });
    },
    submitOrder: function(t) {
        var e, a = this, i = wx.getStorageSync("userInfo");
        i.memberInfo.avatar || void 0 !== i.wxInfo ? a.data.hasReceiver || !a.data.needAddress ? (i = "", 
        a.data.needAddress && (i = (e = a.data.receiver).provinceName + e.cityName + e.countyName + e.detailInfo), 
        e = 0, a.data.TradeTypeList.length && (e = a.data.TradeTypeList[a.data.TradeTypeCur].value), 
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "submit",
                itemid: a.data.itemDetail.id,
                mobile: a.data.receiver ? a.data.receiver.telNumber : "",
                address: i,
                name: a.data.receiver ? a.data.receiver.userName : "",
                count: a.data.itemCount.quantity,
                payType: a.data.wechatPay ? "wechat" : "credit",
                trade_type: e,
                reply: a.data.remarkOrder.inputValue || ""
            },
            fail: function(e) {
                20 == e.data.errno ? wx.showModal({
                    title: "系统提示",
                    content: e.data.errmsg,
                    confirmText: "去赚" + a.data.credit_title,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "../exchange/index"
                        });
                    }
                }) : app.util.message(e.data.errmsg, "", "error");
            },
            success: function(e) {
                void 0 !== e.data.data.paySign ? (e = {
                    timeStamp: e.data.data.timeStamp,
                    nonceStr: e.data.data.nonceStr,
                    package: e.data.data.package,
                    signType: e.data.data.signType,
                    paySign: e.data.data.paySign
                }, a.payment(e)) : a.data.wechatPay ? wx.showModal({
                    title: "系统提示",
                    content: "物品已拍下，请等待卖家确认费用。",
                    showCancel: !1,
                    confirmText: "确定",
                    success: function(e) {
                        wx.redirectTo({
                            url: "../my_order/index?type=buy&status=0"
                        });
                    }
                }) : (wx.showToast({
                    title: "兑换成功"
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "../my_order/index?type=buy&status=1"
                    });
                }, 2e3));
            }
        })) : app.toast("未设置收货地址") : wx.getUserProfile({
            desc: "更新用户信息",
            success: function(e) {
                app.util.getUserInfo(function() {
                    a.submitOrder(t);
                }, e);
            },
            fail: function(e) {
                console.error(e), getApp().util.message("未获取用户信息，无法提交订单", "", "error");
            }
        });
    },
    payment: function(e) {
        var t = this;
        wx.requestPayment({
            timeStamp: e.timeStamp,
            nonceStr: e.nonceStr,
            package: e.package,
            signType: e.signType,
            paySign: e.paySign,
            success: function(e) {
                wx.showToast({
                    title: "支付成功"
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "../my_order/index?type=buy&status=" + (2 == t.data.itemDetail.trade_type ? 2 : 1)
                    });
                }, 1e3);
            },
            fail: function(e) {
                console.log(e);
            }
        });
    },
    bindChangeRemarkOrder: function(e) {
        var t = e.detail.detail.value, e = t.length;
        this.setData({
            "remarkOrder.inputValue": t,
            "remarkOrder.inputCount": e
        });
    },
    allBuy: function(e) {
        this.setData({
            "itemCount.quantity": this.data.itemDetail.stock
        });
    },
    bindPickChange: function(e) {
        var e = e.detail.value, t = this.data.showExpressFeeTips, a = !0;
        switch (this.data.TradeTypeList[e].value) {
          case 1:
            t = !0, 1 == this.data.itemDetail.free_ship && (t = !1);
            break;

          case 2:
            a = t = !1;
            break;

          case 3:
            t = !1;
        }
        this.setData({
            TradeTypeCur: e,
            showExpressFeeTips: t,
            needAddress: a
        });
    }
});