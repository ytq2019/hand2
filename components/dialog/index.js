Object.defineProperty(exports, "__esModule", {
    value: !0
}), Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        show: {
            type: Boolean,
            observer: function(t) {}
        },
        title: String,
        message: String,
        messageRichText: Boolean,
        useSlot: Boolean,
        className: String,
        customStyle: String,
        asyncClose: Boolean,
        messageAlign: String,
        useTitleSlot: Boolean,
        showCancelButton: Boolean,
        confirmButtonOpenType: String,
        confirmButtonText: {
            type: String,
            value: "确认"
        },
        cancelButtonText: {
            type: String,
            value: "取消"
        },
        confirmButtonColor: {
            type: String,
            value: "bg-orange"
        },
        cancelButtonColor: {
            type: String,
            value: "bg-grey"
        },
        showConfirmButton: {
            type: Boolean,
            value: !0
        }
    },
    data: {},
    methods: {
        onConfirm: function() {
            this.handleAction("confirm");
        },
        onCancel: function() {
            this.handleAction("cancel");
        },
        onClickOverlay: function() {
            this.onClose("overlay");
        },
        handleAction: function(t) {
            this.data.asyncClose, this.onClose(t);
        },
        close: function() {
            this.setData({
                show: !1
            });
        },
        onClose: function(t) {
            this.data.asyncClose || this.close(), this.triggerEvent("close", t), this.triggerEvent(t, {
                dialog: this
            });
            var o = this.data["confirm" === t ? "onConfirm" : "onCancel"];
            o && o(t, this);
        }
    }
});