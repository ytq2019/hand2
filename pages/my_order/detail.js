var app = getApp();

Page({
    data: {
        showServiceModal: !1,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl,
        expressList: app.globalData.expressList,
        Loading: !0,
        SwiperImageHeight: [],
        SwiperCurrentIndex: 0,
        OrderId: 0,
        OrderStatusCur: 0,
        OrderStatusList: [ {
            title: "待支付",
            status: 0
        }, {
            title: "待发货",
            status: 1
        }, {
            title: "已发货",
            status: 2
        }, {
            title: "交易完成",
            status: 4
        } ],
        showRefundModal: !1,
        UploadImgTotal: 8,
        ServiceImgList: [],
        UploadServiceImgPaths: []
    },
    onLoad: function(e) {
        console.log("onLoad", e);
        var a = this;
        void 0 !== e.orderid && (a.data.OrderId = e.orderid), a.setData({
            OrderId: a.data.OrderId,
            type: void 0 !== e.type ? e.type : "buy",
            ThemeStyle: app.getThemeStyle()
        }), a.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "detail",
                orderid: a.data.OrderId
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), a.loadPageData(e.data.data);
            },
            fail: function(e) {
                var a = "back";
                void 0 !== e.data.data.redirect && (a = "redirect:" + e.data.data.redirect), app.util.message(e.data.errmsg, a, "error");
            }
        });
    },
    loadPageData: function(e) {
        var a = {};
        void 0 !== e.order && ((a = e.order).price = app.superman.toDecimal(a.price), a.credit = a.credit.replace(".00", ""), 
        a.express_company && (a.express_name = app.getExpressName(a.express_company)), a.dispute && a.dispute.express_company && (a.dispute.express_name = app.getExpressName(a.dispute.express_company))), 
        this.setData({
            Loading: !1,
            Order: a,
            currencyInfo: e.currency_info
        });
    },
    onPullDownRefresh: function() {
        this.getIndexData(), wx.stopPullDownRefresh();
    },
    copy: function(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.content
        });
    },
    toPage: function(e) {
        -1 != this.data.Order.item.buy_type && wx.navigateTo({
            url: e.currentTarget.dataset.path
        });
    },
    uploadServiceImage: function(a, t) {
        var r = this;
        a.length ? app.uploadFile({
            url: app.getUploadUrl("entry/wxapp/upload", {
                m: "superman_hand2",
                act: "upload",
                type: "image"
            }),
            filePath: a[t],
            name: "image",
            success: function(e) {
                console.log("uploadFile", e), t += 1, 0 == e.errno ? (r.data.UploadServiceImgPaths.push(e.data.path), 
                t < a.length ? r.uploadServiceImage(a, t) : r.submitService()) : app.util.message(e.errmsg, "", "error");
            },
            fail: function(e) {
                console.error(e);
                e = JSON.parse(e.data);
                app.util.message(e.errmsg, "", "error");
            }
        }) : r.submitService();
    },
    submitService: function() {
        var a = this;
        a.data.ServicePostData.service_imgs = a.data.UploadServiceImgPaths.join("|"), app.util.request({
            url: "entry/wxapp/order",
            data: a.data.ServicePostData,
            showLoading: !0,
            success: function(e) {
                console.log(e), app.util.message("提交成功", "redirect:/pages/my_order/index?type=" + a.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    ChooseImg: function(e) {
        var a = this;
        wx.chooseImage({
            count: a.data.UploadImgTotal,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                0 != a.data.ServiceImgList.length ? a.setData({
                    ServiceImgList: a.data.ServiceImgList.concat(e.tempFilePaths)
                }) : a.setData({
                    ServiceImgList: e.tempFilePaths
                });
            }
        });
    },
    DelImg: function(a) {
        var t = this;
        wx.showModal({
            title: "提示信息",
            content: "确定要删除吗？",
            cancelText: "取消",
            confirmText: "确定",
            success: function(e) {
                e.confirm && (t.data.ServiceImgList.splice(a.currentTarget.dataset.index, 1), t.setData({
                    ServiceImgList: t.data.ServiceImgList
                }));
            }
        });
    },
    ViewImage: function(e) {
        wx.previewImage({
            urls: this.data.ServiceImgList,
            current: e.currentTarget.dataset.url
        });
    },
    showServiceModal: function(e) {
        this.setData({
            showServiceModal: !0
        });
    },
    hideServiceModal: function(e) {
        this.setData({
            showServiceModal: !1
        });
    },
    applyService: function(e) {
        var a = {
            m: "superman_hand2",
            act: "service",
            orderid: this.data.OrderId
        }, e = e.detail.value.content;
        "" != e ? (a.reason = e, this.data.ServicePostData = a, this.uploadServiceImage(this.data.ServiceImgList, 0)) : app.util.message("请输入售后原因", "", "error");
    },
    showReceiveInfo: function(e) {
        this.setData({
            showReceiveModal: !0
        });
    },
    hideReceiveInfo: function(e) {
        this.setData({
            showReceiveModal: !1
        });
    },
    cancelBuy: function(a, e) {
        var t = this;
        void 0 !== e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "cancel",
                orderid: t.data.OrderId
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                var a = "";
                void 0 !== e.data.data.redirect && (a = "redirect:" + e.data.data.redirect), app.util.message("订单已取消", a, "error");
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : wx.showModal({
            title: "系统提示",
            content: "确定取消订单？",
            cancelText: "关闭",
            success: function(e) {
                e.confirm && t.cancelBuy(a, !0);
            }
        });
    },
    toPay: function(e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "pay",
                orderid: a.data.OrderId
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
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
                                url: "../my_order/index?type=" + a.data.type
                            });
                        }, 1e3);
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    showRefundModal: function(e) {
        this.setData({
            showRefundModal: !0
        });
    },
    hideRefundModal: function(e) {
        this.setData({
            showRefundModal: !1
        });
    },
    applyRefund: function(e) {
        var a = this, e = e.detail.value.content;
        "" != e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: a.data.OrderId,
                status: -1,
                reason: e,
                m: "superman_hand2"
            },
            success: function(e) {
                a.setData({
                    showRefundModal: !1
                }), app.util.message("提交成功", "redirect:/pages/my_order/index?type=" + a.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入退款原因", "", "error");
    },
    showCancelRefund: function(a) {
        var t = this;
        wx.showModal({
            title: "系统提示",
            content: "确认取消这次售后申请吗？",
            success: function(e) {
                e.confirm && t.cancelRefund(a);
            }
        });
    },
    cancelRefund: function(e) {
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "cancle_refund",
                orderid: this.data.OrderId
            },
            success: function(e) {
                wx.showToast({
                    title: "提交成功",
                    icon: "success"
                }), void 0 !== e.data.data.redirect && setTimeout(function() {
                    wx.navigateTo({
                        url: e.data.data.redirect
                    });
                }, 2e3);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    confirmReceive: function(a, e) {
        var t = this;
        void 0 !== e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: t.data.OrderId,
                status: 4,
                m: "superman_hand2"
            },
            success: function() {
                wx.showModal({
                    title: "系统提示",
                    content: "确认成功，祝您购物愉快！",
                    success: function() {
                        t.getIndexData();
                    }
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : wx.showModal({
            title: "系统提示",
            content: "请确认物品已收到",
            success: function(e) {
                e.confirm && t.confirmReceive(a, !0);
            }
        });
    },
    showBuyerShipModal: function(e) {
        this.setData({
            showBuyerShipModal: !0
        });
    },
    hideBuyerShipModal: function() {
        this.setData({
            showBuyerShipModal: !1
        });
    },
    PickerChangeBuyer: function(e) {
        this.setData({
            epIndexBuyer: e.detail.value
        });
    },
    sendOrderBuyer: function(e) {
        var a = this, e = e.detail.value;
        null != a.data.epIndexBuyer ? "" != e.express_no ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "buyer_ship",
                orderid: a.data.OrderId,
                express_company: a.data.expressList[a.data.epIndexBuyer].code,
                express_no: e.express_no
            },
            success: function(e) {
                console.log(e), app.util.message("发货成功", "redirect:/pages/my_order/index?type=" + a.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入快递单号", "", "error") : app.util.message("请选择快递公司", "", "error");
    },
    confirmShipped: function(e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "confirm_ship",
                orderid: a.data.OrderId
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), wx.showToast({
                    title: "提交成功",
                    icon: "success"
                }), setTimeout(function() {
                    a.getIndexData();
                }, 2e3);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    openConfirmPrice: function(e) {
        e = e.currentTarget.dataset.price;
        this.setData({
            confirmOrderId: this.data.OrderId,
            confirmItemPrice: e,
            OrderPrice: e,
            showConfirmPrice: !0
        }), this.calcOrderPrice();
    },
    closeConfirmPrice: function(e) {
        this.setData({
            showConfirmPrice: !1
        });
    },
    inputExpressFee: function(e) {
        console.log(e), this.setData({
            ExpressFee: e.detail.value
        }), this.calcOrderPrice();
    },
    setOrderExpressFee: function(e) {
        var a = this, t = a.data.ExpressFee;
        "" != t ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "set_express_fee",
                orderid: a.data.confirmOrderId,
                express_fee: t
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), a.setData({
                    showConfirmPrice: !1
                }), a.onLoad({
                    type: a.data.type
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入运费", "", "error");
    },
    calcOrderPrice: function() {
        var e = parseFloat(this.data.confirmItemPrice);
        this.data.ExpressFee && (e += parseFloat(this.data.ExpressFee)), this.setData({
            OrderPrice: app.superman.toDecimal(e)
        });
    },
    showShipModal: function(e) {
        this.setData({
            showShipModal: !0
        });
    },
    hideShipModal: function() {
        this.setData({
            showShipModal: !1
        });
    },
    PickerChange: function(e) {
        this.setData({
            epIndex: e.detail.value
        });
    },
    sendOrder: function(e) {
        e = e.detail.value;
        null != this.data.epIndex ? "" != e.express_no ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: this.data.OrderId,
                status: 2,
                express_company: this.data.expressList[this.data.epIndex].code,
                express_no: e.express_no,
                m: "superman_hand2"
            },
            success: function(e) {
                console.log(e), app.util.message("发货成功", "redirect:/pages/my_order/index?type=sell&status=1");
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入快递单号", "", "error") : app.util.message("请选择快递公司", "", "error");
    },
    showAgreementRefund: function(a) {
        var t = this;
        "" != t.data.Order.express_no ? wx.showModal({
            title: "系统提示",
            content: "确认退款，并提交收货地址",
            success: function(e) {
                e.confirm && t.setData({
                    showAddressModal: !0
                });
            }
        }) : wx.showModal({
            title: "系统提示",
            content: "确认退款？",
            success: function(e) {
                e.confirm && t.refund(a);
            }
        });
    },
    refund: function(e) {
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "agreement_refund",
                orderid: this.data.OrderId,
                m: "superman_hand2"
            },
            success: function(e) {
                console.log(e), app.util.message("退款成功", "redirect:/pages/my_order/index?type=sell");
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    showAddressModal: function(e) {
        this.setData({
            showAddressModal: !0
        });
    },
    hideAddressModal: function(e) {
        this.setData({
            showAddressModal: !1
        });
    },
    submitAddress: function(e) {
        var a = this, t = e.detail.value.receiver, r = e.detail.value.mobile, e = e.detail.value.address;
        "" != t ? "" != r ? "" != e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "seller_address",
                orderid: a.data.OrderId,
                receiver: t,
                mobile: r,
                address: e
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), app.util.message("提交成功", "redirect:/pages/my_order/index?type=" + a.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入地址", "", "error") : app.util.message("请输入电话", "", "error") : app.util.message("请输入收件人", "", "error");
    },
    confirmReceiver: function(a, e) {
        var t = this;
        void 0 !== e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "seller_receiver",
                orderid: t.data.OrderId
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), app.util.message("提交成功", "redirect:/pages/my_order/index?type=" + t.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : wx.showModal({
            title: "系统提示",
            content: "确认收货后，将退还订单支付金额给买家",
            success: function(e) {
                e.confirm && t.confirmReceiver(a, !0);
            }
        });
    }
});