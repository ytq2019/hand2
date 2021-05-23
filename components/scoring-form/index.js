var _extends = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a, s = arguments[e];
        for (a in s) Object.prototype.hasOwnProperty.call(s, a) && (t[a] = s[a]);
    }
    return t;
}, app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        settingData: {
            type: Object,
            value: null
        },
        serviceData: {
            type: Object,
            value: null
        },
        themeStyle: {
            type: Object,
            value: null
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        score: 0
    },
    ready: function() {
        this.applyFormData(this.data.formData);
    },
    methods: {
        applyFormData: function(t) {
            this.setData(_extends({}, t));
        },
        setScore: function(t) {
            this.setData({
                score: t.currentTarget.dataset.index + 1
            });
        },
        submitForm: function(t) {
            var e = this;
            e.data.score ? app.util.request({
                method: "POST",
                url: "entry/wxapp/service",
                data: {
                    m: "superman_hand2",
                    act: "scoring",
                    log_id: e.data.serviceData.log_id,
                    score: e.data.score
                },
                showLoading: !0,
                success: function(t) {
                    console.log(t), e.triggerEvent("score", null);
                },
                fail: function(t) {
                    console.error(t), app.util.message(t.data.errmsg, "", "error");
                }
            }) : app.toast("请点击星号评分");
        }
    }
});