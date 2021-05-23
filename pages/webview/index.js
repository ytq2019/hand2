var app = getApp();

Page({
    data: {
        appInfo: app.globalData.appInfo,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        if (void 0 === a.url) return app.util.message("未找到网址参数", "", "error"), void wx.navigateBack({
            delta: 1
        });
        this.setData({
            Url: decodeURIComponent(a.url),
            ThemeStyle: app.getThemeStyle()
        }), app.viewCount();
    }
});