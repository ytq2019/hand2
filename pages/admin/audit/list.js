var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        Page: 1,
        Paging: !1,
        TabList: [ {
            act: "post",
            title: "物品"
        }, {
            act: "buying",
            title: "求购"
        }, {
            act: "comment",
            title: "留言"
        }, {
            act: "shop",
            title: "商家"
        }, {
            act: "service",
            title: "服务"
        } ],
        TabCur: 0,
        List: [],
        showBatch: !1,
        CheckedIds: [],
        categoryList: [],
        CategoryCur: null
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
    callPhone: function(a) {
        app.superman.callPhone(a);
    },
    toMap: function(a) {
        console.log(), app.superman.toMap(a);
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        var t = this;
        t.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), t.data.userInfo ? (t.setData({
            TabCur: t.getTabCur(a.type)
        }), t.getIndexData(), t.getCategoryData(), t.getTotalData(), app.viewCount()) : app.util.getUserInfo(function() {
            t.onLoad(a);
        });
    },
    onPageScroll: function(a) {
        this.setData({
            showGoTop: 500 <= a.scrollTop
        });
    },
    tabSelect: function(a) {
        var t = this;
        t.setData({
            TabCur: a.currentTarget.dataset.index,
            Page: 1,
            List: [],
            CheckedIds: []
        }), t.getTotalData(), t.getIndexData();
    },
    getIndexData: function() {
        var e = this, a = {
            m: "superman_hand2",
            act: e.data.TabList[e.data.TabCur].act,
            op: "list",
            page: e.data.Page
        };
        "post" == a.act ? a.type = 1 : "buying" == a.act && (a.type = 2), app.util.request({
            url: "entry/wxapp/admin",
            data: a,
            showLoading: !0,
            success: function(a) {
                console.log(a);
                var t = a.data.data, a = e.data.List;
                t.list && (a = a.concat(t.list)), e.setData({
                    Loading: !1,
                    Paging: !1,
                    List: a,
                    Gone: !t.list.length
                });
            },
            fail: function(a) {
                console.log(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getCategoryData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/category",
            data: {
                m: "superman_hand2",
                act: "list"
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    categoryList: a.list
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getTotalData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/admin",
            data: {
                m: "superman_hand2",
                act: "get",
                op: "total"
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    totalData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function() {
        var a = this;
        a.setData({
            Page: 1,
            Paging: !1,
            List: []
        }), a.getTotalData(), a.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function(a) {
        var t = this;
        t.data.Gone || (t.setData({
            Page: t.data.Page + 1,
            Paging: !0
        }), t.getIndexData());
    },
    showAcceptDialog: function(a) {
        var e = this, s = a.currentTarget.dataset.id;
        !e.data.showBatch || e.data.CheckedIds.length ? app.util.Dialog.confirm({
            title: "提示",
            message: "确认审核通过？",
            showCancelButton: !0,
            asyncClose: !0
        }).then(function() {
            app.util.request({
                method: "POST",
                url: "entry/wxapp/admin",
                data: {
                    m: "superman_hand2",
                    act: e.data.TabList[e.data.TabCur].act,
                    op: "status",
                    id: e.data.showBatch ? e.data.CheckedIds.join(",") : s,
                    status: 1
                },
                showLoading: !0,
                success: function(a) {
                    console.log(a);
                    var t = [];
                    e.data.List.forEach(function(a) {
                        e.data.showBatch ? -1 == e.data.CheckedIds.indexOf(a.id) && t.push(a) : a.id != s && t.push(a);
                    }), e.setData({
                        List: t,
                        CheckedIds: []
                    }), app.util.Dialog.close(), e.getTotalData();
                },
                fail: function(a) {
                    console.error(a), app.util.message(a.data.errmsg, "", "error");
                }
            });
        }).catch(function() {
            app.util.Dialog.close();
        }) : app.toast("请选择");
    },
    showRefuseDialog: function(a) {
        !this.data.showBatch || this.data.CheckedIds.length ? this.setData({
            IdCur: a.currentTarget.dataset.id,
            showRefuseDialog: !0
        }) : app.toast("请选择");
    },
    hideRefuseDialog: function(a) {
        this.setData({
            showRefuseDialog: !1
        });
    },
    toRefuse: function(a) {
        var e = this, a = a.detail.value.reason;
        "" != a ? app.util.request({
            method: "POST",
            url: "entry/wxapp/admin",
            data: {
                m: "superman_hand2",
                act: e.data.TabList[e.data.TabCur].act,
                op: "status",
                id: e.data.showBatch ? e.data.CheckedIds.join(",") : e.data.IdCur,
                status: "refuse",
                reason: a
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                var t = [];
                e.data.List.forEach(function(a) {
                    e.data.showBatch ? -1 == e.data.CheckedIds.indexOf(a.id) && t.push(a) : a.id != e.data.IdCur && t.push(a);
                }), e.setData({
                    List: t,
                    CheckedIds: [],
                    showRefuseDialog: !1
                }), e.getTotalData();
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        }) : app.toast("请输入拒绝原因");
    },
    showNoReasonRefuseDialog: function(a) {
        var e = this, s = a.currentTarget.dataset.id;
        !e.data.showBatch || e.data.CheckedIds.length ? app.util.Dialog.confirm({
            title: "提示",
            message: "确认拒绝？",
            showCancelButton: !0,
            asyncClose: !0
        }).then(function() {
            app.util.request({
                method: "POST",
                url: "entry/wxapp/admin",
                data: {
                    m: "superman_hand2",
                    act: e.data.TabList[e.data.TabCur].act,
                    op: "status",
                    id: e.data.showBatch ? e.data.CheckedIds.join(",") : s,
                    status: "refuse"
                },
                showLoading: !0,
                success: function(a) {
                    console.log(a);
                    var t = [];
                    e.data.List.forEach(function(a) {
                        e.data.showBatch ? -1 == e.data.CheckedIds.indexOf(a.id) && t.push(a) : a.id != s && t.push(a);
                    }), e.setData({
                        List: t,
                        CheckedIds: []
                    }), app.util.Dialog.close(), e.getTotalData();
                },
                fail: function(a) {
                    console.error(a), app.util.message(a.data.errmsg, "", "error");
                }
            });
        }).catch(function() {
            app.util.Dialog.close();
        }) : app.toast("请选择");
    },
    showCategoryDialog: function(a) {
        !this.data.showBatch || this.data.CheckedIds.length ? this.setData({
            IdCur: a.currentTarget.dataset.id,
            CategoryTitleCur: a.currentTarget.dataset.categoryTitle,
            showCategoryDialog: !0
        }) : app.toast("请选择");
    },
    hideCategoryDialog: function(a) {
        this.setData({
            showCategoryDialog: !1
        });
    },
    toCategory: function(a) {
        var t, e, s = this;
        null !== s.data.CategoryCur ? (t = s.data.categoryList[s.data.CategoryCur].id, e = s.data.categoryList[s.data.CategoryCur].title, 
        s.data.CategoryTitleCur != e ? app.util.request({
            method: "POST",
            url: "entry/wxapp/admin",
            data: {
                m: "superman_hand2",
                act: s.data.TabList[s.data.TabCur].act,
                op: "category",
                id: s.data.showBatch ? s.data.CheckedIds.join(",") : s.data.IdCur,
                cid: t
            },
            showLoading: !0,
            success: function(a) {
                console.log(a), s.data.List.forEach(function(a) {
                    a.checked = !1, s.data.showBatch ? -1 != s.data.CheckedIds.indexOf(a.id) && (a.cid = t, 
                    a.category.title = e) : a.id == s.data.IdCur && (a.cid = t, a.category.title = e);
                }), s.setData({
                    List: s.data.List,
                    CheckedIds: [],
                    showCategoryDialog: !1,
                    CategoryCur: null
                }), s.getTotalData();
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        }) : app.toast("分类未修改")) : app.toast("请选择分类");
    },
    changeCategory: function(a) {
        this.setData({
            CategoryCur: a.detail.value
        });
    },
    showDeleteDialog: function(a) {
        var e = this, s = a.currentTarget.dataset.id;
        !e.data.showBatch || e.data.CheckedIds.length ? app.util.Dialog.confirm({
            title: "提示",
            message: "确认删除？",
            showCancelButton: !0,
            asyncClose: !0
        }).then(function() {
            app.util.request({
                method: "POST",
                url: "entry/wxapp/admin",
                data: {
                    m: "superman_hand2",
                    act: e.data.TabList[e.data.TabCur].act,
                    op: "delete",
                    id: e.data.showBatch ? e.data.CheckedIds.join(",") : s
                },
                showLoading: !0,
                success: function(a) {
                    console.log(a);
                    var t = [];
                    e.data.List.forEach(function(a) {
                        e.data.showBatch ? -1 == e.data.CheckedIds.indexOf(a.id) && t.push(a) : a.id != s && t.push(a);
                    }), e.setData({
                        List: t,
                        CheckedIds: []
                    }), app.util.Dialog.close(), e.getTotalData();
                },
                fail: function(a) {
                    console.error(a), app.util.message(a.data.errmsg, "", "error");
                }
            });
        }).catch(function() {
            app.util.Dialog.close();
        }) : app.toast("请选择");
    },
    showBatch: function(a) {
        var t, e = this;
        e.setData({
            showBatch: !e.data.showBatch
        }), e.data.showBatch || ((t = e.data.List).forEach(function(a) {
            a.checked = !1;
        }), e.setData({
            List: t,
            CheckedIds: []
        }));
    },
    checkItem: function(a) {
        var e = this, s = a.currentTarget.dataset.index;
        e.data.List[s].checked = !!a.detail.value.length, e.data.List[s].checked ? e.data.CheckedIds.push(e.data.List[s].id) : e.data.CheckedIds.forEach(function(a, t) {
            if (a == e.data.List[s].id) return e.data.CheckedIds.splice(t, 1), !1;
        }), e.setData({
            List: e.data.List,
            CheckedIds: e.data.CheckedIds
        });
    },
    checkAll: function(a) {
        var t = this;
        t.data.CheckedIds = [], t.data.List.forEach(function(a) {
            a.checked = !0, t.data.CheckedIds.push(a.id);
        }), t.setData({
            List: t.data.List,
            CheckedIds: t.data.CheckedIds
        });
    },
    uncheckAll: function(a) {
        var t = this;
        t.data.CheckedIds = [], t.data.List.forEach(function(a) {
            a.checked = !a.checked, a.checked && t.data.CheckedIds.push(a.id);
        }), t.setData({
            List: t.data.List,
            CheckedIds: t.data.CheckedIds
        });
    },
    getTabCur: function(a) {
        for (var t = 0; t < this.data.TabList.length; t++) if (a == this.data.TabList[t].act) return t;
        return 0;
    },
    previewImg: function(a) {
        var t = a.currentTarget.dataset.index, a = a.currentTarget.dataset.subIndex, t = this.data.List[t].album;
        wx.previewImage({
            current: t[a],
            urls: t
        });
    }
});