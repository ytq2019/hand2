var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, _utils = require("./utils");

function isPlainObject(e) {
    return null !== e && "object" === (void 0 === e ? "undefined" : _typeof(e)) && !Array.isArray(e);
}

function isBoolean(e) {
    return "boolean" == typeof e;
}

function isPromise(e) {
    return isPlainObject(e) && isFunction(e.then) && isFunction(e.catch);
}

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        disabled: Boolean,
        multiple: Boolean,
        uploadText: String,
        useBeforeRead: Boolean,
        afterRead: null,
        beforeRead: null,
        previewSize: {
            type: null,
            value: 144
        },
        name: {
            type: [ Number, String ],
            value: ""
        },
        accept: {
            type: String,
            value: "image"
        },
        fileList: {
            type: Array,
            value: [],
            observer: "formatFileList"
        },
        maxSize: {
            type: Number,
            value: Number.MAX_VALUE
        },
        maxCount: {
            type: Number,
            value: 100
        },
        deletable: {
            type: Boolean,
            value: !0
        },
        showUpload: {
            type: Boolean,
            value: !0
        },
        previewImage: {
            type: Boolean,
            value: !0
        },
        previewFullImage: {
            type: Boolean,
            value: !0
        },
        imageFit: {
            type: String,
            value: "scaleToFill"
        },
        uploadIcon: {
            type: String,
            value: "photograph"
        },
        sizeType: {
            type: Array,
            value: [ "original", "compressed" ]
        },
        capture: {
            type: Array,
            value: [ "album", "camera" ]
        },
        compressed: {
            type: Boolean,
            value: !0
        },
        maxDuration: {
            type: Number,
            value: 60
        },
        camera: {
            type: String,
            value: "back"
        }
    },
    data: {
        lists: [],
        isInCount: !0
    },
    methods: {
        formatFileList: function() {
            var e = this.data, t = e.fileList, t = void 0 === t ? [] : t, e = e.maxCount, t = t.map(function(e) {
                return Object.assign(Object.assign({}, e), {
                    isImage: (0, _utils.isImageFile)(e),
                    isVideo: (0, _utils.isVideoFile)(e),
                    deletable: !isBoolean(e.deletable) || e.deletable
                });
            });
            this.setData({
                lists: t,
                isInCount: t.length < e
            });
        },
        getDetail: function(e) {
            return {
                name: this.data.name,
                index: null == e ? this.data.fileList.length : e
            };
        },
        startUpload: function() {
            var t = this, e = this.data, i = e.maxCount, a = e.multiple, n = e.lists;
            e.disabled || (0, _utils.chooseFile)(Object.assign(Object.assign({}, this.data), {
                maxCount: i - n.length
            })).then(function(e) {
                t.onBeforeRead(a ? e : e[0]);
            }).catch(function(e) {
                t.triggerEvent("error", e);
            });
        },
        onBeforeRead: function(a) {
            var n = this, e = this.data, t = e.beforeRead, i = e.useBeforeRead, e = !0;
            "function" == typeof t && (e = t(a, this.getDetail())), i && (e = new Promise(function(t, i) {
                n.triggerEvent("before-read", Object.assign(Object.assign({
                    file: a
                }, n.getDetail()), {
                    callback: function(e) {
                        (e ? t : i)();
                    }
                }));
            })), e && (isPromise(e) ? e.then(function(e) {
                return n.onAfterRead(e || a);
            }) : this.onAfterRead(a));
        },
        onAfterRead: function(e) {
            var t = this.data, i = t.maxSize, t = t.afterRead;
            (Array.isArray(e) ? e.some(function(e) {
                return e.size > i;
            }) : e.size > i) ? this.triggerEvent("oversize", Object.assign({
                file: e
            }, this.getDetail())) : ("function" == typeof t && t(e, this.getDetail()), this.triggerEvent("after-read", Object.assign({
                file: e
            }, this.getDetail())));
        },
        deleteItem: function(e) {
            e = e.currentTarget.dataset.index;
            this.triggerEvent("delete", Object.assign(Object.assign({}, this.getDetail(e)), {
                file: this.data.fileList[e]
            }));
        },
        onPreviewImage: function(e) {
            var t;
            this.data.previewFullImage && (t = e.currentTarget.dataset.index, t = (e = this.data.lists)[t], 
            wx.previewImage({
                urls: e.filter(function(e) {
                    return (0, _utils.isImageFile)(e);
                }).map(function(e) {
                    return e.url;
                }),
                current: t.url,
                fail: function() {
                    wx.showToast({
                        title: "预览图片失败",
                        icon: "none"
                    });
                }
            }));
        },
        onPreviewVideo: function(e) {
            var t;
            this.data.previewFullImage && (t = e.currentTarget.dataset.index, e = this.data.lists, 
            wx.previewMedia({
                sources: e.filter(function(e) {
                    return (0, _utils.isVideoFile)(e);
                }).map(function(e) {
                    return Object.assign(Object.assign({}, e), {
                        type: "video"
                    });
                }),
                current: t,
                fail: function() {
                    wx.showToast({
                        title: "预览视频失败",
                        icon: "none"
                    });
                }
            }));
        },
        onClickPreview: function(e) {
            var t = e.currentTarget.dataset.index, e = this.data.lists[t];
            this.triggerEvent("click-preview", Object.assign(Object.assign({}, e), this.getDetail(t)));
        }
    }
});