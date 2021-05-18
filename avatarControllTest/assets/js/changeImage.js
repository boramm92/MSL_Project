! function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function (T, e) {
    "use strict";
    var t = [],
        k = T.document,
        n = Object.getPrototypeOf,
        a = t.slice,
        g = t.concat,
        l = t.push,
        o = t.indexOf,
        i = {},
        r = i.toString,
        h = i.hasOwnProperty,
        s = h.toString,
        c = s.call(Object),
        v = {};

    function m(e, t) {
        var n = (t = t || k).createElement("script");
        n.text = e, t.head.appendChild(n).parentNode.removeChild(n)
    }

    function d(e, t) {
        return t.toUpperCase()
    }
    var u = "3.0.0",
        C = function (e, t) {
            return new C.fn.init(e, t)
        },
        p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        f = /^-ms-/,
        y = /-([a-z])/g;

    function w(e) {
        var t = !!e && "length" in e && e.length,
            n = C.type(e);
        return "function" !== n && !C.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    C.fn = C.prototype = {
        jquery: u,
        constructor: C,
        length: 0,
        toArray: function () {
            return a.call(this)
        },
        get: function (e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : a.call(this)
        },
        pushStack: function (e) {
            e = C.merge(this.constructor(), e);
            return e.prevObject = this, e
        },
        each: function (e) {
            return C.each(this, e)
        },
        map: function (n) {
            return this.pushStack(C.map(this, function (e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function () {
            return this.pushStack(a.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (e) {
            var t = this.length,
                e = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= e && e < t ? [this[e]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor()
        },
        push: l,
        sort: t.sort,
        splice: t.splice
    }, C.extend = C.fn.extend = function () {
        var e, t, n, i, o, r = arguments[0] || {},
            s = 1,
            a = arguments.length,
            l = !1;
        for ("boolean" == typeof r && (l = r, r = arguments[s] || {}, s++), "object" == typeof r || C.isFunction(r) || (r = {}), s === a && (r = this, s--); s < a; s++)
            if (null != (e = arguments[s]))
                for (t in e) o = r[t], n = e[t], r !== n && (l && n && (C.isPlainObject(n) || (i = C.isArray(n))) ? (o = i ? (i = !1, o && C.isArray(o) ? o : []) : o && C.isPlainObject(o) ? o : {}, r[t] = C.extend(l, o, n)) : void 0 !== n && (r[t] = n));
        return r
    }, C.extend({
        expando: "jQuery" + (u + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
            throw new Error(e)
        },
        noop: function () {},
        isFunction: function (e) {
            return "function" === C.type(e)
        },
        isArray: Array.isArray,
        isWindow: function (e) {
            return null != e && e === e.window
        },
        isNumeric: function (e) {
            var t = C.type(e);
            return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
        },
        isPlainObject: function (e) {
            return !(!e || "[object Object]" !== r.call(e)) && (!(e = n(e)) || "function" == typeof (e = h.call(e, "constructor") && e.constructor) && s.call(e) === c)
        },
        isEmptyObject: function (e) {
            for (var t in e) return !1;
            return !0
        },
        type: function (e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? i[r.call(e)] || "object" : typeof e
        },
        globalEval: function (e) {
            m(e)
        },
        camelCase: function (e) {
            return e.replace(f, "ms-").replace(y, d)
        },
        nodeName: function (e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function (e, t) {
            var n, i = 0;
            if (w(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break;
            return e
        },
        trim: function (e) {
            return null == e ? "" : (e + "").replace(p, "")
        },
        makeArray: function (e, t) {
            t = t || [];
            return null != e && (w(Object(e)) ? C.merge(t, "string" == typeof e ? [e] : e) : l.call(t, e)), t
        },
        inArray: function (e, t, n) {
            return null == t ? -1 : o.call(t, e, n)
        },
        merge: function (e, t) {
            for (var n = +t.length, i = 0, o = e.length; i < n; i++) e[o++] = t[i];
            return e.length = o, e
        },
        grep: function (e, t, n) {
            for (var i = [], o = 0, r = e.length, s = !n; o < r; o++) !t(e[o], o) != s && i.push(e[o]);
            return i
        },
        map: function (e, t, n) {
            var i, o, r = 0,
                s = [];
            if (w(e))
                for (i = e.length; r < i; r++) null != (o = t(e[r], r, n)) && s.push(o);
            else
                for (r in e) o = t(e[r], r, n), null != o && s.push(o);
            return g.apply([], s)
        },
        guid: 1,
        proxy: function (e, t) {
            var n, i;
            return "string" == typeof t && (i = e[t], t = e, e = i), C.isFunction(e) ? (n = a.call(arguments, 2), (i = function () {
                return e.apply(t || this, n.concat(a.call(arguments)))
            }).guid = e.guid = e.guid || C.guid++, i) : void 0
        },
        now: Date.now,
        support: v
    }), "function" == typeof Symbol && (C.fn[Symbol.iterator] = t[Symbol.iterator]), C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
        i["[object " + t + "]"] = t.toLowerCase()
    });
    var b = function (n) {
        function u(e, t, n) {
            var i = "0x" + t - 65536;
            return i != i || n ? t : i < 0 ? String.fromCharCode(65536 + i) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
        }

        function i() {
            T()
        }
        var e, f, b, r, o, h, p, g, x, l, c, T, k, s, C, v, a, d, m, S = "sizzle" + +new Date,
            y = n.document,
            $ = 0,
            w = 0,
            E = se(),
            D = se(),
            A = se(),
            P = function (e, t) {
                return e === t && (c = !0), 0
            },
            j = {}.hasOwnProperty,
            t = [],
            O = t.pop,
            M = t.push,
            L = t.push,
            N = t.slice,
            H = function (e, t) {
                for (var n = 0, i = e.length; n < i; n++)
                    if (e[n] === t) return n;
                return -1
            },
            q = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            I = "[\\x20\\t\\r\\n\\f]",
            z = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            F = "\\[" + I + "*(" + z + ")(?:" + I + "*([*^$|!~]?=)" + I + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + z + "))|)" + I + "*\\]",
            W = ":(" + z + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + F + ")*)|.*)\\)|)",
            _ = new RegExp(I + "+", "g"),
            R = new RegExp("^" + I + "+|((?:^|[^\\\\])(?:\\\\.)*)" + I + "+$", "g"),
            B = new RegExp("^" + I + "*," + I + "*"),
            U = new RegExp("^" + I + "*([>+~]|" + I + ")" + I + "*"),
            X = new RegExp("=" + I + "*([^\\]'\"]*?)" + I + "*\\]", "g"),
            Q = new RegExp(W),
            Y = new RegExp("^" + z + "$"),
            G = {
                ID: new RegExp("^#(" + z + ")"),
                CLASS: new RegExp("^\\.(" + z + ")"),
                TAG: new RegExp("^(" + z + "|[*])"),
                ATTR: new RegExp("^" + F),
                PSEUDO: new RegExp("^" + W),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + I + "*(even|odd|(([+-]|)(\\d*)n|)" + I + "*(?:([+-]|)" + I + "*(\\d+)|))" + I + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + q + ")$", "i"),
                needsContext: new RegExp("^" + I + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + I + "*((?:-\\d)?\\d*)" + I + "*\\)|)(?=[^-]|$)", "i")
            },
            V = /^(?:input|select|textarea|button)$/i,
            J = /^h\d$/i,
            K = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ee = /[+~]/,
            te = new RegExp("\\\\([\\da-f]{1,6}" + I + "?|(" + I + ")|.)", "ig"),
            ne = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
            ie = function (e, t) {
                return t ? "\0" === e ? "占�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            oe = ve(function (e) {
                return !0 === e.disabled
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            L.apply(t = N.call(y.childNodes), y.childNodes), t[y.childNodes.length].nodeType
        } catch (e) {
            L = {
                apply: t.length ? function (e, t) {
                    M.apply(e, N.call(t))
                } : function (e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++];);
                    e.length = n - 1
                }
            }
        }

        function re(e, t, n, i) {
            var o, r, s, a, l, c, d, u = t && t.ownerDocument,
                p = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== p && 9 !== p && 11 !== p) return n;
            if (!i && ((t ? t.ownerDocument || t : y) !== k && T(t), t = t || k, C)) {
                if (11 !== p && (l = Z.exec(e)))
                    if (o = l[1]) {
                        if (9 === p) {
                            if (!(s = t.getElementById(o))) return n;
                            if (s.id === o) return n.push(s), n
                        } else if (u && (s = u.getElementById(o)) && m(t, s) && s.id === o) return n.push(s), n
                    } else {
                        if (l[2]) return L.apply(n, t.getElementsByTagName(e)), n;
                        if ((o = l[3]) && f.getElementsByClassName && t.getElementsByClassName) return L.apply(n, t.getElementsByClassName(o)), n
                    } if (f.qsa && !A[e + " "] && (!v || !v.test(e))) {
                    if (1 !== p) u = t, d = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(ne, ie) : t.setAttribute("id", a = S), r = (c = h(e)).length; r--;) c[r] = "#" + a + " " + ge(c[r]);
                        d = c.join(","), u = ee.test(e) && fe(t.parentNode) || t
                    }
                    if (d) try {
                        return L.apply(n, u.querySelectorAll(d)), n
                    } catch (e) {} finally {
                        a === S && t.removeAttribute("id")
                    }
                }
            }
            return g(e.replace(R, "$1"), t, n, i)
        }

        function se() {
            var n = [];

            function i(e, t) {
                return n.push(e + " ") > b.cacheLength && delete i[n.shift()], i[e + " "] = t
            }
            return i
        }

        function ae(e) {
            return e[S] = !0, e
        }

        function le(e) {
            var t = k.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function ce(e, t) {
            for (var n = e.split("|"), i = n.length; i--;) b.attrHandle[n[i]] = t
        }

        function de(e, t) {
            var n = t && e,
                i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function ue(t) {
            return function (e) {
                return "label" in e && e.disabled === t || "form" in e && e.disabled === t || "form" in e && !1 === e.disabled && (e.isDisabled === t || e.isDisabled !== !t && ("label" in e || !oe(e)) !== t)
            }
        }

        function pe(s) {
            return ae(function (r) {
                return r = +r, ae(function (e, t) {
                    for (var n, i = s([], e.length, r), o = i.length; o--;) e[n = i[o]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }

        function fe(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        for (e in f = re.support = {}, o = re.isXML = function (e) {
                e = e && (e.ownerDocument || e).documentElement;
                return !!e && "HTML" !== e.nodeName
            }, T = re.setDocument = function (e) {
                var t, e = e ? e.ownerDocument || e : y;
                return e !== k && 9 === e.nodeType && e.documentElement && (s = (k = e).documentElement, C = !o(k), y !== k && (t = k.defaultView) && t.top !== t && (t.addEventListener ? t.addEventListener("unload", i, !1) : t.attachEvent && t.attachEvent("onunload", i)), f.attributes = le(function (e) {
                    return e.className = "i", !e.getAttribute("className")
                }), f.getElementsByTagName = le(function (e) {
                    return e.appendChild(k.createComment("")), !e.getElementsByTagName("*").length
                }), f.getElementsByClassName = K.test(k.getElementsByClassName), f.getById = le(function (e) {
                    return s.appendChild(e).id = S, !k.getElementsByName || !k.getElementsByName(S).length
                }), f.getById ? (b.find.ID = function (e, t) {
                    if (void 0 !== t.getElementById && C) {
                        e = t.getElementById(e);
                        return e ? [e] : []
                    }
                }, b.filter.ID = function (e) {
                    var t = e.replace(te, u);
                    return function (e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete b.find.ID, b.filter.ID = function (e) {
                    var t = e.replace(te, u);
                    return function (e) {
                        e = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return e && e.value === t
                    }
                }), b.find.TAG = f.getElementsByTagName ? function (e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : f.qsa ? t.querySelectorAll(e) : void 0
                } : function (e, t) {
                    var n, i = [],
                        o = 0,
                        r = t.getElementsByTagName(e);
                    if ("*" !== e) return r;
                    for (; n = r[o++];) 1 === n.nodeType && i.push(n);
                    return i
                }, b.find.CLASS = f.getElementsByClassName && function (e, t) {
                    return void 0 !== t.getElementsByClassName && C ? t.getElementsByClassName(e) : void 0
                }, a = [], v = [], (f.qsa = K.test(k.querySelectorAll)) && (le(function (e) {
                    s.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + I + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + I + "*(?:value|" + q + ")"), e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + S + "+*").length || v.push(".#.+[+~]")
                }), le(function (e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = k.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + I + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), s.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:")
                })), (f.matchesSelector = K.test(d = s.matches || s.webkitMatchesSelector || s.mozMatchesSelector || s.oMatchesSelector || s.msMatchesSelector)) && le(function (e) {
                    f.disconnectedMatch = d.call(e, "*"), d.call(e, "[s!='']:x"), a.push("!=", W)
                }), v = v.length && new RegExp(v.join("|")), a = a.length && new RegExp(a.join("|")), t = K.test(s.compareDocumentPosition), m = t || K.test(s.contains) ? function (e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        t = t && t.parentNode;
                    return e === t || !(!t || 1 !== t.nodeType || !(n.contains ? n.contains(t) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(t)))
                } : function (e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, P = t ? function (e, t) {
                    if (e === t) return c = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !f.sortDetached && t.compareDocumentPosition(e) === n ? e === k || e.ownerDocument === y && m(y, e) ? -1 : t === k || t.ownerDocument === y && m(y, t) ? 1 : l ? H(l, e) - H(l, t) : 0 : 4 & n ? -1 : 1)
                } : function (e, t) {
                    if (e === t) return c = !0, 0;
                    var n, i = 0,
                        o = e.parentNode,
                        r = t.parentNode,
                        s = [e],
                        a = [t];
                    if (!o || !r) return e === k ? -1 : t === k ? 1 : o ? -1 : r ? 1 : l ? H(l, e) - H(l, t) : 0;
                    if (o === r) return de(e, t);
                    for (n = e; n = n.parentNode;) s.unshift(n);
                    for (n = t; n = n.parentNode;) a.unshift(n);
                    for (; s[i] === a[i];) i++;
                    return i ? de(s[i], a[i]) : s[i] === y ? -1 : a[i] === y ? 1 : 0
                }), k
            }, re.matches = function (e, t) {
                return re(e, null, null, t)
            }, re.matchesSelector = function (e, t) {
                if ((e.ownerDocument || e) !== k && T(e), t = t.replace(X, "='$1']"), f.matchesSelector && C && !A[t + " "] && (!a || !a.test(t)) && (!v || !v.test(t))) try {
                    var n = d.call(e, t);
                    if (n || f.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                } catch (e) {}
                return 0 < re(t, k, null, [e]).length
            }, re.contains = function (e, t) {
                return (e.ownerDocument || e) !== k && T(e), m(e, t)
            }, re.attr = function (e, t) {
                (e.ownerDocument || e) !== k && T(e);
                var n = b.attrHandle[t.toLowerCase()],
                    n = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !C) : void 0;
                return void 0 !== n ? n : f.attributes || !C ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
            }, re.escape = function (e) {
                return (e + "").replace(ne, ie)
            }, re.error = function (e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, re.uniqueSort = function (e) {
                var t, n = [],
                    i = 0,
                    o = 0;
                if (c = !f.detectDuplicates, l = !f.sortStable && e.slice(0), e.sort(P), c) {
                    for (; t = e[o++];) t === e[o] && (i = n.push(o));
                    for (; i--;) e.splice(n[i], 1)
                }
                return l = null, e
            }, r = re.getText = function (e) {
                var t, n = "",
                    i = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += r(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[i++];) n += r(t);
                return n
            }, (b = re.selectors = {
                cacheLength: 50,
                createPseudo: ae,
                match: G,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function (e) {
                        return e[1] = e[1].replace(te, u), e[3] = (e[3] || e[4] || e[5] || "").replace(te, u), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function (e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || re.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && re.error(e[0]), e
                    },
                    PSEUDO: function (e) {
                        var t, n = !e[6] && e[2];
                        return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && Q.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function (e) {
                        var t = e.replace(te, u).toLowerCase();
                        return "*" === e ? function () {
                            return !0
                        } : function (e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function (e) {
                        var t = E[e + " "];
                        return t || (t = new RegExp("(^|" + I + ")" + e + "(" + I + "|$)")) && E(e, function (e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function (t, n, i) {
                        return function (e) {
                            e = re.attr(e, t);
                            return null == e ? "!=" === n : !n || (e += "", "=" === n ? e === i : "!=" === n ? e !== i : "^=" === n ? i && 0 === e.indexOf(i) : "*=" === n ? i && -1 < e.indexOf(i) : "$=" === n ? i && e.slice(-i.length) === i : "~=" === n ? -1 < (" " + e.replace(_, " ") + " ").indexOf(i) : "|=" === n && (e === i || e.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function (h, e, t, g, v) {
                        var m = "nth" !== h.slice(0, 3),
                            y = "last" !== h.slice(-4),
                            w = "of-type" === e;
                        return 1 === g && 0 === v ? function (e) {
                            return !!e.parentNode
                        } : function (e, t, n) {
                            var i, o, r, s, a, l, c = m != y ? "nextSibling" : "previousSibling",
                                d = e.parentNode,
                                u = w && e.nodeName.toLowerCase(),
                                p = !n && !w,
                                f = !1;
                            if (d) {
                                if (m) {
                                    for (; c;) {
                                        for (s = e; s = s[c];)
                                            if (w ? s.nodeName.toLowerCase() === u : 1 === s.nodeType) return !1;
                                        l = c = "only" === h && !l && "nextSibling"
                                    }
                                    return !0
                                }
                                if (l = [y ? d.firstChild : d.lastChild], y && p) {
                                    for (f = (a = (i = (o = (r = (s = d)[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] || [])[0] === $ && i[1]) && i[2], s = a && d.childNodes[a]; s = ++a && s && s[c] || (f = a = 0) || l.pop();)
                                        if (1 === s.nodeType && ++f && s === e) {
                                            o[h] = [$, a, f];
                                            break
                                        }
                                } else if (!1 === (f = p ? a = (i = (o = (r = (s = e)[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] || [])[0] === $ && i[1] : f))
                                    for (;
                                        (s = ++a && s && s[c] || (f = a = 0) || l.pop()) && ((w ? s.nodeName.toLowerCase() !== u : 1 !== s.nodeType) || !++f || (p && ((o = (r = s[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] = [$, f]), s !== e)););
                                return (f -= v) === g || f % g == 0 && 0 <= f / g
                            }
                        }
                    },
                    PSEUDO: function (e, r) {
                        var t, s = b.pseudos[e] || b.setFilters[e.toLowerCase()] || re.error("unsupported pseudo: " + e);
                        return s[S] ? s(r) : 1 < s.length ? (t = [e, e, "", r], b.setFilters.hasOwnProperty(e.toLowerCase()) ? ae(function (e, t) {
                            for (var n, i = s(e, r), o = i.length; o--;) e[n = H(e, i[o])] = !(t[n] = i[o])
                        }) : function (e) {
                            return s(e, 0, t)
                        }) : s
                    }
                },
                pseudos: {
                    not: ae(function (e) {
                        var i = [],
                            o = [],
                            a = p(e.replace(R, "$1"));
                        return a[S] ? ae(function (e, t, n, i) {
                            for (var o, r = a(e, null, i, []), s = e.length; s--;)(o = r[s]) && (e[s] = !(t[s] = o))
                        }) : function (e, t, n) {
                            return i[0] = e, a(i, null, n, o), i[0] = null, !o.pop()
                        }
                    }),
                    has: ae(function (t) {
                        return function (e) {
                            return 0 < re(t, e).length
                        }
                    }),
                    contains: ae(function (t) {
                        return t = t.replace(te, u),
                            function (e) {
                                return -1 < (e.textContent || e.innerText || r(e)).indexOf(t)
                            }
                    }),
                    lang: ae(function (n) {
                        return Y.test(n || "") || re.error("unsupported lang: " + n), n = n.replace(te, u).toLowerCase(),
                            function (e) {
                                var t;
                                do {
                                    if (t = C ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function (e) {
                        var t = n.location && n.location.hash;
                        return t && t.slice(1) === e.id
                    },
                    root: function (e) {
                        return e === s
                    },
                    focus: function (e) {
                        return e === k.activeElement && (!k.hasFocus || k.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: ue(!1),
                    disabled: ue(!0),
                    checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function (e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function (e) {
                        return !b.pseudos.empty(e)
                    },
                    header: function (e) {
                        return J.test(e.nodeName)
                    },
                    input: function (e) {
                        return V.test(e.nodeName)
                    },
                    button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function (e) {
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (e = e.getAttribute("type")) || "text" === e.toLowerCase())
                    },
                    first: pe(function () {
                        return [0]
                    }),
                    last: pe(function (e, t) {
                        return [t - 1]
                    }),
                    eq: pe(function (e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: pe(function (e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: pe(function (e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: pe(function (e, t, n) {
                        for (var i = n < 0 ? n + t : n; 0 <= --i;) e.push(i);
                        return e
                    }),
                    gt: pe(function (e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = b.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) b.pseudos[e] = function (t) {
            return function (e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }(e);
        for (e in {
                submit: !0,
                reset: !0
            }) b.pseudos[e] = function (n) {
            return function (e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }(e);

        function he() {}

        function ge(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
            return i
        }

        function ve(s, e, t) {
            var a = e.dir,
                l = e.next,
                c = l || a,
                d = t && "parentNode" === c,
                u = w++;
            return e.first ? function (e, t, n) {
                for (; e = e[a];)
                    if (1 === e.nodeType || d) return s(e, t, n)
            } : function (e, t, n) {
                var i, o, r = [$, u];
                if (n) {
                    for (; e = e[a];)
                        if ((1 === e.nodeType || d) && s(e, t, n)) return !0
                } else
                    for (; e = e[a];)
                        if (1 === e.nodeType || d)
                            if (i = (o = e[S] || (e[S] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase()) e = e[a] || e;
                            else {
                                if ((o = i[c]) && o[0] === $ && o[1] === u) return r[2] = o[2];
                                if ((i[c] = r)[2] = s(e, t, n)) return !0
                            }
            }
        }

        function me(o) {
            return 1 < o.length ? function (e, t, n) {
                for (var i = o.length; i--;)
                    if (!o[i](e, t, n)) return !1;
                return !0
            } : o[0]
        }

        function ye(e, t, n, i, o) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)(r = e[a]) && (n && !n(r, i, o) || (s.push(r), c && t.push(a)));
            return s
        }

        function we(f, h, g, v, m, e) {
            return v && !v[S] && (v = we(v)), m && !m[S] && (m = we(m, e)), ae(function (e, t, n, i) {
                var o, r, s, a = [],
                    l = [],
                    c = t.length,
                    d = e || function (e, t, n) {
                        for (var i = 0, o = t.length; i < o; i++) re(e, t[i], n);
                        return n
                    }(h || "*", n.nodeType ? [n] : n, []),
                    u = !f || !e && h ? d : ye(d, a, f, n, i),
                    p = g ? m || (e ? f : c || v) ? [] : t : u;
                if (g && g(u, p, n, i), v)
                    for (o = ye(p, l), v(o, [], n, i), r = o.length; r--;)(s = o[r]) && (p[l[r]] = !(u[l[r]] = s));
                if (e) {
                    if (m || f) {
                        if (m) {
                            for (o = [], r = p.length; r--;)(s = p[r]) && o.push(u[r] = s);
                            m(null, p = [], o, i)
                        }
                        for (r = p.length; r--;)(s = p[r]) && -1 < (o = m ? H(e, s) : a[r]) && (e[o] = !(t[o] = s))
                    }
                } else p = ye(p === t ? p.splice(c, p.length) : p), m ? m(null, t, p, i) : L.apply(t, p)
            })
        }

        function be(v, m) {
            function e(e, t, n, i, o) {
                var r, s, a, l = 0,
                    c = "0",
                    d = e && [],
                    u = [],
                    p = x,
                    f = e || w && b.find.TAG("*", o),
                    h = $ += null == p ? 1 : Math.random() || .1,
                    g = f.length;
                for (o && (x = t === k || t || o); c !== g && null != (r = f[c]); c++) {
                    if (w && r) {
                        for (s = 0, t || r.ownerDocument === k || (T(r), n = !C); a = v[s++];)
                            if (a(r, t || k, n)) {
                                i.push(r);
                                break
                            } o && ($ = h)
                    }
                    y && ((r = !a && r) && l--, e && d.push(r))
                }
                if (l += c, y && c !== l) {
                    for (s = 0; a = m[s++];) a(d, u, t, n);
                    if (e) {
                        if (0 < l)
                            for (; c--;) d[c] || u[c] || (u[c] = O.call(i));
                        u = ye(u)
                    }
                    L.apply(i, u), o && !e && 0 < u.length && 1 < l + m.length && re.uniqueSort(i)
                }
                return o && ($ = h, x = p), d
            }
            var y = 0 < m.length,
                w = 0 < v.length;
            return y ? ae(e) : e
        }
        return he.prototype = b.filters = b.pseudos, b.setFilters = new he, h = re.tokenize = function (e, t) {
            var n, i, o, r, s, a, l, c = D[e + " "];
            if (c) return t ? 0 : c.slice(0);
            for (s = e, a = [], l = b.preFilter; s;) {
                for (r in n && !(i = B.exec(s)) || (i && (s = s.slice(i[0].length) || s), a.push(o = [])), n = !1, (i = U.exec(s)) && (n = i.shift(), o.push({
                        value: n,
                        type: i[0].replace(R, " ")
                    }), s = s.slice(n.length)), b.filter) !(i = G[r].exec(s)) || l[r] && !(i = l[r](i)) || (n = i.shift(), o.push({
                    value: n,
                    type: r,
                    matches: i
                }), s = s.slice(n.length));
                if (!n) break
            }
            return t ? s.length : s ? re.error(e) : D(e, a).slice(0)
        }, p = re.compile = function (e, t) {
            var n, i = [],
                o = [],
                r = A[e + " "];
            if (!r) {
                for (n = (t = t || h(e)).length; n--;)((r = function e(t) {
                    for (var i, n, o, r = t.length, s = b.relative[t[0].type], a = s || b.relative[" "], l = s ? 1 : 0, c = ve(function (e) {
                            return e === i
                        }, a, !0), d = ve(function (e) {
                            return -1 < H(i, e)
                        }, a, !0), u = [function (e, t, n) {
                            return n = !s && (n || t !== x) || ((i = t).nodeType ? c : d)(e, t, n), i = null, n
                        }]; l < r; l++)
                        if (n = b.relative[t[l].type]) u = [ve(me(u), n)];
                        else {
                            if ((n = b.filter[t[l].type].apply(null, t[l].matches))[S]) {
                                for (o = ++l; o < r && !b.relative[t[o].type]; o++);
                                return we(1 < l && me(u), 1 < l && ge(t.slice(0, l - 1).concat({
                                    value: " " === t[l - 2].type ? "*" : ""
                                })).replace(R, "$1"), n, l < o && e(t.slice(l, o)), o < r && e(t = t.slice(o)), o < r && ge(t))
                            }
                            u.push(n)
                        } return me(u)
                }(t[n]))[S] ? i : o).push(r);
                (r = A(e, be(o, i))).selector = e
            }
            return r
        }, g = re.select = function (e, t, n, i) {
            var o, r, s, a, l, c = "function" == typeof e && e,
                d = !i && h(e = c.selector || e);
            if (n = n || [], 1 === d.length) {
                if (2 < (r = d[0] = d[0].slice(0)).length && "ID" === (s = r[0]).type && f.getById && 9 === t.nodeType && C && b.relative[r[1].type]) {
                    if (!(t = (b.find.ID(s.matches[0].replace(te, u), t) || [])[0])) return n;
                    c && (t = t.parentNode), e = e.slice(r.shift().value.length)
                }
                for (o = G.needsContext.test(e) ? 0 : r.length; o-- && (s = r[o], !b.relative[a = s.type]);)
                    if ((l = b.find[a]) && (i = l(s.matches[0].replace(te, u), ee.test(r[0].type) && fe(t.parentNode) || t))) {
                        if (r.splice(o, 1), !(e = i.length && ge(r))) return L.apply(n, i), n;
                        break
                    }
            }
            return (c || p(e, d))(i, t, !C, n, !t || ee.test(e) && fe(t.parentNode) || t), n
        }, f.sortStable = S.split("").sort(P).join("") === S, f.detectDuplicates = !!c, T(), f.sortDetached = le(function (e) {
            return 1 & e.compareDocumentPosition(k.createElement("fieldset"))
        }), le(function (e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || ce("type|href|height|width", function (e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), f.attributes && le(function (e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || ce("value", function (e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), le(function (e) {
            return null == e.getAttribute("disabled")
        }) || ce(q, function (e, t, n) {
            return n ? void 0 : !0 === e[t] ? t.toLowerCase() : (t = e.getAttributeNode(t)) && t.specified ? t.value : null
        }), re
    }(T);
    C.find = b, C.expr = b.selectors, C.expr[":"] = C.expr.pseudos, C.uniqueSort = C.unique = b.uniqueSort, C.text = b.getText, C.isXMLDoc = b.isXML, C.contains = b.contains, C.escapeSelector = b.escape;

    function x(e, t, n) {
        for (var i = [], o = void 0 !== n;
            (e = e[t]) && 9 !== e.nodeType;)
            if (1 === e.nodeType) {
                if (o && C(e).is(n)) break;
                i.push(e)
            } return i
    }

    function S(e, t) {
        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
        return n
    }
    var $ = C.expr.match.needsContext,
        E = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
        D = /^.[^:#\[\.,]*$/;

    function A(e, n, i) {
        if (C.isFunction(n)) return C.grep(e, function (e, t) {
            return !!n.call(e, t, e) !== i
        });
        if (n.nodeType) return C.grep(e, function (e) {
            return e === n !== i
        });
        if ("string" == typeof n) {
            if (D.test(n)) return C.filter(n, e, i);
            n = C.filter(n, e)
        }
        return C.grep(e, function (e) {
            return -1 < o.call(n, e) !== i && 1 === e.nodeType
        })
    }
    C.filter = function (e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? C.find.matchesSelector(i, e) ? [i] : [] : C.find.matches(e, C.grep(t, function (e) {
            return 1 === e.nodeType
        }))
    }, C.fn.extend({
        find: function (e) {
            var t, n, i = this.length,
                o = this;
            if ("string" != typeof e) return this.pushStack(C(e).filter(function () {
                for (t = 0; t < i; t++)
                    if (C.contains(o[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < i; t++) C.find(e, o[t], n);
            return 1 < i ? C.uniqueSort(n) : n
        },
        filter: function (e) {
            return this.pushStack(A(this, e || [], !1))
        },
        not: function (e) {
            return this.pushStack(A(this, e || [], !0))
        },
        is: function (e) {
            return !!A(this, "string" == typeof e && $.test(e) ? C(e) : e || [], !1).length
        }
    });
    var P = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (C.fn.init = function (e, t, n) {
        if (!e) return this;
        if (n = n || j, "string" != typeof e) return e.nodeType ? (this[0] = e, this.length = 1, this) : C.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(C) : C.makeArray(e, this);
        if (!(i = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : P.exec(e)) || !i[1] && t) return (!t || t.jquery ? t || n : this.constructor(t)).find(e);
        if (i[1]) {
            if (t = t instanceof C ? t[0] : t, C.merge(this, C.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : k, !0)), E.test(i[1]) && C.isPlainObject(t))
                for (var i in t) C.isFunction(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
            return this
        }
        return (e = k.getElementById(i[2])) && (this[0] = e, this.length = 1), this
    }).prototype = C.fn;
    var j = C(k),
        O = /^(?:parents|prev(?:Until|All))/,
        M = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };

    function L(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }
    C.fn.extend({
        has: function (e) {
            var t = C(e, this),
                n = t.length;
            return this.filter(function () {
                for (var e = 0; e < n; e++)
                    if (C.contains(this, t[e])) return !0
            })
        },
        closest: function (e, t) {
            var n, i = 0,
                o = this.length,
                r = [],
                s = "string" != typeof e && C(e);
            if (!$.test(e))
                for (; i < o; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? -1 < s.index(n) : 1 === n.nodeType && C.find.matchesSelector(n, e))) {
                            r.push(n);
                            break
                        } return this.pushStack(1 < r.length ? C.uniqueSort(r) : r)
        },
        index: function (e) {
            return e ? "string" == typeof e ? o.call(C(e), this[0]) : o.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (e, t) {
            return this.pushStack(C.uniqueSort(C.merge(this.get(), C(e, t))))
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), C.each({
        parent: function (e) {
            e = e.parentNode;
            return e && 11 !== e.nodeType ? e : null
        },
        parents: function (e) {
            return x(e, "parentNode")
        },
        parentsUntil: function (e, t, n) {
            return x(e, "parentNode", n)
        },
        next: function (e) {
            return L(e, "nextSibling")
        },
        prev: function (e) {
            return L(e, "previousSibling")
        },
        nextAll: function (e) {
            return x(e, "nextSibling")
        },
        prevAll: function (e) {
            return x(e, "previousSibling")
        },
        nextUntil: function (e, t, n) {
            return x(e, "nextSibling", n)
        },
        prevUntil: function (e, t, n) {
            return x(e, "previousSibling", n)
        },
        siblings: function (e) {
            return S((e.parentNode || {}).firstChild, e)
        },
        children: function (e) {
            return S(e.firstChild)
        },
        contents: function (e) {
            return e.contentDocument || C.merge([], e.childNodes)
        }
    }, function (i, o) {
        C.fn[i] = function (e, t) {
            var n = C.map(this, o, e);
            return (t = "Until" !== i.slice(-5) ? e : t) && "string" == typeof t && (n = C.filter(t, n)), 1 < this.length && (M[i] || C.uniqueSort(n), O.test(i) && n.reverse()), this.pushStack(n)
        }
    });
    var N = /\S+/g;

    function H(e) {
        return e
    }

    function q(e) {
        throw e
    }

    function I(e, t, n) {
        var i;
        try {
            e && C.isFunction(i = e.promise) ? i.call(e).done(t).fail(n) : e && C.isFunction(i = e.then) ? i.call(e, t, n) : t.call(void 0, e)
        } catch (e) {
            n.call(void 0, e)
        }
    }
    C.Callbacks = function (i) {
        var e, n;
        i = "string" == typeof i ? (e = i, n = {}, C.each(e.match(N) || [], function (e, t) {
            n[t] = !0
        }), n) : C.extend({}, i);

        function o() {
            for (a = i.once, s = r = !0; c.length; d = -1)
                for (t = c.shift(); ++d < l.length;) !1 === l[d].apply(t[0], t[1]) && i.stopOnFalse && (d = l.length, t = !1);
            i.memory || (t = !1), r = !1, a && (l = t ? [] : "")
        }
        var r, t, s, a, l = [],
            c = [],
            d = -1,
            u = {
                add: function () {
                    return l && (t && !r && (d = l.length - 1, c.push(t)), function n(e) {
                        C.each(e, function (e, t) {
                            C.isFunction(t) ? i.unique && u.has(t) || l.push(t) : t && t.length && "string" !== C.type(t) && n(t)
                        })
                    }(arguments), t && !r && o()), this
                },
                remove: function () {
                    return C.each(arguments, function (e, t) {
                        for (var n; - 1 < (n = C.inArray(t, l, n));) l.splice(n, 1), n <= d && d--
                    }), this
                },
                has: function (e) {
                    return e ? -1 < C.inArray(e, l) : 0 < l.length
                },
                empty: function () {
                    return l = l && [], this
                },
                disable: function () {
                    return a = c = [], l = t = "", this
                },
                disabled: function () {
                    return !l
                },
                lock: function () {
                    return a = c = [], t || r || (l = t = ""), this
                },
                locked: function () {
                    return !!a
                },
                fireWith: function (e, t) {
                    return a || (t = [e, (t = t || []).slice ? t.slice() : t], c.push(t), r || o()), this
                },
                fire: function () {
                    return u.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!s
                }
            };
        return u
    }, C.extend({
        Deferred: function (e) {
            var r = [
                    ["notify", "progress", C.Callbacks("memory"), C.Callbacks("memory"), 2],
                    ["resolve", "done", C.Callbacks("once memory"), C.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", C.Callbacks("once memory"), C.Callbacks("once memory"), 1, "rejected"]
                ],
                o = "pending",
                s = {
                    state: function () {
                        return o
                    },
                    always: function () {
                        return a.done(arguments).fail(arguments), this
                    },
                    catch: function (e) {
                        return s.then(null, e)
                    },
                    pipe: function () {
                        var o = arguments;
                        return C.Deferred(function (i) {
                            C.each(r, function (e, t) {
                                var n = C.isFunction(o[t[4]]) && o[t[4]];
                                a[t[1]](function () {
                                    var e = n && n.apply(this, arguments);
                                    e && C.isFunction(e.promise) ? e.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[t[0] + "With"](this, n ? [e] : arguments)
                                })
                            }), o = null
                        }).promise()
                    },
                    then: function (t, n, i) {
                        var l = 0;

                        function c(o, r, s, a) {
                            return function () {
                                function e() {
                                    var e, t;
                                    if (!(o < l)) {
                                        if ((e = s.apply(n, i)) === r.promise()) throw new TypeError("Thenable self-resolution");
                                        t = e && ("object" == typeof e || "function" == typeof e) && e.then, C.isFunction(t) ? a ? t.call(e, c(l, r, H, a), c(l, r, q, a)) : (l++, t.call(e, c(l, r, H, a), c(l, r, q, a), c(l, r, H, r.notifyWith))) : (s !== H && (n = void 0, i = [e]), (a || r.resolveWith)(n, i))
                                    }
                                }
                                var n = this,
                                    i = arguments,
                                    t = a ? e : function () {
                                        try {
                                            e()
                                        } catch (e) {
                                            C.Deferred.exceptionHook && C.Deferred.exceptionHook(e, t.stackTrace), l <= o + 1 && (s !== q && (n = void 0, i = [e]), r.rejectWith(n, i))
                                        }
                                    };
                                o ? t() : (C.Deferred.getStackHook && (t.stackTrace = C.Deferred.getStackHook()), T.setTimeout(t))
                            }
                        }
                        return C.Deferred(function (e) {
                            r[0][3].add(c(0, e, C.isFunction(i) ? i : H, e.notifyWith)), r[1][3].add(c(0, e, C.isFunction(t) ? t : H)), r[2][3].add(c(0, e, C.isFunction(n) ? n : q))
                        }).promise()
                    },
                    promise: function (e) {
                        return null != e ? C.extend(e, s) : s
                    }
                },
                a = {};
            return C.each(r, function (e, t) {
                var n = t[2],
                    i = t[5];
                s[t[1]] = n.add, i && n.add(function () {
                    o = i
                }, r[3 - e][2].disable, r[0][2].lock), n.add(t[3].fire), a[t[0]] = function () {
                    return a[t[0] + "With"](this === a ? void 0 : this, arguments), this
                }, a[t[0] + "With"] = n.fireWith
            }), s.promise(a), e && e.call(a, a), a
        },
        when: function (e) {
            function t(t) {
                return function (e) {
                    o[t] = this, r[t] = 1 < arguments.length ? a.call(arguments) : e, --n || s.resolveWith(o, r)
                }
            }
            var n = arguments.length,
                i = n,
                o = Array(i),
                r = a.call(arguments),
                s = C.Deferred();
            if (n <= 1 && (I(e, s.done(t(i)).resolve, s.reject), "pending" === s.state() || C.isFunction(r[i] && r[i].then))) return s.then();
            for (; i--;) I(r[i], t(i), s.reject);
            return s.promise()
        }
    });
    var z = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    C.Deferred.exceptionHook = function (e, t) {
        T.console && T.console.warn && e && z.test(e.name) && T.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    };
    var F = C.Deferred();

    function W() {
        k.removeEventListener("DOMContentLoaded", W), T.removeEventListener("load", W), C.ready()
    }
    C.fn.ready = function (e) {
        return F.then(e), this
    }, C.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function (e) {
            e ? C.readyWait++ : C.ready(!0)
        },
        ready: function (e) {
            (!0 === e ? --C.readyWait : C.isReady) || ((C.isReady = !0) !== e && 0 < --C.readyWait || F.resolveWith(k, [C]))
        }
    }), C.ready.then = F.then, "complete" === k.readyState || "loading" !== k.readyState && !k.documentElement.doScroll ? T.setTimeout(C.ready) : (k.addEventListener("DOMContentLoaded", W), T.addEventListener("load", W));

    function _(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }
    var R = function (e, t, n, i, o, r, s) {
        var a = 0,
            l = e.length,
            c = null == n;
        if ("object" === C.type(n))
            for (a in o = !0, n) R(e, t, a, n[a], !0, r, s);
        else if (void 0 !== i && (o = !0, C.isFunction(i) || (s = !0), t = c ? s ? (t.call(e, i), null) : (c = t, function (e, t, n) {
                return c.call(C(e), n)
            }) : t))
            for (; a < l; a++) t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
        return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
    };

    function B() {
        this.expando = C.expando + B.uid++
    }
    B.uid = 1, B.prototype = {
        cache: function (e) {
            var t = e[this.expando];
            return t || (t = {}, _(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function (e, t, n) {
            var i, o = this.cache(e);
            if ("string" == typeof t) o[C.camelCase(t)] = n;
            else
                for (i in t) o[C.camelCase(i)] = t[i];
            return o
        },
        get: function (e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][C.camelCase(t)]
        },
        access: function (e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function (e, t) {
            var n, i = e[this.expando];
            if (void 0 !== i) {
                if (void 0 !== t) {
                    n = (t = C.isArray(t) ? t.map(C.camelCase) : (t = C.camelCase(t)) in i ? [t] : t.match(N) || []).length;
                    for (; n--;) delete i[t[n]]
                }
                void 0 !== t && !C.isEmptyObject(i) || (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function (e) {
            e = e[this.expando];
            return void 0 !== e && !C.isEmptyObject(e)
        }
    };
    var U = new B,
        X = new B,
        Q = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Y = /[A-Z]/g;

    function G(e, t, n) {
        var i;
        if (void 0 === n && 1 === e.nodeType)
            if (i = "data-" + t.replace(Y, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(i))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : Q.test(n) ? JSON.parse(n) : n)
                } catch (e) {}
                X.set(e, t, n)
            } else n = void 0;
        return n
    }
    C.extend({
        hasData: function (e) {
            return X.hasData(e) || U.hasData(e)
        },
        data: function (e, t, n) {
            return X.access(e, t, n)
        },
        removeData: function (e, t) {
            X.remove(e, t)
        },
        _data: function (e, t, n) {
            return U.access(e, t, n)
        },
        _removeData: function (e, t) {
            U.remove(e, t)
        }
    }), C.fn.extend({
        data: function (n, e) {
            var t, i, o, r = this[0],
                s = r && r.attributes;
            if (void 0 !== n) return "object" == typeof n ? this.each(function () {
                X.set(this, n)
            }) : R(this, function (e) {
                var t;
                return r && void 0 === e ? void 0 !== (t = X.get(r, n)) || void 0 !== (t = G(r, n)) ? t : void 0 : void this.each(function () {
                    X.set(this, n, e)
                })
            }, null, e, 1 < arguments.length, null, !0);
            if (this.length && (o = X.get(r), 1 === r.nodeType && !U.get(r, "hasDataAttrs"))) {
                for (t = s.length; t--;) s[t] && (0 === (i = s[t].name).indexOf("data-") && (i = C.camelCase(i.slice(5)), G(r, i, o[i])));
                U.set(r, "hasDataAttrs", !0)
            }
            return o
        },
        removeData: function (e) {
            return this.each(function () {
                X.remove(this, e)
            })
        }
    }), C.extend({
        queue: function (e, t, n) {
            var i;
            return e ? (t = (t || "fx") + "queue", i = U.get(e, t), n && (!i || C.isArray(n) ? i = U.access(e, t, C.makeArray(n)) : i.push(n)), i || []) : void 0
        },
        dequeue: function (e, t) {
            t = t || "fx";
            var n = C.queue(e, t),
                i = n.length,
                o = n.shift(),
                r = C._queueHooks(e, t);
            "inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete r.stop, o.call(e, function () {
                C.dequeue(e, t)
            }, r)), !i && r && r.empty.fire()
        },
        _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return U.get(e, n) || U.access(e, n, {
                empty: C.Callbacks("once memory").add(function () {
                    U.remove(e, [t + "queue", n])
                })
            })
        }
    }), C.fn.extend({
        queue: function (t, n) {
            var e = 2;
            return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? C.queue(this[0], t) : void 0 === n ? this : this.each(function () {
                var e = C.queue(this, t, n);
                C._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && C.dequeue(this, t)
            })
        },
        dequeue: function (e) {
            return this.each(function () {
                C.dequeue(this, e)
            })
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", [])
        },
        promise: function (e, t) {
            function n() {
                --o || r.resolveWith(s, [s])
            }
            var i, o = 1,
                r = C.Deferred(),
                s = this,
                a = this.length;
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(i = U.get(s[a], e + "queueHooks")) && i.empty && (o++, i.empty.add(n));
            return n(), r.promise(t)
        }
    });

    function V(e, t, n, i) {
        var o, r = {};
        for (o in t) r[o] = e.style[o], e.style[o] = t[o];
        for (o in i = n.apply(e, i || []), t) e.style[o] = r[o];
        return i
    }
    var u = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        J = new RegExp("^(?:([+-])=|)(" + u + ")([a-z%]*)$", "i"),
        K = ["Top", "Right", "Bottom", "Left"],
        Z = function (e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && C.contains(e.ownerDocument, e) && "none" === C.css(e, "display")
        };

    function ee(e, t, n, i) {
        var o, r = 1,
            s = 20,
            a = i ? function () {
                return i.cur()
            } : function () {
                return C.css(e, t, "")
            },
            l = a(),
            c = n && n[3] || (C.cssNumber[t] ? "" : "px"),
            d = (C.cssNumber[t] || "px" !== c && +l) && J.exec(C.css(e, t));
        if (d && d[3] !== c)
            for (c = c || d[3], n = n || [], d = +l || 1; r = r || ".5", d /= r, C.style(e, t, d + c), r !== (r = a() / l) && 1 !== r && --s;);
        return n && (d = +d || +l || 0, o = n[1] ? d + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = d, i.end = o)), o
    }
    var te = {};

    function ne(e, t) {
        for (var n, i, o, r, s, a = [], l = 0, c = e.length; l < c; l++)(i = e[l]).style && (n = i.style.display, t ? ("none" === n && (a[l] = U.get(i, "display") || null, a[l] || (i.style.display = "")), "" === i.style.display && Z(i) && (a[l] = (s = r = void 0, r = (o = i).ownerDocument, s = o.nodeName, (o = te[s]) || (r = r.body.appendChild(r.createElement(s)), o = C.css(r, "display"), r.parentNode.removeChild(r), "none" === o && (o = "block"), te[s] = o)))) : "none" !== n && (a[l] = "none", U.set(i, "display", n)));
        for (l = 0; l < c; l++) null != a[l] && (e[l].style.display = a[l]);
        return e
    }
    C.fn.extend({
        show: function () {
            return ne(this, !0)
        },
        hide: function () {
            return ne(this)
        },
        toggle: function (e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                Z(this) ? C(this).show() : C(this).hide()
            })
        }
    });
    var ie = /^(?:checkbox|radio)$/i,
        oe = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
        re = /^$|\/(?:java|ecma)script/i,
        se = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };

    function ae(e, t) {
        var n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && C.nodeName(e, t) ? C.merge([e], n) : n
    }

    function le(e, t) {
        for (var n = 0, i = e.length; n < i; n++) U.set(e[n], "globalEval", !t || U.get(t[n], "globalEval"))
    }
    se.optgroup = se.option, se.tbody = se.tfoot = se.colgroup = se.caption = se.thead, se.th = se.td;
    var ce = /<|&#?\w+;/;

    function de(e, t, n, i, o) {
        for (var r, s, a, l, c, d = t.createDocumentFragment(), u = [], p = 0, f = e.length; p < f; p++)
            if ((r = e[p]) || 0 === r)
                if ("object" === C.type(r)) C.merge(u, r.nodeType ? [r] : r);
                else if (ce.test(r)) {
            for (s = s || d.appendChild(t.createElement("div")), a = (oe.exec(r) || ["", ""])[1].toLowerCase(), a = se[a] || se._default, s.innerHTML = a[1] + C.htmlPrefilter(r) + a[2], c = a[0]; c--;) s = s.lastChild;
            C.merge(u, s.childNodes), (s = d.firstChild).textContent = ""
        } else u.push(t.createTextNode(r));
        for (d.textContent = "", p = 0; r = u[p++];)
            if (i && -1 < C.inArray(r, i)) o && o.push(r);
            else if (l = C.contains(r.ownerDocument, r), s = ae(d.appendChild(r), "script"), l && le(s), n)
            for (c = 0; r = s[c++];) re.test(r.type || "") && n.push(r);
        return d
    }
    t = k.createDocumentFragment().appendChild(k.createElement("div")), (b = k.createElement("input")).setAttribute("type", "radio"), b.setAttribute("checked", "checked"), b.setAttribute("name", "t"), t.appendChild(b), v.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", v.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue;
    var ue = k.documentElement,
        pe = /^key/,
        fe = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        he = /^([^.]*)(?:\.(.+)|)/;

    function ge() {
        return !0
    }

    function ve() {
        return !1
    }

    function me() {
        try {
            return k.activeElement
        } catch (e) {}
    }

    function ye(e, t, n, i, o, r) {
        var s, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof n && (i = i || n, n = void 0), t) ye(e, a, n, i, t[a], r);
            return e
        }
        if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), !1 === o) o = ve;
        else if (!o) return e;
        return 1 === r && (s = o, (o = function (e) {
            return C().off(e), s.apply(this, arguments)
        }).guid = s.guid || (s.guid = C.guid++)), e.each(function () {
            C.event.add(this, t, o, i, n)
        })
    }
    C.event = {
        global: {},
        add: function (t, e, n, i, o) {
            var r, s, a, l, c, d, u, p, f, h = U.get(t);
            if (h)
                for (n.handler && (n = (r = n).handler, o = r.selector), o && C.find.matchesSelector(ue, o), n.guid || (n.guid = C.guid++), (a = h.events) || (a = h.events = {}), (s = h.handle) || (s = h.handle = function (e) {
                        return void 0 !== C && C.event.triggered !== e.type ? C.event.dispatch.apply(t, arguments) : void 0
                    }), l = (e = (e || "").match(N) || [""]).length; l--;) u = f = (c = he.exec(e[l]) || [])[1], p = (c[2] || "").split(".").sort(), u && (d = C.event.special[u] || {}, u = (o ? d.delegateType : d.bindType) || u, d = C.event.special[u] || {}, c = C.extend({
                    type: u,
                    origType: f,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: o,
                    needsContext: o && C.expr.match.needsContext.test(o),
                    namespace: p.join(".")
                }, r), (f = a[u]) || ((f = a[u] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(t, i, p, s) || t.addEventListener && t.addEventListener(u, s)), d.add && (d.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), o ? f.splice(f.delegateCount++, 0, c) : f.push(c), C.event.global[u] = !0)
        },
        remove: function (e, t, n, i, o) {
            var r, s, a, l, c, d, u, p, f, h, g, v = U.hasData(e) && U.get(e);
            if (v && (l = v.events)) {
                for (c = (t = (t || "").match(N) || [""]).length; c--;)
                    if (f = g = (a = he.exec(t[c]) || [])[1], h = (a[2] || "").split(".").sort(), f) {
                        for (u = C.event.special[f] || {}, p = l[f = (i ? u.delegateType : u.bindType) || f] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = r = p.length; r--;) d = p[r], !o && g !== d.origType || n && n.guid !== d.guid || a && !a.test(d.namespace) || i && i !== d.selector && ("**" !== i || !d.selector) || (p.splice(r, 1), d.selector && p.delegateCount--, u.remove && u.remove.call(e, d));
                        s && !p.length && (u.teardown && !1 !== u.teardown.call(e, h, v.handle) || C.removeEvent(e, f, v.handle), delete l[f])
                    } else
                        for (f in l) C.event.remove(e, f + t[c], n, i, !0);
                C.isEmptyObject(l) && U.remove(e, "handle events")
            }
        },
        dispatch: function (e) {
            var t, n, i, o, r, s = C.event.fix(e),
                a = new Array(arguments.length),
                l = (U.get(this, "events") || {})[s.type] || [],
                e = C.event.special[s.type] || {};
            for (a[0] = s, t = 1; t < arguments.length; t++) a[t] = arguments[t];
            if (s.delegateTarget = this, !e.preDispatch || !1 !== e.preDispatch.call(this, s)) {
                for (r = C.event.handlers.call(this, s, l), t = 0;
                    (i = r[t++]) && !s.isPropagationStopped();)
                    for (s.currentTarget = i.elem, n = 0;
                        (o = i.handlers[n++]) && !s.isImmediatePropagationStopped();) s.rnamespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (o = ((C.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, a)) && !1 === (s.result = o) && (s.preventDefault(), s.stopPropagation()));
                return e.postDispatch && e.postDispatch.call(this, s), s.result
            }
        },
        handlers: function (e, t) {
            var n, i, o, r, s = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (i = [], n = 0; n < a; n++) void 0 === i[o = (r = t[n]).selector + " "] && (i[o] = r.needsContext ? -1 < C(o, this).index(l) : C.find(o, this, null, [l]).length), i[o] && i.push(r);
                        i.length && s.push({
                            elem: l,
                            handlers: i
                        })
                    } return a < t.length && s.push({
                elem: this,
                handlers: t.slice(a)
            }), s
        },
        addProp: function (t, e) {
            Object.defineProperty(C.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: C.isFunction(e) ? function () {
                    return this.originalEvent ? e(this.originalEvent) : void 0
                } : function () {
                    return this.originalEvent ? this.originalEvent[t] : void 0
                },
                set: function (e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function (e) {
            return e[C.expando] ? e : new C.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    return this !== me() && this.focus ? (this.focus(), !1) : void 0
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    return this === me() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    return "checkbox" === this.type && this.click && C.nodeName(this, "input") ? (this.click(), !1) : void 0
                },
                _default: function (e) {
                    return C.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, C.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, C.Event = function (e, t) {
        return this instanceof C.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ge : ve, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && C.extend(this, t), this.timeStamp = e && e.timeStamp || C.now(), void(this[C.expando] = !0)) : new C.Event(e, t)
    }, C.Event.prototype = {
        constructor: C.Event,
        isDefaultPrevented: ve,
        isPropagationStopped: ve,
        isImmediatePropagationStopped: ve,
        isSimulated: !1,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = ge, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = ge, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = ge, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, C.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (e) {
            var t = e.button;
            return null == e.which && pe.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && fe.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, C.event.addProp), C.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (e, o) {
        C.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function (e) {
                var t, n = e.relatedTarget,
                    i = e.handleObj;
                return n && (n === this || C.contains(this, n)) || (e.type = i.origType, t = i.handler.apply(this, arguments), e.type = o), t
            }
        }
    }), C.fn.extend({
        on: function (e, t, n, i) {
            return ye(this, e, t, n, i)
        },
        one: function (e, t, n, i) {
            return ye(this, e, t, n, i, 1)
        },
        off: function (e, t, n) {
            var i, o;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, C(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" != typeof e) return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = ve), this.each(function () {
                C.event.remove(this, e, n, t)
            });
            for (o in e) this.off(o, t, e[o]);
            return this
        }
    });
    var we = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        be = /<script|<style|<link/i,
        xe = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Te = /^true\/(.*)/,
        ke = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function Ce(e, t) {
        return C.nodeName(e, "table") && C.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") && e.getElementsByTagName("tbody")[0] || e
    }

    function Se(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function $e(e) {
        var t = Te.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function Ee(e, t) {
        var n, i, o, r, s, a;
        if (1 === t.nodeType) {
            if (U.hasData(e) && (r = U.access(e), s = U.set(t, r), a = r.events))
                for (o in delete s.handle, s.events = {}, a)
                    for (n = 0, i = a[o].length; n < i; n++) C.event.add(t, o, a[o][n]);
            X.hasData(e) && (e = X.access(e), e = C.extend({}, e), X.set(t, e))
        }
    }

    function De(n, i, o, r) {
        i = g.apply([], i);
        var e, t, s, a, l, c, d = 0,
            u = n.length,
            p = u - 1,
            f = i[0],
            h = C.isFunction(f);
        if (h || 1 < u && "string" == typeof f && !v.checkClone && xe.test(f)) return n.each(function (e) {
            var t = n.eq(e);
            h && (i[0] = f.call(this, e, t.html())), De(t, i, o, r)
        });
        if (u && (t = (e = de(i, n[0].ownerDocument, !1, n, r)).firstChild, 1 === e.childNodes.length && (e = t), t || r)) {
            for (a = (s = C.map(ae(e, "script"), Se)).length; d < u; d++) l = e, d !== p && (l = C.clone(l, !0, !0), a && C.merge(s, ae(l, "script"))), o.call(n[d], l, d);
            if (a)
                for (c = s[s.length - 1].ownerDocument, C.map(s, $e), d = 0; d < a; d++) l = s[d], re.test(l.type || "") && !U.access(l, "globalEval") && C.contains(c, l) && (l.src ? C._evalUrl && C._evalUrl(l.src) : m(l.textContent.replace(ke, ""), c))
        }
        return n
    }

    function Ae(e, t, n) {
        for (var i, o = t ? C.filter(t, e) : e, r = 0; null != (i = o[r]); r++) n || 1 !== i.nodeType || C.cleanData(ae(i)), i.parentNode && (n && C.contains(i.ownerDocument, i) && le(ae(i, "script")), i.parentNode.removeChild(i));
        return e
    }
    C.extend({
        htmlPrefilter: function (e) {
            return e.replace(we, "<$1></$2>")
        },
        clone: function (e, t, n) {
            var i, o, r, s, a, l, c, d = e.cloneNode(!0),
                u = C.contains(e.ownerDocument, e);
            if (!(v.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || C.isXMLDoc(e)))
                for (s = ae(d), i = 0, o = (r = ae(e)).length; i < o; i++) a = r[i], l = s[i], c = void 0, "input" === (c = l.nodeName.toLowerCase()) && ie.test(a.type) ? l.checked = a.checked : "input" !== c && "textarea" !== c || (l.defaultValue = a.defaultValue);
            if (t)
                if (n)
                    for (r = r || ae(e), s = s || ae(d), i = 0, o = r.length; i < o; i++) Ee(r[i], s[i]);
                else Ee(e, d);
            return 0 < (s = ae(d, "script")).length && le(s, !u && ae(e, "script")), d
        },
        cleanData: function (e) {
            for (var t, n, i, o = C.event.special, r = 0; void 0 !== (n = e[r]); r++)
                if (_(n)) {
                    if (t = n[U.expando]) {
                        if (t.events)
                            for (i in t.events) o[i] ? C.event.remove(n, i) : C.removeEvent(n, i, t.handle);
                        n[U.expando] = void 0
                    }
                    n[X.expando] && (n[X.expando] = void 0)
                }
        }
    }), C.fn.extend({
        detach: function (e) {
            return Ae(this, e, !0)
        },
        remove: function (e) {
            return Ae(this, e)
        },
        text: function (e) {
            return R(this, function (e) {
                return void 0 === e ? C.text(this) : this.empty().each(function () {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function () {
            return De(this, arguments, function (e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Ce(this, e).appendChild(e)
            })
        },
        prepend: function () {
            return De(this, arguments, function (e) {
                var t;
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (t = Ce(this, e)).insertBefore(e, t.firstChild)
            })
        },
        before: function () {
            return De(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function () {
            return De(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (C.cleanData(ae(e, !1)), e.textContent = "");
            return this
        },
        clone: function (e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function () {
                return C.clone(this, e, t)
            })
        },
        html: function (e) {
            return R(this, function (e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !be.test(e) && !se[(oe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = C.htmlPrefilter(e);
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (C.cleanData(ae(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function () {
            var n = [];
            return De(this, arguments, function (e) {
                var t = this.parentNode;
                C.inArray(this, n) < 0 && (C.cleanData(ae(this)), t && t.replaceChild(e, this))
            }, n)
        }
    }), C.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, s) {
        C.fn[e] = function (e) {
            for (var t, n = [], i = C(e), o = i.length - 1, r = 0; r <= o; r++) t = r === o ? this : this.clone(!0), C(i[r])[s](t), l.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var Pe, je, Oe, Me, Le, Ne, He = /^margin/,
        qe = new RegExp("^(" + u + ")(?!px)[a-z%]+$", "i"),
        Ie = function (e) {
            var t = e.ownerDocument.defaultView;
            return (t = !t || !t.opener ? T : t).getComputedStyle(e)
        };

    function ze() {
        var e;
        Ne && (Ne.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", Ne.innerHTML = "", ue.appendChild(Le), e = T.getComputedStyle(Ne), Pe = "1%" !== e.top, Me = "2px" === e.marginLeft, je = "4px" === e.width, Ne.style.marginRight = "50%", Oe = "4px" === e.marginRight, ue.removeChild(Le), Ne = null)
    }

    function Fe(e, t, n) {
        var i, o, r = e.style;
        return (n = n || Ie(e)) && ("" !== (o = n.getPropertyValue(t) || n[t]) || C.contains(e.ownerDocument, e) || (o = C.style(e, t)), !v.pixelMarginRight() && qe.test(o) && He.test(t) && (i = r.width, e = r.minWidth, t = r.maxWidth, r.minWidth = r.maxWidth = r.width = o, o = n.width, r.width = i, r.minWidth = e, r.maxWidth = t)), void 0 !== o ? o + "" : o
    }

    function We(e, t) {
        return {
            get: function () {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    Le = k.createElement("div"), (Ne = k.createElement("div")).style && (Ne.style.backgroundClip = "content-box", Ne.cloneNode(!0).style.backgroundClip = "", v.clearCloneStyle = "content-box" === Ne.style.backgroundClip, Le.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", Le.appendChild(Ne), C.extend(v, {
        pixelPosition: function () {
            return ze(), Pe
        },
        boxSizingReliable: function () {
            return ze(), je
        },
        pixelMarginRight: function () {
            return ze(), Oe
        },
        reliableMarginLeft: function () {
            return ze(), Me
        }
    }));
    var _e = /^(none|table(?!-c[ea]).+)/,
        Re = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Be = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Ue = ["Webkit", "Moz", "ms"],
        Xe = k.createElement("div").style;

    function Qe(e) {
        if (e in Xe) return e;
        for (var t = e[0].toUpperCase() + e.slice(1), n = Ue.length; n--;)
            if ((e = Ue[n] + t) in Xe) return e
    }

    function Ye(e, t, n) {
        var i = J.exec(t);
        return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
    }

    function Ge(e, t, n, i, o) {
        for (var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; r < 4; r += 2) "margin" === n && (s += C.css(e, n + K[r], !0, o)), i ? ("content" === n && (s -= C.css(e, "padding" + K[r], !0, o)), "margin" !== n && (s -= C.css(e, "border" + K[r] + "Width", !0, o))) : (s += C.css(e, "padding" + K[r], !0, o), "padding" !== n && (s += C.css(e, "border" + K[r] + "Width", !0, o)));
        return s
    }

    function Ve(e, t, n) {
        var i, o = !0,
            r = Ie(e),
            s = "border-box" === C.css(e, "boxSizing", !1, r);
        if ((i = e.getClientRects().length ? e.getBoundingClientRect()[t] : i) <= 0 || null == i) {
            if (((i = Fe(e, t, r)) < 0 || null == i) && (i = e.style[t]), qe.test(i)) return i;
            o = s && (v.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + Ge(e, t, n || (s ? "border" : "content"), o, r) + "px"
    }

    function Je(e, t, n, i, o) {
        return new Je.prototype.init(e, t, n, i, o)
    }
    C.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        e = Fe(e, "opacity");
                        return "" === e ? "1" : e
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: "cssFloat"
        },
        style: function (e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, s, a = C.camelCase(t),
                    l = e.style;
                return t = C.cssProps[a] || (C.cssProps[a] = Qe(a) || a), s = C.cssHooks[t] || C.cssHooks[a], void 0 === n ? s && "get" in s && void 0 !== (o = s.get(e, !1, i)) ? o : l[t] : ("string" === (r = typeof n) && (o = J.exec(n)) && o[1] && (n = ee(e, t, o), r = "number"), void(null != n && n == n && ("number" === r && (n += o && o[3] || (C.cssNumber[a] ? "" : "px")), v.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), s && "set" in s && void 0 === (n = s.set(e, n, i)) || (l[t] = n))))
            }
        },
        css: function (e, t, n, i) {
            var o, r = C.camelCase(t);
            return t = C.cssProps[r] || (C.cssProps[r] = Qe(r) || r), "normal" === (o = void 0 === (o = (r = C.cssHooks[t] || C.cssHooks[r]) && "get" in r ? r.get(e, !0, n) : o) ? Fe(e, t, i) : o) && t in Be && (o = Be[t]), "" === n || n ? (t = parseFloat(o), !0 === n || isFinite(t) ? t || 0 : o) : o
        }
    }), C.each(["height", "width"], function (e, r) {
        C.cssHooks[r] = {
            get: function (e, t, n) {
                return t ? !_e.test(C.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? Ve(e, r, n) : V(e, Re, function () {
                    return Ve(e, r, n)
                }) : void 0
            },
            set: function (e, t, n) {
                var i, o = n && Ie(e),
                    o = n && Ge(e, r, n, "border-box" === C.css(e, "boxSizing", !1, o), o);
                return o && (i = J.exec(t)) && "px" !== (i[3] || "px") && (e.style[r] = t, t = C.css(e, r)), Ye(0, t, o)
            }
        }
    }), C.cssHooks.marginLeft = We(v.reliableMarginLeft, function (e, t) {
        return t ? (parseFloat(Fe(e, "marginLeft")) || e.getBoundingClientRect().left - V(e, {
            marginLeft: 0
        }, function () {
            return e.getBoundingClientRect().left
        })) + "px" : void 0
    }), C.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (o, r) {
        C.cssHooks[o + r] = {
            expand: function (e) {
                for (var t = 0, n = {}, i = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++) n[o + K[t] + r] = i[t] || i[t - 2] || i[0];
                return n
            }
        }, He.test(o) || (C.cssHooks[o + r].set = Ye)
    }), C.fn.extend({
        css: function (e, t) {
            return R(this, function (e, t, n) {
                var i, o, r = {},
                    s = 0;
                if (C.isArray(t)) {
                    for (i = Ie(e), o = t.length; s < o; s++) r[t[s]] = C.css(e, t[s], !1, i);
                    return r
                }
                return void 0 !== n ? C.style(e, t, n) : C.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }), (C.Tween = Je).prototype = {
        constructor: Je,
        init: function (e, t, n, i, o, r) {
            this.elem = e, this.prop = n, this.easing = o || C.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = r || (C.cssNumber[n] ? "" : "px")
        },
        cur: function () {
            var e = Je.propHooks[this.prop];
            return (e && e.get ? e : Je.propHooks._default).get(this)
        },
        run: function (e) {
            var t, n = Je.propHooks[this.prop];
            return this.options.duration ? this.pos = t = C.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), (n && n.set ? n : Je.propHooks._default).set(this), this
        }
    }, Je.prototype.init.prototype = Je.prototype, Je.propHooks = {
        _default: {
            get: function (e) {
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (e = C.css(e.elem, e.prop, "")) && "auto" !== e ? e : 0
            },
            set: function (e) {
                C.fx.step[e.prop] ? C.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[C.cssProps[e.prop]] && !C.cssHooks[e.prop] ? e.elem[e.prop] = e.now : C.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, Je.propHooks.scrollTop = Je.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, C.easing = {
        linear: function (e) {
            return e
        },
        swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, C.fx = Je.prototype.init, C.fx.step = {};
    var Ke, Ze, et = /^(?:toggle|show|hide)$/,
        tt = /queueHooks$/;

    function nt() {
        Ze && (T.requestAnimationFrame(nt), C.fx.tick())
    }

    function it() {
        return T.setTimeout(function () {
            Ke = void 0
        }), Ke = C.now()
    }

    function ot(e, t) {
        var n, i = 0,
            o = {
                height: e
            };
        for (t = t ? 1 : 0; i < 4; i += 2 - t) o["margin" + (n = K[i])] = o["padding" + n] = e;
        return t && (o.opacity = o.width = e), o
    }

    function rt(e, t, n) {
        for (var i, o = (st.tweeners[t] || []).concat(st.tweeners["*"]), r = 0, s = o.length; r < s; r++)
            if (i = o[r].call(n, t, e)) return i
    }

    function st(o, e, t) {
        var n, r, i = 0,
            s = st.prefilters.length,
            a = C.Deferred().always(function () {
                delete l.elem
            }),
            l = function () {
                if (r) return !1;
                for (var e = Ke || it(), e = Math.max(0, c.startTime + c.duration - e), t = 1 - (e / c.duration || 0), n = 0, i = c.tweens.length; n < i; n++) c.tweens[n].run(t);
                return a.notifyWith(o, [c, t, e]), t < 1 && i ? e : (a.resolveWith(o, [c]), !1)
            },
            c = a.promise({
                elem: o,
                props: C.extend({}, e),
                opts: C.extend(!0, {
                    specialEasing: {},
                    easing: C.easing._default
                }, t),
                originalProperties: e,
                originalOptions: t,
                startTime: Ke || it(),
                duration: t.duration,
                tweens: [],
                createTween: function (e, t) {
                    e = C.Tween(o, c.opts, e, t, c.opts.specialEasing[e] || c.opts.easing);
                    return c.tweens.push(e), e
                },
                stop: function (e) {
                    var t = 0,
                        n = e ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; t < n; t++) c.tweens[t].run(1);
                    return e ? (a.notifyWith(o, [c, 1, 0]), a.resolveWith(o, [c, e])) : a.rejectWith(o, [c, e]), this
                }
            }),
            d = c.props;
        for (function (e, t) {
                var n, i, o, r, s;
                for (n in e)
                    if (i = C.camelCase(n), o = t[i], r = e[n], C.isArray(r) && (o = r[1], r = e[n] = r[0]), n !== i && (e[i] = r, delete e[n]), s = C.cssHooks[i], s && "expand" in s)
                        for (n in r = s.expand(r), delete e[i], r) n in e || (e[n] = r[n], t[n] = o);
                    else t[i] = o
            }(d, c.opts.specialEasing); i < s; i++)
            if (n = st.prefilters[i].call(c, o, d, c.opts)) return C.isFunction(n.stop) && (C._queueHooks(c.elem, c.opts.queue).stop = C.proxy(n.stop, n)), n;
        return C.map(d, rt, c), C.isFunction(c.opts.start) && c.opts.start.call(o, c), C.fx.timer(C.extend(l, {
            elem: o,
            anim: c,
            queue: c.opts.queue
        })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }
    C.Animation = C.extend(st, {
        tweeners: {
            "*": [function (e, t) {
                var n = this.createTween(e, t);
                return ee(n.elem, e, J.exec(t), n), n
            }]
        },
        tweener: function (e, t) {
            for (var n, i = 0, o = (e = C.isFunction(e) ? (t = e, ["*"]) : e.match(N)).length; i < o; i++) n = e[i], st.tweeners[n] = st.tweeners[n] || [], st.tweeners[n].unshift(t)
        },
        prefilters: [function (e, t, n) {
            var i, o, r, s, a, l, c, d = "width" in t || "height" in t,
                u = this,
                p = {},
                f = e.style,
                h = e.nodeType && Z(e),
                g = U.get(e, "fxshow");
            for (i in n.queue || (null == (s = C._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function () {
                    s.unqueued || a()
                }), s.unqueued++, u.always(function () {
                    u.always(function () {
                        s.unqueued--, C.queue(e, "fx").length || s.empty.fire()
                    })
                })), t)
                if (o = t[i], et.test(o)) {
                    if (delete t[i], r = r || "toggle" === o, o === (h ? "hide" : "show")) {
                        if ("show" !== o || !g || void 0 === g[i]) continue;
                        h = !0
                    }
                    p[i] = g && g[i] || C.style(e, i)
                } if ((l = !C.isEmptyObject(t)) || !C.isEmptyObject(p))
                for (i in d && 1 === e.nodeType && (n.overflow = [f.overflow, f.overflowX, f.overflowY], null == (c = g && g.display) && (c = U.get(e, "display")), "none" === (d = C.css(e, "display")) && (c ? d = c : (ne([e], !0), c = e.style.display || c, d = C.css(e, "display"), ne([e]))), ("inline" === d || "inline-block" === d && null != c) && "none" === C.css(e, "float") && (l || (u.done(function () {
                        f.display = c
                    }), null == c && (d = f.display, c = "none" === d ? "" : d)), f.display = "inline-block")), n.overflow && (f.overflow = "hidden", u.always(function () {
                        f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
                    })), l = !1, p) l || (g ? "hidden" in g && (h = g.hidden) : g = U.access(e, "fxshow", {
                    display: c
                }), r && (g.hidden = !h), h && ne([e], !0), u.done(function () {
                    for (i in h || ne([e]), U.remove(e, "fxshow"), p) C.style(e, i, p[i])
                })), l = rt(h ? g[i] : 0, i, u), i in g || (g[i] = l.start, h && (l.end = l.start, l.start = 0))
        }],
        prefilter: function (e, t) {
            t ? st.prefilters.unshift(e) : st.prefilters.push(e)
        }
    }), C.speed = function (e, t, n) {
        var i = e && "object" == typeof e ? C.extend({}, e) : {
            complete: n || !n && t || C.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !C.isFunction(t) && t
        };
        return C.fx.off || k.hidden ? i.duration = 0 : i.duration = "number" == typeof i.duration ? i.duration : i.duration in C.fx.speeds ? C.fx.speeds[i.duration] : C.fx.speeds._default, null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function () {
            C.isFunction(i.old) && i.old.call(this), i.queue && C.dequeue(this, i.queue)
        }, i
    }, C.fn.extend({
        fadeTo: function (e, t, n, i) {
            return this.filter(Z).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function (t, e, n, i) {
            var o = C.isEmptyObject(t),
                r = C.speed(e, n, i),
                i = function () {
                    var e = st(this, C.extend({}, t), r);
                    (o || U.get(this, "finish")) && e.stop(!0)
                };
            return i.finish = i, o || !1 === r.queue ? this.each(i) : this.queue(r.queue, i)
        },
        stop: function (o, e, r) {
            function s(e) {
                var t = e.stop;
                delete e.stop, t(r)
            }
            return "string" != typeof o && (r = e, e = o, o = void 0), e && !1 !== o && this.queue(o || "fx", []), this.each(function () {
                var e = !0,
                    t = null != o && o + "queueHooks",
                    n = C.timers,
                    i = U.get(this);
                if (t) i[t] && i[t].stop && s(i[t]);
                else
                    for (t in i) i[t] && i[t].stop && tt.test(t) && s(i[t]);
                for (t = n.length; t--;) n[t].elem !== this || null != o && n[t].queue !== o || (n[t].anim.stop(r), e = !1, n.splice(t, 1));
                !e && r || C.dequeue(this, o)
            })
        },
        finish: function (s) {
            return !1 !== s && (s = s || "fx"), this.each(function () {
                var e, t = U.get(this),
                    n = t[s + "queue"],
                    i = t[s + "queueHooks"],
                    o = C.timers,
                    r = n ? n.length : 0;
                for (t.finish = !0, C.queue(this, s, []), i && i.stop && i.stop.call(this, !0), e = o.length; e--;) o[e].elem === this && o[e].queue === s && (o[e].anim.stop(!0), o.splice(e, 1));
                for (e = 0; e < r; e++) n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }), C.each(["toggle", "show", "hide"], function (e, i) {
        var o = C.fn[i];
        C.fn[i] = function (e, t, n) {
            return null == e || "boolean" == typeof e ? o.apply(this, arguments) : this.animate(ot(i, !0), e, t, n)
        }
    }), C.each({
        slideDown: ot("show"),
        slideUp: ot("hide"),
        slideToggle: ot("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function (e, i) {
        C.fn[e] = function (e, t, n) {
            return this.animate(i, e, t, n)
        }
    }), C.timers = [], C.fx.tick = function () {
        var e, t = 0,
            n = C.timers;
        for (Ke = C.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || C.fx.stop(), Ke = void 0
    }, C.fx.timer = function (e) {
        C.timers.push(e), e() ? C.fx.start() : C.timers.pop()
    }, C.fx.interval = 13, C.fx.start = function () {
        Ze = Ze || (T.requestAnimationFrame ? T.requestAnimationFrame(nt) : T.setInterval(C.fx.tick, C.fx.interval))
    }, C.fx.stop = function () {
        T.cancelAnimationFrame ? T.cancelAnimationFrame(Ze) : T.clearInterval(Ze), Ze = null
    }, C.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, C.fn.delay = function (i, e) {
        return i = C.fx && C.fx.speeds[i] || i, e = e || "fx", this.queue(e, function (e, t) {
            var n = T.setTimeout(e, i);
            t.stop = function () {
                T.clearTimeout(n)
            }
        })
    }, t = k.createElement("input"), u = k.createElement("select").appendChild(k.createElement("option")), t.type = "checkbox", v.checkOn = "" !== t.value, v.optSelected = u.selected, (t = k.createElement("input")).value = "t", t.type = "radio", v.radioValue = "t" === t.value;
    var at, lt = C.expr.attrHandle;
    C.fn.extend({
        attr: function (e, t) {
            return R(this, C.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function (e) {
            return this.each(function () {
                C.removeAttr(this, e)
            })
        }
    }), C.extend({
        attr: function (e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return void 0 === e.getAttribute ? C.prop(e, t, n) : (1 === r && C.isXMLDoc(e) || (o = C.attrHooks[t.toLowerCase()] || (C.expr.match.bool.test(t) ? at : void 0)), void 0 !== n ? null === n ? void C.removeAttr(e, t) : o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : o && "get" in o && null !== (i = o.get(e, t)) ? i : null == (i = C.find.attr(e, t)) ? void 0 : i)
        },
        attrHooks: {
            type: {
                set: function (e, t) {
                    if (!v.radioValue && "radio" === t && C.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function (e, t) {
            var n, i = 0,
                o = t && t.match(N);
            if (o && 1 === e.nodeType)
                for (; n = o[i++];) e.removeAttribute(n)
        }
    }), at = {
        set: function (e, t, n) {
            return !1 === t ? C.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, C.each(C.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var s = lt[t] || C.find.attr;
        lt[t] = function (e, t, n) {
            var i, o, r = t.toLowerCase();
            return n || (o = lt[r], lt[r] = i, i = null != s(e, t, n) ? r : null, lt[r] = o), i
        }
    });
    var ct = /^(?:input|select|textarea|button)$/i,
        dt = /^(?:a|area)$/i;
    C.fn.extend({
        prop: function (e, t) {
            return R(this, C.prop, e, t, 1 < arguments.length)
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[C.propFix[e] || e]
            })
        }
    }), C.extend({
        prop: function (e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return 1 === r && C.isXMLDoc(e) || (t = C.propFix[t] || t, o = C.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function (e) {
                    var t = C.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : ct.test(e.nodeName) || dt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }), v.optSelected || (C.propHooks.selected = {
        get: function (e) {
            e = e.parentNode;
            return e && e.parentNode && e.parentNode.selectedIndex, null
        },
        set: function (e) {
            e = e.parentNode;
            e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
        }
    }), C.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        C.propFix[this.toLowerCase()] = this
    });
    var ut = /[\t\r\n\f]/g;

    function pt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    C.fn.extend({
        addClass: function (t) {
            var e, n, i, o, r, s, a = 0;
            if (C.isFunction(t)) return this.each(function (e) {
                C(this).addClass(t.call(this, e, pt(this)))
            });
            if ("string" == typeof t && t)
                for (e = t.match(N) || []; n = this[a++];)
                    if (s = pt(n), i = 1 === n.nodeType && (" " + s + " ").replace(ut, " ")) {
                        for (r = 0; o = e[r++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        s !== (s = C.trim(i)) && n.setAttribute("class", s)
                    } return this
        },
        removeClass: function (t) {
            var e, n, i, o, r, s, a = 0;
            if (C.isFunction(t)) return this.each(function (e) {
                C(this).removeClass(t.call(this, e, pt(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof t && t)
                for (e = t.match(N) || []; n = this[a++];)
                    if (s = pt(n), i = 1 === n.nodeType && (" " + s + " ").replace(ut, " ")) {
                        for (r = 0; o = e[r++];)
                            for (; - 1 < i.indexOf(" " + o + " ");) i = i.replace(" " + o + " ", " ");
                        s !== (s = C.trim(i)) && n.setAttribute("class", s)
                    } return this
        },
        toggleClass: function (o, t) {
            var r = typeof o;
            return "boolean" == typeof t && "string" == r ? t ? this.addClass(o) : this.removeClass(o) : C.isFunction(o) ? this.each(function (e) {
                C(this).toggleClass(o.call(this, e, pt(this), t), t)
            }) : this.each(function () {
                var e, t, n, i;
                if ("string" == r)
                    for (t = 0, n = C(this), i = o.match(N) || []; e = i[t++];) n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else void 0 !== o && "boolean" != r || ((e = pt(this)) && U.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", !e && !1 !== o && U.get(this, "__className__") || ""))
            })
        },
        hasClass: function (e) {
            for (var t, n = 0, i = " " + e + " "; t = this[n++];)
                if (1 === t.nodeType && -1 < (" " + pt(t) + " ").replace(ut, " ").indexOf(i)) return !0;
            return !1
        }
    });
    var ft = /\r/g,
        ht = /[\x20\t\r\n\f]+/g;
    C.fn.extend({
        val: function (t) {
            var n, e, i, o = this[0];
            return arguments.length ? (i = C.isFunction(t), this.each(function (e) {
                1 === this.nodeType && (null == (e = i ? t.call(this, e, C(this).val()) : t) ? e = "" : "number" == typeof e ? e += "" : C.isArray(e) && (e = C.map(e, function (e) {
                    return null == e ? "" : e + ""
                })), (n = C.valHooks[this.type] || C.valHooks[this.nodeName.toLowerCase()]) && "set" in n && void 0 !== n.set(this, e, "value") || (this.value = e))
            })) : o ? (n = C.valHooks[o.type] || C.valHooks[o.nodeName.toLowerCase()]) && "get" in n && void 0 !== (e = n.get(o, "value")) ? e : "string" == typeof (e = o.value) ? e.replace(ft, "") : null == e ? "" : e : void 0
        }
    }), C.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = C.find.attr(e, "value");
                    return null != t ? t : C.trim(C.text(e)).replace(ht, " ")
                }
            },
            select: {
                get: function (e) {
                    for (var t, n = e.options, i = e.selectedIndex, o = "select-one" === e.type, r = o ? null : [], s = o ? i + 1 : n.length, a = i < 0 ? s : o ? i : 0; a < s; a++)
                        if (((t = n[a]).selected || a === i) && !t.disabled && (!t.parentNode.disabled || !C.nodeName(t.parentNode, "optgroup"))) {
                            if (t = C(t).val(), o) return t;
                            r.push(t)
                        } return r
                },
                set: function (e, t) {
                    for (var n, i, o = e.options, r = C.makeArray(t), s = o.length; s--;)((i = o[s]).selected = -1 < C.inArray(C.valHooks.option.get(i), r)) && (n = !0);
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), C.each(["radio", "checkbox"], function () {
        C.valHooks[this] = {
            set: function (e, t) {
                return C.isArray(t) ? e.checked = -1 < C.inArray(C(e).val(), t) : void 0
            }
        }, v.checkOn || (C.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var gt = /^(?:focusinfocus|focusoutblur)$/;
    C.extend(C.event, {
        trigger: function (e, t, n, i) {
            var o, r, s, a, l, c, d = [n || k],
                u = h.call(e, "type") ? e.type : e,
                p = h.call(e, "namespace") ? e.namespace.split(".") : [],
                f = r = n = n || k;
            if (3 !== n.nodeType && 8 !== n.nodeType && !gt.test(u + C.event.triggered) && (-1 < u.indexOf(".") && (u = (p = u.split(".")).shift(), p.sort()), a = u.indexOf(":") < 0 && "on" + u, (e = e[C.expando] ? e : new C.Event(u, "object" == typeof e && e)).isTrigger = i ? 2 : 3, e.namespace = p.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : C.makeArray(t, [e]), c = C.event.special[u] || {}, i || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!i && !c.noBubble && !C.isWindow(n)) {
                    for (s = c.delegateType || u, gt.test(s + u) || (f = f.parentNode); f; f = f.parentNode) d.push(f), r = f;
                    r === (n.ownerDocument || k) && d.push(r.defaultView || r.parentWindow || T)
                }
                for (o = 0;
                    (f = d[o++]) && !e.isPropagationStopped();) e.type = 1 < o ? s : c.bindType || u, (l = (U.get(f, "events") || {})[e.type] && U.get(f, "handle")) && l.apply(f, t), (l = a && f[a]) && l.apply && _(f) && (e.result = l.apply(f, t), !1 === e.result && e.preventDefault());
                return e.type = u, i || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(d.pop(), t) || !_(n) || a && C.isFunction(n[u]) && !C.isWindow(n) && ((r = n[a]) && (n[a] = null), n[C.event.triggered = u](), C.event.triggered = void 0, r && (n[a] = r)), e.result
            }
        },
        simulate: function (e, t, n) {
            e = C.extend(new C.Event, n, {
                type: e,
                isSimulated: !0
            });
            C.event.trigger(e, null, t)
        }
    }), C.fn.extend({
        trigger: function (e, t) {
            return this.each(function () {
                C.event.trigger(e, t, this)
            })
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            return n ? C.event.trigger(e, t, n, !0) : void 0
        }
    }), C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, n) {
        C.fn[n] = function (e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }), C.fn.extend({
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), v.focusin = "onfocusin" in T, v.focusin || C.each({
        focus: "focusin",
        blur: "focusout"
    }, function (n, i) {
        function o(e) {
            C.event.simulate(i, e.target, C.event.fix(e))
        }
        C.event.special[i] = {
            setup: function () {
                var e = this.ownerDocument || this,
                    t = U.access(e, i);
                t || e.addEventListener(n, o, !0), U.access(e, i, (t || 0) + 1)
            },
            teardown: function () {
                var e = this.ownerDocument || this,
                    t = U.access(e, i) - 1;
                t ? U.access(e, i, t) : (e.removeEventListener(n, o, !0), U.remove(e, i))
            }
        }
    });
    var vt = T.location,
        mt = C.now(),
        yt = /\?/;
    C.parseXML = function (e) {
        var t;
        if (!e || "string" != typeof e) return null;
        try {
            t = (new T.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || C.error("Invalid XML: " + e), t
    };
    var wt = /\[\]$/,
        bt = /\r?\n/g,
        xt = /^(?:submit|button|image|reset|file)$/i,
        Tt = /^(?:input|select|textarea|keygen)/i;
    C.param = function (e, t) {
        function n(e, t) {
            t = C.isFunction(t) ? t() : t, o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == t ? "" : t)
        }
        var i, o = [];
        if (C.isArray(e) || e.jquery && !C.isPlainObject(e)) C.each(e, function () {
            n(this.name, this.value)
        });
        else
            for (i in e) ! function n(i, e, o, r) {
                if (C.isArray(e)) C.each(e, function (e, t) {
                    o || wt.test(i) ? r(i, t) : n(i + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, o, r)
                });
                else if (o || "object" !== C.type(e)) r(i, e);
                else
                    for (var t in e) n(i + "[" + t + "]", e[t], o, r)
            }(i, e[i], t, n);
        return o.join("&")
    }, C.fn.extend({
        serialize: function () {
            return C.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var e = C.prop(this, "elements");
                return e ? C.makeArray(e) : this
            }).filter(function () {
                var e = this.type;
                return this.name && !C(this).is(":disabled") && Tt.test(this.nodeName) && !xt.test(e) && (this.checked || !ie.test(e))
            }).map(function (e, t) {
                var n = C(this).val();
                return null == n ? null : C.isArray(n) ? C.map(n, function (e) {
                    return {
                        name: t.name,
                        value: e.replace(bt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(bt, "\r\n")
                }
            }).get()
        }
    });
    var kt = /%20/g,
        Ct = /#.*$/,
        St = /([?&])_=[^&]*/,
        $t = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Et = /^(?:GET|HEAD)$/,
        Dt = /^\/\//,
        At = {},
        Pt = {},
        jt = "*/".concat("*"),
        Ot = k.createElement("a");

    function Mt(r) {
        return function (e, t) {
            "string" != typeof e && (t = e, e = "*");
            var n, i = 0,
                o = e.toLowerCase().match(N) || [];
            if (C.isFunction(t))
                for (; n = o[i++];) "+" === n[0] ? (n = n.slice(1) || "*", (r[n] = r[n] || []).unshift(t)) : (r[n] = r[n] || []).push(t)
        }
    }

    function Lt(t, i, o, r) {
        var s = {},
            a = t === Pt;

        function l(e) {
            var n;
            return s[e] = !0, C.each(t[e] || [], function (e, t) {
                t = t(i, o, r);
                return "string" != typeof t || a || s[t] ? a ? !(n = t) : void 0 : (i.dataTypes.unshift(t), l(t), !1)
            }), n
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }

    function Nt(e, t) {
        var n, i, o = C.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((o[n] ? e : i = i || {})[n] = t[n]);
        return i && C.extend(!0, e, i), e
    }
    Ot.href = vt.href, C.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: vt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(vt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": jt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": C.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (e, t) {
            return t ? Nt(Nt(e, C.ajaxSettings), t) : Nt(C.ajaxSettings, e)
        },
        ajaxPrefilter: Mt(At),
        ajaxTransport: Mt(Pt),
        ajax: function (e, t) {
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var l, c, d, n, u, i, p, f, o, h = C.ajaxSetup({}, t),
                g = h.context || h,
                v = h.context && (g.nodeType || g.jquery) ? C(g) : C.event,
                m = C.Deferred(),
                y = C.Callbacks("once memory"),
                w = h.statusCode || {},
                r = {},
                s = {},
                a = "canceled",
                b = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (p) {
                            if (!n)
                                for (n = {}; t = $t.exec(d);) n[t[1].toLowerCase()] = t[2];
                            t = n[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function () {
                        return p ? d : null
                    },
                    setRequestHeader: function (e, t) {
                        return null == p && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, r[e] = t), this
                    },
                    overrideMimeType: function (e) {
                        return null == p && (h.mimeType = e), this
                    },
                    statusCode: function (e) {
                        if (e)
                            if (p) b.always(e[b.status]);
                            else
                                for (var t in e) w[t] = [w[t], e[t]];
                        return this
                    },
                    abort: function (e) {
                        e = e || a;
                        return l && l.abort(e), x(0, e), this
                    }
                };
            if (m.promise(b), h.url = ((e || h.url || vt.href) + "").replace(Dt, vt.protocol + "//"), h.type = t.method || t.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(N) || [""], null == h.crossDomain) {
                i = k.createElement("a");
                try {
                    i.href = h.url, i.href = i.href, h.crossDomain = Ot.protocol + "//" + Ot.host != i.protocol + "//" + i.host
                } catch (e) {
                    h.crossDomain = !0
                }
            }
            if (h.data && h.processData && "string" != typeof h.data && (h.data = C.param(h.data, h.traditional)), Lt(At, h, t, b), p) return b;
            for (o in (f = C.event && h.global) && 0 == C.active++ && C.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Et.test(h.type), c = h.url.replace(Ct, ""), h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(kt, "+")) : (e = h.url.slice(c.length), h.data && (c += (yt.test(c) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (c = c.replace(St, ""), e = (yt.test(c) ? "&" : "?") + "_=" + mt++ + e), h.url = c + e), h.ifModified && (C.lastModified[c] && b.setRequestHeader("If-Modified-Since", C.lastModified[c]), C.etag[c] && b.setRequestHeader("If-None-Match", C.etag[c])), (h.data && h.hasContent && !1 !== h.contentType || t.contentType) && b.setRequestHeader("Content-Type", h.contentType), b.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + jt + "; q=0.01" : "") : h.accepts["*"]), h.headers) b.setRequestHeader(o, h.headers[o]);
            if (h.beforeSend && (!1 === h.beforeSend.call(g, b, h) || p)) return b.abort();
            if (a = "abort", y.add(h.complete), b.done(h.success), b.fail(h.error), l = Lt(Pt, h, t, b)) {
                if (b.readyState = 1, f && v.trigger("ajaxSend", [b, h]), p) return b;
                h.async && 0 < h.timeout && (u = T.setTimeout(function () {
                    b.abort("timeout")
                }, h.timeout));
                try {
                    p = !1, l.send(r, x)
                } catch (e) {
                    if (p) throw e;
                    x(-1, e)
                }
            } else x(-1, "No Transport");

            function x(e, t, n, i) {
                var o, r, s, a = t;
                p || (p = !0, u && T.clearTimeout(u), l = void 0, d = i || "", b.readyState = 0 < e ? 4 : 0, i = 200 <= e && e < 300 || 304 === e, n && (s = function (e, t, n) {
                    for (var i, o, r, s, a = e.contents, l = e.dataTypes;
                        "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (i)
                        for (o in a)
                            if (a[o] && a[o].test(i)) {
                                l.unshift(o);
                                break
                            } if (l[0] in n) r = l[0];
                    else {
                        for (o in n) {
                            if (!l[0] || e.converters[o + " " + l[0]]) {
                                r = o;
                                break
                            }
                            s = s || o
                        }
                        r = r || s
                    }
                    return r ? (r !== l[0] && l.unshift(r), n[r]) : void 0
                }(h, b, n)), s = function (e, t, n, i) {
                    var o, r, s, a, l, c = {},
                        d = e.dataTypes.slice();
                    if (d[1])
                        for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
                    for (r = d.shift(); r;)
                        if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = d.shift())
                            if ("*" === r) r = l;
                            else if ("*" !== l && l !== r) {
                        if (!(s = c[l + " " + r] || c["* " + r]))
                            for (o in c)
                                if (a = o.split(" "), a[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                                    !0 === s ? s = c[o] : !0 !== c[o] && (r = a[0], d.unshift(a[1]));
                                    break
                                } if (!0 !== s)
                            if (s && e.throws) t = s(t);
                            else try {
                                t = s(t)
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: s ? e : "No conversion from " + l + " to " + r
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(h, s, b, i), i ? (h.ifModified && ((n = b.getResponseHeader("Last-Modified")) && (C.lastModified[c] = n), (n = b.getResponseHeader("etag")) && (C.etag[c] = n)), 204 === e || "HEAD" === h.type ? a = "nocontent" : 304 === e ? a = "notmodified" : (a = s.state, o = s.data, i = !(r = s.error))) : (r = a, !e && a || (a = "error", e < 0 && (e = 0))), b.status = e, b.statusText = (t || a) + "", i ? m.resolveWith(g, [o, a, b]) : m.rejectWith(g, [b, a, r]), b.statusCode(w), w = void 0, f && v.trigger(i ? "ajaxSuccess" : "ajaxError", [b, h, i ? o : r]), y.fireWith(g, [b, a]), f && (v.trigger("ajaxComplete", [b, h]), --C.active || C.event.trigger("ajaxStop")))
            }
            return b
        },
        getJSON: function (e, t, n) {
            return C.get(e, t, n, "json")
        },
        getScript: function (e, t) {
            return C.get(e, void 0, t, "script")
        }
    }), C.each(["get", "post"], function (e, o) {
        C[o] = function (e, t, n, i) {
            return C.isFunction(t) && (i = i || n, n = t, t = void 0), C.ajax(C.extend({
                url: e,
                type: o,
                dataType: i,
                data: t,
                success: n
            }, C.isPlainObject(e) && e))
        }
    }), C._evalUrl = function (e) {
        return C.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }, C.fn.extend({
        wrapAll: function (e) {
            return this[0] && (C.isFunction(e) && (e = e.call(this[0])), e = C(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function () {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function (n) {
            return C.isFunction(n) ? this.each(function (e) {
                C(this).wrapInner(n.call(this, e))
            }) : this.each(function () {
                var e = C(this),
                    t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function (t) {
            var n = C.isFunction(t);
            return this.each(function (e) {
                C(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function (e) {
            return this.parent(e).not("body").each(function () {
                C(this).replaceWith(this.childNodes)
            }), this
        }
    }), C.expr.pseudos.hidden = function (e) {
        return !C.expr.pseudos.visible(e)
    }, C.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, C.ajaxSettings.xhr = function () {
        try {
            return new T.XMLHttpRequest
        } catch (e) {}
    };
    var Ht = {
            0: 200,
            1223: 204
        },
        qt = C.ajaxSettings.xhr();
    v.cors = !!qt && "withCredentials" in qt, v.ajax = qt = !!qt, C.ajaxTransport(function (o) {
        var r, s;
        return v.cors || qt && !o.crossDomain ? {
            send: function (e, t) {
                var n, i = o.xhr();
                if (i.open(o.type, o.url, o.async, o.username, o.password), o.xhrFields)
                    for (n in o.xhrFields) i[n] = o.xhrFields[n];
                for (n in o.mimeType && i.overrideMimeType && i.overrideMimeType(o.mimeType), o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) i.setRequestHeader(n, e[n]);
                r = function (e) {
                    return function () {
                        r && (r = s = i.onload = i.onerror = i.onabort = i.onreadystatechange = null, "abort" === e ? i.abort() : "error" === e ? "number" != typeof i.status ? t(0, "error") : t(i.status, i.statusText) : t(Ht[i.status] || i.status, i.statusText, "text" !== (i.responseType || "text") || "string" != typeof i.responseText ? {
                            binary: i.response
                        } : {
                            text: i.responseText
                        }, i.getAllResponseHeaders()))
                    }
                }, i.onload = r(), s = i.onerror = r("error"), void 0 !== i.onabort ? i.onabort = s : i.onreadystatechange = function () {
                    4 === i.readyState && T.setTimeout(function () {
                        r && s()
                    })
                }, r = r("abort");
                try {
                    i.send(o.hasContent && o.data || null)
                } catch (e) {
                    if (r) throw e
                }
            },
            abort: function () {
                r && r()
            }
        } : void 0
    }), C.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = !1)
    }), C.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (e) {
                return C.globalEval(e), e
            }
        }
    }), C.ajaxPrefilter("script", function (e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), C.ajaxTransport("script", function (n) {
        var i, o;
        if (n.crossDomain) return {
            send: function (e, t) {
                i = C("<script>").prop({
                    charset: n.scriptCharset,
                    src: n.url
                }).on("load error", o = function (e) {
                    i.remove(), o = null, e && t("error" === e.type ? 404 : 200, e.type)
                }), k.head.appendChild(i[0])
            },
            abort: function () {
                o && o()
            }
        }
    });
    var It = [],
        zt = /(=)\?(?=&|$)|\?\?/;

    function Ft(e) {
        return C.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    C.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = It.pop() || C.expando + "_" + mt++;
            return this[e] = !0, e
        }
    }), C.ajaxPrefilter("json jsonp", function (e, t, n) {
        var i, o, r, s = !1 !== e.jsonp && (zt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && zt.test(e.data) && "data");
        return s || "jsonp" === e.dataTypes[0] ? (i = e.jsonpCallback = C.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, s ? e[s] = e[s].replace(zt, "$1" + i) : !1 !== e.jsonp && (e.url += (yt.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), e.converters["script json"] = function () {
            return r || C.error(i + " was not called"), r[0]
        }, e.dataTypes[0] = "json", o = T[i], T[i] = function () {
            r = arguments
        }, n.always(function () {
            void 0 === o ? C(T).removeProp(i) : T[i] = o, e[i] && (e.jsonpCallback = t.jsonpCallback, It.push(i)), r && C.isFunction(o) && o(r[0]), r = o = void 0
        }), "script") : void 0
    }), v.createHTMLDocument = ((t = k.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === t.childNodes.length), C.parseHTML = function (e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (v.createHTMLDocument ? ((i = (t = k.implementation.createHTMLDocument("")).createElement("base")).href = k.location.href, t.head.appendChild(i)) : t = k), i = !n && [], (n = E.exec(e)) ? [t.createElement(n[1])] : (n = de([e], t, i), i && i.length && C(i).remove(), C.merge([], n.childNodes)));
        var i
    }, C.fn.load = function (e, t, n) {
        var i, o, r, s = this,
            a = e.indexOf(" ");
        return -1 < a && (i = C.trim(e.slice(a)), e = e.slice(0, a)), C.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), 0 < s.length && C.ajax({
            url: e,
            type: o || "GET",
            dataType: "html",
            data: t
        }).done(function (e) {
            r = arguments, s.html(i ? C("<div>").append(C.parseHTML(e)).find(i) : e)
        }).always(n && function (e, t) {
            s.each(function () {
                n.apply(this, r || [e.responseText, t, e])
            })
        }), this
    }, C.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        C.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), C.expr.pseudos.animated = function (t) {
        return C.grep(C.timers, function (e) {
            return t === e.elem
        }).length
    }, C.offset = {
        setOffset: function (e, t, n) {
            var i, o, r, s, a = C.css(e, "position"),
                l = C(e),
                c = {};
            "static" === a && (e.style.position = "relative"), r = l.offset(), i = C.css(e, "top"), s = C.css(e, "left"), s = ("absolute" === a || "fixed" === a) && -1 < (i + s).indexOf("auto") ? (o = (a = l.position()).top, a.left) : (o = parseFloat(i) || 0, parseFloat(s) || 0), null != (t = C.isFunction(t) ? t.call(e, n, C.extend({}, r)) : t).top && (c.top = t.top - r.top + o), null != t.left && (c.left = t.left - r.left + s), "using" in t ? t.using.call(e, c) : l.css(c)
        }
    }, C.fn.extend({
        offset: function (t) {
            if (arguments.length) return void 0 === t ? this : this.each(function (e) {
                C.offset.setOffset(this, t, e)
            });
            var e, n, i = this[0];
            return i ? i.getClientRects().length ? (e = i.getBoundingClientRect()).width || e.height ? (i = Ft(n = i.ownerDocument), n = n.documentElement, {
                top: e.top + i.pageYOffset - n.clientTop,
                left: e.left + i.pageXOffset - n.clientLeft
            }) : e : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function () {
            if (this[0]) {
                var e, t, n = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === C.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), i = {
                    top: (i = !C.nodeName(e[0], "html") ? e.offset() : i).top + C.css(e[0], "borderTopWidth", !0),
                    left: i.left + C.css(e[0], "borderLeftWidth", !0)
                }), {
                    top: t.top - i.top - C.css(n, "marginTop", !0),
                    left: t.left - i.left - C.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent; e && "static" === C.css(e, "position");) e = e.offsetParent;
                return e || ue
            })
        }
    }), C.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (t, o) {
        var r = "pageYOffset" === o;
        C.fn[t] = function (e) {
            return R(this, function (e, t, n) {
                var i = Ft(e);
                return void 0 === n ? i ? i[o] : e[t] : void(i ? i.scrollTo(r ? i.pageXOffset : n, r ? n : i.pageYOffset) : e[t] = n)
            }, t, e, arguments.length)
        }
    }), C.each(["top", "left"], function (e, n) {
        C.cssHooks[n] = We(v.pixelPosition, function (e, t) {
            return t ? (t = Fe(e, n), qe.test(t) ? C(e).position()[n] + "px" : t) : void 0
        })
    }), C.each({
        Height: "height",
        Width: "width"
    }, function (s, a) {
        C.each({
            padding: "inner" + s,
            content: a,
            "": "outer" + s
        }, function (i, r) {
            C.fn[r] = function (e, t) {
                var n = arguments.length && (i || "boolean" != typeof e),
                    o = i || (!0 === e || !0 === t ? "margin" : "border");
                return R(this, function (e, t, n) {
                    var i;
                    return C.isWindow(e) ? 0 === r.indexOf("outer") ? e["inner" + s] : e.document.documentElement["client" + s] : 9 === e.nodeType ? (i = e.documentElement, Math.max(e.body["scroll" + s], i["scroll" + s], e.body["offset" + s], i["offset" + s], i["client" + s])) : void 0 === n ? C.css(e, t, o) : C.style(e, t, n, o)
                }, a, n ? e : void 0, n)
            }
        })
    }), C.fn.extend({
        bind: function (e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function (e, t) {
            return this.off(e, null, t)
        },
        delegate: function (e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), C.parseJSON = JSON.parse, "function" == typeof define && define.amd && define("jquery", [], function () {
        return C
    });
    var Wt = T.jQuery,
        _t = T.$;
    return C.noConflict = function (e) {
        return T.$ === C && (T.$ = _t), e && T.jQuery === C && (T.jQuery = Wt), C
    }, e || (T.jQuery = T.$ = C), C
}), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function (e, t, n, i, o) {
            return jQuery.easing[jQuery.easing.def](e, t, n, i, o)
        },
        easeInQuad: function (e, t, n, i, o) {
            return i * (t /= o) * t + n
        },
        easeOutQuad: function (e, t, n, i, o) {
            return -i * (t /= o) * (t - 2) + n
        },
        easeInOutQuad: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t + n : -i / 2 * (--t * (t - 2) - 1) + n
        },
        easeInCubic: function (e, t, n, i, o) {
            return i * (t /= o) * t * t + n
        },
        easeOutCubic: function (e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t + 1) + n
        },
        easeInOutCubic: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t + n : i / 2 * ((t -= 2) * t * t + 2) + n
        },
        easeInQuart: function (e, t, n, i, o) {
            return i * (t /= o) * t * t * t + n
        },
        easeOutQuart: function (e, t, n, i, o) {
            return -i * ((t = t / o - 1) * t * t * t - 1) + n
        },
        easeInOutQuart: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t + n : -i / 2 * ((t -= 2) * t * t * t - 2) + n
        },
        easeInQuint: function (e, t, n, i, o) {
            return i * (t /= o) * t * t * t * t + n
        },
        easeOutQuint: function (e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t * t * t + 1) + n
        },
        easeInOutQuint: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t * t + n : i / 2 * ((t -= 2) * t * t * t * t + 2) + n
        },
        easeInSine: function (e, t, n, i, o) {
            return -i * Math.cos(t / o * (Math.PI / 2)) + i + n
        },
        easeOutSine: function (e, t, n, i, o) {
            return i * Math.sin(t / o * (Math.PI / 2)) + n
        },
        easeInOutSine: function (e, t, n, i, o) {
            return -i / 2 * (Math.cos(Math.PI * t / o) - 1) + n
        },
        easeInExpo: function (e, t, n, i, o) {
            return 0 == t ? n : i * Math.pow(2, 10 * (t / o - 1)) + n
        },
        easeOutExpo: function (e, t, n, i, o) {
            return t == o ? n + i : i * (1 - Math.pow(2, -10 * t / o)) + n
        },
        easeInOutExpo: function (e, t, n, i, o) {
            return 0 == t ? n : t == o ? n + i : (t /= o / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + n : i / 2 * (2 - Math.pow(2, -10 * --t)) + n
        },
        easeInCirc: function (e, t, n, i, o) {
            return -i * (Math.sqrt(1 - (t /= o) * t) - 1) + n
        },
        easeOutCirc: function (e, t, n, i, o) {
            return i * Math.sqrt(1 - (t = t / o - 1) * t) + n
        },
        easeInOutCirc: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + n : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
        },
        easeInElastic: function (e, t, n, i, o) {
            var r = 1.70158,
                s = 0,
                a = i;
            return 0 == t ? n : 1 == (t /= o) ? n + i : (s = s || .3 * o, r = a < Math.abs(i) ? (a = i, s / 4) : s / (2 * Math.PI) * Math.asin(i / a), -(a * Math.pow(2, 10 * --t) * Math.sin((t * o - r) * (2 * Math.PI) / s)) + n)
        },
        easeOutElastic: function (e, t, n, i, o) {
            var r = 1.70158,
                s = 0,
                a = i;
            return 0 == t ? n : 1 == (t /= o) ? n + i : (s = s || .3 * o, r = a < Math.abs(i) ? (a = i, s / 4) : s / (2 * Math.PI) * Math.asin(i / a), a * Math.pow(2, -10 * t) * Math.sin((t * o - r) * (2 * Math.PI) / s) + i + n)
        },
        easeInOutElastic: function (e, t, n, i, o) {
            var r = 1.70158,
                s = 0,
                a = i;
            return 0 == t ? n : 2 == (t /= o / 2) ? n + i : (s = s || o * (.3 * 1.5), r = a < Math.abs(i) ? (a = i, s / 4) : s / (2 * Math.PI) * Math.asin(i / a), t < 1 ? a * Math.pow(2, 10 * --t) * Math.sin((t * o - r) * (2 * Math.PI) / s) * -.5 + n : a * Math.pow(2, -10 * --t) * Math.sin((t * o - r) * (2 * Math.PI) / s) * .5 + i + n)
        },
        easeInBack: function (e, t, n, i, o, r) {
            return i * (t /= o) * t * (((r = null == r ? 1.70158 : r) + 1) * t - r) + n
        },
        easeOutBack: function (e, t, n, i, o, r) {
            return i * ((t = t / o - 1) * t * (((r = null == r ? 1.70158 : r) + 1) * t + r) + 1) + n
        },
        easeInOutBack: function (e, t, n, i, o, r) {
            return null == r && (r = 1.70158), (t /= o / 2) < 1 ? i / 2 * (t * t * ((1 + (r *= 1.525)) * t - r)) + n : i / 2 * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + n
        },
        easeInBounce: function (e, t, n, i, o) {
            return i - jQuery.easing.easeOutBounce(e, o - t, 0, i, o) + n
        },
        easeOutBounce: function (e, t, n, i, o) {
            return (t /= o) < 1 / 2.75 ? i * (7.5625 * t * t) + n : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
        },
        easeInOutBounce: function (e, t, n, i, o) {
            return t < o / 2 ? .5 * jQuery.easing.easeInBounce(e, 2 * t, 0, i, o) + n : .5 * jQuery.easing.easeOutBounce(e, 2 * t - o, 0, i, o) + .5 * i + n
        }
    }),
    function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(function (d) {
        var u, p, i, f = [],
            h = document,
            g = window,
            v = h.documentElement;

        function t() {
            if (f.length) {
                var e, t, n = 0,
                    i = d.map(f, function (e) {
                        var t = e.data.selector,
                            e = e.$element;
                        return t ? e.find(t) : e
                    });
                for (u = u || (t = (t = {
                        height: g.innerHeight,
                        width: g.innerWidth
                    }).height || !(e = h.compatMode) && d.support.boxModel ? t : {
                        height: (e = "CSS1Compat" === e ? v : h.body).clientHeight,
                        width: e.clientWidth
                    }), p = p || {
                        top: g.pageYOffset || v.scrollTop || h.body.scrollTop,
                        left: g.pageXOffset || v.scrollLeft || h.body.scrollLeft
                    }; n < f.length; n++)
                    if (d.contains(v, i[n][0])) {
                        var o = d(i[n]),
                            r = o[0].offsetHeight,
                            s = o[0].offsetWidth,
                            a = o.offset(),
                            l = o.data("inview"),
                            c = o.data("inview-offset") || 0;
                        if (!p || !u) return;
                        a.top + r > p.top + c && a.top - c < p.top + u.height && a.left + s > p.left && a.left < p.left + u.width ? l || o.data("inview", !0).trigger("inview", [!0]) : l && o.data("inview", !1).trigger("inview", [!1])
                    }
            }
        }
        d.event.special.inview = {
            add: function (e) {
                f.push({
                    data: e,
                    $element: d(this),
                    element: this
                }), !i && f.length && (i = setInterval(t, 150))
            },
            remove: function (e) {
                for (var t = 0; t < f.length; t++) {
                    var n = f[t];
                    if (n.element === this && n.data.guid === e.guid) {
                        f.splice(t, 1);
                        break
                    }
                }
                f.length || (clearInterval(i), i = null)
            }
        }, d(g).on("scroll resize scrollstop", function () {
            u = p = null
        }), !v.addEventListener && v.attachEvent && v.attachEvent("onfocusin", function () {
            p = null
        })
    }),
    function (e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(function (c) {
        "use strict";
        var i, s = window.Slick || {};
        i = 0, (s = function (e, t) {
            var n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: c(e),
                appendDots: c(e),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function (e, t) {
                    return c('<button type="button" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, c.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = c(e), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, e = c(e).data("slick") || {}, n.options = c.extend({}, n.defaults, t, e), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = c.proxy(n.autoPlay, n), n.autoPlayClear = c.proxy(n.autoPlayClear, n), n.autoPlayIterator = c.proxy(n.autoPlayIterator, n), n.changeSlide = c.proxy(n.changeSlide, n), n.clickHandler = c.proxy(n.clickHandler, n), n.selectHandler = c.proxy(n.selectHandler, n), n.setPosition = c.proxy(n.setPosition, n), n.swipeHandler = c.proxy(n.swipeHandler, n), n.dragHandler = c.proxy(n.dragHandler, n), n.keyHandler = c.proxy(n.keyHandler, n), n.instanceUid = i++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0)
        }).prototype.activateADA = function () {
            this.$slideTrack.find(".slick-active").attr({
                "aria-hidden": "false"
            }).find("a, input, button, select").attr({
                tabindex: "0"
            })
        }, s.prototype.addSlide = s.prototype.slickAdd = function (e, t, n) {
            var i = this;
            if ("boolean" == typeof t) n = t, t = null;
            else if (t < 0 || t >= i.slideCount) return !1;
            i.unload(), "number" == typeof t ? 0 === t && 0 === i.$slides.length ? c(e).appendTo(i.$slideTrack) : n ? c(e).insertBefore(i.$slides.eq(t)) : c(e).insertAfter(i.$slides.eq(t)) : !0 === n ? c(e).prependTo(i.$slideTrack) : c(e).appendTo(i.$slideTrack), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slides.each(function (e, t) {
                c(t).attr("data-slick-index", e)
            }), i.$slidesCache = i.$slides, i.reinit()
        }, s.prototype.animateHeight = function () {
            var e, t = this;
            1 === t.options.slidesToShow && !0 === t.options.adaptiveHeight && !1 === t.options.vertical && (e = t.$slides.eq(t.currentSlide).outerHeight(!0), t.$list.animate({
                height: e
            }, t.options.speed))
        }, s.prototype.animateSlide = function (e, t) {
            var n = {},
                i = this;
            i.animateHeight(), !0 === i.options.rtl && !1 === i.options.vertical && (e = -e), !1 === i.transformsEnabled ? !1 === i.options.vertical ? i.$slideTrack.animate({
                left: e
            }, i.options.speed, i.options.easing, t) : i.$slideTrack.animate({
                top: e
            }, i.options.speed, i.options.easing, t) : !1 === i.cssTransitions ? (!0 === i.options.rtl && (i.currentLeft = -i.currentLeft), c({
                animStart: i.currentLeft
            }).animate({
                animStart: e
            }, {
                duration: i.options.speed,
                easing: i.options.easing,
                step: function (e) {
                    e = Math.ceil(e), !1 === i.options.vertical ? n[i.animType] = "translate(" + e + "px, 0px)" : n[i.animType] = "translate(0px," + e + "px)", i.$slideTrack.css(n)
                },
                complete: function () {
                    t && t.call()
                }
            })) : (i.applyTransition(), e = Math.ceil(e), !1 === i.options.vertical ? n[i.animType] = "translate3d(" + e + "px, 0px, 0px)" : n[i.animType] = "translate3d(0px," + e + "px, 0px)", i.$slideTrack.css(n), t && setTimeout(function () {
                i.disableTransition(), t.call()
            }, i.options.speed))
        }, s.prototype.getNavTarget = function () {
            var e = this.options.asNavFor;
            return e = e && null !== e ? c(e).not(this.$slider) : e
        }, s.prototype.asNavFor = function (t) {
            var e = this.getNavTarget();
            null !== e && "object" == typeof e && e.each(function () {
                var e = c(this).slick("getSlick");
                e.unslicked || e.slideHandler(t, !0)
            })
        }, s.prototype.applyTransition = function (e) {
            var t = this,
                n = {};
            !1 === t.options.fade ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, (!1 === t.options.fade ? t.$slideTrack : t.$slides.eq(e)).css(n)
        }, s.prototype.autoPlay = function () {
            var e = this;
            e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
        }, s.prototype.autoPlayClear = function () {
            this.autoPlayTimer && clearInterval(this.autoPlayTimer)
        }, s.prototype.autoPlayIterator = function () {
            var e = this,
                t = e.currentSlide + e.options.slidesToScroll;
            e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
        }, s.prototype.buildArrows = function () {
            var e = this;
            !0 === e.options.arrows && (e.$prevArrow = c(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = c(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true",
                tabindex: "-1"
            }))
        }, s.prototype.buildDots = function () {
            var e, t, n = this;
            if (!0 === n.options.dots && n.slideCount > n.options.slidesToShow) {
                for (n.$slider.addClass("slick-dotted"), t = c("<ul />").addClass(n.options.dotsClass), e = 0; e <= n.getDotCount(); e += 1) t.append(c("<li />").append(n.options.customPaging.call(this, n, e)));
                n.$dots = t.appendTo(n.options.appendDots), n.$dots.find("li").first().addClass("slick-active")
            }
        }, s.prototype.buildOut = function () {
            var e = this;
            e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
                c(t).attr("data-slick-index", e).data("originalStyling", c(t).attr("style") || "")
            }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? c('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), c("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable")
        }, s.prototype.buildRows = function () {
            var e, t, n, i = this,
                o = document.createDocumentFragment(),
                r = i.$slider.children();
            if (0 < i.options.rows) {
                for (n = i.options.slidesPerRow * i.options.rows, t = Math.ceil(r.length / n), e = 0; e < t; e++) {
                    for (var s = document.createElement("div"), a = 0; a < i.options.rows; a++) {
                        for (var l = document.createElement("div"), c = 0; c < i.options.slidesPerRow; c++) {
                            var d = e * n + (a * i.options.slidesPerRow + c);
                            r.get(d) && l.appendChild(r.get(d))
                        }
                        s.appendChild(l)
                    }
                    o.appendChild(s)
                }
                i.$slider.empty().append(o), i.$slider.children().children().children().css({
                    width: 100 / i.options.slidesPerRow + "%",
                    display: "inline-block"
                })
            }
        }, s.prototype.checkResponsive = function (e, t) {
            var n, i, o, r = this,
                s = !1,
                a = r.$slider.width(),
                l = window.innerWidth || c(window).width();
            if ("window" === r.respondTo ? o = l : "slider" === r.respondTo ? o = a : "min" === r.respondTo && (o = Math.min(l, a)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
                for (n in i = null, r.breakpoints) r.breakpoints.hasOwnProperty(n) && (!1 === r.originalSettings.mobileFirst ? o < r.breakpoints[n] && (i = r.breakpoints[n]) : o > r.breakpoints[n] && (i = r.breakpoints[n]));
                null !== i ? null !== r.activeBreakpoint && i === r.activeBreakpoint && !t || (r.activeBreakpoint = i, "unslick" === r.breakpointSettings[i] ? r.unslick(i) : (r.options = c.extend({}, r.originalSettings, r.breakpointSettings[i]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), s = i) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), s = i), e || !1 === s || r.$slider.trigger("breakpoint", [r, s])
            }
        }, s.prototype.changeSlide = function (e, t) {
            var n, i = this,
                o = c(e.currentTarget);
            switch (o.is("a") && e.preventDefault(), o.is("li") || (o = o.closest("li")), n = i.slideCount % i.options.slidesToScroll != 0 ? 0 : (i.slideCount - i.currentSlide) % i.options.slidesToScroll, e.data.message) {
                case "previous":
                    r = 0 == n ? i.options.slidesToScroll : i.options.slidesToShow - n, i.slideCount > i.options.slidesToShow && i.slideHandler(i.currentSlide - r, !1, t);
                    break;
                case "next":
                    r = 0 == n ? i.options.slidesToScroll : n, i.slideCount > i.options.slidesToShow && i.slideHandler(i.currentSlide + r, !1, t);
                    break;
                case "index":
                    var r = 0 === e.data.index ? 0 : e.data.index || o.index() * i.options.slidesToScroll;
                    i.slideHandler(i.checkNavigable(r), !1, t), o.children().trigger("focus");
                    break;
                default:
                    return
            }
        }, s.prototype.checkNavigable = function (e) {
            var t = this.getNavigableIndexes(),
                n = 0;
            if (e > t[t.length - 1]) e = t[t.length - 1];
            else
                for (var i in t) {
                    if (e < t[i]) {
                        e = n;
                        break
                    }
                    n = t[i]
                }
            return e
        }, s.prototype.cleanUpEvents = function () {
            var e = this;
            e.options.dots && null !== e.$dots && (c("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", c.proxy(e.interrupt, e, !0)).off("mouseleave.slick", c.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), c(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().off("click.slick", e.selectHandler), c(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), c(window).off("resize.slick.slick-" + e.instanceUid, e.resize), c("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), c(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
        }, s.prototype.cleanUpSlideEvents = function () {
            var e = this;
            e.$list.off("mouseenter.slick", c.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", c.proxy(e.interrupt, e, !1))
        }, s.prototype.cleanUpRows = function () {
            var e;
            0 < this.options.rows && ((e = this.$slides.children().children()).removeAttr("style"), this.$slider.empty().append(e))
        }, s.prototype.clickHandler = function (e) {
            !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
        }, s.prototype.destroy = function (e) {
            var t = this;
            t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), c(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
                c(this).attr("style", c(this).data("originalStyling"))
            }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t])
        }, s.prototype.disableTransition = function (e) {
            var t = {};
            t[this.transitionType] = "", (!1 === this.options.fade ? this.$slideTrack : this.$slides.eq(e)).css(t)
        }, s.prototype.fadeSlide = function (e, t) {
            var n = this;
            !1 === n.cssTransitions ? (n.$slides.eq(e).css({
                zIndex: n.options.zIndex
            }), n.$slides.eq(e).animate({
                opacity: 1
            }, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e).css({
                opacity: 1,
                zIndex: n.options.zIndex
            }), t && setTimeout(function () {
                n.disableTransition(e), t.call()
            }, n.options.speed))
        }, s.prototype.fadeSlideOut = function (e) {
            var t = this;
            !1 === t.cssTransitions ? t.$slides.eq(e).animate({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }))
        }, s.prototype.filterSlides = s.prototype.slickFilter = function (e) {
            var t = this;
            null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
        }, s.prototype.focusHandler = function () {
            var n = this;
            n.$slider.off("focus.slick blur.slick").on("focus.slick", "*", function (e) {
                var t = c(this);
                setTimeout(function () {
                    n.options.pauseOnFocus && t.is(":focus") && (n.focussed = !0, n.autoPlay())
                }, 0)
            }).on("blur.slick", "*", function (e) {
                c(this);
                n.options.pauseOnFocus && (n.focussed = !1, n.autoPlay())
            })
        }, s.prototype.getCurrent = s.prototype.slickCurrentSlide = function () {
            return this.currentSlide
        }, s.prototype.getDotCount = function () {
            var e = this,
                t = 0,
                n = 0,
                i = 0;
            if (!0 === e.options.infinite)
                if (e.slideCount <= e.options.slidesToShow) ++i;
                else
                    for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else if (!0 === e.options.centerMode) i = e.slideCount;
            else if (e.options.asNavFor)
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else i = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
            return i - 1
        }, s.prototype.getLeft = function (e) {
            var t, n, i = this,
                o = 0;
            return i.slideOffset = 0, t = i.$slides.first().outerHeight(!0), !0 === i.options.infinite ? (i.slideCount > i.options.slidesToShow && (i.slideOffset = i.slideWidth * i.options.slidesToShow * -1, n = -1, !0 === i.options.vertical && !0 === i.options.centerMode && (2 === i.options.slidesToShow ? n = -1.5 : 1 === i.options.slidesToShow && (n = -2)), o = t * i.options.slidesToShow * n), i.slideCount % i.options.slidesToScroll != 0 && e + i.options.slidesToScroll > i.slideCount && i.slideCount > i.options.slidesToShow && (o = e > i.slideCount ? (i.slideOffset = (i.options.slidesToShow - (e - i.slideCount)) * i.slideWidth * -1, (i.options.slidesToShow - (e - i.slideCount)) * t * -1) : (i.slideOffset = i.slideCount % i.options.slidesToScroll * i.slideWidth * -1, i.slideCount % i.options.slidesToScroll * t * -1))) : e + i.options.slidesToShow > i.slideCount && (i.slideOffset = (e + i.options.slidesToShow - i.slideCount) * i.slideWidth, o = (e + i.options.slidesToShow - i.slideCount) * t), i.slideCount <= i.options.slidesToShow && (o = i.slideOffset = 0), !0 === i.options.centerMode && i.slideCount <= i.options.slidesToShow ? i.slideOffset = i.slideWidth * Math.floor(i.options.slidesToShow) / 2 - i.slideWidth * i.slideCount / 2 : !0 === i.options.centerMode && !0 === i.options.infinite ? i.slideOffset += i.slideWidth * Math.floor(i.options.slidesToShow / 2) - i.slideWidth : !0 === i.options.centerMode && (i.slideOffset = 0, i.slideOffset += i.slideWidth * Math.floor(i.options.slidesToShow / 2)), t = !1 === i.options.vertical ? e * i.slideWidth * -1 + i.slideOffset : e * t * -1 + o, !0 === i.options.variableWidth && (o = i.slideCount <= i.options.slidesToShow || !1 === i.options.infinite ? i.$slideTrack.children(".slick-slide").eq(e) : i.$slideTrack.children(".slick-slide").eq(e + i.options.slidesToShow), t = !0 === i.options.rtl ? o[0] ? -1 * (i.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === i.options.centerMode && (o = i.slideCount <= i.options.slidesToShow || !1 === i.options.infinite ? i.$slideTrack.children(".slick-slide").eq(e) : i.$slideTrack.children(".slick-slide").eq(e + i.options.slidesToShow + 1), t = !0 === i.options.rtl ? o[0] ? -1 * (i.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, t += (i.$list.width() - o.outerWidth()) / 2)), t
        }, s.prototype.getOption = s.prototype.slickGetOption = function (e) {
            return this.options[e]
        }, s.prototype.getNavigableIndexes = function () {
            for (var e = this, t = 0, n = 0, i = [], o = !1 === e.options.infinite ? e.slideCount : (t = -1 * e.options.slidesToScroll, n = -1 * e.options.slidesToScroll, 2 * e.slideCount); t < o;) i.push(t), t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            return i
        }, s.prototype.getSlick = function () {
            return this
        }, s.prototype.getSlideCount = function () {
            var o, r = this,
                e = !0 === r.options.centerMode ? Math.floor(r.$list.width() / 2) : 0,
                s = -1 * r.swipeLeft + e;
            return !0 === r.options.swipeToSlide ? (r.$slideTrack.find(".slick-slide").each(function (e, t) {
                var n = c(t).outerWidth(),
                    i = t.offsetLeft;
                if (!0 !== r.options.centerMode && (i += n / 2), s < i + n) return o = t, !1
            }), Math.abs(c(o).attr("data-slick-index") - r.currentSlide) || 1) : r.options.slidesToScroll
        }, s.prototype.goTo = s.prototype.slickGoTo = function (e, t) {
            this.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(e)
                }
            }, t)
        }, s.prototype.init = function (e) {
            var t = this;
            c(t.$slider).hasClass("slick-initialized") || (c(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay())
        }, s.prototype.initADA = function () {
            var n = this,
                i = Math.ceil(n.slideCount / n.options.slidesToShow),
                o = n.getNavigableIndexes().filter(function (e) {
                    return 0 <= e && e < n.slideCount
                });
            n.$slides.add(n.$slideTrack.find(".slick-cloned")).attr({
                "aria-hidden": "true",
                tabindex: "-1"
            }).find("a, input, button, select").attr({
                tabindex: "-1"
            }), null !== n.$dots && (n.$slides.not(n.$slideTrack.find(".slick-cloned")).each(function (e) {
                var t = o.indexOf(e);
                c(this).attr({
                    role: "tabpanel",
                    id: "slick-slide" + n.instanceUid + e,
                    tabindex: -1
                }), -1 !== t && (t = "slick-slide-control" + n.instanceUid + t, c("#" + t).length && c(this).attr({
                    "aria-describedby": t
                }))
            }), n.$dots.attr("role", "tablist").find("li").each(function (e) {
                var t = o[e];
                c(this).attr({
                    role: "presentation"
                }), c(this).find("button").first().attr({
                    role: "tab",
                    id: "slick-slide-control" + n.instanceUid + e,
                    "aria-controls": "slick-slide" + n.instanceUid + t,
                    "aria-label": e + 1 + " of " + i,
                    "aria-selected": null,
                    tabindex: "-1"
                })
            }).eq(n.currentSlide).find("button").attr({
                "aria-selected": "true",
                tabindex: "0"
            }).end());
            for (var e = n.currentSlide, t = e + n.options.slidesToShow; e < t; e++) n.options.focusOnChange ? n.$slides.eq(e).attr({
                tabindex: "0"
            }) : n.$slides.eq(e).removeAttr("tabindex");
            n.activateADA()
        }, s.prototype.initArrowEvents = function () {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
                message: "previous"
            }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
                message: "next"
            }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
        }, s.prototype.initDotEvents = function () {
            var e = this;
            !0 === e.options.dots && e.slideCount > e.options.slidesToShow && (c("li", e.$dots).on("click.slick", {
                message: "index"
            }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && e.slideCount > e.options.slidesToShow && c("li", e.$dots).on("mouseenter.slick", c.proxy(e.interrupt, e, !0)).on("mouseleave.slick", c.proxy(e.interrupt, e, !1))
        }, s.prototype.initSlideEvents = function () {
            var e = this;
            e.options.pauseOnHover && (e.$list.on("mouseenter.slick", c.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", c.proxy(e.interrupt, e, !1)))
        }, s.prototype.initializeEvents = function () {
            var e = this;
            e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
                action: "start"
            }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
                action: "move"
            }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), c(document).on(e.visibilityChange, c.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler), c(window).on("orientationchange.slick.slick-" + e.instanceUid, c.proxy(e.orientationChange, e)), c(window).on("resize.slick.slick-" + e.instanceUid, c.proxy(e.resize, e)), c("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), c(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), c(e.setPosition)
        }, s.prototype.initUI = function () {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
        }, s.prototype.keyHandler = function (e) {
            var t = this;
            e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
                data: {
                    message: !0 === t.options.rtl ? "next" : "previous"
                }
            }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
                data: {
                    message: !0 === t.options.rtl ? "previous" : "next"
                }
            }))
        }, s.prototype.lazyLoad = function () {
            var e, t, n, r = this;

            function i(e) {
                c("img[data-lazy]", e).each(function () {
                    var e = c(this),
                        t = c(this).attr("data-lazy"),
                        n = c(this).attr("data-srcset"),
                        i = c(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
                        o = document.createElement("img");
                    o.onload = function () {
                        e.animate({
                            opacity: 0
                        }, 100, function () {
                            n && (e.attr("srcset", n), i && e.attr("sizes", i)), e.attr("src", t).animate({
                                opacity: 1
                            }, 200, function () {
                                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                            }), r.$slider.trigger("lazyLoaded", [r, e, t])
                        })
                    }, o.onerror = function () {
                        e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, e, t])
                    }, o.src = t
                })
            }
            if (!0 === r.options.centerMode ? n = !0 === r.options.infinite ? (t = r.currentSlide + (r.options.slidesToShow / 2 + 1)) + r.options.slidesToShow + 2 : (t = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)), r.options.slidesToShow / 2 + 1 + 2 + r.currentSlide) : (t = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide, n = Math.ceil(t + r.options.slidesToShow), !0 === r.options.fade && (0 < t && t--, n <= r.slideCount && n++)), e = r.$slider.find(".slick-slide").slice(t, n), "anticipated" === r.options.lazyLoad)
                for (var o = t - 1, s = n, a = r.$slider.find(".slick-slide"), l = 0; l < r.options.slidesToScroll; l++) o < 0 && (o = r.slideCount - 1), e = (e = e.add(a.eq(o))).add(a.eq(s)), o--, s++;
            i(e), r.slideCount <= r.options.slidesToShow ? i(r.$slider.find(".slick-slide")) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? i(r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow)) : 0 === r.currentSlide && i(r.$slider.find(".slick-cloned").slice(-1 * r.options.slidesToShow))
        }, s.prototype.loadSlider = function () {
            var e = this;
            e.setPosition(), e.$slideTrack.css({
                opacity: 1
            }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
        }, s.prototype.next = s.prototype.slickNext = function () {
            this.changeSlide({
                data: {
                    message: "next"
                }
            })
        }, s.prototype.orientationChange = function () {
            this.checkResponsive(), this.setPosition()
        }, s.prototype.pause = s.prototype.slickPause = function () {
            this.autoPlayClear(), this.paused = !0
        }, s.prototype.play = s.prototype.slickPlay = function () {
            var e = this;
            e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
        }, s.prototype.postSlide = function (e) {
            var t = this;
            t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && c(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
        }, s.prototype.prev = s.prototype.slickPrev = function () {
            this.changeSlide({
                data: {
                    message: "previous"
                }
            })
        }, s.prototype.preventDefault = function (e) {
            e.preventDefault()
        }, s.prototype.progressiveLazyLoad = function (e) {
            e = e || 1;
            var t, n, i, o, r = this,
                s = c("img[data-lazy]", r.$slider);
            s.length ? (t = s.first(), n = t.attr("data-lazy"), i = t.attr("data-srcset"), o = t.attr("data-sizes") || r.$slider.attr("data-sizes"), (s = document.createElement("img")).onload = function () {
                i && (t.attr("srcset", i), o && t.attr("sizes", o)), t.attr("src", n).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === r.options.adaptiveHeight && r.setPosition(), r.$slider.trigger("lazyLoaded", [r, t, n]), r.progressiveLazyLoad()
            }, s.onerror = function () {
                e < 3 ? setTimeout(function () {
                    r.progressiveLazyLoad(e + 1)
                }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, t, n]), r.progressiveLazyLoad())
            }, s.src = n) : r.$slider.trigger("allImagesLoaded", [r])
        }, s.prototype.refresh = function (e) {
            var t = this,
                n = t.slideCount - t.options.slidesToShow;
            !t.options.infinite && t.currentSlide > n && (t.currentSlide = n), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), n = t.currentSlide, t.destroy(!0), c.extend(t, t.initials, {
                currentSlide: n
            }), t.init(), e || t.changeSlide({
                data: {
                    message: "index",
                    index: n
                }
            }, !1)
        }, s.prototype.registerBreakpoints = function () {
            var e, t, n, i = this,
                o = i.options.responsive || null;
            if ("array" === c.type(o) && o.length) {
                for (e in i.respondTo = i.options.respondTo || "window", o)
                    if (n = i.breakpoints.length - 1, o.hasOwnProperty(e)) {
                        for (t = o[e].breakpoint; 0 <= n;) i.breakpoints[n] && i.breakpoints[n] === t && i.breakpoints.splice(n, 1), n--;
                        i.breakpoints.push(t), i.breakpointSettings[t] = o[e].settings
                    } i.breakpoints.sort(function (e, t) {
                    return i.options.mobileFirst ? e - t : t - e
                })
            }
        }, s.prototype.reinit = function () {
            var e = this;
            e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
        }, s.prototype.resize = function () {
            var e = this;
            c(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
                e.windowWidth = c(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
            }, 50))
        }, s.prototype.removeSlide = s.prototype.slickRemove = function (e, t, n) {
            var i = this;
            if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : i.slideCount - 1 : !0 === t ? --e : e, i.slideCount < 1 || e < 0 || e > i.slideCount - 1) return !1;
            i.unload(), (!0 === n ? i.$slideTrack.children() : i.$slideTrack.children(this.options.slide).eq(e)).remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, i.reinit()
        }, s.prototype.setCSS = function (e) {
            var t, n, i = this,
                o = {};
            !0 === i.options.rtl && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", o[i.positionProp] = e, !1 === i.transformsEnabled || (!(o = {}) === i.cssTransitions ? o[i.animType] = "translate(" + t + ", " + n + ")" : o[i.animType] = "translate3d(" + t + ", " + n + ", 0px)"), i.$slideTrack.css(o)
        }, s.prototype.setDimensions = function () {
            var e = this;
            !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
                padding: "0px " + e.options.centerPadding
            }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
                padding: e.options.centerPadding + " 0px"
            })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
            var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
            !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
        }, s.prototype.setFade = function () {
            var n, i = this;
            i.$slides.each(function (e, t) {
                n = i.slideWidth * e * -1, !0 === i.options.rtl ? c(t).css({
                    position: "relative",
                    right: n,
                    top: 0,
                    zIndex: i.options.zIndex - 2,
                    opacity: 0
                }) : c(t).css({
                    position: "relative",
                    left: n,
                    top: 0,
                    zIndex: i.options.zIndex - 2,
                    opacity: 0
                })
            }), i.$slides.eq(i.currentSlide).css({
                zIndex: i.options.zIndex - 1,
                opacity: 1
            })
        }, s.prototype.setHeight = function () {
            var e, t = this;
            1 === t.options.slidesToShow && !0 === t.options.adaptiveHeight && !1 === t.options.vertical && (e = t.$slides.eq(t.currentSlide).outerHeight(!0), t.$list.css("height", e))
        }, s.prototype.setOption = s.prototype.slickSetOption = function () {
            var e, t, n, i, o, r = this,
                s = !1;
            if ("object" === c.type(arguments[0]) ? (n = arguments[0], s = arguments[1], o = "multiple") : "string" === c.type(arguments[0]) && (n = arguments[0], i = arguments[1], s = arguments[2], "responsive" === arguments[0] && "array" === c.type(arguments[1]) ? o = "responsive" : void 0 !== arguments[1] && (o = "single")), "single" === o) r.options[n] = i;
            else if ("multiple" === o) c.each(n, function (e, t) {
                r.options[e] = t
            });
            else if ("responsive" === o)
                for (t in i)
                    if ("array" !== c.type(r.options.responsive)) r.options.responsive = [i[t]];
                    else {
                        for (e = r.options.responsive.length - 1; 0 <= e;) r.options.responsive[e].breakpoint === i[t].breakpoint && r.options.responsive.splice(e, 1), e--;
                        r.options.responsive.push(i[t])
                    } s && (r.unload(), r.reinit())
        }, s.prototype.setPosition = function () {
            var e = this;
            e.setDimensions(), e.setHeight(), !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
        }, s.prototype.setProps = function () {
            var e = this,
                t = document.body.style;
            e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
        }, s.prototype.setSlideClasses = function (e) {
            var t, n, i, o = this,
                r = o.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true");
            o.$slides.eq(e).addClass("slick-current"), !0 === o.options.centerMode ? (n = o.options.slidesToShow % 2 == 0 ? 1 : 0, i = Math.floor(o.options.slidesToShow / 2), !0 === o.options.infinite && (i <= e && e <= o.slideCount - 1 - i ? o.$slides.slice(e - i + n, e + i + 1).addClass("slick-active").attr("aria-hidden", "false") : (t = o.options.slidesToShow + e, r.slice(t - i + 1 + n, t + i + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? r.eq(r.length - 1 - o.options.slidesToShow).addClass("slick-center") : e === o.slideCount - 1 && r.eq(o.options.slidesToShow).addClass("slick-center")), o.$slides.eq(e).addClass("slick-center")) : 0 <= e && e <= o.slideCount - o.options.slidesToShow ? o.$slides.slice(e, e + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : r.length <= o.options.slidesToShow ? r.addClass("slick-active").attr("aria-hidden", "false") : (i = o.slideCount % o.options.slidesToShow, t = !0 === o.options.infinite ? o.options.slidesToShow + e : e, (o.options.slidesToShow == o.options.slidesToScroll && o.slideCount - e < o.options.slidesToShow ? r.slice(t - (o.options.slidesToShow - i), t + i) : r.slice(t, t + o.options.slidesToShow)).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" !== o.options.lazyLoad && "anticipated" !== o.options.lazyLoad || o.lazyLoad()
        }, s.prototype.setupInfinite = function () {
            var e, t, n, i = this;
            if (!0 === i.options.fade && (i.options.centerMode = !1), !0 === i.options.infinite && !1 === i.options.fade && (t = null, i.slideCount > i.options.slidesToShow)) {
                for (n = !0 === i.options.centerMode ? i.options.slidesToShow + 1 : i.options.slidesToShow, e = i.slideCount; e > i.slideCount - n; --e) t = e - 1, c(i.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - i.slideCount).prependTo(i.$slideTrack).addClass("slick-cloned");
                for (e = 0; e < n + i.slideCount; e += 1) t = e, c(i.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + i.slideCount).appendTo(i.$slideTrack).addClass("slick-cloned");
                i.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
                    c(this).attr("id", "")
                })
            }
        }, s.prototype.interrupt = function (e) {
            e || this.autoPlay(), this.interrupted = e
        }, s.prototype.selectHandler = function (e) {
            e = c(e.target).is(".slick-slide") ? c(e.target) : c(e.target).parents(".slick-slide"), e = (e = parseInt(e.attr("data-slick-index"))) || 0;
            this.slideCount <= this.options.slidesToShow ? this.slideHandler(e, !1, !0) : this.slideHandler(e)
        }, s.prototype.slideHandler = function (e, t, n) {
            var i, o, r, s, a = this;
            if (t = t || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === e))
                if (!1 === t && a.asNavFor(e), i = e, r = a.getLeft(i), t = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? t : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (e < 0 || e > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (i = a.currentSlide, !0 !== n && a.slideCount > a.options.slidesToShow ? a.animateSlide(t, function () {
                    a.postSlide(i)
                }) : a.postSlide(i));
                else if (!1 === a.options.infinite && !0 === a.options.centerMode && (e < 0 || e > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (i = a.currentSlide, !0 !== n && a.slideCount > a.options.slidesToShow ? a.animateSlide(t, function () {
                a.postSlide(i)
            }) : a.postSlide(i));
            else {
                if (a.options.autoplay && clearInterval(a.autoPlayTimer), o = i < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + i : i >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : i - a.slideCount : i, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, o]), t = a.currentSlide, a.currentSlide = o, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (s = (s = a.getNavTarget()).slick("getSlick")).slideCount <= s.options.slidesToShow && s.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== n ? (a.fadeSlideOut(t), a.fadeSlide(o, function () {
                    a.postSlide(o)
                })) : a.postSlide(o), void a.animateHeight();
                !0 !== n && a.slideCount > a.options.slidesToShow ? a.animateSlide(r, function () {
                    a.postSlide(o)
                }) : a.postSlide(o)
            }
        }, s.prototype.startLoad = function () {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
        }, s.prototype.swipeDirection = function () {
            var e = this,
                t = e.touchObject.startX - e.touchObject.curX,
                n = e.touchObject.startY - e.touchObject.curY,
                t = Math.atan2(n, t),
                t = Math.round(180 * t / Math.PI);
            return (t = t < 0 ? 360 - Math.abs(t) : t) <= 45 && 0 <= t || t <= 360 && 315 <= t ? !1 === e.options.rtl ? "left" : "right" : 135 <= t && t <= 225 ? !1 === e.options.rtl ? "right" : "left" : !0 === e.options.verticalSwiping ? 35 <= t && t <= 135 ? "down" : "up" : "vertical"
        }, s.prototype.swipeEnd = function (e) {
            var t, n, i = this;
            if (i.dragging = !1, i.swiping = !1, i.scrolling) return i.scrolling = !1;
            if (i.interrupted = !1, i.shouldClick = !(10 < i.touchObject.swipeLength), void 0 === i.touchObject.curX) return !1;
            if (!0 === i.touchObject.edgeHit && i.$slider.trigger("edge", [i, i.swipeDirection()]), i.touchObject.swipeLength >= i.touchObject.minSwipe) {
                switch (n = i.swipeDirection()) {
                    case "left":
                    case "down":
                        t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide + i.getSlideCount()) : i.currentSlide + i.getSlideCount(), i.currentDirection = 0;
                        break;
                    case "right":
                    case "up":
                        t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide - i.getSlideCount()) : i.currentSlide - i.getSlideCount(), i.currentDirection = 1
                }
                "vertical" != n && (i.slideHandler(t), i.touchObject = {}, i.$slider.trigger("swipe", [i, n]))
            } else i.touchObject.startX !== i.touchObject.curX && (i.slideHandler(i.currentSlide), i.touchObject = {})
        }, s.prototype.swipeHandler = function (e) {
            var t = this;
            if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
                case "start":
                    t.swipeStart(e);
                    break;
                case "move":
                    t.swipeMove(e);
                    break;
                case "end":
                    t.swipeEnd(e)
            }
        }, s.prototype.swipeMove = function (e) {
            var t, n, i = this,
                o = void 0 !== e.originalEvent ? e.originalEvent.touches : null;
            return !(!i.dragging || i.scrolling || o && 1 !== o.length) && (t = i.getLeft(i.currentSlide), i.touchObject.curX = void 0 !== o ? o[0].pageX : e.clientX, i.touchObject.curY = void 0 !== o ? o[0].pageY : e.clientY, i.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(i.touchObject.curX - i.touchObject.startX, 2))), n = Math.round(Math.sqrt(Math.pow(i.touchObject.curY - i.touchObject.startY, 2))), !i.options.verticalSwiping && !i.swiping && 4 < n ? !(i.scrolling = !0) : (!0 === i.options.verticalSwiping && (i.touchObject.swipeLength = n), o = i.swipeDirection(), void 0 !== e.originalEvent && 4 < i.touchObject.swipeLength && (i.swiping = !0, e.preventDefault()), n = (!1 === i.options.rtl ? 1 : -1) * (i.touchObject.curX > i.touchObject.startX ? 1 : -1), !0 === i.options.verticalSwiping && (n = i.touchObject.curY > i.touchObject.startY ? 1 : -1), e = i.touchObject.swipeLength, (i.touchObject.edgeHit = !1) === i.options.infinite && (0 === i.currentSlide && "right" === o || i.currentSlide >= i.getDotCount() && "left" === o) && (e = i.touchObject.swipeLength * i.options.edgeFriction, i.touchObject.edgeHit = !0), !1 === i.options.vertical ? i.swipeLeft = t + e * n : i.swipeLeft = t + e * (i.$list.height() / i.listWidth) * n, !0 === i.options.verticalSwiping && (i.swipeLeft = t + e * n), !0 !== i.options.fade && !1 !== i.options.touchMove && (!0 === i.animating ? (i.swipeLeft = null, !1) : void i.setCSS(i.swipeLeft))))
        }, s.prototype.swipeStart = function (e) {
            var t, n = this;
            if (n.interrupted = !0, 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow) return !(n.touchObject = {});
            void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, n.dragging = !0
        }, s.prototype.unfilterSlides = s.prototype.slickUnfilter = function () {
            var e = this;
            null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
        }, s.prototype.unload = function () {
            var e = this;
            c(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
        }, s.prototype.unslick = function (e) {
            this.$slider.trigger("unslick", [this, e]), this.destroy()
        }, s.prototype.updateArrows = function () {
            var e = this;
            Math.floor(e.options.slidesToShow / 2);
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : (e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode || e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode) && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
        }, s.prototype.updateDots = function () {
            var e = this;
            null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
        }, s.prototype.visibility = function () {
            this.options.autoplay && (document[this.hidden] ? this.interrupted = !0 : this.interrupted = !1)
        }, c.fn.slick = function () {
            for (var e, t = this, n = arguments[0], i = Array.prototype.slice.call(arguments, 1), o = t.length, r = 0; r < o; r++)
                if ("object" == typeof n || void 0 === n ? t[r].slick = new s(t[r], n) : e = t[r].slick[n].apply(t[r].slick, i), void 0 !== e) return e;
            return t
        }
    }),
    function (t, n) {
        "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function (e) {
            return n(t, e)
        }) : "object" == typeof module && module.exports ? module.exports = n(t, require("jquery")) : t.jQueryBridget = n(t, t.jQuery)
    }(window, function (e, t) {
        "use strict";
        var n = Array.prototype.slice,
            i = e.console,
            u = void 0 === i ? function () {} : function (e) {
                i.error(e)
            };

        function o(l, c, d) {
            (d = d || t || e.jQuery) && (c.prototype.option || (c.prototype.option = function (e) {
                d.isPlainObject(e) && (this.options = d.extend(!0, this.options, e))
            }), d.fn[l] = function (e) {
                if ("string" != typeof e) return r = e, this.each(function (e, t) {
                    var n = d.data(t, l);
                    n ? (n.option(r), n._init()) : (n = new c(t, r), d.data(t, l, n))
                }), this;
                var i, o, r, s = n.call(arguments, 1),
                    a = "$()." + l + '("' + (i = e) + '")';
                return (e = this).each(function (e, t) {
                    var n = d.data(t, l);
                    n ? (t = n[i]) && "_" != i.charAt(0) ? (n = t.apply(n, s), o = void 0 === o ? n : o) : u(a + " is not a valid method") : u(l + " not initialized. Cannot call methods, i.e. " + a)
                }), void 0 !== o ? o : e
            }, r(d))
        }

        function r(e) {
            !e || e && e.bridget || (e.bridget = o)
        }
        return r(t || e.jQuery), o
    }),
    function (e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("get-size/get-size", [], t) : "object" == typeof module && module.exports ? module.exports = t() : e.getSize = t()
    }(window, function () {
        "use strict";

        function f(e) {
            var t = parseFloat(e);
            return -1 == e.indexOf("%") && !isNaN(t) && t
        }
        var t = "undefined" == typeof console ? function () {} : function (e) {
                console.error(e)
            },
            h = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
            g = h.length;

        function v(e) {
            e = getComputedStyle(e);
            return e || t("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
        }
        var m, y = !1;

        function w(e) {
            if (y || (y = !0, (p = document.createElement("div")).style.width = "200px", p.style.padding = "1px 2px 3px 4px", p.style.borderStyle = "solid", p.style.borderWidth = "1px 2px 3px 4px", p.style.boxSizing = "border-box", (u = document.body || document.documentElement).appendChild(p), d = v(p), w.isBoxSizeOuter = m = 200 == f(d.width), u.removeChild(p)), (e = "string" == typeof e ? document.querySelector(e) : e) && "object" == typeof e && e.nodeType) {
                var t = v(e);
                if ("none" == t.display) return function () {
                    for (var e = {
                            width: 0,
                            height: 0,
                            innerWidth: 0,
                            innerHeight: 0,
                            outerWidth: 0,
                            outerHeight: 0
                        }, t = 0; t < g; t++) e[h[t]] = 0;
                    return e
                }();
                var n = {};
                n.width = e.offsetWidth, n.height = e.offsetHeight;
                for (var i = n.isBorderBox = "border-box" == t.boxSizing, o = 0; o < g; o++) {
                    var r = h[o],
                        s = t[r],
                        s = parseFloat(s);
                    n[r] = isNaN(s) ? 0 : s
                }
                var a = n.paddingLeft + n.paddingRight,
                    l = n.paddingTop + n.paddingBottom,
                    c = n.marginLeft + n.marginRight,
                    d = n.marginTop + n.marginBottom,
                    u = n.borderLeftWidth + n.borderRightWidth,
                    p = n.borderTopWidth + n.borderBottomWidth,
                    e = i && m,
                    i = f(t.width);
                !1 !== i && (n.width = i + (e ? 0 : a + u));
                i = f(t.height);
                return !1 !== i && (n.height = i + (e ? 0 : l + p)), n.innerWidth = n.width - (a + u), n.innerHeight = n.height - (l + p), n.outerWidth = n.width + c, n.outerHeight = n.height + d, n
            }
            var p, u, d
        }
        return w
    }),
    function (e, t) {
        "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
    }("undefined" != typeof window ? window : this, function () {
        function e() {}
        var t = e.prototype;
        return t.on = function (e, t) {
            if (e && t) {
                var n = this._events = this._events || {},
                    e = n[e] = n[e] || [];
                return -1 == e.indexOf(t) && e.push(t), this
            }
        }, t.once = function (e, t) {
            if (e && t) {
                this.on(e, t);
                var n = this._onceEvents = this._onceEvents || {};
                return (n[e] = n[e] || {})[t] = !0, this
            }
        }, t.off = function (e, t) {
            e = this._events && this._events[e];
            if (e && e.length) {
                t = e.indexOf(t);
                return -1 != t && e.splice(t, 1), this
            }
        }, t.emitEvent = function (e, t) {
            var n = this._events && this._events[e];
            if (n && n.length) {
                n = n.slice(0), t = t || [];
                for (var i = this._onceEvents && this._onceEvents[e], o = 0; o < n.length; o++) {
                    var r = n[o];
                    i && i[r] && (this.off(e, r), delete i[r]), r.apply(this, t)
                }
                return this
            }
        }, t.allOff = function () {
            delete this._events, delete this._onceEvents
        }, e
    }),
    function (t, n) {
        "function" == typeof define && define.amd ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function (e) {
            return n(t, e)
        }) : "object" == typeof module && module.exports ? module.exports = n(t, require("ev-emitter")) : t.Unipointer = n(t, t.EvEmitter)
    }(window, function (i, e) {
        function t() {}
        e = t.prototype = Object.create(e.prototype);
        e.bindStartEvent = function (e) {
            this._bindStartEvent(e, !0)
        }, e.unbindStartEvent = function (e) {
            this._bindStartEvent(e, !1)
        }, e._bindStartEvent = function (e, t) {
            var n = (t = void 0 === t || t) ? "addEventListener" : "removeEventListener",
                t = "mousedown";
            i.PointerEvent ? t = "pointerdown" : "ontouchstart" in i && (t = "touchstart"), e[n](t, this)
        }, e.handleEvent = function (e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, e.getTouch = function (e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                if (n.identifier == this.pointerIdentifier) return n
            }
        }, e.onmousedown = function (e) {
            var t = e.button;
            t && 0 !== t && 1 !== t || this._pointerDown(e, e)
        }, e.ontouchstart = function (e) {
            this._pointerDown(e, e.changedTouches[0])
        }, e.onpointerdown = function (e) {
            this._pointerDown(e, e)
        }, e._pointerDown = function (e, t) {
            e.button || this.isPointerDown || (this.isPointerDown = !0, this.pointerIdentifier = void 0 !== t.pointerId ? t.pointerId : t.identifier, this.pointerDown(e, t))
        }, e.pointerDown = function (e, t) {
            this._bindPostStartEvents(e), this.emitEvent("pointerDown", [e, t])
        };
        var n = {
            mousedown: ["mousemove", "mouseup"],
            touchstart: ["touchmove", "touchend", "touchcancel"],
            pointerdown: ["pointermove", "pointerup", "pointercancel"]
        };
        return e._bindPostStartEvents = function (e) {
            e && ((e = n[e.type]).forEach(function (e) {
                i.addEventListener(e, this)
            }, this), this._boundPointerEvents = e)
        }, e._unbindPostStartEvents = function () {
            this._boundPointerEvents && (this._boundPointerEvents.forEach(function (e) {
                i.removeEventListener(e, this)
            }, this), delete this._boundPointerEvents)
        }, e.onmousemove = function (e) {
            this._pointerMove(e, e)
        }, e.onpointermove = function (e) {
            e.pointerId == this.pointerIdentifier && this._pointerMove(e, e)
        }, e.ontouchmove = function (e) {
            var t = this.getTouch(e.changedTouches);
            t && this._pointerMove(e, t)
        }, e._pointerMove = function (e, t) {
            this.pointerMove(e, t)
        }, e.pointerMove = function (e, t) {
            this.emitEvent("pointerMove", [e, t])
        }, e.onmouseup = function (e) {
            this._pointerUp(e, e)
        }, e.onpointerup = function (e) {
            e.pointerId == this.pointerIdentifier && this._pointerUp(e, e)
        }, e.ontouchend = function (e) {
            var t = this.getTouch(e.changedTouches);
            t && this._pointerUp(e, t)
        }, e._pointerUp = function (e, t) {
            this._pointerDone(), this.pointerUp(e, t)
        }, e.pointerUp = function (e, t) {
            this.emitEvent("pointerUp", [e, t])
        }, e._pointerDone = function () {
            this._pointerReset(), this._unbindPostStartEvents(), this.pointerDone()
        }, e._pointerReset = function () {
            this.isPointerDown = !1, delete this.pointerIdentifier
        }, e.pointerDone = function () {}, e.onpointercancel = function (e) {
            e.pointerId == this.pointerIdentifier && this._pointerCancel(e, e)
        }, e.ontouchcancel = function (e) {
            var t = this.getTouch(e.changedTouches);
            t && this._pointerCancel(e, t)
        }, e._pointerCancel = function (e, t) {
            this._pointerDone(), this.pointerCancel(e, t)
        }, e.pointerCancel = function (e, t) {
            this.emitEvent("pointerCancel", [e, t])
        }, t.getPointerPoint = function (e) {
            return {
                x: e.pageX,
                y: e.pageY
            }
        }, t
    }),
    function (t, n) {
        "function" == typeof define && define.amd ? define("unidragger/unidragger", ["unipointer/unipointer"], function (e) {
            return n(t, e)
        }) : "object" == typeof module && module.exports ? module.exports = n(t, require("unipointer")) : t.Unidragger = n(t, t.Unipointer)
    }(window, function (r, e) {
        function t() {}
        var n = t.prototype = Object.create(e.prototype);
        n.bindHandles = function () {
            this._bindHandles(!0)
        }, n.unbindHandles = function () {
            this._bindHandles(!1)
        }, n._bindHandles = function (e) {
            for (var t = (e = void 0 === e || e) ? "addEventListener" : "removeEventListener", n = e ? this._touchActionValue : "", i = 0; i < this.handles.length; i++) {
                var o = this.handles[i];
                this._bindStartEvent(o, e), o[t]("click", this), r.PointerEvent && (o.style.touchAction = n)
            }
        }, n._touchActionValue = "none", n.pointerDown = function (e, t) {
            this.okayPointerDown(e) && (this.pointerDownPointer = t, e.preventDefault(), this.pointerDownBlur(), this._bindPostStartEvents(e), this.emitEvent("pointerDown", [e, t]))
        };
        var i = {
                TEXTAREA: !0,
                INPUT: !0,
                SELECT: !0,
                OPTION: !0
            },
            o = {
                radio: !0,
                checkbox: !0,
                button: !0,
                submit: !0,
                image: !0,
                file: !0
            };
        return n.okayPointerDown = function (e) {
            var t = i[e.target.nodeName],
                e = o[e.target.type],
                e = !t || e;
            return e || this._pointerReset(), e
        }, n.pointerDownBlur = function () {
            var e = document.activeElement;
            e && e.blur && e != document.body && e.blur()
        }, n.pointerMove = function (e, t) {
            var n = this._dragPointerMove(e, t);
            this.emitEvent("pointerMove", [e, t, n]), this._dragMove(e, t, n)
        }, n._dragPointerMove = function (e, t) {
            var n = {
                x: t.pageX - this.pointerDownPointer.pageX,
                y: t.pageY - this.pointerDownPointer.pageY
            };
            return !this.isDragging && this.hasDragStarted(n) && this._dragStart(e, t), n
        }, n.hasDragStarted = function (e) {
            return 3 < Math.abs(e.x) || 3 < Math.abs(e.y)
        }, n.pointerUp = function (e, t) {
            this.emitEvent("pointerUp", [e, t]), this._dragPointerUp(e, t)
        }, n._dragPointerUp = function (e, t) {
            this.isDragging ? this._dragEnd(e, t) : this._staticClick(e, t)
        }, n._dragStart = function (e, t) {
            this.isDragging = !0, this.isPreventingClicks = !0, this.dragStart(e, t)
        }, n.dragStart = function (e, t) {
            this.emitEvent("dragStart", [e, t])
        }, n._dragMove = function (e, t, n) {
            this.isDragging && this.dragMove(e, t, n)
        }, n.dragMove = function (e, t, n) {
            e.preventDefault(), this.emitEvent("dragMove", [e, t, n])
        }, n._dragEnd = function (e, t) {
            this.isDragging = !1, setTimeout(function () {
                delete this.isPreventingClicks
            }.bind(this)), this.dragEnd(e, t)
        }, n.dragEnd = function (e, t) {
            this.emitEvent("dragEnd", [e, t])
        }, n.onclick = function (e) {
            this.isPreventingClicks && e.preventDefault()
        }, n._staticClick = function (e, t) {
            this.isIgnoringMouseUp && "mouseup" == e.type || (this.staticClick(e, t), "mouseup" != e.type && (this.isIgnoringMouseUp = !0, setTimeout(function () {
                delete this.isIgnoringMouseUp
            }.bind(this), 400)))
        }, n.staticClick = function (e, t) {
            this.emitEvent("staticClick", [e, t])
        }, t.getPointerPoint = e.getPointerPoint, t
    }),
    function (n, i) {
        "function" == typeof define && define.amd ? define(["get-size/get-size", "unidragger/unidragger"], function (e, t) {
            return i(n, e, t)
        }) : "object" == typeof module && module.exports ? module.exports = i(n, require("get-size"), require("unidragger")) : n.Draggabilly = i(n, n.getSize, n.Unidragger)
    }(window, function (o, s, e) {
        function n(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }
        var i = o.jQuery;

        function t(e, t) {
            this.element = "string" == typeof e ? document.querySelector(e) : e, i && (this.$element = i(this.element)), this.options = n({}, this.constructor.defaults), this.option(t), this._create()
        }
        e = t.prototype = Object.create(e.prototype);
        t.defaults = {}, e.option = function (e) {
            n(this.options, e)
        };
        var r = {
            relative: !0,
            absolute: !0,
            fixed: !0
        };

        function a(e, t, n) {
            return n = n || "round", t ? Math[n](e / t) * t : e
        }
        return e._create = function () {
            this.position = {}, this._getPosition(), this.startPoint = {
                x: 0,
                y: 0
            }, this.dragPoint = {
                x: 0,
                y: 0
            }, this.startPosition = n({}, this.position);
            var e = getComputedStyle(this.element);
            r[e.position] || (this.element.style.position = "relative"), this.on("pointerDown", this.onPointerDown), this.on("pointerMove", this.onPointerMove), this.on("pointerUp", this.onPointerUp), this.enable(), this.setHandles()
        }, e.setHandles = function () {
            this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element], this.bindHandles()
        }, e.dispatchEvent = function (e, t, n) {
            var i = [t].concat(n);
            this.emitEvent(e, i), this.dispatchJQueryEvent(e, t, n)
        }, e.dispatchJQueryEvent = function (e, t, n) {
            var i = o.jQuery;
            i && this.$element && ((t = i.Event(t)).type = e, this.$element.trigger(t, n))
        }, e._getPosition = function () {
            var e = getComputedStyle(this.element),
                t = this._getPositionCoord(e.left, "width"),
                n = this._getPositionCoord(e.top, "height");
            this.position.x = isNaN(t) ? 0 : t, this.position.y = isNaN(n) ? 0 : n, this._addTransformPosition(e)
        }, e._getPositionCoord = function (e, t) {
            if (-1 == e.indexOf("%")) return parseInt(e, 10);
            var n = s(this.element.parentNode);
            return n ? parseFloat(e) / 100 * n[t] : 0
        }, e._addTransformPosition = function (e) {
            var t, n = e.transform;
            0 === n.indexOf("matrix") && (t = n.split(","), e = 0 === n.indexOf("matrix3d") ? 12 : 4, n = parseInt(t[e], 10), e = parseInt(t[1 + e], 10), this.position.x += n, this.position.y += e)
        }, e.onPointerDown = function (e, t) {
            this.element.classList.add("is-pointer-down"), this.dispatchJQueryEvent("pointerDown", e, [t])
        }, e.dragStart = function (e, t) {
            this.isEnabled && (this._getPosition(), this.measureContainment(), this.startPosition.x = this.position.x, this.startPosition.y = this.position.y, this.setLeftTop(), this.dragPoint.x = 0, this.dragPoint.y = 0, this.element.classList.add("is-dragging"), this.dispatchEvent("dragStart", e, [t]), this.animate())
        }, e.measureContainment = function () {
            var e, t, n, i, o, r = this.getContainer();
            r && (e = s(this.element), t = s(r), n = this.element.getBoundingClientRect(), o = r.getBoundingClientRect(), i = t.borderLeftWidth + t.borderRightWidth, r = t.borderTopWidth + t.borderBottomWidth, o = this.relativeStartPosition = {
                x: n.left - (o.left + t.borderLeftWidth),
                y: n.top - (o.top + t.borderTopWidth)
            }, this.containSize = {
                width: t.width - i - o.x - e.width,
                height: t.height - r - o.y - e.height
            })
        }, e.getContainer = function () {
            var e = this.options.containment;
            if (e) return e instanceof HTMLElement ? e : "string" == typeof e ? document.querySelector(e) : this.element.parentNode
        }, e.onPointerMove = function (e, t, n) {
            this.dispatchJQueryEvent("pointerMove", e, [t, n])
        }, e.dragMove = function (e, t, n) {
            var i, o, r, s;
            this.isEnabled && (r = n.x, s = n.y, i = (o = this.options.grid) && o[0], o = o && o[1], r = a(r, i), s = a(s, o), r = this.containDrag("x", r, i), s = this.containDrag("y", s, o), r = "y" == this.options.axis ? 0 : r, s = "x" == this.options.axis ? 0 : s, this.position.x = this.startPosition.x + r, this.position.y = this.startPosition.y + s, this.dragPoint.x = r, this.dragPoint.y = s, this.dispatchEvent("dragMove", e, [t, n]))
        }, e.containDrag = function (e, t, n) {
            if (!this.options.containment) return t;
            var i = "x" == e ? "width" : "height",
                e = a(-this.relativeStartPosition[e], n, "ceil"),
                i = a(i = this.containSize[i], n, "floor");
            return Math.max(e, Math.min(i, t))
        }, e.onPointerUp = function (e, t) {
            this.element.classList.remove("is-pointer-down"), this.dispatchJQueryEvent("pointerUp", e, [t])
        }, e.dragEnd = function (e, t) {
            this.isEnabled && (this.element.style.transform = "", this.setLeftTop(), this.element.classList.remove("is-dragging"), this.dispatchEvent("dragEnd", e, [t]))
        }, e.animate = function () {
            var e;
            this.isDragging && (this.positionDrag(), e = this, requestAnimationFrame(function () {
                e.animate()
            }))
        }, e.setLeftTop = function () {
            this.element.style.left = this.position.x + "px", this.element.style.top = this.position.y + "px"
        }, e.positionDrag = function () {
            this.element.style.transform = "translate3d( " + this.dragPoint.x + "px, " + this.dragPoint.y + "px, 0)"
        }, e.staticClick = function (e, t) {
            this.dispatchEvent("staticClick", e, [t])
        }, e.setPosition = function (e, t) {
            this.position.x = e, this.position.y = t, this.setLeftTop()
        }, e.enable = function () {
            this.isEnabled = !0
        }, e.disable = function () {
            this.isEnabled = !1, this.isDragging && this.dragEnd()
        }, e.destroy = function () {
            this.disable(), this.element.style.transform = "", this.element.style.left = "", this.element.style.top = "", this.element.style.position = "", this.unbindHandles(), this.$element && this.$element.removeData("draggabilly")
        }, e._init = function () {}, i && i.bridget && i.bridget("draggabilly", t), t
    }),
    function () {
        $(function () {
            var e = $('<div class="dialog" id="dialog"/>'),
                t = $('<div class="dialog-tb"><div class="dialog-td"></div></div>');
            $("body").append(e).append('<div class="dialog-backdrop"/>'), e.append(t)
        }), $(document).on("click.open-dialog", '[data-toggle="dialog"]', function (e) {
            var t = $(this).data("target"),
                n = $(t);
            $("#dialog").find(".dialog-td").append(n), $("body").addClass("show-dialog"), n.trigger("open"), e.preventDefault(), $(document).on("click.dismiss-dialog", '[data-dismiss="dialog"]', function (e) {
                $("body").removeClass("show-dialog"), n.trigger("close"), e.preventDefault(), $(this).off("click.dismiss-dialog")
            })
        })
    }.call(this),
    function (e) {
        var t, n, i;
        "function" == typeof define && define.amd && (define(e), t = !0), "object" == typeof exports && (module.exports = e(), t = !0), t || (n = window.Cookies, (i = window.Cookies = e()).noConflict = function () {
            return window.Cookies = n, i
        })
    }(function () {
        function g() {
            for (var e = 0, t = {}; e < arguments.length; e++) {
                var n, i = arguments[e];
                for (n in i) t[n] = i[n]
            }
            return t
        }
        return function e(f) {
            function h(e, t, n) {
                if ("undefined" != typeof document) {
                    if (1 < arguments.length) {
                        "number" == typeof (n = g({
                            path: "/"
                        }, h.defaults, n)).expires && (n.expires = new Date(+new Date + 864e5 * n.expires)), n.expires = n.expires ? n.expires.toUTCString() : "";
                        try {
                            var i = JSON.stringify(t);
                            /^[\{\[]/.test(i) && (t = i)
                        } catch (e) {}
                        t = f.write ? f.write(t, e) : encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), e = encodeURIComponent(String(e)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                        var o, r = "";
                        for (o in n) n[o] && (r += "; " + o, !0 !== n[o] && (r += "=" + n[o].split(";")[0]));
                        return document.cookie = e + "=" + t + r
                    }

                    function s(e) {
                        return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
                    }
                    for (var a = {}, l = document.cookie ? document.cookie.split("; ") : [], c = 0; c < l.length; c++) {
                        var d = l[c].split("="),
                            u = d.slice(1).join("=");
                        this.json || '"' !== u.charAt(0) || (u = u.slice(1, -1));
                        try {
                            var p = s(d[0]),
                                u = (f.read || f)(u, p) || s(u);
                            if (this.json) try {
                                u = JSON.parse(u)
                            } catch (e) {}
                            if (a[p] = u, e === p) break
                        } catch (e) {}
                    }
                    return e ? a[e] : a
                }
            }
            return (h.set = h).get = function (e) {
                return h.call(h, e)
            }, h.getJSON = function (e) {
                return h.call({
                    json: !0
                }, e)
            }, h.remove = function (e, t) {
                h(e, "", g(t, {
                    expires: -1
                }))
            }, h.defaults = {}, h.withConverter = e, h
        }(function () {})
    }),
    function () {
        $(function () {
            function n(e, t) {
                var n = $(e).data("lazy-retina"),
                    i = $(e).data("lazy"),
                    o = (e.tagName = "IMAGE", new Image);
                o.src = r && n || i, o.onload = t.call(e, r && n || i, "IMAGE")
            }
            var r = $("body").is(".retina");
            $.updateLazyLoader = function () {
                $(".lazy-load").on("inview", function (e, t) {
                    t && (n(this, function (e, t) {
                        t ? ($(this).attr("src", e), "none" != $(this).data("effect") && $(this).css("opacity", 0).animate({
                            opacity: 1
                        }, 300, "swing")) : $(this).css({
                            backgroundImage: "url(" + e + ")"
                        })
                    }), $(this).off("inview"))
                }), $(window).trigger("scroll")
            }, $.updateLazyLoader()
        })
    }.call(this),
    function () {
        $(document).on("click", '[data-anchor="true"]', function (e) {
            var t = $(this).attr("href").split("#"),
                n = 2 == t.length ? $("#" + t[1]) : null,
                t = $(this).data("offset") || 0,
                t = $(window).width() <= 820 ? 72 : t;
            null != n && ($("body").removeClass("show-submenu"), 0 < n.length && ($("html, body").animate({
                scrollTop: n.offset().top - t
            }, 700, "easeInOutCubic"), e.preventDefault()))
        })
    }.call(this),
    function () {
        function t(e) {
            var i = $(e),
                t = i.attr("src"),
                o = i.data("gif"),
                r = !1,
                n = this;
            this.play = function () {
                var e, t, n;
                r ? i.attr("src", o) : (e = o, t = function () {
                    i.attr("src", o), r = !0
                }, (n = new Image).src = e, n.onload = t)
            }, this.stop = function () {
                i.attr("src", t)
            }, i.on("inview", function (e, t) {
                t ? n.play() : n.stop()
            }), 1 == i.data("replay") && i.on("click", function (e) {
                n.stop(), setTimeout(function () {
                    n.play()
                }, 50), e.preventDefault()
            })
        }
        var n = [];
        window.GifPlayer = {
            add: function (e) {
                e = new t(e);
                n.push(e)
            }
        }
    }.call(this),
    function () {
        var e = {},
            i = {},
            o = !1;
        e.run = function () {
            if (!o) {
                var e, t = $("html").data("action").split("|");
                for (e in t) {
                    var n = t[e];
                    i.hasOwnProperty(n) && i[n].init()
                }
                o = !0
            }
            return o
        }, e.define = function (e, t, n) {
            if (n) return i[e] = t;
            if (i.hasOwnProperty(e)) throw new Error('Module "' + e + '" is already defined');
            return i[e] = t, this
        }, e.require = function (e) {
            if (!i.hasOwnProperty(e)) throw new Error('Module "' + e + '" is not defined');
            return i[e]
        }, e.mixin = function (e, t) {
            for (var n in e.prototype) t.prototype[n] = e.prototype[n];
            return this
        }, e.extend = function (e, t) {
            return $.extend(e, t || {}), this
        }, window.App = e
    }.call(this),
    function () {
        App.define("Blog", {
            buildPreview: function (e) {
                $.get("./blog/preview.html", function (e) {
                    $(e).find("item").slice(0, 3);
                    $("#blog-posts").empty().append($(e)[5]), setTimeout(function () {
                        $("#blog-posts").addClass("fade-in")
                    }, 10)
                })
            }
        })
    }.call(this),
    function () {
        var e = function (e) {
            var t = $(e),
                e = t.find(".slide-master"),
                o = t.find(".slide-slave");
            t.find(".slider").each(function () {
                var e = $(this).data("slides"),
                    t = "rtl" == $(this).data("direction"),
                    n = [{
                        breakpoint: 960,
                        settings: {
                            slidesToShow: 2,
                            rtl: t
                        }
                    }];
                $(this).slick({
                    pauseOnFocus: !1,
                    pauseOnHover: !1,
                    cssEase: "ease-in-out",
                    autoplay: !1,
                    dots: !1,
                    draggable: !1,
                    arrows: !1,
                    rtl: t,
                    slidesToShow: e,
                    responsive: n
                })
            }), e.on("beforeChange", function (e, t, n, i) {
                o.slick("slickNext")
            }), e.slick("play")
        };
        $(function () {
            e("#perks-slider")
        })
    }.call(this),
    function () {
        function n() {
            $("body").removeClass("show-submenu"), $(".main-menu").find("li").removeClass("open")
        }
        var s = "click";
        $(".savings-animation").on("inview", function (e, t) {
            t && ($(this).addClass("play"), $(this).off("inview"))
        }), $(".savings-animation").on("click", function () {
            $(this).addClass("stop").removeClass("play");
            var e = this;
            setTimeout(function () {
                $(e).addClass("play")
            }, 10)
        }), $(document).on("mousedown", "img", function (e) {
            e.preventDefault()
        }).on(s, '[data-toggle="mobile-menu"]', function (e) {
            var t = $("body");
            $("body").toggleClass("show-mobile-menu"), t.hasClass("show-mobile-menu") || n(), e.stopPropagation(), e.preventDefault()
        }).on(s, ".main-menu nav", function (e) {
            e.stopPropagation()
        }).on(s, n).on(s, '[data-toggle="submenu"]', function (e) {
            e.stopPropagation(), e.preventDefault(), $(this).parent().hasClass("open") ? n() : ($("body").addClass("show-submenu"), $(this).parent().parent().find("li").removeClass("open"), $(this).parent().addClass("open"))
        }).on(s, '[data-toggle="video"]', function (e) {
            var t = $(this),
                n = t.data("target"),
                i = t.attr("playing");
            $(n).find("video.player").attr("preload", "all"), "false" == i ? ($(n).find("video.player").each(function () {
                this.play()
            }), t.attr("playing", !0)) : ($(n).find("video.player").each(function () {
                this.pause()
            }), t.attr("playing", !1)), e.stopPropagation(), e.preventDefault()
        }).on("mousedown", ".mm-backdrop", function (e) {
            $("body").removeClass("show-mobile-menu"), e.stopPropagation()
        });

        function a() {
            var i, o, r;
            $annotator = $("#annotator"), $annotator.find(".handle button").each(function () {
                var e = $(this).parent(),
                    i = 0,
                    o = e.next().find(".origin");
                $(this).draggabilly({
                    axis: "x",
                    containment: e.get(0)
                }), $(this).on("dragStart", function (e, t, n) {
                    i = o.width()
                }).on("dragEnd", function (e, t, n) {
                    o.width(parseInt($(this).css("left"), 10) - 2 - $(this).width() / 2)
                }).on("dragMove", function (e, t, n) {
                    o.width(i + Math.round(n.x) - 1)
                })
            }), [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i].some(function (e) {
                return navigator.userAgent.match(e)
            }) ? ($("html").addClass("is-mobile"), r = o = i = 0, $(document).on("touchstart", ".m-trigger, .m-trigger-section a", function (e) {
                i = e.originalEvent.touches[0].clientX, o = e.originalEvent.touches[0].clientY;
                var n = $(this);
                clearTimeout(r), r = setTimeout(function () {
                    n.addClass("m-active")
                }, 50), $(this).on("touchmove", function (e) {
                    var t = e.originalEvent.touches[0].clientX,
                        e = e.originalEvent.touches[0].clientY;
                    (o + 15 < e || e < o - 15) && (n.off("touchend").off("touchmove"), n.removeClass("m-active"), clearTimeout(r)), (i + 15 < t || t < i - 15) && (n.off("touchend").off("touchmove"), n.removeClass("m-active"), clearTimeout(r))
                }), n.one("touchend", function () {
                    n.off("touchend").off("touchmove"), n.removeClass("m-active"), clearTimeout(r)
                })
            })) : ($("video.player").preload = "auto", $("#annotator-scenarios-button").on("click", function () {
                $("#avd-control").click()
            }), $("html").addClass("is-desktop"))
        }

        function l() {
            var e, t, n, i;
            e = window, t = document, i = "hb", e.HubspotObject = i, e.hb = e.hb || function () {
                (e.hb.q = e.hb.q || []).push(arguments)
            }, e.hb.l = +new Date, n = t.createElement("script"), i = t.getElementsByTagName("script")[0], n.async = 1, n.src = "https://js.hs-scripts.com/9204013.js", i.parentNode.insertBefore(n, i), t = window, n = document, t[i = "dataLayer"] = t[i] || [], t[i].push({
                "gtm.start": (new Date).getTime(),
                event: "gtm.js"
            }), i = n.getElementsByTagName("script")[0], (n = n.createElement("script")).async = !0, n.src = "https://www.googletagmanager.com/gtm.js?id=GTM-5B6WL2D", i.parentNode.insertBefore(n, i)
        }
        $(function () {
            var i, t, e, n = $("html").addClass("is-ready"),
                o = scrolledOffTop = !1,
                r = $("#news-ticker");
            $(window).on("scroll", function () {
                scrolledOffTop = 200 < $(this).scrollTop(), scrolledOffTop ? o || (n.addClass("sc-down"), r.slick("slickPause"), o = !0) : (o = !1, n.removeClass("sc-down"), r.slick("slickPlay"))
            }), $('[data-role="dialog"]').on("open", function () {
                $("body").removeClass("show-mobile-menu"), $(this).find("form").get(0).reset()
            }), $("video.player").on("ended", function () {
                this.currentTime = 0, this.pause(), $($(this).data("control-target")).attr("playing", !1)
            }), Cookies.get("uai_cc") ? l() : $("#cc").show(), $("#confirm-cc").on("click", function () {
                return Cookies.set("uai_cc", "confirmed", {
                    expires: 365
                }), $("#cc").addClass("dismiss"), l(), !1
            }), $("img[data-gif]").each(function () {
                window.GifPlayer.add(this)
            }), a(), i = 10, $(document).on(s, '[data-toggle="annotator"]', function (e) {
                var t = $(this),
                    n = t.data("target"),
                    n = $(n);
                n.data("slide"), n.parent().find("[data-slide]");
                $("#annotator").find(".annotation").removeClass("selected"), n.addClass("selected").css("z-index", i++), $(this).data("btn-target") ? ((n = $($(this).data("btn-target"))).parent().find("button").removeClass("selected"), n.addClass("selected"), console.log(n)) : (t.parent().find("button").removeClass("selected"), t.addClass("selected")), e.preventDefault()
            }), (t = $("#testimonials-slider")).slick({
                arrows: !0,
                dots: !0,
                draggable: !0,
                slidesToScroll: 1,
                slidesToShow: 1,
                infinite: !0,
                centerMode: !0,
                centerPadding: "35%",
                responsive: [{
                    breakpoint: 1e3,
                    settings: {
                        centerPadding: "25%"
                    }
                }, {
                    breakpoint: 600,
                    settings: {
                        centerPadding: 0,
                        dots: !0,
                        arrows: !1
                    }
                }]
            }), t.on("beforeChange", function () {
                $(this).removeClass("has-clone")
            }), $(document).on(s, ".slide .btn-link", function () {
                var e = $(this).parent().clone().addClass("clone").attr("style", "");
                t.find(".clone").remove(), t.addClass("has-clone").prepend(e)
            }).on(s, ".slide .btn-dismiss", function () {
                t.removeClass("has-clone").find(".clone").remove()
            }), (e = $("#office-images-slider")).on("inview", function (e, t) {
                t && ($(this).addClass("is-in-view"), $(this).off("inview"))
            }), e.slick({
                autoplay: !0,
                autoplaySpeed: 4e3,
                dots: !0,
                arrows: !1,
                draggable: !1,
                fade: !0,
                speed: 800,
                pauseOnFocus: !1,
                pauseOnHover: !1
            }), $(document).on("click", "footer strong", function () {
                var e;
                $(window).width() <= 600 && (e = $(this).hasClass("expand"), $(this).closest("footer").find("strong").removeClass("expand"), $(this).toggleClass("expand", !e))
            })
        });
        var i = App.require("Blog");
        0 != $("#blog-posts").length && $("#blog-posts").on("inview", function (e, t) {
            i.buildPreview("#blog-posts"), $(this).off("inview")
        })
    }.call(this);