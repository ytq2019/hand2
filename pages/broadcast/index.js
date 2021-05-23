// var app = getApp(), livePlayer = requirePlugin("live-player-plugin");
//
// Page({
//     data: {
//         CustomBar: app.globalData.CustomBar,
//         AssetsUrl: app.globalData.AssetsUrl,
//         LogoUrl: app.globalData.LogoUrl,
//         Loading: !0,
//         Rooms: [],
//         Page: 1,
//         Keyword: "",
//         timerId: null
//     },
//     onLoad: function(t) {
//         console.log("onLoad", t);
//         this.setData({
//             userInfo: wx.getStorageSync("userInfo"),
//             ThemeStyle: app.getThemeStyle(),
//             isFromFootnav: t.from && "footnav" == t.from
//         }), this.getIndexData(), app.viewCount();
//     },
//     onUnload: function() {
//         var t = this;
//         null !== t.data.timerId && (console.log("clearInterval", t.data.timerId), clearInterval(t.data.timerId));
//     },
//     getIndexData: function() {
//         var a = this;
//         app.util.request({
//             url: "entry/wxapp/broadcast",
//             data: {
//                 m: "superman_hand2",
//                 act: "room",
//                 op: "list",
//                 page: a.data.Page,
//                 keyword: a.data.Keyword
//             },
//             showLoading: !0,
//             success: function(t) {
//                 console.log(t);
//                 var e, o = t.data.data;
//                 void 0 === o.rooms || !o.rooms.length || (e = wx.getStorageSync("LiveStatus")) && o.rooms.forEach(function(t, a) {
//                     102 == t.live_status && void 0 !== e[t.roomid] && (o.rooms[a].live_status = e[t.roomid]);
//                 }), a.setData({
//                     Loading: !1,
//                     Rooms: void 0 !== o.rooms ? a.data.Rooms.concat(o.rooms) : a.data.Rooms,
//                     Gone: void 0 !== o.rooms && !o.rooms.length
//                 }), null === a.data.timerId && (a.data.timerId = setInterval(function() {
//                     a.refreshLiveStatus();
//                 }, 6e4));
//             },
//             fail: function(t) {
//                 app.util.message(t.data.errmsg, "", "error");
//             }
//         });
//     },
//     refreshLiveStatus: function() {
//         var r = this;
//         if (!r.data.Rooms.length) return clearInterval(r.data.timerId), void console.info("refreshLiveStatus", "没有直播数据");
//         r.data.Rooms.forEach(function(e, o) {
//             102 == e.live_status && livePlayer.getLiveStatus({
//                 room_id: e.roomid
//             }).then(function(t) {
//                 console.info("getLiveStatus", "roomid=" + e.roomid, t, new Date().toLocaleString()),
//                 r.data.Rooms[o].live_status = t.liveStatus, r.setData({
//                     Rooms: r.data.Rooms
//                 });
//                 var a = wx.getStorageSync("LiveStatus");
//                 (a = a || [])[e.roomid] != t.liveStatus && (a[e.roomid] = t.liveStatus, wx.setStorageSync("LiveStatus", a),
//                 app.util.request({
//                     method: "POST",
//                     url: "entry/wxapp/broadcast",
//                     data: {
//                         m: "superman_hand2",
//                         act: "room",
//                         op: "status",
//                         roomid: e.roomid,
//                         status: t.liveStatus
//                     },
//                     showLoading: !1,
//                     success: function(t) {
//                         console.log("refreshLiveStatus success", t);
//                     },
//                     fail: function(t) {
//                         console.error("refreshLiveStatus fail", t);
//                     }
//                 }));
//             }).catch(function(t) {
//                 console.log("getLiveStatus", t);
//             });
//         });
//     },
//     onPullDownRefresh: function() {
//         this.setData({
//             Page: 1,
//             Rooms: [],
//             Loading: !0
//         }), this.getIndexData(), wx.stopPullDownRefresh();
//     },
//     onReachBottom: function() {
//         var t = this;
//         t.data.Gone || (t.setData({
//             Page: t.data.Page + 1,
//             Paging: !0
//         }), t.getIndexData());
//     },
//     openRoom: function(t) {
//         var a = t.currentTarget.dataset.roomId, t = t.currentTarget.dataset.time;
//         void 0 !== a ? (a = "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + a + "&custom_params=",
//         wx.navigateTo({
//             url: a
//         })) : void 0 !== t && app.util.message("直播时间：" + t, "", "error");
//     },
//     onShareAppMessage: function(t) {
//         if ("button" != t.from) return {
//             title: "直播大厅",
//             path: "/pages/broadcast/index"
//         };
//         var a = "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + t.target.dataset.roomId + "&custom_params=";
//         return {
//             title: t.target.dataset.title,
//             path: a,
//             imageUrl: t.target.dataset.shareImg
//         };
//     },
//     onShareTimeline: function(t) {
//         return {
//             title: "直播大厅",
//             path: "/pages/broadcast/index",
//             query: "share=timeline"
//         };
//     }
// });