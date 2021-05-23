Component({
    externalClasses: [ "mask-class", "container-class" ],
    properties: {
        actions: {
            type: Array,
            value: []
        },
        show: {
            type: Boolean,
            value: !1
        },
        cancelWithMask: {
            type: Boolean,
            value: !0
        },
        cancelText: {
            type: String,
            value: ""
        },
        bottom: {
            type: Number,
            value: 0
        }
    },
    methods: {
        onMaskClick: function() {
            this.data.cancelWithMask && this.cancelClick();
        },
        cancelClick: function() {
            this.triggerEvent("cancel");
        },
        handleBtnClick: function(e) {
            e = e.currentTarget, e = ((void 0 === e ? {} : e).dataset || {}).index;
            this.triggerEvent("actionclick", {
                index: e
            });
        }
    }
});