Component({
    externalClasses: "class",
    properties: {
        scroll: {
            type: Boolean,
            value: !1
        },
        fixed: {
            type: Boolean,
            value: !1
        },
        height: {
            type: Number,
            value: 0
        },
        top: {
            type: Number,
            value: 0
        },
        list: {
            type: Array,
            value: []
        },
        selectedId: {
            type: [ String, Number ],
            value: ""
        }
    },
    methods: {
        _handleZanTabChange: function(e) {
            e = e.currentTarget.dataset.itemId;
            this.setData({
                selectedId: e
            }), this.triggerEvent("tabchange", e);
        }
    }
});