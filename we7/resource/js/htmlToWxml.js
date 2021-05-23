var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"), inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), special = makeMap("script,style"), HTMLParser = function(t, i) {
    var e, a, s = [], r = t;
    for (s.last = function() {
        return this[this.length - 1];
    }; t; ) {
        var n = !0;
        if (s.last() && special[s.last()] ? (t = t.replace(new RegExp("([\\s\\S]*?)</" + s.last() + "[^>]*>"), function(t, e) {
            return e = e.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2"), i.chars && i.chars(e), 
            "";
        }), l(0, s.last())) : (0 == t.indexOf("\x3c!--") ? 0 <= (e = t.indexOf("--\x3e")) && (i.comment && i.comment(t.substring(4, e)), 
        t = t.substring(e + 3), n = !1) : 0 == t.indexOf("</") ? (a = t.match(endTag)) && (t = t.substring(a[0].length), 
        a[0].replace(endTag, l), n = !1) : 0 == t.indexOf("<") && (a = t.match(startTag)) && (t = t.substring(a[0].length), 
        a[0].replace(startTag, o), n = !1), n && (n = (e = t.indexOf("<")) < 0 ? t : t.substring(0, e), 
        t = e < 0 ? "" : t.substring(e), i.chars && i.chars(n))), t == r) throw "Parse Error: " + t;
        r = t;
    }
    function o(t, e, a, r) {
        if (e = e.toLowerCase(), block[e]) for (;s.last() && inline[s.last()]; ) l(0, s.last());
        var n;
        closeSelf[e] && s.last() == e && l(0, e), (r = empty[e] || !!r) || s.push(e), i.start && (n = [], 
        a.replace(attr, function(t, e) {
            var a = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[e] ? e : "");
            n.push({
                name: e,
                value: a,
                escaped: a.replace(/(^|[^\\])"/g, '$1\\"')
            });
        }), i.start && i.start(e, n, r));
    }
    function l(t, e) {
        if (e) for (a = s.length - 1; 0 <= a && s[a] != e; a--) ; else var a = 0;
        if (0 <= a) {
            for (var r = s.length - 1; a <= r; r--) i.end && i.end(s[r]);
            s.length = a;
        }
    }
    l();
};

function makeMap(t) {
    for (var e = {}, a = t.split(","), r = 0; r < a.length; r++) e[a[r]] = !0;
    return e;
}

var global = {}, debug = function() {};

function q(t) {
    return '"' + t + '"';
}

function removeDOCTYPE(t) {
    return t.replace(/<\?xml.*\?>\n/, "").replace(/<!doctype.*\>\n/, "").replace(/<!DOCTYPE.*\>\n/, "");
}

global.html2json = function(t) {
    t = removeDOCTYPE(t);
    var r = [], n = {
        node: "root",
        child: []
    };
    return HTMLParser(t, {
        start: function(t, e, a) {
            debug(t, e, a);
            t = {
                node: "element",
                tag: t
            };
            0 !== e.length && (t.attr = e.reduce(function(t, e) {
                var a = e.name, e = e.value;
                return e.match(/ /) && (e = e.split(" ")), t[a] ? Array.isArray(t[a]) ? t[a].push(e) : t[a] = [ t[a], e ] : t[a] = e, 
                t;
            }, {})), a ? (void 0 === (a = r[0] || n).child && (a.child = []), a.child.push(t)) : r.unshift(t);
        },
        end: function(t) {
            debug(t);
            var e = r.shift();
            e.tag !== t && console.error("invalid state: mismatch end tag"), 0 === r.length ? n.child.push(e) : (void 0 === (t = r[0]).child && (t.child = []), 
            t.child.push(e));
        },
        chars: function(t) {
            debug(t);
            var e = {
                node: "text",
                text: t
            };
            0 === r.length ? n.child.push(e) : (void 0 === (t = r[0]).child && (t.child = []), 
            t.child.push(e));
        },
        comment: function(t) {
            debug(t);
            var e = {
                node: "comment",
                text: t
            }, t = r[0];
            void 0 === t.child && (t.child = []), t.child.push(e);
        }
    }), n;
}, global.json2html = function t(a) {
    var e = "";
    a.child && (e = a.child.map(t).join(""));
    var r = "";
    if (a.attr && "" !== (r = Object.keys(a.attr).map(function(t) {
        var e = a.attr[t];
        return Array.isArray(e) && (e = e.join(" ")), t + "=" + q(e);
    }).join(" ")) && (r = " " + r), "element" !== a.node) return "text" === a.node ? a.text : "comment" === a.node ? "\x3c!--" + a.text + "--\x3e" : "root" === a.node ? e : void 0;
    var n = a.tag;
    return -1 < [ "area", "base", "basefont", "br", "col", "frame", "hr", "img", "input", "isindex", "link", "meta", "param", "embed" ].indexOf(n) ? "<" + a.tag + r + "/>" : "<" + a.tag + r + ">" + e + ("</" + a.tag + ">");
};

var html2wxwebview = function(t) {
    t = global.html2json(t), t = parseHtmlNode(t);
    return t = arrangeNode(t);
}, arrangeNode = function(t) {
    for (var e, a, r = [], n = [], i = 0, s = t.length; i < s; i++) 0 == i ? "view" != t[i].type && r.push(t[i]) : "view" == t[i].type ? (0 < r.length && (a = {
        type: "view",
        child: r
    }, n.push(a)), r = []) : "img" == t[i].type ? (0 < r.length && (a = {
        type: "view",
        child: r
    }, n.push(a)), e = t[i].attr, t[i].attr.width && -1 === t[i].attr.width.indexOf("%") && -1 === t[i].attr.width.indexOf("px") && (t[i].attr.width = t[i].attr.width + "px"), 
    t[i].attr.height && -1 === t[i].attr.height.indexOf("%") && -1 === t[i].attr.height.indexOf("px") && (t[i].attr.height = t[i].attr.height + "px"), 
    a = {
        type: "img",
        attr: e
    }, n.push(a), r = []) : (r.push(t[i]), i == s - 1 && (a = {
        type: "view",
        child: r
    }, n.push(a)));
    return n;
}, parseHtmlNode = function(t) {
    var i = [];
    return function t(e) {
        var a = {};
        if ("root" != e.node) if ("element" == e.node) switch (e.tag) {
          case "a":
            a = {
                type: "a",
                text: e.child[0].text
            };
            break;

          case "img":
            a = {
                type: "img",
                text: e.text
            };
            break;

          case "p":
          case "div":
            a = {
                type: "view",
                text: e.text
            };
        } else "text" == e.node && (a = {
            type: "text",
            text: e.text
        });
        if (e.attr && (a.attr = e.attr), 0 != Object.keys(a).length && i.push(a), "a" != e.tag) {
            var r = e.child;
            if (r) for (var n in r) t(r[n]);
        }
    }(t), i;
};

module.exports = {
    html2json: html2wxwebview
};