Object.defineProperty(exports, "__esModule", {
    value: !0
});

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

function isPlainObject(e) {
    return null !== e && "object" === (void 0 === e ? "undefined" : _typeof(e)) && !Array.isArray(e);
}

function pickExclude(i, r) {
    return isPlainObject(i) ? Object.keys(i).reduce(function(e, t) {
        return r.includes(t) || (e[t] = i[t]), e;
    }, {}) : {};
}

exports.isPlainObject = isPlainObject, exports.pickExclude = pickExclude, exports.isImageUrl = isImageUrl, 
exports.isVideoUrl = isVideoUrl, exports.isImageFile = isImageFile, exports.isVideoFile = isVideoFile, 
exports.chooseFile = chooseFile;

var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i, VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;

function isImageUrl(e) {
    return IMAGE_REGEXP.test(e);
}

function isVideoUrl(e) {
    return VIDEO_REGEXP.test(e);
}

function isImageFile(e) {
    return null != e.isImage ? e.isImage : e.type ? "image" === e.type : !!e.url && isImageUrl(e.url);
}

function isVideoFile(e) {
    return null != e.isVideo ? e.isVideo : e.type ? "video" === e.type : !!e.url && isVideoUrl(e.url);
}

function formatImage(e) {
    return e.tempFiles.map(function(e) {
        return Object.assign(Object.assign({}, pickExclude(e, [ "path" ])), {
            type: "image",
            url: e.path,
            thumb: e.path
        });
    });
}

function formatVideo(e) {
    return [ Object.assign(Object.assign({}, pickExclude(e, [ "tempFilePath", "thumbTempFilePath", "errMsg" ])), {
        type: "video",
        url: e.tempFilePath,
        thumb: e.thumbTempFilePath
    }) ];
}

function formatMedia(t) {
    return t.tempFiles.map(function(e) {
        return Object.assign(Object.assign({}, pickExclude(e, [ "fileType", "thumbTempFilePath", "tempFilePath" ])), {
            type: t.type,
            url: e.tempFilePath,
            thumb: "video" === t.type ? e.thumbTempFilePath : e.tempFilePath
        });
    });
}

function formatFile(e) {
    return e.tempFiles.map(function(e) {
        return Object.assign(Object.assign({}, pickExclude(e, [ "path" ])), {
            url: e.path
        });
    });
}

function chooseFile(e) {
    var i = e.accept, r = e.multiple, o = e.capture, n = e.compressed, s = e.maxDuration, a = e.sizeType, u = e.camera, c = e.maxCount;
    return new Promise(function(t, e) {
        switch (i) {
          case "image":
            wx.chooseImage({
                count: r ? Math.min(c, 9) : 1,
                sourceType: o,
                sizeType: a,
                success: function(e) {
                    return t(formatImage(e));
                },
                fail: e
            });
            break;

          case "media":
            wx.chooseMedia({
                count: r ? Math.min(c, 9) : 1,
                sourceType: o,
                maxDuration: s,
                sizeType: a,
                camera: u,
                success: function(e) {
                    return t(formatMedia(e));
                },
                fail: e
            });
            break;

          case "video":
            wx.chooseVideo({
                sourceType: o,
                compressed: n,
                maxDuration: s,
                camera: u,
                success: function(e) {
                    return t(formatVideo(e));
                },
                fail: e
            });
            break;

          default:
            wx.chooseMessageFile({
                count: r ? c : 1,
                type: i,
                success: function(e) {
                    return t(formatFile(e));
                },
                fail: e
            });
        }
    });
}