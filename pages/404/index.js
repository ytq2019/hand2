var app = getApp();

Page({
    data: {
        appInfo: app.globalData.appInfo,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), app.viewCount();
    },
    toPage: function(a) {
        app.superman.toPage(a);
    }
});