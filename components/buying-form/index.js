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
        itemData: {
            type: Object,
            value: {
                title: "",
                description: ""
            }
        },
        categoryData: {
            type: Array,
            value: []
        },
        themeStyle: {
            type: Object,
            value: null
        },
        wxadInfo: {
            type: Object,
            value: null
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        descMaxLength: 500,
        descCurLength: 0
    },
    ready: function() {
        this.applyFormData(this.data.itemData);
    },
    methods: {
        applyFormData: function(t) {
            t && this.setData({
                descCurLength: "" != t.description ? t.description.length : 0
            }), this.setData(_extends({}, t));
        },
        inputDesc: function(t) {
            this.setData({
                descCurLength: t.detail.value.length
            });
        },
        submitForm: function(t) {
            var a = this, e = t.detail.value;
            console.log(e), "" != e.title ? "" != e.desc ? (a.data.itemId && (e.item_id = a.data.itemId), 
            t = wx.getStorageSync("LocationInfo"), e.lat = t ? t.location.lat : "", e.lng = t ? t.location.lng : "", 
            e.address = t ? t.address : "", e.province = t ? t.address_component.province : "", 
            e.city = t ? t.address_component.city : "", console.log(e), console.log(a.data), 
            app.util.request({
                method: "POST",
                url: "entry/wxapp/buying",
                data: Object.assign({
                    m: "superman_hand2",
                    act: "post",
                    op: "item"
                }, e),
                showLoading: !0,
                success: function(t) {
                    console.log(t);
                    var e = t.data.data.item_id, t = a.data.wxadInfo;
                    wx.redirectTo({
                        url: "/pages/post/success?id=" + e + "&type=2&wxad_id=" + t.id + "&wxad_type=" + t.type
                    });
                },
                fail: function(t) {
                    console.error(t), app.util.message(t.data.errmsg, "", "error");
                }
            })) : app.toast("请输入物品描述") : app.toast("请输入物品名称");
        }
    }
});