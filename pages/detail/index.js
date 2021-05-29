var app = getApp(), rewardedVideoAd = null;

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl,
        iphoneX: app.globalData.iphoneX,
        Loading: !0,
        imgheights: [],
        current: 0,
        is_author: !1,
        disabledActionSheet: !0,
        actions: [],
        soldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png",
        showWxad: !0,
        showHelpSellGuide: !1,
        contentReportComment: "",
        showVideoAd: !1,
        isVip: 0,
    },
    onLoad: function(t) {
        var e = this, a = t.id, i = wx.getStorageSync("userInfo");
        e.setData({
            uid: i ? i.memberInfo.uid : 0,
            item_id: a,
            userInfo: i,
            shareUid: t.share_uid || wx.getStorageSync("ShareUid"),
            locationInfo: wx.getStorageSync("LocationInfo") || null,
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle(),
            showHelpSellGuide: !wx.getStorageSync("HelpSellGuide"),
            options: t,
            isSinglePage: null
        }), void 0 !== t.scene ? (i = decodeURIComponent(t.scene), e.setData({
            item_id: i
        }), e.getItemDetail(i)) : e.getItemDetail(a);
        try {
            wx.removeStorageSync("PostSuccessData-" + a);
        } catch (t) {}
        e.data.shareUid && e.data.userInfo && e.data.userInfo.memberInfo.uid != e.data.shareUid && app.updateShare(e.data.shareUid, e.data.item_id),
        t.share && "timeline" == t.share && null === e.data.isSinglePage && wx.login({
            success: function() {
                e.setData({
                    isSinglePage: !1
                });
            },
            fail: function() {
                e.setData({
                    isSinglePage: !0
                });
            }
        }), app.viewCount();
        e.getVip();
    },
    onShow: function () {
        this.getVip();
    },
    toPage: function(t) {
        app.superman.toPage(t);
    },
    imageLoad: function(t) {
        var e = t.detail.width / t.detail.height, a = this.data.imgheights;
        a[t.target.dataset.index] = 750 / e, 375 < a[t.target.dataset.index] && (a[t.target.dataset.index] = 375),
        this.setData({
            imgheights: a
        });
    },
    bindSwiperChange: function(t) {
        this.setData({
            current: t.detail.current
        });
    },
    getItemDetail: function(t) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "detail",
                id: t,
                check_status: 0
            },
            success: function(t) {
                t = t.data.data;
                if (t.item.id) {
                    if (s.data.uid && s.data.uid == t.item.seller_uid && s.setData({
                        is_author: !0
                    }), 1 != t.item.status && -1 != t.item.status || s.setData({
                        disabledActionSheet: !1
                    }), t.item.add_fields) {
                        for (var e = t.item.add_fields, a = 0; a < e.length; a++) "" != e[a].value ? e[a].ismobile = /^1[3456789]\d{9}$/.test(e[a].value) : e.splice(a, 1);
                        t.item.add_fields = e;
                    }
                    if (0 < t.item.video.length) {
                        for (var i = t.item.video, o = s.data.imgheights, n = 0; n < i.length; n++) o.unshift("375");
                        s.setData({
                            imgheights: o
                        });
                    }
                    t.item._price = app.formatPrice(t.item, t.currency_info.symbol), s.setData({
                        Loading: !1,
                        soldImg: t.sold_img || s.data.soldImg,
                        post_time: t.post_time,
                        integrity_logo: t.integrity_logo,
                        platform_flag: t.platform_flag,
                        detail: t.item,
                        message: t.message,
                        hide_view: t.item_view,
                        WxadInfo: t.wxad_info,
                        helpSell: t.help_sell,
                        posterInfo: t.poster_info,
                        actions: s.getActions(t.item.status),
                        currencyInfo: t.currency_info,
                        creditInfo: t.credit_info,
                        commentTips: t.comment_tips || "很感兴趣，我要留言",
                        reportOpen: t.report_open,
                        contactOpen: t.contact_open,
                        serviceImg: t.service_img,
                        refreshTips: t.refresh_tips
                    }), t.reward_video_open && wx.createRewardedVideoAd && s.data.WxadInfo.reward_video.id && setTimeout(function() {
                        s.loadVideoAd(s.data.WxadInfo.reward_video.id);
                    }, 500);
                } else wx.redirectTo({
                    url: "/pages/404/index"
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getActions: function(t) {
        var e = [];
        return 2 != t && e.push({
            name: "已转让"
        }), 1 == t ? e.push({
            name: "下架"
        }) : -1 != t && 2 != t || e.push({
            name: "上架"
        }), e.push({
            name: "编辑"
        }), e;
    },
    previewImg: function(t) {
        var e = this, t = t.currentTarget.dataset.index;
        e.data.detail.video.length && (t -= e.data.detail.video.length), wx.previewImage({
            current: e.data.detail.album[t],
            urls: e.data.detail.album
        });
    },
    toMap: function(t) {
        var  f = t.currentTarget.dataset.address ,e = parseFloat(t.currentTarget.dataset.lat), t = parseFloat(t.currentTarget.dataset.lng);
        wx.openLocation({
            name: f,
            latitude: e,
            longitude: t,
            scale: 24
        });
    },
    submitAppreciateAndFavor: function(t) {
        var e, a, i = this;
        i.data.options.share && "timeline" == i.data.options.share && !0 === i.data.isSinglePage ? app.toast("请前往小程序使用完整服务") : wx.getStorageSync("userInfo") ? (e = t.currentTarget.dataset.type,
        a = {
            m: "superman_hand2",
            act: "detail",
            id: i.data.item_id,
            type: e,
            status: 1 == e ? 0 == i.data.detail.is_favour ? 0 : 1 : 0 == i.data.detail.is_collect ? 0 : 1
        }, app.util.request({
            method: "POST",
            url: "entry/wxapp/item",
            data: a,
            success: function(t) {
                console.log(t);
                t = 1 == e ? "点赞" : "收藏";
                1 == e ? i.data.detail.is_favour = 0 == a.status ? 1 : 0 : 2 == e && (i.data.detail.is_collect = 0 == a.status ? 1 : 0),
                i.setData({
                    detail: i.data.detail
                }), app.toast(0 == a.status ? t + "成功" : "取消" + t);
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        })) : app.util.getUserInfo(function() {
            i.submitAppreciateAndFavor(t);
        });
    },
    makePhone: function(t) {
        if (0 === this.data.isVip) {
            wx.showModal({
                title: "提示",
                content: "您还未购买线下到店专业版，请先购买（可查看全部上架线下库房）",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/member/index"
                        });
                    }
                }
            });
            return;
        }
        t = t.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    copyWechat: function(t) {
        if (0 === this.data.isVip) {
            wx.showModal({
                title: "提示",
                content: "您还未购买线下到店专业版，请先购买（可查看全部上架线下库房）",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/member/index"
                        });
                    }
                }
            });
            return;
        }
        t = t.currentTarget.dataset.wechat;
        wx.setClipboardData({
            data: t
        }), wx.showModal({
            title: "系统提示",
            content: "已经复制卖家微信到剪贴板，请去微信添加好友与其联系吧",
            showCancel: !1
        });
    },
    copyValue: function(t) {
        t = t.currentTarget.dataset.value;
        wx.setClipboardData({
            data: t
        });
    },
    showComment: function(t) {
        var e = this;
        wx.getStorageSync("userInfo") ? e.setData({
            submitType: "comment",
            msg_id: "",
            showReportAndComment: !0,
            modalTitle: "请输入内容"
        }) : app.util.getUserInfo(function() {
            e.showComment(t);
        });
    },
    showCommentReply: function(t) {
        var e, a = this;
        wx.getStorageSync("userInfo") ? (e = t.currentTarget.dataset.id, a.setData({
            submitType: "reply",
            msg_id: e,
            showReportAndComment: !0,
            modalTitle: "留言"
        })) : app.util.getUserInfo(function() {
            a.showCommentReply(t);
        });
    },
    showReport: function() {
        var t = this;
        wx.getStorageSync("userInfo") ? t.setData({
            submitType: "report",
            showReportAndComment: !0,
            modalTitle: "举报理由"
        }) : app.util.getUserInfo(function() {
            t.showReport();
        });
    },
    hideReportAndComment: function() {
        this.setData({
            showReportAndComment: !1
        });
    },
    submitReportAndComment: function(t) {
        var e = this, t = t.detail.value.content;
        "" != t ? ("report" == e.data.submitType && app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "report",
                itemid: e.data.item_id,
                content: t
            },
            success: function(t) {
                e.setData({
                    showReportAndComment: !1,
                    contentReportComment: ""
                }), app.toast("举报成功");
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        }), "reply" == e.data.submitType && app.util.request({
            method: "POST",
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "detail",
                id: e.data.item_id,
                msg_id: e.data.msg_id,
                reply: t
            },
            success: function(t) {
                e.setData({
                    showReportAndComment: !1,
                    contentReportComment: ""
                }), app.toast("回复成功"), setTimeout(function() {
                    e.getItemDetail(e.data.item_id);
                }, 2e3);
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        }), "comment" == e.data.submitType && app.util.request({
            method: "POST",
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "detail",
                id: e.data.item_id,
                comment: t
            },
            success: function(t) {
                e.setData({
                    showReportAndComment: !1,
                    contentReportComment: ""
                }), app.toast(t.data.errmsg), setTimeout(function() {
                    e.getItemDetail(e.data.item_id);
                }, 2e3);
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        })) : app.toast("请输入内容");
    },
    toChat: function(t) {
        var e, a, i = this;
        wx.getStorageSync("userInfo") ? (e = i.data.uid, a = i.data.detail.seller_uid, app.util.request({
            url: "entry/wxapp/item",
            data: {
                act: "detail",
                chat: 1,
                id: i.data.item_id,
                from_uid: e,
                m: "superman_hand2"
            },
            success: function(t) {
                var e = "/pages/message/chat?fromuid=" + a + "&itemid=" + i.data.item_id;
                i.checkMobile(function() {
                    wx.navigateTo({
                        url: "/pages/bind_phone/index?redirect=" + encodeURIComponent(e)
                    });
                }, function() {
                    wx.navigateTo({
                        url: e
                    });
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        })) : app.util.getUserInfo(function() {
            i.toChat(t);
        });
    },
    checkMobile: function(e, a) {
        var i = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "check_mobile"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t), t.data.data.has_mobile ? a() : 1 == i.data.detail.chat_bind_phone ? app.util.Dialog.confirm({
                    title: "温馨提示",
                    message: "账号未绑定手机号，无法及时接收消息通知",
                    showCancelButton: !0,
                    confirmButtonText: "好的，去绑定",
                    cancelButtonText: "暂不绑定",
                    asyncClose: !0
                }).then(function() {
                    app.util.Dialog.close(), e();
                }).catch(function(t) {
                    app.util.Dialog.close(), "overlay" != t && a();
                }) : 2 == i.data.detail.chat_bind_phone ? app.util.Dialog.confirm({
                    title: "温馨提示",
                    message: "账号未绑定手机号，无法及时接收消息通知",
                    showCancelButton: !1,
                    confirmButtonText: "好的，去绑定",
                    asyncClose: !0
                }).then(function() {
                    app.util.Dialog.close(), e();
                }).catch(function(t) {
                    app.util.Dialog.close(), "overlay" != t && a();
                }) : a();
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    showActionSheet: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    hideActionSheet: function() {
        this.setData({
            showActionSheet: !1
        });
    },
    clickActionSheet: function(t) {
        for (var t = t.detail, e = this, a = t.index, i = "", o = e.data.actions, n = 0; n < o.length; n++) a == n && (i = o[n].name);
        console.log("clickActionSheet", a, i), "上架" == i || "下架" == i || "已转让" == i ? app.util.Dialog.confirm({
            title: "提示",
            message: "确定" + i + "吗？",
            showCancelButton: !0,
            confirmButtonText: "确定",
            asyncClose: !0
        }).then(function() {
            var t = 0;
            switch (i) {
              case "上架":
                t = 1;
                break;

              case "下架":
                t = -1;
                break;

              case "已转让":
                t = 2;
            }
            app.util.request({
                method: "POST",
                url: "entry/wxapp/item",
                data: {
                    m: "superman_hand2",
                    act: "detail",
                    id: e.data.item_id,
                    status: t
                },
                complete: function() {
                    e.setData({
                        showActionSheet: !1
                    }), app.util.Dialog.close();
                },
                success: function(t) {
                    app.util.message("操作成功"), e.getItemDetail(e.data.item_id);
                },
                fail: function(t) {
                    app.util.message(t.data.errmsg, "", "error");
                }
            });
        }).catch(function() {
            app.util.Dialog.close();
        }) : "编辑" == i && (e.data.refreshTips ? app.util.Dialog.confirm({
            title: "提示",
            message: e.data.refreshTips,
            showCancelButton: !0,
            confirmButtonText: "我要编辑",
            cancelButtonText: "刷新排序",
            asyncClose: !0
        }).then(function() {
            e.setData({
                showActionSheet: !1
            }), 1 == e.data.detail.type ? wx.navigateTo({
                url: "/pages/post/index?id=" + e.data.item_id
            }) : 2 == e.data.detail.type && wx.navigateTo({
                url: "/pages/buying/edit?id=" + e.data.item_id
            }), app.util.Dialog.close();
        }).catch(function() {
            e.setData({
                showActionSheet: !1
            }), wx.navigateTo({
                url: "/pages/my/post?type=" + e.data.detail.type
            }), app.util.Dialog.close();
        }) : (e.setData({
            showActionSheet: !1
        }), 1 == e.data.detail.type ? wx.navigateTo({
            url: "/pages/post/index?id=" + e.data.item_id
        }) : 2 == e.data.detail.type && wx.navigateTo({
            url: "/pages/buying/edit?id=" + e.data.item_id
        })));
    },
    buy: function(t) {
        var e, a = t.currentTarget.dataset.id, t = t.currentTarget.dataset.type;
        0 != this.data.detail.stock ? (e = "/pages/cashier/index?type=" + t + "&id=" + a,
        this.checkMobile(function() {
            wx.navigateTo({
                url: "/pages/bind_phone/index?redirect=" + encodeURIComponent(e)
            });
        }, function() {
            wx.navigateTo({
                url: e
            });
        })) : app.toast("已抢光");
    },
    onShareAppMessage: function(t) {
        return {
            title: this.data.detail.title,
            path: "/pages/home/index?redirect=" + encodeURIComponent("/pages/detail/index?id=" + this.data.item_id)
        };
    },
    onShareTimeline: function() {
        return {
            title: this.data.detail.title,
            query: "id=" + this.data.item_id + "&share=timeline",
            imageUrl: this.data.detail.thumb[0] || wx.getStorageSync("Logo")
        };
    },
    WxadError: function(t) {
        console.error("WxadError", t), this.setData({
            showWxad: !1
        });
    },
    hideHelpSellGuide: function(t) {
        wx.setStorageSync("HelpSellGuide", !0), this.setData({
            showHelpSellGuide: !1
        });
    },
    loadVideoAd: function(t) {
        var e = this;
        (rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: t
        })).onLoad(function() {
            console.log("rewardedVideoAd: onLoad event emit");
        }), rewardedVideoAd.onError(function(t) {
            console.log("rewardedVideoAd: onError event emit", t);
        }), rewardedVideoAd.onClose(function(t) {
            console.log("rewardedVideoA: onClose event emit", t), t && t.isEnded ? app.util.request({
                method: "POST",
                url: "entry/wxapp/my",
                data: {
                    m: "superman_hand2",
                    act: "reward_video_ended",
                    look_id: e.data.videoInfo.look_id,
                    r: e.data.videoInfo.r,
                    t: e.data.videoInfo.t
                },
                showLoading: !0,
                success: function(t) {
                    console.log(t);
                    t = t.data.data;
                    console.log("rewardedVideoAd: " + e.data.creditInfo.title + "+" + t.credit_value),
                    app.toast(e.data.creditInfo.title + "+" + t.credit_value);
                },
                fail: function(t) {
                    console.error(t), app.util.message(t.data.errmsg, "", "error");
                }
            }) : app.util.message("未看完视频，没有获得" + e.data.creditInfo.title, "", "error");
        }), e.setData({
            showVideoAd: !0
        });
    },
    showVideoAd: function(t) {
        var e = this;
        wx.getStorageSync("userInfo") ? app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "reward_video_apply"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                e.setData({
                    videoInfo: t.video_info
                }), rewardedVideoAd.show().catch(function() {
                    rewardedVideoAd.load().then(function() {
                        return rewardedVideoAd.show();
                    }).catch(function(t) {
                        console.log("激励视频 广告显示失败");
                    });
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        }) : app.util.getUserInfo(function() {
            e.showVideoAd(t);
        });
    },
    getUserProfile: function(t) {
        var e = this;
        e.data.options.share && "timeline" == e.data.options.share && !0 === e.data.isSinglePage ? app.toast("请前往小程序使用完整服务") : wx.getUserProfile({
            desc: "更新用户信息",
            success: function(t) {
                app.util.getUserInfo(function() {
                    e.onLoad(e.data.options);
                }, t);
            },
            fail: function(t) {
                console.error(t), app.util.message("未获取用户信息，无法执行", "", "error");
            }
        });
    },
    getVip: function () {
        var a = this, e = wx.getStorageSync("openid");
        console.log(e), app.util.request({
            url: "entry/wxapp/demo",
            showLoading: !1,
            data: {
                m: "superman_hand2",
                act: "isVip",
                openid: a.data.userInfo.memberInfo.openid
            },
            success: function (e) {
                console.log("获取vip数据"), console.log(e), a.setData({
                    isVip: e.data.data.vip_type,
                });
            }
        });
    },
});
