var _poster = require("../../libs/wxa-plugin-canvas/poster/poster"), _poster2 = _interopRequireDefault(_poster);

function _interopRequireDefault(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        itemData: null,
        Paging: !1,
        Page: 1,
        List: []
    },
    onLoad: function(t) {
        console.log("onLoad", t);
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle(),
            itemId: void 0 !== t.id ? t.id : 0
        }), this.getIndexData(), app.viewCount();
    },
    onReachBottom: function(t) {
        var e = this;
        e.data.Gone || (e.setData({
            Page: e.data.Page + 1,
            Paging: !0
        }), e.getShareList());
    },
    getIndexData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "help_sell",
                id: e.data.itemId
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                e.setData({
                    Loading: !1,
                    itemData: t,
                    posterConfig: e.getPosterConfig(t)
                }, function() {
                    _poster2.default.create();
                }), e.getShareList();
            },
            fail: function(t) {
                console.log(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getShareList: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "share_list",
                item_id: a.data.itemId,
                page: a.data.Page
            },
            showLoading: !1,
            success: function(t) {
                console.log(t);
                var e = t.data.data, t = a.data.List;
                e.list && (t = t.concat(e.list)), a.setData({
                    Loading: !1,
                    Paging: !1,
                    List: t,
                    Gone: !e.list.length
                });
            },
            fail: function(t) {
                console.log(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getPosterConfig: function(t) {
        var e = null;
        return 1 == t.poster.style ? (e = {
            width: 750,
            height: 1140,
            backgroundColor: "#fff",
            debug: !1,
            pixelRatio: 1,
            images: [ {
                width: 96,
                height: 96,
                borderRadius: 96,
                x: 32,
                y: 14,
                url: t.avatar || this.data.LogoUrl
            }, {
                width: 686,
                height: 446,
                x: 32,
                y: 164,
                url: t.cover
            }, {
                width: 266,
                height: 266,
                x: 394,
                y: 762,
                url: t.mpcode
            } ],
            texts: [ {
                x: 144,
                y: 14,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: t.nickname || "**",
                    fontSize: 32,
                    color: "#333333",
                    marginLeft: 0
                } ]
            }, {
                x: 144,
                y: 74,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: t.msg,
                    fontSize: 24,
                    color: "#333333"
                } ]
            }, {
                x: 34,
                y: 642,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: t.title,
                    fontSize: 32,
                    color: "#333333",
                    lineNum: 2,
                    lineHeight: 44,
                    width: 660
                } ]
            }, {
                x: 388,
                y: 1056,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: "长按二维码，快来看看",
                    fontSize: 28,
                    color: "#999999"
                } ]
            } ]
        }, 0 < t.price && e.texts.push({
            x: 34,
            y: 746,
            baseLine: "top",
            zIndex: 100,
            text: [ {
                text: t.currency_info.symbol + t.price,
                fontSize: 48,
                color: "#E73630"
            } ]
        })) : 2 == t.poster.style && (e = {
            width: 750,
            height: 1140,
            backgroundColor: "#fff",
            debug: !1,
            pixelRatio: 1,
            images: [ {
                width: 686,
                height: 645,
                x: 32,
                y: 32,
                url: t.cover
            }, {
                width: 266,
                height: 266,
                x: 48,
                y: 828,
                url: t.mpcode
            } ],
            texts: [ {
                x: 34,
                y: 696,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: t.title,
                    fontSize: 32,
                    color: "#333333",
                    lineNum: 2,
                    lineHeight: 44,
                    width: 660
                } ]
            }, {
                x: 422,
                y: 958,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: "长按识别小程序二维码",
                    fontSize: 28,
                    color: "#999999"
                } ]
            }, {
                x: 422,
                y: 998,
                baseLine: "top",
                zIndex: 100,
                text: [ {
                    text: "好物带回家",
                    fontSize: 28,
                    color: "#999999"
                } ]
            } ],
            lines: [ {
                startX: 364,
                endX: 366,
                startY: 878,
                endY: 1038,
                width: 1,
                color: "#d8d8d8",
                zIndex: 100
            } ]
        }, 0 < t.price && e.texts.push({
            x: 422,
            y: 876,
            baseLine: "top",
            zIndex: 100,
            text: [ {
                text: t.currency_info.symbol + t.price,
                fontSize: 48,
                color: "#E73630"
            } ]
        })), e;
    },
    onPosterSuccess: function(t) {
        var e = this, a = t.detail;
        console.log(a), app.superman.base64({
            url: a,
            type: "png"
        }).then(function(t) {
            e.setData({
                posterPath: a,
                showPoster: !0
            });
        });
    },
    onPosterFail: function(t) {
        console.error(t);
    },
    savePoster: function() {
        var e = this;
        wx.saveImageToPhotosAlbum({
            filePath: e.data.posterPath,
            success: function(t) {
                app.toast("保存成功", "success");
            },
            fail: function(t) {
                console.error(t), app.superman.checkAuthorize("scope.saveImageToPhotosAlbum", function(t) {
                    console.log(t), t.confirm && e.savePoster();
                }, "提示", "很抱歉，您没有授权小程序保存图片的权限，您将无法将海报分享好友，分享您的发现。请再次尝试保存操作，选择允许。");
            }
        });
    },
    onShareAppMessage: function(t) {
        var e = this, a = "/pages/detail/index?id=" + e.data.itemId + "&share_uid=" + e.data.userInfo.memberInfo.uid;
        return {
            title: e.data.itemData.title,
            path: "/pages/home/index?redirect=" + encodeURIComponent(a),
            imageUrl: e.data.itemData.cover || wx.getStorageSync("Logo")
        };
    }
});