var _extends = Object.assign || function(t) {
    for (var i = 1; i < arguments.length; i++) {
        var e, o = arguments[i];
        for (e in o) Object.prototype.hasOwnProperty.call(o, e) && (t[e] = o[e]);
    }
    return t;
}, main = {
    drawBlock: function(t) {
        var i = t.text, e = t.width, o = void 0 === e ? 0 : e, s = t.height, n = t.x, h = t.y, r = t.paddingLeft, a = void 0 === r ? 0 : r, c = t.paddingRight, x = void 0 === c ? 0 : c, d = t.borderWidth, l = t.backgroundColor, u = t.borderColor, f = t.borderRadius, g = void 0 === f ? 0 : f, e = t.opacity, r = void 0 === e ? 1 : e, c = 0, f = 0, t = 0;
        void 0 !== i ? (c = o < (e = this._getTextWidth("string" == typeof i.text ? i : i.text)) ? e : o, 
        c += a + a, e = void 0 === (e = i.textAlign) ? "left" : e, i.text, t = s / 2 + h, 
        f = "left" === e ? n + a : "center" === e ? c / 2 + n : n + c - x) : c = o, l && (this.ctx.save(), 
        this.ctx.setGlobalAlpha(r), this.ctx.setFillStyle(l), 0 < g ? (this._drawRadiusRect(n, h, c, s, g), 
        this.ctx.fill()) : this.ctx.fillRect(this.toPx(n), this.toPx(h), this.toPx(c), this.toPx(s)), 
        this.ctx.restore()), d && (this.ctx.save(), this.ctx.setGlobalAlpha(r), this.ctx.setStrokeStyle(u), 
        this.ctx.setLineWidth(this.toPx(d)), 0 < g ? (this._drawRadiusRect(n, h, c, s, g), 
        this.ctx.stroke()) : this.ctx.strokeRect(this.toPx(n), this.toPx(h), this.toPx(c), this.toPx(s)), 
        this.ctx.restore()), i && this.drawText(Object.assign(i, {
            x: f,
            y: t
        }));
    },
    drawText: function(t) {
        var e, o = this, i = t.x, s = t.y, n = (t.fontSize, t.color, t.baseLine), h = (t.textAlign, 
        t.text);
        t.opacity, t.width, t.lineNum, t.lineHeight;
        "[object Array]" === Object.prototype.toString.call(h) ? (e = {
            x: i,
            y: s,
            baseLine: n
        }, h.forEach(function(t) {
            e.x += t.marginLeft || 0;
            var i = o._drawSingleText(Object.assign(t, _extends({}, e)));
            e.x += i + (t.marginRight || 0);
        })) : this._drawSingleText(t);
    },
    drawImage: function(t) {
        var i = t.imgPath, e = t.x, o = t.y, s = t.w, n = t.h, h = t.sx, r = t.sy, a = t.sw, c = t.sh, x = t.borderRadius, d = void 0 === x ? 0 : x, x = t.borderWidth, x = void 0 === x ? 0 : x, t = t.borderColor;
        this.ctx.save(), 0 < d ? (this._drawRadiusRect(e, o, s, n, d), this.ctx.strokeStyle = "rgba(255,255,255,0)", 
        this.ctx.stroke(), this.ctx.clip(), this.ctx.drawImage(i, this.toPx(h), this.toPx(r), this.toPx(a), this.toPx(c), this.toPx(e), this.toPx(o), this.toPx(s), this.toPx(n)), 
        0 < x && (this.ctx.setStrokeStyle(t), this.ctx.setLineWidth(this.toPx(x)), this.ctx.stroke())) : this.ctx.drawImage(i, this.toPx(h), this.toPx(r), this.toPx(a), this.toPx(c), this.toPx(e), this.toPx(o), this.toPx(s), this.toPx(n)), 
        this.ctx.restore();
    },
    drawLine: function(t) {
        var i = t.startX, e = t.startY, o = t.endX, s = t.endY, n = t.color, t = t.width;
        this.ctx.save(), this.ctx.beginPath(), this.ctx.setStrokeStyle(n), this.ctx.setLineWidth(this.toPx(t)), 
        this.ctx.moveTo(this.toPx(i), this.toPx(e)), this.ctx.lineTo(this.toPx(o), this.toPx(s)), 
        this.ctx.stroke(), this.ctx.closePath(), this.ctx.restore();
    },
    downloadResource: function(t) {
        var e = this, i = t.images, i = void 0 === i ? [] : i, t = t.pixelRatio, o = void 0 === t ? 1 : t, s = [];
        return this.drawArr = [], i.forEach(function(t, i) {
            return s.push(e._downloadImageAndInfo(t, i, o));
        }), Promise.all(s);
    },
    initCanvas: function(i, e, o) {
        var s = this;
        return new Promise(function(t) {
            s.setData({
                pxWidth: s.toPx(i),
                pxHeight: s.toPx(e),
                debug: o
            }, t);
        });
    }
}, handle = {
    _drawRadiusRect: function(t, i, e, o, s) {
        s /= 2;
        this.ctx.beginPath(), this.ctx.moveTo(this.toPx(t + s), this.toPx(i)), this.ctx.lineTo(this.toPx(t + e - s), this.toPx(i)), 
        this.ctx.arc(this.toPx(t + e - s), this.toPx(i + s), this.toPx(s), 2 * Math.PI * .75, 2 * Math.PI * 1), 
        this.ctx.lineTo(this.toPx(t + e), this.toPx(i + o - s)), this.ctx.arc(this.toPx(t + e - s), this.toPx(i + o - s), this.toPx(s), 0, 2 * Math.PI * .25), 
        this.ctx.lineTo(this.toPx(t + s), this.toPx(i + o)), this.ctx.arc(this.toPx(t + s), this.toPx(i + o - s), this.toPx(s), 2 * Math.PI * .25, 2 * Math.PI * .5), 
        this.ctx.lineTo(this.toPx(t), this.toPx(i + s)), this.ctx.arc(this.toPx(t + s), this.toPx(i + s), this.toPx(s), 2 * Math.PI * .5, 2 * Math.PI * .75);
    },
    _getTextWidth: function(t) {
        var s = this, i = [];
        "[object Object]" === Object.prototype.toString.call(t) ? i.push(t) : i = t;
        var n = 0;
        return i.forEach(function(t) {
            var i = t.fontSize, e = t.text, o = t.marginLeft, o = void 0 === o ? 0 : o, t = t.marginRight, t = void 0 === t ? 0 : t;
            s.ctx.setFontSize(s.toPx(i)), n += s.ctx.measureText(e).width + o + t;
        }), this.toRpx(n);
    },
    _drawSingleText: function(t) {
        var e = this, o = t.x, s = t.y, n = t.fontSize, i = t.color, h = t.baseLine, r = t.textAlign, a = void 0 === r ? "left" : r, c = t.text, x = t.opacity, d = void 0 === x ? 1 : x, l = t.textDecoration, r = void 0 === l ? "none" : l, u = t.width, x = t.lineNum, f = void 0 === x ? 1 : x, l = t.lineHeight, g = void 0 === l ? 0 : l, x = t.fontWeight, l = void 0 === x ? "normal" : x, x = t.fontStyle, x = void 0 === x ? "normal" : x, t = t.fontFamily, t = void 0 === t ? "sans-serif" : t;
        this.ctx.save(), this.ctx.beginPath(), this.ctx.font = x + " " + l + " " + this.toPx(n, !0) + "px " + t, 
        this.ctx.setGlobalAlpha(d), this.ctx.setFillStyle(i), this.ctx.setTextBaseline(h), 
        this.ctx.setTextAlign(a);
        var a = this.toRpx(this.ctx.measureText(c).width), P = [];
        if (u < a) {
            for (var p = "", v = 1, m = 0; m <= c.length - 1; m++) p += c[m], this.toRpx(this.ctx.measureText(p).width) >= u ? (v === f && m !== c.length - 1 && (p = p.substring(0, p.length - 1) + "..."), 
            v <= f && P.push(p), p = "", v++) : v <= f && m === c.length - 1 && P.push(p);
            a = u;
        } else P.push(c);
        if (P.forEach(function(t, i) {
            e.ctx.fillText(t, e.toPx(o), e.toPx(s + (g || n) * i));
        }), this.ctx.restore(), "none" !== r) {
            var w = s;
            if ("line-through" === r) {
                w = s;
                switch (h) {
                  case "top":
                    w += n / 2 + 5;
                    break;

                  case "middle":
                    break;

                  case "bottom":
                    w -= n / 2 + 5;
                    break;

                  default:
                    w -= n / 2 - 5;
                }
            }
            this.ctx.save(), this.ctx.moveTo(this.toPx(o), this.toPx(w)), this.ctx.lineTo(this.toPx(o) + this.toPx(a), this.toPx(w)), 
            this.ctx.setStrokeStyle(i), this.ctx.stroke(), this.ctx.restore();
        }
        return a;
    }
}, helper = {
    _downloadImageAndInfo: function(l, u, f) {
        var g = this;
        return new Promise(function(a, i) {
            var c = l.x, x = l.y, t = l.url, d = l.zIndex;
            g._downImage(t, u).then(function(t) {
                return g._getImageInfo(t, u);
            }).then(function(t) {
                var i = t.imgPath, e = t.imgInfo, o = void 0, s = void 0, n = l.borderRadius || 0, h = l.width, r = l.height, t = g.toRpx(e.width / f), e = g.toRpx(e.height / f);
                t / e <= h / r ? (o = 0, s = (e - t / h * r) / 2) : (s = 0, o = (t - e / r * h) / 2), 
                g.drawArr.push({
                    type: "image",
                    borderRadius: n,
                    borderWidth: l.borderWidth,
                    borderColor: l.borderColor,
                    zIndex: void 0 !== d ? d : u,
                    imgPath: i,
                    sx: o,
                    sy: s,
                    sw: t - 2 * o,
                    sh: e - 2 * s,
                    x: c,
                    y: x,
                    w: h,
                    h: r
                }), a();
            }).catch(function(t) {
                return i(t);
            });
        });
    },
    _downImage: function(t) {
        var o = this;
        return new Promise(function(i, e) {
            /^http/.test(t) && !new RegExp(wx.env.USER_DATA_PATH).test(t) ? wx.downloadFile({
                url: o._mapHttpToHttps(t),
                success: function(t) {
                    200 === t.statusCode ? i(t.tempFilePath) : e(t.errMsg);
                },
                fail: function(t) {
                    e(t);
                }
            }) : i(t);
        });
    },
    _getImageInfo: function(o, s) {
        return new Promise(function(i, e) {
            wx.getImageInfo({
                src: o,
                success: function(t) {
                    i({
                        imgPath: o,
                        imgInfo: t,
                        index: s
                    });
                },
                fail: function(t) {
                    e(t);
                }
            });
        });
    },
    toPx: function(t, i) {
        return i ? parseInt(t * this.factor * this.pixelRatio) : t * this.factor * this.pixelRatio;
    },
    toRpx: function(t, i) {
        return i ? parseInt(t / this.factor) : t / this.factor;
    },
    _mapHttpToHttps: function(t) {
        if (t.indexOf(":") < 0) return t;
        var i = t.split(":");
        return 2 === i.length && "http" === i[0] ? (i[0] = "https", i[0] + ":" + i[1]) : t;
    }
};

Component({
    properties: {},
    created: function() {
        var t = wx.getSystemInfoSync().screenWidth;
        this.factor = t / 750;
    },
    methods: Object.assign({
        getHeight: function(t) {
            function o(t) {
                var i = t.lineHeight || t.fontSize;
                return "top" === t.baseLine ? i : "middle" === t.baseLine ? i / 2 : 0;
            }
            var s = [];
            (t.blocks || []).forEach(function(t) {
                s.push(t.y + t.height);
            }), (t.texts || []).forEach(function(i) {
                var e = void 0;
                "[object Array]" === Object.prototype.toString.call(i.text) ? i.text.forEach(function(t) {
                    e = o(_extends({}, t, {
                        baseLine: i.baseLine
                    })), s.push(i.y + e);
                }) : (e = o(i), s.push(i.y + e));
            }), (t.images || []).forEach(function(t) {
                s.push(t.y + t.height);
            }), (t.lines || []).forEach(function(t) {
                s.push(t.startY), s.push(t.endY);
            });
            var i = s.sort(function(t, i) {
                return i - t;
            }), e = 0;
            return 0 < i.length && (e = i[0]), t.height < e || !t.height ? e : t.height;
        },
        create: function(s) {
            var n = this;
            this.ctx = wx.createCanvasContext("canvasid", this), this.pixelRatio = s.pixelRatio || 1;
            var h = this.getHeight(s);
            this.initCanvas(s.width, h, s.debug).then(function() {
                s.backgroundColor && (n.ctx.save(), n.ctx.setFillStyle(s.backgroundColor), n.ctx.fillRect(0, 0, n.toPx(s.width), n.toPx(h)), 
                n.ctx.restore());
                var t = s.texts, i = void 0 === t ? [] : t, e = s.images, t = s.blocks, e = void 0 === t ? [] : t, t = s.lines, t = void 0 === t ? [] : t, t = n.drawArr.concat(i.map(function(t) {
                    return t.type = "text", t.zIndex = t.zIndex || 0, t;
                })).concat(e.map(function(t) {
                    return t.type = "block", t.zIndex = t.zIndex || 0, t;
                })).concat(t.map(function(t) {
                    return t.type = "line", t.zIndex = t.zIndex || 0, t;
                }));
                t.sort(function(t, i) {
                    return t.zIndex - i.zIndex;
                }), t.forEach(function(t) {
                    "image" === t.type ? n.drawImage(t) : "text" === t.type ? n.drawText(t) : "block" === t.type ? n.drawBlock(t) : "line" === t.type && n.drawLine(t);
                });
                var o = "android" === wx.getSystemInfoSync().platform ? 300 : 0;
                n.ctx.draw(!1, function() {
                    setTimeout(function() {
                        wx.canvasToTempFilePath({
                            canvasId: "canvasid",
                            success: function(t) {
                                n.triggerEvent("success", t.tempFilePath);
                            },
                            fail: function(t) {
                                n.triggerEvent("fail", t);
                            }
                        }, n);
                    }, o);
                });
            }).catch(function(t) {
                wx.showToast({
                    icon: "none",
                    title: t.errMsg || "生成失败"
                }), console.error(t);
            });
        }
    }, main, handle, helper)
});