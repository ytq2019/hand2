var app = getApp();

Page({
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        confirmBar: !1,
        list: [],
        pages: 1,
        hide: !0,
        more: !0,
        refresh: !0,
        expressList: app.globalData.expressList,
        OrderStatus: [ {
            title: "待支付",
            status: 0
        }, {
            title: "待发货",
            status: 1
        }, {
            title: "已发货",
            status: 2
        }, {
            title: "售后中",
            status: -4
        }, {
            title: "已完成",
            status: 4
        } ],
        OrderStatusIndex: 0,
        OrderStatusScrollLeft: 0,
        ExpressFee: "",
        UploadImgTotal: 8,
        ServiceImgList: [],
        UploadServiceImgPaths: [],
        buyerPayExpressFee: !1
    },
    onLoad: function(e) {
        var t = this, a = wx.getStorageSync("userInfo");
        if (a) {
            var s = 0;
            if (void 0 !== e.status) for (var r = 0; r < t.data.OrderStatus.length; r++) if (t.data.OrderStatus[r].status == e.status) {
                s = r;
                break;
            }
            t.setData({
                type: e.type,
                title: "sell" == e.type ? "我卖出的" : "我买到的",
                userInfo: a || null,
                uid: a && a.memberInfo.uid || 0,
                credit_title: wx.getStorageSync("credit_title"),
                OrderStatusIndex: s,
                LoadingImg: wx.getStorageSync("LoadingImg"),
                ThemeStyle: app.getThemeStyle()
            }), t.getOrderList(), app.viewCount();
        } else {
            var i = void 0 !== e.type ? e.type : "sell", a = void 0 !== e.status ? e.status : 0;
            wx.navigateTo({
                url: "/pages/login/index?redirect=/pages/my_order/index?type=" + i + "&status=" + a
            });
        }
    },
    getOrderList: function() {
        var s = this;
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                type: s.data.type,
                m: "superman_hand2",
                status: s.data.OrderStatus[s.data.OrderStatusIndex].status,
                page: s.data.pages
            },
            success: function(e) {
                var t = e.data.data, a = !t.list.length, e = s.data.list;
                t.list && (e = e.concat(t.list)), e.forEach(function(e) {
                    e.price = app.superman.toDecimal(e.price), e.credit = e.credit.replace(".00", "");
                }), s.setData({
                    completed: !0,
                    showExpress: 1 == t.show_express,
                    Gone: a,
                    list: e,
                    currencyInfo: t.currency_info
                });
            },
            fail: function(e) {
                console.error(e), s.setData({
                    completed: !0
                }), wx.showModal({
                    title: "系统提示",
                    content: e.data.errmsg
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            list: [],
            completed: !1,
            pages: 1,
            Gone: !1
        }), this.getOrderList(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this;
        e.data.Gone || (e.setData({
            pages: e.data.pages + 1,
            Paging: !0
        }), e.getOrderList());
    },
    PickerChange: function(e) {
        this.setData({
            epIndex: e.detail.value
        });
    },
    swtichOrderStatus: function(e) {
        this.setData({
            OrderStatusIndex: e.currentTarget.dataset.index,
            OrderStatusScrollLeft: 60 * (e.currentTarget.dataset.index - 1),
            pages: 1,
            list: []
        }), this.getOrderList();
    },
    toPage: function(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path
        });
    },
    copy: function(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.content
        });
    },
    uploadServiceImage: function(t, a) {
        var s = this;
        t.length ? app.uploadFile({
            url: app.getUploadUrl("entry/wxapp/upload", {
                m: "superman_hand2",
                act: "upload",
                type: "image"
            }),
            filePath: t[a],
            name: "image",
            success: function(e) {
                console.log("uploadFile", e), a += 1, 0 == e.errno ? (s.data.UploadServiceImgPaths.push(e.data.path), 
                a < t.length ? s.uploadServiceImage(t, a) : s.submitService()) : app.util.message(e.errmsg, "", "error");
            },
            fail: function(e) {
                console.error(e);
                e = JSON.parse(e.data);
                app.util.message(e.errmsg, "", "error");
            }
        }) : s.submitService();
    },
    submitService: function() {
        var t = this;
        t.data.ServicePostData.service_imgs = t.data.UploadServiceImgPaths.join("|"), app.util.request({
            url: "entry/wxapp/order",
            data: t.data.ServicePostData,
            showLoading: !0,
            success: function(e) {
                console.log(e), app.util.message("提交成功", "redirect:/pages/my_order/index?type=" + t.data.type);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    ChooseImg: function(e) {
        var t = this;
        wx.chooseImage({
            count: t.data.UploadImgTotal,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                0 != t.data.ServiceImgList.length ? t.setData({
                    ServiceImgList: t.data.ServiceImgList.concat(e.tempFilePaths)
                }) : t.setData({
                    ServiceImgList: e.tempFilePaths
                });
            }
        });
    },
    DelImg: function(t) {
        var a = this;
        wx.showModal({
            title: "提示信息",
            content: "确定要删除吗？",
            cancelText: "取消",
            confirmText: "确定",
            success: function(e) {
                e.confirm && (a.data.ServiceImgList.splice(t.currentTarget.dataset.index, 1), a.setData({
                    ServiceImgList: a.data.ServiceImgList
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
    toPay: function(e) {
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "pay",
                orderid: e.currentTarget.dataset.id
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
                                url: "../my_order/index?type=buy"
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
        e = e.currentTarget.dataset.id;
        this.setData({
            OrderId: e,
            showRefundModal: !0
        });
    },
    hideRefundModal: function(e) {
        this.setData({
            showRefundModal: !1
        });
    },
    applyRefund: function(e) {
        var t = this, e = e.detail.value.content;
        "" != e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: t.data.OrderId,
                status: -1,
                reason: e,
                m: "superman_hand2"
            },
            success: function(e) {
                t.setData({
                    showRefundModal: !1
                }), wx.showToast({
                    title: "提交成功",
                    icon: "success"
                }), setTimeout(function() {
                    wx.navigateTo({
                        url: "/pages/my_order/index?type=" + t.data.type + "&status=-4"
                    });
                }, 2e3);
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        }) : app.util.message("请输入退款原因", "", "error");
    },
    showCancelRefund: function(t) {
        var a = this;
        wx.showModal({
            title: "系统提示",
            content: "确认取消这次售后申请吗？",
            success: function(e) {
                e.confirm && a.cancelRefund(t);
            }
        });
    },
    cancelRefund: function(e) {
        app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "cancle_refund",
                orderid: e.currentTarget.dataset.id
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
    showAddress: function(e) {
        wx.showModal({
            title: "自提地址",
            content: e.currentTarget.dataset.address,
            showCancel: !1
        });
    },
    showServiceModal: function(e) {
        this.setData({
            OrderId: e.currentTarget.dataset.id,
            showServiceModal: !0
        });
    },
    hideServiceModal: function(e) {
        this.setData({
            showServiceModal: !1
        });
    },
    buyerApplyService: function(e) {
        var t = {
            m: "superman_hand2",
            act: "service",
            orderid: this.data.OrderId
        }, e = e.detail.value.content;
        "" != e ? (t.reason = e, this.data.ServicePostData = t, this.uploadServiceImage(this.data.ServiceImgList, 0)) : app.util.message("请输入售后原因", "", "error");
    },
    checkExpress: function(e) {
        wx.navigateTo({
            url: "../express_info/index?orderid=" + e.currentTarget.dataset.id
        });
    },
    confirmReceive: function(t, e) {
        var a = this, s = t.currentTarget.dataset.id;
        void 0 !== e ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: s,
                status: 4,
                m: "superman_hand2"
            },
            success: function() {
                wx.showModal({
                    title: "系统提示",
                    content: "确认成功，祝您购物愉快！",
                    success: function() {
                        a.setData({
                            list: [],
                            completed: !1,
                            pages: 1,
                            Gone: !1
                        }), a.getOrderList();
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
                e.confirm && a.confirmReceive(t, !0);
            }
        });
    },
    openConfirmPrice: function(e) {
        var t = e.currentTarget.dataset.id, e = e.currentTarget.dataset.price;
        this.setData({
            confirmOrderId: t,
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
    changeExpressFee: function(e) {
        this.setData({
            buyerPayExpressFee: !!e.detail.value.length,
            ExpressFee: 0
        }), this.calcOrderPrice();
    },
    setOrderExpressFee: function(e) {
        var t = this, a = t.data.ExpressFee;
        t.data.buyerPayExpressFee || "" != a ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                m: "superman_hand2",
                act: "set_express_fee",
                orderid: t.data.confirmOrderId,
                express_fee: a,
                buyer_pay_express_fee: t.data.buyerPayExpressFee ? 1 : 0
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), t.setData({
                    showConfirmPrice: !1,
                    list: [],
                    pages: 1
                }), t.onLoad({
                    type: t.data.type
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
            showShipModal: !0,
            order_id: e.currentTarget.dataset.id
        });
    },
    hideShipModal: function() {
        this.setData({
            showShipModal: !1
        });
    },
    sendOrder: function(e) {
        e = e.detail.value;
        null != this.data.epIndex ? "" != e.express_no ? app.util.request({
            url: "entry/wxapp/order",
            data: {
                act: "post",
                orderid: this.data.order_id,
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
    showReceiveInfo: function(e) {
        console.log(e);
        e = {
            name: e.currentTarget.dataset.name,
            mobile: e.currentTarget.dataset.mobile,
            address: e.currentTarget.dataset.address
        };
        this.setData({
            showReceiveModal: !0,
            ReceiveInfo: e
        });
    },
    hideReceiveInfo: function(e) {
        this.setData({
            showReceiveModal: !1,
            ReceiveInfo: {}
        });
    }
});