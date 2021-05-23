var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {},
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        defaultCity: {
            name: "大 连",
            city_id: "101070201",
            poi_id: "P2951",
            textSize: "text-xxl"
        },
        weatherData: {
            tempMin: 0,
            tempMax: 0,
            textDay: "-"
        },
        tideData: [ {
            fxTime: "--:--:--",
            height: "-"
        }, {
            fxTime: "--:--:--",
            height: "-"
        } ]
    },
    ready: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/tide",
            data: {
                m: "superman_hand2",
                act: "widget",
                city_id: a.data.defaultCity.city_id,
                poi_id: a.data.defaultCity.poi_id
            },
            showLoading: !1,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                a.setData({
                    weatherData: t.weather,
                    tideData: t.tide
                });
            },
            fail: function(t) {
                console.error(t);
            }
        });
    },
    methods: {
        toPage: function(t) {
            app.superman.toPage(t);
        }
    }
});