var app = getApp();

Page({
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        Loading: !0,
        ItemStatus: [ {
            title: "发布中",
            status: 1
        }, {
            title: "已下架",
            status: -1
        }, {
            title: "已转让",
            status: 2
        }, {
            title: "待审核",
            status: 0
        }, {
            title: "未通过",
            status: -3
        } ],
        ItemStatusIndex: 0,
        ItemStatusScrollLeft: 0,
        ItemList: [],
        Page: 1,
        Paging: !0,
        showDeleteModal: !1
    },
    onLoad: function(t) {
        console.log("onLoad", t);
        this.setData({
            ItemStatusIndex: void 0 !== t.index ? t.index : 0,
            ThemeStyle: app.getThemeStyle(),
            itemType: t.type,
            pageTitle: 1 == t.type ? "我转让的" : "我求购的"
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "post",
                status: e.data.ItemStatus[e.data.ItemStatusIndex].status,
                page: e.data.Page,
                type: e.data.itemType
            },
            showLoading: !0,
            success: function(t) {
                console.log(t), e.loadPageData(t.data.data);
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    loadPageData: function(t) {
        for (var e = this, a = t.item_list || [], s = 0; s < a.length; s++) {
            var n = app.formatPrice(a[s], t.currency_info.symbol);
            a[s]._price = n, 0 == a[s].buy_type && 0 < a[s].price && (n = n.split("."), a[s]._price_integer = parseInt(n[0].substr(1)), 
            a[s]._price_decimal = void 0 !== n[1] ? n[1] : "00");
        }
        e.setData({
            Loading: !1,
            Refresh: void 0 !== t.refresh ? t.refresh : {},
            ItemList: a.length ? e.data.ItemList.concat(a) : e.data.ItemList,
            Gone: !t.item_list.length || t.item_list.length < 10,
            currencyInfo: t.currency_info
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            ItemList: [],
            Gone: !1
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this;
        t.data.Gone || (t.setData({
            Page: t.data.Page + 1,
            Paging: !0
        }), t.getIndexData());
    },
    swtichItemStatus: function(t) {
        this.setData({
            ItemStatusIndex: t.currentTarget.dataset.index,
            ItemStatusScrollLeft: 60 * (t.currentTarget.dataset.index - 1),
            Page: 1,
            ItemList: []
        }), this.getIndexData();
    },
    toPage: function(t) {
        var e = this.data.ItemStatus[this.data.ItemStatusIndex].status;
        1 != e && -1 != e || wx.navigateTo({
            url: t.currentTarget.dataset.url
        });
    },
    toEdit: function(t) {
        wx.navigateTo({
            url: t.currentTarget.dataset.url
        });
    },
    showRefreshModal: function(t) {
        var e = this, a = e.data.Refresh.fee_type, s = t.currentTarget.dataset.count;
        if (0 == a || 2 == a && 0 == s) return e.setData({
            ItemId: t.currentTarget.dataset.id
        }), void e.toPay(null, "refresh_item");
        e.setData({
            showRefreshModal: !0,
            ItemId: t.currentTarget.dataset.id,
            payPrice: e.data.Refresh.price
        });
    },
    hideRefreshModal: function(t) {
        this.setData({
            showRefreshModal: !1
        });
    },
    toPay: function(t, e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: void 0 !== e ? e : t.currentTarget.dataset.act,
                itemid: a.data.ItemId
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                void 0 !== t.paySign ? wx.requestPayment({
                    timeStamp: t.timeStamp,
                    nonceStr: t.nonceStr,
                    package: t.package,
                    signType: t.signType,
                    paySign: t.paySign,
                    success: function() {
                        wx.showModal({
                            title: "系统提示",
                            content: "刷新成功，已更新物品排序",
                            showCancel: !1,
                            success: function(t) {
                                a.setData({
                                    Page: 1,
                                    ItemList: [],
                                    showRefreshModal: !1
                                }), a.getIndexData();
                            }
                        });
                    }
                }) : wx.showModal({
                    title: "系统提示",
                    content: "刷新成功，已更新物品排序",
                    showCancel: !1,
                    success: function(t) {
                        a.setData({
                            Page: 1,
                            ItemList: [],
                            showRefreshModal: !1
                        }), a.getIndexData();
                    }
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    refreshAll: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "refresh_all_item"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                void 0 !== t.refresh_id ? e.setData({
                    showRefreshModal: !0,
                    payPrice: t.amount,
                    RefreshId: t.refresh_id
                }) : wx.showModal({
                    title: "系统提示",
                    content: "刷新成功，已更新物品排序",
                    showCancel: !1,
                    success: function(t) {
                        e.setData({
                            Page: 1,
                            ItemList: [],
                            showRefreshModal: !1
                        }), e.getIndexData();
                    }
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    toPayAll: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "refresh_all_item",
                refresh_id: e.data.RefreshId,
                pay_all: 1
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                wx.requestPayment({
                    timeStamp: t.timeStamp,
                    nonceStr: t.nonceStr,
                    package: t.package,
                    signType: t.signType,
                    paySign: t.paySign,
                    success: function() {
                        wx.showModal({
                            title: "系统提示",
                            content: "刷新成功，已更新物品排序",
                            showCancel: !1,
                            success: function(t) {
                                e.setData({
                                    Page: 1,
                                    ItemList: [],
                                    showRefreshModal: !1
                                }), e.getIndexData();
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    showDeleteModal: function(t) {
        this.setData({
            deleteItemId: t.currentTarget.dataset.id,
            showDeleteModal: !0
        });
    },
    hideDeleteModal: function(t) {
        this.setData({
            showDeleteModal: !1
        });
    },
    deleteItem: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "delete",
                itemid: a.data.deleteItemId
            },
            showLoading: !0,
            success: function(t) {
                app.util.message("删除成功", "", "success"), a.data.ItemList.forEach(function(t, e) {
                    t.id == a.data.deleteItemId && a.data.ItemList.splice(e, 1);
                }), a.setData({
                    showDeleteModal: !1,
                    deleteItemId: 0,
                    ItemList: a.data.ItemList
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    }
});