var chatroom = {
    userInfo: null,
    socketReconnect: !1,
    setting: null,
    handler: {
        receive: null
    },
    util: require("../we7/resource/js/util.js"),
    siteInfo: require("../siteinfo.js"),
    timerId: null,
    init: function() {
        var o = this;
        if (o.userInfo = wx.getStorageSync("userInfo"), !o.userInfo || !o.userInfo.memberInfo.uid) return console.info("socket init fail: not login", o.userInfo), 
        void (o.timerId || (o.timerId = setInterval(function() {
            o.init();
        }, 5e3)));
        o.timerId && clearInterval(o.timerId), o.util.request({
            url: "entry/wxapp/chatroom",
            data: {
                m: "superman_hand2",
                act: "init"
            },
            showLoading: !1,
            success: function(e) {
                console.log(e), o.setting = e.data.data, console.log("WebSocket Setting", o.setting), 
                o.socket_init();
            },
            fail: function(e) {
                29 == e.data.errno ? console.error(e.data.errmsg, e.data) : o.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    socket_init: function() {
        var o = this;
        try {
            wx.connectSocket({
                url: o.setting.url,
                success: function() {
                    console.info("socket connect");
                },
                fail: function(e) {
                    console.error(e);
                }
            }), wx.onSocketOpen(function() {
                console.info("socket open");
                var e = {
                    type: "login",
                    uniacid: o.siteInfo.uniacid,
                    sid: o.setting.sid,
                    uid: o.userInfo.memberInfo.uid,
                    nickname: o.userInfo.memberInfo.nickname
                };
                o.send_message(e);
            }), wx.onSocketMessage(function(e) {
                console.info("socket receive", e.data);
                e = JSON.parse(e.data);
                "ping" === e.type ? o.send_message({
                    type: "pong"
                }) : o.receive_message(e);
            }), wx.onSocketError(function(e) {
                console.error("socket error", e);
            }), wx.onSocketClose(function(e) {
                console.info("socket close", e), o.socket_reconnect();
            });
        } catch (e) {
            console.log(e), o.socketReconnect = !1, o.socket_reconnect();
        }
    },
    socket_reconnect: function() {
        var e = this;
        e.socketReconnect || (console.info("socket reconnect"), e.socketReconnect = !0, 
        setTimeout(function() {
            e.socket_init(), e.socketReconnect = !1;
        }, 2e3));
    },
    send_message: function(o, n) {
        var t = this, e = JSON.stringify(o);
        wx.sendSocketMessage({
            data: e,
            success: function(e) {
                console.info("socket send", o), void 0 !== n && void 0 !== n.success && n.success(e);
            },
            fail: function(e) {
                console.error(e), void 0 !== n && void 0 !== n.fail && n.fail();
            },
            complete: function(e) {
                console.info("socket send complete", e), -1 == e.errMsg.indexOf(":ok") && t.util.message(e.errMsg, "", "error"), 
                void 0 !== n && void 0 !== n.complete && n.complete();
            }
        });
    },
    receive_message: function(e) {
        "function" == typeof this.handler.receive && this.handler.receive(e);
    },
    setReceiveMessage: function(e) {
        "function" == typeof e ? this.handler.receive = e : console.error("传参错误：请传入函数");
    },
    destroy: function() {
        wx.closeSocket();
    }
};

module.exports = chatroom;