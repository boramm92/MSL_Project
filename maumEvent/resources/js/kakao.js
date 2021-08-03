(window.webpackJsonp = window.webpackJsonp || []).push([
    [0],
    [
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            a(20), a(12), a(7), a(5), a(9);
            var i = a(46),
                s = a(6),
                n = a(26),
                r = a(8),
                o = a(32),
                c = a(45);
            function l(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            function m(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var a = null != arguments[e] ? arguments[e] : {};
                    e % 2
                        ? l(Object(a), !0).forEach(function (e) {
                              Object(s.a)(t, e, a[e]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                        : l(Object(a)).forEach(function (e) {
                              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                          });
                }
                return t;
            }
            var u = {
                    components: { Paging: o.a, IcoArrow: c.a },
                    props: { options: { type: Object } },
                    data: function () {
                        return {
                            opts: Object.assign(
                                {},
                                {
                                    type: "basic",
                                    alignItem: "center",
                                    pagingType: "dot",
                                    isPagingInside: !0,
                                    slotSize: 1,
                                    isAutoPlay: !1,
                                    isLoop: !0,
                                    dummySize: 1,
                                    autoPlayDuration: 2e3,
                                    isBtnStatic: !0,
                                    isHalfContent: !1,
                                    transition: { duration: 300 },
                                },
                                this.options
                            ),
                            hoverPosition: "none",
                            slideLeft: 0,
                            currentPoint: 0,
                            isDoingSlide: !1,
                            autoPlayingItem: null,
                            autoPlayState: "stop",
                            controlText: "멈춤",
                            centerAddWidth: 0,
                            preventLink: !0,
                            isDragOn: !1,
                            isEnterArea: !1,
                        };
                    },
                    mounted: function () {
                        var t = this;
                        if (!(this.opts.slotSize <= 1)) {
                            if (((this.slideBoxElem = this.$refs.slideBox), (this.centerAddWidth = this.getAlignLeft() || 0), this.moveToSlide(1, !0), !this.opts.isBtnStatic))
                                Object(n.a)(this.slideBoxElem.querySelectorAll("a")).forEach(function (t, e) {
                                    t.addEventListener("click", function (t) {
                                        return t.stopPropagation();
                                    });
                                });
                            if (this.opts.isLoop)
                                [0, 1, this.opts.slotSize, this.opts.slotSize + 1].forEach(function (e) {
                                    var a = t.$refs["slideItem".concat(e)][0];
                                    t.exchangeLazyImage(a);
                                }),
                                    this.autoPlay();
                            this.slideBoxElem.addEventListener("transitionend", this.onTransitionEnd), window.addEventListener("resize", this.onResize);
                        }
                    },
                    beforeDestroy: function () {
                        this.opts.slotSize <= 1 || (this.slideBoxElem.removeEventListener("transitionend", this.onTransitionEnd), window.removeEventListener("resize", this.onResize));
                    },
                    computed: m(
                        m({}, Object(r.b)(["isIOS"])),
                        {},
                        {
                            swipeStandard: function () {
                                return this.isTouchDevice ? 50 : 100;
                            },
                            matchEvents: function () {
                                var t = this.opts.isBtnStatic ? { mousedown: this.onTouchStart, mouseup: this.onTouchEnd, mousemove: this.onTouchMove, click: this.onClickPrevent } : { click: this.onClickPrevent },
                                    e = { touchstart: this.onTouchStart, touchend: this.onTouchEnd, touchmove: this.onTouchMove };
                                return this.isTouchDevice ? e : t;
                            },
                            matchMouseEvents: function () {
                                var t = { mousemove: this.onMouseHover, mouseenter: this.onMouseEnter, mouseleave: this.onMouseLeave };
                                return this.isTouchDevice ? {} : t;
                            },
                            isTouchDevice: function () {
                                var t = window.navigator.maxTouchPoints;
                                return 0 !== (void 0 === t ? 0 : t) || this.isMobile;
                            },
                            isTablet: function () {
                                var t = window.navigator.maxTouchPoints;
                                return 0 !== (void 0 === t ? 0 : t) && !this.isMobile;
                            },
                            currentPage: function () {
                                var t = this.currentPoint % this.opts.slotSize;
                                return 0 !== t ? t : this.opts.slotSize;
                            },
                        }
                    ),
                    methods: {
                        onResize: function () {
                            (this.centerAddWidth = this.getAlignLeft()), this.moveToSlide(this.currentPoint, !0, !0);
                        },
                        onClickPrevent: function (t) {
                            this.preventLink && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation()),
                                this.opts.isBtnStatic || "none" === this.hoverPosition || ("prev" === this.hoverPosition ? this.onClickPrev() : this.onClickNext());
                        },
                        onMouseEnter: function () {
                            (this.isEnterArea = !0), this.controlAuto();
                        },
                        onMouseLeave: function (t) {
                            t.preventDefault(), (this.isEnterArea = !1), (this.hoverPosition = "none"), this.controlAuto(), this.onTouchEnd(t);
                        },
                        onMouseHover: function (t) {
                            if (!this.isTouchDevice) {
                                t.target;
                                var e = this.getAxisInfos(t).pageX,
                                    a = document.body.scrollWidth,
                                    i = e - ((this.opts.isHalfContent ? a - this.slideWrapWidth : a) - this.slideWrapWidth) / 2;
                                this.hoverPosition = this.slideWrapWidth / 2 > i ? "prev" : "next";
                            }
                        },
                        onTouchStart: function (t) {
                            (this.firstTouch = !0), (this.preventTouch = !0), (this.preventLink = !1), this.isTouchDevice && this.clearAutoPlay();
                            var e = this.getAxisInfos(t),
                                a = e.clientX,
                                i = e.clientY;
                            (this.touchStartInfo = { clientX: a, clientY: i }), (this.slideBoxElem.style.transitionDuration = "0s");
                        },
                        onTouchMove: function (t) {
                            var e = this.getAxisInfos(t),
                                a = e.clientX,
                                i = e.clientY,
                                s = (e.offsetX, e.offsetY, window);
                            s.pageXOffset, s.pageYOffset;
                            if (this.preventTouch) {
                                (this.isIOS && (this.isMobile || this.isTablet)) || t.preventDefault();
                                var n = this.getSlideInfos(e, this.touchStartInfo),
                                    r = n.distanceX,
                                    o = n.direction;
                                if (((this.preventLink = !0), this.firstTouch)) {
                                    if (((this.firstTouch = !1), "left" !== o && "right" !== o)) return (this.preventTouch = !1);
                                    t.preventDefault();
                                }
                                0 !== r && ((this.isDragOn = !0), this.isDoingSlide && this.opts.isLoop && this.toSwipeLoopEndCont()), (this.slideLeft = this.standardSlideLeft + r);
                            }
                        },
                        onTouchEnd: function (t) {
                            if (this.preventTouch && ((this.preventTouch = !1), this.isTouchDevice && this.autoPlay(), this.isDragOn)) {
                                (this.isDoingSlide = !1), (this.isDragOn = !1), (this.slideBoxElem.style.transitionDuration = this.opts.transition.duration);
                                var e = this.getSlideInfos(this.getAxisInfos(t), this.touchStartInfo),
                                    a = e.direction,
                                    i = e.isSwipe;
                                i && "left" === a ? this.onClickPrev() : i && "right" === a ? this.onClickNext() : this.moveToSlide(this.currentPoint);
                            }
                        },
                        getAxisInfos: function (t) {
                            if (this.isTouchDevice) {
                                var e = t.changedTouches;
                                return (void 0 === e ? [] : e)[0];
                            }
                            return t;
                        },
                        getSlideInfos: function (t, e) {
                            var a = t.clientX,
                                i = t.clientY,
                                s = a - e.clientX,
                                n = i - e.clientY,
                                r = Math.abs(s),
                                o = Math.abs(n);
                            return { distanceX: s, distanceY: n, direction: r >= o ? (s <= 0 ? "right" : "left") : n <= 0 ? "top" : "bottom", isSwipe: r >= this.swipeStandard || o >= this.swipeStandard };
                        },
                        callback: function (t) {
                            this.$emit("callback", t);
                        },
                        onTransitionEnd: function (t) {
                            t.target === this.slideBoxElem && this.toSwipeLoopEndCont(10);
                        },
                        toSwipeLoopEndCont: function (t) {
                            var e = this;
                            t
                                ? window.setTimeout(function () {
                                      e.toSwipeLoopCont();
                                  }, t)
                                : this.toSwipeLoopCont();
                        },
                        toSwipeLoopCont: function () {
                            (this.isDoingSlide = !1), 0 === this.currentPoint ? this.moveToSlide(this.opts.slotSize, !0) : this.currentPoint === this.opts.slotSize + 1 && this.moveToSlide(1, !0);
                        },
                        moveToSlide: function () {
                            var t = this,
                                e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                                a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                                i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                            if (!this.isDoingSlide) {
                                if ((this.opts.isLoop && this.opts.isAutoPlay && !i && "start" === this.autoPlayState && null !== this.autoPlayingItem && (this.clearAutoPlay(), this.autoPlay()), !a)) {
                                    var s = Math.abs(e % this.opts.slotSize);
                                    this.callback(0 === s ? this.opts.slotSize : s);
                                }
                                var n = this.$refs["slideItem".concat(e)];
                                if (void 0 !== n) {
                                    var r = [e - 1, e, e + 1];
                                    r.forEach(function (e) {
                                        var a = t.$refs["slideItem".concat(e)];
                                        a && t.exchangeLazyImage(a[0]);
                                    });
                                    var o = n[0].offsetLeft;
                                    (this.slideLeft = this.centerAddWidth - o), (this.standardSlideLeft = this.slideLeft);
                                    var c = a ? 0 : this.opts.transition.duration;
                                    (this.slideBoxElem.style.transitionDuration = "".concat(c, "ms")),
                                        (this.slideBoxElem.style.webkitTransitionDuration = "".concat(c, "ms")),
                                        (this.slideBoxElem.style.transform = "translate3d(".concat(this.slideLeft, "px, 0px, 0px)")),
                                        (this.slideBoxElem.style.webkitTransform = "translate3d(".concat(this.slideLeft, "px, 0px, 0px)")),
                                        a || this.currentPoint === e || (this.isDoingSlide = !0),
                                        (this.currentPoint = e);
                                }
                            }
                        },
                        exchangeLazyImage: function (t) {
                            if (!(!t instanceof HTMLElement)) {
                                var e = (t.querySelector("img") || {}).lazyImage;
                                e && e.onIntersecting instanceof Function && e.onIntersecting();
                            }
                        },
                        onClickPrev: function () {
                            1 !== this.currentPage || this.opts.isLoop ? this.moveToSlide(this.currentPage - 1) : this.moveToSlide(this.currentPage);
                        },
                        onClickNext: function (t) {
                            var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            this.currentPage !== this.opts.slotSize || this.opts.isLoop ? this.moveToSlide(this.currentPage + 1, !1, e) : this.moveToSlide(this.currentPage, !1, e);
                        },
                        autoPlay: function () {
                            var t = this;
                            this.opts.isAutoPlay &&
                                "start" !== this.autoPlayState &&
                                ((this.autoPlayState = "start"),
                                (this.autoPlayingItem = window.setInterval(function () {
                                    t.onClickNext(null, !0);
                                }, this.opts.autoPlayDuration)));
                        },
                        clearAutoPlay: function () {
                            if ("stop" !== this.autoPlayState) {
                                var t = window.clearInterval;
                                (this.autoPlayState = "stop"), t(this.autoPlayingItem);
                            }
                        },
                        controlAuto: function (t) {
                            this.opts.isAutoPlay && ("start" === this.autoPlayState ? ((this.controlText = "재시작"), this.clearAutoPlay()) : ((this.controlText = "멈춤"), this.autoPlay()));
                        },
                        getAlignLeft: function () {
                            var t = this.opts.alignItem,
                                e = this.$refs.slideWrap;
                            this.slideWrapWidth = e.clientWidth;
                            var a = this.$refs.slideItem1,
                                s = 0;
                            if (Object(i.a)(a) !== Array || 0 === a.length) return s;
                            var n = a[0].clientWidth;
                            return "right" === t ? (s = this.slideWrapWidth - n) : "center" === t && (s = (this.slideWrapWidth - n) / 2), s;
                        },
                    },
                },
                p = (a(285), a(0)),
                d = Object(p.a)(
                    u,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return 1 !== t.opts.slotSize
                            ? a(
                                  "div",
                                  t._g(
                                      {
                                          class: [
                                              "cont_slide",
                                              { ty_wide: "wide" === t.opts.type, ty_follow: !t.isMobile && !t.opts.isBtnStatic, hover_prev: !t.isMobile && "prev" === t.hoverPosition, hover_next: !t.isMobile && "next" === t.hoverPosition },
                                          ],
                                      },
                                      t.matchMouseEvents
                                  ),
                                  [
                                      a("div", t._g({ ref: "slideWrap", staticClass: "wrap_slide" }, t.matchEvents), [
                                          a(
                                              "div",
                                              { ref: "slideBox", staticClass: "slide_box", style: "transition-duration:" + t.opts.duration + "ms;transform:translate3d(" + t.slideLeft + "px, 0px, 0px);" },
                                              [
                                                  t._l(t.opts.dummySize, function (e, i) {
                                                      return t.opts.isLoop
                                                          ? a(
                                                                "div",
                                                                { key: "dummyPrevItem" + i, ref: "slideItem" + (e - t.opts.dummySize), refInFor: !0, staticClass: "slide_item loop_item", attrs: { "data-isDummy": "true" } },
                                                                [t._t("slot" + (t.opts.slotSize - 1))],
                                                                2
                                                            )
                                                          : t._e();
                                                  }),
                                                  t._v(" "),
                                                  t._l(t.opts.slotSize, function (e, i) {
                                                      return a(
                                                          "div",
                                                          {
                                                              key: "slideItem" + i,
                                                              ref: "slideItem" + (i + 1),
                                                              refInFor: !0,
                                                              class: ["slide_item", { slide_active: t.currentPoint === i + 1 }],
                                                              attrs: { "data-isOn": t.currentPoint === i + 1 },
                                                          },
                                                          [t._t("slot" + i)],
                                                          2
                                                      );
                                                  }),
                                                  t._v(" "),
                                                  t._l(t.opts.dummySize, function (e, i) {
                                                      return t.opts.isLoop
                                                          ? a(
                                                                "div",
                                                                { key: "dummyNextItem" + i, ref: "slideItem" + (t.opts.slotSize + i + 1), refInFor: !0, staticClass: "slide_item loop_item", attrs: { "data-isDummy": "true" } },
                                                                [t._t("slot0")],
                                                                2
                                                            )
                                                          : t._e();
                                                  }),
                                              ],
                                              2
                                          ),
                                      ]),
                                      t._v(" "),
                                      a("div", { staticClass: "slide_control" }, [
                                          a(
                                              "div",
                                              { staticClass: "inner_control" },
                                              [
                                                  t._t("controller"),
                                                  t._v(" "),
                                                  (t.opts.isPagingInside && "text" === t.opts.pagingType) || (t.opts.isPagingInside && "dot" === t.opts.pagingType)
                                                      ? a("Paging", { attrs: { type: t.opts.pagingType, currentPage: t.currentPage, slotSize: t.opts.slotSize }, on: { moveToSlide: t.moveToSlide } })
                                                      : t._e(),
                                                  t._v(" "),
                                                  !t.isMobile && t.opts.isBtnStatic
                                                      ? a(
                                                            "div",
                                                            { staticClass: "wrap_btn ty_static" },
                                                            [
                                                                a("transition", { attrs: { name: "fade" } }, [
                                                                    a(
                                                                        "button",
                                                                        {
                                                                            directives: [
                                                                                {
                                                                                    name: "show",
                                                                                    rawName: "v-show",
                                                                                    value: !((!t.opts.isLoop && 1 === t.currentPage) || "prev" !== t.hoverPosition),
                                                                                    expression: "!((!opts.isLoop && currentPage === 1) || hoverPosition !== 'prev')",
                                                                                },
                                                                            ],
                                                                            ref: "prev",
                                                                            staticClass: "btn_item btn_prev",
                                                                            attrs: { type: "button", disabled: (!t.opts.isLoop && 1 === t.currentPage) || "prev" !== t.hoverPosition },
                                                                            on: {
                                                                                click: function (e) {
                                                                                    return e.preventDefault(), t.onClickPrev(e);
                                                                                },
                                                                            },
                                                                        },
                                                                        [a("IcoArrow")],
                                                                        1
                                                                    ),
                                                                ]),
                                                                t._v(" "),
                                                                a("transition", { attrs: { name: "fade" } }, [
                                                                    a(
                                                                        "button",
                                                                        {
                                                                            directives: [
                                                                                {
                                                                                    name: "show",
                                                                                    rawName: "v-show",
                                                                                    value: !((!t.opts.isLoop && t.currentPage === t.opts.slotSize) || "next" !== t.hoverPosition),
                                                                                    expression: "!((!opts.isLoop && currentPage === opts.slotSize) || hoverPosition !== 'next')",
                                                                                },
                                                                            ],
                                                                            ref: "next",
                                                                            staticClass: "btn_item btn_next",
                                                                            attrs: { type: "button", disabled: (!t.opts.isLoop && t.currentPage === t.opts.slotSize) || "next" !== t.hoverPosition },
                                                                            on: {
                                                                                click: function (e) {
                                                                                    return e.preventDefault(), t.onClickNext(e);
                                                                                },
                                                                            },
                                                                        },
                                                                        [a("IcoArrow")],
                                                                        1
                                                                    ),
                                                                ]),
                                                            ],
                                                            1
                                                        )
                                                      : t._e(),
                                              ],
                                              2
                                          ),
                                      ]),
                                      t._v(" "),
                                      (t.opts.isPagingInside || "text" !== t.opts.pagingType) && (t.opts.isPagingInside || "dot" !== t.opts.pagingType)
                                          ? t._e()
                                          : a("Paging", { attrs: { type: t.opts.pagingType, currentPage: t.currentPage, slotSize: t.opts.slotSize }, on: { moveToSlide: t.moveToSlide } }),
                                  ],
                                  1
                              )
                            : a("div", { class: ["cont_slide", { ty_wide: "wide" === t.opts.type }] }, [t._t("slot0")], 2);
                    },
                    [],
                    !1,
                    null,
                    "376c9464",
                    null
                );
            e.a = d.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(45),
                s = { props: { isStatic: { type: Boolean, default: !1 } }, components: { IcoArrow: i.a } },
                n = (a(281), a(0)),
                r = Object(n.a)(
                    s,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("span", { class: "ico_more " + (this.isStatic ? "ty_static" : "ty_hover") }, [e("span", { staticClass: "ico_circle" }), this._v(" "), e("IcoArrow")], 1);
                    },
                    [],
                    !1,
                    null,
                    "346d3f46",
                    null
                );
            e.a = r.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            a(20), a(12), a(7), a(5), a(9);
            var i = a(6),
                s = a(8),
                n = a(0);
            function r(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            var o = {
                    components: {
                        IcoAnd: Object(n.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_and", attrs: { xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", viewBox: "6 7 14 17" } }, [
                                    e("use", { attrs: { "xlink:href": "#icoAnd" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoIOS: a(176).a,
                    },
                    props: { bannerData: { type: Object, default: {} }, bannerLog: { type: Object, default: {} }, tagType: { tpye: String, default: "div" } },
                    computed: (function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = null != arguments[e] ? arguments[e] : {};
                            e % 2
                                ? r(Object(a), !0).forEach(function (e) {
                                      Object(i.a)(t, e, a[e]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                                : r(Object(a)).forEach(function (e) {
                                      Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                                  });
                        }
                        return t;
                    })({}, Object(s.b)(["isIOS", "deviceType"])),
                    data: function () {
                        return {
                            thumbInfos0: { 375: "750x600", 1440: "1044x640", 1920: "1044x640", 2560: "1044x640" },
                            bgPosition: { 375: "center top", 1440: "101% top", 1920: "100% top", 2560: "96% top" },
                            bgSize: { mo: "375px 300px", pc: "522px 320px" },
                        };
                    },
                },
                c =
                    (a(286),
                    Object(n.a)(
                        o,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                t.tagType,
                                { tag: "component", staticClass: "bnr_app", attrs: { id: "app" } },
                                [
                                    t._t("default"),
                                    t._v(" "),
                                    a(
                                        "div",
                                        {
                                            staticClass: "app_info",
                                            style: {
                                                background: [
                                                    t.bannerData.image.thumbInfos
                                                        ? "url(" +
                                                          t.toThumb(t.bannerData.image.thumbInfos, t.bannerData.image.url, "R")["data-src"] +
                                                          ") " +
                                                          t.bgPosition[t.screenType] +
                                                          "/" +
                                                          t.bannerData.image.bgSize[t.deviceType] +
                                                          " no-repeat"
                                                        : "url(" + t.toThumb(t.thumbInfos0, t.bannerData.image.url, "R")["data-src"] + ") " + t.bgPosition[t.screenType] + "/" + t.bgSize[t.deviceType] + " no-repeat",
                                                ],
                                            },
                                        },
                                        [
                                            a("div", { staticClass: "txt_info" }, [
                                                a("strong", { staticClass: "tit_app", domProps: { innerHTML: t._s(t.bannerData.title) } }),
                                                t._v(" "),
                                                a("p", { staticClass: "desc_app", domProps: { innerHTML: t._s(t.bannerData.description) } }),
                                                t._v(" "),
                                                t.isMobile
                                                    ? (t.isMobile && t.isIOS && t.bannerData.link.appStore) || (t.isMobile && !t.isIOS && t.bannerData.link.googlePlay)
                                                        ? a("div", { staticClass: "store_link" }, [
                                                              a(
                                                                  "a",
                                                                  {
                                                                      staticClass: "link_store",
                                                                      attrs: {
                                                                          href: [t.isIOS ? t.bannerData.link.appStore : t.bannerData.link.googlePlay] || !1,
                                                                          "data-tiara-action-name": t.bannerLog.name,
                                                                          "data-tiara-layer": t.bannerLog.layer,
                                                                      },
                                                                  },
                                                                  [t._v(t._s(t.bannerData.moreText || "") + " 다운로드")]
                                                              ),
                                                          ])
                                                        : t._e()
                                                    : a("div", { staticClass: "store_link" }, [
                                                          t.bannerData.link.appStore
                                                              ? a(
                                                                    "a",
                                                                    {
                                                                        staticClass: "link_store link_ios",
                                                                        attrs: { href: t.bannerData.link.appStore, "data-tiara-action-name": t.bannerLog.name, "data-tiara-layer": t.bannerLog.layer, target: "_blank" },
                                                                    },
                                                                    [a("IcoIOS"), t._v("app store")],
                                                                    1
                                                                )
                                                              : a("span", { staticClass: "link_store link_ios disabled" }, [a("IcoIOS"), t._v("지원 예정")], 1),
                                                          t._v(" "),
                                                          t.bannerData.link.googlePlay
                                                              ? a(
                                                                    "a",
                                                                    {
                                                                        staticClass: "link_store link_and",
                                                                        attrs: { href: t.bannerData.link.googlePlay, "data-tiara-action-name": t.bannerLog.name, "data-tiara-layer": t.bannerLog.layer, target: "_blank" },
                                                                    },
                                                                    [a("IcoAnd"), t._v("google play")],
                                                                    1
                                                                )
                                                              : a("span", { staticClass: "link_store link_and disabled" }, [a("IcoAnd"), t._v("지원 예정")], 1),
                                                      ]),
                                            ]),
                                        ]
                                    ),
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "199bd78e",
                        null
                    ));
            e.a = c.exports;
        },
        function (t, e, a) {
            "use strict";
            a(39);
            var i = {
                    props: {
                        availableOffset: { type: Number, default: 100 },
                        speedFactor: { default: 0.7, type: Number },
                        sectionClass: { type: String, default: "masthead" },
                        containerClass: { type: String, default: "masthead_image" },
                        direction: { type: String, default: "up" },
                        standardPositionElem: {},
                        emitTiming: { type: Number, default: null },
                    },
                    data: function () {
                        return { percent: 0 };
                    },
                    mounted: function () {
                        (window.requestAnimationFrame =
                            window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame ||
                            function (t) {
                                setTimeout(t, 1e3 / 60);
                            }),
                            this.scrollHandler(),
                            window.addEventListener("scroll", this.scrollHandler, !1);
                    },
                    methods: {
                        animateElement: function () {
                            var t = (this.standardPositionElem ? this.standardPositionElem : this.$refs.block).getBoundingClientRect(),
                                e = t.top,
                                a = t.height,
                                i = window,
                                s = i.pageYOffset,
                                n = e + s - i.innerHeight,
                                r = e + a + s - 60;
                            if (n <= s && r >= s) {
                                var o = s - n;
                                (this.percent = o / (n - r)), this.emitTiming && this.emitTiming < Math.abs(this.percent) && this.$emit("parallaxEmit", !0);
                            }
                        },
                        scrollHandler: function () {
                            var t = this;
                            window.requestAnimationFrame(function () {
                                t.animateElement();
                            });
                        },
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.scrollHandler, !1);
                    },
                    computed: {
                        directionXY: function () {
                            return "down" === this.direction || "up" === this.direction ? "vertical" : "horizon";
                        },
                        translateX: function () {
                            return "horizon" === this.directionXY ? this.availableOffset * this.speedFactor * this.percent * this.directionValue : 0;
                        },
                        translateY: function () {
                            return "vertical" === this.directionXY ? this.availableOffset * this.speedFactor * this.percent * this.directionValue : 0;
                        },
                        directionValue: function () {
                            return "down" === this.direction || "left" === this.direction ? 1 : -1;
                        },
                    },
                },
                s = (a(328), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("div", { ref: "block", class: [this.sectionClass] }, [
                            e("div", { ref: "parallax", class: [this.containerClass], style: { transform: "translate(" + this.translateX + "px, " + this.translateY + "px)" } }, [this._t("default")], 2),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "16b48327",
                    null
                );
            e.a = n.exports;
        },
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = {
                    props: ["videoList", "activeIdx", "haslayerList", "thumbInfo"],
                    data: function () {
                        return { showVideo: [], selectedIdx: null, scrollPositionX: "translateX(0px)" };
                    },
                    computed: {
                        changeNumber: function () {
                            return (
                                null === this.activeIdx && (this.selectedIdx = null),
                                null === this.selectedIdx && ((this.selectedIdx = this.activeIdx), null !== this.activeIdx && this.$refs.fullVideo[this.activeIdx].play()),
                                this.selectedIdx
                            );
                        },
                    },
                    methods: {
                        selectVideo: function (t) {
                            this.selectedIdx !== t && (this.$refs.fullVideo[t].play(), this.$refs.fullVideo[this.selectedIdx].pause(), (this.selectedIdx = t));
                        },
                        closeLayer: function () {
                            this.$emit("closeLayer"),
                                this.$refs.fullVideo.forEach(function (t) {
                                    t.load();
                                });
                        },
                    },
                },
                s = (a(322), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            {
                                staticClass: "screen_layer",
                                on: {
                                    click: function (e) {
                                        return e.target !== e.currentTarget ? null : t.closeLayer(e);
                                    },
                                },
                            },
                            [
                                a("div", { staticClass: "inner_layer" }, [
                                    a(
                                        "div",
                                        { staticClass: "area_video" },
                                        t._l(t.videoList, function (e, i) {
                                            return a("video", {
                                                key: i,
                                                ref: "fullVideo",
                                                refInFor: !0,
                                                class: [i === t.changeNumber ? "active" : "", "video_screen"],
                                                attrs: { src: e.video, poster: t.toThumb(t.thumbInfo, e.image.url)["data-src"], preload: 0 === i ? "auto" : "none", controls: "" },
                                            });
                                        }),
                                        0
                                    ),
                                    t._v(" "),
                                    t.haslayerList
                                        ? a(
                                              "div",
                                              { staticClass: "area_list" },
                                              t._l(t.videoList, function (e, i) {
                                                  return a(
                                                      "a",
                                                      {
                                                          key: i,
                                                          staticClass: "link_video",
                                                          attrs: { href: "#" + i },
                                                          on: {
                                                              click: function (e) {
                                                                  return e.preventDefault(), t.selectVideo(i);
                                                              },
                                                          },
                                                      },
                                                      [
                                                          a(
                                                              "img",
                                                              t._b(
                                                                  { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }], attrs: { alt: "", width: "140" } },
                                                                  "img",
                                                                  t.toThumb(t.thumbInfo, e.poster),
                                                                  !1
                                                              )
                                                          ),
                                                      ]
                                                  );
                                              }),
                                              0
                                          )
                                        : t._e(),
                                ]),
                                t._v(" "),
                                a("button", { staticClass: "btn_close", attrs: { type: "button" }, on: { click: t.closeLayer } }, [t._v("닫기")]),
                            ]
                        );
                    },
                    [],
                    !1,
                    null,
                    "2fc624e6",
                    null
                ).exports,
                r = Object(s.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_play", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", "fill-rule": "evenodd", fill: "#FFE100", stroke: "#FFE100" } }, [
                            e("use", { attrs: { "xlink:href": "#icoPlay" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                o = Object(s.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_stop", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", fill: "none", "fill-rule": "evenodd" } }, [e("use", { attrs: { "xlink:href": "#icoStop" } })]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                c = Object(s.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_full", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", fill: "none", stroke: "#FFE100" } }, [e("use", { attrs: { "xlink:href": "#icoFull" } })]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                l = {
                    props: {
                        type: { type: Object, default: {} },
                        videoData: { type: Array, default: [] },
                        thumbInfo: { type: Object, default: {} },
                        thumbType: { type: String, default: "C" },
                        useThumbF: { type: Boolean, default: !1 },
                        tiaraLog: { type: Object },
                        observeOpts: { type: Object, defualt: {} },
                    },
                    components: { screenLayer: n, IcoPlay: r, IcoStop: o, IcoFull: c },
                    data: function () {
                        return { isLayerOpen: !1, playInfoArr: [], soundInfoArr: [], activeNumber: null, hasControler: !1, isEnded: !1 };
                    },
                    created: function () {
                        var t = this,
                            e = this.videoData,
                            a = !1;
                        this.type.autoPlay && (a = !0),
                            e.forEach(function (e) {
                                t.playInfoArr.push(a), t.soundInfoArr.push(!a);
                            });
                    },
                    mounted: function () {
                        this.onObserveElem();
                    },
                    beforeDestroy: function () {
                        this.$store.dispatch("controlBodyClass", { controlClass: "video_layer", command: "remove" });
                    },
                    methods: {
                        onObserveElem: function () {
                            var t = this.$refs.player[0],
                                e = this.videoData && 1 === this.videoData.length && this.type.autoPlay;
                            Object.assign({}, this.observeOpts, { threshold: [0.3, 0.7], root: null, rootMargin: "0px 0px 0px 0px" });
                            e &&
                                ((t.observer = new IntersectionObserver(function (e, a) {
                                    e.forEach(function (e) {
                                        e.isIntersecting && (t.play(), a.unobserve(e.target));
                                    });
                                }, this.observeOpts)),
                                t.observer.observe(t));
                        },
                        endedCheck: function () {
                            this.videoData && 1 === this.videoData.length && (this.$set(this.playInfoArr, 0, !this.playInfoArr[0]), (this.isEnded = !0), this.type.controlsBtn.playHasControler && (this.hasControler = !1));
                        },
                        playingCheck: function () {
                            (this.isEnded = !1), this.videoData && 1 === this.videoData.length && this.type.controlsBtn.playHasControler && (this.hasControler = !0);
                        },
                        playHandling: function (t) {
                            var e = this.$refs.player[t];
                            this.playInfoArr[t] ? e.pause() : e.play(), this.$set(this.playInfoArr, t, !this.playInfoArr[t]);
                        },
                        soundHandling: function (t) {
                            this.$refs.player[t];
                            this.$set(this.soundInfoArr, t, !this.soundInfoArr[t]);
                        },
                        replayHandling: function () {
                            var t = this.$refs.player[0];
                            t.pause(), (t.currentTime = "0"), t.play();
                        },
                        videoLayer: function (t) {
                            (this.isLayerOpen = !this.isLayerOpen), (this.activeNumber = t), this.playInfoArr[t] && (this.$refs.player[t].pause(), this.$set(this.playInfoArr, t, !this.playInfoArr[t])), this.layerOpenHandler();
                        },
                        closeLayer: function () {
                            (this.isLayerOpen = !1), (this.activeNumber = null), this.layerOpenHandler();
                        },
                        layerOpenHandler: function () {
                            this.isLayerOpen ? this.$store.dispatch("controlBodyClass", { controlClass: "video_layer", command: "add" }) : this.$store.dispatch("controlBodyClass", { controlClass: "video_layer", command: "remove" });
                        },
                    },
                },
                m =
                    (a(323),
                    Object(s.a)(
                        l,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "wrap_video" },
                                [
                                    a(
                                        "div",
                                        { staticClass: "video_cont" },
                                        [
                                            1 === t.videoData.length && "top" === t.type.replayBtn
                                                ? a(
                                                      "button",
                                                      {
                                                          staticClass: "btn_replay",
                                                          attrs: { type: "button" },
                                                          on: {
                                                              click: function (e) {
                                                                  return t.replayHandling();
                                                              },
                                                          },
                                                      },
                                                      [t._v("다시 재생하기")]
                                                  )
                                                : t._e(),
                                            t._v(" "),
                                            t._l(t.videoData, function (e, i) {
                                                return a("div", { key: i, class: ["inner_video", { wide: t.type.wide }] }, [
                                                    e.video
                                                        ? a("video", {
                                                              ref: "player",
                                                              refInFor: !0,
                                                              staticClass: "bg_video",
                                                              attrs: {
                                                                  src: e.video,
                                                                  poster: e.image ? t.toThumb(t.thumbInfo, e.image.url, t.thumbType, t.useThumbF)["data-src"] : "",
                                                                  loop: !!t.type.isLoop && t.type.isLoop,
                                                                  controls: t.hasControler,
                                                                  playsinline: "",
                                                              },
                                                              domProps: { muted: !t.soundInfoArr[i] },
                                                              on: { ended: t.endedCheck, playing: t.playingCheck },
                                                          })
                                                        : t._e(),
                                                    t._v(" "),
                                                    t.type.hasText
                                                        ? a("div", { staticClass: "txt_video" }, [
                                                              e.title ? a("span", { staticClass: "sub_tit", domProps: { innerHTML: t._s(e.title) } }) : t._e(),
                                                              t._v(" "),
                                                              e.subTitle ? a("strong", { staticClass: "tit_video", domProps: { innerHTML: t._s(e.subTitle) } }) : t._e(),
                                                          ])
                                                        : t._e(),
                                                    t._v(" "),
                                                    t.type.controlsBtn.playBtn || t.type.controlsBtn.fullscreen || t.type.controlsBtn.sounds
                                                        ? a(
                                                              "div",
                                                              {
                                                                  class: ["control_btn", { play: t.playInfoArr.length > 0 && t.playInfoArr[i] }, { end: t.type.controlsBtn.playBtn && t.isEnded }],
                                                                  style: [t.hasControler ? "display: none" : ""],
                                                              },
                                                              [
                                                                  t.type.controlsBtn.playBtn
                                                                      ? a(
                                                                            "button",
                                                                            {
                                                                                staticClass: "btn_play",
                                                                                attrs: { type: "button", "data-tiara-action-name": [t.tiaraLog ? t.tiaraLog.name : ""], "data-tiara-layer": [t.tiaraLog ? t.tiaraLog.name : ""] },
                                                                                on: {
                                                                                    click: function (e) {
                                                                                        return t.playHandling(i);
                                                                                    },
                                                                                },
                                                                            },
                                                                            [
                                                                                e.etc ? a("span", { staticClass: "btn_text", domProps: { innerHTML: t._s(e.etc) } }) : t._e(),
                                                                                t.playInfoArr.length > 0 && t.playInfoArr[i] ? a("IcoStop") : a("IcoPlay"),
                                                                            ],
                                                                            1
                                                                        )
                                                                      : t._e(),
                                                                  t._v(" "),
                                                                  t.type.controlsBtn.fullscreen
                                                                      ? a(
                                                                            "button",
                                                                            {
                                                                                staticClass: "btn_screen",
                                                                                attrs: { type: "button" },
                                                                                on: {
                                                                                    click: function (e) {
                                                                                        return t.videoLayer(i);
                                                                                    },
                                                                                },
                                                                            },
                                                                            [a("IcoFull")],
                                                                            1
                                                                        )
                                                                      : t._e(),
                                                                  t._v(" "),
                                                                  t.type.controlsBtn.sounds
                                                                      ? a(
                                                                            "button",
                                                                            {
                                                                                class: ["btn_sound", { on: t.soundInfoArr.length > 0 && t.soundInfoArr[i] }],
                                                                                attrs: { type: "button" },
                                                                                on: {
                                                                                    click: function (e) {
                                                                                        return t.soundHandling(i);
                                                                                    },
                                                                                },
                                                                            },
                                                                            [t._v("음량")]
                                                                        )
                                                                      : t._e(),
                                                              ]
                                                          )
                                                        : t._e(),
                                                ]);
                                            }),
                                            t._v(" "),
                                            1 === t.videoData.length && "bottom" === t.type.replayBtn
                                                ? a(
                                                      "button",
                                                      {
                                                          staticClass: "btn_replay",
                                                          attrs: { type: "button" },
                                                          on: {
                                                              click: function (e) {
                                                                  return t.replayHandling();
                                                              },
                                                          },
                                                      },
                                                      [t._v("다시 재생하기")]
                                                  )
                                                : t._e(),
                                        ],
                                        2
                                    ),
                                    t._v(" "),
                                    t.type.controlsBtn && t.type.controlsBtn.fullscreen
                                        ? a("screenLayer", { attrs: { videoList: t.videoData, activeIdx: t.activeNumber, thumbInfo: t.thumbInfo, haslayerList: t.type.haslayerList }, on: { closeLayer: t.closeLayer } })
                                        : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "2a853bfa",
                        null
                    ));
            e.a = m.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = {
                    components: {
                        IcoBannerArrow: Object(i.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_banner_arrow", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 19 24", fill: "#ffe100", "fill-rule": "evenodd" } }, [
                                    e("use", { attrs: { "xlink:href": "#icoBannerArrow" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        StoreBtn: a(171).a,
                    },
                    props: ["visualData"],
                    mounted: function () {},
                    data: function () {
                        return { scrollDuration: 1e3, thumbInfo: { 375: "750x1270", 1440: "2880x1920", 1920: "3840x2160", 2560: "5120x2560" } };
                    },
                    computed: {
                        headerScrollOffset: function () {
                            var t = -60;
                            return this.isMobile && (t = -55), t;
                        },
                    },
                },
                n =
                    (a(325),
                    Object(i.a)(
                        s,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { ref: "visualInfo", staticClass: "info_visual", style: { background: "url(" + t.toThumb(t.thumbInfo, t.visualData.imageUrl)["data-src"] + ") 50% 50% /cover no-repeat" } }, [
                                a("div", { staticClass: "wrap_cont" }, [
                                    a(
                                        "div",
                                        { staticClass: "tit_visual" },
                                        [
                                            a("strong", { staticClass: "txt_visual", domProps: { innerHTML: t._s(t.visualData.title) } }),
                                            t._v(" "),
                                            t.visualData.store && !t.isMobile ? a("StoreBtn", { attrs: { storeData: t.visualData.store } }) : t._e(),
                                        ],
                                        1
                                    ),
                                    t._v(" "),
                                    a(
                                        "button",
                                        {
                                            directives: [
                                                {
                                                    name: "scroll-to",
                                                    rawName: "v-scroll-to",
                                                    value: { el: ".info_vod", duration: t.scrollDuration, offset: t.headerScrollOffset },
                                                    expression: "{\n        el: '.info_vod',\n        duration: scrollDuration,\n        offset: headerScrollOffset\n      }",
                                                },
                                            ],
                                            staticClass: "btn_scroll",
                                            attrs: { type: "button" },
                                        },
                                        [a("IcoBannerArrow"), t._v(" "), a("span", { domProps: { innerHTML: t._s("" + t.visualData.scrollText) } })],
                                        1
                                    ),
                                ]),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "31d96ac8",
                        null
                    ));
            e.a = n.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = {
                    props: ["introData"],
                    data: function () {
                        return {
                            vodOpt: { playBtn: !0, wide: !1, autoPlay: !1, controlsBtn: { playHasControler: !0, playBtn: !0, fullscreen: !1 }, haslayerList: !1, hasText: !1 },
                            thumbInfo: { 375: "690x412", 1440: "2880x1920", 1920: "2878x1720", 2560: "3200x1912" },
                        };
                    },
                    components: { productVod: a(29).a },
                },
                s = (a(326), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "section",
                            { staticClass: "info_vod" },
                            [
                                a("h4", { staticClass: "tit_vod" }, [t._v(t._s(t.introData.title))]),
                                t._v(" "),
                                a("p", { staticClass: "desc_vod", domProps: { innerHTML: t._s(t.introData.desc) } }),
                                t._v(" "),
                                a("productVod", { attrs: { videoData: t.introData.vodData, type: t.vodOpt, thumbInfo: t.thumbInfo, thumbType: "C", useThumbF: !1 } }),
                            ],
                            1
                        );
                    },
                    [],
                    !1,
                    null,
                    "57aa8fd7",
                    null
                );
            e.a = n.exports;
        },
        function (t, e, a) {
            "use strict";
            a(39);
            var i = {
                    props: { type: { type: String, default: "dot" }, currentPage: { type: Number, default: 0 }, slotSize: { type: Number, default: 1 } },
                    methods: {
                        moveToSlide: function (t) {
                            this.$emit("moveToSlide", t);
                        },
                    },
                },
                s = (a(284), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            { class: "wrap_paging paging_" + t.type },
                            [
                                "text" === t.type
                                    ? [
                                          a("span", { staticClass: "screen_out" }, [t._v("현재 페이지")]),
                                          t._v(" "),
                                          a("em", [t._v(t._s(t.currentPage))]),
                                          t._v(" "),
                                          a("span", [t._v("/")]),
                                          t._v(" "),
                                          a("span", { staticClass: "screen_out" }, [t._v("총 페이지")]),
                                          t._v(" "),
                                          a("span", [t._v(t._s(t.slotSize))]),
                                      ]
                                    : [
                                          t.isMobile
                                              ? t._l(t.slotSize, function (e) {
                                                    return a("span", { key: "dotPaging" + e, class: ["btn_dot", { on: t.currentPage === e }] }, [a("span", { staticClass: "inner" }, [t._v(t._s(e))])]);
                                                })
                                              : t._l(t.slotSize, function (e) {
                                                    return a(
                                                        "button",
                                                        {
                                                            key: "dotPaging" + e,
                                                            class: ["btn_dot", { on: t.currentPage === e }],
                                                            attrs: { type: "button" },
                                                            on: {
                                                                click: function (a) {
                                                                    return t.moveToSlide(e);
                                                                },
                                                            },
                                                        },
                                                        [a("span", { staticClass: "inner" }, [t._v(t._s(e))])]
                                                    );
                                                }),
                                      ],
                            ],
                            2
                        );
                    },
                    [],
                    !1,
                    null,
                    "6d73a134",
                    null
                );
            e.a = n.exports;
        },
        function (t, e, a) {
            "use strict";
            a(39);
            var i = {
                    props: {
                        nextProduct: { type: Object, default: {} },
                        thumbInfos0: {
                            type: Object,
                            default: function () {
                                return { 375: "752x800", 1440: "3840x2562", 1920: "3840x2562", 2560: "3840x2562" };
                            },
                        },
                    },
                    data: function () {
                        return { standardOpacity: 0.6, percent: 0, positionTop: 0 };
                    },
                    computed: {
                        isShowText: function () {
                            return this.percent >= 0.5;
                        },
                        opacity: function () {
                            return Number((this.standardOpacity * (1 - this.percent)).toFixed(3)) + 0.2;
                        },
                    },
                    mounted: function () {
                        this.getPointInfos(), window.addEventListener("scroll", this.onScrollSetState), window.addEventListener("resize", this.onScrollSetState);
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.onScrollSetState);
                    },
                    methods: {
                        getPointInfos: function () {
                            this.windowHeight = this.isMobile ? Math.max(document.documentElement.clientHeight, window.innerHeight, this.windowHeight || 0) : window.innerHeight;
                            var t = this.$refs.container.getBoundingClientRect(),
                                e = t.top,
                                a = t.height,
                                i = window.pageYOffset + e;
                            (this.containerHeight = Number(a)),
                                (this.positionTop = this.containerHeight * this.percent.toFixed(3)),
                                (this.alignCenterTop = this.windowHeight - this.containerHeight),
                                (this.reachStandardTop = i - this.alignCenterTop - a);
                        },
                        onScrollSetState: function () {
                            this.getPointInfos();
                            var t = window.pageYOffset,
                                e = t >= this.reachStandardTop,
                                a = t <= this.reachStandardTop + this.containerHeight;
                            e ? (e && a ? ((this.state = "active"), this.activeScrollActions(t)) : ((this.state = "done"), (this.percent = 1))) : ((this.state = "ready"), (this.percent = 0));
                        },
                        activeScrollActions: function (t) {
                            var e = t - this.reachStandardTop;
                            this.percent = e / this.containerHeight;
                        },
                    },
                },
                s = (a(338), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { ref: "container", staticClass: "next_product" }, [
                            a(
                                "div",
                                {
                                    staticClass: "inner_product",
                                    style: "transform: translateY(" + t.positionTop + "px);background: url(" + t.toThumb(t.thumbInfos0, t.nextProduct.image.background)["data-src"] + ") no-repeat 50% 50% /cover;",
                                },
                                [
                                    a("span", { staticClass: "thumb_frame", style: { opacity: t.opacity } }),
                                    t._v(" "),
                                    a("transition", { attrs: { name: "fade" } }, [
                                        a("div", { directives: [{ name: "show", rawName: "v-show", value: t.isShowText, expression: "isShowText" }], staticClass: "scale_item" }, [
                                            a("strong", { staticClass: "tit_next" }, [t._v("Next Product")]),
                                            t._v(" "),
                                            a(
                                                "div",
                                                { staticClass: "wrap_cont" },
                                                [
                                                    a("router-link", { staticClass: "link_cont", attrs: { to: t.nextProduct.about.link } }, [
                                                        a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.nextProduct.title) } }),
                                                        t._v(" "),
                                                        a("span", { staticClass: "txt_item", domProps: { innerHTML: t._s(t.nextProduct.about.text) } }),
                                                    ]),
                                                ],
                                                1
                                            ),
                                        ]),
                                    ]),
                                ],
                                1
                            ),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "4300cde6",
                    null
                );
            e.a = n.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = {
                    layout: "errLayout",
                    components: { IcoLogo: a(61).a },
                    methods: {
                        goToHistory: function () {
                            window.history.length > 2 ? this.$router.go(-1) : this.$router.push("/");
                        },
                    },
                },
                s = (a(274), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("div", { class: ["container-doc", "container_error"] }, [
                            e("header", { staticClass: "doc-header" }, [e("h1", { staticClass: "doc-title" }, [e("router-link", { attrs: { to: "/" } }, [e("IcoLogo")], 1)], 1)]),
                            this._v(" "),
                            e("main", { staticClass: "doc-main" }, [
                                e("article", { staticClass: "content-article" }, [
                                    e("h2", [this._v("해당 페이지를 찾을 수 없습니다.")]),
                                    this._v(" "),
                                    this._m(0),
                                    this._v(" "),
                                    e("button", { attrs: { type: "button" }, on: { click: this.goToHistory } }, [this._v("뒤로 가기")]),
                                ]),
                            ]),
                        ]);
                    },
                    [
                        function () {
                            var t = this.$createElement,
                                e = this._self._c || t;
                            return e("p", [this._v("잘못된 접근이거나 요청하신 페이지를 찾을 수 없습니다."), e("br"), this._v("입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주시기 바랍니다. 불편을 드려 죄송합니다.")]);
                        },
                    ],
                    !1,
                    null,
                    "32ad9752",
                    null
                );
            e.a = n.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = Object(i.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e(
                            "svg",
                            { staticClass: "ico_arrow", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 49 33", "fill-rule": "evenodd", preserveaspectratio: "none", fill: "none", stroke: "#FFE100", "stroke-width": "2" } },
                            [e("use", { attrs: { "xlink:href": "#icoArrow" } })]
                        );
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = s.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            a(28), a(39);
            var i = {
                    components: { Paging: a(32).a },
                    props: {
                        isTranslate: { type: Boolean, default: !0 },
                        slotSize: { type: Number, default: 3 },
                        isShowPaging: { type: Boolean, default: !0 },
                        minDeviceHeight: { type: Number, default: 668 },
                        customDistanceY: { type: Number, default: null },
                    },
                    data: function () {
                        return {
                            activeIdx: 0,
                            contentHeight: null,
                            translateY: 0,
                            windowHeight: 0,
                            prevItemHeight: 0,
                            nextItemHeight: 0,
                            alignCenterTop: 0,
                            state: "ready",
                            standardHeight: this.isMobile ? 50 : 100,
                            navHeight: 60,
                            contentItemMarginTop: 0,
                            minWidthpageXOffset: null,
                            allowScript: !0,
                            distanceY: null,
                            standardDistanceY: 600,
                        };
                    },
                    computed: {
                        totalHeight: function () {
                            return this.isMobile
                                ? this.distanceY * (this.slotSize - 1) + this.contentHeight + this.thumbElemHeight + this.contentItemMarginTop
                                : this.distanceY * this.slotSize + this.nextItemHeight + this.prevItemHeight + this.contentItemMarginTop;
                        },
                        contAlignPositionY: function () {
                            return this.isMobile ? this.navHeight - this.contentItemMarginTop : this.alignCenterTop - this.prevItemHeight - this.contentItemMarginTop;
                        },
                    },
                    mounted: function () {
                        this.slotSize <= 1 || (this.getPointInfos(), this.allowScript && (window.addEventListener("scroll", this.onScrollSetState), window.addEventListener("resize", this.getPointInfos)));
                    },
                    beforeDestroy: function () {
                        this.allowScript && (window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.getPointInfos));
                    },
                    methods: {
                        getPointInfos: function () {
                            if (this.isMobile) {
                                if (((this.windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight, this.windowHeight || 0)), !this.minDeviceHeight || this.windowHeight < this.minDeviceHeight))
                                    return (this.allowScript = !1);
                                this.$refs.desc;
                                var t = this.$refs.scroll,
                                    e = this.$refs.container.getBoundingClientRect().top,
                                    a = window.pageYOffset;
                                (this.contentItemMarginTop = Number(window.getComputedStyle(t).marginTop.replace("px", ""))), (this.prevItemHeight = this.$refs.prev.getBoundingClientRect().height);
                                var i = a + e + this.contentItemMarginTop + this.prevItemHeight;
                                (this.thumbElem = this.$refs.thumb.children),
                                    (this.navHeight = 56),
                                    (this.thumbElemHeight = this.$refs.thumb.getBoundingClientRect().height),
                                    (this.contentHeight = this.windowHeight - this.thumbElemHeight - this.navHeight),
                                    (this.reachStandardTop = i - this.navHeight),
                                    (this.distanceY = this.customDistanceY ? this.customDistanceY : this.standardDistanceY),
                                    (this.totalContentHeight = this.distanceY * (this.slotSize - 1));
                            } else {
                                this.windowHeight = window.innerHeight;
                                var s = this.$refs.scroll,
                                    n = this.$refs.container.getBoundingClientRect().top,
                                    r = window.pageYOffset + n;
                                (this.thumbElem = this.$refs.thumb.children),
                                    (this.thumbElemHeight = this.$refs.thumb.getBoundingClientRect().height),
                                    (this.contentItemMarginTop = Number(window.getComputedStyle(s).marginTop.replace("px", ""))),
                                    (this.contentHeight = this.thumbElemHeight),
                                    (this.distanceY = this.customDistanceY ? this.customDistanceY : this.contentHeight),
                                    (this.prevItemHeight = this.$refs.prev.getBoundingClientRect().height),
                                    (this.nextItemHeight = this.$refs.next.getBoundingClientRect().height),
                                    (this.alignCenterTop = (this.windowHeight - this.contentHeight + this.navHeight) / 2),
                                    (this.reachStandardTop = r - this.alignCenterTop + this.contentItemMarginTop + this.prevItemHeight),
                                    (this.totalContentHeight = this.distanceY * this.slotSize - this.contentHeight);
                            }
                        },
                        onScrollSetState: function () {
                            this.getPointInfos();
                            var t = window.pageYOffset,
                                e = t >= this.reachStandardTop,
                                a = t <= this.reachStandardTop + this.totalContentHeight;
                            e
                                ? e && a
                                    ? ((this.state = "active"), this.activeScrollActions(t))
                                    : ((this.state = "done"), (this.minWidthpageXOffset = null), (this.translateY = -this.totalContentHeight))
                                : ((this.state = "ready"), (this.minWidthpageXOffset = null), (this.translateY = 0));
                        },
                        activeScrollActions: function (t) {
                            window.innerWidth <= 1440 && (this.minWidthpageXOffset = -pageXOffset), (this.translateY = -1 * (t - this.reachStandardTop));
                            var e = this.distanceY / 2,
                                a = -1 * this.translateY,
                                i = Math.floor(a / this.distanceY),
                                s = a % this.distanceY;
                            (this.activeIdx = e <= s ? i + 1 : i), this.callback(this.activeIdx);
                        },
                        callback: function (t) {
                            this.$emit("callback", t);
                        },
                    },
                },
                s = (a(330), a(0)),
                n = Object(s.a)(
                    i,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return t.isMobile || 1 === t.slotSize
                            ? t.isMobile && 1 !== t.slotSize
                                ? a(
                                      "div",
                                      { ref: "container", class: ["cont_scroll " + t.state, { prevent_script: !t.allowScript }] },
                                      [
                                          a("div", { ref: "prev", staticClass: "prev_item" }, [t._t("prevItem")], 2),
                                          t._v(" "),
                                          t.allowScript
                                              ? a("div", { staticClass: "inner_scroll", style: "height: " + t.totalHeight + "px" }, [
                                                    a("div", { ref: "scroll", staticClass: "scroll_item", style: { top: t.contAlignPositionY + "px" } }, [
                                                        a(
                                                            "div",
                                                            { ref: "thumb", staticClass: "area_thumb" },
                                                            [
                                                                a(
                                                                    "transition-group",
                                                                    { attrs: { tag: "div", name: "fade" } },
                                                                    t._l(t.slotSize, function (e, i) {
                                                                        return a(
                                                                            "div",
                                                                            {
                                                                                directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }],
                                                                                key: "thumbItem" + i,
                                                                                class: ["wrap_thumb", { lst: i + 1 === t.slotSize, active: t.activeIdx == i }],
                                                                            },
                                                                            [t._t("thumb" + i)],
                                                                            2
                                                                        );
                                                                    }),
                                                                    0
                                                                ),
                                                                t._v(" "),
                                                                t.isShowPaging ? a("Paging", { attrs: { type: "text", slotSize: t.slotSize, currentPage: t.activeIdx + 1 } }) : t._e(),
                                                            ],
                                                            1
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                            "div",
                                                            { ref: "desc", staticClass: "area_desc", style: "height:" + t.contentHeight + "px;" },
                                                            [
                                                                a(
                                                                    "transition-group",
                                                                    { staticClass: "inner_desc", attrs: { name: "fade", tag: "div" } },
                                                                    t._l(t.slotSize, function (e, i) {
                                                                        return a(
                                                                            "div",
                                                                            {
                                                                                directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }],
                                                                                key: "desc" + i,
                                                                                class: ["wrap_cont", { active: t.activeIdx == i }],
                                                                            },
                                                                            [t._t("cont" + i)],
                                                                            2
                                                                        );
                                                                    }),
                                                                    0
                                                                ),
                                                            ],
                                                            1
                                                        ),
                                                    ]),
                                                ])
                                              : t._l(t.slotSize, function (e, i) {
                                                    return a("div", { key: "desc" + i, staticClass: "scroll_item" }, [
                                                        a("div", { staticClass: "area_thumb" }, [a("div", { class: ["wrap_thumb", { lst: i + 1 === t.slotSize }] }, [t._t("thumb" + i)], 2)]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_desc" }, [a("div", { staticClass: "inner_desc" }, [a("div", { staticClass: "wrap_cont" }, [t._t("cont" + i)], 2)])]),
                                                    ]);
                                                }),
                                          t._v(" "),
                                          a("div", { ref: "next", staticClass: "next_item" }, [t._t("nextItem")], 2),
                                      ],
                                      2
                                  )
                                : a("div", { staticClass: "cont_scroll ty_static prevent_script" }, [
                                      a("div", { ref: "prev", staticClass: "prev_item" }, [t._t("prevItem")], 2),
                                      t._v(" "),
                                      a("div", { staticClass: "scroll_item" }, [
                                          a("div", { ref: "thumb", staticClass: "area_thumb" }, [a("div", { staticClass: "wrap_thumb" }, [t._t("thumb0")], 2)]),
                                          t._v(" "),
                                          a("div", { staticClass: "area_desc" }, [a("div", { staticClass: "wrap_cont" }, [t._t("cont0")], 2)]),
                                      ]),
                                      t._v(" "),
                                      a("div", { ref: "next", staticClass: "next_item" }, [t._t("nextItem")], 2),
                                  ])
                            : a("div", { ref: "container", class: "cont_scroll " + t.state, style: "height: " + t.totalHeight + "px" }, [
                                  a("div", { staticClass: "inner_scroll", style: { top: t.contAlignPositionY + "px", transform: t.minWidthpageXOffset ? "translateX(" + t.minWidthpageXOffset + "px)" : "" } }, [
                                      a("div", { ref: "prev", staticClass: "prev_item" }, [t._t("prevItem")], 2),
                                      t._v(" "),
                                      a("div", { ref: "scroll", staticClass: "scroll_item" }, [
                                          a(
                                              "div",
                                              { ref: "thumb", staticClass: "area_thumb", attrs: { tag: "div" } },
                                              [
                                                  t._l(t.slotSize, function (e, i) {
                                                      return a(
                                                          "div",
                                                          { key: "thumb" + i, class: ["wrap_thumb", { lst: i + 1 === t.slotSize, active: t.activeIdx == i }], style: { opacity: t.activeIdx === i ? 1 : 0 } },
                                                          [t._t("thumb" + i)],
                                                          2
                                                      );
                                                  }),
                                                  t._v(" "),
                                                  t.isShowPaging ? a("Paging", { attrs: { type: "text", slotSize: t.slotSize, currentPage: t.activeIdx + 1 } }) : t._e(),
                                              ],
                                              2
                                          ),
                                          t._v(" "),
                                          a("div", { ref: "desc", staticClass: "area_desc", style: "height:" + t.contentHeight + "px;" }, [
                                              t.isTranslate
                                                  ? a(
                                                        "div",
                                                        { staticClass: "inner_desc", style: { transform: "translateY(" + t.translateY + "px)" } },
                                                        t._l(t.slotSize, function (e, i) {
                                                            return a("div", { key: "desc" + i, class: ["wrap_cont", { active: t.activeIdx == i }] }, [t._t("cont" + i)], 2);
                                                        }),
                                                        0
                                                    )
                                                  : a("div", { staticClass: "inner_desc" }, [a("div", { staticClass: "wrap_cont" }, [t._t("contItem")], 2)]),
                                          ]),
                                      ]),
                                      t._v(" "),
                                      a("div", { ref: "next", staticClass: "next_item" }, [t._t("nextItem")], 2),
                                  ]),
                              ]);
                    },
                    [],
                    !1,
                    null,
                    "b9993608",
                    null
                );
            e.a = n.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(26),
                s = {
                    name: "infoSpec",
                    props: { specDatas: { type: Array, default: [] } },
                    data: function () {
                        return { specDataList: Object(i.a)(this.specDatas) };
                    },
                    methods: {
                        onClickSpecItem: function (t) {
                            this.specDataList[t].isOn = !this.specDataList[t].isOn;
                        },
                    },
                    computed: {
                        name: function () {
                            return this.data;
                        },
                    },
                },
                n = (a(350), a(0)),
                r = Object(n.a)(
                    s,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("section", { staticClass: "info_spec" }, [
                            a("h4", { staticClass: "tit_spec" }, [t._v("스펙보기")]),
                            t._v(" "),
                            a(
                                "ul",
                                { staticClass: "list_spec" },
                                t._l(t.specDataList, function (e, i) {
                                    return a("li", { key: "spec" + i, class: { on: e.isOn } }, [
                                        t.specDataList.length > 1
                                            ? a(
                                                  "button",
                                                  {
                                                      staticClass: "btn_spec",
                                                      attrs: { type: "button" },
                                                      on: {
                                                          click: function (e) {
                                                              return t.onClickSpecItem(i);
                                                          },
                                                      },
                                                  },
                                                  [t._v(t._s(e.title))]
                                              )
                                            : 1 === t.specDataList.length
                                            ? a("strong", { staticClass: "tit_cont" }, [t._v(t._s(e.title))])
                                            : t._e(),
                                        t._v(" "),
                                        a(
                                            "dl",
                                            { staticClass: "list_cont" },
                                            [
                                                t._l(e.items, function (e, i) {
                                                    return [a("dt", { key: "titleItem" + i, domProps: { innerHTML: t._s(e.title) } }), t._v(" "), a("dd", { key: "contitem" + i, domProps: { innerHTML: t._s(e.cont) } })];
                                                }),
                                            ],
                                            2
                                        ),
                                        t._v(" "),
                                        e.description ? a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }) : t._e(),
                                    ]);
                                }),
                                0
                            ),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "5786b9de",
                    null
                );
            e.a = r.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = Object(i.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_logo", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 82 18", fill: "#000000" } }, [
                            e("title", [this._v("kakaoi")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoLogoFoot" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = s.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        function (t, e, a) {},
        ,
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = Object(i.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_buy", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 29", "fill-rule": "evenodd", fill: "none", "stroke-width": ".96" } }, [
                            e("use", { attrs: { "xlink:href": "#icoBuy" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                n = { props: { storeData: { type: Object, default: {} } }, components: { IcoBuy: s } },
                r =
                    (a(278),
                    Object(i.a)(
                        n,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return t.storeData
                                ? a(
                                      "a",
                                      { staticClass: "link_store", attrs: { href: t.storeData.url || "javascript:;", "data-tiara-action-name": t.storeData.tiaraLog.name, "data-tiara-layer": t.storeData.tiaraLog.layer, target: "_blank" } },
                                      [a("IcoBuy"), t._v(t._s(t.storeData.text || "구매하기") + "\n")],
                                      1
                                  )
                                : t._e();
                        },
                        [],
                        !1,
                        null,
                        "622225f8",
                        null
                    ));
            e.a = r.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(4),
                s = a(59),
                n = a(173),
                r = {
                    components: { ScrollBNV: s.a, Banner: i.a, Command: n.a },
                    name: "infoVoice",
                    props: { voiceData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos0: { 375: "510x1078", 1440: "832x1764", 1920: "832x1764", 2560: "832x1764" }, thumbInfos1: { 375: "750x960", 1440: "2880x1440", 1920: "3840x1800", 2560: "5120x2400" }, activeIdx: 0 };
                    },
                    methods: {
                        animatedCommand: function (t) {
                            this.activeIdx = t;
                        },
                    },
                },
                o = (a(332), a(0)),
                c = Object(o.a)(
                    r,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            { staticClass: "info_voice" },
                            [
                                a("div", { staticClass: "cont_command" }, [
                                    a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.voiceData.intro.title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.voiceData.intro.description) } }),
                                ]),
                                t._v(" "),
                                a("Banner", {
                                    attrs: { options: { type: "wide" } },
                                    scopedSlots: t._u([
                                        {
                                            key: "slot0",
                                            fn: function () {
                                                return [
                                                    a(
                                                        "div",
                                                        { staticClass: "layer_cont" },
                                                        [
                                                            a(
                                                                "transitionGroup",
                                                                { staticClass: "wrap_tit", attrs: { tag: "div", name: "fade-text" } },
                                                                t._l(t.voiceData.banner.commandList, function (e, i) {
                                                                    return a("strong", { directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }], key: i, staticClass: "tit_item" }, [
                                                                        t._v(t._s(e.title)),
                                                                    ]);
                                                                }),
                                                                0
                                                            ),
                                                            t._v(" "),
                                                            a("Command", { ref: "command", attrs: { type: "product", commandList: t.voiceData.banner.commandList }, on: { animatedCommand: t.animatedCommand } }),
                                                        ],
                                                        1
                                                    ),
                                                    t._v(" "),
                                                    a(
                                                        "img",
                                                        t._b(
                                                            {
                                                                directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                staticClass: "img_bnv",
                                                                attrs: { alt: t.voiceData.banner.image.imgDescription },
                                                            },
                                                            "img",
                                                            t.toThumb(t.thumbInfos1, t.voiceData.banner.image.url),
                                                            !1
                                                        )
                                                    ),
                                                ];
                                            },
                                            proxy: !0,
                                        },
                                    ]),
                                }),
                            ],
                            1
                        );
                    },
                    [],
                    !1,
                    null,
                    "3578502b",
                    null
                );
            e.a = c.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(26),
                s =
                    (a(53),
                    a(28),
                    a(39),
                    {
                        props: { type: { type: String, default: "product" }, commandList: { type: Array, default: [] } },
                        mounted: function () {
                            this.commandList && this.commandList.length > 0 && (this.setCommandWidth(), this.animatedCommand());
                        },
                        data: function () {
                            return { slideIndex: 0, delaySlideIdx: 0, intervalDuration: 3e3, timeOut: null, commandWidths: [] };
                        },
                        methods: {
                            animatedCommand: function () {
                                var t = this,
                                    e = this.commandList.length - 1;
                                this.timeOut = window.setTimeout(function () {
                                    (t.slideIndex = t.slideIndex === e ? 0 : t.slideIndex + 1), t.$emit("animatedCommand", t.slideIndex), t.animatedCommand();
                                }, this.intervalDuration);
                            },
                            setCommandWidth: function () {
                                var t = this,
                                    e = "partner" === this.type ? (this.isMobile ? 20 : 40) : 0,
                                    a = this.$refs.command[0],
                                    s = window.getComputedStyle(a),
                                    n = s.fontFamily,
                                    r = s.fontWeight,
                                    o = s.fontSize,
                                    c = s.paddingLeft,
                                    l = (Number(c.replace("px", "")), n.split(",")[0]);
                                this.commandWidths = Object(i.a)(this.commandList).map(function (a, i) {
                                    var s = a.command,
                                        n = (s.replace(/(\<br\>|\<br\/\>)/, " "), "partner" === t.type ? "“ ".concat(s, " ”") : s);
                                    return t.getTextWidth(n, "".concat(r, " ").concat(o, " ").concat(l)) + e;
                                });
                            },
                            getTextWidth: function (t, e) {
                                var a = document.createElement("canvas").getContext("2d");
                                return (a.font = e), a.measureText(t).width;
                            },
                        },
                    }),
                n = (a(331), a(0)),
                r = Object(n.a)(
                    s,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { class: "wrap_command ty_" + t.type }, [
                            a(
                                "ul",
                                { staticClass: "emph_command", style: { width: t.commandWidths[t.slideIndex] + "px" } },
                                t._l(t.commandList, function (e, i) {
                                    return a(
                                        "li",
                                        { key: "commandItem" + i, class: { on: t.slideIndex === i } },
                                        [
                                            a("transition", { attrs: { name: "slide" } }, [
                                                a("span", {
                                                    directives: [{ name: "show", rawName: "v-show", value: t.slideIndex === i, expression: "slideIndex === index" }],
                                                    ref: "command",
                                                    refInFor: !0,
                                                    staticClass: "txt_command",
                                                    domProps: { innerHTML: t._s("" + e.command) },
                                                }),
                                            ]),
                                        ],
                                        1
                                    );
                                }),
                                0
                            ),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "444a097f",
                    null
                );
            e.a = r.exports;
        },
        function (t, e, a) {
            "use strict";
            a(20), a(12), a(7), a(5), a(9), a(53);
            var i = a(6),
                s = a(8);
            a(70);
            function n(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            function r(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var a = null != arguments[e] ? arguments[e] : {};
                    e % 2
                        ? n(Object(a), !0).forEach(function (e) {
                              Object(i.a)(t, e, a[e]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                        : n(Object(a)).forEach(function (e) {
                              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                          });
                }
                return t;
            }
            var o = {
                    components: { IcoArrow: a(45).a },
                    data: function () {
                        return {
                            onSNBCategoryIdx: 0,
                            onSubCategoryIdx: 0,
                            isReachSNB: !1,
                            onSNBState: "none",
                            onMenuLiMatch: null,
                            snbPositionY: 0,
                            scrollPositionX: "translateX(0px)",
                            thumbInfo: { 375: "32x32", 1440: "32x32", 1920: "32x32", 2560: "32x32" },
                            stickyTop: 0,
                        };
                    },
                    watch: {
                        $route: function () {
                            this.$refs.sticky["@@vue-sticky-directive"] && this.$refs.sticky["@@vue-sticky-directive"].update();
                        },
                    },
                    computed: r(
                        r({}, Object(s.b)("SNB", ["SNBData"])),
                        {},
                        {
                            isMatchedPath: function () {
                                var t = this;
                                return function (e, a) {
                                    return t.$route.path.split("/")[a] === e;
                                };
                            },
                        }
                    ),
                    mounted: function () {
                        if (this.SNBData || 0 !== this.SNBData.length) {
                            this.isMobile ? (this.setOnIdx(), window.addEventListener("scroll", this.onScrollReachPoint)) : window.addEventListener("scroll", this.snbpageXOffset);
                            var t = window.innerHeight;
                            this.stickyTop = t - 240;
                        }
                    },
                    beforeDestroy: function () {
                        this.isMobile ? window.removeEventListener("scroll", this.onScrollReachPoint) : (this.snbpageXOffset(), window.removeEventListener("scroll", this.snbpageXOffset));
                    },
                    methods: {
                        setOnIdx: function () {
                            var t = this.$route.params,
                                e = t.slug,
                                a = t.detail,
                                i = 0,
                                s = 0;
                            this.SNBData.forEach(function (t, n) {
                                var r = t.code,
                                    o = void 0 === r ? "" : r,
                                    c = t.serviceSubCategoryList;
                                e === o && (i = n),
                                    c &&
                                        c.forEach(function (t, e) {
                                            var i = t.code;
                                            a === (void 0 === i ? "" : i) && (s = e);
                                        });
                            }),
                                (this.onSNBCategoryIdx = i),
                                (this.onSubCategoryIdx = s);
                        },
                        onClickSNB: function (t) {
                            this.$refs.subList.forEach(function (e, a) {
                                t !== a && e.classList.remove("on");
                            }),
                                this.$refs.subList[t].classList.toggle("on"),
                                this.$refs.sticky["@@vue-sticky-directive"] && this.$refs.sticky["@@vue-sticky-directive"].update();
                        },
                        onClickMoSNB: function (t) {
                            (this.onSNBCategoryIdx = t), (this.onSubCategoryIdx = 0), this.onClickSelectBtn("sub");
                        },
                        onClickSelectBtn: function (t) {
                            this.onSNBState === t ? (this.onSNBState = "none") : (this.onSNBState = t);
                        },
                        onScrollReachPoint: function () {
                            var t = this.$refs.SNB.getBoundingClientRect().top;
                            (this.snbPositionY = window.pageYOffset + t), (this.isReachSNB = this.snbPositionY < window.pageYOffset);
                        },
                        snbpageXOffset: function () {
                            this.scrollPositionX = "translateX(-".concat(window.pageXOffset, "px)");
                        },
                    },
                },
                c = (a(280), a(0)),
                l = Object(c.a)(
                    o,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return !t.isMobile && t.SNBData && 0 !== t.SNBData.length
                            ? a("div", { staticClass: "content-feature" }, [
                                  a("div", { staticClass: "feature_inner" }, [
                                      a("nav", { staticClass: "content-snb" }, [
                                          a("h3", { staticClass: "screen_out" }, [t._v("서비스 메뉴")]),
                                          t._v(" "),
                                          a("strong", { staticClass: "tit_snb" }, [t._v("할 수 있는 일")]),
                                          t._v(" "),
                                          a(
                                              "ul",
                                              { staticClass: "list_snb", attrs: { "data-tiara-layer": "leftmenu" } },
                                              t._l(t.SNBData, function (e, i) {
                                                  return a(
                                                      "li",
                                                      { key: "SNBMenu" + i, ref: "subList", refInFor: !0, class: { on: t.isMatchedPath(e.code, 2) } },
                                                      [
                                                          e.serviceSubCategoryList && 0 !== e.serviceSubCategoryList.length
                                                              ? a(
                                                                    "button",
                                                                    {
                                                                        staticClass: "btn_item btn_service",
                                                                        attrs: { type: "button" },
                                                                        on: {
                                                                            click: function (e) {
                                                                                return t.onClickSNB(i);
                                                                            },
                                                                        },
                                                                    },
                                                                    [t._v(t._s(e.name))]
                                                                )
                                                              : t._e(),
                                                          t._v(" "),
                                                          e.serviceSubCategoryList && 0 !== e.serviceSubCategoryList.length
                                                              ? a(
                                                                    "ul",
                                                                    { staticClass: "list_sub" },
                                                                    t._l(e.serviceSubCategoryList, function (e, i) {
                                                                        return a(
                                                                            "li",
                                                                            { key: "SNBCategoryItem" + i },
                                                                            [
                                                                                a(
                                                                                    "router-link",
                                                                                    {
                                                                                        class: ["link_sub", { on: t.isMatchedPath(e.code, 3) }],
                                                                                        attrs: {
                                                                                            to: "/service/" + e.categoryParentCode + "/" + e.code,
                                                                                            "data-tiara-action-name": "서비스상세_" + e.name + "_클릭",
                                                                                            "data-tiara-layer": e.code,
                                                                                        },
                                                                                    },
                                                                                    [
                                                                                        a(
                                                                                            "img",
                                                                                            t._b(
                                                                                                {
                                                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }],
                                                                                                    attrs: { alt: "" },
                                                                                                },
                                                                                                "img",
                                                                                                t.toThumb(t.thumbInfo, e.iconImg, "C", !1),
                                                                                                !1
                                                                                            )
                                                                                        ),
                                                                                        t._v(t._s(e.name)),
                                                                                    ]
                                                                                ),
                                                                            ],
                                                                            1
                                                                        );
                                                                    }),
                                                                    0
                                                                )
                                                              : a(
                                                                    "router-link",
                                                                    { staticClass: "btn_item link_service", attrs: { to: "/service/" + e.code, "data-tiara-action-name": "서비스상세_" + e.name + "_클릭", "data-tiara-layer": e.code } },
                                                                    [t._v(t._s(e.name))]
                                                                ),
                                                      ],
                                                      1
                                                  );
                                              }),
                                              0
                                          ),
                                      ]),
                                      t._v(" "),
                                      a(
                                          "div",
                                          {
                                              directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                              ref: "sticky",
                                              staticClass: "wrap_btn",
                                              attrs: { "sticky-offset": "{top: " + t.stickyTop + ", bottom: 0}", "on-stick": "onStick", "sticky-z-index": "20", "sticky-placeHolder": "true", "sticky-side": "top" },
                                          },
                                          [
                                              t.isMobile
                                                  ? t._e()
                                                  : a(
                                                        "button",
                                                        {
                                                            directives: [
                                                                {
                                                                    name: "scroll-to",
                                                                    rawName: "v-scroll-to",
                                                                    value: { el: ".container-doc", duration: 1e3, offset: -60 },
                                                                    expression: "{\n          el: '.container-doc',\n          duration: 1000,\n          offset: -60\n        }",
                                                                },
                                                            ],
                                                            staticClass: "btn_top",
                                                            attrs: { type: "button" },
                                                        },
                                                        [a("IcoArrow"), t._v("Back to top")],
                                                        1
                                                    ),
                                          ]
                                      ),
                                  ]),
                              ])
                            : t.isMobile && t.SNBData && 0 !== t.SNBData.length
                            ? a("div", { ref: "SNB", class: ["content-feature", { snb_fixed: t.isReachSNB }] }, [
                                  a("nav", { staticClass: "content-snb" }, [
                                      a("h3", { staticClass: "screen_out" }, [t._v("서비스 메뉴")]),
                                      t._v(" "),
                                      a("div", { class: ["snb_main", { open_list: "main" === t.onSNBState }] }, [
                                          a(
                                              "button",
                                              {
                                                  staticClass: "txt_selected",
                                                  attrs: { type: "button" },
                                                  on: {
                                                      click: function (e) {
                                                          return t.onClickSelectBtn("main");
                                                      },
                                                  },
                                              },
                                              [t._v(t._s(t.SNBData[t.onSNBCategoryIdx].name))]
                                          ),
                                          t._v(" "),
                                          a(
                                              "ul",
                                              { staticClass: "list_snb", attrs: { "data-tiara-layer": "leftmenu" } },
                                              t._l(t.SNBData, function (e, i) {
                                                  return a(
                                                      "li",
                                                      { key: "SNBMenu" + i, class: { on: t.isMatchedPath(e.code, 2) } },
                                                      [
                                                          e.serviceSubCategoryList && 0 !== e.serviceSubCategoryList.length
                                                              ? a(
                                                                    "button",
                                                                    {
                                                                        staticClass: "btn_item",
                                                                        attrs: { type: "button" },
                                                                        on: {
                                                                            click: function (e) {
                                                                                return t.onClickMoSNB(i);
                                                                            },
                                                                        },
                                                                    },
                                                                    [t._v(t._s(e.name))]
                                                                )
                                                              : a("router-link", { staticClass: "btn_item", attrs: { to: "/service/" + e.code, "data-tiara-action-name": "서비스상세_" + e.name + "_클릭", "data-tiara-layer": e.code } }, [
                                                                    t._v(t._s(e.name)),
                                                                ]),
                                                      ],
                                                      1
                                                  );
                                              }),
                                              0
                                          ),
                                      ]),
                                      t._v(" "),
                                      t.SNBData[t.onSNBCategoryIdx].serviceSubCategoryList
                                          ? a("div", { class: ["snb_sub", { open_list: "sub" === t.onSNBState }] }, [
                                                a(
                                                    "button",
                                                    {
                                                        staticClass: "txt_selected",
                                                        attrs: { type: "button" },
                                                        on: {
                                                            click: function (e) {
                                                                return t.onClickSelectBtn("sub");
                                                            },
                                                        },
                                                    },
                                                    [t._v(t._s((t.SNBData[t.onSNBCategoryIdx].serviceSubCategoryList[t.onSubCategoryIdx] || {}).name))]
                                                ),
                                                t._v(" "),
                                                0 !== t.SNBData[t.onSNBCategoryIdx].length
                                                    ? a(
                                                          "ul",
                                                          { staticClass: "list_snb", attrs: { "data-tiara-layer": "leftmenu" } },
                                                          t._l((t.SNBData[t.onSNBCategoryIdx] || {}).serviceSubCategoryList, function (e, i) {
                                                              return a(
                                                                  "li",
                                                                  { key: "SNBCategoryItem" + i },
                                                                  [
                                                                      a(
                                                                          "router-link",
                                                                          {
                                                                              staticClass: "btn_item",
                                                                              attrs: {
                                                                                  to: "/service/" + t.SNBData[t.onSNBCategoryIdx].code + "/" + e.code,
                                                                                  "data-tiara-action-name": "서비스상세_" + e.name + "_클릭",
                                                                                  "data-tiara-layer": e.code,
                                                                              },
                                                                          },
                                                                          [t._v(t._s(e.name))]
                                                                      ),
                                                                  ],
                                                                  1
                                                              );
                                                          }),
                                                          0
                                                      )
                                                    : t._e(),
                                            ])
                                          : t._e(),
                                  ]),
                              ])
                            : t._e();
                    },
                    [],
                    !1,
                    null,
                    "22fd8c18",
                    null
                );
            e.a = l.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = Object(i.a)(
                    {},
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("svg", { staticStyle: { position: "absolute" }, attrs: { xmlns: "http://www.w3.org/2000/svg", width: "0", height: "0" } }, [
                            a("defs", [
                                a("g", { attrs: { id: "icoAIItem", fill: "none", "fill-rule": "evenodd" } }, [
                                    a("g", [
                                        a("mask", { attrs: { id: "icoAIItemMask", fill: "#fff" } }, [a("path", { attrs: { d: "M0 0h24v24H0z" } })]),
                                        t._v(" "),
                                        a("path", {
                                            attrs: { fill: "#343646", d: "M18.73 24H5.27A5.27 5.27 0 010 18.73V5.27C0 2.36 2.36 0 5.27 0h13.46C21.64 0 24 2.36 24 5.27v13.46c0 2.91-2.36 5.27-5.27 5.27", mask: "url(#icoAIItemMask)" },
                                        }),
                                    ]),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            fill: "#FEE009",
                                            d:
                                                "M12 4c-2.14 0-4.15.83-5.66 2.34A7.95 7.95 0 004 12c0 2.14.83 4.15 2.34 5.66A7.95 7.95 0 0012 20c2.14 0 4.15-.83 5.66-2.34A7.95 7.95 0 0020 12c0-2.14-.83-4.15-2.34-5.66A7.95 7.95 0 0012 4m0 17a9.01 9.01 0 010-18 9.01 9.01 0 010 18",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            fill: "#2D2F3A",
                                            d:
                                                "M11.5 19c-2 0-3.89-.78-5.3-2.2A7.45 7.45 0 014 11.5c0-2 .78-3.89 2.2-5.3A7.45 7.45 0 0111.5 4c2 0 3.89.78 5.3 2.2a7.45 7.45 0 012.2 5.3c0 2-.78 3.89-2.2 5.3a7.45 7.45 0 01-5.3 2.2M12 3a8.94 8.94 0 00-8.3 5.5 8.94 8.94 0 000 7A8.97 8.97 0 0012 21a8.94 8.94 0 008.3-5.5 8.94 8.94 0 000-7A8.97 8.97 0 0012 3m0 17c2.14 0 4.15-.83 5.66-2.34A7.95 7.95 0 0020 12c0-2.14-.83-4.15-2.34-5.66A7.95 7.95 0 0012 4c-2.14 0-4.15.83-5.66 2.34A7.95 7.95 0 004 12c0 2.14.83 4.15 2.34 5.66A7.95 7.95 0 0012 20m0-17a9 9 0 110 18 9 9 0 010-18",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { fill: "none", "fill-rule": "evenodd" } }, [
                                    a("g", [
                                        a("mask", { attrs: { id: "icoAIMask", fill: "#fff" } }, [a("path", { attrs: { d: "M0 0h24v24H0z" } })]),
                                        t._v(" "),
                                        a("path", { attrs: { fill: "#343646", d: "M18.73 24H5.27A5.27 5.27 0 010 18.73V5.27C0 2.36 2.36 0 5.27 0h13.46C21.64 0 24 2.36 24 5.27v13.46c0 2.91-2.36 5.27-5.27 5.27", mask: "url(#icoAIMask)" } }),
                                    ]),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            fill: "#FEE009",
                                            d:
                                                "M12 4c-2.14 0-4.15.83-5.66 2.34A7.95 7.95 0 004 12c0 2.14.83 4.15 2.34 5.66A7.95 7.95 0 0012 20c2.14 0 4.15-.83 5.66-2.34A7.95 7.95 0 0020 12c0-2.14-.83-4.15-2.34-5.66A7.95 7.95 0 0012 4m0 17a9.01 9.01 0 010-18 9.01 9.01 0 010 18",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            fill: "#2D2F3A",
                                            d:
                                                "M11.5 19c-2 0-3.89-.78-5.3-2.2A7.45 7.45 0 014 11.5c0-2 .78-3.89 2.2-5.3A7.45 7.45 0 0111.5 4c2 0 3.89.78 5.3 2.2a7.45 7.45 0 012.2 5.3c0 2-.78 3.89-2.2 5.3a7.45 7.45 0 01-5.3 2.2M12 3a8.94 8.94 0 00-8.3 5.5 8.94 8.94 0 000 7A8.97 8.97 0 0012 21a8.94 8.94 0 008.3-5.5 8.94 8.94 0 000-7A8.97 8.97 0 0012 3m0 17c2.14 0 4.15-.83 5.66-2.34A7.95 7.95 0 0020 12c0-2.14-.83-4.15-2.34-5.66A7.95 7.95 0 0012 4c-2.14 0-4.15.83-5.66 2.34A7.95 7.95 0 004 12c0 2.14.83 4.15 2.34 5.66A7.95 7.95 0 0012 20m0-17a9 9 0 110 18 9 9 0 010-18",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "IcoAlliance" } }, [
                                    a("path", { attrs: { d: "M9.58 0H6.71c-.17 0-.3.08-.38.21-.16.3.04.59.34.59h1.91L5.12 4.29a.4.4 0 000 .58.4.4 0 00.59 0L9.17 1.4v1.93c0 .2.16.38.41.42.21 0 .42-.21.42-.42V.42C10 .21 9.8 0 9.58 0z" } }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            d: "M7.22 8.8c0 .2-.18.35-.36.35H1.14a.36.36 0 01-.36-.36V3.1c0-.21.18-.35.36-.35h4.58L6.47 2H1.14C.54 2 0 2.5 0 3.14v5.72C0 9.46.5 10 1.14 10h5.72C7.46 10 8 9.5 8 8.86V3.5l-.75.75v4.55h-.03z",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("clipPath", { attrs: { id: "acbea125-0673-4081-b9a6-73113be42b87", transform: "translate(6.49 6.84)" } }, [
                                    a("path", { attrs: { fill: "none", "clip-rule": "evenodd", d: "M12.16,6.59a1.07,1.07,0,0,1,0,2L1.67,15C.75,15.5,0,15.08,0,14V1.19C0,.11.74-.31,1.67.25Z" } }),
                                ]),
                                t._v(" "),
                                a("clipPath", { attrs: { id: "e9648590-f632-458a-8fc5-743437c0f2d2", transform: "translate(6.49 6.84)" } }, [a("rect", { attrs: { fill: "none", x: "-109.01", y: "-72.94", width: "231", height: "160" } })]),
                                t._v(" "),
                                a("clipPath", { attrs: { id: "e699874e-232b-4990-bf8a-26d38ca79927", transform: "translate(6.49 6.84)" } }, [a("rect", { attrs: { fill: "none", x: "-10.01", y: "-10.94", width: "30", height: "36" } })]),
                                t._v(" "),
                                a("clipPath", { attrs: { id: "b39369e3-5688-40d8-a258-71262dc334ad", transform: "translate(6.49 6.84)" } }, [a("rect", { attrs: { fill: "none", x: "-0.01", y: "-0.94", width: "13", height: "17" } })]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoAnd", "clip-path": "url(#acbea125-0673-4081-b9a6-73113be42b87)" } }, [
                                    a("g", { attrs: { "clip-path": "url(#e9648590-f632-458a-8fc5-743437c0f2d2)" } }, [
                                        a("g", { attrs: { isolation: "isolate" } }, [
                                            a("g", { attrs: { "clip-path": "url(#e699874e-232b-4990-bf8a-26d38ca79927)" } }, [
                                                a("g", { attrs: { "clip-path": "url(#b39369e3-5688-40d8-a258-71262dc334ad)" } }, [
                                                    a("rect", { staticClass: "fill", attrs: { fill: "#fff", x: "1.49", y: "1.84", width: "22.86", height: "25.19" } }),
                                                    t._v(" "),
                                                    a("g", { staticClass: "stroke", attrs: { stroke: "#333646", "stroke-miterlimit": "10", "stroke-width": "1.25px", fill: "none" } }, [
                                                        a("polygon", { attrs: { points: "3.48 2.71 14.67 14.36 17.99 11.04 3.48 2.71" } }),
                                                        t._v(" "),
                                                        a("polygon", { attrs: { points: "14.67 14.35 19.76 19.73 4.55 25.1 14.67 14.35" } }),
                                                    ]),
                                                ]),
                                            ]),
                                        ]),
                                    ]),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoAndD", "clip-path": "url(#acbea125-0673-4081-b9a6-73113be42b87)" } }, [
                                    a("g", { attrs: { "clip-path": "url(#e9648590-f632-458a-8fc5-743437c0f2d2)" } }, [
                                        a("g", { attrs: { isolation: "isolate" } }, [
                                            a("g", { attrs: { "clip-path": "url(#e699874e-232b-4990-bf8a-26d38ca79927)" } }, [
                                                a("g", { attrs: { "clip-path": "url(#b39369e3-5688-40d8-a258-71262dc334ad)" } }, [
                                                    a("rect", { staticClass: "fill", attrs: { fill: "#333", x: "1.49", y: "1.84", width: "22.86", height: "25.19" } }),
                                                    t._v(" "),
                                                    a("g", { staticClass: "stroke", attrs: { stroke: "#fff", "stroke-miterlimit": "10", "stroke-width": "1.25px", fill: "none" } }, [
                                                        a("polygon", { attrs: { points: "3.48 2.71 14.67 14.36 17.99 11.04 3.48 2.71" } }),
                                                        t._v(" "),
                                                        a("polygon", { attrs: { points: "14.67 14.35 19.76 19.73 4.55 25.1 14.67 14.35" } }),
                                                    ]),
                                                ]),
                                            ]),
                                        ]),
                                    ]),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoArrowL" } }, [a("path", { attrs: { fill: "#131415", d: "M0 6h16v2H0z" } }), t._v(" "), a("path", { attrs: { stroke: "#131415", "stroke-width": "2", d: "M10 13l6-6.02L10 1" } })]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoArrow" } }, [a("path", { attrs: { d: "m32 0 15 15.5-15 15.5" } }), t._v(" "), a("path", { attrs: { d: "m0 15.409668h47.401367" } })]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoBannerArrow" } }, [
                                    a("path", { attrs: { d: "m0 11.4285714 9.14285714 9.1428572v3.4285714l-9.14285714-9.1428571z" } }),
                                    t._v(" "),
                                    a("path", { attrs: { d: "m9.14285714 11.4285714 9.14285716 9.1428572v3.4285714l-9.14285716-9.1428571z", transform: "matrix(-1 0 0 1 27.428572 0)" } }),
                                    t._v(" "),
                                    a("path", { attrs: { d: "m8 0h2.285714v22.857143h-2.285714z" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoTop" } }, [a("path", { attrs: { stroke: "#3578F7", d: "M4.17 12.5V.77h1.07V12.5z" } }), t._v(" "), a("path", { attrs: { stroke: "#3578F7", d: "M8.93 4.8L4.7.78.5 4.8" } })]),
                                t._v(" "),
                                a("circle", { attrs: { id: "icoCircleS", cx: "10", cy: "518", r: "10", fill: "#D8D8D8", "fill-rule": "evenodd", transform: "translate(0 -508)" } }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoCircleD", transform: "translate(0 1)" } }, [
                                    a("circle", { attrs: { cx: "10", cy: "10", r: "10", opacity: ".5" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "22", cy: "10", r: "10.5", stroke: "#fff" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoBuy", transform: "translate(1)" } }, [
                                    a("g", { attrs: { stroke: "#fff", "stroke-linejoin": "round" } }, [
                                        a("path", { attrs: { d: "m15.6860477 9.77705993 6.3139523 3.02294007-11 5.8630208-11-5.8630208 6.3283211-3.02801867" } }),
                                        t._v(" "),
                                        a("path", { attrs: { d: "m0 12.8 11 5.8630208v9.697777l-11-5.8630209z" } }),
                                        t._v(" "),
                                        a("path", { attrs: { d: "m11 12.8 11 5.8630208v9.697777l-11-5.8630209z", transform: "matrix(-1 0 0 1 33 0)" } }),
                                    ]),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            d:
                                                "m11 14c-.2277832 0-.4473877-.081158-.6185303-.2285871-.64636226-.5558605-1.26953123-1.0782252-1.81933592-1.5390011l-.00280759-.0024012c-1.6119385-1.350993-3.00390625-2.5176997-3.97241213-3.66699822-1.08264159-1.28484203-1.58691406-2.50305286-1.58691406-3.83387643 0-1.29300589.45080566-2.48588483 1.26928712-3.35905397.82824707-.88349399 1.96472166-1.37008198 3.20043944-1.37008198.923584 0 1.76940919.28717456 2.513916.85347991.37573244.28585393.71630864.63569788 1.01635744 1.04376909.3001709-.40807121.640625-.75791516 1.0164795-1.04376909.7445068-.56630535 1.590332-.85347991 2.513916-.85347991 1.2355957 0 2.3721924.48658799 3.2004395 1.37008198.8184814.87316914 1.269165 2.06604808 1.269165 3.35905397 0 1.33082357-.5041504 2.5490344-1.586792 3.83375638-.9685058 1.14941857-2.3603516 2.31600517-3.9720459 3.66687817-.5507812.4614963-1.1749268.9847014-1.8227539 1.5418825-.1710205.147189-.3907471.228347-.6184082.228347zm-3.49885065-13c-.96218392 0-1.84609137.37616662-2.48912012 1.05928712-.65258644.69343131-1.01202923 1.65198069-1.01202923 2.69917929 0 1.10491539.41920879 2.09309353 1.3591317 3.20405319.90846712 1.0738645 2.25973485 2.2018903 3.82429697 3.5080442l.00290361.0023703c.54696762.4566384 1.16700952.9743119 1.81233692 1.5270659.6491989-.5538207 1.2702086-1.0723238 1.8182651-1.5296732 1.5644411-1.3061539 2.9155879-2.4339427 3.824055-3.5078072.9398019-1.11095966 1.3590107-2.0991378 1.3590107-3.20405319 0-1.0471986-.3594428-2.00574798-1.0120292-2.69917929-.6429078-.6831205-1.5269362-1.05928712-2.4889992-1.05928712-.7048514 0-1.3519936.21948976-1.9233999.6523066-.5092207.38588486-.8639452.8736926-1.0719163 1.21501582-.1069496.17552075-.2952004.28028801-.5036554.28028801s-.3967058-.10476726-.5036554-.28028801c-.2078501-.34132322-.56257456-.82913096-1.07191625-1.21501582-.57140633-.43281684-1.21854854-.6523066-1.923279-.6523066z",
                                            fill: "#fff",
                                            "fill-rule": "nonzero",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("mask", { attrs: { id: "icoFacebookMask", fill: "white" } }, [a("polygon", { attrs: { points: "0.001171875 0.000785854617 20 0.000785854617 20 19.9956778 0.001171875 19.9956778" } })]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoFacebook" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M20,10.0589391 C20,4.50353635 15.5228516,0 10,0 C4.47714844,0 0,4.50353635 0,10.0589391 C0,15.0796464 3.65685547,19.2410609 8.4375,19.9956778 L8.4375,12.9666012 L5.8984375,12.9666012 L5.8984375,10.0589391 L8.4375,10.0589391 L8.4375,7.84282908 C8.4375,5.32180747 9.93042969,3.92927308 12.2146484,3.92927308 C13.3087305,3.92927308 14.453125,4.12573674 14.453125,4.12573674 L14.453125,6.60117878 L13.1921484,6.60117878 C11.9499023,6.60117878 11.5625,7.37656189 11.5625,8.17204322 L11.5625,10.0589391 L14.3359375,10.0589391 L13.8925781,12.9666012 L11.5625,12.9666012 L11.5625,19.9956778 C16.3431445,19.2410609 20,15.0796464 20,10.0589391",
                                            fill: "#BDBDBD",
                                            mask: "url(#icoFacebookMask)",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M14.410274,12.9320388 L14.8767123,10.0582524 L11.9589041,10.0582524 L11.9589041,8.19333981 C11.9589041,7.40712621 12.3664726,6.6407767 13.6733836,6.6407767 L15,6.6407767 L15,4.19417476 C15,4.19417476 13.7960342,4 12.645,4 C10.2418767,4 8.67123288,5.37631068 8.67123288,7.86796117 L8.67123288,10.0582524 L6,10.0582524 L6,12.9320388 L8.67123288,12.9320388 L8.67123288,19.8792233 C9.20685616,19.9586408 9.75583562,20 10.3150685,20 C10.8743014,20 11.4232808,19.9586408 11.9589041,19.8792233 L11.9589041,12.9320388 L14.410274,12.9320388",
                                            fill: "#FFFFFF",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoLogo", transform: "translate(-350.000000, -50.000000)" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M446,67 L443,67 L443,57 C442.942683,57.1063156 442.834792,57 443,57 L437,57 C437.10765,57 437,57.1063156 437,57 L437,59 C437,59.5113799 437.10765,59.6179333 437,60 L440,60 L440,67 L437,67 C437.10765,67.3818288 437,67.4881445 437,68 L437,70 C437,69.8934465 437.10765,70 437,70 L446,70 C445.89235,70 446,69.8934465 446,70 L446,68 C446,67.4881445 445.89235,67.3818288 446,67 M441,54 C442.134323,54 443,53.1460594 443,52 C443,50.8844641 442.115483,50 441,50 C439.853992,50 439,50.8656254 439,52 C439,53.1646596 439.83539,54 441,54 M395,57 C394.937344,57.052077 394.853703,57 395,57 L392,57 C391.469959,57 391.401986,57.0318645 391,57 L386,63 C385.982163,63.4380545 385.982163,63.5619455 386,64 L391,70 C391.401986,69.9683733 391.469959,70 392,70 L395,70 C394.853703,70 394.937344,69.9481607 395,70 C395.016406,69.7840824 395.004595,69.6870621 395,70 L390,63 L395,57 C395.004595,57.3131757 395.016406,57.2161554 395,57 M386,50 L383,50 C383.110426,50 383,50.1078009 383,50 L383,70 C383,69.8921991 383.110426,70 383,70 L386,70 C385.889574,70 386,69.8921991 386,70 L386,50 C386,50.1078009 385.889574,50 386,50 M404,67 C401.794066,67 400,65.2056469 400,63 C400,60.7943531 401.794066,59 404,59 C406.2057,59 408,60.7943531 408,63 C408,65.2056469 406.2057,67 404,67 M411,56 L409,56 C408.415051,56.3473046 408.307477,56.4551223 408,57 L408,57 C407.118561,56.5570989 405.623716,56 404,56 C400.1401,56 397,59.1401005 397,63 C397,66.8598995 400.1401,70 404,70 C405.623716,70 407.118561,69.4429011 408,69 L408,69 C408.307477,69.5451211 408.415051,69.6526954 409,70 L411,70 C410.892669,69.6526954 411,69.5451211 411,69 L411,57 C411,56.4551223 410.892669,56.3473046 411,56 M371,67 C368.794248,67 367,65.2056469 367,63 C367,60.7943531 368.794248,59 371,59 C373.205518,59 375,60.7943531 375,63 C375,65.2056469 373.205518,67 371,67 M378,56 L376,56 C375.415051,56.3473046 375.307477,56.4551223 375,57 L375,57 C374.118561,56.5570989 372.623716,56 371,56 C367.1401,56 364,59.1401005 364,63 C364,66.8598995 367.1401,70 371,70 C372.623716,70 374.118561,69.4429011 375,69 L375,69 C375.307477,69.5451211 375.415051,69.6526954 376,70 L378,70 C377.892426,69.6526954 378,69.5451211 378,69 L378,57 C378,56.4551223 377.892426,56.3473046 378,56 M362,57 C361.937449,57.052077 361.853809,57 362,57 L359,57 C358.470094,57 358.402121,57.0318645 358,57 L353,63 C352.982103,63.4380545 352.982103,63.5619455 353,64 L358,70 C358.402121,69.9683733 358.470094,70 359,70 L362,70 C361.853809,70 361.937449,69.9481607 362,70 C362.016269,69.7840824 362.004699,69.6870621 362,70 L357,63 L362,57 C362.004699,57.3131757 362.016269,57.2161554 362,57 M353,50 L350,50 C350.110667,50 350,50.1078009 350,50 L350,70 C350,69.8921991 350.110667,70 350,70 L353,70 C352.889583,70 353,69.8921991 353,70 L353,50 C353,50.1078009 352.889583,50 353,50 M422,67 C419.794325,67 418,65.2054873 418,63 C418,60.7945127 419.794325,59 422,59 C424.205675,59 426,60.7945127 426,63 C426,65.2054873 424.205675,67 422,67 M422,56 C418.140235,56 415,59.1401005 415,63 C415,66.8598995 418.140235,70 422,70 C425.859765,70 429,66.8598995 429,63 C429,59.1401005 425.859765,56 422,56",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("path", { attrs: { id: "icoFull", d: "M5 13V5h8M5 19v8h8M27 13V5h-8M27 19v8h-8" } }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoHeykakao" } }, [
                                    a("circle", { attrs: { cx: "25", cy: "25", r: "24.5" } }),
                                    t._v(" "),
                                    a("rect", { attrs: { x: "20.0000002", y: "8.83333333", width: "11.0000005", height: "23.000001", rx: "5.50000024" } }),
                                    t._v(" "),
                                    a("path", { attrs: { d: "M35.25,26.333334 C35.25,31.7181106 30.8847769,36.0833344 25.5000004,36.0833344 C20.1152239,36.0833344 15.75,31.7181106 15.75,26.333334" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "25.5000004", y1: "36.0833344", x2: "25.5000004", y2: "40.5833346" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "19.5000002", y1: "40.5833346", x2: "31.5000007", y2: "40.5833346", "stroke-linecap": "square" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoIos" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M11.08 9.4c0-2.02 1.68-3 1.76-3.06-.96-1.4-2.45-1.58-2.97-1.6-1.26-.12-2.47.75-3.1.75-.66 0-1.64-.74-2.7-.72-1.36.02-2.63.8-3.33 2.02-1.44 2.47-.37 6.1 1 8.1.7 1 1.5 2.1 2.57 2.05 1.04-.04 1.43-.66 2.68-.66 1.23 0 1.6.65 2.67.62 1.1 0 1.8-.98 2.48-1.97.8-1.12 1.12-2.23 1.13-2.3-.03 0-2.15-.8-2.18-3.24",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", { attrs: { d: "M9.05 3.43c.55-.7.93-1.63.83-2.58-.8.04-1.8.55-2.4 1.23-.5.6-.96 1.57-.84 2.48.9.07 1.83-.45 2.4-1.13" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoKakaohome", transform: "translate(1.000000, 0.000000)" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M49.2994833,22.2557736 L26.0376517,2.46506902 C25.4393314,1.95608811 24.5606686,1.95608811 23.9624725,2.46506902 L0.700516743,22.2557736 C0.132627863,22.7390195 0.4739574,23.6684629 1.21934261,23.6684629 L5.21853733,23.6684629 L5.21853733,46.3128919 C5.21853733,47.1985734 5.93597525,47.9166667 6.82084848,47.9166667 L43.1791515,47.9166667 C44.0640247,47.9166667 44.7814627,47.1984491 44.7814627,46.3127676 L44.7814627,23.6684629 L48.7806574,23.6684629 C49.5260426,23.6684629 49.8673721,22.7390195 49.2994833,22.2557736",
                                        },
                                    }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "25", cy: "28.3333333", r: "13.6666667" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoKakaomini" } }, [
                                    a("line", { attrs: { x1: "31.6666667", y1: "17.5", x2: "31.6666667", y2: "20.8333333" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "33.3333333", y1: "19.1666667", x2: "30", y2: "19.1666667" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "33.3333333", y1: "30.8333333", x2: "30", y2: "30.8333333" } }),
                                    t._v(" "),
                                    a("rect", { attrs: { x: "0.5", y: "0.5", width: "48", height: "49", rx: "14" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "19.1666667", cy: "19.1666667", r: "3.66666667" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "31.6666667", cy: "19.1666667", r: "3.66666667" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "19.1666667", cy: "30.8333333", r: "3.66666667" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "31.6666667", cy: "30.8333333", r: "3.66666667" } }),
                                    t._v(" "),
                                    a("rect", { attrs: { x: "28", y: "15.5", width: "7.33333333", height: "19", rx: "3.66666667" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "25", cy: "25", r: "19.5" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { transform: "translate(19.166667, 30.833333) scale(-1, -1) translate(-19.166667, -30.833333) ", cx: "19.1666667", cy: "30.8333333", r: "1" } }),
                                ]),
                                t._v(" "),
                                a("path", {
                                    attrs: {
                                        id: "icoLogoFoot",
                                        d:
                                            "M81.7941245,14.9476929 L79.3754906,14.9353318 L79.4202144,6.40138025 C79.4209243,6.29081727 79.3286371,6.20085609 79.2150529,6.20016936 L74.5247346,6.17681669 C74.4104405,6.17613393 74.3174434,6.26472166 74.3167335,6.37597137 L74.3067949,8.17794199 C74.306085,8.28850497 74.3983722,8.37846616 74.5126663,8.37915288 L76.9313002,8.39151396 L76.897225,14.9229707 L74.4771712,14.9106096 C74.3628771,14.9099229 74.26988,14.9991974 74.2691701,15.1097604 L74.2599414,16.9124177 C74.2599414,17.022294 74.3515187,17.1129419 74.4658128,17.1136286 L81.7820562,17.150029 C81.8970602,17.1507118 81.9893474,17.0614374 81.9900573,16.9508744 L82,15.1489038 C82.0007058,15.0383408 81.9084187,14.9483796 81.7941245,14.9476929 M78.1821464,4.0830154 C79.1774281,4.08779832 79.9327632,3.3749761 79.9377566,2.4252332 C79.9427018,1.47755048 79.1788479,0.731078661 78.2006039,0.726247726 C77.2181004,0.721464489 76.4734139,1.44390088 76.4677091,2.40737831 C76.4627653,3.37360264 77.1840251,4.07749742 78.1821464,4.0830154 M38.668327,6.1108949 C38.6349616,6.04222224 38.5639715,5.99758501 38.4844625,5.99758501 L35.7215264,5.98316375 C35.659765,5.98316375 35.6015531,6.00994609 35.5625085,6.05595677 L30.9829349,11.3046082 C30.9211734,11.3774012 30.9204635,11.481097 30.9815151,11.5545767 L35.5042966,16.8492389 C35.5433412,16.8952495 35.6015531,16.9227186 35.6633145,16.9227186 L38.4255407,16.9364531 C38.5050496,16.9364531 38.5767497,16.8931894 38.6115348,16.8245167 C38.6456101,16.755844 38.6356715,16.6741236 38.5866883,16.6150651 L33.9914968,11.4440137 L38.6413507,6.32034651 C38.6917537,6.26197475 38.7024022,6.18025429 38.668327,6.1108949 M30.3326652,0.486603989 L28.2576235,0.476299094 C28.1447492,0.475616364 28.0524621,0.563517369 28.0517522,0.6727069 L27.9665599,16.6864846 C27.9658541,16.7956742 28.0567215,16.8842619 28.1695958,16.8849486 L30.2446374,16.8959363 C30.3575118,16.8959363 30.4497989,16.8080353 30.4505088,16.6988457 L30.5357011,0.685067979 C30.5364069,0.575878448 30.4455395,0.487290716 30.3326652,0.486603989 M46.0832466,14.9175288 C44.1381169,14.9078627 42.5635557,13.3689084 42.5741505,11.4872775 C42.5841428,9.60633333 44.1750318,8.08248699 46.1201615,8.09273597 C48.0652912,8.10240206 49.6398524,9.64066966 49.6292576,11.5229873 C49.6192653,13.4046182 48.0290863,14.9277778 46.0832466,14.9175288 M51.758908,6.06351076 L49.8797991,6.05458332 C49.7669248,6.05389659 49.6753475,6.1417976 49.6746376,6.25098713 L49.6703782,6.99127841 C48.664448,6.22077116 47.3958542,5.75585724 46.0165159,5.74891752 C42.7353518,5.73319527 40.0526346,8.30155278 40.0362184,11.4742297 C40.0185593,14.6475933 42.6743003,17.2434199 45.9547545,17.2599785 C47.3348027,17.2667686 48.6076559,16.8149025 49.6221049,16.0540094 L49.6185554,16.7943007 C49.6178455,16.904177 49.7087129,16.9934514 49.8215872,16.9934514 L51.7006961,17.0030656 C51.8142803,17.0037523 51.9058576,16.9151646 51.9065675,16.8059751 L51.9633596,6.26266148 C51.9633596,6.15347195 51.8732021,6.06419749 51.758908,6.06351076 M18.1181025,14.7774366 C16.1722628,14.7677705 14.5984115,13.2288162 14.6083033,11.347872 C14.6182888,9.4662411 16.2084678,7.94308149 18.1543074,7.95265039 C20.0994371,7.96230983 21.6739984,9.50057743 21.6641065,11.3828951 C21.6534112,13.264526 20.0632322,14.7876856 18.1181025,14.7774366 M23.7937638,5.92341854 L21.913945,5.91449109 C21.8010707,5.91380436 21.7087835,6.00170537 21.7087835,6.1108949 L21.7045241,6.85118618 C20.697884,6.08067893 19.4300002,5.61645174 18.0506618,5.60881889 C14.7702076,5.59241631 12.0874904,8.16146055 12.069668,11.3348242 C12.0534152,14.5081878 14.7084462,17.1033277 17.9889004,17.1198864 C19.3682387,17.1266764 20.6418018,16.675497 21.6562508,15.9146039 L21.6519914,16.6542085 C21.6512815,16.7640848 21.7428588,16.8526725 21.8557331,16.8533592 L23.7355519,16.8629734 C23.8484262,16.8636601 23.9400035,16.7757591 23.9407134,16.6658828 L23.9975055,6.12256925 C23.9975055,6.01337972 23.9066381,5.92410526 23.7937638,5.92341854 M10.7024729,5.97080267 C10.6698174,5.90213001 10.5974075,5.85749278 10.5193183,5.85749278 L7.75567233,5.84374536 C7.69391092,5.84307152 7.635699,5.86985386 7.59594453,5.91586454 L3.01708077,11.164516 C2.95531935,11.237309 2.95460945,11.3410047 3.01566097,11.4137978 L7.53844252,16.7084599 C7.57748709,16.7551573 7.635699,16.7826264 7.69675052,16.7826264 L10.4603965,16.7963609 C10.5391956,16.7963609 10.6116055,16.7537839 10.6456808,16.6844245 C10.679756,16.6157518 10.6705273,16.5347181 10.6201243,16.4749729 L6.02635263,11.3046082 L10.6754966,6.18094101 C10.7258996,6.12188253 10.7358382,6.04016206 10.7024729,5.97080267 M2.36681113,0.346511761 L0.291769458,0.336206897 C0.178185241,0.335524136 0.0866079656,0.424111868 0.0858980643,0.533301399 L0,16.5463924 C0,16.6555819 0.0908673738,16.7448564 0.20374169,16.7448564 L2.27878336,16.755848 C2.39165767,16.7565308 2.48394485,16.667943 2.48394485,16.5587535 L2.56984705,0.545662477 C2.57055282,0.436472947 2.47968544,0.347198488 2.36681113,0.346511761 M61.2289921,14.8804405 C59.3484634,14.8714662 57.825725,13.3833297 57.8356152,11.5635042 C57.8456022,9.74436538 59.3839585,8.2713368 61.2644872,8.28090418 C63.1457258,8.29056515 64.6684642,9.77870171 64.6585739,11.5978405 C64.6492968,13.4169793 63.1109406,14.8900078 61.2289921,14.8804405 M61.2779753,5.82582448 C57.9975211,5.80942192 55.314094,8.37777943 55.2976778,11.5511431 C55.2800187,14.7245067 57.9357597,17.3196466 61.2162139,17.3362069 C64.4966681,17.3526095 67.1793853,14.7842519 67.1972077,11.6108883 C67.2134606,8.43752464 64.5584295,5.8423848 61.2779753,5.82582448",
                                    },
                                }),
                                t._v(" "),
                                a("path", { attrs: { id: "icoMessage", d: "M4.88 20c0-9.86-1.34-15.86-4-18C-3.58-.2 10.33.58 12.9 6c1.2 3.78-1.47 8.45-8.02 14z" } }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoMinihexa", transform: "translate(1.000000, 1.000000)" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M2.99813367,16.0010177 C3.05987371,15.8719955 3.12202127,15.7434004 3.18478012,15.615019 C3.3043887,15.3697913 3.42542362,15.125418 3.54788488,14.8816855 C3.57233638,14.8329818 3.59678787,14.7844916 3.62144314,14.7360015 C3.65323008,14.6731992 3.68501703,14.6106106 3.71680398,14.548022 C3.74879469,14.4854334 3.7807854,14.4228448 3.81297988,14.3602562 C3.84517435,14.2978812 3.87716506,14.2355062 3.9095633,14.1731312 C3.94196154,14.1107562 3.97435977,14.0483812 4.00675801,13.9860062 C4.03936001,13.9238448 4.071962,13.8616834 4.104564,13.799522 C4.13736976,13.7373606 4.17017553,13.6754129 4.20298129,13.6132515 C4.23599081,13.5513037 4.26900033,13.4893559 4.30200986,13.4274081 L4.39879704,13.2471188 C4.43119528,13.1870935 4.46359351,13.1270682 4.49599175,13.0672566 C4.52859375,13.0072313 4.56119575,12.9476333 4.59379775,12.8876081 C4.62660351,12.82801 4.65940927,12.7681984 4.69201127,12.7083867 C4.72522455,12.6487887 4.75803031,12.5889771 4.79103984,12.5295926 C4.79817153,12.5165622 4.80530321,12.5037455 4.8124349,12.4909287 C5.03698117,12.0869865 5.26560268,11.685394 5.49850321,11.2863649 C5.53395788,11.2259124 5.56941256,11.1654599 5.60486723,11.1050075 C5.64052567,11.0447686 5.67598034,10.9845297 5.71163878,10.9240772 C5.74750097,10.864052 5.78315941,10.8038131 5.81902161,10.7435742 C5.85508757,10.6833354 5.89094977,10.6235237 5.92701573,10.5632848 C5.96308169,10.5034732 5.99935141,10.4434479 6.03541737,10.3834227 C6.0716871,10.323611 6.10816058,10.2637994 6.14443031,10.2039878 C6.18110756,10.1443897 6.21758104,10.0845781 6.25425829,10.0247664 L6.3644938,9.84618596 C6.40137481,9.78658793 6.43825582,9.72720351 6.47513683,9.66781909 C6.51242537,9.60843467 6.54951014,9.54905025 6.58659491,9.48966584 C6.62388345,9.43049503 6.66137575,9.37132423 6.69866429,9.31215342 C6.72331955,9.27306224 6.74797481,9.23418467 6.77263007,9.19509349 C6.78424453,9.17715 6.79565523,9.1592065 6.80706593,9.1410494 L6.86574953,9.04876858 C6.88551449,9.0180083 6.90527945,8.98746164 6.92484065,8.95648775 L6.98393177,8.86463416 C7.00369674,8.8340875 7.0234617,8.80332722 7.04322666,8.77278056 L7.10272531,8.68092696 C7.12249027,8.6503803 7.14225523,8.61983364 7.16222395,8.58928698 C7.18198892,8.55874032 7.20195764,8.52819366 7.22192636,8.49786061 C7.24189509,8.46710034 7.26186381,8.43676729 7.28183254,8.40622063 C7.30180126,8.37567397 7.32176998,8.34534092 7.34194247,8.31479426 C7.3619112,8.2842476 7.38208368,8.25391455 7.40205241,8.22336789 C7.41387063,8.20542439 7.42589262,8.1874809 7.43771084,8.16953741 C7.45115917,8.14945778 7.46440373,8.12916455 7.47785205,8.10908493 C7.49904335,8.07725659 7.52023465,8.04521463 7.54142595,8.01338629 C7.56282101,7.98155796 7.58401231,7.94972962 7.60540737,7.91790128 C7.62680243,7.88607294 7.64799373,7.8542446 7.6693888,7.82241626 C7.69078386,7.79080153 7.71238268,7.75918681 7.73377774,7.72735847 C7.75537657,7.69574374 7.77677163,7.6639154 7.79837045,7.63230068 C7.81996928,7.60068595 7.8415681,7.56907123 7.86316692,7.5374565 C7.88476575,7.50584177 7.90656834,7.47422705 7.92816716,7.44282593 C7.94996975,7.41121121 7.97177233,7.37981009 7.99377868,7.34840898 C8.01558127,7.31700787 8.03738386,7.28539314 8.0593902,7.25399203 C8.08139655,7.22280453 8.1034029,7.19140342 8.12540925,7.1600023 C8.36340384,6.82270735 8.59691566,6.50442396 8.85080372,6.17994579 C9.10122782,5.85973988 9.36020995,5.54893295 9.63141783,5.2477386 C9.90242194,4.94697147 10.1844292,4.65752584 10.4778472,4.3811106 C10.771469,4.10448175 11.0767052,3.8410969 11.3923333,3.59266496 C12.0233857,3.09601471 12.6972283,2.65874886 13.4034691,2.28919835 C13.7565895,2.10442309 14.1176566,1.93652326 14.4850404,1.78549886 C14.8524242,1.63447446 15.2263283,1.5005391 15.6047153,1.38326556 C15.9831022,1.26620562 16.3661757,1.16580751 16.7521019,1.0803623 C17.1382318,0.994917096 17.5272144,0.924211189 17.9176233,0.864826771 C18.3127188,0.804801514 18.6953847,0.757806651 19.0925178,0.715511274 C19.1293989,0.711666239 19.1664836,0.707821205 19.2033646,0.703976171 C19.2402456,0.70034475 19.2773304,0.696499715 19.3142114,0.692654681 C19.3510924,0.68902326 19.3881772,0.685391839 19.425262,0.681760417 C19.462143,0.678342609 19.499024,0.674711188 19.5361088,0.671079767 C19.5731936,0.667661958 19.6100746,0.66424415 19.6471593,0.660826342 C19.6842441,0.657408534 19.7211251,0.653990726 19.7582099,0.650572917 C19.7952947,0.647368722 19.8321757,0.644164527 19.8692605,0.640746719 C19.9061415,0.637542523 19.9432262,0.634338328 19.980311,0.631134133 C20.017192,0.628143551 20.0544806,0.624939356 20.0913616,0.62173516 C20.1284463,0.618744578 20.1653274,0.615753996 20.2024121,0.612549801 C20.2252335,0.610840897 20.2482587,0.60891838 20.2710801,0.607209475 C20.3077573,0.604218893 20.3444346,0.601228311 20.3813156,0.598451342 C20.449576,0.593111016 20.5176327,0.587770691 20.5856894,0.582643979 C20.6539498,0.577517266 20.7220065,0.572604167 20.7900632,0.567477455 C20.8583236,0.562777968 20.926584,0.558078482 20.9948445,0.553378996 C21.0631049,0.548893123 21.1313653,0.544193636 21.199422,0.539707763 C21.2676824,0.535435503 21.3359429,0.531163242 21.4044071,0.526890982 C21.4726675,0.522832335 21.5407242,0.518560074 21.6089846,0.51471504 C21.677245,0.510870006 21.7455055,0.507024972 21.8137659,0.503179937 C21.8820264,0.499548516 21.9504905,0.496130708 22.018751,0.492499287 C22.0870114,0.489081479 22.1552719,0.48566367 22.2237361,0.482459475 C22.2919965,0.47925528 22.3602569,0.476264698 22.4285174,0.473060502 C22.4969816,0.47006992 22.565242,0.467292951 22.6337062,0.464515982 C23.0092405,0.449349458 23.4408094,0.436319064 23.8167512,0.428842608 C24.2096053,0.420725314 24.6073497,0.416666667 25.0002038,0.416666667 C25.3932616,0.416666667 25.7908022,0.420725314 26.1836563,0.428842608 C26.5593943,0.436319064 26.9909633,0.449349458 27.3664976,0.464515982 C27.434758,0.467292951 27.5032222,0.47006992 27.5714826,0.473060502 C27.6399468,0.476264698 27.7082073,0.47925528 27.7764677,0.482459475 C27.8447281,0.48566367 27.9131923,0.489081479 27.9814528,0.492499287 C28.0497132,0.496130708 28.1179736,0.499548516 28.1862341,0.503179937 C28.2544945,0.507024972 28.3229587,0.510870006 28.3912191,0.514501427 L28.5957967,0.526890982 C28.6640571,0.531163242 28.7323176,0.535435503 28.800578,0.539707763 C28.8686347,0.544193636 28.9368951,0.548893123 29.0051555,0.553378996 C29.073416,0.558078482 29.1416764,0.562777968 29.2099368,0.567477455 C29.2779935,0.572604167 29.3462539,0.577517266 29.4145144,0.582643979 C29.4825711,0.587770691 29.5508315,0.593111016 29.6190919,0.598451342 C29.6557692,0.601228311 29.6924464,0.604218893 29.7291237,0.607209475 C29.7521488,0.60891838 29.775174,0.610840897 29.7979954,0.612549801 C29.8350802,0.615753996 29.8721649,0.618744578 29.9092497,0.62173516 L30.0203003,0.631134133 C30.0571813,0.634338328 30.0942661,0.637756136 30.1313508,0.640746719 C30.1682318,0.644164527 30.2053166,0.647368722 30.2424014,0.65078653 C30.2792824,0.653990726 30.3163672,0.657408534 30.3532482,0.660826342 C30.390333,0.66424415 30.4274177,0.667661958 30.464095,0.671079767 L30.5751455,0.681760417 C30.6122303,0.685391839 30.6491113,0.68902326 30.6859923,0.692654681 C30.7230771,0.696499715 30.7601619,0.70034475 30.7968391,0.703976171 C30.8339239,0.707821205 30.8710087,0.711666239 30.9076859,0.715511274 C31.304819,0.757806651 31.687485,0.804801514 32.0825804,0.864826771 C32.4731931,0.924211189 32.861972,0.994917096 33.2481019,1.0803623 C33.6340281,1.16580751 34.0171015,1.26620562 34.3952847,1.38326556 C34.7738754,1.5005391 35.1475758,1.63447446 35.5151634,1.78549886 C35.8823434,1.93652326 36.2438181,2.10442309 36.5967347,2.28919835 C37.3027717,2.65874886 37.9774293,3.09601471 38.6080742,3.59287858 C38.9237023,3.84131051 39.2283273,4.10469536 39.5217453,4.3811106 C39.8157745,4.65773945 40.0973743,4.94654425 40.3687859,5.2477386 C40.6401976,5.54871934 40.8989759,5.85973988 41.1496038,6.18015941 C41.4043069,6.50570564 41.6361886,6.82142567 41.8747945,7.16021592 C41.8968009,7.19140342 41.9188072,7.22259092 41.9408136,7.25399203 C41.9626161,7.28539314 41.9846225,7.31679426 42.0064251,7.34798176 C42.0280239,7.37959648 42.0498265,7.41099759 42.0716291,7.44239871 L42.1368331,7.53681566 C42.1582281,7.56843039 42.179827,7.60004511 42.2014258,7.63165984 L42.2658147,7.72650402 C42.2872098,7.75811874 42.3086049,7.78994708 42.3299999,7.82156181 C42.351395,7.85317653 42.37279,7.88500487 42.3939813,7.91683321 C42.4153764,7.94866155 42.4365677,7.98027628 42.4579628,8.01210462 C42.4789503,8.04393296 42.5003454,8.0757613 42.5213329,8.10758963 C42.5351887,8.1283101 42.5488408,8.14903056 42.5622892,8.16953741 C42.5743111,8.1874809 42.5861294,8.20521078 42.5977438,8.22315427 L42.6580575,8.31458065 C42.67823,8.34491369 42.6981987,8.37546035 42.7181675,8.40600702 C42.73834,8.43634006 42.7581049,8.46688672 42.7780736,8.49743339 C42.7980424,8.52798005 42.8178073,8.55852671 42.837776,8.58907337 L42.8974785,8.68071335 C42.9172434,8.71147363 42.9370084,8.74202029 42.9567733,8.77256695 C42.9765383,8.80311361 42.9963033,8.83366027 43.0160682,8.86442054 L43.0751593,8.95627414 C43.0949243,8.98703441 43.1142817,9.01779469 43.1340467,9.04855496 C43.1538117,9.07931524 43.1733729,9.11007551 43.1929341,9.14083578 C43.2045485,9.15899289 43.2159592,9.17693638 43.2273699,9.19509349 C43.2520252,9.23397106 43.2768842,9.27306224 43.3015395,9.31193981 C43.338828,9.37111061 43.3763203,9.43028142 43.4134051,9.48966584 C43.4506936,9.54883664 43.4875746,9.60822106 43.5248632,9.66760548 C43.5619479,9.7269899 43.5986252,9.78658793 43.63571,9.84597234 C43.6723872,9.90557038 43.7090645,9.96516841 43.7459455,10.0247664 C43.7826227,10.0845781 43.8188924,10.1443897 43.8555697,10.2039878 C43.8920432,10.2637994 43.9285167,10.323611 43.9645826,10.3834227 L44.073188,10.5632848 C44.109254,10.6235237 44.14532,10.683549 44.1811822,10.7435742 C44.2170444,10.8038131 44.2527028,10.864052 44.288565,10.9242908 C44.3242234,10.9845297 44.3598819,11.0449822 44.3955403,11.1052211 C44.4307912,11.1656735 44.4662459,11.226126 44.5017006,11.2865785 C44.57424,11.4104741 44.5993028,11.4534103 44.599099,11.4536239 C45.2126279,12.5120764 45.7970187,13.588686 46.3516602,14.682171 C46.3942466,14.7667617 46.4368329,14.8511389 46.4796231,14.9357296 C46.5413631,15.0598388 46.6031031,15.1837343 46.6648432,15.3078435 C46.7149687,15.4101641 46.7650943,15.5126984 46.8156274,15.615019 C46.8241854,15.6333897 46.833151,15.6515468 46.8421165,15.6699176 C46.8582138,15.7030276 46.8745148,15.7363512 46.890612,15.7694612 C46.9067092,15.8027849 46.9228065,15.8361085 46.9387,15.8692185 C46.9547972,15.9025421 46.9706907,15.9358658 46.9867879,15.9691894 L47.0346721,16.0689467 L47.0823525,16.1691312 C47.098246,16.2022412 47.1141395,16.2357784 47.1298292,16.2691021 C47.1457226,16.3024257 47.1616161,16.3357493 47.1773058,16.369073 C47.1929955,16.4023966 47.2086853,16.4359338 47.224375,16.4694711 C47.2400647,16.5027947 47.2559582,16.536332 47.2716479,16.5696556 C47.2871338,16.6029792 47.3026198,16.6365165 47.3183095,16.6698401 C47.3266637,16.6882108 47.3352218,16.7065815 47.3437798,16.7249522 C47.3523378,16.743323 47.3608958,16.7616937 47.3692501,16.7798508 C47.384736,16.813388 47.4004258,16.8469253 47.4159117,16.8804625 C47.4313977,16.9139998 47.4466798,16.947537 47.4621658,16.9810742 C47.4776517,17.0146115 47.4931377,17.0481487 47.5084199,17.081686 C47.5237021,17.1152232 47.5389843,17.1489741 47.5544702,17.1825113 C47.5697524,17.2160486 47.5850346,17.2497994 47.6003168,17.2833367 C47.615599,17.3170875 47.6306774,17.3506248 47.6461633,17.3843756 L47.6913986,17.4854146 C47.7066808,17.5191654 47.7217592,17.5529163 47.7368376,17.5866671 C47.7517123,17.620418 47.7667907,17.6541689 47.7820729,17.6879197 L47.8266969,17.7893859 C47.8350512,17.8079702 47.8432017,17.8267682 47.8513522,17.8455661 C47.8698945,17.8874343 47.8882332,17.9293024 47.9067756,17.9711706 C47.9348948,18.0356817 47.9628102,18.1004064 47.9909295,18.1649176 C48.0186412,18.2298559 48.0463529,18.2945807 48.0740646,18.3593054 C48.1013687,18.4242438 48.1286729,18.4891821 48.1561808,18.5541205 C48.1828737,18.6192725 48.2099741,18.6844244 48.2368708,18.7495764 C48.2633599,18.814942 48.289849,18.8803076 48.3163382,18.9456731 C48.3424198,19.0110387 48.3682976,19.0766179 48.3943792,19.1421971 C48.4198495,19.2079899 48.4453198,19.2737827 48.4707901,19.3395755 L48.5453672,19.5375948 C48.5694112,19.6040285 48.5936589,19.6702485 48.6179066,19.7364685 C48.6413393,19.8031158 48.6651795,19.8695494 48.6886122,19.9361967 C48.7114336,20.0028439 48.734255,20.0697048 48.7572802,20.1365657 C49.019115,20.916894 49.2293979,21.7166612 49.3706053,22.530954 C49.4411071,22.9381004 49.4942891,23.3486646 49.5299476,23.7607241 C49.565606,24.1727836 49.5833333,24.5863384 49.5833333,25.0001068 C49.5833333,25.4138752 49.565606,25.8276436 49.5299476,26.2397031 C49.4942891,26.6517626 49.4409034,27.0621132 49.3706053,27.469046 C49.3001035,27.8761924 49.2124856,28.279921 49.1095855,28.6793774 C49.0064817,29.0784065 48.8880957,29.4735906 48.7570764,29.8634343 C48.734255,29.9302952 48.7112299,29.9971561 48.6884085,30.0638033 C48.6649758,30.1304506 48.6411356,30.1970978 48.6177029,30.2635315 C48.5934551,30.3299651 48.5692074,30.3961852 48.5449597,30.4624052 C48.5201007,30.5284116 48.4952416,30.594418 48.4703826,30.6604245 C48.4451161,30.7262173 48.4196457,30.7922237 48.3941754,30.8578029 C48.3680938,30.9233821 48.342216,30.9891749 48.3161344,31.0545405 C48.2896453,31.1199061 48.2631561,31.1852716 48.236667,31.2506372 C48.2097704,31.3157892 48.18267,31.3809412 48.1559771,31.4460931 C48.1286729,31.5110315 48.101165,31.5761835 48.0738608,31.6409082 C48.0461491,31.7058466 48.0184374,31.7705713 47.9907257,31.835296 C47.9626065,31.9000208 47.934691,31.9647455 47.9065718,32.0292567 C47.8882332,32.0711248 47.8696908,32.112993 47.8513522,32.1548611 C47.8429979,32.1734454 47.8348474,32.1922434 47.8264931,32.2110413 L47.7818691,32.3125075 C47.766587,32.3462584 47.7517123,32.3800092 47.7366339,32.4135465 C47.7217592,32.4475109 47.7066808,32.4810482 47.6913986,32.514799 C47.6763202,32.5483363 47.661038,32.5823007 47.6459596,32.615838 C47.6306774,32.6493752 47.6153952,32.6831261 47.6003168,32.7166633 C47.5850346,32.7504142 47.5697524,32.7839514 47.5544702,32.8174887 L47.5086236,32.918314 C47.4931377,32.9518513 47.4778555,32.9853885 47.4621658,33.0189258 C47.4468836,33.0526766 47.4313977,33.0860002 47.4161155,33.1195375 C47.4006295,33.1530747 47.3849398,33.186612 47.3694539,33.2201492 L47.3437798,33.2752614 C47.3352218,33.2936321 47.3266637,33.3120028 47.3181057,33.3303735 C47.3026198,33.3639108 47.2869301,33.397448 47.2714441,33.4307716 C47.2557544,33.4640953 47.2400647,33.4976325 47.224375,33.5311698 C47.2086853,33.5644934 47.1927918,33.597817 47.1771021,33.6313543 C47.1614124,33.6646779 47.1457226,33.6980015 47.1296254,33.7313252 C47.1139357,33.7648624 47.0980422,33.798186 47.0823525,33.8315097 C47.066459,33.8646197 47.0505656,33.8981569 47.0346721,33.9314805 C47.0187786,33.9648042 47.0026814,33.9979142 46.9865841,34.0314514 C46.9706907,34.0645615 46.9545934,34.0978851 46.9387,34.1312087 C46.9226027,34.1645323 46.9067092,34.1976424 46.890612,34.2307524 C46.8745148,34.264076 46.8582138,34.2973996 46.8421165,34.3305097 C46.833151,34.3486668 46.8241854,34.3670375 46.8156274,34.3851946 C46.7612228,34.4956325 46.707022,34.6058568 46.6530249,34.7165084 C46.5908774,34.8410448 46.5287298,34.9655812 46.466786,35.0903312 C46.4036197,35.2144403 46.340657,35.3387631 46.2778982,35.4628722 C46.2143243,35.5865542 46.1507504,35.7104497 46.0869727,35.8341317 C46.0225838,35.9573864 45.9579911,36.0806411 45.8938059,36.2041094 C45.8286019,36.3271505 45.7633979,36.449978 45.6981939,36.5728055 C45.6323786,36.6952057 45.5663596,36.817606 45.5003405,36.9400062 C45.4335064,37.0619793 45.3668761,37.1841659 45.3002458,37.3061389 C45.2328004,37.4274711 45.165355,37.5492306 45.0979096,37.6705628 C45.0296492,37.7916813 44.9613887,37.9127999 44.8931283,38.0337049 C44.8240528,38.1543962 44.7551811,38.2750876 44.6861056,38.3955653 C44.6247731,38.5015174 44.5630331,38.607683 44.5014968,38.7138487 C44.4737851,38.7610572 44.4462772,38.8084793 44.4183617,38.8559014 C44.3824995,38.9167811 44.3466373,38.9776608 44.3107751,39.0385405 C44.2747091,39.0992066 44.2386432,39.1600863 44.2023735,39.220966 C44.1663075,39.2814185 44.1300378,39.3420846 44.093768,39.4027507 C44.0570908,39.4632032 44.0208211,39.5238693 43.9843476,39.5843217 C43.9476703,39.6445606 43.9111969,39.7047995 43.8743158,39.7654656 C43.8374348,39.8257045 43.8007576,39.8859433 43.7638766,39.9459686 C43.7267918,40.0062074 43.6899108,40.0664463 43.652826,40.1264716 C43.6155375,40.1864968 43.5784527,40.2463085 43.5411642,40.3065473 C43.5038756,40.366359 43.4663833,40.4261706 43.4286873,40.4861959 C43.391195,40.5460075 43.3534989,40.6056056 43.3160066,40.6652036 C43.2864611,40.7119848 43.2571193,40.7585525 43.2273699,40.8051201 C43.2159592,40.8230636 43.2045485,40.8412207 43.1931378,40.8591642 C43.1733729,40.8899245 43.1540154,40.9206848 43.1342505,40.951445 C43.1144855,40.9822053 43.0951281,41.012752 43.0753631,41.0435122 L43.016272,41.1355795 C42.996507,41.1661261 42.9767421,41.1968864 42.9569771,41.2274331 C42.9372121,41.2579797 42.9174472,41.2885264 42.8976822,41.3192866 C42.8777135,41.3498333 42.8579485,41.38038 42.8379798,41.4109266 C42.8180111,41.4412597 42.7982461,41.47202 42.7782774,41.502353 C42.7583087,41.5328997 42.73834,41.5634463 42.7183712,41.593993 C42.6981987,41.6245396 42.6784338,41.6548727 42.6582613,41.685633 C42.6382926,41.7157524 42.6181201,41.7462991 42.5979476,41.7768457 C42.5863331,41.7947892 42.5743111,41.8125191 42.5622892,41.8304626 C42.5490446,41.8507558 42.5355963,41.8710491 42.5221479,41.8913423 C42.5009566,41.9231706 42.4797653,41.954999 42.458574,41.9870409 C42.437179,42.0186557 42.4159877,42.0506976 42.3945926,42.0825259 C42.3734013,42.1143543 42.3518025,42.1461826 42.3306112,42.1777974 C42.3090124,42.2096257 42.2878211,42.2412404 42.2662223,42.2730688 L42.2018333,42.3681265 C42.1800307,42.3997413 42.1586357,42.431356 42.1370368,42.4627571 C42.1152343,42.4943718 42.0936354,42.5259866 42.0718328,42.5576013 C42.050234,42.5890024 42.0282277,42.6204035 42.0064251,42.6518046 C41.9846225,42.6834194 41.9628199,42.7146069 41.9408136,42.7462216 C41.9188072,42.7774091 41.8968009,42.8088102 41.8747945,42.8399977 C41.6361886,43.1785743 41.4041032,43.4947216 41.1496038,43.8202678 C40.8989759,44.1404737 40.6401976,44.4512807 40.3687859,44.752475 C40.0973743,45.0534558 39.8157745,45.3422605 39.521949,45.619103 C39.2281235,45.8955183 38.9234986,46.1589031 38.6080742,46.407335 C37.9772256,46.9041989 37.3027717,47.3414647 36.5967347,47.7110153 C36.4111071,47.8082092 36.2230343,47.9007036 36.0331276,47.9887122 C35.8619671,48.067749 35.6891766,48.1431544 35.5151634,48.2147148 C35.1475758,48.3655255 34.7740792,48.4996745 34.3954885,48.6169481 C34.0171015,48.7342216 33.6340281,48.8344061 33.2481019,48.9198513 C32.861972,49.0052965 32.4729894,49.0757888 32.0825804,49.1353868 C32.0754488,49.1364549 32.0683171,49.137523 32.0613891,49.1383774 C31.6738329,49.197121 31.2976873,49.2432614 30.9076859,49.2844887 C30.8708049,49.2885474 30.8339239,49.2921788 30.7968391,49.2962374 C30.7599581,49.2998689 30.7230771,49.3037139 30.6859923,49.3073453 C30.6491113,49.3109767 30.6120265,49.3148218 30.5749418,49.3182396 C30.5380608,49.321871 30.5011798,49.3252888 30.464095,49.3291338 C30.427214,49.3325517 30.3901292,49.3359695 30.3532482,49.3393873 C30.3161634,49.3425915 30.2790786,49.3462229 30.2421976,49.3496407 C30.2051128,49.3526313 30.1680281,49.3560491 30.1311471,49.3594669 C30.0940623,49.3624575 30.0569775,49.3658753 30.0200965,49.3690795 L29.9090459,49.3782648 C29.8719612,49.381469 29.8348764,49.3844596 29.7977916,49.3874502 C29.7749702,49.3893727 29.7519451,49.3912952 29.7289199,49.3930041 C29.6922427,49.3957811 29.6557692,49.3989853 29.6188882,49.4019759 C29.5508315,49.4071026 29.4825711,49.4124429 29.4145144,49.4175696 C29.3462539,49.4224827 29.2779935,49.4276094 29.2099368,49.4325225 L29.0051555,49.4470482 C28.9370989,49.4513205 28.8688384,49.45602 28.800578,49.4605059 C28.7323176,49.4647781 28.6640571,49.4690504 28.5957967,49.4733226 C28.52774,49.4773813 28.4594796,49.4814399 28.3912191,49.4854986 C28.3229587,49.4893436 28.2546983,49.4931886 28.1864378,49.4970337 C28.1179736,49.5006651 28.0497132,49.5040829 27.9814528,49.5077143 C27.9131923,49.5111321 27.8447281,49.5143363 27.7764677,49.5177541 C27.7082073,49.5207447 27.6399468,49.5239489 27.5714826,49.5271531 C27.5032222,49.5299301 27.434758,49.5329207 27.3664976,49.5356976 C26.9909633,49.5508642 26.5591906,49.5638945 26.1834526,49.5715846 C25.7905985,49.5794883 25.3928541,49.5833333 25,49.5833333 C24.6071459,49.5833333 24.2094015,49.5794883 23.8165474,49.5715846 C23.4408094,49.5638945 23.0092405,49.5508642 22.6337062,49.5356976 C22.565242,49.5329207 22.4969816,49.5299301 22.4285174,49.5271531 C22.3602569,49.5239489 22.2919965,49.5207447 22.2237361,49.5177541 C22.1552719,49.5143363 22.0870114,49.5111321 22.018751,49.5077143 C21.9502868,49.5040829 21.8820264,49.5006651 21.8137659,49.4970337 C21.7455055,49.4931886 21.677245,49.4893436 21.6087809,49.4854986 C21.5405204,49.4814399 21.4724637,49.4773813 21.4042033,49.4733226 C21.3359429,49.4690504 21.2676824,49.4647781 21.199422,49.4605059 L20.9946407,49.4468346 C20.9263803,49.4421351 20.8581198,49.4374356 20.7898594,49.4325225 C20.721599,49.4276094 20.6535423,49.4224827 20.5852819,49.4175696 C20.5172252,49.4124429 20.4489647,49.4071026 20.3807043,49.4017623 C20.3440271,49.3987717 20.3075536,49.3957811 20.2710801,49.3930041 C20.2480549,49.3912952 20.2250298,49.3893727 20.2022084,49.3874502 C20.1651236,49.3844596 20.1282426,49.381469 20.0911578,49.3782648 C20.054073,49.3752743 20.0169883,49.3720701 19.9801073,49.3690795 C19.9430225,49.3658753 19.9061415,49.3624575 19.8690567,49.3594669 C19.8319719,49.3560491 19.7948872,49.3526313 19.7578024,49.3496407 C19.7209214,49.3460093 19.6838366,49.3425915 19.6469556,49.3393873 C19.6098708,49.3359695 19.5729898,49.3325517 19.535905,49.3289202 L19.4248545,49.3182396 C19.3879735,49.3148218 19.3508887,49.3109767 19.3140077,49.3073453 C19.2771267,49.3037139 19.2400419,49.2998689 19.2031609,49.2962374 C19.1660761,49.2921788 19.1291951,49.2885474 19.0921103,49.2844887 C18.695181,49.242407 18.312515,49.1954121 17.9176233,49.1353868 C17.7112119,49.1037721 17.505208,49.0693804 17.3000192,49.0311437 C17.1168367,48.9969656 16.9342655,48.9600106 16.7521019,48.9198513 C16.3661757,48.8344061 15.983306,48.7342216 15.604919,48.6169481 C15.5539784,48.6013543 15.5030378,48.5851197 15.4523009,48.5686715 C15.4125672,48.5558547 15.3728336,48.5428243 15.3333036,48.5297939 C15.0472211,48.4345225 14.7643988,48.3294249 14.4852441,48.2147148 C14.1176566,48.0636903 13.7565895,47.8957905 13.4034691,47.7110153 C12.6972283,47.3412511 12.0233857,46.9039853 11.3921295,46.407335 C11.0765014,46.1589031 10.771469,45.8957319 10.4778472,45.619103 C10.1842255,45.3426878 9.90242194,45.0532421 9.63162159,44.752475 C9.36020995,44.4512807 9.10122782,44.1404737 8.85059996,43.8200542 C8.59691566,43.495576 8.36320008,43.1775063 8.12540925,42.8399977 C8.1034029,42.8088102 8.08139655,42.7774091 8.0593902,42.7462216 C8.03758762,42.7148205 8.01578503,42.683633 7.99377868,42.6520182 C7.97217986,42.6208307 7.95037727,42.589216 7.92857468,42.5578149 C7.9067721,42.5262002 7.88517327,42.4947991 7.86357445,42.4631843 C7.84197563,42.4317832 7.8203768,42.4001685 7.79877798,42.3685538 C7.77738292,42.3371527 7.75578409,42.3053243 7.73438903,42.2737096 C7.71299397,42.2418813 7.69159891,42.2102665 7.67020385,42.1786518 C7.64880878,42.1468235 7.62741372,42.1152087 7.60622242,42.0833804 C7.58482736,42.0517657 7.56363606,42.0197237 7.542241,41.988109 C7.52125346,41.956067 7.50006216,41.9244523 7.47887087,41.892624 C7.46501502,41.8719035 7.45136293,41.8511831 7.43771084,41.8304626 C7.42589262,41.8125191 7.41407439,41.7947892 7.40225617,41.7770593 C7.38228744,41.7465127 7.36211496,41.715966 7.34194247,41.6858466 C7.32197375,41.6550863 7.30200502,41.6247533 7.28183254,41.5942066 C7.26206757,41.5636599 7.24209885,41.5333269 7.22192636,41.5025666 C7.2021614,41.4722336 7.18219268,41.4416869 7.16242772,41.4111402 C7.14245899,41.3805936 7.12269403,41.3498333 7.10272531,41.3195003 C7.08296034,41.28874 7.06319538,41.2584069 7.04343042,41.2276467 C7.02366546,41.1971 7.0039005,41.1663397 6.98413554,41.1360067 L6.92504441,41.0439395 C6.90527945,41.0129656 6.88571825,40.9824189 6.86595329,40.9516587 C6.84639209,40.921112 6.82683089,40.8901381 6.80726969,40.8595914 C6.79565523,40.8414343 6.78424453,40.8232772 6.77263007,40.8051201 C6.74797481,40.7662426 6.72331955,40.7271514 6.69866429,40.6884874 L6.58679868,40.5107614 C6.5497139,40.4511634 6.51262913,40.3919926 6.47534059,40.3326081 C6.43845958,40.2730101 6.40157857,40.2136257 6.3644938,40.1542413 C6.32781655,40.0946432 6.2911393,40.0350452 6.25425829,39.9754472 C6.2177848,39.9158491 6.18131132,39.8558239 6.14463407,39.7962259 C6.10836435,39.7364142 6.07189086,39.6766026 6.03562114,39.6167909 C5.99935141,39.5567657 5.96308169,39.496954 5.92701573,39.4367152 L5.81902161,39.2566394 C5.78315941,39.1961869 5.74729721,39.1361616 5.71163878,39.0759228 C5.6761841,39.0161111 5.64072943,38.9558723 5.60527475,38.895847 C5.56961632,38.8351809 5.53395788,38.7745148 5.49850321,38.7136351 C5.26539892,38.3143924 5.03636988,37.9125863 4.81182361,37.5080032 C4.80489569,37.4956137 4.79796776,37.4830105 4.79103984,37.470621 C4.75803031,37.4110229 4.72502079,37.3514249 4.69201127,37.2916133 C4.65920551,37.2320152 4.62660351,37.1722036 4.59379775,37.1126056 C4.56099198,37.0525803 4.52859375,36.9927687 4.49599175,36.932957 C4.46338975,36.8729318 4.43119528,36.8129065 4.39879704,36.7530949 L4.30200986,36.5728055 C4.26900033,36.5108577 4.23599081,36.4489099 4.20298129,36.3867485 C4.17017553,36.3248008 4.13736976,36.2626394 4.104564,36.2006916 C4.071962,36.1383166 4.03936001,36.0761552 4.00675801,36.0139938 C3.97435977,35.9516188 3.94196154,35.8894574 3.9095633,35.8270824 C3.87716506,35.7647074 3.84497059,35.7021188 3.81277612,35.6397438 C3.7807854,35.5771552 3.74879469,35.5145666 3.71680398,35.4521916 C3.68501703,35.3893894 3.65302632,35.3268008 3.62123937,35.2639985 C3.59678787,35.215722 3.57233638,35.1670182 3.54788488,35.1185281 C3.42521986,34.8747956 3.30418494,34.6302087 3.18457635,34.384981 C3.11651968,34.2450645 3.04866677,34.1049343 2.98142515,33.964377 C2.96369781,33.9269947 2.94576671,33.889826 2.92783561,33.8524437 C2.897475,33.7883598 2.86711439,33.7242759 2.83675378,33.660192 C2.80659693,33.5963217 2.77644008,33.5322378 2.74628323,33.4679403 C2.71633015,33.4038564 2.68637706,33.3395589 2.65622021,33.275475 C2.62647089,33.2111775 2.59672157,33.1466663 2.56697224,33.0823688 L2.47833556,32.889049 C2.44899376,32.8245379 2.41965196,32.7600268 2.39031016,32.6955156 C2.37726936,32.6664643 2.36422856,32.6376265 2.35118776,32.6087888 C2.28313109,32.4577644 2.21568571,32.3063127 2.14885161,32.1546475 C2.13051298,32.1125657 2.1119706,32.0706976 2.09363197,32.029043 C2.06551275,31.9643183 2.03759729,31.8998072 2.00947806,31.8350824 C1.98176637,31.7705713 1.95405467,31.7056329 1.92634297,31.6409082 C1.89883503,31.5759698 1.87153086,31.5110315 1.84422668,31.4460931 C1.81733003,31.3811548 1.79043339,31.3157892 1.76353674,31.2506372 C1.73704761,31.1852716 1.71055849,31.1201197 1.68406936,31.0545405 C1.65798777,30.9891749 1.63210993,30.9235957 1.60602833,30.8578029 C1.58055802,30.7922237 1.55529147,30.7264309 1.52982116,30.6604245 C1.50496213,30.5946317 1.48010311,30.5284116 1.45524409,30.4624052 C1.43099635,30.3961852 1.40674861,30.3299651 1.38250088,30.2635315 L1.31179529,30.0638033 C1.28877013,29.9969424 1.26594873,29.9302952 1.24312733,29.8634343 C1.11149676,29.4718816 0.993925806,29.0799018 0.890618222,28.6791638 C0.787514402,28.279921 0.700100293,27.8759788 0.62959847,27.4688324 C0.557262786,27.0497237 0.502858201,26.6269835 0.467199765,26.2025345 C0.433782716,25.8026509 0.416666667,25.401272 0.416666667,24.9998932 C0.416666667,24.602573 0.433375191,24.2050392 0.466384715,23.8092143 C0.502043151,23.3807065 0.556651498,22.9541214 0.62959847,22.530954 C0.700100293,22.1240212 0.787514402,21.720079 0.890618222,21.3208362 C0.993518281,20.9215935 1.11210805,20.5268367 1.24312733,20.1367793 C1.37435038,19.7460811 1.51779917,19.3617913 1.67041728,18.9796376 C1.7474395,18.7869587 1.82385043,18.601329 1.90474414,18.4101453 L1.92471287,18.3629368 C1.93143703,18.3471295 1.93816119,18.3315357 1.94488535,18.3157284 C1.95160952,18.3001346 1.95812992,18.2843272 1.96505784,18.2687335 C1.97157824,18.2529261 1.97850617,18.2371188 1.98523033,18.221525 C1.99195449,18.2057177 1.99867865,18.1901239 2.00540281,18.1743165 C2.01212698,18.1587228 2.0190549,18.143129 2.02577906,18.1273217 C2.03250323,18.1117279 2.03922739,18.0961342 2.04615531,18.0803268 C2.05084185,18.0696462 2.05552839,18.0587519 2.06021492,18.0478576 C2.08955672,17.9805695 2.11889852,17.9132814 2.14864785,17.8459933 C2.20794273,17.7112035 2.26805267,17.5764137 2.32836636,17.4420511 C2.3379432,17.4204762 2.3477238,17.3986877 2.3575044,17.3771128 C2.37156401,17.3459253 2.38582739,17.3147378 2.39968324,17.2835503 C2.41394661,17.2523628 2.42800622,17.2213889 2.44206583,17.1902014 C2.45632921,17.1590139 2.47059258,17.12804 2.48465219,17.0968525 C2.49891557,17.0658786 2.51317894,17.0346911 2.52744232,17.0037172 C2.54170569,16.9727433 2.55596907,16.9417695 2.57023244,16.910582 C2.58449582,16.8796081 2.59896295,16.8486342 2.61322633,16.8176603 C2.62769346,16.7866864 2.64195684,16.7557125 2.65642398,16.7247386 C2.71775649,16.5925122 2.78173791,16.4560135 2.84408923,16.3244278 C2.87404232,16.2609848 2.90868194,16.1881427 2.93883879,16.1249133 C2.95187959,16.0973572 2.97347841,16.0524985 2.98651921,16.025156 C2.9887606,16.0206701 2.99120575,16.0155434 2.99324337,16.0110576 C2.99568852,16.0061445 2.99813367,16.0010177 2.99813367,16.0010177 C2.99813367,16.0010177 2.9969111,16.0035811 2.99344714,16.0108439 C2.98957565,16.018534 2.98855684,16.0210974 2.98733426,16.0234471 C2.95901128,16.0826179 2.90460669,16.1975417 2.84734943,16.3188739",
                                            "stroke-linejoin": "round",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M5.23561161,16.9161685 C5.29107299,16.8002671 5.34690046,16.6847496 5.40327705,16.5694239 C5.51072205,16.3491345 5.61944834,16.1296128 5.72945591,15.9106667 C5.75142081,15.8669158 5.77338572,15.8233569 5.79553366,15.7797979 C5.82408804,15.7233824 5.85264242,15.6671587 5.8811968,15.610935 C5.90993422,15.5547114 5.93867163,15.4984877 5.96759209,15.442264 C5.99651255,15.3862322 6.02524997,15.3302005 6.05435347,15.2741687 C6.08345697,15.2181369 6.11256047,15.1621051 6.14166397,15.1060733 C6.17095051,15.0502335 6.20023706,14.9943936 6.2295236,14.9385537 C6.25899318,14.8827138 6.28846276,14.8270658 6.31793234,14.7712259 C6.34758497,14.7155779 6.37723759,14.6599299 6.40689021,14.6042819 L6.49383463,14.442327 C6.52293813,14.388406 6.55204163,14.334485 6.58114513,14.2807559 C6.61043167,14.2268349 6.63971821,14.1732977 6.66900475,14.1193767 C6.69847434,14.0658395 6.72794392,14.0121104 6.75723046,13.9583813 C6.78706612,13.9048441 6.81653571,13.851115 6.84618833,13.7977697 C6.85259476,13.7860644 6.85900119,13.774551 6.86540762,13.7630376 C7.06711867,13.4001743 7.27249054,13.0394217 7.48170627,12.6809719 C7.51355539,12.6266671 7.5454045,12.5723623 7.57725361,12.5180575 C7.60928577,12.4639447 7.64113488,12.4098318 7.67316704,12.355527 C7.70538223,12.301606 7.73741439,12.2474931 7.76962958,12.1933802 C7.80202782,12.1392674 7.83424301,12.0855383 7.86664125,12.0314254 C7.89903948,11.9776963 7.93162076,11.9237753 7.964019,11.8698543 C7.99660027,11.8161252 8.02936459,11.7623961 8.06194587,11.708667 C8.09489323,11.6551298 8.12765755,11.6014006 8.16060491,11.5476715 L8.25963002,11.3872518 C8.29276042,11.3337146 8.32589082,11.2803693 8.35902122,11.2270239 C8.3925177,11.1736786 8.42583114,11.1203333 8.45914458,11.066988 C8.49264107,11.0138345 8.52632059,10.9606811 8.55981707,10.9075277 C8.58196502,10.8724118 8.60411296,10.8374879 8.62626091,10.8023721 C8.63669424,10.7862534 8.64694453,10.7701347 8.65719482,10.753824 L8.70991059,10.6709277 C8.72766556,10.6432956 8.74542052,10.6158554 8.76299245,10.5880314 L8.8160743,10.5055188 C8.83382927,10.4780786 8.85158424,10.4504465 8.8693392,10.4230063 L8.92278714,10.3404937 C8.9405421,10.3130535 8.95829707,10.2856133 8.97623508,10.2581731 C8.99399004,10.2307328 9.01192805,10.2032926 9.02986606,10.1760443 C9.04780406,10.1484122 9.06574207,10.1211638 9.08368007,10.0937236 C9.10161808,10.0662834 9.11955609,10.0390351 9.13767714,10.0115948 C9.15561514,9.98415462 9.17373619,9.95690629 9.1916742,9.92946607 C9.20229057,9.91334734 9.21308998,9.89722861 9.22370635,9.88110988 C9.23578705,9.86307225 9.24768471,9.84484273 9.2597654,9.8268051 C9.27880166,9.79821354 9.29783791,9.76943009 9.31687416,9.74083854 C9.33609345,9.71224698 9.3551297,9.68365542 9.374349,9.65506386 C9.39356829,9.6264723 9.41260454,9.59788074 9.43182383,9.56928918 C9.45104313,9.54088951 9.47044546,9.51248984 9.48966475,9.48389829 C9.50906709,9.45549862 9.52828638,9.42690706 9.54768871,9.39850739 C9.56709105,9.37010772 9.58649338,9.34170805 9.60589571,9.31330838 C9.62529805,9.28490871 9.64488342,9.25650904 9.66428575,9.22830126 C9.68387113,9.19990159 9.7034565,9.17169381 9.72322492,9.14348603 C9.74281029,9.11527825 9.76239567,9.08687859 9.78216408,9.05867081 C9.8019325,9.03065492 9.82170091,9.00244714 9.84146933,8.97423936 C10.0552611,8.67124559 10.2650259,8.38533 10.4930949,8.09384961 C10.7180521,7.80620701 10.9506971,7.52700756 11.1943245,7.25644315 C11.4377689,6.98626251 11.6910974,6.72625203 11.9546763,6.47794681 C12.2184382,6.2294497 12.4926335,5.99284976 12.7761638,5.76968209 C13.3430414,5.32353863 13.9483576,4.93074051 14.5827773,4.5987714 C14.8999872,4.43278685 15.2243356,4.28196158 15.5543583,4.14629559 C15.884381,4.0106296 16.220261,3.89031479 16.560168,3.78496736 C16.9000749,3.67981183 17.2441917,3.58962369 17.5908712,3.51286783 C17.9377336,3.43611197 18.2871587,3.37259649 18.637865,3.31925117 C18.9927813,3.26533017 19.3365321,3.22311445 19.6932787,3.1851203 C19.7264091,3.18166628 19.7597226,3.17821227 19.792853,3.17475826 C19.8259834,3.17149613 19.8592968,3.16804212 19.8924272,3.1645881 C19.9255576,3.16132598 19.9588711,3.15806386 19.9921845,3.15480173 C20.0253149,3.1517315 20.0584453,3.14846937 20.0917587,3.14520725 C20.1250722,3.14213701 20.1582026,3.13906678 20.191516,3.13599654 C20.2248295,3.13292631 20.2579599,3.12985608 20.2912733,3.12678584 C20.3245867,3.1239075 20.3577171,3.12102915 20.3910306,3.11795892 C20.424161,3.11508057 20.4574744,3.11220223 20.4907879,3.10932388 C20.5239183,3.10663743 20.5574147,3.10375908 20.5905451,3.10088074 C20.6238586,3.09819428 20.656989,3.09550783 20.6903024,3.09262948 C20.710803,3.09109436 20.7314866,3.08936736 20.7519872,3.08783224 C20.7849346,3.08514579 20.8178819,3.08245933 20.8510123,3.07996476 C20.912331,3.07516752 20.9734667,3.07037028 21.0346023,3.06576493 C21.095921,3.06115958 21.1570567,3.05674612 21.2181923,3.05214076 C21.279511,3.04791919 21.3408297,3.04369762 21.4021484,3.03947605 C21.4634671,3.03544636 21.5247858,3.03122479 21.5859215,3.02719511 C21.6472402,3.02335732 21.7085589,3.01951952 21.7700606,3.01568173 C21.8313793,3.01203583 21.8925149,3.00819803 21.9538336,3.00474402 C22.0151523,3.00129001 22.076471,2.99783599 22.1377897,2.99438198 C22.1991084,2.99111985 22.2606102,2.98804962 22.3219289,2.98478749 C22.3832475,2.98171726 22.4445662,2.97864703 22.506068,2.97576868 C22.5673867,2.97289034 22.6287054,2.97020388 22.6900241,2.96732554 C22.7515258,2.96463908 22.8128445,2.96214452 22.8743462,2.95964995 C23.2116906,2.94602578 23.5993712,2.93432052 23.9370816,2.92760438 C24.2899844,2.92031257 24.6472802,2.91666667 25.000183,2.91666667 C25.3532689,2.91666667 25.7103817,2.92031257 26.0632845,2.92760438 C26.4008119,2.93432052 26.7884925,2.94602578 27.1258368,2.95964995 C27.1871555,2.96214452 27.2486572,2.96463908 27.3099759,2.96732554 C27.3714777,2.97020388 27.4327964,2.97289034 27.4941151,2.97576868 C27.5554338,2.97864703 27.6169355,2.98171726 27.6782542,2.98478749 C27.7395729,2.98804962 27.8008916,2.99111985 27.8622103,2.99438198 C27.923529,2.99783599 27.9850307,3.00129001 28.0463494,3.00455213 L28.2301225,3.01568173 C28.2914411,3.01951952 28.3527598,3.02335732 28.4140785,3.02719511 C28.4752142,3.03122479 28.5365329,3.03544636 28.5978516,3.03947605 C28.6591703,3.04369762 28.720489,3.04791919 28.7818077,3.05214076 C28.8429433,3.05674612 28.904262,3.06115958 28.9655807,3.06576493 C29.0267164,3.07037028 29.0880351,3.07516752 29.1493538,3.07996476 C29.1823011,3.08245933 29.2152485,3.08514579 29.2481958,3.08783224 C29.2688795,3.08936736 29.2895631,3.09109436 29.3100637,3.09262948 C29.3433771,3.09550783 29.3766905,3.09819428 29.410004,3.10088074 L29.5097613,3.10932388 C29.5428917,3.11220223 29.5762051,3.11527246 29.6095185,3.11795892 C29.6426489,3.12102915 29.6759624,3.1239075 29.7092758,3.12697773 C29.7424062,3.12985608 29.7757197,3.13292631 29.8088501,3.13599654 C29.8421635,3.13906678 29.8754769,3.14213701 29.9084243,3.14520725 L30.0081816,3.15480173 C30.041495,3.15806386 30.0746254,3.16132598 30.1077558,3.1645881 C30.1410693,3.16804212 30.1743827,3.17149613 30.2073301,3.17475826 C30.2406435,3.17821227 30.2739569,3.18166628 30.3069043,3.1851203 C30.663651,3.22311445 31.0074018,3.26533017 31.362318,3.31925117 C31.7132074,3.37259649 32.0624494,3.43611197 32.4093119,3.51286783 C32.7559913,3.58962369 33.1001082,3.67981183 33.439832,3.78496736 C33.779922,3.89031479 34.115619,4.0106296 34.4458247,4.14629559 C34.7756644,4.28196158 35.1003789,4.43278685 35.4174057,4.5987714 C36.0516424,4.93074051 36.6576908,5.32353863 37.2242023,5.76987398 C37.5077326,5.99304165 37.7813787,6.22964159 38.0449576,6.47794681 C38.3090856,6.72644392 38.5620481,6.98587873 38.8058586,7.25644315 C39.049669,7.52681567 39.2821309,7.80620701 39.5072712,8.0940415 C39.7360723,8.38648134 39.9443728,8.67009425 40.1587137,8.97443125 C40.1784821,9.00244714 40.1982505,9.03046303 40.218019,9.05867081 C40.2376043,9.08687859 40.2573727,9.11508636 40.2769581,9.14310225 C40.2963605,9.17150192 40.3159458,9.1997097 40.3355312,9.22791748 L40.3941043,9.31273271 C40.4133236,9.34113238 40.4327259,9.36953205 40.4521282,9.39793172 L40.5099692,9.48313073 C40.5291885,9.5115304 40.5484078,9.54012195 40.567627,9.56852162 C40.5868463,9.59692129 40.6060656,9.62551285 40.6251019,9.65410441 C40.6443212,9.68269597 40.6633574,9.71109564 40.6825767,9.7396872 C40.7014299,9.76827876 40.7206492,9.79687032 40.7395024,9.82546187 C40.7519492,9.84407517 40.764213,9.86268847 40.7762937,9.88110988 C40.7870931,9.89722861 40.7977094,9.91315545 40.8081428,9.92927418 L40.8623229,10.011403 C40.8804439,10.0386513 40.8983819,10.0660915 40.9163199,10.0935317 C40.934441,10.1207801 40.9521959,10.1482203 40.9701339,10.1756605 C40.988072,10.2031007 41.0058269,10.2305409 41.0237649,10.2579812 L41.0773959,10.3403018 C41.0951509,10.3679339 41.1129058,10.3953742 41.1306608,10.4228144 C41.1484158,10.4502546 41.1661707,10.4776948 41.1839257,10.5053269 L41.2370076,10.5878395 C41.2547625,10.6154716 41.2721514,10.6431037 41.2899064,10.6707358 C41.3076613,10.6983679 41.3252333,10.726 41.3428052,10.7536321 C41.3532385,10.7699428 41.3634888,10.7860615 41.3737391,10.8023721 C41.395887,10.837296 41.418218,10.8724118 41.440366,10.9073358 C41.4738625,10.9604892 41.507542,11.0136426 41.5408554,11.066988 C41.5743519,11.1201414 41.6074823,11.1734867 41.6409788,11.226832 C41.6742922,11.2801774 41.7072396,11.3337146 41.740553,11.3870599 C41.7735004,11.4405971 41.8064477,11.4941343 41.8395781,11.5476715 C41.8725255,11.6014006 41.9051068,11.6551298 41.9380541,11.708667 C41.9708184,11.7623961 42.0035828,11.8161252 42.035981,11.8698543 L42.1335418,12.0314254 C42.16594,12.0855383 42.1983383,12.1394592 42.2305535,12.1933802 C42.2627687,12.2474931 42.2948008,12.301606 42.327016,12.3557189 C42.3590482,12.4098318 42.3910803,12.4641365 42.4231125,12.5182494 C42.4547785,12.5725542 42.4866277,12.626859 42.5184768,12.6811637 C42.5836393,12.7924598 42.6061534,12.8310296 42.6059703,12.8312215 C43.1571064,13.7820347 43.6820677,14.7491586 44.1803049,15.7314417 C44.2185605,15.80743 44.256816,15.8832265 44.2952546,15.9592148 C44.350716,16.0707026 44.4061774,16.1819987 44.4616388,16.2934865 C44.5066668,16.3854017 44.5516949,16.4775087 44.597089,16.5694239 C44.6047767,16.5859264 44.6128305,16.602237 44.6208843,16.6187395 C44.6353446,16.6484824 44.6499878,16.6784172 44.6644481,16.7081601 C44.6789083,16.7380949 44.6933685,16.7680297 44.7076457,16.7977726 C44.722106,16.8277073 44.7363831,16.8576421 44.7508434,16.8875769 L44.793858,16.9771894 L44.8366895,17.0671856 C44.8509667,17.0969285 44.8652439,17.1270552 44.8793381,17.15699 C44.8936153,17.1869248 44.9078924,17.2168596 44.9219866,17.2467944 C44.9360807,17.2767291 44.9501749,17.3068558 44.964269,17.3369825 C44.9783632,17.3669173 44.9926404,17.397044 45.0067345,17.4269787 C45.0206456,17.4569135 45.0345567,17.4870402 45.0486509,17.516975 C45.0561556,17.5334775 45.0638433,17.54998 45.071531,17.5664825 C45.0792187,17.582985 45.0869064,17.5994875 45.0944111,17.6157982 C45.1083222,17.6459248 45.1224164,17.6760515 45.1363275,17.7061782 C45.1502386,17.7363049 45.1639666,17.7664315 45.1778777,17.7965582 C45.1917889,17.8266849 45.2057,17.8568116 45.219428,17.8869383 C45.2331561,17.9170649 45.2468842,17.9473835 45.2607953,17.9775102 C45.2745233,18.0076368 45.2882514,18.0379554 45.3019795,18.0680821 C45.3157075,18.0984007 45.3292526,18.1285273 45.3431637,18.1588459 L45.3837987,18.2496097 C45.3975268,18.2799283 45.4110718,18.3102468 45.4246169,18.3405654 C45.4379788,18.370884 45.4515239,18.4012025 45.4652519,18.4315211 L45.5053379,18.5226687 C45.5128426,18.5393631 45.5201642,18.5562494 45.5274858,18.5731357 C45.5441426,18.610746 45.5606162,18.6483564 45.577273,18.6859668 C45.6025326,18.7439175 45.6276092,18.80206 45.6528688,18.8600107 C45.6777624,18.9183452 45.702656,18.9764877 45.7275495,19.0346303 C45.752077,19.0929647 45.7766045,19.1512992 45.801315,19.2096337 C45.8252933,19.26816 45.8496378,19.3266863 45.8737992,19.3852127 C45.8975945,19.4439309 45.9213898,19.5026492 45.9451851,19.5613674 C45.9686144,19.6200856 45.9918606,19.6789958 46.0152898,19.7379059 C46.0381699,19.7970079 46.06105,19.8561099 46.0839301,19.9152119 L46.1509231,20.0930936 C46.1725219,20.1527713 46.1943038,20.2122571 46.2160856,20.2717429 C46.2371353,20.3316125 46.2585511,20.3912902 46.2796008,20.4511597 C46.3001014,20.5110293 46.320602,20.5710908 46.3412856,20.6311522 C46.5764931,21.3321252 46.7653913,22.05056 46.8922387,22.7820434 C46.9555708,23.1477851 47.0033445,23.516597 47.0353766,23.8867522 C47.0674088,24.2569073 47.0833333,24.6284057 47.0833333,25.0000959 C47.0833333,25.3717862 47.0674088,25.7434765 47.0353766,26.1136316 C47.0033445,26.4837868 46.9553878,26.8524068 46.8922387,27.2179566 C46.8289065,27.5836983 46.7501989,27.9463697 46.6577633,28.3052034 C46.5651446,28.6636533 46.4587978,29.0186491 46.3411026,29.3688478 C46.320602,29.4289092 46.2999184,29.4889707 46.2794178,29.5488403 C46.2583681,29.6087098 46.2369523,29.6685794 46.2159026,29.7282571 C46.1941207,29.7879348 46.1723389,29.8474206 46.150557,29.9069064 C46.128226,29.9662003 46.105895,30.0254942 46.083564,30.0847881 C46.060867,30.1438901 46.0379869,30.203184 46.0151067,30.2620941 C45.9916775,30.3210042 45.9684313,30.3801063 45.9450021,30.4388245 C45.9212068,30.4975427 45.8974115,30.556261 45.8736161,30.6149792 C45.8494547,30.6735055 45.8251103,30.7320319 45.801132,30.7905582 C45.7766045,30.8488927 45.751894,30.907419 45.7273665,30.9655616 C45.7024729,31.0238961 45.6775794,31.0820386 45.6526858,31.1401812 C45.6274262,31.1983238 45.6023496,31.2564663 45.5770899,31.314417 C45.5606162,31.3520274 45.5439595,31.3896377 45.5274858,31.4272481 C45.5199812,31.4439425 45.5126595,31.4608288 45.5051548,31.4777151 L45.4650689,31.5688627 C45.4513408,31.5991812 45.4379788,31.6294998 45.4244338,31.6596265 C45.4110718,31.6901369 45.3975268,31.7202636 45.3837987,31.7505822 C45.3702537,31.7807089 45.3565256,31.8112193 45.3429806,31.841346 C45.3292526,31.8714727 45.3155245,31.9017912 45.3019795,31.9319179 C45.2882514,31.9622365 45.2745233,31.9923632 45.2607953,32.0224898 L45.2196111,32.1130617 C45.2057,32.1431884 45.1919719,32.1733151 45.1778777,32.2034418 C45.1641497,32.2337603 45.1502386,32.2636951 45.1365105,32.2938218 C45.1225994,32.3239485 45.1085053,32.3540752 45.0945941,32.3842018 L45.071531,32.4337094 C45.0638433,32.4502119 45.0561556,32.4667144 45.0484678,32.4832169 C45.0345567,32.5133436 45.0204626,32.5434702 45.0065515,32.573405 C44.9924573,32.6033398 44.9783632,32.6334665 44.964269,32.6635932 C44.9501749,32.693528 44.9358977,32.7234627 44.9218036,32.7535894 C44.9077094,32.7835242 44.8936153,32.813459 44.879155,32.8433938 C44.8650609,32.8735205 44.8507837,32.9034552 44.8366895,32.93339 C44.8224124,32.9631329 44.8081352,32.9932596 44.793858,33.0231944 C44.7795808,33.0531292 44.7651206,33.0828721 44.7506603,33.1129988 C44.7363831,33.1427416 44.7219229,33.1726764 44.7076457,33.2026112 C44.6931855,33.232546 44.6789083,33.2622889 44.6644481,33.2920318 C44.6499878,33.3219666 44.6353446,33.3519014 44.6208843,33.3816443 C44.6128305,33.3979549 44.6047767,33.4144574 44.597089,33.430768 C44.5482171,33.529975 44.4995282,33.62899 44.4510224,33.7283889 C44.3951949,33.8402605 44.3393675,33.9521322 44.283723,34.0641958 C44.2269804,34.1756837 44.1704207,34.2873635 44.1140441,34.3988513 C44.0569354,34.5099555 43.9998266,34.6212515 43.9425348,34.7323556 C43.8846939,34.8430759 43.82667,34.9537962 43.7690121,35.0647085 C43.710439,35.1752369 43.6518659,35.2855734 43.5932928,35.39591 C43.5341706,35.5058628 43.4748654,35.6158155 43.4155601,35.7257683 C43.3555227,35.8353373 43.2956684,35.9450982 43.235814,36.0546672 C43.1752275,36.1636605 43.1146409,36.2730376 43.0540544,36.3820309 C42.9927357,36.4908324 42.931417,36.5996338 42.8700983,36.7082434 C42.8080474,36.816661 42.7461796,36.9250787 42.6841288,37.0333044 C42.6290335,37.1284817 42.5735721,37.2238509 42.5182937,37.31922 C42.4934002,37.3616276 42.4686896,37.4042271 42.443613,37.4468267 C42.4113979,37.5015152 42.3791827,37.5562038 42.3469675,37.6108923 C42.3145692,37.665389 42.282171,37.7200775 42.2495897,37.7747661 C42.2171915,37.8290708 42.1846102,37.8835675 42.1520289,37.9380642 C42.1190816,37.9923689 42.0865003,38.0468656 42.053736,38.1011704 C42.0207886,38.1552833 41.9880243,38.2093961 41.9548939,38.2638928 C41.9217635,38.3180057 41.8888161,38.3721186 41.8556857,38.4260396 C41.8223723,38.4801525 41.7892419,38.5342653 41.7559285,38.5881863 C41.722432,38.6421073 41.6891185,38.6958364 41.655622,38.7499493 C41.6221256,38.8036784 41.588446,38.8574075 41.5545835,38.9113285 C41.520904,38.9650576 41.4870414,39.0185948 41.4533619,39.072132 C41.4268209,39.1141559 41.4004631,39.1559878 41.3737391,39.1978198 C41.3634888,39.2139385 41.3532385,39.2302491 41.3429882,39.2463679 C41.3252333,39.274 41.3078444,39.3016321 41.2900894,39.3292642 C41.2723344,39.3568963 41.2549456,39.3843365 41.2371906,39.4119686 L41.1841087,39.4946731 C41.1663538,39.5221133 41.1485988,39.5497454 41.1308438,39.5771856 C41.1130889,39.6046258 41.0953339,39.6320661 41.0775789,39.6596982 C41.0596409,39.6871384 41.041886,39.7145786 41.023948,39.7420188 C41.00601,39.7692672 40.988255,39.7968993 40.970317,39.8241476 C40.952379,39.8515878 40.934441,39.8790281 40.916503,39.9064683 C40.8983819,39.9339085 40.880627,39.9611568 40.8625059,39.9887889 C40.8445679,40.0158454 40.8264469,40.0432856 40.8083258,40.0707258 C40.7978925,40.0868446 40.7870931,40.1027714 40.7762937,40.1188901 C40.764396,40.1371196 40.7523153,40.1553492 40.7402346,40.1735787 C40.7211983,40.2021702 40.7021621,40.2307618 40.6831258,40.2595452 C40.6639065,40.2879449 40.6448703,40.3167284 40.625651,40.3453199 C40.6066148,40.3739115 40.5872124,40.402503 40.5681762,40.4309027 C40.5487738,40.4594943 40.5297376,40.4878939 40.5103352,40.5164855 L40.4524943,40.6018764 C40.432909,40.6302761 40.4136897,40.6586757 40.3942873,40.6868835 C40.374702,40.7152832 40.3552996,40.7436828 40.3357142,40.7720825 C40.3163119,40.8002903 40.2965435,40.8284981 40.2769581,40.8567059 C40.2573727,40.8851055 40.2377874,40.9131214 40.218019,40.9415211 C40.1982505,40.969537 40.1784821,40.9977448 40.1587137,41.0257606 C39.9443728,41.3299057 39.7358893,41.6139024 39.5072712,41.9063423 C39.2821309,42.1939849 39.049669,42.4731843 38.8058586,42.7437487 C38.5620481,43.0141213 38.3090856,43.2735561 38.0451406,43.5222451 C37.7811957,43.7705503 37.5075496,44.0071502 37.2242023,44.2303179 C36.6575077,44.6766533 36.0516424,45.0694514 35.4174057,45.4014205 C35.2506555,45.4887303 35.0817088,45.5718185 34.9111147,45.650877 C34.7573603,45.7218762 34.6021416,45.7896133 34.4458247,45.8538963 C34.115619,45.9893704 33.780105,46.1098771 33.4400151,46.2152245 C33.1001082,46.3205719 32.7559913,46.4105682 32.4093119,46.4873241 C32.0624494,46.5640799 31.7130244,46.6274035 31.362318,46.6809407 C31.3559116,46.6819002 31.3495052,46.6828596 31.3432818,46.6836272 C30.995138,46.7363968 30.6572446,46.777845 30.3069043,46.8148797 C30.2737739,46.8185256 30.2406435,46.8217877 30.2073301,46.8254336 C30.1741997,46.8286958 30.1410693,46.8321498 30.1077558,46.8354119 C30.0746254,46.838674 30.041312,46.842128 30.0079985,46.8451983 C29.9748681,46.8484604 29.9417377,46.8515306 29.9084243,46.8549846 C29.8752939,46.8580549 29.8419805,46.8611251 29.8088501,46.8641953 C29.7755366,46.8670737 29.7422232,46.8703358 29.7090928,46.873406 C29.6757793,46.8760925 29.6424659,46.8791627 29.6093355,46.882233 C29.5760221,46.8849194 29.5427086,46.8879897 29.5095782,46.890868 L29.4098209,46.8991193 C29.3765075,46.9019976 29.3431941,46.9046841 29.3098806,46.9073705 C29.28938,46.9090975 29.2686964,46.9108245 29.2480128,46.9123596 C29.2150654,46.9148542 29.1823011,46.9177326 29.1491707,46.920419 C29.0880351,46.9250244 29.0267164,46.9298216 28.9655807,46.934427 C28.904262,46.9388404 28.8429433,46.9434458 28.7818077,46.9478592 L28.5978516,46.9609077 C28.5367159,46.9647455 28.4753972,46.9689671 28.4140785,46.9729968 C28.3527598,46.9768346 28.2914411,46.9806724 28.2301225,46.9845102 C28.1689868,46.9881561 28.1076681,46.991802 28.0463494,46.9954479 C27.9850307,46.9989019 27.923712,47.0023559 27.8623933,47.0058099 C27.8008916,47.009072 27.7395729,47.0121423 27.6782542,47.0154044 C27.6169355,47.0184746 27.5554338,47.021353 27.4941151,47.0244232 C27.4327964,47.0271097 27.3714777,47.029988 27.3099759,47.0328664 C27.2486572,47.0353609 27.1871555,47.0380474 27.1258368,47.0405419 C26.7884925,47.0541661 26.4006288,47.0658714 26.0631014,47.0727794 C25.7101986,47.0798793 25.3529028,47.0833333 25,47.0833333 C24.6470972,47.0833333 24.2898014,47.0798793 23.9368986,47.0727794 C23.5993712,47.0658714 23.2116906,47.0541661 22.8743462,47.0405419 C22.8128445,47.0380474 22.7515258,47.0353609 22.6900241,47.0328664 C22.6287054,47.029988 22.5673867,47.0271097 22.506068,47.0244232 C22.4445662,47.021353 22.3832475,47.0184746 22.3219289,47.0154044 C22.2604271,47.0121423 22.1991084,47.009072 22.1377897,47.0058099 C22.076471,47.0023559 22.0151523,46.9989019 21.9536506,46.9954479 C21.8923319,46.991802 21.8311962,46.9881561 21.7698775,46.9845102 C21.7085589,46.9806724 21.6472402,46.9768346 21.5859215,46.9729968 L21.4019654,46.9607158 C21.3406467,46.9564943 21.279328,46.9522727 21.2180093,46.9478592 C21.1566906,46.9434458 21.0955549,46.9388404 21.0342362,46.934427 C20.9731006,46.9298216 20.9117819,46.9250244 20.8504632,46.9202271 C20.8175158,46.9175407 20.7847515,46.9148542 20.7519872,46.9123596 C20.7313036,46.9108245 20.71062,46.9090975 20.6901194,46.9073705 C20.6568059,46.9046841 20.6236755,46.9019976 20.5903621,46.8991193 C20.5570487,46.8964328 20.5237352,46.8935545 20.4906048,46.890868 C20.4572914,46.8879897 20.424161,46.8849194 20.3908475,46.882233 C20.3575341,46.8791627 20.3242207,46.8760925 20.2909072,46.873406 C20.2577768,46.8701439 20.2244634,46.8670737 20.191333,46.8641953 C20.1580195,46.8611251 20.1248891,46.8580549 20.0915757,46.8547928 L19.9918184,46.8451983 C19.958688,46.842128 19.9253746,46.838674 19.8922442,46.8354119 C19.8591138,46.8321498 19.8258003,46.8286958 19.7926699,46.8254336 C19.7593565,46.8217877 19.7262261,46.8185256 19.6929127,46.8148797 C19.336349,46.7770774 18.9925982,46.7348617 18.637865,46.6809407 C18.4524446,46.6525411 18.2673903,46.6216468 18.0830681,46.5872986 C17.9185143,46.5565962 17.7545097,46.5233993 17.5908712,46.4873241 C17.2441917,46.4105682 16.9002579,46.3205719 16.560351,46.2152245 C16.5145908,46.2012166 16.4688306,46.186633 16.4232534,46.1718575 C16.3875604,46.1603441 16.3518674,46.1486388 16.3163575,46.1369335 C16.0593681,46.0513508 15.8053074,45.956941 15.5545413,45.8538963 C15.2243356,45.7182303 14.8999872,45.567405 14.5827773,45.4014205 C13.9483576,45.0692595 13.3430414,44.6764614 12.7759808,44.2303179 C12.4924504,44.0071502 12.2184382,43.7707422 11.9546763,43.5222451 C11.6909144,43.2739399 11.4377689,43.0139294 11.1945075,42.7437487 C10.9506971,42.4731843 10.7180521,42.1939849 10.4929118,41.9061504 C10.2650259,41.61467 10.055078,41.3289463 9.84146933,41.0257606 C9.82170091,40.9977448 9.8019325,40.969537 9.78216408,40.9415211 C9.76257871,40.9133133 9.74299333,40.8852974 9.72322492,40.8568977 C9.70382258,40.8288819 9.68423721,40.8004822 9.66465184,40.7722744 C9.64506646,40.7438747 9.62566413,40.715667 9.60626179,40.6872673 C9.58685946,40.6590595 9.56745713,40.6306598 9.54805479,40.6022602 C9.5288355,40.5740524 9.50943317,40.5454608 9.49021387,40.5170612 C9.47099458,40.4884696 9.45177529,40.4600699 9.432556,40.4316703 C9.4133367,40.4030787 9.39411741,40.374679 9.37508116,40.3460875 C9.35586187,40.3176878 9.33682562,40.2889044 9.31760632,40.2605047 C9.29875311,40.2317212 9.27971686,40.2033216 9.26068061,40.17473 C9.24823383,40.1561167 9.23597009,40.1375034 9.22370635,40.1188901 C9.21308998,40.1027714 9.20247361,40.0868446 9.19185724,40.0709177 C9.17391923,40.0434775 9.15579818,40.0160373 9.13767714,39.9889808 C9.11973913,39.9613487 9.10180112,39.9341004 9.08368007,39.9066602 C9.06592511,39.8792199 9.0479871,39.8519716 9.02986606,39.8243395 C9.01211109,39.7970912 8.99417308,39.7696509 8.97641812,39.7422107 C8.95848011,39.7147705 8.94072515,39.6871384 8.92278714,39.6598901 C8.90503217,39.632258 8.88727721,39.6050096 8.86952224,39.5773775 C8.85176728,39.5499373 8.83401231,39.5223052 8.81625735,39.4950569 L8.76317549,39.4123524 C8.74542052,39.3845284 8.7278486,39.3570882 8.71009363,39.3294561 C8.69252171,39.3020159 8.67494978,39.2741919 8.65737786,39.2467516 C8.64694453,39.230441 8.63669424,39.2141304 8.62626091,39.1978198 C8.60411296,39.1628959 8.58196502,39.12778 8.55981707,39.093048 L8.45932763,38.9333958 C8.42601418,38.8798586 8.39270074,38.8267052 8.35920426,38.7733599 C8.32607386,38.7198226 8.29294346,38.6664773 8.25963002,38.613132 C8.22668266,38.5595948 8.1937353,38.5060576 8.16060491,38.4525203 C8.12784059,38.3989831 8.09507627,38.3450621 8.06212891,38.2915249 C8.02954763,38.2377958 7.99678332,38.1840667 7.96420204,38.1303376 C7.93162076,38.0764166 7.89903948,38.0226875 7.86664125,37.9685746 L7.76962958,37.8068116 C7.73741439,37.7525069 7.70519919,37.6985859 7.67316704,37.644473 C7.64131792,37.5907439 7.60946881,37.536631 7.57761969,37.48271 C7.54558754,37.4282134 7.51355539,37.3737167 7.48170627,37.3190281 C7.2723075,36.9603864 7.06656955,36.5994419 6.8648585,36.2360029 C6.85863511,36.2248733 6.85241172,36.2135518 6.84618833,36.2024222 C6.81653571,36.148885 6.78688308,36.0953478 6.75723046,36.0416187 C6.72776088,35.9880815 6.69847434,35.9343524 6.66900475,35.8808152 C6.63953517,35.8268942 6.61043167,35.7731651 6.58114513,35.719436 C6.55185859,35.665515 6.52293813,35.611594 6.49383463,35.5578649 L6.40689021,35.39591 C6.37723759,35.340262 6.34758497,35.284614 6.31793234,35.2287741 C6.28846276,35.1731261 6.25899318,35.1172862 6.2295236,35.0616382 C6.20023706,35.0056064 6.17095051,34.9497665 6.14166397,34.8939267 C6.11256047,34.8378949 6.08345697,34.782055 6.05435347,34.7260232 C6.02524997,34.6699914 5.99632951,34.6137678 5.96740905,34.557736 C5.93867163,34.5015123 5.90993422,34.4452886 5.8811968,34.3892569 C5.85264242,34.3328413 5.823905,34.2766176 5.79535062,34.2202021 C5.77338572,34.176835 5.75142081,34.1330842 5.72945591,34.0895252 C5.61926529,33.8705791 5.51053901,33.6508655 5.40309401,33.4305761 C5.34195836,33.3048884 5.28100574,33.1790088 5.22060225,33.0527454 C5.2046777,33.0191647 5.1885701,32.9857759 5.1724625,32.9521952 C5.14518941,32.8946283 5.11791632,32.8370614 5.09064323,32.7794945 C5.06355318,32.7221195 5.03646313,32.6645526 5.00937307,32.6067938 C4.98246606,32.5492269 4.95555906,32.4914682 4.928469,32.4339013 C4.90174504,32.3761425 4.87502107,32.3181918 4.8482971,32.260433 L4.76867431,32.0867729 C4.74231643,32.0288222 4.71595854,31.9708715 4.68960065,31.9129208 C4.67788604,31.8868238 4.66617142,31.8609187 4.6544568,31.8350136 C4.59332115,31.6993476 4.53273462,31.5632979 4.47269721,31.4270562 C4.45622353,31.389254 4.43956681,31.3516436 4.42309313,31.3142251 C4.39783349,31.2560825 4.37275689,31.1981319 4.34749724,31.1399893 C4.32260368,31.0820386 4.29771012,31.0237042 4.27281656,30.9655616 C4.24810604,30.9072271 4.22357857,30.8488927 4.19905109,30.7905582 C4.17488969,30.7322238 4.1507283,30.6735055 4.1265669,30.6149792 C4.10277158,30.556261 4.07897627,30.4977346 4.05518095,30.4388245 C4.03175172,30.3801063 4.00850553,30.3211961 3.9850763,30.2620941 C3.96219619,30.203184 3.93949912,30.144082 3.91661901,30.0847881 C3.89428802,30.0256861 3.87195703,29.9662003 3.84962604,29.9069064 C3.82784418,29.8474206 3.80606231,29.7879348 3.78428045,29.7282571 L3.72076526,29.5488403 C3.70008164,29.4887788 3.67958106,29.4289092 3.65908049,29.3688478 C3.54083608,29.017114 3.43522149,28.6649965 3.34241976,28.3050115 C3.24980107,27.9463697 3.17127653,27.5835064 3.10794439,27.2177647 C3.04296488,26.8412772 2.99409296,26.4615276 2.96206081,26.0802428 C2.9320421,25.7210254 2.91666667,25.3604647 2.91666667,24.9999041 C2.91666667,24.6429893 2.93167602,24.2858826 2.96132864,23.9303111 C2.9933608,23.5453805 3.04241575,23.1621768 3.10794439,22.7820434 C3.17127653,22.4164936 3.24980107,22.0536303 3.34241976,21.6949885 C3.4348554,21.3363467 3.5413852,20.9817346 3.65908049,20.6313441 C3.77695881,20.2803779 3.90581959,19.9351685 4.04291722,19.5918779 C4.11210667,19.4187934 4.180747,19.2520413 4.25341423,19.0803 L4.27135224,19.0378924 C4.27739259,19.0236926 4.28343294,19.0096846 4.28947328,18.9954848 C4.29551363,18.9814769 4.30137094,18.967277 4.30759433,18.9532691 C4.31345164,18.9390692 4.31967503,18.9248694 4.32571538,18.9108615 C4.33175573,18.8966616 4.33779608,18.8826537 4.34383643,18.8684538 C4.34987678,18.8544459 4.35610017,18.840438 4.36214051,18.8262381 C4.36818086,18.8122302 4.37422121,18.7982222 4.3804446,18.7840224 C4.38465454,18.7744279 4.38886448,18.7646415 4.39307442,18.7548552 C4.41943231,18.6944099 4.4457902,18.6339647 4.47251417,18.5735194 C4.52577906,18.4524371 4.57977612,18.3313547 4.63395622,18.2106561 C4.64255915,18.1912752 4.65134511,18.1717025 4.66013107,18.1523216 C4.67276089,18.1243058 4.68557375,18.0962899 4.69802053,18.068274 C4.7108334,18.0402581 4.72346322,18.0124341 4.73609304,17.9844182 C4.7489059,17.9564023 4.76171876,17.9285783 4.77434858,17.9005624 C4.78716144,17.8727384 4.79997431,17.8447225 4.81278717,17.8168985 C4.82560003,17.7890745 4.83841289,17.7612505 4.85122575,17.7332346 C4.86403861,17.7054106 4.87703452,17.6775866 4.88984738,17.6497626 C4.90284328,17.6219386 4.91565614,17.5941146 4.92865205,17.5662906 C4.98374735,17.4475109 5.04122219,17.3248934 5.0972327,17.2066894 C5.12413971,17.1496982 5.15525666,17.0842638 5.18234671,17.0274645 C5.19406132,17.0027107 5.21346366,16.9624139 5.22517827,16.937852 C5.22719172,16.9338223 5.22938822,16.929217 5.23121862,16.9251873 C5.23341511,16.9207738 5.23561161,16.9161685 5.23561161,16.9161685 C5.23561161,16.9161685 5.23451336,16.9184712 5.23140166,16.9249954 C5.22792389,16.9319034 5.22700868,16.9342061 5.22591044,16.9363169 C5.20046776,16.9894703 5.15159584,17.092707 5.10016135,17.2017003",
                                            "stroke-linejoin": "round",
                                        },
                                    }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(16.666667, 7.500000) scale(-1, -1) translate(-16.666667, -7.500000) ", cx: "16.6666667", cy: "7.5", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(33.333333, 7.500000) scale(-1, -1) translate(-33.333333, -7.500000) ", cx: "33.3333333", cy: "7.5", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(16.666667, 42.500000) scale(-1, -1) translate(-16.666667, -42.500000) ", cx: "16.6666667", cy: "42.5", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(5.833333, 25.000000) scale(-1, -1) translate(-5.833333, -25.000000) ", cx: "5.83333333", cy: "25", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(44.166667, 25.000000) scale(-1, -1) translate(-44.166667, -25.000000) ", cx: "44.1666667", cy: "25", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(33.333333, 42.500000) scale(-1, -1) translate(-33.333333, -42.500000) ", cx: "33.3333333", cy: "42.5", r: "1" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoMinilink" } }, [
                                    a("rect", { attrs: { x: "8", y: "0.5", width: "34", height: "49", rx: "17" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { cx: "25", cy: "16.6666667", r: "9.5" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(25.000000, 4.166667) scale(-1, -1) translate(-25.000000, -4.166667) ", cx: "25", cy: "4.16666667", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(31.666667, 5.833333) scale(-1, -1) translate(-31.666667, -5.833333) ", cx: "31.6666667", cy: "5.83333333", r: "1" } }),
                                    t._v(" "),
                                    a("circle", { attrs: { fill: "#666666", transform: "translate(18.333333, 5.833333) scale(-1, -1) translate(-18.333333, -5.833333) ", cx: "18.3333333", cy: "5.83333333", r: "1" } }),
                                ]),
                                t._v(" "),
                                a("path", { attrs: { id: "icoMore", d: "M1 1l5 5-5 5" } }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoNav" } }, [a("path", { attrs: { d: "M0 0h24v2H0z" } }), t._v(" "), a("path", { attrs: { d: "M0 10h24v2H0z" } }), t._v(" "), a("path", { attrs: { d: "M0 20h24v2H0z" } })]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoPlay", transform: "translate(.5 .5)" } }, [
                                    a("circle", { attrs: { cx: "16", cy: "16", r: "15", fill: "none" } }),
                                    t._v(" "),
                                    a("path", { attrs: { stroke: "none", d: "M12 9l12 7-12 7z" } }),
                                ]),
                                t._v(" "),
                                a("circle", { attrs: { id: "icoProduct", cx: "957.5", cy: "1007.5", r: "170.9", fill: "none", "fill-rule": "evenodd", stroke: "#FFCD00", "stroke-width": "7.2", transform: "translate(-783 -833)" } }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoStop", transform: "translate(.5 .5)" } }, [
                                    a("circle", { attrs: { cx: "16", cy: "16", r: "15", stroke: "#FFE100" } }),
                                    t._v(" "),
                                    a("path", { attrs: { fill: "#FFE100", d: "M9.5 9.5h4v12h-4zM17.5 9.5h4v12h-4z" } }),
                                ]),
                                t._v(" "),
                                a("mask", { attrs: { id: "icoStoryMask", fill: "white" } }, [a("polygon", { attrs: { id: "path-1", points: "0 3.69863014e-05 9.70858846 3.69863014e-05 9.70858846 17.9655164 0 17.9655164" } })]),
                                t._v(" "),
                                a("path", {
                                    attrs: {
                                        id: "icoStory",
                                        d:
                                            "M9.70858846,7.08013973 L9.70858846,7.08013973 L9.70235753,3.69863014e-05 L-1.23287671e-05,0.00842054795 L0.00843287671,9.71492055 L4.49752192,9.71245479 C4.07131644,12.1836329 2.59519315,14.087626 1.07783014,15.1683041 L3.9012411,17.9655164 C7.40655616,15.609489 9.71246712,11.6210096 9.70858846,7.08013973",
                                        fill: "#BDBDBD",
                                        mask: "url(#icoStoryMask)",
                                    },
                                }),
                                t._v(" "),
                                a("mask", { attrs: { id: "mask-2", fill: "white" } }, [
                                    a("polygon", { attrs: { id: "path-1", points: "4.45159304e-14 0.0586666667 21.6123978 0.0586666667 21.6123978 20 4.45159304e-14 20" } }),
                                    t._v(" "),
                                    a("use", { attrs: { "xlink:href": "#path-1" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoKakaotalk" } }, [
                                    a("path", {
                                        attrs: {
                                            d:
                                                "M18.6278162,10.9809394 C18.5875516,11.3570758 18.2228958,11.3861667 18.1120356,11.3861667 C18.0851925,11.3861667 18.0581978,11.3848788 18.0313548,11.3821515 C17.8404204,11.3626061 17.7330483,11.2427576 17.5336212,10.9736667 L16.1756214,9.12419697 L15.8042169,9.50260606 L15.8042169,10.8929848 C15.8042169,11.1743485 15.5820415,11.3863939 15.2875263,11.3863939 C14.9780731,11.3863939 14.7700775,11.1881364 14.7700775,10.8929848 L14.7700775,6.61828788 C14.7700775,6.32351515 14.9877791,6.10957576 15.2875263,6.10957576 C15.5964487,6.10957576 15.8042169,6.3139697 15.8042169,6.61828788 L15.8042169,8.27328788 L17.6247662,6.37707576 C17.7060536,6.29677273 17.8385247,6.18843939 18.0359045,6.18843939 C18.2856812,6.19510606 18.5368986,6.36086364 18.5303016,6.66457576 C18.5303016,6.80662121 18.4453745,6.90033333 18.2760511,7.08707576 C18.2376064,7.12934848 18.1954461,7.17586364 18.1495703,7.22813636 L16.9052363,8.48245455 L18.3772812,10.4080606 C18.5293159,10.6063182 18.6553416,10.7704091 18.6278162,10.9809394 L18.6278162,10.9809394 Z M14.3239826,10.8776818 C14.3176131,11.0971515 14.1424509,11.3285909 13.8300404,11.3285909 L11.9033322,11.3285909 C11.5649128,11.3285909 11.3629076,11.1148788 11.3629076,10.757 L11.3629076,6.64889394 C11.3629076,6.31624242 11.5610456,6.10957576 11.8799773,6.10957576 C12.1986814,6.10957576 12.3966678,6.31624242 12.3966678,6.64889394 L12.3966678,10.3887424 L13.8300404,10.3887424 C13.984805,10.3887424 14.1134089,10.4384394 14.2022032,10.5326061 C14.2872062,10.6225303 14.3315654,10.7482879 14.3239826,10.8776818 L14.3239826,10.8776818 Z M10.3527298,11.386697 C10.0933229,11.386697 9.92839751,11.2695 9.84832336,11.0280606 L9.62235656,10.3217727 L7.46247788,10.3217727 L7.23089982,11.0200303 C7.1500674,11.2702576 6.99211812,11.386697 6.73384868,11.386697 C6.44858455,11.386697 6.22504423,11.1770758 6.22504423,10.9093485 C6.22504423,10.8032121 6.25696773,10.7216212 6.27228494,10.6826061 L7.77268936,6.71169697 C7.88021316,6.42063636 8.1384826,6.10995455 8.54150729,6.10995455 C8.89577471,6.10995455 9.17641335,6.32881818 9.31146263,6.71048485 L10.7657638,10.6751061 C10.811867,10.7994242 10.824227,10.9004091 10.824227,10.9403333 C10.824227,11.1906364 10.6170655,11.386697 10.3527298,11.386697 L10.3527298,11.386697 Z M5.35128065,10.8460152 C5.35128065,11.179197 5.15314264,11.3863939 4.83421097,11.3863939 C4.51565844,11.3863939 4.31759626,11.179197 4.31759626,10.8460152 L4.31759626,7.09571212 L3.23037745,7.09571212 C2.88930407,7.09571212 2.76828292,6.84298485 2.76828292,6.62654545 C2.76828292,6.39843939 2.93025107,6.15593939 3.23037745,6.15593939 L6.437817,6.15593939 C6.73855,6.15593939 6.90097312,6.39843939 6.90097312,6.62654545 C6.90097312,6.84298485 6.77964866,7.09571212 6.437817,7.09571212 L5.35128065,7.09571212 L5.35128065,10.8460152 Z M10.8062558,0.0586666667 C4.83822984,0.0586666667 -3.79138372e-05,3.87760606 -3.79138372e-05,8.58790909 C-3.79138372e-05,11.6164697 2.00060241,14.2766212 5.01536355,15.789803 L3.99692055,19.5910152 C3.95908248,19.7036667 3.98759373,19.8260152 4.07115595,19.9094242 C4.13136322,19.9695758 4.21075491,20.0000303 4.2901466,20.0000303 C4.35793664,20.0000303 4.42557503,19.9783636 4.48244587,19.9335909 L8.86332041,16.979197 C9.49360098,17.0692727 10.1429901,17.1169242 10.8062558,17.1169242 C16.7742817,17.1169242 21.6123978,13.2986667 21.6123978,8.58790909 C21.6123978,3.87760606 16.7742817,0.0586666667 10.8062558,0.0586666667 L10.8062558,0.0586666667 Z",
                                            id: "Fill-1",
                                            fill: "#BDBDBD",
                                            mask: "url(#mask-2)",
                                        },
                                    }),
                                    t._v(" "),
                                    a("path", {
                                        attrs: {
                                            d: "M8.54271374,6.99538514 L7.71084337,9.39759036 L9.39759036,9.39759036 L8.56426185,6.99538514 C8.56085952,6.98547403 8.54611608,6.98547403 8.54271374,6.99538514",
                                            id: "Fill-4",
                                            fill: "#BDBDBD",
                                        },
                                    }),
                                ]),
                                t._v(" "),
                                a("path", {
                                    attrs: {
                                        id: "icoTwit",
                                        d:
                                            "M7.03291636,18 C15.4720582,18 20.0879127,11.0743224 20.0879127,5.068406 C20.0879127,4.87169407 20.0879127,4.67586824 20.0744945,4.48092849 C20.9724673,3.83754833 21.7476125,3.04092576 22.3636364,2.12836017 C21.5262336,2.49591177 20.6379055,2.736952 19.7283055,2.84343461 C20.6861346,2.27543517 21.403005,1.38207055 21.7455055,0.329597951 C20.8448391,0.858996989 19.8594871,1.23209103 18.8319709,1.43277971 C17.4097177,-0.065248717 15.1497708,-0.431896441 13.3193786,0.538431522 C11.4889865,1.50875948 10.5433587,3.57474729 11.0127491,5.57790762 C7.32355037,5.39470815 3.88633106,3.66867062 1.55650909,0.829352577 C0.338695266,2.90603218 0.96073098,5.56271958 2.97704727,6.89640918 C2.24686667,6.8749725 1.53260627,6.67986052 0.894545455,6.32753955 C0.894545455,6.34614744 0.894545455,6.36564141 0.894545455,6.38513539 C0.89514313,8.54860593 2.43473042,10.4120015 4.5756,10.8403947 C3.90010153,11.0228761 3.191363,11.0495512 2.50383273,10.9183706 C3.10492069,12.7697868 4.82748124,14.0381012 6.79049455,14.0746224 C5.16576298,15.3394552 3.15869324,16.0260824 1.09224,16.0240198 C0.727179193,16.0233256 0.362473455,16.0014312 0,15.9584492 C2.09827798,17.2922593 4.53974072,17.9997492 7.03291636,17.9964556",
                                    },
                                }),
                                t._v(" "),
                                a("g", { attrs: { id: "icoFast", stroke: "#000000", "stroke-width": "1.8", transform: "translate(1, 2)" } }, [
                                    a("g", { attrs: { transform: "translate(19.009055, 0.891809)" } }, [
                                        a("polyline", { attrs: { transform: "translate(3.892442, 3.665642) rotate(-45) translate(-3.892442, -3.665642) ", points: "1.30044155 1.07364155 6.48444155 1.07364155 6.48444155 6.25764155" } }),
                                    ]),
                                    t._v(" "),
                                    a("path", { attrs: { d: "M3.45705469,22.2758086 C14.1934702,22.2758086 22.8970547,13.5722241 22.8970547,2.83580859" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "22.8970547", y1: "2.83580859", x2: "22.8970547", y2: "1.21580859" } }),
                                    t._v(" "),
                                    a("polyline", { attrs: { points: "27.216 27.216 0 27.216 0 0" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoSafe", stroke: "#000000", "stroke-width": "1.8" } }, [
                                    a("polyline", { attrs: { "stroke-width": "2", points: "0.5 19 0.5 23.1631618 0.5 27" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "9.5", y1: "13", x2: "9.5", y2: "27" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "18.5", y1: "8", x2: "18.5", y2: "27" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "27.5", y1: "0", x2: "27.5", y2: "27" } }),
                                ]),
                                t._v(" "),
                                a("g", { attrs: { id: "icoConnect", stroke: "#000000", "stroke-width": "1.8" } }, [
                                    a("line", { attrs: { x1: "16.2", y1: "16.2", x2: "36", y2: "36", id: "Path-4" } }),
                                    t._v(" "),
                                    a("line", { attrs: { x1: "16.2", y1: "16.2", x2: "36", y2: "36", id: "Path-4", transform: "translate(26.100000, 26.100000) scale(-1, 1) translate(-26.100000, -26.100000) " } }),
                                    t._v(" "),
                                    a("g", { attrs: { transform: "translate(26.100000, 26.100000) rotate(-315.000000) translate(-26.100000, -26.100000) translate(8.100000, 8.100000)" } }, [
                                        a("circle", { attrs: { fill: "#FFFFFF", transform: "translate(3.960000, 17.820000) rotate(-270.000000) translate(-3.960000, -17.820000) ", cx: "3.96", cy: "17.82", r: "3.06" } }),
                                        t._v(" "),
                                        a("circle", { attrs: { fill: "#FFFFFF", transform: "translate(31.680000, 17.820000) rotate(-270.000000) translate(-31.680000, -17.820000) ", cx: "31.68", cy: "17.82", r: "3.06" } }),
                                        t._v(" "),
                                        a("circle", { attrs: { fill: "#FFFFFF", transform: "translate(17.820000, 31.680000) rotate(-180.000000) translate(-17.820000, -31.680000) ", cx: "17.82", cy: "31.68", r: "3.06" } }),
                                        t._v(" "),
                                        a("circle", { attrs: { fill: "#FFFFFF", transform: "translate(17.820000, 3.960000) rotate(-180.000000) translate(-17.820000, -3.960000) ", cx: "17.82", cy: "3.96", r: "3.06" } }),
                                        t._v(" "),
                                        a("circle", { attrs: { fill: "#F4F4F4", transform: "translate(17.820000, 17.820000) rotate(-180.000000) translate(-17.820000, -17.820000) ", cx: "17.82", cy: "17.82", r: "6.03" } }),
                                    ]),
                                ]),
                            ]),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = s.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = a(0),
                s = Object(i.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_ios", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 14 17", fill: "#333" } }, [e("use", { attrs: { "xlink:href": "#icoIos" } })]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = s.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(175),
                s = (a(20), a(12), a(7), a(5), a(9), a(6)),
                n = (a(53), a(19), a(3)),
                r = a(8),
                o = a(0),
                c = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_alliance", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 10 10", fill: "#333", "fill-rule": "nonzero" } }, [e("use", { attrs: { "xlink:href": "#IcoAlliance" } })]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                l = a(61),
                m = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_nav", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 22", fill: "#101010" } }, [
                            e("title", [this._v("메뉴 펼치기, 접기")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoNav" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                u = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_heykakao", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", fill: "none", "fill-rule": "evenodd", "stroke-width": "1", stroke: "#666666" } }, [
                            e("title", [this._v("헤이카카오")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoHeykakao" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                p = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e(
                            "svg",
                            { staticClass: "ico_kakaomini", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", fill: "none", "fill-rule": "evenodd", "stroke-width": "1", stroke: "#666666", opacity: "0.900000036" } },
                            [e("title", [this._v("카카오미니")]), this._v(" "), e("use", { attrs: { "xlink:href": "#icoKakaomini" } })]
                        );
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                d = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_kakaohome", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 52 48", fill: "none", "fill-rule": "evenodd", "stroke-width": "1", stroke: "#666666" } }, [
                            e("title", [this._v("카카오홈")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoKakaohome" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                h = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_minihexa", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 52 52", fill: "none", "fill-rule": "evenodd", "stroke-width": "1", stroke: "#666666" } }, [
                            e("title", [this._v("미니헥사")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoMinihexa" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                v = Object(o.a)(
                    {},
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("svg", { staticClass: "ico_minilink", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", fill: "none", "fill-rule": "evenodd", "stroke-width": "1", stroke: "#666666" } }, [
                            e("title", [this._v("미니링크")]),
                            this._v(" "),
                            e("use", { attrs: { "xlink:href": "#icoMinilink" } }),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                ).exports,
                g = {
                    components: {
                        IcoTwit: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_twit", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 23 18", fill: "#BDBDBD", "fill-rule": "evenodd" } }, [
                                    e("title", [this._v("Twitter")]),
                                    this._v(" "),
                                    e("use", { attrs: { "xlink:href": "#icoTwit" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoFacebook: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_facebook", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", "fill-rule": "evenodd", fill: "none" } }, [
                                    e("title", [this._v("facebook")]),
                                    this._v(" "),
                                    e("use", { attrs: { "xlink:href": "#icoFacebook" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoStory: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_story", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 10 18", "fill-rule": "evenodd", fill: "none" } }, [
                                    e("title", [this._v("kakaoStory")]),
                                    this._v(" "),
                                    e("use", { attrs: { "xlink:href": "#icoStory" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoTalk: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_kakaotalk", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 22 20", fill: "none", "fill-rule": "evenodd" } }, [
                                    e("title", [this._v("kakaoTalk")]),
                                    this._v(" "),
                                    e("use", { attrs: { "xlink:href": "#icoKakaotalk" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                    },
                    props: { snsTiaraLog: { type: Array, default: [] } },
                    data: function () {
                        return {
                            SNSInfos: [
                                { text: "kakaoTalk", class: "IcoTalk" },
                                { text: "kakaoStory", class: "IcoStory" },
                                { text: "Facebook", class: "IcoFacebook" },
                                { text: "Twitter", class: "IcoTwit" },
                            ],
                        };
                    },
                    methods: {
                        snsShare: function (t) {
                            if ("kakaoTalk" !== t) {
                                var e = window.screen.width / 2 + window.screenX,
                                    a = window.screen.height / 2 + window.screenY,
                                    i = encodeURI("https://kakao.ai/"),
                                    s = "",
                                    n = [];
                                "Facebook" === t
                                    ? ((s = "https://www.facebook.com/dialog/feed?app_id=911640245992316&display=popup&link=".concat(i)), (n = [560, 525]))
                                    : "Twitter" === t
                                    ? ((s = "https://twitter.com/intent/tweet?text='카카오i'&url=".concat(i)), (n = [680, 400]))
                                    : "kakaoStory" === t && ((s = "https://story.kakao.com/share?url=".concat(i)), (n = [510, 510])),
                                    window.open(
                                        s,
                                        "_blank",
                                        "top="
                                            .concat(a - n[1] / 2, ", left=")
                                            .concat(e - n[0] / 2, ", width=")
                                            .concat(n[0], ", height=")
                                            .concat(n[1])
                                    );
                            } else Kakao.Link.sendScrap({ requestUrl: "https://kakao.ai" });
                        },
                    },
                },
                _ =
                    (a(277),
                    Object(o.a)(
                        g,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { staticClass: "wrap_share" }, [
                                a("strong", { staticClass: "tit_share" }, [t._v("Share")]),
                                t._v(" "),
                                a(
                                    "ul",
                                    { staticClass: "list_share" },
                                    t._l(t.SNSInfos, function (e, i) {
                                        return a("li", { key: "SNSItem" + i }, [
                                            a(
                                                "button",
                                                {
                                                    attrs: { type: "button", "data-tiara-action-name": t.snsTiaraLog[i].tiaraName, "data-tiara-layer": t.snsTiaraLog[i].tiaraLayer },
                                                    on: {
                                                        click: function (a) {
                                                            return t.snsShare(e.text);
                                                        },
                                                    },
                                                },
                                                [a(e.class, { tag: "component" })],
                                                1
                                            ),
                                        ]);
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "35f34919",
                        null
                    ).exports),
                f = a(171);
            function b(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            var C = {
                    components: { IcoAlliance: c, IcoLogo: l.a, IcoNav: m, IcoHeyKakao: u, IcoKakaoMini: p, IcoKakaoHome: d, IcoMiniHexa: h, IcoMiniLink: v, SnsShare: _, StoreBtn: f.a },
                    name: "HeaderLayout",
                    data: function () {
                        return {
                            storeInfos: {
                                minilink: {
                                    url: "https://gift-talk.kakao.com/appredirect?to=https%253A%252F%252Fgift.kakao.com%252Fpage%252F2126&input_channel_id=2717",
                                    text: "구매하기",
                                    tiaraLog: { name: "미니링크_구매클릭", layer: "purchase_minilink_btn" },
                                },
                                minihexa: {
                                    url: "https://gift-talk.kakao.com/appredirect?to=https%253A%252F%252Fgift.kakao.com%252Fproduct%252F2204899&input_channel_id=2630",
                                    text: "구매하기",
                                    tiaraLog: { name: "미니헥사_구매클릭", layer: "purchase_minihexa_btn" },
                                },
                            },
                            gnbInfos: [
                                { text: "소개", path: "kakaoi", link: "/kakaoi", tiaraName: "GNB_소개클릭", tiaraLayer: "about" },
                                { text: "서비스", path: "service", link: "/service", tiaraName: "GNB_서비스클릭", tiaraLayer: "service" },
                                {
                                    text: "제품",
                                    path: "product",
                                    link: "/product/minihexa",
                                    tiaraName: "GNB_제품클릭",
                                    tiaraLayer: "product",
                                    subMenu: [
                                        { text: "미니링크", link: "/product/minilink", tiaraName: "GNB_제품_미니링크", tiaraLayer: "product_minilink", ico: "IcoMiniLink" },
                                        { text: "미니헥사", link: "/product/minihexa", tiaraName: "GNB_제품_미니헥사", tiaraLayer: "product_minihexa", ico: "IcoMiniHexa" },
                                        { text: "헤이카카오", link: "/product/heykakao", tiaraName: "GNB_제품_헤이카카오", tiaraLayer: "product_heykakao", ico: "IcoHeyKakao" },
                                        { text: "카카오미니", link: "/product/kakaomini", tiaraName: "GNB_제품_카카오미니", tiaraLayer: "product_kakaomini", ico: "IcoKakaoMini" },
                                        { text: "카카오홈", link: "/product/kakaohome", tiaraName: "GNB_제품_카카오홈", tiaraLayer: "product_kakaohome", ico: "IcoKakaoHome" },
                                    ],
                                },
                                {
                                    text: "파트너",
                                    path: "partner",
                                    link: "/partner",
                                    tiaraName: "GNB_파트너클릭",
                                    tiaraLayer: "parnter",
                                    subMenu: [
                                        { text: "카카오톡", link: "/partner/kakaotalk", tiaraName: "GNB_파트너_카카오톡", tiaraLayer: "partner_kakaotalk" },
                                        { text: "자동차", link: "/partner/mobility", tiaraName: "GNB_파트너_자동차", tiaraLayer: "partner_car" },
                                        { text: "내비게이션", link: "/partner/navigation", tiaraName: "GNB_파트너_내비게이션", tiaraLayer: "partner_navi" },
                                        { text: "스마트악세서리", link: "/partner/smartaccessory", tiaraName: "GNB_파트너_스마트악세서리", tiaraLayer: "partner_accessory" },
                                        { text: "디스플레이", link: "/partner/display", tiaraName: "GNB_파트너_TV", tiaraLayer: "partner_tv" },
                                        { text: "스마트홈", link: "/partner/smarthome", tiaraName: "GNB_파트너_홈", tiaraLayer: "partner_home" },
                                    ],
                                },
                            ],
                            snsTiaraLog: [
                                { tiaraName: "Footer_공유_카카오톡클릭", tiaraLayer: "share_kakaotalk" },
                                { tiaraName: "Footer_공유_카카오스토리클릭", tiaraLayer: "share_kakaostory" },
                                { tiaraName: "Footer_공유_facebook클릭", tiaraLayer: "share_facebook" },
                                { tiaraName: "Fooer_공유_twitter클릭", tiaraLayer: "share_twitter" },
                            ],
                            isGnbOn: !1,
                            isShowBtn: !1,
                            pageX: 0,
                            subOnIdx: null,
                            timeout: null,
                            subTimeout: null,
                            accordList: [],
                        };
                    },
                    mounted: function () {
                        var t = this;
                        return Object(n.a)(
                            regeneratorRuntime.mark(function e() {
                                return regeneratorRuntime.wrap(function (e) {
                                    for (;;)
                                        switch ((e.prev = e.next)) {
                                            case 0:
                                                if ((t.$route.params, t.onScrollHeaderHandler(), window.addEventListener("scroll", t.onScrollHeaderHandler), !t.isMobile)) {
                                                    e.next = 7;
                                                    break;
                                                }
                                                return (
                                                    (e.next = 6),
                                                    t.gnbInfos.forEach(function (e, a) {
                                                        e.path === t.$route.path.split("/")[1] && (t.subOnIdx = a);
                                                    })
                                                );
                                            case 6:
                                                t.setInitOpacity();
                                            case 7:
                                            case "end":
                                                return e.stop();
                                        }
                                }, e);
                            })
                        )();
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.onScrollHeaderHandler);
                    },
                    computed: (function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = null != arguments[e] ? arguments[e] : {};
                            e % 2
                                ? b(Object(a), !0).forEach(function (e) {
                                      Object(s.a)(t, e, a[e]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                                : b(Object(a)).forEach(function (e) {
                                      Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                                  });
                        }
                        return t;
                    })({}, Object(r.b)(["productBannerHeight"])),
                    watch: {
                        $route: function () {
                            this.isMobile && this.setInitValues();
                        },
                    },
                    methods: {
                        onScrollHeaderHandler: function () {
                            var t = window,
                                e = t.pageXOffset,
                                a = t.pageYOffset;
                            (this.pageX = -e), this.isMobile && "product" === this.$route.path.split("/")[1] && this.storeInfos[this.$route.path.split("/")[2]] && this.storeBtnOn(a);
                        },
                        storeBtnOn: function (t) {
                            this.productBannerHeight > 0 && t > this.productBannerHeight ? (this.isShowBtn = !0) : (this.isShowBtn = !1);
                        },
                        setInitValues: function () {
                            (this.isGnbOn = !1), this.setInitOpacity(), this.$store.dispatch("controlBodyClass", { controlClass: "prevent_scroll", command: "remove" });
                        },
                        onClickMoGNB: function (t) {
                            this.isGnbOn = !this.isGnbOn;
                            var e = this.isGnbOn ? "add" : "remove";
                            this.isGnbOn &&
                                this.$refs.subMenuList.forEach(function (t, e) {
                                    t.classList.remove("open");
                                }),
                                this.onClickBtnRelated(this.isGnbOn),
                                this.$store.dispatch("controlBodyClass", { controlClass: "prevent_scroll", command: e });
                        },
                        onClickMoSub: function (t) {
                            if (this.isMobile) {
                                var e = this.subOnIdx === t;
                                (this.subOnIdx = e ? null : t),
                                    this.$refs.subMenuList.forEach(function (e, a) {
                                        t !== a && e.classList.remove("on");
                                    }),
                                    this.$refs.subMenuList[t].classList.add("on");
                            }
                        },
                        setRelatedIsShow: function (t, e, a) {
                            var i = this,
                                s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 150,
                                n = arguments.length > 4 ? arguments[4] : void 0;
                            if (a >= t.length) return (this.timeout = null), void ("function" == typeof n && n());
                            this[e] = window.setTimeout(function () {
                                (t[a].style.opacity = 1), i.setRelatedIsShow(t, e, a + 1, s, n);
                            }, s);
                        },
                        onClickBtnRelated: function (t) {
                            var e = this,
                                a = document.querySelectorAll(".accord-item");
                            (this.accordList = Array.prototype.slice.call(a)),
                                this.timeout || !t
                                    ? this.clearTimeout(this.accordList, "timeout", t)
                                    : window.setTimeout(function () {
                                          e.setRelatedIsShow(e.accordList, "timeout", 0, 150);
                                      }, 300);
                        },
                        clearTimeout: function (t, e, a) {
                            var i = this;
                            return Object(n.a)(
                                regeneratorRuntime.mark(function s() {
                                    return regeneratorRuntime.wrap(function (s) {
                                        for (;;)
                                            switch ((s.prev = s.next)) {
                                                case 0:
                                                    return (
                                                        window.clearTimeout(i[e]),
                                                        (i[e] = null),
                                                        (s.next = 4),
                                                        t.forEach(function (t) {
                                                            t.style.opacity = 0;
                                                        })
                                                    );
                                                case 4:
                                                    a && i.setRelatedIsShow(t, e, 0, 150);
                                                case 5:
                                                case "end":
                                                    return s.stop();
                                            }
                                    }, s);
                                })
                            )();
                        },
                        setInitOpacity: function () {
                            var t = document.querySelectorAll(".accord-item");
                            (this.accordList = Array.prototype.slice.call(t)),
                                this.accordList.forEach(function (t) {
                                    t.style.opacity = 0;
                                });
                        },
                    },
                },
                y =
                    (a(279),
                    Object(o.a)(
                        C,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("header", { class: ["doc-header", { gnb_on: t.isGnbOn }], style: { transform: t.isMobile ? null : "translateX(" + t.pageX + "px)" } }, [
                                a("div", { staticClass: "inner-header", attrs: { "data-tiara-layer": "gnb" } }, [
                                    a(
                                        "div",
                                        { staticClass: "wrap-header" },
                                        [
                                            t.isMobile
                                                ? a("div", { staticClass: "info_title" }, [
                                                      a(
                                                          "h1",
                                                          { staticClass: "doc-title" },
                                                          [
                                                              a(
                                                                  "router-link",
                                                                  {
                                                                      attrs: { to: "/", "data-tiara-action-name": "GNB_로고클릭", "data-tiara-layer": "logo" },
                                                                      nativeOn: {
                                                                          click: function (e) {
                                                                              return t.setInitValues(e);
                                                                          },
                                                                      },
                                                                  },
                                                                  [a("IcoLogo")],
                                                                  1
                                                              ),
                                                          ],
                                                          1
                                                      ),
                                                      t._v(" "),
                                                      a(
                                                          "div",
                                                          { staticClass: "bundle_btn" },
                                                          [
                                                              a(
                                                                  "transition",
                                                                  { attrs: { name: "btn-fade" } },
                                                                  [
                                                                      "product" === t.$route.path.split("/")[1] && t.storeInfos[t.$route.path.split("/")[2]]
                                                                          ? a("StoreBtn", {
                                                                                directives: [{ name: "show", rawName: "v-show", value: !t.isGnbOn && t.isShowBtn, expression: "!isGnbOn && isShowBtn" }],
                                                                                attrs: { storeData: t.storeInfos[t.$route.path.split("/")[2]] },
                                                                            })
                                                                          : t._e(),
                                                                  ],
                                                                  1
                                                              ),
                                                              t._v(" "),
                                                              a("button", { staticClass: "btn_gnb", attrs: { type: "button", "data-tiara-action-name": "GNB_메뉴클릭", "data-tiara-layer": "mobile_menu" }, on: { click: t.onClickMoGNB } }, [
                                                                  t._m(0),
                                                              ]),
                                                          ],
                                                          1
                                                      ),
                                                  ])
                                                : a("h1", { staticClass: "doc-title" }, [a("router-link", { attrs: { to: "/", "data-tiara-action-name": "GNB_로고클릭", "data-tiara-layer": "logo" } }, [a("IcoLogo")], 1)], 1),
                                            t._v(" "),
                                            a("transition", { attrs: { name: "fade-nav" } }, [
                                                a("nav", { directives: [{ name: "show", rawName: "v-show", value: !t.isMobile || t.isGnbOn, expression: "isMobile ? isGnbOn : true" }], staticClass: "doc-gnb", attrs: { id: "gnbContent" } }, [
                                                    a("h2", { staticClass: "screen_out" }, [t._v("카카오 i 메인메뉴")]),
                                                    t._v(" "),
                                                    a(
                                                        "ul",
                                                        { class: ["list_gnb", { default: "/" === t.$route.path && t.isMobile }] },
                                                        t._l(t.gnbInfos, function (e, i) {
                                                            return a(
                                                                "li",
                                                                { key: "gnbItem" + i, ref: "subMenuList", refInFor: !0, class: { on: t.subOnIdx === i } },
                                                                [
                                                                    t.isMobile && e.subMenu
                                                                        ? a(
                                                                              "button",
                                                                              {
                                                                                  class: ["accord-item link_gnb", { on: e.path === t.$route.path.split("/")[1] }],
                                                                                  attrs: { type: "button", "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer },
                                                                                  on: {
                                                                                      click: function (e) {
                                                                                          return t.onClickMoSub(i);
                                                                                      },
                                                                                  },
                                                                              },
                                                                              [t._v(t._s(e.text))]
                                                                          )
                                                                        : a(
                                                                              "router-link",
                                                                              {
                                                                                  class: ["accord-item link_gnb", { on: e.path === t.$route.path.split("/")[1] }],
                                                                                  attrs: { to: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer },
                                                                                  nativeOn: {
                                                                                      click: function (e) {
                                                                                          return t.onClickMoSub(i);
                                                                                      },
                                                                                  },
                                                                              },
                                                                              [t._v(t._s(e.text))]
                                                                          ),
                                                                    t._v(" "),
                                                                    e.subMenu
                                                                        ? a(
                                                                              "div",
                                                                              {
                                                                                  directives: [
                                                                                      {
                                                                                          name: "show",
                                                                                          rawName: "v-show",
                                                                                          value: (t.isMobile && t.subOnIdx === i && t.isGnbOn) || !t.isMobile,
                                                                                          expression: "(isMobile && subOnIdx === index && isGnbOn) || !isMobile",
                                                                                      },
                                                                                  ],
                                                                                  staticClass: "sub_gnb",
                                                                              },
                                                                              [
                                                                                  a(
                                                                                      "ul",
                                                                                      { class: ["list_sub", "list_" + e.path, { "accord-item": t.subOnIdx === i }] },
                                                                                      [
                                                                                          t.isMobile && 3 === i
                                                                                              ? a(
                                                                                                    "li",
                                                                                                    { key: "subItemAll" },
                                                                                                    [
                                                                                                        a(
                                                                                                            "router-link",
                                                                                                            { staticClass: "link_sub", attrs: { to: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer } },
                                                                                                            [t._v("전체\n                    ")]
                                                                                                        ),
                                                                                                    ],
                                                                                                    1
                                                                                                )
                                                                                              : t._e(),
                                                                                          t._v(" "),
                                                                                          t._l(e.subMenu, function (e, i) {
                                                                                              return a(
                                                                                                  "li",
                                                                                                  { key: "subItem" + i },
                                                                                                  [
                                                                                                      a(
                                                                                                          "router-link",
                                                                                                          { staticClass: "link_sub", attrs: { to: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer } },
                                                                                                          [
                                                                                                              e.ico && !t.isMobile ? a("span", { staticClass: "ico_snb" }, [a(e.ico, { tag: "component" })], 1) : t._e(),
                                                                                                              t._v(t._s(e.text) + "\n                    "),
                                                                                                          ]
                                                                                                      ),
                                                                                                  ],
                                                                                                  1
                                                                                              );
                                                                                          }),
                                                                                      ],
                                                                                      2
                                                                                  ),
                                                                              ]
                                                                          )
                                                                        : t._e(),
                                                                ],
                                                                1
                                                            );
                                                        }),
                                                        0
                                                    ),
                                                ]),
                                            ]),
                                            t._v(" "),
                                            t.isMobile
                                                ? t._e()
                                                : a(
                                                      "a",
                                                      {
                                                          staticClass: "link_alliance",
                                                          attrs: { href: "https://with.kakao.com/kakaoi/proposition", "data-tiara-action-name": "GNB_제휴제안클릭", "data-tiara-layer": "proposal", target: "_blank" },
                                                      },
                                                      [a("IcoAlliance"), t._v("제휴문의")],
                                                      1
                                                  ),
                                            t._v(" "),
                                            t.isMobile
                                                ? t._e()
                                                : a(
                                                      "a",
                                                      {
                                                          staticClass: "link_ethics",
                                                          attrs: { href: "https://www.kakaocorp.com/kakao/ai/algorithm", "data-tiara-action-name": "GNB_알고리즘윤리클릭", "data-tiara-layer": "algorithmEthics", target: "_blank" },
                                                      },
                                                      [t._v("AI 알고리즘 윤리")]
                                                  ),
                                            t._v(" "),
                                            t.isMobile
                                                ? a(
                                                      "div",
                                                      { directives: [{ name: "show", rawName: "v-show", value: t.isGnbOn, expression: "isGnbOn" }], staticClass: "info_footer" },
                                                      [
                                                          a(
                                                              "transition",
                                                              { attrs: { name: "slide-fade" } },
                                                              [a("SnsShare", { directives: [{ name: "show", rawName: "v-show", value: t.isGnbOn, expression: "isGnbOn" }], attrs: { snsTiaraLog: t.snsTiaraLog } })],
                                                              1
                                                          ),
                                                          t._v(" "),
                                                          a("transition", { attrs: { name: "slide-fade" } }, [
                                                              a("div", { directives: [{ name: "show", rawName: "v-show", value: t.isGnbOn, expression: "isGnbOn" }], staticClass: "info_copyright" }, [
                                                                  a("small", { staticClass: "txt_copyright" }, [
                                                                      t._v("© "),
                                                                      a("a", { attrs: { href: "https://www.kakaoenterprise.com/", target: "_blank" } }, [t._v("Kakao Enterprise")]),
                                                                      t._v("."),
                                                                      a("br"),
                                                                      t._v("The Kakao i is a trademark of Kakaocorp."),
                                                                  ]),
                                                              ]),
                                                          ]),
                                                      ],
                                                      1
                                                  )
                                                : t._e(),
                                        ],
                                        1
                                    ),
                                ]),
                            ]);
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("div", { staticClass: "ico_nav" }, [e("span"), this._v(" "), e("span"), this._v(" "), e("span")]);
                            },
                        ],
                        !1,
                        null,
                        "093c82c8",
                        null
                    ).exports),
                x = a(174),
                k = a(13),
                w = a(4),
                T = a(24);
            function I(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            function D(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var a = null != arguments[e] ? arguments[e] : {};
                    e % 2
                        ? I(Object(a), !0).forEach(function (e) {
                              Object(s.a)(t, e, a[e]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                        : I(Object(a)).forEach(function (e) {
                              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                          });
                }
                return t;
            }
            var L = {
                    components: { Banner: w.a, AppBNV: T.a, IcoArrCircle: k.a, IcoAlliance: c },
                    data: function () {
                        return { thumbInfos0: { 375: "750x1120", 1440: "3840x960", 1920: "3840x960", 2560: "3840x960" } };
                    },
                    computed: D(
                        D({}, Object(r.b)(["banner"])),
                        {},
                        {
                            bannerData: function () {
                                return this.banner.data || {};
                            },
                            bannerLog: function () {
                                return this.banner.tiaraLog || {};
                            },
                        }
                    ),
                },
                S =
                    (a(287),
                    Object(o.a)(
                        L,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return "app" === t.banner.type
                                ? a("AppBNV", { attrs: { bannerData: t.bannerData, bannerLog: t.bannerLog, tagType: "aside" } }, [a("h3", { staticClass: "screen_out" }, [t._v("앱 다운 안내 배너")])])
                                : a(
                                      "aside",
                                      { staticClass: "bnr_route" },
                                      [
                                          a("h3", { staticClass: "screen_out" }, [t._v("카카오 AI 알고리즘 윤리 헌장")]),
                                          t._v(" "),
                                          a("div", { staticClass: "info_ethics" }, [
                                              t.isMobile
                                                  ? a("a", { staticClass: "inner_ethics", attrs: { href: "https://www.kakaocorp.com/kakao/ai/algorithm", target: "_blank" } }, [
                                                        a("p", { staticClass: "desc_ethics" }, [t._v("카카오는 대표적인 AI 기술 "), a("br"), t._v("기업으로서, 사회적 책임에 걸맞은 "), a("br"), t._v("윤리적 규범을 마련합니다.")]),
                                                        t._v(" "),
                                                        a("span", { staticClass: "link_ethics" }, [t._v("카카오 AI 알고리즘 윤리 헌장"), a("IcoAlliance")], 1),
                                                    ])
                                                  : a("div", { staticClass: "inner_ethics" }, [
                                                        a(
                                                            "a",
                                                            {
                                                                staticClass: "desc_ethics",
                                                                attrs: { href: "https://www.kakaocorp.com/kakao/ai/algorithm", target: "_blank", "data-tiara-action-name": "윤리배너_더보기클릭", "data-tiara-layer": "ethics_more" },
                                                            },
                                                            [t._v("카카오는 대표적인 AI 기술 기업으로서, "), a("br"), t._v("사회적 책임에 걸맞은 윤리적 규법을 마련합니다.\n      ")]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                            "a",
                                                            {
                                                                staticClass: "link_ethics",
                                                                attrs: { href: "https://www.kakaocorp.com/kakao/ai/algorithm", target: "_blank", "data-tiara-action-name": "윤리배너_더보기클릭", "data-tiara-layer": "ethics_more" },
                                                            },
                                                            [t._v("카카오 AI 알고리즘 윤리 헌장"), a("IcoAlliance")],
                                                            1
                                                        ),
                                                    ]),
                                          ]),
                                          t._v(" "),
                                          a("h3", { staticClass: "screen_out" }, [t._v("our partners")]),
                                          t._v(" "),
                                          a("Banner", {
                                              attrs: { options: { slotSize: t.bannerData.length, isBtnStatic: !1, isLoop: !0, isAutoPlay: !0, autoPlayDuration: 5e3, alignItem: "left", type: "wide" } },
                                              scopedSlots: t._u(
                                                  [
                                                      t._l(t.bannerData, function (e, i) {
                                                          return {
                                                              key: "slot" + i,
                                                              fn: function () {
                                                                  return [
                                                                      a("div", { key: "route" + i, staticClass: "route_info", style: { background: "url(" + t.toThumb(t.thumbInfos0, e.image.url)["data-src"] + ") 0 0/cover no-repeat" } }, [
                                                                          a("div", { staticClass: "inner_info" }, [
                                                                              a("a", {
                                                                                  staticClass: "link_desc",
                                                                                  attrs: { href: e.link.more, "data-tiara-action-name": t.bannerLog.name, "data-tiara-layer": t.bannerLog.layer },
                                                                                  domProps: { innerHTML: t._s(e.title) },
                                                                              }),
                                                                              t._v(" "),
                                                                              a(
                                                                                  "a",
                                                                                  { staticClass: "link_txt", attrs: { href: e.link.more, "data-tiara-action-name": t.bannerLog.name, "data-tiara-layer": t.bannerLog.layer } },
                                                                                  [a("span", { staticClass: "txt_item", domProps: { innerHTML: t._s(e.moreText) } }), a("IcoArrCircle", { attrs: { isStatic: !0 } })],
                                                                                  1
                                                                              ),
                                                                          ]),
                                                                      ]),
                                                                  ];
                                                              },
                                                              proxy: !0,
                                                          };
                                                      }),
                                                  ],
                                                  null,
                                                  !0
                                              ),
                                          }),
                                      ],
                                      1
                                  );
                        },
                        [],
                        !1,
                        null,
                        "0b887d24",
                        null
                    ).exports);
            function M(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            function P(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var a = null != arguments[e] ? arguments[e] : {};
                    e % 2
                        ? M(Object(a), !0).forEach(function (e) {
                              Object(s.a)(t, e, a[e]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                        : M(Object(a)).forEach(function (e) {
                              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                          });
                }
                return t;
            }
            var H = { name: "ContentLayout", components: { SNB: x.a, Aside: S }, computed: P(P({}, Object(r.b)(["hasSNB", "headings", "hasBanner"])), Object(r.b)("SNB", ["SNBData"])) },
                O =
                    (a(288),
                    Object(o.a)(
                        H,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("main", { staticClass: "doc-main" }, [
                                a(
                                    "section",
                                    { class: ["inner-main", { inner_service: !t.isMobile && !!t.SNBData && 0 !== t.SNBData.length }] },
                                    [
                                        a("h2", { staticClass: "screen_out" }, [t._v(t._s(t.headings.h2))]),
                                        t._v(" "),
                                        !t.isMobile && t.SNBData && 0 !== t.SNBData.length ? a("SNB") : t._e(),
                                        t._v(" "),
                                        a("article", { staticClass: "content-article", attrs: { id: "mainContent" } }, [a("h3", { staticClass: "screen_out" }, [t._v(t._s(t.headings.h3))]), t._v(" "), a("nuxt")], 1),
                                        t._v(" "),
                                        t.hasBanner ? a("Aside") : t._e(),
                                    ],
                                    1
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "7aa2f31c",
                        null
                    ).exports),
                B = {
                    name: "FooterLayout",
                    components: {
                        IcoLogo: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_logo", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 96 20", fill: "#131415" } }, [
                                    e("title", [this._v("kakaoi")]),
                                    this._v(" "),
                                    e("use", { attrs: { "xlink:href": "#icoLogo" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoArrow: a(45).a,
                        SnsShare: _,
                    },
                    data: function () {
                        return {
                            footer: {
                                policyInfos: [
                                    { text: "서비스 약관", link: "https://mk.kakaocdn.net/dn/eva_res/heykakao/terms/public/v1/heykakao_terms.html", tiaraName: "Footer_서비스약관클릭", tiaraLayer: "terms" },
                                    { text: "개인정보 취급방침", link: "https://www.kakao.com/policy/privacy", tiaraName: "Footer_개인정보취급방침클릭", tiaraLayer: "privacy" },
                                    { text: "제휴제안 문의", link: "https://with.kakao.com/kakaoi/proposition", tiaraName: "Footer_제휴제안클릭", tiaraLayer: "proposal" },
                                    { text: "고객센터", link: "https://cs.kakao.com/", tiaraName: "Footer_고객센터클릭", tiaraLayer: "cscenter" },
                                ],
                                relatedServices: [
                                    { text: "Kakao Enterprise", link: "https://www.kakaoenterprise.com/", tiaraName: "Footer_기업사이트클릭", tiaraLayer: "kepsite", isShow: !1 },
                                    { text: "Kakao Enterprise Tech Blog", link: "https://tech.kakaoenterprise.com/", tiaraName: "Footer_Tech&블로그클릭", tiaraLayer: "techblog", isShow: !1 },
                                    { text: "Kakao i Developers", link: "https://i.kakao.com", tiaraName: "Footer_Developers클릭", tiaraLayer: "developers", isShow: !1 },
                                ],
                            },
                            isOnRelated: !1,
                            timeout: null,
                            snsTiaraLog: [
                                { tiaraName: "Footer_공유_카카오톡클릭", tiaraLayer: "share_kakaotalk" },
                                { tiaraName: "Footer_공유_카카오스토리클릭", tiaraLayer: "share_kakaostory" },
                                { tiaraName: "Footer_공유_facebook클릭", tiaraLayer: "share_facebook" },
                                { tiaraName: "Fooer_공유_twitter클릭", tiaraLayer: "share_twitter" },
                            ],
                        };
                    },
                    methods: {
                        setRelatedIsShow: function (t) {
                            var e = this,
                                a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200,
                                i = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                                s = arguments.length > 3 ? arguments[3] : void 0,
                                n = i ? t : this.footer.relatedServices.length - 1 - t;
                            this.timeout = window.setTimeout(function () {
                                e.footer.relatedServices[n] ? ((e.footer.relatedServices[n].isShow = i), e.setRelatedIsShow(t + 1, 200, i, s)) : ((e.timeout = null), "function" == typeof s && s());
                            }, a);
                        },
                        onClickBtnRelated: function () {
                            this.isOnRelated
                                ? this.timeout
                                    ? (this.clearTimeout(), this.controlRelatedLayer("close"))
                                    : this.setRelatedIsShow(0, 0, !1, this.controlRelatedLayer.bind(null, "close"))
                                : (this.timeout && this.clearTimeout(), this.controlRelatedLayer("open"), this.setRelatedIsShow(0, 200, !0));
                        },
                        clearTimeout: function () {
                            var t = this;
                            window.clearTimeout(this.timeout),
                                (this.timeout = null),
                                this.footer.relatedServices.forEach(function (e, a) {
                                    t.footer.relatedServices[a].isShow = !t.isOnRelated;
                                });
                        },
                        controlRelatedLayer: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "open";
                            this.isOnRelated = "open" === t;
                            var e = this.$refs.related,
                                a = this.isOnRelated ? "".concat(e.children[0].offsetHeight, "px") : 0;
                            e.style.maxHeight = a;
                        },
                    },
                },
                N =
                    (a(289),
                    Object(o.a)(
                        B,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "footer",
                                { staticClass: "doc-footer", attrs: { "data-tiara-layer": "Footer" } },
                                [
                                    a("div", { staticClass: "wrap_logo" }, [a("router-link", { attrs: { to: "/", "data-tiara-action-name": "Footer_로고클릭", "data-tiara-layer": "logo" } }, [a("IcoLogo")], 1)], 1),
                                    t._v(" "),
                                    t.isMobile
                                        ? [
                                              a(
                                                  "div",
                                                  { staticClass: "info_policy" },
                                                  [
                                                      a("strong", { staticClass: "screen_out" }, [t._v("카카오 i 정책 및 약관")]),
                                                      t._v(" "),
                                                      a(
                                                          "ul",
                                                          { staticClass: "list_policy" },
                                                          t._l(t.footer.policyInfos, function (e, i) {
                                                              return a("li", { key: "policyItem" + i }, [
                                                                  a("a", { attrs: { href: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer, target: "_blank" } }, [t._v(t._s(e.text))]),
                                                              ]);
                                                          }),
                                                          0
                                                      ),
                                                      t._v(" "),
                                                      a("SnsShare", { attrs: { snsTiaraLog: t.snsTiaraLog } }),
                                                  ],
                                                  1
                                              ),
                                              t._v(" "),
                                              a("div", { class: ["info_related", { open_list: t.isOnRelated }] }, [
                                                  a("strong", { staticClass: "screen_out" }, [t._v("카카오 i 관련사이트")]),
                                                  t._v(" "),
                                                  a("button", { staticClass: "btn_related", attrs: { type: "button" }, on: { click: t.onClickBtnRelated } }, [t._v("관련사이트")]),
                                                  t._v(" "),
                                                  a("div", { ref: "related", staticClass: "wrap_related" }, [
                                                      a(
                                                          "ul",
                                                          { staticClass: "list_related" },
                                                          t._l(t.footer.relatedServices, function (e, i) {
                                                              return a("li", { key: "relatedItem" + i, class: { show_item: e.isShow } }, [
                                                                  a("a", { staticClass: "link_related", attrs: { href: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer, target: "_blank" } }, [
                                                                      t._v(t._s(e.text)),
                                                                  ]),
                                                              ]);
                                                          }),
                                                          0
                                                      ),
                                                  ]),
                                              ]),
                                              t._v(" "),
                                              a("div", { staticClass: "info_copyright" }, [
                                                  t._m(1),
                                                  t._v(" "),
                                                  a(
                                                      "button",
                                                      {
                                                          directives: [
                                                              {
                                                                  name: "scroll-to",
                                                                  rawName: "v-scroll-to",
                                                                  value: { el: ".container-doc", duration: 1500, offset: -56 },
                                                                  expression: "{\n          el: '.container-doc',\n          duration: 1500,\n          offset: -56\n        }",
                                                              },
                                                          ],
                                                          staticClass: "btn_top",
                                                          attrs: { type: "button", "data-tiara-action-name": "Footer_위로버튼클릭", "data-tiara-layer": "backtotop" },
                                                      },
                                                      [a("IcoArrow"), a("span", { staticClass: "screen_out" }, [t._v("Back to top")])],
                                                      1
                                                  ),
                                              ]),
                                          ]
                                        : [
                                              a("div", { staticClass: "info_policy" }, [
                                                  a("strong", { staticClass: "screen_out" }, [t._v("카카오 i 정책 및 약관")]),
                                                  t._v(" "),
                                                  a(
                                                      "ul",
                                                      { staticClass: "list_policy" },
                                                      t._l(t.footer.policyInfos, function (e, i) {
                                                          return a("li", { key: "policyItem" + i }, [
                                                              a("a", { attrs: { href: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer, target: "_blank" } }, [t._v(t._s(e.text))]),
                                                          ]);
                                                      }),
                                                      0
                                                  ),
                                                  t._v(" "),
                                                  t._m(0),
                                              ]),
                                              t._v(" "),
                                              a(
                                                  "div",
                                                  { staticClass: "info_related" },
                                                  [
                                                      a("strong", { staticClass: "screen_out" }, [t._v("카카오 i 관련사이트")]),
                                                      t._v(" "),
                                                      a(
                                                          "ul",
                                                          { staticClass: "list_related" },
                                                          t._l(t.footer.relatedServices, function (e, i) {
                                                              return a("li", { key: "relatedItem" + i }, [
                                                                  a("a", { staticClass: "link_related", attrs: { href: e.link, "data-tiara-action-name": e.tiaraName, "data-tiara-layer": e.tiaraLayer, target: "_blank" } }, [
                                                                      t._v(t._s(e.text)),
                                                                  ]),
                                                              ]);
                                                          }),
                                                          0
                                                      ),
                                                      t._v(" "),
                                                      a("SnsShare", { attrs: { snsTiaraLog: t.snsTiaraLog } }),
                                                  ],
                                                  1
                                              ),
                                              t._v(" "),
                                              a(
                                                  "button",
                                                  {
                                                      directives: [
                                                          {
                                                              name: "scroll-to",
                                                              rawName: "v-scroll-to",
                                                              value: { el: ".container-doc", duration: 1500, offset: -60 },
                                                              expression: "{\n        el: '.container-doc',\n        duration: 1500,\n        offset: -60\n      }",
                                                          },
                                                      ],
                                                      staticClass: "btn_top",
                                                      attrs: { type: "button", "data-tiara-action-name": "Footer_위로버튼클릭", "data-tiara-layer": "backtotop" },
                                                  },
                                                  [t._v("Back to top")]
                                              ),
                                          ],
                                ],
                                2
                            );
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("small", { staticClass: "txt_copyright" }, [
                                    this._v("© "),
                                    e("a", { attrs: { href: "https://www.kakaoenterprise.com/", target: "_blank" } }, [this._v("Kakao Enterprise")]),
                                    this._v(". The Kakao i is a trademark of Kakaocorp."),
                                ]);
                            },
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("small", { staticClass: "txt_copyright" }, [
                                    this._v("© "),
                                    e("a", { attrs: { href: "https://www.kakaoenterprise.com/", target: "_blank" } }, [this._v("Kakao Enterprise")]),
                                    this._v("."),
                                    e("br"),
                                    this._v("The Kakao i is a trademark of Kakaocorp."),
                                ]);
                            },
                        ],
                        !1,
                        null,
                        "d589cca6",
                        null
                    ).exports),
                j = a(70),
                z = a.n(j);
            function E(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            var A = {
                    scrollToTop: !0,
                    scrollBehavior: function (t, e, a) {
                        return { x: 0, y: 0 };
                    },
                    name: "BaseLayout",
                    head: function () {
                        var t = this.isMobile ? [{ hid: "viewport", name: "viewport", content: "user-scalable=no, width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1.0, viewport-fit=cover" }] : [];
                        return { bodyAttrs: { class: this.bodyClass }, meta: t };
                    },
                    computed: (function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = null != arguments[e] ? arguments[e] : {};
                            e % 2
                                ? E(Object(a), !0).forEach(function (e) {
                                      Object(s.a)(t, e, a[e]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                                : E(Object(a)).forEach(function (e) {
                                      Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                                  });
                        }
                        return t;
                    })({}, Object(r.b)(["bodyClass", "isHeaderTransparent"])),
                    data: function () {
                        return { isHeaderOn: !0 };
                    },
                    created: function () {
                        this.$store.dispatch("addEventThumbSize"), window.addEventListener("scroll", this.setHeaderMode());
                    },
                    beforeDestroy: function () {
                        this.$store.dispatch("removeEventThumbSize"), this.isHeaderTransparent && window.removeEventListener("scroll", this.setHeaderMode());
                    },
                    methods: {
                        setHeaderMode: function () {
                            var t = this;
                            return z()(function () {
                                t.isHeaderOn = window.pageYOffset <= 0;
                            }, 10);
                        },
                    },
                },
                $ = Object(o.a)(
                    A,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { class: { ty_bg: t.isHeaderTransparent, head_type: t.isHeaderTransparent && t.isHeaderOn, scroll_type: !(t.isHeaderTransparent && t.isHeaderOn) } }, [
                            t._m(0),
                            t._v(" "),
                            a("div", { staticClass: "container-doc" }, [t._t("default")], 2),
                        ]);
                    },
                    [
                        function () {
                            var t = this.$createElement,
                                e = this._self._c || t;
                            return e("div", { staticClass: "direct-link" }, [e("a", { attrs: { href: "#mainContent" } }, [this._v("본문 바로가기")]), this._v(" "), e("a", { attrs: { href: "#gnbContent" } }, [this._v("메뉴 바로가기")])]);
                        },
                    ],
                    !1,
                    null,
                    "7448266a",
                    null
                ).exports,
                F = { components: { DefineSVG: i.a, HeaderLayout: y, ContentLayout: O, FooterLayout: N, BaseLayout: $ } },
                Y = Object(o.a)(
                    F,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("BaseLayout", [e("DefineSVG"), this._v(" "), e("HeaderLayout"), this._v(" "), e("ContentLayout"), this._v(" "), e("FooterLayout")], 1);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = Y.exports;
        },
        function (t, e, a) {
            "use strict";
            a(20), a(12), a(7), a(5), a(9);
            var i = a(6),
                s = a(8);
            function n(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            var r = {
                    components: { DefineSVG: a(175).a },
                    computed: (function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = null != arguments[e] ? arguments[e] : {};
                            e % 2
                                ? n(Object(a), !0).forEach(function (e) {
                                      Object(i.a)(t, e, a[e]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                                : n(Object(a)).forEach(function (e) {
                                      Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                                  });
                        }
                        return t;
                    })({}, Object(s.b)(["bodyClass"])),
                    head: function () {
                        var t = this.isMobile ? [{ hid: "viewport", name: "viewport", content: "user-scalable=no, width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1.0, viewport-fit=cover" }] : [];
                        return { bodyAttrs: { class: this.isMobile ? "mobile" : "pc" }, meta: t };
                    },
                },
                o = a(0),
                c = Object(o.a)(
                    r,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("div", [e("nuxt"), this._v(" "), e("DefineSVG")], 1);
                    },
                    [],
                    !1,
                    null,
                    null,
                    null
                );
            e.a = c.exports;
        },
        function (t, e, a) {
            "use strict";
            var i = {
                    name: "NuxtLoading",
                    data: function () {
                        return { percent: 0, show: !1, canSucceed: !0, reversed: !1, skipTimerCount: 0, rtl: !1, throttle: 200, duration: 5e3, continuous: !1 };
                    },
                    computed: {
                        left: function () {
                            return !(!this.continuous && !this.rtl) && (this.rtl ? (this.reversed ? "0px" : "auto") : this.reversed ? "auto" : "0px");
                        },
                    },
                    beforeDestroy: function () {
                        this.clear();
                    },
                    methods: {
                        clear: function () {
                            clearInterval(this._timer), clearTimeout(this._throttle), (this._timer = null);
                        },
                        start: function () {
                            var t = this;
                            return (
                                this.clear(),
                                (this.percent = 0),
                                (this.reversed = !1),
                                (this.skipTimerCount = 0),
                                (this.canSucceed = !0),
                                this.throttle
                                    ? (this._throttle = setTimeout(function () {
                                          return t.startTimer();
                                      }, this.throttle))
                                    : this.startTimer(),
                                this
                            );
                        },
                        set: function (t) {
                            return (this.show = !0), (this.canSucceed = !0), (this.percent = Math.min(100, Math.max(0, Math.floor(t)))), this;
                        },
                        get: function () {
                            return this.percent;
                        },
                        increase: function (t) {
                            return (this.percent = Math.min(100, Math.floor(this.percent + t))), this;
                        },
                        decrease: function (t) {
                            return (this.percent = Math.max(0, Math.floor(this.percent - t))), this;
                        },
                        pause: function () {
                            return clearInterval(this._timer), this;
                        },
                        resume: function () {
                            return this.startTimer(), this;
                        },
                        finish: function () {
                            return (this.percent = this.reversed ? 0 : 100), this.hide(), this;
                        },
                        hide: function () {
                            var t = this;
                            return (
                                this.clear(),
                                setTimeout(function () {
                                    (t.show = !1),
                                        t.$nextTick(function () {
                                            (t.percent = 0), (t.reversed = !1);
                                        });
                                }, 500),
                                this
                            );
                        },
                        fail: function (t) {
                            return (this.canSucceed = !1), this;
                        },
                        startTimer: function () {
                            var t = this;
                            this.show || (this.show = !0),
                                void 0 === this._cut && (this._cut = 1e4 / Math.floor(this.duration)),
                                (this._timer = setInterval(function () {
                                    t.skipTimerCount > 0
                                        ? t.skipTimerCount--
                                        : (t.reversed ? t.decrease(t._cut) : t.increase(t._cut), t.continuous && (t.percent >= 100 || t.percent <= 0) && ((t.skipTimerCount = 1), (t.reversed = !t.reversed)));
                                }, 100));
                        },
                    },
                    render: function (t) {
                        var e = t(!1);
                        return (
                            this.show &&
                                (e = t("div", {
                                    staticClass: "nuxt-progress",
                                    class: { "nuxt-progress-notransition": this.skipTimerCount > 0, "nuxt-progress-failed": !this.canSucceed },
                                    style: { width: this.percent + "%", left: this.left },
                                })),
                            e
                        );
                    },
                },
                s = (a(275), a(0)),
                n = Object(s.a)(i, void 0, void 0, !1, null, null, null);
            e.a = n.exports;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(86);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(87);
            a.n(i).a;
        },
        function (t, e, a) {},
        function (t, e, a) {
            "use strict";
            var i = a(88);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(89);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(90);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(91);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(92);
            a.n(i).a;
        },
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(93);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(94);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(95);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(96);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(97);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(98);
            a.n(i).a;
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, a) {
            "use strict";
            var i = a(99);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(100);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(101);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(102);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(103);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(104);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(105);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(106);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(107);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(108);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(109);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(110);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(111);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(112);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(113);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(114);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(115);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(116);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(117);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(118);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(119);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(120);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(121);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(122);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(123);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(124);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(125);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(126);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(127);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(128);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(129);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(130);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(131);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(132);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(133);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(134);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(135);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(136);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(137);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(138);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(139);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(140);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(141);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(142);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(143);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(144);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(145);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(146);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(147);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(148);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(149);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(150);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(151);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(152);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(153);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(154);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(155);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(156);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(157);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(158);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(159);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(160);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(161);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(162);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(163);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(164);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(165);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(166);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(167);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(168);
            a.n(i).a;
        },
        function (t, e, a) {
            "use strict";
            var i = a(169);
            a.n(i).a;
        },
        ,
        function (t, e, a) {
            "use strict";
            a.r(e);
            var i = a(30),
                s = a(31),
                n = a(0),
                r = {
                    name: "infoMessage",
                    components: {
                        IcoAIItem: Object(n.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_ai", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" } }, [e("use", { attrs: { "xlink:href": "#icoAIItem" } })]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                    },
                    props: { messageData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos: { 375: "466x984", 1440: "658x1396", 1920: "658x1396", 2560: "658x1396" }, isShow: !1, thumbItemHeight: 100, windowHeight: 0, state: "ready", translateY: 0, activeIdx: 0 };
                    },
                    created: function () {
                        this.isMobile && (this.windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight, this.windowHeight || 0));
                    },
                    mounted: function () {
                        var t = this;
                        this.isMobile &&
                            ((this.thumbElem = this.$refs.thumb),
                            (this.targetImgElem = this.$refs.targetImg),
                            (this.thumbItemHeight = this.thumbElem.offsetHeight),
                            window.addEventListener("load", function () {
                                t.thumbItemHeight = t.thumbElem.offsetHeight;
                            }),
                            this.getPointInfos(),
                            window.addEventListener("scroll", this.onScrollSetState),
                            window.addEventListener("resize", this.getPointInfos));
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.getPointInfos);
                    },
                    methods: {
                        getPointInfos: function () {
                            var t = this.thumbElem.getBoundingClientRect().top,
                                e = window.pageYOffset;
                            this.reachStandardTop = e + t - this.alignCenterTop;
                        },
                        onScrollSetState: function () {
                            var t = window.pageYOffset,
                                e = t >= this.reachStandardTop,
                                a = t <= this.reachStandardTop + this.thumbItemHeight;
                            e
                                ? e && a
                                    ? ((this.state = "active"), (this.activeIdx = Math.round((t - this.reachStandardTop) / this.thumbItemHeight)))
                                    : ((this.state = "done"), (this.translateY = this.thumbItemHeight))
                                : (this.state = "ready");
                        },
                        reachTargetAction: function () {
                            var t = this;
                            this.messageData.messages.forEach(function (e, a) {
                                t.setTimeoutShow(a);
                            });
                        },
                        setTimeoutShow: function (t) {
                            var e = this,
                                a = 500 * t;
                            window.setTimeout(function () {
                                e.messageData.messages[t].isShow = !0;
                            }, a);
                        },
                    },
                    computed: {
                        alignCenterTop: function () {
                            return (this.windowHeight - 56 - this.thumbItemHeight) / 2 + 56;
                        },
                        totalHeight: function () {
                            return 2 * this.thumbItemHeight;
                        },
                    },
                },
                o =
                    (a(327),
                    Object(n.a)(
                        r,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_message" }, [
                                a(
                                    "div",
                                    { staticClass: "inner_message" },
                                    [
                                        a("div", { staticClass: "message_cont" }, [
                                            a("h4", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.messageData.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.messageData.description) } }),
                                            t._v(" "),
                                            a(
                                                "ul",
                                                {
                                                    directives: [
                                                        {
                                                            name: "aos",
                                                            rawName: "v-aos",
                                                            value: { threshold: [1], callbackName: "reachTargetAction", rootMargin: "-15px 0px 0px 0px" },
                                                            expression: "{threshold: [1], callbackName: 'reachTargetAction', rootMargin: '-15px 0px 0px 0px'}",
                                                        },
                                                    ],
                                                    staticClass: "list_message",
                                                },
                                                t._l(t.messageData.messages, function (e, i) {
                                                    return a("li", { key: "message" + i, class: { show: e.isShow, ty_right: "right" === e.type, ty_left: "left" === e.type } }, [
                                                        a("em", { staticClass: "emph_command" }, ["right" === e.type ? a("IcoAIItem") : t._e(), t._v(t._s(e.text))], 1),
                                                    ]);
                                                }),
                                                0
                                            ),
                                        ]),
                                        t._v(" "),
                                        t.isMobile
                                            ? [
                                                  a("div", { staticClass: "wrap_thumb", style: { height: t.totalHeight + "px" } }, [
                                                      a(
                                                          "div",
                                                          {
                                                              directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                                              ref: "thumb",
                                                              staticClass: "thumb_shadow",
                                                              style: { top: t.alignCenterTop + "px" },
                                                              attrs: { "sticky-offset": "{top: " + t.alignCenterTop + ", bottom: 0}", "on-stick": "onStick", "sticky-z-index": "1", "sticky-side": "top" },
                                                          },
                                                          [
                                                              a(
                                                                  "transition-group",
                                                                  { staticClass: "inner_shadow", attrs: { name: "image", tag: "div" } },
                                                                  t._l(t.messageData.images.mo, function (e, i) {
                                                                      return a(
                                                                          "img",
                                                                          t._b(
                                                                              {
                                                                                  directives: [
                                                                                      { name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" },
                                                                                      { name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" },
                                                                                  ],
                                                                                  key: "image" + i,
                                                                                  attrs: { alt: e.imgDescription },
                                                                              },
                                                                              "img",
                                                                              t.toThumb(t.thumbInfos, e.url),
                                                                              !1
                                                                          )
                                                                      );
                                                                  }),
                                                                  0
                                                              ),
                                                          ],
                                                          1
                                                      ),
                                                  ]),
                                              ]
                                            : t._l(t.messageData.images.pc, function (e, i) {
                                                  return a("div", { key: "thumb" + i, staticClass: "wrap_thumb" }, [
                                                      a("div", { staticClass: "thumb_shadow" }, [
                                                          a(
                                                              "img",
                                                              t._b(
                                                                  { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }], attrs: { alt: e.imgDescription } },
                                                                  "img",
                                                                  t.toThumb(t.thumbInfos, e.url),
                                                                  !1
                                                              )
                                                          ),
                                                      ]),
                                                  ]);
                                              }),
                                    ],
                                    2
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "88186dcc",
                        null
                    ).exports),
                c = {
                    components: { Parallax: a(25).a },
                    name: "infoFeature",
                    props: { featureData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos0: { 375: "510x1078", 1440: "832x1764", 1920: "832x1764", 2560: "832x1764" } };
                    },
                },
                l =
                    (a(329),
                    Object(n.a)(
                        c,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_feature" },
                                [
                                    t.isMobile
                                        ? [
                                              a("div", { staticClass: "wrap_cont" }, [
                                                  a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.featureData.title) } }),
                                                  t._v(" "),
                                                  a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.featureData.description) } }),
                                              ]),
                                              t._v(" "),
                                              a(
                                                  "div",
                                                  { staticClass: "wrap_thumb" },
                                                  [
                                                      a("Parallax", { attrs: { speedFactor: 1, direction: "down", availableOffset: 40 } }, [
                                                          a(
                                                              "img",
                                                              t._b(
                                                                  {
                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                      attrs: { alt: t.featureData.image.imgDescription },
                                                                  },
                                                                  "img",
                                                                  t.toThumb(t.thumbInfos0, t.featureData.image.url),
                                                                  !1
                                                              )
                                                          ),
                                                      ]),
                                                  ],
                                                  1
                                              ),
                                          ]
                                        : [
                                              a(
                                                  "div",
                                                  { staticClass: "wrap_thumb" },
                                                  [
                                                      a("Parallax", { attrs: { speedFactor: 1, direction: "down" } }, [
                                                          a(
                                                              "img",
                                                              t._b(
                                                                  {
                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                      attrs: { alt: t.featureData.image.imgDescription },
                                                                  },
                                                                  "img",
                                                                  t.toThumb(t.thumbInfos0, t.featureData.image.url),
                                                                  !1
                                                              )
                                                          ),
                                                      ]),
                                                  ],
                                                  1
                                              ),
                                              t._v(" "),
                                              a("div", { staticClass: "wrap_cont" }, [
                                                  a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.featureData.title) } }),
                                                  t._v(" "),
                                                  a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.featureData.description) } }),
                                              ]),
                                          ],
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "6f537779",
                        null
                    ).exports),
                m = a(172),
                u = a(4),
                p = a(26),
                d = (a(28), a(385), a(39), a(32)),
                h = {
                    components: { Paging: d.a },
                    props: { slotSize: { type: Number, default: 3 } },
                    data: function () {
                        return {
                            readyIdx: 0,
                            activeIdx: 0,
                            activeTextIdx: 0,
                            contentHeight: 0,
                            translateY: 0,
                            windowHeight: 0,
                            alignCenterTop: 0,
                            state: "ready",
                            pageYOffset: 0,
                            navHeight: 60,
                            contentItemMarginTop: 0,
                            isReachCenterPoint: !0,
                            percent: 1,
                            thumbsHeight: [],
                            stopRangeY: 0,
                            textOpacities: [],
                            minDeviceHeight: 600,
                            maxStopPositionY: 300,
                            marginTop: 0,
                        };
                    },
                    computed: {
                        totalHeight: function () {
                            return this.isMobile ? (this.contentHeight + this.standardStopPositionY) * this.slotSize + this.descElemHeight + this.contentItemMarginTop : (this.contentHeight + this.standardStopPositionY) * this.slotSize;
                        },
                        contAlignPositionY: function () {
                            return this.isMobile ? this.navHeight - this.contentItemMarginTop : this.alignCenterTop;
                        },
                        standardHeight: function () {
                            return this.windowHeight >= this.minDeviceHeight ? this.windowHeight - this.navHeight : this.minDeviceHeight;
                        },
                        standardStopPositionY: function () {
                            return Math.min(this.minDeviceHeight / 4, this.maxStopPositionY);
                        },
                        contItemTop: function () {
                            var t = this;
                            return function (e) {
                                var a = void 0 === t.thumbsHeight[e] ? 0 : t.thumbsHeight[e];
                                return t.standardHeight / 2 + a / 2;
                            };
                        },
                    },
                    mounted: function () {
                        this.slotSize <= 1 ||
                            ((this.textOpacities = new Array(this.slotSize).fill(0)), this.getPointInfos(), window.addEventListener("scroll", this.onScrollSetState), window.addEventListener("resize", this.onScrollSetState));
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.onScrollSetState);
                    },
                    methods: {
                        getPointInfos: function () {
                            this.windowHeight = window.innerHeight;
                            var t = this.$refs.container,
                                e = this.$refs.thumb,
                                a = this.$refs.thumbItem,
                                i = t.getBoundingClientRect().top;
                            this.marginTop = this.minDeviceHeight + 200 - this.standardHeight > 0 ? this.minDeviceHeight + 200 - this.standardHeight : 0;
                            var s = window.pageYOffset + i;
                            (this.contentItemMarginTop = Number(window.getComputedStyle(t).marginTop.replace("px", ""))),
                                (this.contentHeight = e.getBoundingClientRect().height),
                                (this.alignCenterTop = (this.windowHeight - this.contentHeight - this.navHeight) / 2),
                                (this.reachStandardTop = s - this.alignCenterTop),
                                (this.totalContentHeight = this.contentHeight * (this.slotSize - 1)),
                                (this.thumbsHeight = a.map(function (t, e) {
                                    return t.children[0].offsetHeight;
                                }));
                        },
                        onScrollSetState: function () {
                            this.getPointInfos();
                            var t = pageYOffset >= this.reachStandardTop,
                                e = pageYOffset <= this.reachStandardTop + this.totalContentHeight + this.standardStopPositionY * this.slotSize;
                            t
                                ? t && e
                                    ? ((this.state = "active"), this.activeScrollActions(pageYOffset))
                                    : ((this.state = "done"), (this.activeIdx = this.slotSize - 1), (this.translateY = -1 * this.totalContentHeight), (this.isReachCenterPoint = !0), (this.textOpacities[this.textOpacities - 1] = 1))
                                : ((this.state = "ready"), (this.activeIdx = 0), (this.translateY = 0), (this.isReachCenterPoint = !0), (this.textOpacities[0] = 0));
                        },
                        activeScrollActions: function (t) {
                            var e = t - this.reachStandardTop,
                                a = this.standardHeight + this.standardStopPositionY,
                                i = e / a,
                                s = e % a,
                                n = Math.floor(i) + (s >= this.standardStopPositionY ? 1 : 0);
                            (this.activeTextIdx = n), (this.stopRangeY = this.standardStopPositionY * this.activeTextIdx), (this.standardRangeY = this.standardStopPositionY * this.activeIdx);
                            var r = e - this.stopRangeY,
                                o = e / this.standardHeight,
                                c = Math.round(o),
                                l = Math.floor(o),
                                m = this.activeIdx * this.standardHeight;
                            Math.ceil(o);
                            this.isReachCenterPoint = c !== l;
                            var u = m + this.standardRangeY,
                                p = m + this.standardRangeY + this.standardStopPositionY,
                                d = m + this.standardRangeY + 2 * this.standardStopPositionY;
                            if (u <= e && p >= e) {
                                this.translateY = -l * this.standardHeight;
                                var h = s / this.standardStopPositionY;
                                this.setTextOpacities(this.activeTextIdx, h);
                            } else {
                                if (d) {
                                    var v = 1 - (s - this.standardStopPositionY) / this.standardStopPositionY;
                                    this.setTextOpacities(this.activeIdx, v);
                                }
                                this.translateY = -r;
                            }
                            this.activeIdx = l;
                        },
                        setTextOpacities: function (t, e) {
                            this.textOpacities = Object(p.a)(this.textOpacities).map(function (a, i) {
                                return t === i ? e : 0;
                            });
                        },
                    },
                },
                v =
                    (a(333),
                    Object(n.a)(
                        h,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return 1 !== t.slotSize
                                ? a("div", { ref: "container", class: "cont_scroll " + t.state, style: "height: " + t.totalHeight + "px;margin:" + t.marginTop + "px 0" }, [
                                      a(
                                          "div",
                                          {
                                              directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                              ref: "scroll",
                                              staticClass: "scroll_item",
                                              style: { height: t.standardHeight + "px" },
                                              attrs: { "sticky-offset": "{top: " + t.navHeight + "}", "on-stick": "onStick", "sticky-z-index": "1", "sticky-side": "top", "center-position": "true" },
                                          },
                                          [
                                              a("div", { ref: "desc", staticClass: "area_desc" }, [t._t("desc")], 2),
                                              t._v(" "),
                                              a(
                                                  "div",
                                                  { ref: "card", staticClass: "area_card" },
                                                  [
                                                      a(
                                                          "div",
                                                          { ref: "thumb", staticClass: "inner_thumb", style: "transform: translateY(" + t.translateY + "px)" },
                                                          t._l(t.slotSize, function (e, i) {
                                                              return a("div", { key: "thumb" + i, ref: "thumbItem", refInFor: !0, staticClass: "wrap_thumb" }, [t._t("thumb" + i)], 2);
                                                          }),
                                                          0
                                                      ),
                                                      t._v(" "),
                                                      t._l(t.slotSize, function (e, i) {
                                                          return a(
                                                              "div",
                                                              { key: "cardCont" + i, class: ["wrap_cont", { active: t.activeIdx == i }], style: { opacity: t.textOpacities[i], top: t.contItemTop(i) + "px" } },
                                                              [t._t("cont" + i)],
                                                              2
                                                          );
                                                      }),
                                                  ],
                                                  2
                                              ),
                                          ]
                                      ),
                                  ])
                                : a("div", { staticClass: "cont_scroll" }, [
                                      a("div", { staticClass: "scroll_item" }, [
                                          a("div", { ref: "desc", staticClass: "area_desc" }, [t._t("desc0")], 2),
                                          t._v(" "),
                                          a("div", { staticClass: "area_card" }, [a("div", { staticClass: "wrap_cont" }, [t._t("cont0")], 2)]),
                                      ]),
                                  ]);
                        },
                        [],
                        !1,
                        null,
                        "3efca464",
                        null
                    ).exports),
                g = {
                    components: { Paging: d.a },
                    props: { slotSize: { type: Number, default: 3 } },
                    data: function () {
                        return { activePoint: null, translateY: 0, windowHeight: 0, state: "ready", navHeight: 56, stopPositionY: 900, minDeviceHeight: 668, marginTop: 0, standardHeight: 0 };
                    },
                    computed: {
                        totalHeight: function () {
                            return this.scrollItemHeight + this.stopPositionY * this.slotSize;
                        },
                        contAlignPositionY: function () {
                            return this.isMobile ? this.navHeight - this.contentItemMarginTop : this.alignCenterTop;
                        },
                        scrollItemHeight: function () {
                            return this.windowHeight - this.navHeight;
                        },
                    },
                    mounted: function () {
                        this.slotSize <= 1 ||
                            ((this.standardHeight = window.innerHeight),
                            (this.windowHeight = window.innerHeight),
                            this.standardHeight <= this.minDeviceHeight || (window.addEventListener("scroll", this.onScrollSetState), window.addEventListener("resize", this.getPointInfos)));
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.getPointInfos);
                    },
                    methods: {
                        getPointInfos: function () {
                            this.windowHeight = window.innerHeight;
                            var t = this.$refs.container,
                                e = this.$refs.thumbItem[0],
                                a = t.getBoundingClientRect().top,
                                i = window.getComputedStyle(e).marginTop,
                                s = void 0 === i ? "0px" : i;
                            (this.marginTop = 60 - Number(s.replace("px", ""))), (this.reachStandardTop = window.pageYOffset + a), (this.totalContentHeight = this.scrollItemHeight * this.slotSize);
                        },
                        onScrollSetState: function () {
                            this.getPointInfos();
                            var t = window.pageYOffset,
                                e = t >= this.reachStandardTop,
                                a = t <= this.reachStandardTop + this.stopPositionY * this.slotSize - this.navHeight;
                            if (e)
                                if (e && a) {
                                    this.state = "active";
                                    var i = t - this.reachStandardTop,
                                        s = Math.floor(i / this.stopPositionY);
                                    this.moveToPoint(s);
                                } else (this.state = "done"), this.moveToPoint(this.slotSize - 1);
                            else (this.state = "ready"), this.moveToPoint(0);
                        },
                        moveToPoint: function (t) {
                            (this.translateY = this.scrollItemHeight * t),
                                (this.$refs.inner.style.transform = "translate3d(0, -".concat(this.translateY, "px, 0)")),
                                (this.$refs.inner.style.webkitTransition = "translate3d(0, -".concat(this.translateY, "px, 0)")),
                                (this.activePoint = t);
                        },
                    },
                },
                _ =
                    (a(334),
                    {
                        components: {
                            ScrollCard: v,
                            ScrollCardMobile: Object(n.a)(
                                g,
                                function () {
                                    var t = this,
                                        e = t.$createElement,
                                        a = t._self._c || e;
                                    return t.standardHeight > t.minDeviceHeight
                                        ? a(
                                              "div",
                                              {
                                                  ref: "container",
                                                  class: "cont_scroll " + t.state + " " + (t.standardHeight <= t.minDeviceHeight ? "ty_static" : ""),
                                                  style: "height: " + t.totalHeight + "px; margin-top: " + t.marginTop + "px",
                                              },
                                              [
                                                  a(
                                                      "div",
                                                      {
                                                          directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                                          ref: "inner",
                                                          staticClass: "inner_scroll",
                                                          style: { height: t.scrollItemHeight + "px" },
                                                          attrs: { "sticky-offset": "{top: " + t.navHeight + "}", "on-stick": "onStick", "sticky-z-index": "1", "sticky-side": "top" },
                                                      },
                                                      t._l(t.slotSize, function (e, i) {
                                                          return a("div", { key: i, ref: "scroll", refInFor: !0, staticClass: "scroll_item" }, [
                                                              a("div", { ref: "thumbItem", refInFor: !0, staticClass: "wrap_thumb" }, [t._t("thumb" + i)], 2),
                                                              t._v(" "),
                                                              a("div", { staticClass: "wrap_cont", style: { opacity: i === t.activePoint ? 1 : 0 } }, [t._t("cont" + i)], 2),
                                                          ]);
                                                      }),
                                                      0
                                                  ),
                                              ]
                                          )
                                        : a("div", { staticClass: "cont_scroll ty_static" }, [
                                              a(
                                                  "div",
                                                  { staticClass: "inner_scroll" },
                                                  t._l(t.slotSize, function (e, i) {
                                                      return a("div", { key: i, staticClass: "scroll_item" }, [
                                                          a("div", { staticClass: "wrap_thumb" }, [t._t("thumb" + i)], 2),
                                                          t._v(" "),
                                                          a("div", { staticClass: "wrap_cont" }, [t._t("cont" + i)], 2),
                                                      ]);
                                                  }),
                                                  0
                                              ),
                                          ]);
                                },
                                [],
                                !1,
                                null,
                                "7abf0471",
                                null
                            ).exports,
                            Banner: u.a,
                        },
                        name: "infoMix",
                        props: { mixData: { type: Object, default: {} } },
                        data: function () {
                            return {
                                thumbInfos0: [
                                    { 375: "568x736", 1440: "756x980", 1920: "756x980", 2560: "756x980" },
                                    { 375: "568x578", 1440: "756x768", 1920: "756x768", 2560: "756x768" },
                                    { 375: "568x490", 1440: "756x650", 1920: "756x650", 2560: "756x650" },
                                ],
                                thumbInfos1: { 375: "750x1280", 1440: "2880x1720", 1920: "3840x2160", 2560: "5120x2800" },
                            };
                        },
                    }),
                f =
                    (a(335),
                    Object(n.a)(
                        _,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_mix" },
                                [
                                    t.isMobile
                                        ? [
                                              a("strong", { staticClass: "tit_scroll", domProps: { innerHTML: t._s(t.mixData.scroll.title) } }),
                                              t._v(" "),
                                              a("ScrollCardMobile", {
                                                  attrs: { slotSize: t.mixData.feature.length, isShowPaging: !1 },
                                                  scopedSlots: t._u(
                                                      [
                                                          t._l(t.mixData.scroll.items, function (e, i) {
                                                              return {
                                                                  key: "thumb" + i,
                                                                  fn: function () {
                                                                      return [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[i][t.screenType], expression: "thumbInfos0[index][screenType]" }],
                                                                                      key: "thumbItem" + i,
                                                                                      attrs: { alt: e.image.imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[i], e.image.url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ];
                                                                  },
                                                                  proxy: !0,
                                                              };
                                                          }),
                                                          t._l(t.mixData.scroll.items, function (e, i) {
                                                              return {
                                                                  key: "cont" + i,
                                                                  fn: function () {
                                                                      return [
                                                                          a("strong", { key: "contTit" + i, staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                                          t._v(" "),
                                                                          a("p", { key: "contDesc" + i, staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                                                      ];
                                                                  },
                                                                  proxy: !0,
                                                              };
                                                          }),
                                                      ],
                                                      null,
                                                      !0
                                                  ),
                                              }),
                                          ]
                                        : a("ScrollCard", {
                                              attrs: { slotSize: t.mixData.scroll.items.length },
                                              scopedSlots: t._u(
                                                  [
                                                      {
                                                          key: "desc",
                                                          fn: function () {
                                                              return [a("strong", { staticClass: "tit_scroll", domProps: { innerHTML: t._s(t.mixData.scroll.title) } })];
                                                          },
                                                          proxy: !0,
                                                      },
                                                      t._l(t.mixData.scroll.items, function (e, i) {
                                                          return {
                                                              key: "thumb" + i,
                                                              fn: function () {
                                                                  return [
                                                                      a(
                                                                          "img",
                                                                          t._b(
                                                                              {
                                                                                  directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[i][t.screenType], expression: "thumbInfos0[index][screenType]" }],
                                                                                  key: "thumbItem" + i,
                                                                                  attrs: { alt: e.image.imgDescription },
                                                                              },
                                                                              "img",
                                                                              t.toThumb(t.thumbInfos0[i], e.image.url),
                                                                              !1
                                                                          )
                                                                      ),
                                                                  ];
                                                              },
                                                              proxy: !0,
                                                          };
                                                      }),
                                                      t._l(t.mixData.scroll.items, function (e, i) {
                                                          return {
                                                              key: "cont" + i,
                                                              fn: function () {
                                                                  return [
                                                                      a("strong", { key: "contTit" + i, staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                                      t._v(" "),
                                                                      a("p", { key: "contDesc" + i, staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                                                  ];
                                                              },
                                                              proxy: !0,
                                                          };
                                                      }),
                                                  ],
                                                  null,
                                                  !0
                                              ),
                                          }),
                                    t._v(" "),
                                    a("Banner", {
                                        attrs: { options: { type: "wide" } },
                                        scopedSlots: t._u([
                                            {
                                                key: "slot0",
                                                fn: function () {
                                                    return [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                    staticClass: "img_bnv",
                                                                    attrs: { alt: t.mixData.banner.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos1, t.mixData.banner.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ];
                                                },
                                                proxy: !0,
                                            },
                                        ]),
                                    }),
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "0c905c88",
                        null
                    ).exports),
                b = {
                    components: { commonVideo: a(29).a },
                    name: "infoVideo",
                    props: { videoData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos0: { 375: "466x984", 1440: "658x1396", 1920: "658x1396", 2560: "658x1396" }, thumbInfos1: { 375: "466x984", 1440: "658x1396", 1920: "658x1396", 2560: "658x1396" } };
                    },
                    computed: {
                        videoType: function () {
                            var t = { playBtn: !0, wide: !1, replayBtn: "none", autoPlay: !0, controlsBtn: { playBtn: !1, fullscreen: !1, sounds: !1 }, haslayerList: !1, hasText: !1 };
                            return this.isMobile && (t = { playBtn: !0, wide: !1, replayBtn: "none", autoPlay: !0, controlsBtn: { playBtn: !1, fullscreen: !1, sounds: !1 }, haslayerList: !1, hasText: !1 }), t;
                        },
                    },
                    methods: {
                        replayHandling: function (t) {
                            var e = this.$refs.video[t];
                            e.replayHandling instanceof Function && e.replayHandling();
                        },
                    },
                },
                C =
                    (a(336),
                    Object(n.a)(
                        b,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_video" },
                                t._l(t.videoData.motions, function (e, i) {
                                    return a("div", { key: "motion" + i, staticClass: "cont_feature" }, [
                                        a("div", { staticClass: "wrap_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                        ]),
                                        t._v(" "),
                                        a(
                                            "div",
                                            { staticClass: "wrap_thumb" },
                                            [
                                                e.video
                                                    ? [
                                                          a(
                                                              "div",
                                                              { staticClass: "thumb_shadow" },
                                                              [
                                                                  a("commonVideo", {
                                                                      ref: "video",
                                                                      refInFor: !0,
                                                                      attrs: { videoData: e.video, type: t.videoType, thumbInfo: t.thumbInfos0, thumbType: "C", observeOpts: { threshold: [0.5] }, useThumbF: !0 },
                                                                  }),
                                                                  t._v(" "),
                                                                  a(
                                                                      "button",
                                                                      {
                                                                          staticClass: "btn_replay",
                                                                          attrs: { type: "button" },
                                                                          on: {
                                                                              click: function (e) {
                                                                                  return t.replayHandling(i);
                                                                              },
                                                                          },
                                                                      },
                                                                      [t._v("다시 재생하기")]
                                                                  ),
                                                              ],
                                                              1
                                                          ),
                                                      ]
                                                    : [
                                                          a("div", { staticClass: "thumb_shadow" }, [
                                                              a(
                                                                  "img",
                                                                  t._b(
                                                                      {
                                                                          directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                          key: "thumbItem" + i,
                                                                          attrs: { alt: e.image.imgDescription },
                                                                      },
                                                                      "img",
                                                                      t.toThumb(t.thumbInfos1, e.image.url),
                                                                      !1
                                                                  )
                                                              ),
                                                          ]),
                                                      ],
                                            ],
                                            2
                                        ),
                                    ]);
                                }),
                                0
                            );
                        },
                        [],
                        !1,
                        null,
                        "33a83b7a",
                        null
                    ).exports),
                y = {
                    components: { Banner: u.a },
                    name: "infoSuggest",
                    props: { suggestData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos0: { 375: "750x960", 1440: "2880x1440", 1920: "3840x1800", 2560: "3840x1800" }, thumbInfos1: { 375: "690x502", 1440: "1778x1294", 1920: "1778x1294", 2560: "1778x1294" } };
                    },
                },
                x =
                    (a(337),
                    Object(n.a)(
                        y,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_suggest" },
                                [
                                    a("div", { staticClass: "cont_intro" }, [
                                        a("h4", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.suggestData.intro.title) } }),
                                        t._v(" "),
                                        a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.suggestData.intro.description) } }),
                                    ]),
                                    t._v(" "),
                                    a("Banner", {
                                        attrs: { options: { type: "wide" } },
                                        scopedSlots: t._u([
                                            {
                                                key: "slot0",
                                                fn: function () {
                                                    return [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                    staticClass: "img_bnv",
                                                                    attrs: { alt: t.suggestData.intro.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos0, t.suggestData.intro.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ];
                                                },
                                                proxy: !0,
                                            },
                                        ]),
                                    }),
                                    t._v(" "),
                                    a("div", { staticClass: "cont_feature" }, [
                                        a("div", { staticClass: "wrap_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.suggestData.feature.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.suggestData.feature.description) } }),
                                        ]),
                                        t._v(" "),
                                        a("div", { staticClass: "wrap_thumb" }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                        attrs: { alt: t.suggestData.feature.image.imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos1, t.suggestData.feature.image.url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ]),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "6aba3d6d",
                        null
                    ).exports),
                k = a(24),
                w = a(33),
                T = {
                    components: { productBanner: i.a, vodInfo: s.a, infoMessage: o, infoFeature: l, infoVoice: m.a, infoMix: f, infoVideo: C, infoSuggest: x, AppBNV: k.a, BottomBNV: w.a },
                    asyncData: function (t) {
                        var e = t.store;
                        e.dispatch("setHeadings", { headings: { h2: "제품", h3: "heyKakao" } }), e.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }), e.dispatch("hasBanner", { hasBanner: !1 });
                        var a = e.getters.deviceType,
                            i = void 0 === a ? "pc" : a;
                        return {
                            visualData: {
                                title: '일상을 <i class="line_mo"></i>바꾸는 단어<br>헤이카카오',
                                scrollText: "More About <em>Heykakao</em>",
                                imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_visual.jpg?v=20090904"),
                            },
                            introData: {
                                title: "라이프 어시스턴트",
                                desc: "카카오미니의 음성 기능부터 다국어 번역까지 이 모든 것을<br>'헤이카카오 앱'에서 만나보세요.  말 한마디로 더 쉽고 편리해지는<br>생활을 경험할 수 있습니다.",
                                vodData: [
                                    {
                                        image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_video.jpg"), imgDescription: "" },
                                        video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/vod_promotion.mp4",
                                        etc: "Promotional Video",
                                    },
                                ],
                            },
                            messageData: {
                                title: "헤이카카오를 부르고<br>직접 말로 하세요",
                                description:
                                    "친구와의 약속에 늦었을 때 헤이카카오를 통해서 메시지를 보내고, 길거리를 걷던 도중 들려오는 노래가 문득 궁금하다면 헤이카카오를 불러주세요. 이제는 글자를 입력하느라 휴대폰에 집중하지 않아도 하고픈일은 말로 할 수 있습니다.",
                                messages: [
                                    { type: "left", text: "유진~ 오늘 약속 안잊었지?", isShow: !1 },
                                    { type: "right", text: "출발했는데 차가 막혀서 조금 늦을 것 같아", isShow: !1 },
                                    { type: "left", text: "응~ 도착할 때 쯤 얘기해줘!", isShow: !1 },
                                ],
                                images: {
                                    pc: [
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_02.png?v=20090904"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_01.png?v=20090904"), imgDescription: "" },
                                    ],
                                    mo: [
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_01.png?v=20090904"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_02.png?v=20090904"), imgDescription: "" },
                                    ],
                                },
                            },
                            featureData: {
                                title: '즐거운 출근길에 <i class="line_mo"></i>듣고 싶은 노래를 들려드려요',
                                description: "“출근길에 듣기 좋은 노래 들려줘” 라고 헤이카카오 앱에 말해보세요. 어떤 노래를 들을 지 검색하지 않아도 말 한마디로 원하는 음악을 들을 수 있어요.",
                                image: { type: "SQUARE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_parallax.png?v=20090904"), imgDescription: "" },
                            },
                            voiceData: {
                                intro: {
                                    title: '오늘의 날씨,<i class="line_mo"></i> 일정 등 필요한<i class="line_pc"></i>정보를 알려드릴게요.',
                                    description: "지금 필요한 정보가 있을 때 마다 바쁘게 키보드 타이핑으로 입력하지 않아도 괜찮아요.<br>이제 헤이카카오 앱을 열고 물어보세요. ",
                                },
                                banner: {
                                    commandList: [
                                        { title: "모르는 장소에 갈 때", command: "헤이카카오, 강남역까지 가는길 알려줄 수 있어?" },
                                        { title: "주말에 장보고 싶을 때", command: "헤이카카오, 근처 영업 중인 마트 알려줘" },
                                        { title: "날짜가 궁금할 때", command: "헤이카카오, 음력 6월 14일이 며칠이야?" },
                                    ],
                                    image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_feature_01.jpg?v=20090904"), imgDescription: "" },
                                },
                            },
                            videoData: {
                                motions: [
                                    {
                                        title: '지금 들리는 <i class="line_mo"></i>음악이 <i class="line_pc"></i>궁금할 땐 헤이카카오에게 <i class="line_pc"></i>들려주세요.',
                                        description: "마음에 드는 노래, 제목을 모르겠다면 헤이카카오에게 물어보세요. 나와 함께 지금 들리는 음악을 듣고서 무슨 음악인지 찾아줍니다.",
                                        video: [
                                            {
                                                image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_03.jpg?v=20090904"), imgDescription: "" },
                                                video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/vod_heykakao_01.mp4",
                                            },
                                        ],
                                    },
                                    {
                                        title: "번역이 필요할 때<br>빠르고 정확한 헤이카카오<br>번역과 함께하세요.",
                                        description: "19개 언어를 자유롭게 번역해 보세요.<br>한국어/영어/일본어/인도네시아 번역은 말로 더욱 편하게 번역할 수도 있습니다.",
                                        video: [
                                            {
                                                image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_04.png?v=20090904"), imgDescription: "" },
                                                video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/vod_heykakao_02.mp4",
                                            },
                                        ],
                                    },
                                    {
                                        title: '음성 대화를 텍스트로 <i class="line_pc"></i>받아쓰고 싶을 땐 <i class="line_pc"></i>헤이카카오에게 말해보세요.',
                                        description: "지금 말하고 있는 대화를 기록하고 싶다면 <br>헤이카카오로 받아쓰기를 경험해보세요.<br>쉽고 빠르게 텍스트로 변환하고 공유할 수 있습니다.",
                                        video: [
                                            {
                                                image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_phone_05.jpg?v=20090904"), imgDescription: "" },
                                                video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/vod_heykakao_03.mp4",
                                            },
                                        ],
                                    },
                                ],
                            },
                            suggestData: {
                                intro: {
                                    title: "운전할 땐 드라이빙 모드를 사용하세요.",
                                    description: '운전할 때 손은 핸들에 두세요, 헤이카카오 앱이 있으면 <i class="line_pc"></i>운전 중 말로 간편하게 카톡을 보내고, 원하는 노래를 들을 수 있어요.',
                                    image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_feature_03.jpg?v=20090904"), imgDescription: "" },
                                },
                                feature: {
                                    title: "헤이카카오 앱에서 카카오미니를 연결하고 관리 할 수 있어요.",
                                    description: "카카오미니를 사용하려면 헤이카카오앱은 필수죠.<br>미니를 네트워크에 연결하고 사용하기 나에게 맞게 설정하기 위해 헤이카카오 앱을 설치해 주세요.",
                                    image: { type: "SQUARE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_suggest.jpg?v=20090904"), imgDescription: "" },
                                },
                            },
                            mixData: {
                                feature: {
                                    title: "모르는 장소에 갈 때",
                                    command: "헤이카카오, 강남역까지 가는길 알려줄 수 있어?",
                                    image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_feature_01.jpg?v=20090904"), imgDescription: "" },
                                },
                                scroll: {
                                    title: "당신에게 딱 맞게. 일상을<br>편리하게 라이프 어시스턴트<br>기능을 사용 해 보세요.",
                                    items: [
                                        {
                                            title: "“오늘 밖에 날씨는 어때?”",
                                            description: "외출 전 기온과 미세먼지 확인하고 나가세요.",
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_card_01.png?v=20090904"), imgDescription: "" },
                                        },
                                        {
                                            title: "“신호등이 영어로 뭐야?”",
                                            description: "모르는 단어가 있다면 바로 물어보세요.",
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_card_02.png?v=20090904"), imgDescription: "" },
                                        },
                                        {
                                            title: "“이 노래  카톡으로 공유해줘”",
                                            description: "듣던 노래를 친구에게 보내는 것도<i></i> 간편하게 할 수 있어요.",
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_card_03.png?v=20090904"), imgDescription: "" },
                                        },
                                    ],
                                },
                                banner: { image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_feature_02.jpg?v=20090904"), imgDescription: "" } },
                            },
                            nextProduct: {
                                title: "어디서든 더 쉽고 편하게<br>카카오미니",
                                image: {
                                    background: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_next.jpg?v=20090904"),
                                    thumbInfos: { 375: "750x750", 1440: "1570x1570", 1920: "1570x1570", 2560: "1570x1570" },
                                },
                                about: { link: "/product/kakaomini", text: "More About <em>‘Kakaomini’</em>" },
                            },
                            bannerData: {
                                title: "이제 스마트폰에서도 <i class=\"line_mo\"></i>'헤이카카오'를 불러보세요.",
                                description: "Android : 5.0 이상 / iOS : 12.0 이상 지원 가능합니다.",
                                moreText: "헤이카카오",
                                image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/heykakao/".concat(i, "/img_app.png?v=20090904"), imgDescription: "" },
                                link: { appStore: "https://apps.apple.com/kr/app/id1286618447", googlePlay: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.kakao.i.connect" },
                            },
                        };
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "헤이카카오앱", section: "제품", custom_props: "" });
                    },
                },
                I =
                    (a(339),
                    Object(n.a)(
                        T,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "product_heykakao" },
                                [
                                    a("productBanner", { attrs: { visualData: t.visualData } }),
                                    t._v(" "),
                                    a("vodInfo", { attrs: { introData: t.introData } }),
                                    t._v(" "),
                                    a("infoMessage", { attrs: { messageData: t.messageData } }),
                                    t._v(" "),
                                    a("infoFeature", { attrs: { featureData: t.featureData } }),
                                    t._v(" "),
                                    a("infoVoice", { attrs: { voiceData: t.voiceData } }),
                                    t._v(" "),
                                    a("infoMix", { attrs: { mixData: t.mixData } }),
                                    t._v(" "),
                                    a("infoVideo", { attrs: { videoData: t.videoData } }),
                                    t._v(" "),
                                    a("infoSuggest", { attrs: { suggestData: t.suggestData } }),
                                    t._v(" "),
                                    a("AppBNV", { attrs: { bannerData: t.bannerData, bannerLog: { name: "제품_앱다운로드_클릭", layer: "product_app_download" } } }),
                                    t._v(" "),
                                    a("BottomBNV", { attrs: { nextProduct: t.nextProduct } }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "741fe35a",
                        null
                    ));
            e.default = I.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            var i = a(30),
                s = a(31),
                n = {
                    props: { waveData: { type: Object, default: {} } },
                    name: "infoWave",
                    data: function () {
                        return { thumbInfos0: { 375: "750x748", 1440: "1894x1888", 1920: "1894x1888", 2560: "1894x1888" } };
                    },
                },
                r = (a(352), a(0)),
                o = Object(r.a)(
                    n,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { staticClass: "info_wave" }, [
                            a("div", { staticClass: "cont_wave wave_center" }, [
                                a("div", { staticClass: "wrap_cont" }, [
                                    a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.waveData.infos[0].title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.waveData.infos[0].desc) } }),
                                ]),
                                t._v(" "),
                                a("div", { staticClass: "wrap_thumb" }, [
                                    a("div", { staticClass: "thumb_item" }, [
                                        a(
                                            "img",
                                            t._b(
                                                { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }], attrs: { alt: t.waveData.image.imgDescription } },
                                                "img",
                                                t.toThumb(t.thumbInfos0, t.waveData.image.url),
                                                !1
                                            )
                                        ),
                                    ]),
                                ]),
                            ]),
                            t._v(" "),
                            a("div", { staticClass: "cont_wave wave_bottom" }, [
                                a("div", { staticClass: "wrap_cont" }, [
                                    a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.waveData.infos[1].title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.waveData.infos[1].desc) } }),
                                ]),
                                t._v(" "),
                                a("div", { staticClass: "wrap_thumb" }, [
                                    a("div", { staticClass: "thumb_item", style: "background-image: url(https://t1.kakaocdn.net/thumb/C" + t.thumbInfos0[t.screenType] + "/?fname=" + encodeURIComponent(t.waveData.image.url) + ")" }),
                                ]),
                            ]),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "d38237c4",
                    null
                ).exports,
                c = a(4),
                l =
                    (a(28),
                    a(39),
                    {
                        components: { Paging: a(32).a },
                        props: { slotSize: { type: Number, default: 3 } },
                        data: function () {
                            return { activePoint: null, translateX: 0, windowHeight: 0, state: "ready", navHeight: 56, stopPositionY: 900, minDeviceHeight: 668, marginTop: 0, standardHeight: 0, scrollDistance: 0 };
                        },
                        computed: {
                            totalHeight: function () {
                                return this.scrollItemHeight + this.stopPositionY * this.slotSize;
                            },
                            contAlignPositionY: function () {
                                return this.isMobile ? this.navHeight - this.contentItemMarginTop : this.alignCenterTop;
                            },
                            scrollItemHeight: function () {
                                return this.windowHeight - this.navHeight;
                            },
                        },
                        mounted: function () {
                            this.slotSize <= 1 ||
                                ((this.standardHeight = window.innerHeight),
                                (this.windowHeight = window.innerHeight),
                                this.standardHeight <= this.minDeviceHeight || (window.addEventListener("scroll", this.onScrollSetState), window.addEventListener("resize", this.getPointInfos)));
                        },
                        beforeDestroy: function () {
                            window.removeEventListener("scroll", this.onScrollSetState), window.removeEventListener("resize", this.getPointInfos);
                        },
                        methods: {
                            getPointInfos: function () {
                                this.windowHeight = window.innerHeight;
                                var t = this.$refs.container,
                                    e = this.$refs.thumbItem,
                                    a = t.getBoundingClientRect().top,
                                    i = window.getComputedStyle(e),
                                    s = i.marginTop,
                                    n = void 0 === s ? "0px" : s,
                                    r = i.width;
                                (this.scrollDistance = Number(r.replace("px", ""))),
                                    (this.marginTop = 60 - Number(n.replace("px", ""))),
                                    (this.reachStandardTop = window.pageYOffset + a),
                                    (this.totalContentHeight = this.scrollItemHeight * this.slotSize);
                            },
                            onScrollSetState: function () {
                                this.getPointInfos();
                                var t = window.pageYOffset,
                                    e = t >= this.reachStandardTop,
                                    a = t <= this.reachStandardTop + this.stopPositionY * this.slotSize - this.navHeight;
                                if (e)
                                    if (e && a) {
                                        this.state = "active";
                                        var i = t - this.reachStandardTop,
                                            s = Math.floor(i / this.stopPositionY);
                                        this.moveToPoint(s);
                                    } else (this.state = "done"), this.moveToPoint(this.slotSize - 1);
                                else (this.state = "ready"), this.moveToPoint(0);
                            },
                            moveToPoint: function (t) {
                                (this.translateX = this.scrollDistance * t),
                                    (this.$refs.thumbItem.style.transform = "translate3d(-".concat(this.translateX, "px, 0, 0)")),
                                    (this.$refs.thumbItem.style.webkitTransition = "translate3d(-".concat(this.translateX, "px, 0, 0)")),
                                    (this.activePoint = t);
                            },
                        },
                    }),
                m =
                    (a(353),
                    Object(r.a)(
                        l,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return t.standardHeight > t.minDeviceHeight
                                ? a("div", { ref: "container", class: "cont_scroll " + t.state, style: "height: " + t.totalHeight + "px; margin-top: " + t.marginTop + "px" }, [
                                      a(
                                          "div",
                                          {
                                              directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                              ref: "inner",
                                              staticClass: "inner_scroll",
                                              style: { height: t.scrollItemHeight + "px" },
                                              attrs: { "sticky-offset": "{top: " + t.navHeight + "}", "on-stick": "onStick", "sticky-z-index": "1", "sticky-side": "top" },
                                          },
                                          [
                                              a(
                                                  "div",
                                                  { ref: "scroll", staticClass: "scroll_item" },
                                                  [
                                                      a("div", { staticClass: "wrap_cont" }, [a("div", { staticClass: "'cont_item" }, [t._t("contItem")], 2)]),
                                                      t._v(" "),
                                                      a(
                                                          "div",
                                                          { ref: "thumbItem", staticClass: "wrap_thumb" },
                                                          t._l(t.slotSize, function (e, i) {
                                                              return a("div", { key: i, staticClass: "thumb_item" }, [t._t("thumb" + i)], 2);
                                                          }),
                                                          0
                                                      ),
                                                      t._v(" "),
                                                      a("Paging", { attrs: { type: "dot", currentPage: t.activePoint + 1, slotSize: t.slotSize } }),
                                                  ],
                                                  1
                                              ),
                                          ]
                                      ),
                                  ])
                                : a("div", { staticClass: "cont_scroll ty_static" }, [
                                      a(
                                          "div",
                                          { staticClass: "inner_scroll" },
                                          t._l(t.slotSize, function (e, i) {
                                              return a("div", { key: i, staticClass: "scroll_item" }, [
                                                  a("div", { staticClass: "wrap_cont" }, [t._t("cont" + i)], 2),
                                                  t._v(" "),
                                                  a("div", { staticClass: "wrap_thumb" }, [t._t("thumb" + i)], 2),
                                              ]);
                                          }),
                                          0
                                      ),
                                  ]);
                        },
                        [],
                        !1,
                        null,
                        "0ef39d85",
                        null
                    ).exports),
                u = a(59),
                p = a(13),
                d = {
                    components: { ScrollBNV: u.a, Banner: c.a, IcoArrCircle: p.a, ScrollPaging: m },
                    name: "infoMix",
                    props: { mixData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos0: { 375: "690x868", 1440: "1226x1544", 1920: "1226x1544", 2560: "1226x1544" }, activeIdx: 0, customDistanceY: 1e3 };
                    },
                    methods: {
                        callback: function (t) {
                            this.activeIdx = t;
                        },
                    },
                },
                h =
                    (a(354),
                    Object(r.a)(
                        d,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_mix" },
                                [
                                    t.isMobile ? a("strong", { staticClass: "tit_info", domProps: { innerHTML: t._s(t.mixData.title) } }) : t._e(),
                                    t._v(" "),
                                    a("ScrollBNV", {
                                        attrs: { slotSize: t.mixData.length, isShowPaging: !1, isTranslate: !1, minDeviceHeight: null, customDistanceY: t.customDistanceY },
                                        on: { callback: t.callback },
                                        scopedSlots: t._u(
                                            [
                                                t._l(t.mixData.items, function (e, i) {
                                                    return {
                                                        key: "thumb" + i,
                                                        fn: function () {
                                                            return [
                                                                a(
                                                                    "img",
                                                                    t._b(
                                                                        {
                                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                            key: "thumbItem" + i,
                                                                            attrs: { alt: e.image.imgDescription },
                                                                        },
                                                                        "img",
                                                                        t.toThumb(t.thumbInfos0, e.image.url),
                                                                        !1
                                                                    )
                                                                ),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                                t.isMobile
                                                    ? t._l(t.mixData.items, function (e, i) {
                                                          return {
                                                              key: "cont" + i,
                                                              fn: function () {
                                                                  return [
                                                                      a("strong", { key: "contTitle" + i, staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                                      t._v(" "),
                                                                      a("p", { key: "contDesc" + i, staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                                                  ];
                                                              },
                                                              proxy: !0,
                                                          };
                                                      })
                                                    : {
                                                          key: "contItem",
                                                          fn: function () {
                                                              return [
                                                                  a("strong", { staticClass: "tit_info", domProps: { innerHTML: t._s(t.mixData.title) } }),
                                                                  t._v(" "),
                                                                  a(
                                                                      "transition-group",
                                                                      { staticClass: "wrap_info", attrs: { tag: "div", name: "fade" } },
                                                                      t._l(t.mixData.items, function (e, i) {
                                                                          return a(
                                                                              "div",
                                                                              { directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }], key: "contItem" + i, staticClass: "item_info" },
                                                                              [
                                                                                  a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                                                  t._v(" "),
                                                                                  a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                                                              ]
                                                                          );
                                                                      }),
                                                                      0
                                                                  ),
                                                              ];
                                                          },
                                                          proxy: !0,
                                                      },
                                            ],
                                            null,
                                            !0
                                        ),
                                    }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "1e0e2ace",
                        null
                    ).exports),
                v = a(172),
                g = {
                    props: { insideDatas: { type: Array, default: [] } },
                    name: "infoInside",
                    data: function () {
                        return { thumbInfos1: { 375: "690x728", 1440: "1226x1294", 1920: "1226x1294", 2560: "1226x1294" } };
                    },
                },
                _ =
                    (a(355),
                    Object(r.a)(
                        g,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_inside" },
                                t._l(t.insideDatas, function (e, i) {
                                    return a("div", { key: "feature" + i, class: "cont_feature ty_" + e.type }, [
                                        a("div", { staticClass: "wrap_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                        ]),
                                        t._v(" "),
                                        a("div", { staticClass: "wrap_thumb" }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                        staticClass: "img_bnv",
                                                        attrs: { alt: e.image.imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos1, e.image.url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ]);
                                }),
                                0
                            );
                        },
                        [],
                        !1,
                        null,
                        "2a73ff95",
                        null
                    ).exports),
                f = {
                    props: { wideData: { type: Object, default: {} } },
                    name: "infoWide",
                    data: function () {
                        return { thumbInfos0: { 375: "750x1280", 1440: "3840x2160", 1920: "3840x2160", 2560: "5120x2800" } };
                    },
                },
                b =
                    (a(356),
                    Object(r.a)(
                        f,
                        function () {
                            var t = this.$createElement,
                                e = this._self._c || t;
                            return e("div", { staticClass: "info_wide" }, [
                                e(
                                    "img",
                                    this._b(
                                        { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: this.thumbInfos0[this.screenType], expression: "thumbInfos0[screenType]" }], attrs: { alt: this.wideData.image.imgDescription } },
                                        "img",
                                        this.toThumb(this.thumbInfos0, this.wideData.image.url),
                                        !1
                                    )
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "4114ac89",
                        null
                    ).exports),
                C = {
                    components: { Parallax: a(25).a },
                    props: { connectData: { type: Object, default: {} } },
                    name: "infoConnect",
                    data: function () {
                        return {
                            thumbInfos0: { 375: "160x160", 1440: "160x160", 1920: "160x160", 2560: "160x160" },
                            thumbInfos1: { 375: "276x326", 1440: "730x858", 1920: "730x858", 2560: "730x858" },
                            thumbInfos2: { 375: "254x138", 1440: "674x362", 1920: "674x362", 2560: "674x362" },
                            thumbInfos3: { 375: "230x410", 1440: "606x1084", 1920: "606x1084", 2560: "606x1084" },
                            thumbInfos4: { 375: "166x188", 1440: "440x494", 1920: "440x494", 2560: "440x494" },
                        };
                    },
                },
                y =
                    (a(357),
                    Object(r.a)(
                        C,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { staticClass: "info_connect" }, [
                                a("div", { staticClass: "cont_connect" }, [
                                    a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.connectData.title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.connectData.desc) } }),
                                    t._v(" "),
                                    a(
                                        "ul",
                                        { staticClass: "list_connect" },
                                        t._l(t.connectData.items, function (e, i) {
                                            return a("li", { key: "connect" + i }, [
                                                a("div", { staticClass: "wrap_thumb" }, [a("span", { class: "ico_comm ico_" + e.icoName })]),
                                                t._v(" "),
                                                a("div", { staticClass: "wrap_cont" }, [a("strong", { staticClass: "tit_connect", domProps: { innerHTML: t._s(e.title) } })]),
                                            ]);
                                        }),
                                        0
                                    ),
                                ]),
                                t._v(" "),
                                a(
                                    "div",
                                    { staticClass: "thumb_connect" },
                                    [
                                        a("Parallax", { attrs: { speedFactor: 1, direction: "right", availableOffset: t.isMobile ? 6 : 30 } }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                        attrs: { alt: t.connectData.images[0].imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos1, t.connectData.images[0].url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                        t._v(" "),
                                        a("Parallax", { attrs: { speedFactor: 1, direction: "right", availableOffset: t.isMobile ? 3 : 6 } }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.screenType], expression: "thumbInfos2[screenType]" }],
                                                        attrs: { alt: t.connectData.images[1].imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos2, t.connectData.images[1].url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                        t._v(" "),
                                        a("Parallax", { attrs: { speedFactor: 1, direction: "left", availableOffset: t.isMobile ? 3 : 17 } }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos3[t.screenType], expression: "thumbInfos3[screenType]" }],
                                                        attrs: { alt: t.connectData.images[2].imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos3, t.connectData.images[2].url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                        t._v(" "),
                                        a("Parallax", { attrs: { speedFactor: 1, direction: "left", availableOffset: t.isMobile ? 6 : 20 } }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos4[t.screenType], expression: "thumbInfos4[screenType]" }],
                                                        attrs: { alt: t.connectData.images[3].imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos4, t.connectData.images[3].url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ],
                                    1
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "110ec7a9",
                        null
                    ).exports),
                x = {
                    components: { Banner: c.a },
                    props: { designData: { type: Object, default: {} } },
                    name: "infoDesign",
                    data: function () {
                        return { thumbInfos0: { 375: "690x388", 1440: "2880x1620", 1920: "2880x1620", 2560: "2880x1620" } };
                    },
                },
                k =
                    (a(358),
                    Object(r.a)(
                        x,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_design" },
                                [
                                    a("strong", { staticClass: "tit_design", domProps: { innerHTML: t._s(t.designData.title) } }),
                                    t._v(" "),
                                    a("Banner", {
                                        attrs: { options: { slotSize: t.designData.images.length, isLoop: !0, alignItem: "left", isBtnStatic: !1, isPagingInside: !1, pagingType: "dot" } },
                                        scopedSlots: t._u(
                                            [
                                                t._l(t.designData.images, function (e, i) {
                                                    return {
                                                        key: "slot" + i,
                                                        fn: function () {
                                                            return [
                                                                a(
                                                                    "img",
                                                                    t._b(
                                                                        {
                                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                            key: "bnvImg" + i,
                                                                            staticClass: "img_bnv",
                                                                            attrs: { alt: e.imgDescription },
                                                                        },
                                                                        "img",
                                                                        t.toThumb(t.thumbInfos0, e.url),
                                                                        !1
                                                                    )
                                                                ),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                            ],
                                            null,
                                            !0
                                        ),
                                    }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "7384eb6a",
                        null
                    ).exports),
                w = a(60),
                T = a(24),
                I = a(33),
                D = {
                    components: { productBanner: i.a, vodInfo: s.a, infoWave: o, infoMix: h, infoVoice: v.a, infoInside: _, infoWide: b, infoConnect: y, infoDesign: k, infoSpecs: w.a, AppBNV: T.a, BottomBNV: I.a },
                    asyncData: function (t) {
                        var e = t.store,
                            a = e.getters.deviceType,
                            i = void 0 === a ? "pc" : a;
                        return (
                            e.dispatch("setHeadings", { headings: { h2: "제품", h3: "MiniHexa" } }),
                            e.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                            e.dispatch("hasBanner", { hasBanner: !1 }),
                            {
                                visualData: {
                                    title: "더 작고 똑똑한 스마트 스피커<br>미니헥사",
                                    scrollText: "More About <em>Mini Hexa</em>",
                                    store: {
                                        text: "미니헥사 구매하기",
                                        url: "https://gift-talk.kakao.com/appredirect?to=https%253A%252F%252Fgift.kakao.com%252Fproduct%252F2204899&input_channel_id=2630",
                                        tiaraLog: { name: "미니헥사_구매클릭", layer: "purchase_minihexa_btn" },
                                    },
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_visual.jpg?v=201026"),
                                },
                                introData: {
                                    title: "라이프 어시스턴트",
                                    desc:
                                        '더욱 개선된 음성인식으로 완벽해진 미니헥사는 어떤 상황에서도 <i class="line_pc"></i>더 똑똑하고 잘 알아듣는 라이프 어시스턴트입니다.  이제 시끄러운 환경에서나 조금 떨어진 위치에서도 이전보다 더 당신의 목소리에 귀 기울이는 놀라운 경험을 즐겨보세요.',
                                    thumbInfo: { 375: "690x412", 1440: "3200x1912", 1920: "3200x1912", 2560: "3200x1912" },
                                    vodData: [
                                        {
                                            image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_video.jpg?v=201026"), imgDescription: "" },
                                            video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/vod_promotion.mp4",
                                            etc: "Promotional Video",
                                        },
                                    ],
                                },
                                waveData: {
                                    image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/mo/img_product.png?v=201026", imgDescription: "" },
                                    infos: [
                                        {
                                            title: '당신의 목소리에<i class="line_mo"></i> 귀 기울이는 6개의<i class="line_mo"></i> 마이크',
                                            desc: '강력한 6개의 far-field microphones를 사용해 음성인식 성능이 극대화되어, <i class="line_pc"></i>전보다 조용히 말해도 당신의 목소리에 바로 반응합니다.',
                                        },
                                        {
                                            title: '어디에서도, <i class="line_mo"></i>조금 떨어져 있어도 <i class="line_mo"></i>잘 듣습니다',
                                            desc: "이제 헤이카카오를 부르기 위해 가까이 다가설 필요가 없습니다. <br>정교한 방향 감지와 포커싱 기술을 통해  더 먼 거리, 어느 방향에서 말하더라도 미니헥사는 항상 당신을 향해 집중합니다.",
                                        },
                                    ],
                                },
                                mixData: {
                                    title: '말보다 손이 편할 때, <i class="line_pc"></i>퀵버튼이 도와드릴게요',
                                    items: [
                                        {
                                            title: '퀵버튼 하나로 여러 개의 <i class="line_mo"></i>기능을 편리하게',
                                            description: '자주 사용하는 기능이 있다면 퀵버튼으로 등록해 두세요. <i class="line_pc"></i>하나의 기능 또는 여러 개의 기능을 동시에 실행할 수 있어 매번 헤이카카오라고 말하지 않아도 됩니다.',
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_card1.jpg?v=201026"), imgDescription: "" },
                                        },
                                        {
                                            title: '카톡 챗봇에서 쉽고 편리하게 <i class="line_mo"></i>설정하세요',
                                            description:
                                                "별도의 앱 다운로드할 필요 없이 '헤이카카오 카카오톡 <i class='line_pc'></i>채널' 설정 챗봇을 통해 간편하게 미리 설정할 수 있어요. <i class='line_pc'></i>나를 위한 맞춤 설정을 해보세요.",
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_card2.jpg?v=201026"), imgDescription: "" },
                                        },
                                        {
                                            title: '퀵버튼 하나로 여러개의 <i class="line_mo"></i>IoT 기능을 동시에',
                                            description:
                                                '퀵버튼 하나로 IoT 및 각종 가전제품도 쉽게 <i class="line_pc"></i>컨트롤할 수 있어요. 하루에도 몇 번씩 사용하는 기능은 <i class="line_pc"></i>퀵버튼을 통해 보다 쉽고 빠르게 사용하세요.',
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_card3.jpg?v=201026"), imgDescription: "" },
                                        },
                                    ],
                                },
                                voiceData: {
                                    intro: {
                                        title: "집안 어디서든 음성만으로 도움을 받아보세요",
                                        description:
                                            "미니헥사에게 '헤이카카오'라고 말해보세요. 음성으로 즐길 수 있는 다양한 서비스들을 만날 수 있답니다. <i class='line_pc'></i>일상의 정보에서부터 엔터테인먼트까지 미니헥사와 함께 집안 어디서나 다양한 헤이카카오 서비스를 즐겨보세요.",
                                    },
                                    banner: {
                                        commandList: [
                                            { title: "모르는 장소에 갈 때", command: "헤이카카오, 강남역까지 가는길 알려줄 수 있어?" },
                                            { title: "주말에 장보고 싶을 때", command: "헤이카카오, 근처 영업 중인 마트 알려줘" },
                                            { title: "날짜가 궁금할 때", command: "헤이카카오, 음력 6월 14일이 며칠이야?" },
                                        ],
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_message.jpg?v=201026"), imgDescription: "" },
                                    },
                                },
                                insideDatas: [
                                    {
                                        type: "left",
                                        title: "나른한 주말 오후 문득<br>기분전환을 하고 싶을 때",
                                        description:
                                            "- 헤이카카오, 주말에 어울리는 노래 틀어줘<br>- 헤이카카오, 면역력 높이는 명상 틀어줘<br>- 헤이카카오, 바다 소리 들려줘<br>- 헤이카카오, 오늘의 명상 틀어줘<br>- 헤이카카오, 신나는 댄스 음악 들려줘",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_feature1.jpg?v=201026"), imgDescription: "" },
                                    },
                                    {
                                        type: "right",
                                        title: '두 손이 자유롭지 않은<i class="line_pc"></i> 요리를 하는 상황에서도',
                                        description: "- 헤이카카오, 3분 타이머 맞춰줘<br>- 헤이카카오, 10분 뒤 알람 맞춰줘<br>- 헤이카카오, 요리할 때 듣기 좋은 노래 틀어줘<br>- 헤이카카오, 피망 칼로리 알려줘",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_feature2.jpg?v=201026"), imgDescription: "" },
                                    },
                                ],
                                wideData: { image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_wide.jpg?v=201026"), imgDescription: "" } },
                                connectData: {
                                    title: "쉽고 안정된 연결과 제어가 가능합니다",
                                    desc:
                                        "미니헥사는 Wi-Fi와 블루투스 안테나가 분리되어 있어, 보다 안정되고 확장된 네트워킹이 가능합니다.<br>외부 스피커와 연결해도 끊김 없이 음악을 들을 수 있고, 다양한 IoT 제품을 연결해 미니헥사로 더 쉽고 편하게 제어할 수도 있습니다. 또한, 블루투스 5.0 지원으로 더 먼 거리에서도 안정적으로 서비스를 사용할 수 있습니다.",
                                    images: [
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_product1.png?v=201026"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_product2.png?v=201026"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_product3.png?v=201026"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_product4.png?v=201026"), imgDescription: "" },
                                    ],
                                    items: [
                                        { title: "더 빠른 연결속도", icoName: "fast" },
                                        { title: "더 높은 안정성", icoName: "safe" },
                                        { title: "더 많은 기기연결", icoName: "connect" },
                                    ],
                                },
                                designData: {
                                    title: "어디에나 어울리는 콤팩트한 디자인",
                                    images: [
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_slide1.jpg?v=201026"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_slide2.jpg?v=201026"), imgDescription: "" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_slide3.jpg?v=201026"), imgDescription: "" },
                                    ],
                                },
                                nextProduct: {
                                    title: "일상을 바꾸는 단어<br>헤이카카오",
                                    image: { background: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_next.jpg?v=201026") },
                                    about: { link: "/product/heykakao", text: "More About <em>‘Heykakao’</em>" },
                                },
                                specDatas: [
                                    {
                                        title: "Mini Hexa 스펙",
                                        isOn: !0,
                                        items: [
                                            { title: "제품명", cont: "미니헥사 / Mini Hexa" },
                                            { title: "모델명", cont: "KE-H200" },
                                            { title: "스피커", cont: "44 x 44mm Full Range" },
                                            { title: "마이크", cont: "Far-field 6 마이크" },
                                            { title: "크기 / 무게", cont: "크기 : 90 x 86 x 39mm / 무게 : 184g " },
                                            { title: "색상 / 재질", cont: "Light Gray / Fabric & Plastic" },
                                            { title: "KC인증 필유무", cont: "R-C-KXA-KEH200 / 특정소출력무선기기" },
                                            { title: "블루투스", cont: "Bluetooth 5.0 / Classic LE" },
                                            { title: "와이파이", cont: "802.11 a / b / g / n / ac" },
                                            { title: "사용전원", cont: "5.0V / 2.4A " },
                                            { title: "품질보증기준", cont: "무상 1년 " },
                                            { title: "A/S책임자", cont: "(주)가온미디어 " },
                                        ],
                                    },
                                ],
                                bannerData: {
                                    title: '헤이카카오 앱을 다운받고 <i class="line_mo"></i>미니헥사와 연결해보세요.',
                                    description: "Android: 5.0 이상 / iOS: 12.0 이상 지원 가능합니다.",
                                    moreText: "헤이카카오",
                                    image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_app.jpg?v=201026"), imgDescription: "" },
                                    link: { appStore: "https://apps.apple.com/kr/app/id1286618447", googlePlay: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.kakao.i.connect" },
                                },
                            }
                        );
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    data: function () {
                        return { bannerHeight: 0 };
                    },
                    mounted: function () {
                        this.$refs.topBanner.$el.clientHeight && (this.bannerHeight = this.$refs.topBanner.$el.clientHeight),
                            this.$store.dispatch("setStoreBtn", { productBannerHeight: this.bannerHeight }),
                            Tiara.trackPageView({ page: "미니헥사", section: "제품", custom_props: "" });
                    },
                },
                L =
                    (a(359),
                    Object(r.a)(
                        D,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "product_minihexa" },
                                [
                                    a("productBanner", { ref: "topBanner", attrs: { visualData: t.visualData } }),
                                    t._v(" "),
                                    a("vodInfo", { attrs: { introData: t.introData } }),
                                    t._v(" "),
                                    a("infoWave", { attrs: { waveData: t.waveData } }),
                                    t._v(" "),
                                    a("infoMix", { attrs: { mixData: t.mixData } }),
                                    t._v(" "),
                                    a("infoVoice", { attrs: { voiceData: t.voiceData } }),
                                    t._v(" "),
                                    a("infoInside", { attrs: { insideDatas: t.insideDatas } }),
                                    t._v(" "),
                                    a("infoWide", { attrs: { wideData: t.wideData } }),
                                    t._v(" "),
                                    a("infoConnect", { attrs: { connectData: t.connectData } }),
                                    t._v(" "),
                                    a("infoDesign", { attrs: { designData: t.designData } }),
                                    t._v(" "),
                                    a("infoSpecs", { attrs: { specDatas: t.specDatas } }),
                                    t._v(" "),
                                    a("AppBNV", { attrs: { bannerData: t.bannerData, bannerLog: { name: "제품_앱다운로드_클릭", layer: "product_app_download" } } }),
                                    t._v(" "),
                                    a("BottomBNV", { attrs: { nextProduct: t.nextProduct } }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "106b4615",
                        null
                    ));
            e.default = L.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = a(4),
                n = {
                    components: { Banner: s.a },
                    name: "infoVisual",
                    props: { mainBanner: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos: { 375: "750x960", 1440: "2880x1160", 1920: "3840x1320", 2560: "5120x1480" } };
                    },
                },
                r = (a(367), a(0)),
                o = Object(r.a)(
                    n,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            { staticClass: "info_visual" },
                            [
                                a("Banner", {
                                    attrs: { options: { type: "wide" } },
                                    scopedSlots: t._u([
                                        {
                                            key: "slot0",
                                            fn: function () {
                                                return [
                                                    a("div", { staticClass: "link_item" }, [
                                                        a("div", { staticClass: "layer_cont" }, [
                                                            a("div", { staticClass: "wrap_cont" }, [
                                                                a("em", { staticClass: "emph_cp", domProps: { innerHTML: t._s(t.mainBanner.title) } }),
                                                                t._v(" "),
                                                                a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.mainBanner.subTitle) } }),
                                                            ]),
                                                        ]),
                                                        t._v(" "),
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }],
                                                                    staticClass: "img_bnv",
                                                                    attrs: { alt: t.mainBanner.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos, t.mainBanner.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ]),
                                                ];
                                            },
                                            proxy: !0,
                                        },
                                    ]),
                                }),
                            ],
                            1
                        );
                    },
                    [],
                    !1,
                    null,
                    "5ec4b0b8",
                    null
                ).exports,
                c = a(59),
                l = a(13),
                m = {
                    components: { ScrollBNV: c.a, Banner: s.a, IcoArrCircle: l.a },
                    name: "infoMix",
                    props: { intro: { type: Object, default: {} }, inside: { type: Object, default: {} }, feature: { type: Array, default: [{}] } },
                    data: function () {
                        return { thumbInfos0: { 375: "750x750", 1440: "1410x1410", 1920: "1410x1410", 2560: "1410x1410" }, thumbInfos1: { 375: "750x1120", 1440: "2880x1440", 1920: "3840x1800", 2560: "3840x1800" } };
                    },
                },
                u =
                    (a(368),
                    Object(r.a)(
                        m,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_mix" },
                                [
                                    a("ScrollBNV", {
                                        attrs: { slotSize: t.feature.length, minDeviceHeight: null },
                                        scopedSlots: t._u(
                                            [
                                                {
                                                    key: "prevItem",
                                                    fn: function () {
                                                        return [
                                                            a("div", { staticClass: "cont_intro" }, [
                                                                a("h4", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.intro.title) } }),
                                                                t._v(" "),
                                                                t.intro.description ? a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.intro.description) } }) : t._e(),
                                                            ]),
                                                        ];
                                                    },
                                                    proxy: !0,
                                                },
                                                t._l(t.feature, function (e, i) {
                                                    return {
                                                        key: "thumb" + i,
                                                        fn: function () {
                                                            return [
                                                                a(
                                                                    "img",
                                                                    t._b(
                                                                        {
                                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                            key: "thumbItem" + i,
                                                                            attrs: { alt: e.image.imgDescription },
                                                                        },
                                                                        "img",
                                                                        t.toThumb(t.thumbInfos0, e.image.url),
                                                                        !1
                                                                    )
                                                                ),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                                t._l(t.feature, function (e, i) {
                                                    return {
                                                        key: "cont" + i,
                                                        fn: function () {
                                                            return [
                                                                a("strong", { key: "contTit" + i, staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                                t._v(" "),
                                                                a("p", { key: "contDesc" + i, staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                                                t._v(" "),
                                                                e.moreText && e.link
                                                                    ? a(
                                                                          "a",
                                                                          { key: "contLink" + i, staticClass: "link_more", attrs: { href: e.link.link } },
                                                                          [a("span", { domProps: { innerHTML: t._s(e.moreText) } }), a("IcoArrCircle", { attrs: { isStatic: !0 } })],
                                                                          1
                                                                      )
                                                                    : t._e(),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                                {
                                                    key: "nextItem",
                                                    fn: function () {
                                                        return [
                                                            a("Banner", {
                                                                attrs: { options: { type: "wide" } },
                                                                scopedSlots: t._u([
                                                                    {
                                                                        key: "slot0",
                                                                        fn: function () {
                                                                            return [
                                                                                a(
                                                                                    "img",
                                                                                    t._b(
                                                                                        {
                                                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                                            staticClass: "img_bnv",
                                                                                            attrs: { alt: t.inside.image.imgDescription },
                                                                                        },
                                                                                        "img",
                                                                                        t.toThumb(t.thumbInfos1, t.inside.image.url),
                                                                                        !1
                                                                                    )
                                                                                ),
                                                                                t._v(" "),
                                                                                t.inside.description ? a("span", { staticClass: "txt_tit", domProps: { innerHTML: t._s(t.inside.description) } }) : t._e(),
                                                                            ];
                                                                        },
                                                                        proxy: !0,
                                                                    },
                                                                ]),
                                                            }),
                                                        ];
                                                    },
                                                    proxy: !0,
                                                },
                                            ],
                                            null,
                                            !0
                                        ),
                                    }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "48c8fcbc",
                        null
                    ).exports),
                p = a(6),
                d = {
                    name: "infoThumb",
                    props: Object(p.a)({ type: { type: String, default: "a" }, identity: { type: Object, default: {} } }, "type", { type: String, default: "kakaotalk" }),
                    data: function () {
                        return {
                            thumbInfos0: {
                                kakaotalk: { 375: "660x452", 1440: "1782x1224", 1920: "1782x1224", 2560: "1782x1224" },
                                smartaccessory: { 375: "602x844", 1440: "1088x1528", 1920: "1088x1528", 2560: "1088x1528" },
                                navigation: { 375: "630x440", 1440: "1410x986", 1920: "1410x986", 2560: "1410x986" },
                                mobility: { 375: "660x466", 1440: "1964x1380", 1920: "1964x1380", 2560: "1964x1380" },
                                display: { 375: "600x844", 1440: "1226x1724", 1920: "1226x1724", 2560: "1226x1724" },
                                smarthome: { 375: "632x442", 1440: "1412x988", 1920: "1412x988", 2560: "1412x988" },
                            },
                            thumbInfos1: {
                                kakaotalk: { 375: "600x856", 1440: "680x974", 1920: "680x974", 2560: "680x974" },
                                smartaccessory: { 375: "508x592", 1440: "922x1076", 1920: "922x1076", 2560: "922x1076" },
                                navigation: { 375: "566x836", 1440: "1044x1542", 1920: "1044x1542", 2560: "1044x1542" },
                                mobility: { 375: "600x420", 1440: "1228x860", 1920: "1228x860", 2560: "1228x860" },
                                display: { 375: "570x668", 1440: "1040x1216", 1920: "1040x1216", 2560: "1040x1216" },
                                smarthome: { 375: "510x462", 1440: "860x782", 1920: "860x782", 2560: "860x782" },
                            },
                            thumbInfos2: {
                                kakaotalk: { 375: "600x380", 1440: "1230x780", 1920: "1230x780", 2560: "1230x780" },
                                smartaccessory: { 375: "422x388", 1440: "758x696", 1920: "758x696", 2560: "758x696" },
                                navigation: { 375: "568x650", 1440: "860x984", 1920: "860x984", 2560: "860x984" },
                                mobility: { 375: "450x452", 1440: "860x860", 1920: "860x860", 2560: "860x860" },
                                display: { 375: "570x398", 1440: "1044x730", 1920: "1044x730", 2560: "1044x730" },
                            },
                        };
                    },
                },
                h =
                    (a(369),
                    Object(r.a)(
                        d,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_thumb" },
                                [
                                    "kakaotalk" === t.type
                                        ? [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[2]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[2].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "area_left" }, [
                                                            t.identity.images[0]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb1",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[0].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.description
                                                                ? a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  })
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[2]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb3",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[2].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_right" }, [
                                                            t.identity.images[1]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb2",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[1].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                    ]),
                                          ]
                                        : "smartaccessory" === t.type
                                        ? [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[2]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[2].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "area_left" }, [
                                                            t.identity.description
                                                                ? a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  })
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[1]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb2",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[1].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_right" }, [
                                                            t.identity.images[0]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb1",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[0].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[2]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb3",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[2].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                    ]),
                                          ]
                                        : "navigation" === t.type
                                        ? [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[2]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[2].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : [
                                                        t.identity.description
                                                            ? a("p", {
                                                                  directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                  staticClass: "desc_thumb",
                                                                  domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                              })
                                                            : t._e(),
                                                        t._v(" "),
                                                        a("div", { staticClass: "inner_thumb" }, [
                                                            a("div", { staticClass: "area_left" }, [
                                                                t.identity.images[0]
                                                                    ? a(
                                                                          "div",
                                                                          {
                                                                              directives: [
                                                                                  { name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" },
                                                                              ],
                                                                              staticClass: "thumb1",
                                                                          },
                                                                          [
                                                                              a(
                                                                                  "img",
                                                                                  t._b(
                                                                                      {
                                                                                          directives: [
                                                                                              { name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" },
                                                                                          ],
                                                                                          staticClass: "img_bnv",
                                                                                          attrs: { alt: t.identity.images[0].imgDescription },
                                                                                      },
                                                                                      "img",
                                                                                      t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                      !1
                                                                                  )
                                                                              ),
                                                                          ]
                                                                      )
                                                                    : t._e(),
                                                                t._v(" "),
                                                                t.identity.images[2]
                                                                    ? a(
                                                                          "div",
                                                                          {
                                                                              directives: [
                                                                                  { name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" },
                                                                              ],
                                                                              staticClass: "thumb3",
                                                                          },
                                                                          [
                                                                              a(
                                                                                  "img",
                                                                                  t._b(
                                                                                      {
                                                                                          directives: [
                                                                                              { name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" },
                                                                                          ],
                                                                                          staticClass: "img_bnv",
                                                                                          attrs: { alt: t.identity.images[2].imgDescription },
                                                                                      },
                                                                                      "img",
                                                                                      t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                                      !1
                                                                                  )
                                                                              ),
                                                                          ]
                                                                      )
                                                                    : t._e(),
                                                            ]),
                                                            t._v(" "),
                                                            t.identity.images[1]
                                                                ? a("div", { staticClass: "area_right" }, [
                                                                      a(
                                                                          "div",
                                                                          {
                                                                              directives: [
                                                                                  { name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" },
                                                                              ],
                                                                              staticClass: "thumb2",
                                                                          },
                                                                          [
                                                                              a(
                                                                                  "img",
                                                                                  t._b(
                                                                                      {
                                                                                          directives: [
                                                                                              { name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" },
                                                                                          ],
                                                                                          staticClass: "img_bnv",
                                                                                          attrs: { alt: t.identity.images[1].imgDescription },
                                                                                      },
                                                                                      "img",
                                                                                      t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                      !1
                                                                                  )
                                                                              ),
                                                                          ]
                                                                      ),
                                                                  ])
                                                                : t._e(),
                                                        ]),
                                                    ],
                                          ]
                                        : "mobility" === t.type
                                        ? [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[2]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[2].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "area_left" }, [
                                                            t.identity.images[1]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb2",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[1].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_right" }, [
                                                            t.identity.images[0]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb1",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[0].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.description
                                                                ? a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  })
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[2]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb3",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[2].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                    ]),
                                          ]
                                        : "display" === t.type
                                        ? [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[2]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[2].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "area_left" }, [
                                                            t.identity.images[0]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb1",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[0].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[2]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb3",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.type][t.screenType], expression: "thumbInfos2[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[2].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos2[t.type], t.identity.images[2].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_right" }, [
                                                            t.identity.description
                                                                ? a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  })
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[1]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb2",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[1].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                    ]),
                                          ]
                                        : [
                                              t.isMobile
                                                  ? a("ul", { staticClass: "list_thumb" }, [
                                                        t.identity.description
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[0]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[0].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        t.identity.images[1]
                                                            ? a("li", { directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }] }, [
                                                                  a(
                                                                      "img",
                                                                      t._b(
                                                                          {
                                                                              directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                              staticClass: "img_bnv",
                                                                              attrs: { alt: t.identity.images[1].imgDescription },
                                                                          },
                                                                          "img",
                                                                          t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                          !1
                                                                      )
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ])
                                                  : a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "area_left" }, [
                                                            t.identity.description
                                                                ? a("p", {
                                                                      directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                      staticClass: "desc_thumb",
                                                                      domProps: { innerHTML: t._s("“ " + t.identity.description + " ”") },
                                                                  })
                                                                : t._e(),
                                                            t._v(" "),
                                                            t.identity.images[1]
                                                                ? a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb2",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.type][t.screenType], expression: "thumbInfos1[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[1].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos1[t.type], t.identity.images[1].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  )
                                                                : t._e(),
                                                        ]),
                                                        t._v(" "),
                                                        t.identity.images[0]
                                                            ? a("div", { staticClass: "area_right" }, [
                                                                  a(
                                                                      "div",
                                                                      {
                                                                          directives: [{ name: "aos", rawName: "v-aos", value: { threshold: [0, 1], rootMargin: "-50px 0px" }, expression: "{threshold: [0, 1], rootMargin: '-50px 0px'}" }],
                                                                          staticClass: "thumb1",
                                                                      },
                                                                      [
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.type][t.screenType], expression: "thumbInfos0[type][screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: t.identity.images[0].imgDescription },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.thumbInfos0[t.type], t.identity.images[0].url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]
                                                                  ),
                                                              ])
                                                            : t._e(),
                                                    ]),
                                          ],
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "b0c3acfc",
                        null
                    ).exports),
                v = { name: "infoInside", components: { Command: a(173).a }, props: { command: { type: Object, default: {} } } },
                g =
                    (a(370),
                    Object(r.a)(
                        v,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_inside" },
                                [
                                    a("div", { staticClass: "wrap_cont" }, [
                                        a("h4", { staticClass: "tit_cont", domProps: { innerHTML: t._s(t.command.title) } }),
                                        t._v(" "),
                                        a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.command.subTitle) } }),
                                        t._v(" "),
                                        t.command.moreText && t.command.link
                                            ? a("a", { staticClass: "link_more", attrs: { href: t.command.link.link || "javascript:;", "data-tiara-action-name": "파트너상세_명령어더보기_클릭", "data-tiara-layer": "command_more" } }, [
                                                  a("span", { staticClass: "txt_more", domProps: { innerHTML: t._s(t.command.moreText) } }),
                                              ])
                                            : t._e(),
                                    ]),
                                    t._v(" "),
                                    t.command.commandList ? a("Command", { attrs: { type: "partner", commandList: t.command.commandList } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "18a39963",
                        null
                    ).exports),
                _ = {
                    name: "infoavailable",
                    components: {
                        IcoAndD: Object(r.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_and_dark", attrs: { xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", viewBox: "6 7 14 17" } }, [
                                    e("use", { attrs: { "xlink:href": "#icoAndD" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                        IcoIOS: a(176).a,
                    },
                    props: { type: { type: String, default: "a" }, available: { type: Object, default: {} } },
                },
                f =
                    (a(371),
                    Object(r.a)(
                        _,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_available" },
                                [
                                    t.available.title ? a("h4", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.available.title) } }) : t._e(),
                                    t._v(" "),
                                    "info" === t.type && t.available.links
                                        ? a(
                                              "dl",
                                              { staticClass: "list_available" },
                                              [
                                                  t._l(t.available.links, function (e, i) {
                                                      return [
                                                          e.title ? a("dt", { key: "availableTitle" + i, domProps: { innerHTML: t._s(e.title) } }) : t._e(),
                                                          t._v(" "),
                                                          e.text ? a("dd", { key: "availableCont" + i, domProps: { innerHTML: t._s(e.text) } }) : t._e(),
                                                      ];
                                                  }),
                                              ],
                                              2
                                          )
                                        : t._e(),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.available.subTitle) } }),
                                    t._v(" "),
                                    "app" === t.type && t.available.links
                                        ? a(
                                              "div",
                                              { staticClass: "wrap_available" },
                                              t._l(t.available.links, function (e, i) {
                                                  return a(
                                                      "a",
                                                      {
                                                          key: "availableLink" + i,
                                                          staticClass: "link_app",
                                                          attrs: { href: e.link || "javascript:;", "data-tiara-action-name": "파트너상세_앱다운로드_클릭", "data-tiara-layer": "partner_app_download" },
                                                      },
                                                      ["APP_STORE" === e.linkType ? a("IcoIOS") : a("IcoAndD"), a("span", { domProps: { innerHTML: t._s(e.text) } })],
                                                      1
                                                  );
                                              }),
                                              0
                                          )
                                        : "download" === t.type && t.available.links
                                        ? t._l(t.available.links, function (e, i) {
                                              return a(
                                                  "a",
                                                  {
                                                      key: "availableLink" + i,
                                                      staticClass: "link_txt",
                                                      attrs: { href: e.link || "javascript:;", "data-tiara-action-name": "파트너상세_일반링크_클릭", "data-tiara-layer": "partner_web_link", target: "_blank" },
                                                  },
                                                  [a("span", { domProps: { innerHTML: t._s(e.text) } })]
                                              );
                                          })
                                        : t._e(),
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "67400e02",
                        null
                    ).exports),
                b = {
                    name: "infoProposal",
                    components: { Banner: s.a, IcoArrCircle: l.a },
                    props: { bannerData: { type: Object, default: {} } },
                    data: function () {
                        return { activeIdx: 0, thumbInfos0: { 375: "750x1120", 1440: "1440x1120", 1920: "1920x1200", 2560: "2560x1600" } };
                    },
                    methods: {
                        callback: function (t) {
                            this.activeIdx = t - 1;
                        },
                    },
                },
                C =
                    (a(372),
                    {
                        components: {
                            infoVisual: o,
                            infoMix: u,
                            infoThumb: h,
                            infoInside: g,
                            infoAvailable: f,
                            infoProposal: Object(r.a)(
                                b,
                                function () {
                                    var t = this,
                                        e = t.$createElement,
                                        a = t._self._c || e;
                                    return a("section", { staticClass: "info_banner" }, [
                                        a("h4", { staticClass: "screen_out" }, [t._v("제휴 제안")]),
                                        t._v(" "),
                                        a(
                                            "div",
                                            { staticClass: "banner_thumb" },
                                            [
                                                a("Banner", {
                                                    attrs: { options: { slotSize: t.bannerData.images.length, isLoop: !0, alignItem: "left", isBtnStatic: !1, isHalfContent: !0, pagingType: "text" } },
                                                    on: { callback: t.callback },
                                                    scopedSlots: t._u(
                                                        [
                                                            t._l(t.bannerData.images, function (e, i) {
                                                                return {
                                                                    key: "slot" + i,
                                                                    fn: function () {
                                                                        return [
                                                                            a(
                                                                                "img",
                                                                                t._b(
                                                                                    {
                                                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                                        key: "bnvImg" + i,
                                                                                        staticClass: "img_bnv",
                                                                                        attrs: { alt: e.imgDescription },
                                                                                    },
                                                                                    "img",
                                                                                    t.toThumb(t.thumbInfos0, e.url),
                                                                                    !1
                                                                                )
                                                                            ),
                                                                        ];
                                                                    },
                                                                    proxy: !0,
                                                                };
                                                            }),
                                                        ],
                                                        null,
                                                        !0
                                                    ),
                                                }),
                                                t._v(" "),
                                                t._l(t.bannerData.images, function (e, i) {
                                                    return [
                                                        e.imgTitle
                                                            ? a("transition", { key: "bnvTit" + i, attrs: { name: "fade" } }, [
                                                                  a("strong", {
                                                                      directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }],
                                                                      staticClass: "tit_bnv",
                                                                      domProps: { innerHTML: t._s(e.imgTitle) },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                        t._v(" "),
                                                        e.imgDescription
                                                            ? a("transition", { key: "bnvDesc" + i, attrs: { name: "fade" } }, [
                                                                  a("span", {
                                                                      directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i, expression: "activeIdx === index" }],
                                                                      staticClass: "txt_bnv",
                                                                      domProps: { innerHTML: t._s(e.imgDescription) },
                                                                  }),
                                                              ])
                                                            : t._e(),
                                                    ];
                                                }),
                                            ],
                                            2
                                        ),
                                        t._v(" "),
                                        a("div", { staticClass: "banner_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.bannerData.title) } }),
                                            t._v(" "),
                                            a("a", { attrs: { href: t.bannerData.link.link || "javascript:;", "data-tiara-action-name": "파트너상세_제휴제안_클릭", "data-tiara-layer": "partner_proposal", target: "_blank" } }, [
                                                a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.bannerData.description) } }),
                                            ]),
                                            t._v(" "),
                                            a(
                                                "a",
                                                {
                                                    staticClass: "link_more",
                                                    attrs: { href: t.bannerData.link.link || "javascript:;", "data-tiara-action-name": "파트너상세_제휴제안_클릭", "data-tiara-layer": "partner_proposal", target: "_blank" },
                                                },
                                                [a("span", { domProps: { innerHTML: t._s(t.bannerData.moreText) } }), a("IcoArrCircle", { attrs: { isStatic: !0 } })],
                                                1
                                            ),
                                        ]),
                                    ]);
                                },
                                [],
                                !1,
                                null,
                                "ba15c804",
                                null
                            ).exports,
                        },
                        computed: {
                            availableType: function () {
                                return "kakaotalk" === this.type || "navigation" === this.type || "smarthome" === this.type ? "app" : "mobility" === this.type || "display" === this.type ? "info" : "download";
                            },
                        },
                        asyncData: function (t) {
                            return Object(i.a)(
                                regeneratorRuntime.mark(function e() {
                                    var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b, C, y, x, k, w, T, I, D;
                                    return regeneratorRuntime.wrap(
                                        function (e) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        if (
                                                            ((a = t.app),
                                                            (i = t.params),
                                                            (s = t.redirect),
                                                            (n = t.store),
                                                            (e.prev = 1),
                                                            (r = i.detail),
                                                            -1 !== ["kakaotalk", "smartaccessory", "navigation", "display", "mobility", "smarthome"].indexOf(r))
                                                        ) {
                                                            e.next = 6;
                                                            break;
                                                        }
                                                        return e.abrupt("return", s("/partner"));
                                                    case 6:
                                                        return (o = n.getters.deviceType), (c = void 0 === o ? "pc" : o), (e.next = 9), a.$axios.$get("/api/withpartners/".concat(r, "?deviceType=").concat(c));
                                                    case 9:
                                                        if (((l = e.sent), (m = l.data).constructor !== Object || 0 !== Object.keys(m).length)) {
                                                            e.next = 13;
                                                            break;
                                                        }
                                                        return e.abrupt("return", s(301, "/el?e=rnf"));
                                                    case 13:
                                                        return (
                                                            (u = l.data),
                                                            (p = u.proposal),
                                                            (d = void 0 === p ? {} : p),
                                                            (h = u.feature),
                                                            (v = void 0 === h ? [] : h),
                                                            (g = u.identity),
                                                            (_ = void 0 === g ? {} : g),
                                                            (f = u.intro),
                                                            (b = void 0 === f ? {} : f),
                                                            (C = u.available),
                                                            (y = void 0 === C ? {} : C),
                                                            (x = u.banner),
                                                            (k = void 0 === x ? {} : x),
                                                            (w = u.inside),
                                                            (T = void 0 === w ? {} : w),
                                                            (I = u.command),
                                                            (D = void 0 === I ? {} : I),
                                                            n.dispatch("setHeadings", { headings: { h2: "파트너", h3: "with 파트너 - ".concat(r) } }),
                                                            n.dispatch("isHeaderTransparent", { isHeaderTransparent: !1 }),
                                                            n.dispatch("hasBanner", { hasBanner: !1 }),
                                                            e.abrupt("return", { feature: v, identity: _, intro: b, available: y, mainBanner: k, inside: T, command: D, type: r, proposal: d })
                                                        );
                                                    case 20:
                                                        (e.prev = 20), (e.t0 = e.catch(1)), s("/partner");
                                                    case 23:
                                                    case "end":
                                                        return e.stop();
                                                }
                                        },
                                        e,
                                        null,
                                        [[1, 20]]
                                    );
                                })
                            )();
                        },
                        created: function () {
                            this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                        },
                        mounted: function () {
                            this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "".concat(this.type), section: "파트너", custom_props: "" });
                        },
                    }),
                y =
                    (a(373),
                    Object(r.a)(
                        C,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { class: "partner_detail type_" + t.type },
                                [
                                    t.mainBanner ? a("infoVisual", { attrs: { mainBanner: t.mainBanner } }) : t._e(),
                                    t._v(" "),
                                    t.intro || t.feature || t.inside ? a("infoMix", { attrs: { intro: t.intro, feature: t.feature, inside: t.inside } }) : t._e(),
                                    t._v(" "),
                                    t.type && t.identity ? a("infoThumb", { attrs: { type: t.type, identity: t.identity } }) : t._e(),
                                    t._v(" "),
                                    t.command ? a("infoInside", { attrs: { command: t.command } }) : t._e(),
                                    t._v(" "),
                                    t.availableType || t.available ? a("infoAvailable", { attrs: { type: t.availableType, available: t.available } }) : t._e(),
                                    t._v(" "),
                                    t.proposal ? a("infoProposal", { attrs: { bannerData: t.proposal } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "350b2d14",
                        null
                    ));
            e.default = y.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            var i = a(30),
                s = a(31),
                n = {
                    props: ["deviceImage"],
                    components: { Parallax: a(25).a },
                    data: function () {
                        return { deviceThumbInfo: { 375: "532x1128", 1440: "908x1922", 1920: "908x1922", 2560: "908x1922" } };
                    },
                },
                r = (a(340), a(0)),
                o = Object(r.a)(
                    n,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("section", { staticClass: "info_device" }, [
                            t._m(0),
                            t._v(" "),
                            a("p", { staticClass: "desc_kakaohome" }, [
                                t._v(
                                    "집에 있는 기기를 직접 제어하기 귀찮을 때 카카오홈을 찾아주세요. 기기를 쉽게 제어하고 자주 사용하는 기기를 묶어 모드를 설정할 수도 있습니다.  아파트 에너지를 얼마 썼는지 궁금할 때도 카카오홈에서 편하게 확인하실 수 있습니다."
                                ),
                            ]),
                            t._v(" "),
                            a(
                                "div",
                                { staticClass: "device_thumb" },
                                [
                                    a("Parallax", { attrs: { speedFactor: 1, direction: "up" } }, [
                                        a("div", { staticClass: "thumb_shadow" }, [
                                            a(
                                                "img",
                                                t._b(
                                                    { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.deviceThumbInfo[t.screenType], expression: "deviceThumbInfo[screenType]" }], attrs: { alt: "" } },
                                                    "img",
                                                    t.toThumb(t.deviceThumbInfo, t.deviceImage.url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ]),
                                ],
                                1
                            ),
                        ]);
                    },
                    [
                        function () {
                            var t = this.$createElement,
                                e = this._self._c || t;
                            return e("h4", { staticClass: "tit_kakaohome" }, [this._v("집, 더 편하게. "), e("br"), this._v("카카오홈과 함께 스마트라이프")]);
                        },
                    ],
                    !1,
                    null,
                    "c9f272ac",
                    null
                ).exports,
                c = {
                    props: ["tutorialData"],
                    data: function () {
                        return {
                            tutorialThumbInfo: { 375: "570x570", 1440: "1042x1042", 1920: "1042x1042", 2560: "1042x1042" },
                            loadingData: {
                                375: { widthHeight: 329, radius: 159.9, centerXY: 164.5, dashHarry: 1004.6813306180157 },
                                1440: { widthHeight: 508, radius: 247, centerXY: 254, dashHarry: 1551.9467708733578 },
                                1920: { widthHeight: 581, radius: 282.5, centerXY: 290.5, dashHarry: 1774.9998492782331 },
                                2560: { widthHeight: 640, radius: 312, centerXY: 320, dashHarry: 1960.3538158400308 },
                            },
                            tutorialLiHeight: 0,
                            tutorialHeight: 0,
                            tutorialOffset: 0,
                            tutorialListLen: 0,
                            activeIndex: 0,
                            circleDashHarry: 2 * Math.PI,
                            dividePercent: 0,
                            stagePercent: 0,
                            setTimeArr: [6, 9, 12, 19, 23],
                            saveHour: 6,
                            ampm: "AM",
                            hourToString: "06",
                            setMinute: "00",
                            setTimeout: null,
                            winHeight: 0,
                            moLoadingIdx: 1,
                        };
                    },
                    computed: {
                        matchedLoadingData: function () {
                            var t = this.loadingData[1920];
                            return this.screenType && (t = this.loadingData[this.screenType]), t;
                        },
                    },
                    created: function () {
                        (this.winHeight = window.innerHeight), (this.stagePercent = this.matchedLoadingData.dashHarry);
                    },
                    mounted: function () {
                        (this.tutorialOffset = this.$refs.tutorial.offsetTop),
                            (this.tutorialHeight = this.$refs.tutorial.offsetHeight),
                            (this.tutorialListLen = this.$refs.tutorialList.children.length),
                            (this.dividePercent = 100 / this.tutorialListLen),
                            this.$refs.tutorialList.children[0] && (this.tutorialLiHeight = this.$refs.tutorialList.children[0].elm.clientHeight),
                            this.handleScroll(),
                            window.addEventListener("scroll", this.handleScroll),
                            window.addEventListener("resize", this.handleResize);
                    },
                    methods: {
                        handleResize: function () {
                            this.isMobile ? (this.winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight, this.winHeight || 0)) : (this.winHeight = window.innerHeight),
                                (this.tutorialOffset = this.$refs.tutorial.offsetTop || this.tutorialOffset),
                                (this.tutorialListLen = this.$refs.tutorialList.children.length),
                                (this.tutorialHeight = this.winHeight * this.tutorialListLen),
                                (this.dividePercent = 100 / this.tutorialListLen),
                                this.$refs.tutorialList.children[0] && (this.tutorialLiHeight = this.$refs.tutorialList.children[0].elm.clientHeight),
                                this.handleScroll();
                        },
                        handleScroll: function () {
                            var t = window.pageYOffset,
                                e = this.tutorialHeight / this.tutorialListLen,
                                a = t + this.winHeight,
                                i = this.tutorialOffset + this.tutorialHeight;
                            if (t >= this.tutorialOffset) {
                                if (a > i) return (this.currentActiveIdx = 4), (this.saveHour = 23), (this.ampm = "PM"), void (this.hourToString = "11");
                                var s = Math.abs(Math.round((t - this.tutorialOffset) / e));
                                this.tutorialOffset, Math.round(((t - this.tutorialOffset) / this.tutorialHeight) * 100);
                                this.activeIndex !== s && this.changeTime(s),
                                    (this.activeIndex = s),
                                    (this.moLoadingIdx = s + 1),
                                    (this.stagePercent = ((100 - this.dividePercent * (s + 1)) / 100) * this.circleDashHarry * this.matchedLoadingData.radius);
                            } else (this.moLoadingIdx = 0), (this.currentActiveIdx = 0), (this.saveHour = 6), (this.ampm = "AM"), (this.hourToString = "06"), (this.stagePercent = this.matchedLoadingData.dashHarry);
                        },
                        setTimeFormat: function (t) {
                            t >= 12
                                ? ((this.ampm = "PM"), (this.hourToString = "".concat(t - 12)), 12 === t && (this.hourToString = "".concat(t)), 1 === this.hourToString.length && (this.hourToString = "0".concat(this.hourToString)))
                                : ((this.ampm = "AM"), (this.hourToString = t < 10 ? "0".concat(t) : "".concat(t))),
                                (this.saveHour = t);
                        },
                        changeTime: function (t) {
                            var e = this;
                            1 == this.setTimeout && clearTimeout(this.setTimeout);
                            this.setTimeArr;
                            var a = this.saveHour;
                            this.setTimeout = setTimeout(function () {
                                e.timeVariation(a, t), (e.setTimeout = null);
                            }, 100);
                        },
                        timeVariation: function (t, e) {
                            var a = this;
                            if (t < this.setTimeArr[e]) {
                                var i = t + 1;
                                setTimeout(function () {
                                    a.setTimeFormat(i), a.timeVariation(i, e);
                                }, 100);
                            } else {
                                if (!(t > this.setTimeArr[e])) return;
                                var s = t - 1;
                                setTimeout(function () {
                                    a.setTimeFormat(s), a.timeVariation(s, e);
                                }, 100);
                            }
                        },
                    },
                    beforeDestroy: function () {
                        window.removeEventListener("resize", this.handleResize), window.removeEventListener("scroll", this.handleScroll);
                    },
                },
                l =
                    (a(341),
                    Object(r.a)(
                        c,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { ref: "tutorial", staticClass: "info_tutorial", style: { height: t.winHeight * t.tutorialData.length + "px" } }, [
                                a("h4", { staticClass: "screen_out" }, [t._v("카카오홈 사용 안내")]),
                                t._v(" "),
                                a(
                                    "div",
                                    {
                                        directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                        ref: "sticky",
                                        class: ["wrap_cont"],
                                        style: { height: t.winHeight + "px" },
                                        attrs: { "sticky-offset": "{top: " + (t.isMobile ? "0" : "60") + "}", "on-stick": "onStick", "sticky-z-index": "20", "sticky-placeHolder": "true", "sticky-side": "top", "center-position": "true" },
                                    },
                                    [
                                        a(
                                            "div",
                                            { staticClass: "inner_cont" },
                                            [
                                                a(
                                                    "div",
                                                    { staticClass: "cont_additional", style: { height: t.tutorialLiHeight + "px" } },
                                                    [
                                                        a("client-only", [
                                                            t.isMobile
                                                                ? a("svg", { staticClass: "svg", attrs: { width: "329", height: "329" } }, [
                                                                      a("circle", {
                                                                          attrs: { r: "159.9", cx: "164.5", cy: "164.5", fill: "transparent", "stroke-dasharray": "1004.681330618015801", "stroke-dashoffset": "0", "stroke-linecap": "round" },
                                                                      }),
                                                                      t._v(" "),
                                                                      a("circle", {
                                                                          ref: "bar",
                                                                          class: ["bar", t.moLoadingIdx > 0 ? "loading" + t.moLoadingIdx : ""],
                                                                          attrs: { r: "159.9", cx: "164.5", cy: "164.5", fill: "transparent", "stroke-dasharray": "1004.681330618015801", "stroke-linecap": "round" },
                                                                      }),
                                                                  ])
                                                                : a("svg", { staticClass: "svg", attrs: { width: t.matchedLoadingData.widthHeight, height: t.matchedLoadingData.widthHeight } }, [
                                                                      a("circle", {
                                                                          attrs: {
                                                                              r: t.matchedLoadingData.radius,
                                                                              cx: t.matchedLoadingData.centerXY,
                                                                              cy: t.matchedLoadingData.centerXY,
                                                                              fill: "transparent",
                                                                              "stroke-dasharray": t.matchedLoadingData.dashHarry,
                                                                              "stroke-dashoffset": "0",
                                                                              "stroke-linecap": "round",
                                                                          },
                                                                      }),
                                                                      t._v(" "),
                                                                      a("circle", {
                                                                          ref: "bar",
                                                                          staticClass: "bar",
                                                                          attrs: {
                                                                              r: t.matchedLoadingData.radius,
                                                                              cx: t.matchedLoadingData.centerXY,
                                                                              cy: t.matchedLoadingData.centerXY,
                                                                              fill: "transparent",
                                                                              "stroke-dasharray": t.matchedLoadingData.dashHarry,
                                                                              "stroke-dashoffset": t.stagePercent,
                                                                              "stroke-linecap": "round",
                                                                          },
                                                                      }),
                                                                  ]),
                                                        ]),
                                                        t._v(" "),
                                                        a("div", { staticClass: "area_time" }, [
                                                            a("span", { staticClass: "txt_time" }, [t._v(t._s(t.hourToString) + ":" + t._s(t.setMinute))]),
                                                            t._v(" "),
                                                            a("span", { staticClass: "type_time" }, [t._v(t._s(t.ampm))]),
                                                        ]),
                                                    ],
                                                    1
                                                ),
                                                t._v(" "),
                                                a(
                                                    "transition-group",
                                                    { ref: "tutorialList", staticClass: "list_tutorial", attrs: { name: "tutorial-list", tag: "ul" } },
                                                    t._l(t.tutorialData, function (e, i) {
                                                        return a("li", { key: "tutorial" + i, class: { active: i === t.activeIndex } }, [
                                                            a(
                                                                "img",
                                                                t._b(
                                                                    {
                                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.tutorialThumbInfo[t.screenType], expression: "tutorialThumbInfo[screenType]" }],
                                                                        staticClass: "img_user",
                                                                        attrs: { alt: "" },
                                                                    },
                                                                    "img",
                                                                    t.toThumb(t.tutorialThumbInfo, e.image),
                                                                    !1
                                                                )
                                                            ),
                                                            t._v(" "),
                                                            a("p", { staticClass: "desc_detail", domProps: { innerHTML: t._s(e.desc) } }),
                                                        ]);
                                                    }),
                                                    0
                                                ),
                                            ],
                                            1
                                        ),
                                    ]
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "6bab6f2f",
                        null
                    ).exports),
                m = {
                    props: ["lifeData"],
                    data: function () {
                        return {
                            lifeThumbInfo: [
                                { 375: "388x366", 1440: "676x636", 1920: "676x636", 2560: "676x636" },
                                { 375: "388x272", 1440: "676x470", 1920: "676x470", 2560: "676x470" },
                                { 375: "388x238", 1440: "676x414", 1920: "676x414", 2560: "676x414" },
                                { 375: "390x186", 1440: "676x320", 1920: "676x320", 2560: "676x320" },
                                { 375: "390x396", 1440: "676x688", 1920: "676x688", 2560: "676x688" },
                                { 375: "390x200", 1440: "676x346", 1920: "676x346", 2560: "676x346" },
                            ],
                            windowHeight: 0,
                        };
                    },
                    created: function () {
                        this.windowHeight = window.innerHeight;
                    },
                },
                u =
                    (a(342),
                    Object(r.a)(
                        m,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { ref: "lifeStyle", staticClass: "info_life" }, [
                                t.isMobile
                                    ? a("h4", { staticClass: "tit_life" }, [t._v("당신의 일상을 더 똑똑하고"), a("br"), t._v("편리하게 바꿔보세요.")])
                                    : a(
                                          "div",
                                          {
                                              directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                              staticClass: "area_tit",
                                              style: { height: t.windowHeight + "px" },
                                              attrs: { "sticky-offset": "{top: " + (t.isMobile ? 56 : 60) + "}", "on-stick": "onStick", "sticky-z-index": "20", "sticky-side": "top" },
                                          },
                                          [t._m(0)]
                                      ),
                                t._v(" "),
                                t.isMobile
                                    ? a(
                                          "div",
                                          { staticClass: "thumb_life" },
                                          t._l(t.lifeData, function (e, i) {
                                              return a(
                                                  "img",
                                                  t._b(
                                                      {
                                                          directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.lifeThumbInfo[i][t.screenType], expression: "lifeThumbInfo[index][screenType]" }],
                                                          key: "img" + i,
                                                          staticClass: "img_life",
                                                          attrs: { alt: "" },
                                                      },
                                                      "img",
                                                      t.toThumb(t.lifeThumbInfo[i], e),
                                                      !1
                                                  )
                                              );
                                          }),
                                          0
                                      )
                                    : a(
                                          "div",
                                          { directives: [{ name: "aos", rawName: "v-aos", value: { isToggle: !0 }, expression: "{isToggle: true}" }], staticClass: "thumb_life" },
                                          t._l(t.lifeData, function (e, i) {
                                              return a(
                                                  "img",
                                                  t._b(
                                                      {
                                                          directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.lifeThumbInfo[i][t.screenType], expression: "lifeThumbInfo[index][screenType]" }],
                                                          key: "img" + i,
                                                          staticClass: "img_life",
                                                          attrs: { alt: "" },
                                                      },
                                                      "img",
                                                      t.toThumb(t.lifeThumbInfo[i], e),
                                                      !1
                                                  )
                                              );
                                          }),
                                          0
                                      ),
                            ]);
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("h4", { staticClass: "tit_life" }, [this._v("당신의 일상을 더 똑똑하고 "), e("br"), this._v("편리하게 바꿔보세요.")]);
                            },
                        ],
                        !1,
                        null,
                        "2ba7b316",
                        null
                    ).exports),
                p = { props: ["apartmentData"] },
                d =
                    (a(343),
                    Object(r.a)(
                        p,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_apartment" }, [
                                a("h4", { staticClass: "tit_kakaohome" }, [t._v("카카오홈과 함께하는 아파트")]),
                                t._v(" "),
                                t._m(0),
                                t._v(" "),
                                a("div", { staticClass: "apartment_image", style: { background: "url(" + t.toThumb(t.apartmentData.bgThumbInfo, t.apartmentData.bgImageUrl)["data-src"] + ") 50% 50% /cover no-repeat" } }, [
                                    a(
                                        "ul",
                                        { staticClass: "list_logo" },
                                        t._l(t.apartmentData.logoImageList, function (e, i) {
                                            return a("li", { key: "apartment" + i }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.apartmentData.logoThumbInfo[t.screenType], expression: "apartmentData.logoThumbInfo[screenType]" }],
                                                            attrs: { alt: e.alt },
                                                        },
                                                        "img",
                                                        t.toThumb(t.apartmentData.logoThumbInfo, e.url),
                                                        !1
                                                    )
                                                ),
                                            ]);
                                        }),
                                        0
                                    ),
                                ]),
                            ]);
                        },
                        [
                            function () {
                                var t = this,
                                    e = t.$createElement,
                                    a = t._self._c || e;
                                return a("div", { staticClass: "apartment_tit" }, [
                                    a("span", [t._v("서동탄역 더샵 파크시티")]),
                                    t._v(" "),
                                    a("span", [t._v("동탄호수공원 아이파크")]),
                                    t._v(" "),
                                    a("span", [t._v("평택 소사벌 포스코더샵")]),
                                    t._v(" "),
                                    a("span", [t._v("용산 센트럴파크 해링턴스퀘어")]),
                                    t._v(" "),
                                    a("span", [t._v("신정2 래미안")]),
                                ]);
                            },
                        ],
                        !1,
                        null,
                        "1f9dbe89",
                        null
                    ).exports),
                h = {
                    components: { Banner: a(4).a },
                    data: function () {
                        return {
                            activeMethodIdx: 0,
                            methodThumbInfo: { 375: "188x398", 1440: "476x1006", 1920: "476x1006", 2560: "476x1006" },
                            methodData: [
                                {
                                    title: "카카오홈 앱을 설치하시고 계정을 연결해 주세요.",
                                    desc: "카카오 계정을 연결하시면 카카오홈에서 여러 가지 IoT 기기를 제어할 수 있어요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_01.png?v=20090904",
                                },
                                {
                                    title: "설정에서 확장서비스 관리를 클릭해주세요.",
                                    desc: "확장서비스 관리에서 연결할 수 있는 서비스들을 확인하실 수 있어요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_02.png?v=20090904",
                                },
                                {
                                    title: "연동하실 기기나 아파트를 찾아 선택해주세요.",
                                    desc: "확장서비스를 클릭하시면 연결할 수 있는 상세 기기명도 확인하실 수 있어요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_03.png?v=20090904",
                                },
                                {
                                    title: "계정 연결 버튼을 눌러 로그인 및 인증을 진행해주세요.",
                                    desc: "계정 연결을 완료 했을 때 연결 가능한 기기가 보이지 않으면 다음 단계를 진행해주세요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_04.png?v=20090904",
                                },
                                {
                                    title: "제조사의 앱/웹에서 로그인 후에 기기를 등록해주세요.",
                                    desc: "먼저 연결할 제조사 사이트에서 기기를 등록해주셔야 카카오홈과 연결할 수 있어요.<br>*아파트 연결 시 생략",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_05.png?v=20090904",
                                },
                                {
                                    title: "연결 버튼을 눌러 카카오홈과 연결해주세요.",
                                    desc: "카카오홈에서 지원하지 않는 기기는 연결 가능 기기 목록에 보이지 않아요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_06.png?v=20090904",
                                },
                                {
                                    title: "기기를 등록할 공간과 이름을 설정하세요.",
                                    desc: "기기별로 원하는 공간에 등록하고 나만의 기기 이름을 설정해서 제어할 수 있어요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_07.png?v=20090904",
                                },
                                {
                                    title: "연결한 기기를 확인하시고 손쉽게 사용해보세요.",
                                    desc: "아파트를 연결하시면 홈 화면에서 에너지 사용량, 택배 정보 등도 조회할 수 있어요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_08.png?v=20090904",
                                },
                                {
                                    title: "헤이카카오 앱에서 카카오미니 등록 후 사용해보세요.",
                                    desc: "카카오미니로 음성 제어가 가능하며 카카오미니가 없어도 카카오홈 앱에서 기기 제어가 가능해요.",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_method_09.png?v=20090904",
                                },
                            ],
                        };
                    },
                    methods: {
                        moveBanner: function (t) {
                            this.activeMethodIdx = t - 1;
                        },
                    },
                },
                v =
                    (a(344),
                    Object(r.a)(
                        h,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_method" },
                                [
                                    a("h4", { staticClass: "tit_kakaohome" }, [t._v("카카오홈을 시작하는 가장 간편한 방법")]),
                                    t._v(" "),
                                    t._m(0),
                                    t._v(" "),
                                    a("Banner", {
                                        attrs: { options: { slotSize: t.methodData.length, isLoop: !1, alignItem: "center", isPagingInside: !0, pagingType: "text" } },
                                        on: { callback: t.moveBanner },
                                        scopedSlots: t._u(
                                            [
                                                t._l(t.methodData, function (e, i) {
                                                    return {
                                                        key: "slot" + i,
                                                        fn: function () {
                                                            return [
                                                                a("div", { key: "bnv" + i, staticClass: "thumb_shadow" }, [
                                                                    a(
                                                                        "img",
                                                                        t._b(
                                                                            {
                                                                                directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.methodThumbInfo[t.screenType], expression: "methodThumbInfo[screenType]" }],
                                                                                ref: "bannerImage",
                                                                                refInFor: !0,
                                                                                staticClass: "img_bnv",
                                                                                attrs: { alt: "" },
                                                                            },
                                                                            "img",
                                                                            t.toThumb(t.methodThumbInfo, e.imageUrl),
                                                                            !1
                                                                        )
                                                                    ),
                                                                ]),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                            ],
                                            null,
                                            !0
                                        ),
                                    }),
                                    t._v(" "),
                                    a("div", { staticClass: "banner_info" }, [
                                        a("em", { staticClass: "tit_banner" }, [t._v(t._s(t.methodData[t.activeMethodIdx].title))]),
                                        t._v(" "),
                                        a("p", { staticClass: "desc_kakaohome", domProps: { innerHTML: t._s(t.methodData[t.activeMethodIdx].desc) } }),
                                    ]),
                                ],
                                1
                            );
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("p", { staticClass: "desc_kakaohome" }, [
                                    this._v('외출할 때 거실 불을 끄고, 가스밸브 잠그고, 엘리베이터 호출하는 일을 말 한 마디 “출근모드 켜줘"로 제어할 수 있습니다. '),
                                    e("i", { staticClass: "line_pc" }),
                                    this._v("외출 후 집에 도착하기 전 카카오홈 앱에서 에어컨과 조명을 켜거나 도착한 택배가 있는지도 확인할 수 있습니다."),
                                ]);
                            },
                        ],
                        !1,
                        null,
                        "00db61ca",
                        null
                    ).exports),
                g = {
                    data: function () {
                        return {
                            thumbInfo: { 375: "284x284", 1440: "284x284", 1920: "284x284", 2560: "284x284" },
                            productData: [
                                { category: "조명", name: "Philips Hue", link: "https://www2.meethue.com/ko-kr/where-to-buy", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_01.jpg?v=20090904" },
                                { category: "리모컨 허브", name: "Hejhome", link: "https://www.hej.life/shop/?idx=8", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_15.jpg?v=20090904" },
                                { category: "커튼", name: "Hejhome", link: "https://www.hej.life/shop/?idx=53", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_16.jpg?v=20090904" },
                                { category: "공기청청기", name: "COWAY", link: "http://www.coway.co.kr/Product/List/?pMenuID=A1", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_27.jpg?v=20090904" },
                                { category: "센서", name: "AWAIR", link: "https://kr.getawair.com/#/", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_03.jpg?v=20090904" },
                                {
                                    category: "가습기",
                                    name: "miro",
                                    link: "https://www.gomiro.com/category/uv-%EC%95%88%EC%8B%AC%EC%82%B4%EA%B7%A0-%EA%B0%80%EC%8A%B5%EA%B8%B0nr1009-series/139/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_18.jpg?v=20090904",
                                },
                                {
                                    category: "선풍기",
                                    name: "miro",
                                    link: "http://gomiro3.dothome.co.kr/shop_redirect.html?model=MF02",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_26.jpg?v=20090904",
                                },
                                {
                                    category: "플러그",
                                    name: "DAWONDNS",
                                    link: "https://pmshop.co.kr/product/detail.html?product_no=59&cate_no=1&display_group=2",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_05.jpg?v=20090904",
                                },
                                {
                                    category: "블라인드",
                                    name: "BRUNT",
                                    link: "https://www.brunt.co/goods/goods_view.php?goodsNo=1000000003",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_06.jpg?v=20090904",
                                },
                                { category: "플러그", name: "BRUNT", link: "https://www.hej.life/shop-powersupply/?idx=153", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_07.jpg?v=20090904" },
                                { category: "조명", name: "merlot.lab", link: "https://soyori.co.kr/product/list.html?cate_no=43", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_08.jpg?v=20090904" },
                                {
                                    category: "스위치",
                                    name: "eZEX",
                                    link: "http://www.11st.co.kr/product/SellerProductDetail.tmall?method=getSellerProductDetail&prdNo=2084956884",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_09.jpg?v=20090904",
                                },
                                { category: "스위치", name: "Hejhome", link: "https://www.hej.life/shop/?idx=50", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_10.jpg?v=20090904" },
                                {
                                    category: "스위치",
                                    name: "I/O",
                                    link: "https://smartstore.naver.com/ioswitcher/products/698494622",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_11.jpg?v=20090904",
                                },
                                {
                                    category: "난방",
                                    name: "KD NAVIEN",
                                    link: "https://shoppinghow.kakao.com/search/NR-40D/&docid:&srchhow:Cexpo",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_12.jpg?v=20090904",
                                },
                                { category: "보일러", name: "KITURAMI", link: "http://krb.co.kr/product9", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_17.png?v=20090904" },
                                {
                                    category: "도어록",
                                    name: "SAMSUNG SDS",
                                    link: "https://search.shopping.naver.com/catalog/19969532625?cat_id=50002359",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_13_210224.jpg?v=20090904",
                                },
                                {
                                    category: "공기청정기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/air-cleaner/all-air-cleaner/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_19.png?v=20090904",
                                },
                                {
                                    category: "세탁기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/washing-machines/all-washing-machines/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_20.png?v=20090904",
                                },
                                { category: "건조기", name: "SAMSUNG", link: "https://www.samsung.com/sec/dryers/all-dryers/", imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_21.png?v=20090904" },
                                {
                                    category: "로봇청소기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/vacuum-cleaners/all-vacuum-cleaners/?bespoke-jetbot",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_22_210514.png?v=20090904",
                                },
                                {
                                    category: "에어컨",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/air-conditioners/all-air-conditioners/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_23.png?v=20090904",
                                },
                                {
                                    category: "식기세척기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/dishwashers/all-dishwashers/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_24.png?v=20090904",
                                },
                                {
                                    category: "의류관리기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/airdresser/all-airdresser/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_25.png?v=20090904",
                                },
                                {
                                    category: "정수기",
                                    name: "SAMSUNG",
                                    link: "https://www.samsung.com/sec/water-purifier/all-water-purifier/",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/img_product_28.png?v=20090904",
                                },
                            ],
                        };
                    },
                },
                _ =
                    (a(345),
                    Object(r.a)(
                        g,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_product" }, [
                                a("h4", { staticClass: "tit_kakaohome" }, [t._v("카카오홈과 함께하는 제품들")]),
                                t._v(" "),
                                t._m(0),
                                t._v(" "),
                                a(
                                    "ul",
                                    { staticClass: "list_product" },
                                    t._l(t.productData, function (e, i) {
                                        return a("li", { key: "product" + i }, [
                                            e.link
                                                ? a("a", { staticClass: "link_product", attrs: { href: e.link, target: "_blank" } }, [
                                                      a(
                                                          "img",
                                                          t._b(
                                                              { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }], attrs: { alt: "" } },
                                                              "img",
                                                              t.toThumb(t.thumbInfo, e.imageUrl),
                                                              !1
                                                          )
                                                      ),
                                                      t._v("\n        " + t._s(e.category)),
                                                      a("em", { staticClass: "tit_product" }, [t._v(t._s(e.name))]),
                                                      t._v(" "),
                                                      t.isMobile ? t._e() : a("span", { staticClass: "txt_product" }, [t._v(t._s(e.linkText || "구매하기"))]),
                                                  ])
                                                : a("div", { staticClass: "link_product" }, [
                                                      a(
                                                          "img",
                                                          t._b(
                                                              { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }], attrs: { alt: "" } },
                                                              "img",
                                                              t.toThumb(t.thumbInfo, e.imageUrl),
                                                              !1
                                                          )
                                                      ),
                                                      t._v("\n        " + t._s(e.category)),
                                                      a("em", { staticClass: "tit_product" }, [t._v(t._s(e.name))]),
                                                      t._v(" "),
                                                      t.isMobile ? t._e() : a("span", { staticClass: "txt_product" }, [t._v(t._s(e.linkText || "구매하기"))]),
                                                  ]),
                                        ]);
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("p", { staticClass: "desc_kakaohome" }, [
                                    this._v("구매하신 제품을 카카오홈에 연결하시면 다양한 기능을 사용할 수 있습니다. "),
                                    e("i", { staticClass: "line_pc" }),
                                    this._v("카카오미니를 이용해 음성 제어도 가능합니다."),
                                ]);
                            },
                        ],
                        !1,
                        null,
                        "91044e82",
                        null
                    ).exports),
                f = a(24),
                b = a(33),
                C = {
                    components: { ProductBanner: i.a, VodInfo: s.a, DeviceSection: o, TutorialSection: l, LifeSection: u, ApartmentSection: d, MethodSection: v, ProductSection: _, AppBNV: f.a, BottomBNV: b.a },
                    asyncData: function (t) {
                        var e = t.store,
                            a = e.getters.deviceType,
                            i = void 0 === a ? "pc" : a;
                        return (
                            e.dispatch("setHeadings", { headings: { h2: "제품", h3: "kakaoHome" } }),
                            e.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                            e.dispatch("hasBanner", { hasBanner: !1 }),
                            {
                                visualData: {
                                    title: '카카오홈으로 만드는 <i class="line_pc"></i>똑똑한 우리집',
                                    scrollText: "More About <em>Kakaohome</em>",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_visual.jpg?v=20090904"),
                                },
                                introData: {
                                    title: "라이프 어시스턴트",
                                    desc: '카카오홈은 집안의 조명, 난방, 에어컨 등을 제어하고, 아파트 관리비, <i class="line_pc"></i>에너지 사용량 등을 조회할 수 있는 스마트홈 서비스입니다.',
                                    vodData: [
                                        {
                                            image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_video.jpg"), imgDescription: "" },
                                            video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/vod_promotion.mp4",
                                            etc: "Promotional Video",
                                        },
                                    ],
                                },
                                apartmentData: {
                                    bgThumbInfo: { 375: "750x1280", 1440: "3840x1800", 1920: "3840x1800", 2560: "3840x1800" },
                                    bgImageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_apartment.png?v=20090904"),
                                    logoThumbInfo: { 375: "210x108", 1440: "436x224", 1920: "436x224", 2560: "436x224" },
                                    logoImageList: [
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_logo_01.png?v=20090904"), alt: "자이" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_logo_02.png?v=20090904"), alt: "The Sharp" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_logo_03.png?v=20090904"), alt: "래미안" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_logo_04.png?v=20090904"), alt: "IPARK" },
                                        { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_logo_05.png?v=20090904"), alt: "COMMAX" },
                                    ],
                                },
                                deviceImage: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_device.png?v=20090904"), alt: "래미안" },
                                tutorialData: [
                                    {
                                        desc: '아직은 어두운 아침. <i class="line_pc line_mo"></i>음성만으로 집 안의조명을 <i class="line_mo"></i>제어할 수 있어요.',
                                        image: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_tutorial_01.png?v=20090904"),
                                    },
                                    {
                                        desc: '카카오홈과 준비하는 출근. <i class="line_pc line_mo"></i>오늘의 뉴스를 들으며 준비하고 <i class="line_mo"></i>엘리베이터를 대기시켜 보세요.',
                                        image: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_tutorial_02.png?v=20090904"),
                                    },
                                    {
                                        desc: "습하고 더울 땐, “에어컨 켜줘” 한 마디만 하세요.<br> 카카오홈과 집안의 온도와 습도를 조절하세요.",
                                        image: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_tutorial_03.png?v=20090904"),
                                    },
                                    {
                                        desc: '집 밖에 있을 땐 편하게 <i class="line_pc line_mo"></i>카톡으로. 멀리 있어도 카톡 하나면 제어할 수 있어요.',
                                        image: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_tutorial_04.png?v=20090904"),
                                    },
                                    {
                                        desc: '오늘 하루는 어떠셨나요? <i class="line_pc line_mo"></i>하루의 마무리는 <i class="line_pc line_mo"></i>카카오홈에게 부탁하세요.',
                                        image: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_tutorial_05.png?v=20090904"),
                                    },
                                ],
                                lifeData: [
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_01.png?v=20090904"),
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_02.png?v=20090904"),
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_03.png?v=20090904"),
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_04.png?v=20090904"),
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_05.png?v=20090904"),
                                    "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_life_06.png?v=20090904"),
                                ],
                                nextProduct: {
                                    title: "내 손안의 스마트한 친구<br>미니링크",
                                    image: {
                                        background: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_next.jpg?v=20090904"),
                                        thumbInfos: { 375: "750x800", 1440: "2880x1280", 1920: "3840x1440", 2560: "5120x1600" },
                                    },
                                    about: { link: "/product/minilink", text: "More About <em>‘Mini Link’</em>" },
                                },
                                appBannerData: {
                                    title: '카카오홈앱을 다운받고 <i class="line_mo"></i>제품을 연결하세요.',
                                    description: "Android: 5.0 이상 / iOS: 12.0 이상 지원 가능합니다.",
                                    moreText: "카카오홈앱",
                                    image: {
                                        type: "SINGLE",
                                        url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaohome/".concat(i, "/img_app.png?v=20090904"),
                                        imgDescription: "",
                                        thumbInfos: { 375: "682x658", 1440: "1196x640", 1920: "1196x640", 2560: "1196x640" },
                                        bgSize: { mo: "341px 329px", pc: "598px 320px" },
                                    },
                                    link: { appStore: "https://apps.apple.com/kr/app/id1420362968", googlePlay: "https://play.google.com/store/apps/details?id=com.kakao.i.home" },
                                },
                            }
                        );
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "카카오홈", section: "제품", custom_props: "" });
                    },
                },
                y =
                    (a(346),
                    Object(r.a)(
                        C,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "product_kakaohome" },
                                [
                                    a("ProductBanner", { attrs: { visualData: t.visualData } }),
                                    t._v(" "),
                                    a("VodInfo", { attrs: { introData: t.introData } }),
                                    t._v(" "),
                                    a("DeviceSection", { attrs: { deviceImage: t.deviceImage } }),
                                    t._v(" "),
                                    a("TutorialSection", { attrs: { tutorialData: t.tutorialData } }),
                                    t._v(" "),
                                    a("LifeSection", { attrs: { lifeData: t.lifeData } }),
                                    t._v(" "),
                                    a("ApartmentSection", { attrs: { apartmentData: t.apartmentData } }),
                                    t._v(" "),
                                    a("MethodSection"),
                                    t._v(" "),
                                    a("ProductSection"),
                                    t._v(" "),
                                    a("AppBNV", { attrs: { bannerData: t.appBannerData, bannerLog: { name: "제품_앱다운로드_클릭", layer: "product_app_download" } } }),
                                    t._v(" "),
                                    a("BottomBNV", { attrs: { nextProduct: t.nextProduct } }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "519e9180",
                        null
                    ));
            e.default = y.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = a(4),
                n = a(13),
                r = {
                    name: "infoVisual",
                    components: { Banner: s.a, IcoArrCircle: n.a },
                    props: { mainBanner: { type: Object, default: [] } },
                    data: function () {
                        return { thumbInfos: { 375: "750x1270", 1440: "2880x1720", 1920: "3840x1920", 2560: "5120x2272" } };
                    },
                },
                o = (a(314), a(0)),
                c = Object(o.a)(
                    r,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            { staticClass: "info_visual" },
                            [
                                a("Banner", {
                                    attrs: { options: { type: "wide" } },
                                    scopedSlots: t._u([
                                        {
                                            key: "slot0",
                                            fn: function () {
                                                return [
                                                    a("div", { staticClass: "cont_item" }, [
                                                        a("div", { staticClass: "layer_cont" }, [
                                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.mainBanner.title) } }),
                                                            t._v(" "),
                                                            a("div", { staticClass: "wrap_cont" }, [
                                                                a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.mainBanner.subTitle) } }),
                                                                t._v(" "),
                                                                t.mainBanner.link.more && t.mainBanner.moreText
                                                                    ? a(
                                                                          "a",
                                                                          { staticClass: "link_more", attrs: { href: t.mainBanner.link.more, "data-tiara-action-name": "상단배너_클릭", "data-tiara-layer": "top_banner" } },
                                                                          [a("span", { domProps: { innerHTML: t._s(t.mainBanner.moreText) } }), a("IcoArrCircle", { attrs: { isStatic: !0 } })],
                                                                          1
                                                                      )
                                                                    : t._e(),
                                                            ]),
                                                        ]),
                                                        t._v(" "),
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }],
                                                                    staticClass: "img_bnv",
                                                                    attrs: { alt: t.mainBanner.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos, t.mainBanner.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ]),
                                                ];
                                            },
                                            proxy: !0,
                                        },
                                    ]),
                                }),
                            ],
                            1
                        );
                    },
                    [],
                    !1,
                    null,
                    "3b7b5b58",
                    null
                ).exports,
                l = { name: "infoInside", props: { insides: { type: Array, default: [] } } },
                m =
                    (a(315),
                    Object(o.a)(
                        l,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { staticClass: "info_inside" }, [
                                a(
                                    "ul",
                                    { staticClass: "list_inside" },
                                    t._l(t.insides, function (e, i) {
                                        return a("li", { key: "mainIntro" + i }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                        ]);
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "114f23df",
                        null
                    ).exports),
                u = {
                    name: "infoBNV",
                    components: { Banner: s.a },
                    props: { kakaoi: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos: { 375: "750x1120", 1440: "3200x1812", 1920: "3200x1812", 2560: "3200x1812" } };
                    },
                },
                p =
                    (a(316),
                    Object(o.a)(
                        u,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_bnv" },
                                [
                                    a("Banner", {
                                        attrs: { options: { type: "wide" } },
                                        scopedSlots: t._u([
                                            {
                                                key: "slot0",
                                                fn: function () {
                                                    return [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }],
                                                                    staticClass: "img_bnv",
                                                                    attrs: { alt: t.kakaoi.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos, t.kakaoi.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ];
                                                },
                                                proxy: !0,
                                            },
                                        ]),
                                    }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "52a5f81e",
                        null
                    ).exports),
                d = {
                    name: "infoAbout",
                    props: { aboutThumbs: { type: Array, default: [] } },
                    data: function () {
                        return {
                            thumbInfos0: { 375: "540x758", 1440: "1228x1726", 1920: "1228x1726", 2560: "1228x1726" },
                            thumbInfos1: { 375: "390x456", 1440: "1042x1218", 1920: "1042x1218", 2560: "1042x1218" },
                            thumbInfos2: { 375: "568x410", 1440: "1164x840", 1920: "1164x840", 2560: "1164x840" },
                        };
                    },
                },
                h =
                    (a(317),
                    Object(o.a)(
                        d,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_about" },
                                [
                                    t.isMobile
                                        ? [
                                              t.aboutThumbs[0].image
                                                  ? a("div", { staticClass: "wrap_thumb ty_right" }, [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                    attrs: { alt: t.aboutThumbs[0].image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos0, t.aboutThumbs[0].image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ])
                                                  : t._e(),
                                              t._v(" "),
                                              t.aboutThumbs[1].image
                                                  ? a("div", { staticClass: "wrap_thumb" }, [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                    attrs: { alt: t.aboutThumbs[1].image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos1, t.aboutThumbs[1].image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ])
                                                  : t._e(),
                                              t._v(" "),
                                              t.aboutThumbs[2].image
                                                  ? a("div", { staticClass: "wrap_thumb ty_right" }, [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.screenType], expression: "thumbInfos2[screenType]" }],
                                                                    attrs: { alt: t.aboutThumbs[2].image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.thumbInfos2, t.aboutThumbs[2].image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ])
                                                  : t._e(),
                                          ]
                                        : [
                                              t.aboutThumbs[1].image
                                                  ? a("div", { staticClass: "inner_thumb" }, [
                                                        a("div", { staticClass: "wrap_thumb" }, [
                                                            a(
                                                                "img",
                                                                t._b(
                                                                    {
                                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                                        attrs: { alt: t.aboutThumbs[1].image.imgDescription },
                                                                    },
                                                                    "img",
                                                                    t.toThumb(t.thumbInfos1, t.aboutThumbs[1].image.url),
                                                                    !1
                                                                )
                                                            ),
                                                        ]),
                                                    ])
                                                  : t._e(),
                                              t._v(" "),
                                              a("div", { staticClass: "inner_thumb" }, [
                                                  t.aboutThumbs[0].image
                                                      ? a("div", { staticClass: "wrap_thumb ty_right" }, [
                                                            a(
                                                                "img",
                                                                t._b(
                                                                    {
                                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                                        attrs: { alt: t.aboutThumbs[0].image.imgDescription },
                                                                    },
                                                                    "img",
                                                                    t.toThumb(t.thumbInfos0, t.aboutThumbs[0].image.url),
                                                                    !1
                                                                )
                                                            ),
                                                        ])
                                                      : t._e(),
                                                  t._v(" "),
                                                  t.aboutThumbs[2].image
                                                      ? a("div", { staticClass: "wrap_thumb" }, [
                                                            a(
                                                                "img",
                                                                t._b(
                                                                    {
                                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.screenType], expression: "thumbInfos2[screenType]" }],
                                                                        attrs: { alt: t.aboutThumbs[2].image.imgDescription },
                                                                    },
                                                                    "img",
                                                                    t.toThumb(t.thumbInfos2, t.aboutThumbs[2].image.url),
                                                                    !1
                                                                )
                                                            ),
                                                        ])
                                                      : t._e(),
                                              ]),
                                          ],
                                ],
                                2
                            );
                        },
                        [],
                        !1,
                        null,
                        "a01bf9f2",
                        null
                    ).exports),
                v = {
                    name: "infoBrand",
                    props: { brands: { type: Array, default: [] } },
                    data: function () {
                        return { thumbInfos: { 375: "0x114", 1440: "0x128", 1920: "0x128", 2560: "0x128" } };
                    },
                },
                g =
                    (a(318),
                    Object(o.a)(
                        v,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_brand" }, [
                                a("h4", { staticClass: "tit_cont" }, [t._v("Brand marks")]),
                                t._v(" "),
                                a(
                                    "ul",
                                    { class: ["list_brand", { list_xscroll: t.isMobile, show_bar: t.isMobile }] },
                                    t._l(t.brands, function (e, i) {
                                        return a("li", { key: "mainIntro" + i }, [
                                            a("strong", { staticClass: "tit_item" }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }],
                                                            staticClass: "img_bnv",
                                                            attrs: { alt: e.image.imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.thumbInfos, e.image.url, "R"),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                        ]);
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "6fe3caa5",
                        null
                    ).exports),
                _ = {
                    data: function () {
                        return { alignAboutPositionY: 0, windowHeight: 0, isReachPoint: !1, alignCenterTop: 0, textPercent: 0, bgPercent: 0, startFadeInY: 250, fadeInDistance: 250, fadeDuration: "0.5s", translateX: 0 };
                    },
                    mounted: function () {
                        this.getPointInfos(), window.addEventListener("scroll", this.scrollTransition), window.addEventListener("resize", this.scrollTransition);
                    },
                    beforeDestroy: function () {
                        this.$store.dispatch("controlBodyClass", { controlClass: "theme_yellow", command: "remove" }), window.removeEventListener("scroll", this.scrollTransition), window.removeEventListener("resize", this.scrollTransition);
                    },
                    methods: {
                        getPointInfos: function () {
                            this.windowHeight = this.isMobile ? Math.max(document.documentElement.clientHeight, window.innerHeight, this.windowHeight || 0) : window.innerHeight;
                            var t = this.$refs.about,
                                e = t.getBoundingClientRect(),
                                a = e.top,
                                i = e.bottom,
                                s = t.lastChild.getBoundingClientRect().height;
                            (this.alignCenterTop = (this.windowHeight - s) / 2), (this.startPointY = window.pageYOffset + a - this.alignCenterTop), (this.endPointY = window.pageYOffset + i - this.windowHeight / 2 - 60);
                        },
                        scrollTransition: function (t) {
                            this.getPointInfos();
                            var e = window.pageYOffset,
                                a = e >= this.startPointY,
                                i = e <= this.endPointY;
                            this.isReachPoint = a && i;
                            var s = e >= this.startPointY - this.startFadeInY,
                                n = e <= this.startPointY - this.startFadeInY + this.fadeInDistance;
                            if (s && n) {
                                var r = (e - (this.startPointY - this.startFadeInY)) / this.fadeInDistance;
                                this.textPercent = r;
                            } else this.textPercent = 0;
                            if (this.isReachPoint) {
                                var o = this.isMobile ? 600 : 1e3,
                                    c = this.isMobile ? 600 : 900,
                                    l = e - (this.startPointY + o),
                                    m = e - (this.endPointY - c);
                                if (l <= 0) {
                                    this.startPointY;
                                    (this.textPercent = 1), (this.fadeDuration = "0.5s"), (this.bgPercent = 1), this.moveToTextX(0);
                                } else if (m >= 0) {
                                    var u = this.endPointY - c,
                                        p = this.isMobile ? 100 : 300,
                                        d = (this.isMobile, 500),
                                        h = e - u,
                                        v = this.endPointY - u - p;
                                    this.endPointY;
                                    (this.textPercent = 1 - h / v), (this.bgPercent = 0), this.moveToTextX(1);
                                } else {
                                    (this.fadeDuration = "1s"), (this.textPercent = 1), (this.bgPercent = 1);
                                    var g = l / (l - m);
                                    this.moveToTextX(g);
                                }
                            } else this.bgPercent = 0;
                        },
                        moveToTextX: function (t) {
                            if (this.isMobile) {
                                var e = this.$refs.text,
                                    a = window.innerWidth + 49 - e.getBoundingClientRect().width,
                                    i = a * t;
                                this.translateX = i;
                            }
                        },
                    },
                },
                f =
                    (a(319),
                    {
                        components: {
                            transitionText: Object(o.a)(
                                _,
                                function () {
                                    var t = this,
                                        e = t.$createElement,
                                        a = t._self._c || e;
                                    return a("div", { ref: "about", class: ["info_effect", { effect_sticky: t.isReachPoint }] }, [
                                        a("span", { staticClass: "bg_frame", style: { opacity: t.bgPercent, transitionDuration: t.fadeDuration } }),
                                        t._v(" "),
                                        a(
                                            "div",
                                            {
                                                directives: [{ name: "sticky", rawName: "v-sticky", value: { isAlwaysScript: !1 }, expression: "{isAlwaysScript: false}" }],
                                                staticClass: "inner_info",
                                                attrs: { "sticky-offset": "{top: " + t.alignCenterTop + ", bottom: 0}", "on-stick": "onStick", "sticky-z-index": "1", "sticky-side": "both" },
                                            },
                                            [a("strong", { ref: "text", style: { marginLeft: t.isMobile ? t.translateX + "px" : null, opacity: t.textPercent } }, [t._v("We are "), a("i"), t._v("everywhere")])]
                                        ),
                                    ]);
                                },
                                [],
                                !1,
                                null,
                                "8b4201c8",
                                null
                            ).exports,
                            infoVisual: c,
                            infoInside: m,
                            infoBNV: p,
                            infoAbout: h,
                            infoBrand: g,
                        },
                        asyncData: function (t) {
                            return Object(i.a)(
                                regeneratorRuntime.mark(function e() {
                                    var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b, C, y, x, k;
                                    return regeneratorRuntime.wrap(
                                        function (e) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        return (
                                                            (a = t.app),
                                                            (i = t.redirect),
                                                            (s = t.store),
                                                            (e.prev = 1),
                                                            (n = s.getters.deviceType),
                                                            (r = void 0 === n ? "pc" : n),
                                                            (e.next = 5),
                                                            a.$axios.$get("/api/kakaoi?deviceType=".concat(r))
                                                        );
                                                    case 5:
                                                        if (((o = e.sent), (c = o.data).constructor !== Object || 0 !== Object.keys(c).length)) {
                                                            e.next = 9;
                                                            break;
                                                        }
                                                        return e.abrupt("return", i(301, "/el?e=rnf"));
                                                    case 9:
                                                        return (
                                                            (l = o.data),
                                                            (m = l.banner),
                                                            (u = void 0 === m ? {} : m),
                                                            (p = l.intro),
                                                            (d = void 0 === p ? {} : p),
                                                            (h = l.ai),
                                                            (v = void 0 === h ? [] : h),
                                                            (g = l.kakaoi),
                                                            (_ = void 0 === g ? {} : g),
                                                            (f = l.inside),
                                                            (b = void 0 === f ? [] : f),
                                                            (C = l.brandMark),
                                                            (y = void 0 === C ? [] : C),
                                                            (x = l.partner),
                                                            (k = void 0 === x ? {} : x),
                                                            s.dispatch("setHeadings", { headings: { h2: "카카오 i", h3: "카카오 i 소개 페이지" } }),
                                                            s.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                                                            s.dispatch("addbanner", { banner: { type: "basic", data: Array.isArray(k) ? k : [k], tiaraLog: { name: "파트너배너_더보기클릭", layer: "partner_more" } } }),
                                                            s.dispatch("hasBanner", { hasBanner: !0 }),
                                                            e.abrupt("return", { mainBanner: u, intro: d, aboutThumbs: v, kakaoi: _, insides: b, brands: y })
                                                        );
                                                    case 17:
                                                        return (e.prev = 17), (e.t0 = e.catch(1)), e.abrupt("return", i(301, "/el?e=rnf"));
                                                    case 20:
                                                    case "end":
                                                        return e.stop();
                                                }
                                        },
                                        e,
                                        null,
                                        [[1, 17]]
                                    );
                                })
                            )();
                        },
                        created: function () {
                            this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                        },
                        mounted: function () {
                            this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "소개", section: "소개", custom_props: "" });
                        },
                    }),
                b =
                    (a(320),
                    Object(o.a)(
                        f,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "kakaoi_main" },
                                [
                                    t.mainBanner ? a("infoVisual", { attrs: { mainBanner: t.mainBanner } }) : t._e(),
                                    t._v(" "),
                                    a("div", { staticClass: "info_desc" }, [a("p", { staticClass: "desc_intro", domProps: { innerHTML: t._s(t.intro.description) } })]),
                                    t._v(" "),
                                    t.insides ? a("infoInside", { attrs: { insides: t.insides } }) : t._e(),
                                    t._v(" "),
                                    t.kakaoi ? a("infoBNV", { attrs: { kakaoi: t.kakaoi } }) : t._e(),
                                    t._v(" "),
                                    a("div", { staticClass: "info_desc" }, [a("p", { staticClass: "desc_about", domProps: { innerHTML: t._s(t.kakaoi.description) } })]),
                                    t._v(" "),
                                    a("transitionText"),
                                    t._v(" "),
                                    t.aboutThumbs ? a("infoAbout", { attrs: { aboutThumbs: t.aboutThumbs } }) : t._e(),
                                    t._v(" "),
                                    t.brands ? a("infoBrand", { attrs: { brands: t.brands } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "5a0e640c",
                        null
                    ));
            e.default = b.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = (a(28), a(4)),
                n = a(13),
                r = {
                    components: { Banner: s.a, IcoArrCircle: n.a },
                    name: "infoVisual",
                    props: { mainBanners: { type: Array, default: [] } },
                    data: function () {
                        return { thumbInfos: { 375: "750x1160", 1440: "2880x1728", 1920: "3840x2304", 2560: "5120x2304" }, activeIdx: 1 };
                    },
                    computed: {
                        nextItemEtc: function () {
                            var t = this;
                            return function (e) {
                                var a = e % t.mainBanners.length,
                                    i = t.mainBanners[a] || {},
                                    s = i.etc,
                                    n = i.title;
                                return s || (void 0 === n ? "" : n).replace(/\<br\/?\>/g, "");
                            };
                        },
                    },
                    methods: {
                        setActiveBNV: function (t) {
                            this.activeIdx = t;
                        },
                    },
                },
                o = (a(379), a(0)),
                c = Object(o.a)(
                    r,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a(
                            "div",
                            { staticClass: "info_visual" },
                            [
                                a("Banner", {
                                    attrs: { options: { slotSize: t.mainBanners.length, isBtnStatic: !1, isLoop: !0, alignItem: "left", type: "wide" } },
                                    on: { callback: t.setActiveBNV },
                                    scopedSlots: t._u(
                                        [
                                            t._l(t.mainBanners, function (e, i) {
                                                return {
                                                    key: "slot" + i,
                                                    fn: function () {
                                                        return [
                                                            a(
                                                                "div",
                                                                {
                                                                    key: "bnv" + i,
                                                                    staticClass: "link_item",
                                                                    style: "background: no-repeat center / cover url(https://t1.kakaocdn.net/thumb/C" + t.thumbInfos[t.screenType] + "/?fname=" + encodeURIComponent(e.image.url) + ")",
                                                                },
                                                                [
                                                                    a("div", { staticClass: "layer_cont" }, [
                                                                        a("div", { staticClass: "wrap_cont" }, [
                                                                            a("a", { staticClass: "link_more", attrs: { href: e.link.more || "javascript:;", "data-tiara-action-name": "상단배너_클릭", "data-tiara-layer": "top_banner" } }, [
                                                                                a("strong", { staticClass: "tit_bnv", domProps: { innerHTML: t._s(e.title) } }),
                                                                                t._v(" "),
                                                                                a("span", { staticClass: "more_bnv" }, [a("span", { domProps: { innerHTML: t._s(e.moreText) } }), a("IcoArrCircle")], 1),
                                                                            ]),
                                                                        ]),
                                                                    ]),
                                                                ]
                                                            ),
                                                        ];
                                                    },
                                                    proxy: !0,
                                                };
                                            }),
                                            {
                                                key: "controller",
                                                fn: function () {
                                                    return [
                                                        !t.isMobile && t.mainBanners.length > 1
                                                            ? a(
                                                                  "span",
                                                                  { staticClass: "wrap_more" },
                                                                  [
                                                                      a("span", { staticClass: "txt_next" }, [t._v("/ Next")]),
                                                                      t._v(" "),
                                                                      t._l(t.mainBanners, function (e, i) {
                                                                          return [
                                                                              a("transition", { key: "bnv" + i, attrs: { name: "fade" } }, [
                                                                                  a("span", {
                                                                                      directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i + 1, expression: "activeIdx === index + 1" }],
                                                                                      staticClass: "txt_etc",
                                                                                      domProps: { innerHTML: t._s(t.nextItemEtc(i + 1)) },
                                                                                  }),
                                                                              ]),
                                                                          ];
                                                                      }),
                                                                  ],
                                                                  2
                                                              )
                                                            : t._e(),
                                                    ];
                                                },
                                                proxy: !0,
                                            },
                                        ],
                                        null,
                                        !0
                                    ),
                                }),
                            ],
                            1
                        );
                    },
                    [],
                    !1,
                    null,
                    "9a559d38",
                    null
                ).exports,
                l = a(29),
                m = {
                    name: "info",
                    components: { Banner: s.a, VisualVideo: l.a },
                    props: { products: { type: Array, default: [] }, heykakao: { type: Array, default: [] } },
                    data: function () {
                        return {
                            thumbInfos0: { 375: "690x1120", 1440: "1830x1830", 1920: "1830x1830", 2560: "1830x1830" },
                            thumbInfos1: { 375: "690x1120", 1440: "3720x1920", 1920: "3720x1920", 2560: "3720x1920" },
                            tiaraLog: { name: "중앙배너_클릭", layer: "center_banner" },
                        };
                    },
                    computed: {
                        videoOption: function () {
                            var t = { playBtn: !0, wide: !1, autoPlay: !0, controlsBtn: { playBtn: !0, fullscreen: !0 }, haslayerList: !1, hasText: !1 };
                            return !0 === this.isMobile && (t = { playBtn: !0, wide: !1, autoPlay: !0, controlsBtn: { playBtn: !0, fullscreen: !0 }, haslayerList: !1, hasText: !1 }), t;
                        },
                    },
                },
                u =
                    (a(380),
                    Object(o.a)(
                        m,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "section",
                                { staticClass: "info_feature" },
                                [
                                    a("h4", { staticClass: "screen_out" }, [t._v("제품")]),
                                    t._v(" "),
                                    t.products
                                        ? a(
                                              "div",
                                              { staticClass: "cont_product" },
                                              t._l(t.products, function (e, i) {
                                                  return a(
                                                      "a",
                                                      {
                                                          key: "mainIntro" + i,
                                                          class: ["link_item", { single: "single" === e.image.type }],
                                                          style: { background: "url(" + t.toThumb(t.thumbInfos0, e.image.url)["data-src"] + ") 50% 50% /cover no-repeat" },
                                                          attrs: { href: e.link.more || "javascript:;", "data-tiara-action-name": "제품배너" + (i + 1) + "_클릭", "data-tiara-layer": "product" + (i + 1) + "_banner" },
                                                      },
                                                      [
                                                          a("div", { staticClass: "wrap_cont" }, [
                                                              a("em", { staticClass: "emph_tit", domProps: { innerHTML: t._s(e.title) } }),
                                                              t._v(" "),
                                                              a("strong", { staticClass: "tit_product", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                              t._v(" "),
                                                              e.moreText ? a("span", { staticClass: "txt_more", domProps: { innerHTML: t._s(e.moreText) } }) : t._e(),
                                                          ]),
                                                      ]
                                                  );
                                              }),
                                              0
                                          )
                                        : t._e(),
                                    t._v(" "),
                                    t.heykakao ? a("VisualVideo", { attrs: { videoData: [t.heykakao[0]], type: t.videoOption, thumbInfo: t.thumbInfos1, tiaraLog: t.tiaraLog } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "41d5021b",
                        null
                    ).exports),
                p =
                    (a(381),
                    {
                        name: "infoIntro",
                        components: {
                            IcoArrCircleL: Object(o.a)(
                                {},
                                function () {
                                    var t = this.$createElement,
                                        e = this._self._c || t;
                                    return e("span", { staticClass: "ico_more" }, [
                                        e("span", { staticClass: "ico_circle" }),
                                        this._v(" "),
                                        e("svg", { staticClass: "ico_arrow_l", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 18 14", fill: "none", opacity: ".9" } }, [e("use", { attrs: { "xlink:href": "#icoArrowL" } })]),
                                    ]);
                                },
                                [],
                                !1,
                                null,
                                "9946d3da",
                                null
                            ).exports,
                            IcoArrCircle: n.a,
                        },
                        props: { command: { type: Object, default: {} } },
                    }),
                d =
                    (a(382),
                    Object(o.a)(
                        p,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_intro" }, [
                                t._m(0),
                                t._v(" "),
                                a("a", { staticClass: "link_item", attrs: { href: t.command.link.more || "javascript:;", "data-tiara-action-name": "명령어더보기_클릭", "data-tiara-layer": "command_more" } }, [
                                    a("div", { staticClass: "wrap_cont" }, [
                                        a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.command.title) } }),
                                        t._v(" "),
                                        a(
                                            "span",
                                            { staticClass: "txt_more" },
                                            [a("span", { domProps: { innerHTML: t._s(t.command.moreText) } }), t.isMobile ? a("IcoArrCircle", { attrs: { isStatic: !0 } }) : a("IcoArrCircleL", { attrs: { isStatic: !0 } })],
                                            1
                                        ),
                                    ]),
                                    t._v(" "),
                                    a("div", { staticClass: "wrap_command" }, [a("em", { staticClass: "emph_command" }, [t._v("“"), a("span", { domProps: { innerHTML: t._s(t.command.subTitle) } })])]),
                                ]),
                            ]);
                        },
                        [
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("div", { staticClass: "wrap_tit" }, [e("h4", { staticClass: "tit_cont" }, [this._v("다양한 명령어")])]);
                            },
                        ],
                        !1,
                        null,
                        "7165d38c",
                        null
                    ).exports),
                h = {
                    name: "infoInside",
                    components: {
                        IcoMore: Object(o.a)(
                            {},
                            function () {
                                var t = this.$createElement,
                                    e = this._self._c || t;
                                return e("svg", { staticClass: "ico_more", attrs: { viewBox: "0 0 7 12", xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "#999", "stroke-width": "1.5" } }, [
                                    e("use", { attrs: { "xlink:href": "#icoMore" } }),
                                ]);
                            },
                            [],
                            !1,
                            null,
                            null,
                            null
                        ).exports,
                    },
                    props: { insides: { type: Array, default: [] } },
                    data: function () {
                        return { thumbInfos: { 375: "690x442", 1440: "1200x772", 1920: "1200x772", 2560: "1200x772" } };
                    },
                },
                v =
                    (a(383),
                    {
                        components: {
                            infoVisual: c,
                            infoFeature: u,
                            infoIntro: d,
                            infoInside: Object(o.a)(
                                h,
                                function () {
                                    var t = this,
                                        e = t.$createElement,
                                        a = t._self._c || e;
                                    return a("section", { staticClass: "info_inside" }, [
                                        a(
                                            "div",
                                            { staticClass: "wrap_tit" },
                                            [
                                                a("h4", { staticClass: "tit_cont" }, [t._v("우리가 함께 만드는 가치")]),
                                                t._v(" "),
                                                a(
                                                    "router-link",
                                                    { staticClass: "link_more", attrs: { to: "/partner", "data-tiara-action-name": "파트너더보기_클릭", "data-tiara-layer": "partner_more" } },
                                                    [t._v("더 알아보기"), a("IcoMore")],
                                                    1
                                                ),
                                            ],
                                            1
                                        ),
                                        t._v(" "),
                                        a(
                                            "ul",
                                            { staticClass: "list_inside" },
                                            t._l(t.insides, function (e, i) {
                                                return a(
                                                    "li",
                                                    { key: "mainIntro" + i },
                                                    [
                                                        a(
                                                            "router-link",
                                                            {
                                                                staticClass: "link_item",
                                                                attrs: {
                                                                    to: "/partner" + [e.relatedCode ? "/" + e.relatedCode : ""],
                                                                    "data-tiara-action-name": "파트너제품" + (i + 1) + "_클릭",
                                                                    "data-tiara-layer": "partner_banner" + (i + 1),
                                                                },
                                                            },
                                                            [
                                                                a("div", { staticClass: "wrap_thumb" }, [
                                                                    a(
                                                                        "img",
                                                                        t._b(
                                                                            {
                                                                                directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos[t.screenType], expression: "thumbInfos[screenType]" }],
                                                                                attrs: { alt: e.image.imgDescription },
                                                                            },
                                                                            "img",
                                                                            t.toThumb(t.thumbInfos, e.image.url),
                                                                            !1
                                                                        )
                                                                    ),
                                                                    t._v(" "),
                                                                    e.title ? a("span", { staticClass: "txt_thumb", domProps: { innerHTML: t._s(e.title) } }) : t._e(),
                                                                ]),
                                                                t._v(" "),
                                                                a("div", { staticClass: "wrap_cont" }, [
                                                                    a("strong", { staticClass: "tit_inside", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                                    t._v(" "),
                                                                    a("p", { staticClass: "desc_inside", domProps: { innerHTML: t._s(e.description) } }),
                                                                ]),
                                                            ]
                                                        ),
                                                    ],
                                                    1
                                                );
                                            }),
                                            0
                                        ),
                                    ]);
                                },
                                [],
                                !1,
                                null,
                                "4a14fbe8",
                                null
                            ).exports,
                        },
                        asyncData: function (t) {
                            return Object(i.a)(
                                regeneratorRuntime.mark(function e() {
                                    var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b;
                                    return regeneratorRuntime.wrap(
                                        function (e) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        return (
                                                            (a = t.app),
                                                            (i = t.redirect),
                                                            (s = t.store),
                                                            (e.prev = 1),
                                                            (n = s.getters.deviceType),
                                                            (r = void 0 === n ? "pc" : n),
                                                            (e.next = 5),
                                                            a.$axios.$get("/api/home?deviceType=".concat(r))
                                                        );
                                                    case 5:
                                                        if (((o = e.sent), (c = o.data).constructor !== Object || 0 !== Object.keys(c).length)) {
                                                            e.next = 9;
                                                            break;
                                                        }
                                                        return e.abrupt("return", i(301, "/el?e=rnf"));
                                                    case 9:
                                                        return (
                                                            (l = o.data),
                                                            (m = l.banner),
                                                            (u = void 0 === m ? [] : m),
                                                            (p = l.product),
                                                            (d = void 0 === p ? [] : p),
                                                            (h = l.command),
                                                            (v = void 0 === h ? {} : h),
                                                            (g = l.insides),
                                                            (_ = void 0 === g ? [] : g),
                                                            (f = l.heykakao),
                                                            (b = void 0 === f ? [] : f),
                                                            s.dispatch("controlBodyClass", { controlClass: "ty_home", command: "add" }),
                                                            s.dispatch("setHeadings", { headings: { h2: "카카오 i", h3: "카카오 i 메인 페이지" } }),
                                                            s.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                                                            s.dispatch("hasBanner", { hasBanner: !1 }),
                                                            e.abrupt("return", { mainBanners: u, products: d, command: v, insides: _, heykakao: b })
                                                        );
                                                    case 17:
                                                        return (e.prev = 17), (e.t0 = e.catch(1)), e.abrupt("return", i(301, "/el?e=rnf"));
                                                    case 20:
                                                    case "end":
                                                        return e.stop();
                                                }
                                        },
                                        e,
                                        null,
                                        [[1, 17]]
                                    );
                                })
                            )();
                        },
                        created: function () {
                            this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                        },
                        mounted: function () {
                            this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "홈", section: "홈", custom_props: "" });
                        },
                        beforeDestroy: function () {
                            this.$store.dispatch("controlBodyClass", { controlClass: "ty_home", command: "remove" });
                        },
                    }),
                g =
                    (a(384),
                    Object(o.a)(
                        v,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "home_main" },
                                [
                                    t.mainBanners ? a("infoVisual", { attrs: { mainBanners: t.mainBanners } }) : t._e(),
                                    t._v(" "),
                                    t.heykakao || t.products ? a("infoFeature", { attrs: { heykakao: t.heykakao, products: t.products } }) : t._e(),
                                    t._v(" "),
                                    t.command ? a("infoIntro", { attrs: { command: t.command } }) : t._e(),
                                    t._v(" "),
                                    t.insides ? a("infoInside", { attrs: { insides: t.insides } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "35830087",
                        null
                    ));
            e.default = g.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            var i = a(30),
                s = a(31),
                n = {
                    components: { Parallax: a(25).a },
                    props: ["assembleData"],
                    name: "infoAssemble",
                    computed: {
                        offsetX: function () {
                            return this.isMobile ? 150 : 300;
                        },
                        speedSet: function () {
                            var t = 1;
                            return this.isMobile || ((t = 1.3), 2560 === this.screenType ? (t = 1.8) : 1440 === this.screenType && (t = 1)), t;
                        },
                    },
                },
                r = (a(360), a(0)),
                o = Object(r.a)(
                    n,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { staticClass: "info_assemble" }, [
                            a("div", { staticClass: "cont_assemble" }, [
                                a("div", { staticClass: "wrap_cont" }, [
                                    a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.assembleData.title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.assembleData.description) } }),
                                ]),
                                t._v(" "),
                                a("div", { ref: "thumb", staticClass: "wrap_thumb" }, [
                                    a(
                                        "div",
                                        { staticClass: "thumb_parallax" },
                                        [
                                            a("Parallax", { staticClass: "parts1", attrs: { speedFactor: t.speedSet, direction: "right", availableOffset: t.offsetX } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[0].thumbInfos[t.screenType], expression: "assembleData.images[0].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[0].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[0].thumbInfos, t.assembleData.images[0].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts2", attrs: { speedFactor: t.speedSet, direction: "right", availableOffset: 0 } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[1].thumbInfos[t.screenType], expression: "assembleData.images[1].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[1].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[1].thumbInfos, t.assembleData.images[1].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts3", attrs: { speedFactor: t.speedSet, direction: "left", availableOffset: t.offsetX } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[2].thumbInfos[t.screenType], expression: "assembleData.images[2].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[2].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[2].thumbInfos, t.assembleData.images[2].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                        ],
                                        1
                                    ),
                                ]),
                            ]),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "d9fefe24",
                    null
                ).exports,
                c = {
                    props: { insideDatas: { type: Array, default: [] } },
                    name: "infoInside",
                    data: function () {
                        return { thumbInfos1: { 375: "690x728", 1440: "1226x1294", 1920: "1226x1294", 2560: "1226x1294" } };
                    },
                },
                l =
                    (a(361),
                    Object(r.a)(
                        c,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_inside" },
                                t._l(t.insideDatas, function (e, i) {
                                    return a("div", { key: "feature" + i, class: "cont_feature ty_" + e.type }, [
                                        a("div", { staticClass: "wrap_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                        ]),
                                        t._v(" "),
                                        a("div", { staticClass: "wrap_thumb" }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                        staticClass: "img_bnv",
                                                        attrs: { alt: e.image.imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos1, e.image.url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ]);
                                }),
                                0
                            );
                        },
                        [],
                        !1,
                        null,
                        "11d9d527",
                        null
                    ).exports),
                m = {
                    props: { featureData: { type: Object, default: {} } },
                    data: function () {
                        return { thumbInfos: { 375: "750x1280", 1440: "2880x1620", 1920: "3840x2160", 2560: "5120x2800" } };
                    },
                },
                u =
                    (a(362),
                    Object(r.a)(
                        m,
                        function () {
                            var t = this.$createElement,
                                e = this._self._c || t;
                            return e("div", { staticClass: "info_feature" }, [
                                e(
                                    "img",
                                    this._b(
                                        {
                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: this.thumbInfos[this.screenType], expression: "thumbInfos[screenType]" }],
                                            staticClass: "img_bnv",
                                            attrs: { alt: this.featureData.image.imgDescription },
                                        },
                                        "img",
                                        this.toThumb(this.thumbInfos, this.featureData.image.url),
                                        !1
                                    )
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "5899145a",
                        null
                    ).exports),
                p = { props: { type: { type: String, default: "single" } } },
                d =
                    (a(363),
                    {
                        components: {
                            IcoCircle: Object(r.a)(
                                p,
                                function () {
                                    var t = this.$createElement,
                                        e = this._self._c || t;
                                    return "single" === this.type
                                        ? e("svg", { staticClass: "ico_circle_s", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20" } }, [e("use", { attrs: { "xlink:href": "#icoCircleS" } })])
                                        : e("svg", { staticClass: "ico_circle_d", attrs: { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 33 22", fill: "#D8D8D8" } }, [e("use", { attrs: { "xlink:href": "#icoCircleD" } })]);
                                },
                                [],
                                !1,
                                null,
                                "b71691cc",
                                null
                            ).exports,
                        },
                        props: { usageDatas: { type: Array, default: [] } },
                        name: "infoInside",
                        data: function () {
                            return { thumbInfos1: { 375: "690x728", 1440: "1226x1294", 1920: "1226x1294", 2560: "1226x1294" } };
                        },
                    }),
                h =
                    (a(364),
                    Object(r.a)(
                        d,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "info_usage" },
                                t._l(t.usageDatas, function (e, i) {
                                    return a("div", { key: "feature" + i, class: "cont_feature ty_" + e.type }, [
                                        a("div", { staticClass: "wrap_cont" }, [
                                            a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                            t._v(" "),
                                            a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                            t._v(" "),
                                            e.usages
                                                ? a(
                                                      "ul",
                                                      { staticClass: "list_usage" },
                                                      t._l(e.usages, function (e, i) {
                                                          return a("li", { key: i }, [a("IcoCircle", { attrs: { type: e.type } }), t._v(" "), a("span", { staticClass: "txt_usage", domProps: { innerHTML: t._s(e.text) } })], 1);
                                                      }),
                                                      0
                                                  )
                                                : t._e(),
                                        ]),
                                        t._v(" "),
                                        a("div", { staticClass: "wrap_thumb" }, [
                                            a(
                                                "img",
                                                t._b(
                                                    {
                                                        directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                        staticClass: "img_bnv",
                                                        attrs: { alt: e.image.imgDescription },
                                                    },
                                                    "img",
                                                    t.toThumb(t.thumbInfos1, e.image.url),
                                                    !1
                                                )
                                            ),
                                        ]),
                                    ]);
                                }),
                                0
                            );
                        },
                        [],
                        !1,
                        null,
                        "059bc9af",
                        null
                    ).exports),
                v = a(60),
                g = a(24),
                _ = a(33),
                f = {
                    components: { productBanner: i.a, vodInfo: s.a, AppBNV: g.a, BottomBNV: _.a, infoAssemble: o, infoInside: l, infoFeature: u, infoUsage: h, infoSpecs: v.a },
                    asyncData: function (t) {
                        var e = t.store,
                            a = e.getters.deviceType,
                            i = void 0 === a ? "pc" : a;
                        return (
                            e.dispatch("setHeadings", { headings: { h2: "제품", h3: "Mini Link" } }),
                            e.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                            e.dispatch("hasBanner", { hasBanner: !1 }),
                            {
                                bottomThumbInfo: { 375: "752x800", 1440: "3840x1920", 1920: "3840x1920", 2560: "3840x1920" },
                                visualData: {
                                    title: '내 손안의 <i class="line_mo"></i>스마트한 친구<i class="line_mo line_pc"></i>미니링크',
                                    store: {
                                        text: "미니링크 구매하기",
                                        url: "https://gift-talk.kakao.com/appredirect?to=https%253A%252F%252Fgift.kakao.com%252Fpage%252F2126&input_channel_id=2717",
                                        tiaraLog: { name: "미니링크_구매클릭", layer: "purchase_minilink_btn" },
                                    },
                                    scrollText: "More About <em>Mini Link</em>",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_visual.jpg"),
                                },
                                introData: {
                                    title: "휴대용 AI 기기",
                                    desc:
                                        '휴대성이 대폭 강화된 음성비서 미니링크를 소개합니다.<i class="line_pc"></i> 미니멀한 사이즈에, 콤팩트한 디자인으로 언제 어디서나 누구나 <i class="line_pc"></i>쉽게 사용할 수 있어요. Bluetooth Low Energy 기술을 사용해 <i class="line_pc"></i>한번 충전하면 5일 이상 사용이 가능하답니다.',
                                    thumbInfo: { 375: "690x412", 1440: "3200x1912", 1920: "3200x1912", 2560: "3200x1912" },
                                    vodData: [
                                        {
                                            image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_video.jpg?v=200902"), imgDescription: "" },
                                            video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/vod_promotion.mp4",
                                            etc: "Promotional Video",
                                        },
                                    ],
                                },
                                assembleData: {
                                    title: '당신과 헤이카카오<i class="line_mo"></i> 사이<i class="line_pc"></i> 늘 링크될 준비가 되어 있어요',
                                    description:
                                        '미니링크를 핸드폰과 블루투스로 연결하고 헤이카카오 앱의 기기 관리에서 미니링크를 추가해주세요.<i class="line_pc"></i> 휴대폰과 멀어져서 신호가 끊어져도, 가까이 오면 언제든 다시 자동으로 헤이카카오에 링크됩니다.',
                                    images: [
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_parts1.png?v=200902"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "460x682", 1440: "910x1354", 1920: "910x1354", 2560: "910x1354" },
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_parts2.png?v=200902"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "442x646", 1440: "874x1282", 1920: "874x1282", 2560: "874x1282" },
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_parts3.png?v=200902"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "454x642", 1440: "900x1274", 1920: "900x1274", 2560: "900x1274" },
                                        },
                                    ],
                                },
                                insideDatas: [
                                    {
                                        type: "left",
                                        title: "목소리가 아니어도<br>깨울 수 있어요",
                                        description: "헤이카카오를 부르고 싶을 땐, 미니링크의 가운데 호출 버튼을 눌러주세요. 호출 버튼을 누르는 순간 미니링크는 헤이카카오에 링크되어 당신의 말을 전달할 준비가 된답니다.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_mix_01.jpg?v=200902"), imgDescription: "" },
                                    },
                                    {
                                        type: "right",
                                        title: "통화하기 힘들 때,<br>음성으로 전화 걸기",
                                        description:
                                            "지금까지 걸려오는 전화를 스피커 폰으로 받고 싶을 때 어떻게 하셨나요? 이제 미니링크 호출 버튼으로 원클릭 통화를 해보세요. 운전 중이라면 더 안전하고 편할 거에요. 물론 전화 걸기도 가능합니다.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_mix_02.jpg?v=200902"), imgDescription: "" },
                                    },
                                ],
                                usageDatas: [
                                    {
                                        type: "left",
                                        title: "카카오톡 버튼으로<br>더 편하게 사용하세요",
                                        description:
                                            "카카오톡 전용 버튼을 눌러보세요. 연결된 블루투스 이어폰이나 스피커를 통해서도 새로운 메시지를 듣고, 자유롭게 음성으로 메시지를 보낼 수 있답니다. 늘 연락하는 사람은 대표 친구로 지정해주세요. 바로 연결해드릴게요.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_mix_03.jpg?v=200902"), imgDescription: "" },
                                        usages: [
                                            { type: "single", text: "카카오톡 읽기" },
                                            { type: "double", text: "카카오톡 답장" },
                                        ],
                                    },
                                    {
                                        type: "right",
                                        title: "음악이 필요할 땐, <br>출력 전환으로 재생",
                                        description:
                                            "미니링크의 출력 전환 기능을 통해 차 안에서, 이어폰에서, 블루투스 스피커에서, 장소에 맞게 음악을 들어보는 것은 어떨까요? 멜론 음악뿐 아니라 거의 모든 채널의 FM 라디오,  팟캐스트, 야구중계도 들을 수 있어요.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_mix_04.jpg?v=200902"), imgDescription: "" },
                                    },
                                    {
                                        type: "left",
                                        title: "필요한 곳에 <br>부착해서 사용해요",
                                        description:
                                            "본 제품에는 마그네틱 트레이와 차량용 클립이 들어있어 필요한 곳에 부착해 사용할 수 있어요. 철제로 된 곳에 부착 가능한 트레이와 대부분의 차량에서 설치 가능한 클립으로 더 편리하게 사용하세요.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_mix_05.jpg?v=200902"), imgDescription: "" },
                                    },
                                ],
                                specDatas: [
                                    {
                                        title: "Mini Link 스펙",
                                        isOn: !0,
                                        items: [
                                            { title: "제품명", cont: "미니 링크 / Mini Link" },
                                            { title: "모델명", cont: "KE-L100" },
                                            { title: "스피커", cont: "1W 내장용 마이크로 스피커" },
                                            { title: "마이크", cont: "2채널 고성능 내장 마이크" },
                                            { title: "크기 / 무게", cont: "43x65x15mm" },
                                            { title: "색상 / 재질", cont: "Gray, Plastic (ABS)" },
                                            { title: "KC인증 필유무", cont: "R-R-KXA-KEL100 / 특정소출력무선기기" },
                                            { title: "블루투스", cont: "Bluetooth 5.0" },
                                            { title: "배터리", cont: "300mAh 배터리" },
                                            { title: "충전사양", cont: "일반 충전기 사용 (5.0V, 2.0A) 및 USB 2.0 (5.0V, 500mAh) 가능" },
                                            { title: "품질보증기준", cont: "무상 1년" },
                                            { title: "A/S책임자", cont: "(주)가온미디어" },
                                        ],
                                    },
                                ],
                                featureData: { image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_feature.jpg?v=200902"), imgDescription: "" } },
                                nextProduct: {
                                    title: '더 작고 똑똑한 <i class="line_mo"></i>스마트 스피커<br>미니헥사',
                                    image: { background: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minihexa/".concat(i, "/img_next.jpg?v=200902") },
                                    about: { link: "/product/minihexa", text: "More About <em>‘Mini Hexa’</em>" },
                                },
                                bannerData: {
                                    title: '헤이카카오 앱을 다운받고 <i class="line_mo"></i>미니링크와 연결해보세요.',
                                    description: '미니링크는 헤이카카오 앱 Android 버전과의 연결을 지원합니다. <i class="line_mo"></i>iOS 버전과의 연결은 추후 지원 예정입니다.',
                                    moreText: "헤이카카오",
                                    image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/minilink/".concat(i, "/img_app.png?v=200902"), imgDescription: "" },
                                    link: { googlePlay: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.kakao.i.connect" },
                                },
                            }
                        );
                    },
                    data: function () {
                        return { bannerHeight: 0 };
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$refs.topBanner.$el.clientHeight && (this.bannerHeight = this.$refs.topBanner.$el.clientHeight),
                            this.$store.dispatch("setStoreBtn", { productBannerHeight: this.bannerHeight }),
                            Tiara.trackPageView({ page: "미니링크", section: "제품", custom_props: "" });
                    },
                },
                b =
                    (a(365),
                    Object(r.a)(
                        f,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "product_minilink" },
                                [
                                    a("productBanner", { ref: "topBanner", attrs: { visualData: t.visualData } }),
                                    t._v(" "),
                                    a("vodInfo", { attrs: { introData: t.introData } }),
                                    t._v(" "),
                                    a("infoAssemble", { attrs: { assembleData: t.assembleData } }),
                                    t._v(" "),
                                    a("infoInside", { attrs: { insideDatas: t.insideDatas } }),
                                    t._v(" "),
                                    a("infoFeature", { attrs: { featureData: t.featureData } }),
                                    t._v(" "),
                                    a("infoUsage", { attrs: { usageDatas: t.usageDatas } }),
                                    t._v(" "),
                                    a("infoSpecs", { attrs: { specDatas: t.specDatas } }),
                                    t._v(" "),
                                    a("AppBNV", { attrs: { bannerData: t.bannerData, bannerLog: { name: "제품_앱다운로드_클릭", layer: "product_app_download" } } }),
                                    t._v(" "),
                                    a("BottomBNV", { attrs: { nextProduct: t.nextProduct, thumbInfos0: t.bottomThumbInfo } }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "649d4c1b",
                        null
                    ));
            e.default = b.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = {
                    props: ["type", "categoryData", "introData"],
                    computed: {
                        iconInfo: function () {
                            var t = { 375: "64x64", 1440: "80x80", 1920: "80x80", 2560: "80x80" };
                            return "b" === this.type && (t = { 375: "64x64", 1440: "64x64", 1920: "64x64", 2560: "64x64" }), t;
                        },
                        thumbInfo: function () {
                            var t = { 375: "750x1270", 1440: "1778x862", 1920: "1778x862", 2560: "1778x862" };
                            return "b" === this.type && (t = { 375: "750x800", 1440: "1778x504", 1920: "1778x504", 2560: "1778x504" }), t;
                        },
                    },
                },
                n = (a(374), a(0)),
                r = Object(n.a)(
                    s,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return "c" !== t.type
                            ? a("section", { staticClass: "info_visual" }, [
                                  a("h4", { staticClass: "screen_out" }, [t._v(t._s(t.categoryData.categoryParentName) + " - " + t._s(t.introData.title))]),
                                  t._v(" "),
                                  a("div", { staticClass: "txt_visual" }, [
                                      a("div", { staticClass: "guide_command" }, [
                                          a(
                                              "img",
                                              t._b(
                                                  { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.iconInfo[t.screenType], expression: "iconInfo[screenType]" }], staticClass: "img_type", attrs: { alt: "" } },
                                                  "img",
                                                  t.toThumb(t.iconInfo, t.categoryData.categoryIcon, "C", !1),
                                                  !1
                                              )
                                          ),
                                          a("span", { domProps: { innerHTML: t._s(t.introData.title) } }),
                                      ]),
                                      t._v(" "),
                                      a("strong", { staticClass: "tit_command", domProps: { innerHTML: t._s(t.introData.subTitle) } }),
                                  ]),
                                  t._v(" "),
                                  a("div", { staticClass: "wrap_thumb" }, [
                                      a(
                                          "img",
                                          t._b(
                                              {
                                                  directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }],
                                                  staticClass: "img_command",
                                                  attrs: { alt: t.introData.image.description },
                                              },
                                              "img",
                                              t.toThumb(t.thumbInfo, t.introData.image.url),
                                              !1
                                          )
                                      ),
                                  ]),
                              ])
                            : a("section", { staticClass: "info_visual" }, [
                                  a("h4", { staticClass: "screen_out" }, [t._v(t._s(t.categoryData.categoryParentName))]),
                                  t._v(" "),
                                  a("div", { staticClass: "txt_visual" }, [a("strong", { staticClass: "tit_command", domProps: { innerHTML: t._s(t.introData.title) } })]),
                              ]);
                    },
                    [],
                    !1,
                    null,
                    "8d9cadbc",
                    null
                ).exports,
                o = a(174),
                c = {
                    props: ["motionData"],
                    components: { commonVideo: a(29).a },
                    data: function () {
                        return { thumbInfo: { 375: "860x860", 1440: "860x860", 1920: "860x860", 2560: "860x860" }, videoData: [{ image: { type: "SINGLE", url: this.motionData.pcImage, imgDescription: "" }, video: this.motionData.video }] };
                    },
                    computed: {
                        videoType: function () {
                            var t = { playBtn: !0, wide: !1, replayBtn: "bottom", autoPlay: !0, controlsBtn: { playBtn: !1, fullscreen: !1, sounds: !1 }, haslayerList: !1, hasText: !1 };
                            return this.isMobile && (t = { playBtn: !0, wide: !1, replayBtn: "top", autoPlay: !0, controlsBtn: { playBtn: !1, fullscreen: !1, sounds: !1 }, haslayerList: !1, hasText: !1 }), t;
                        },
                    },
                },
                l =
                    (a(375),
                    Object(n.a)(
                        c,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_video" }, [
                                a("div", { staticClass: "vod_summary" }, [
                                    t.motionData.title ? a("h4", { staticClass: "guide_command", domProps: { innerHTML: t._s(t.motionData.title) } }) : t._e(),
                                    t._v(" "),
                                    a("strong", { staticClass: "txt_command", domProps: { innerHTML: t._s(t.motionData.subTitle) } }),
                                    t._v(" "),
                                    t.motionData.description ? a("p", { staticClass: "desc_command", domProps: { innerHTML: t._s(t.motionData.description) } }) : t._e(),
                                ]),
                                t._v(" "),
                                a("div", { staticClass: "vod_command" }, [a("commonVideo", { attrs: { videoData: t.motionData.video, type: t.videoType, thumbInfo: t.thumbInfo, thumbType: "C" } })], 1),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "49c48f5e",
                        null
                    ).exports),
                m = {
                    props: ["type", "commandList"],
                    data: function () {
                        return { tempData: [1, 2, 3, 4], isListOpen: [], thumbInfo: { 375: "144x144", 1440: "144x144", 1920: "144x144", 2560: "144x144" } };
                    },
                    mounted: function () {
                        var t = this;
                        this.tempData.forEach(function (e) {
                            t.isListOpen.push(!1);
                        });
                    },
                    computed: {
                        btnToggle: function () {
                            var t = this;
                            return function (e) {
                                return t.isListOpen[e] ? "열기" : "닫기";
                            };
                        },
                    },
                    methods: {
                        toggleList: function (t) {
                            this.$set(this.isListOpen, t, !this.isListOpen[t]);
                        },
                    },
                },
                u =
                    (a(376),
                    Object(n.a)(
                        m,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return "c" !== t.type
                                ? a("section", { staticClass: "info_command" }, [
                                      a("h4", { staticClass: "screen_out" }, [t._v("명령어 리스트")]),
                                      t._v(" "),
                                      a(
                                          "dl",
                                          t._l(t.commandList, function (e, i) {
                                              return a(
                                                  "div",
                                                  { key: "command" + i, staticClass: "type_command" },
                                                  [
                                                      a("dt", { domProps: { innerHTML: t._s(e.title) } }),
                                                      t._v(" "),
                                                      t._l(e.recommendations, function (e, i) {
                                                          return a("dd", { key: "recommand" + i, domProps: { innerHTML: t._s(e.message) } });
                                                      }),
                                                  ],
                                                  2
                                              );
                                          }),
                                          0
                                      ),
                                  ])
                                : a(
                                      "section",
                                      { staticClass: "info_command type_c" },
                                      [
                                          a("h4", { staticClass: "screen_out" }, [t._v("명령어 리스트")]),
                                          t._v(" "),
                                          t._l(t.commandList, function (e, i) {
                                              return a("div", { key: "command" + i, staticClass: "box_command" }, [
                                                  a("div", { staticClass: "type_box" }, [
                                                      e.imageUrl
                                                          ? a("span", { staticClass: "wrap_thumb" }, [
                                                                a(
                                                                    "img",
                                                                    t._b(
                                                                        { directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfo[t.screenType], expression: "thumbInfo[screenType]" }], attrs: { alt: "" } },
                                                                        "img",
                                                                        t.toThumb(t.thumbInfo, e.imageUrl),
                                                                        !1
                                                                    )
                                                                ),
                                                            ])
                                                          : t._e(),
                                                      t._v(" "),
                                                      a("div", { staticClass: "txt_type" }, [
                                                          a("em", { staticClass: "emph_category", domProps: { innerHTML: t._s(e.title) } }),
                                                          t._v(" "),
                                                          a("strong", { staticClass: "tit_main", domProps: { innerHTML: t._s(e.usages[0]) } }),
                                                      ]),
                                                  ]),
                                                  t._v(" "),
                                                  e.description ? a("p", { staticClass: "desc_category", domProps: { innerHTML: t._s(e.description) } }) : t._e(),
                                                  t._v(" "),
                                                  a("strong", { class: ["tit_use", { open: t.isListOpen.length > 0 && t.isListOpen[i] }] }, [
                                                      t._v("사용방법\n      "),
                                                      t.isMobile
                                                          ? a(
                                                                "button",
                                                                {
                                                                    staticClass: "btn_toggle screen_out",
                                                                    attrs: { type: "button" },
                                                                    on: {
                                                                        click: function (e) {
                                                                            return t.toggleList(i);
                                                                        },
                                                                    },
                                                                },
                                                                [t._v(t._s(t.btnToggle(i)))]
                                                            )
                                                          : t._e(),
                                                  ]),
                                                  t._v(" "),
                                                  a(
                                                      "ul",
                                                      { staticClass: "list_use" },
                                                      t._l(e.usages, function (e, i) {
                                                          return a("li", { key: "recommand" + i, domProps: { innerHTML: t._s(e) } });
                                                      }),
                                                      0
                                                  ),
                                              ]);
                                          }),
                                      ],
                                      2
                                  );
                        },
                        [],
                        !1,
                        null,
                        "40a19e68",
                        null
                    ).exports),
                p = {
                    props: ["similarCommand"],
                    data: function () {
                        return { thumbInfo: { 375: "628x282", 1440: "858x322", 1920: "858x322", 2560: "858x322" } };
                    },
                    computed: {
                        bgImgCheck: function () {
                            var t = this;
                            return function (e) {
                                var a = { background: "#333" };
                                return void 0 !== e && (a = { background: "url(".concat(t.toThumb(t.thumbInfo, e)["data-src"], ") 50% 50% /cover no-repeat") }), a;
                            };
                        },
                        urlPathCheck: function () {
                            return function (t) {
                                return t ? "/".concat(t) : "";
                            };
                        },
                    },
                },
                d =
                    (a(377),
                    Object(n.a)(
                        p,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("section", { staticClass: "info_similar" }, [
                                a("h4", { staticClass: "guide_command" }, [t._v("다른 명령어")]),
                                t._v(" "),
                                a(
                                    "ul",
                                    { class: ["list_similar", t.isMobile ? "list_xscroll" : ""], attrs: { "data-tiara-layer": "bottom" } },
                                    t._l(t.similarCommand, function (e, i) {
                                        return a(
                                            "li",
                                            { key: "commandItem" + i },
                                            [
                                                a("span", { staticClass: "bg_similar", style: [t.bgImgCheck((e.image || {}).url || "")] }),
                                                t._v(" "),
                                                a(
                                                    "router-link",
                                                    {
                                                        staticClass: "link_similar",
                                                        attrs: {
                                                            to: e.commandCategory ? "/service" + t.urlPathCheck(e.commandCategory.categoryParentCode) + t.urlPathCheck(e.commandCategory.code) : "/service",
                                                            "data-tiara-action-name": "서비스상세_비슷한명령어_클릭",
                                                            "data-tiara-layer": "another_service",
                                                        },
                                                    },
                                                    [
                                                        a("span", { staticClass: "type_similar", domProps: { innerHTML: t._s(e.title) } }),
                                                        t._v(" "),
                                                        a("div", { staticClass: "txt_similar" }, [a("p", { staticClass: "desc_similar", domProps: { innerHTML: t._s(e.subTitle) } })]),
                                                    ]
                                                ),
                                            ],
                                            1
                                        );
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "640fadf6",
                        null
                    ).exports),
                h = {
                    components: { Visual: r, SNB: o.a, CommandVideo: l, Command: u, SimilarBanner: d },
                    fetch: function (t) {
                        return Object(i.a)(
                            regeneratorRuntime.mark(function e() {
                                var a, i, s, n, r, o, c, l, m, u, p, d, h;
                                return regeneratorRuntime.wrap(function (e) {
                                    for (;;)
                                        switch ((e.prev = e.next)) {
                                            case 0:
                                                return (
                                                    t.route,
                                                    (a = t.app),
                                                    (i = t.params),
                                                    (s = t.store),
                                                    (n = t.redirect),
                                                    (r = s.getters.deviceType),
                                                    (o = void 0 === r ? "pc" : r),
                                                    (e.next = 4),
                                                    a.$axios.$get("/api/service/category?deviceType=".concat(o))
                                                );
                                            case 4:
                                                if (((c = e.sent), (l = c.data).constructor !== Object || 0 !== Object.keys(l).length)) {
                                                    e.next = 8;
                                                    break;
                                                }
                                                return e.abrupt("return", n(301, "/el?e=rnf"));
                                            case 8:
                                                if (
                                                    ((m = c.data),
                                                    (u = void 0 === m ? {} : m),
                                                    s.commit("SNB/SET_SNBDATA", { SNBData: { SNB: u } }),
                                                    (p = i.slug),
                                                    (d = i.detail),
                                                    (h = !1),
                                                    u.some(function (t) {
                                                        var e = t.code,
                                                            a = void 0 === e ? "" : e,
                                                            i = t.serviceSubCategoryList,
                                                            s = void 0 === i ? [] : i;
                                                        return (
                                                            (h = a.toLowerCase() === p) &&
                                                                s.length > 0 &&
                                                                void 0 !== d &&
                                                                (h = s.some(function (t) {
                                                                    return t.code.toLowerCase() === d;
                                                                })),
                                                            h
                                                        );
                                                    }))
                                                ) {
                                                    e.next = 15;
                                                    break;
                                                }
                                                return e.abrupt("return", n(301, "/el?e=rnf"));
                                            case 15:
                                            case "end":
                                                return e.stop();
                                        }
                                }, e);
                            })
                        )();
                    },
                    asyncData: function (t) {
                        return Object(i.a)(
                            regeneratorRuntime.mark(function e() {
                                var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b, C, y, x, k, w, T, I, D, L, S;
                                return regeneratorRuntime.wrap(
                                    function (e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (a = t.app),
                                                        (i = t.params),
                                                        (s = t.store),
                                                        (n = t.redirect),
                                                        (r = i.slug),
                                                        (o = i.detail),
                                                        (c = r),
                                                        void 0 !== o && (c = o),
                                                        (e.prev = 4),
                                                        (l = s.getters.deviceType),
                                                        (m = void 0 === l ? "pc" : l),
                                                        (e.next = 8),
                                                        a.$axios.$get("/api/service/".concat(c, "?deviceType=").concat(m))
                                                    );
                                                case 8:
                                                    if (((u = e.sent), (p = u.data).constructor !== Object || 0 !== Object.keys(p).length)) {
                                                        e.next = 12;
                                                        break;
                                                    }
                                                    return e.abrupt("return", n(301, "/el?e=rnf"));
                                                case 12:
                                                    return (
                                                        (d = u.data),
                                                        (h = d.iconImg),
                                                        (v = void 0 === h ? "" : h),
                                                        (g = d.categoryParentName),
                                                        (_ = void 0 === g ? "" : g),
                                                        (f = d.templateType),
                                                        (b = void 0 === f ? "A" : f),
                                                        (C = d.intro),
                                                        (y = void 0 === C ? {} : C),
                                                        (x = d.motion),
                                                        (k = void 0 === x ? {} : x),
                                                        (w = d.command),
                                                        (T = void 0 === w ? [] : w),
                                                        (I = d.similarCommand),
                                                        (D = void 0 === I ? [] : I),
                                                        (L = d.heykakao),
                                                        (S = void 0 === L ? {} : L),
                                                        s.dispatch("setHeadings", { headings: { h2: "서비스", h3: "서비스 상세 페이지" } }),
                                                        s.dispatch("isHeaderTransparent", { isHeaderTransparent: !1 }),
                                                        S.constructor === Object && 0 === Object.keys(S).length
                                                            ? s.dispatch("hasBanner", { hasBanner: !1 })
                                                            : (s.dispatch("addbanner", { banner: { type: "app", data: S, tiaraLog: { name: "서비스상세_앱다운로드", layer: "service_app_download" } } }),
                                                              s.dispatch("hasBanner", { hasBanner: !0 })),
                                                        e.abrupt("return", {
                                                            categoryData: { categoryIcon: v, categoryParentName: _ },
                                                            type: b.toLowerCase(),
                                                            introData: y,
                                                            detailDesc: y.description,
                                                            motionData: k,
                                                            commandList: T,
                                                            similarCommand: D,
                                                        })
                                                    );
                                                case 19:
                                                    return (e.prev = 19), (e.t0 = e.catch(4)), e.abrupt("return", n(301, "/el?e=rnf"));
                                                case 22:
                                                case "end":
                                                    return e.stop();
                                            }
                                    },
                                    e,
                                    null,
                                    [[4, 19]]
                                );
                            })
                        )();
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "".concat(this.introData.title), section: "서비스", custom_props: "" });
                    },
                },
                v =
                    (a(378),
                    Object(n.a)(
                        h,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { class: ["service_detail", "a" !== t.type ? "type_" + t.type : ""] },
                                [
                                    t.introData || t.categoryData ? a("Visual", { attrs: { type: t.type, introData: t.introData, categoryData: t.categoryData } }) : t._e(),
                                    t._v(" "),
                                    t.isMobile ? a("SNB") : t._e(),
                                    t._v(" "),
                                    "c" !== t.type && t.detailDesc ? a("p", { staticClass: "info_cont", domProps: { innerHTML: t._s(t.detailDesc) } }) : t._e(),
                                    t._v(" "),
                                    "a" === t.type && t.motionData && t.motionData.video ? a("CommandVideo", { attrs: { motionData: t.motionData } }) : t._e(),
                                    t._v(" "),
                                    t.commandList ? a("Command", { attrs: { type: t.type, commandList: t.commandList } }) : t._e(),
                                    t._v(" "),
                                    "c" !== t.type && t.similarCommand.length > 0 ? a("SimilarBanner", { attrs: { similarCommand: t.similarCommand } }) : t._e(),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "400d55c2",
                        null
                    ));
            e.default = v.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            var i = a(30),
                s = a(31),
                n = {
                    props: ["featureData"],
                    name: "infoFeature",
                    data: function () {
                        return { thumbInfos0: { 375: "750x1190", 1440: "5120x3568", 1920: "5120x3568", 2560: "5120x3568" }, thumbInfos1: { 375: "550x974", 1440: "1056x1858", 1920: "1056x1858", 2560: "1056x1858" } };
                    },
                },
                r = (a(347), a(0)),
                o = Object(r.a)(
                    n,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { staticClass: "info_feature", style: [t.isMobile ? "" : { background: "url(" + t.toThumb(t.thumbInfos0, t.featureData.backgroundImage)["data-src"] + ") 50% 50% /cover no-repeat" }] }, [
                            a("div", { staticClass: "wrap_tit" }, [
                                a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.featureData.title) } }),
                                t._v(" "),
                                a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.featureData.description) } }),
                            ]),
                            t._v(" "),
                            a("div", { staticClass: "wrap_thumb", style: [t.isMobile ? { background: "url(" + t.toThumb(t.thumbInfos0, t.featureData.backgroundImage)["data-src"] + ") 50% 50% /cover no-repeat" } : ""] }, [
                                a(
                                    "img",
                                    t._b(
                                        {
                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                            staticClass: "img_bnv",
                                            attrs: { alt: t.featureData.image.imgDescription },
                                        },
                                        "img",
                                        t.toThumb(t.thumbInfos1, t.featureData.image.url),
                                        !1
                                    )
                                ),
                            ]),
                            t._v(" "),
                            a("div", { staticClass: "wrap_product" }, [
                                a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.featureData.subTitle) } }),
                                t._v(" "),
                                a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.featureData.subDescription) } }),
                            ]),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "6b566434",
                    null
                ).exports,
                c = a(25),
                l = {
                    props: ["assembleData"],
                    name: "infoAssemble",
                    components: { Parallax: c.a },
                    data: function () {
                        return {
                            thumbInfos1: { 375: "750x784", 1440: "1240x1260", 1920: "1240x1260", 2560: "1240x1260" },
                            partsDistanceList: [
                                { 375: 70, 1440: 100, 1920: 100, 2560: 100 },
                                { 375: 38, 1440: 60, 1920: 60, 2560: 60 },
                                { 375: 0, 1440: 22, 1920: 22, 2560: 22 },
                                { 375: 30, 1440: 15, 1920: 15, 2560: 15 },
                                { 375: 80, 1440: 80, 1920: 80, 2560: 80 },
                            ],
                            isShowFrame: !1,
                        };
                    },
                    methods: {
                        parallaxEmit: function (t) {
                            this.isShowFrame = t;
                        },
                        onObserveElem: function () {
                            var t = this.$refs.thumb,
                                e = this.videoData && 1 === this.videoData.length && this.type.autoPlay;
                            Object.assign({}, this.observeOpts, { threshold: [0.3, 0.7], root: null, rootMargin: "0px 0px 0px 0px" });
                            e &&
                                ((t.observer = new IntersectionObserver(function (e, a) {
                                    e.forEach(function (e) {
                                        e.isIntersecting && (t.play(), a.unobserve(e.target));
                                    });
                                }, this.observeOpts)),
                                t.observer.observe(t));
                        },
                    },
                },
                m =
                    (a(348),
                    Object(r.a)(
                        l,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { staticClass: "info_assemble" }, [
                                a("div", { staticClass: "cont_assemble" }, [
                                    a("div", { staticClass: "wrap_cont" }, [
                                        a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.assembleData.title) } }),
                                        t._v(" "),
                                        a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.assembleData.description) } }),
                                    ]),
                                    t._v(" "),
                                    a(
                                        "div",
                                        { ref: "thumb", staticClass: "wrap_thumb" },
                                        [
                                            a("span", { staticClass: "txt_thumb", domProps: { innerHTML: t._s(t.assembleData.imageText) } }),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts1", attrs: { speedFactor: 1, direction: "up", availableOffset: t.partsDistanceList[0][t.screenType] } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[0].thumbInfos[t.screenType], expression: "assembleData.images[0].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[0].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[0].thumbInfos, t.assembleData.images[0].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts2", attrs: { speedFactor: 1, direction: "up", availableOffset: t.partsDistanceList[1][t.screenType] } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[1].thumbInfos[t.screenType], expression: "assembleData.images[1].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[1].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[1].thumbInfos, t.assembleData.images[1].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a(
                                                "Parallax",
                                                {
                                                    staticClass: "parts3",
                                                    attrs: { speedFactor: 1, direction: "up", availableOffset: t.partsDistanceList[2][t.screenType], standardPositionElem: t.$refs.thumb, emitTiming: 0.5 },
                                                    on: { parallaxEmit: t.parallaxEmit },
                                                },
                                                [
                                                    a(
                                                        "img",
                                                        t._b(
                                                            {
                                                                directives: [
                                                                    { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[2].thumbInfos[t.screenType], expression: "assembleData.images[2].thumbInfos[screenType]" },
                                                                ],
                                                                attrs: { alt: t.assembleData.images[2].imgDescription },
                                                            },
                                                            "img",
                                                            t.toThumb(t.assembleData.images[2].thumbInfos, t.assembleData.images[2].url),
                                                            !1
                                                        )
                                                    ),
                                                    t._v(" "),
                                                    a("img", {
                                                        directives: [{ name: "show", rawName: "v-show", value: t.isShowFrame, expression: "isShowFrame" }],
                                                        staticClass: "img_frame",
                                                        attrs: { src: t.assembleData.images[2].frameUrl, alt: "" },
                                                    }),
                                                ]
                                            ),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts4", attrs: { speedFactor: 1, direction: "down", availableOffset: t.partsDistanceList[3][t.screenType] } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[3].thumbInfos[t.screenType], expression: "assembleData.images[3].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[3].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[3].thumbInfos, t.assembleData.images[3].url),
                                                        !1
                                                    )
                                                ),
                                                t._v(" "),
                                                a("img", {
                                                    directives: [{ name: "show", rawName: "v-show", value: t.isShowFrame, expression: "isShowFrame" }],
                                                    staticClass: "img_frame",
                                                    attrs: { src: t.assembleData.images[3].frameUrl, alt: "" },
                                                }),
                                            ]),
                                            t._v(" "),
                                            a("Parallax", { staticClass: "parts5", attrs: { speedFactor: 1, direction: "down", availableOffset: t.partsDistanceList[4][t.screenType] } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [
                                                                { name: "lazy-image", rawName: "v-lazy-image", value: t.assembleData.images[4].thumbInfos[t.screenType], expression: "assembleData.images[4].thumbInfos[screenType]" },
                                                            ],
                                                            attrs: { alt: t.assembleData.images[4].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.assembleData.images[4].thumbInfos, t.assembleData.images[4].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                        ],
                                        1
                                    ),
                                ]),
                                t._v(" "),
                                a(
                                    "div",
                                    { staticClass: "next_item" },
                                    t._l(t.assembleData.features, function (e, i) {
                                        return a("div", { key: "feature" + i, staticClass: "cont_feature" }, [
                                            a("div", { staticClass: "wrap_cont" }, [
                                                a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(e.title) } }),
                                                t._v(" "),
                                                a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(e.description) } }),
                                            ]),
                                            t._v(" "),
                                            a("div", { staticClass: "wrap_thumb" }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                            staticClass: "img_bnv",
                                                            attrs: { alt: e.image.imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.thumbInfos1, e.image.url),
                                                        !1
                                                    )
                                                ),
                                                t._v(" "),
                                                1 === i ? a("span", { staticClass: "ico_circle" }) : t._e(),
                                            ]),
                                        ]);
                                    }),
                                    0
                                ),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "c50216b8",
                        null
                    ).exports),
                u = {
                    props: ["suggestData"],
                    name: "infoSuggest",
                    components: { Parallax: c.a },
                    data: function () {
                        return {
                            thumbInfos0: { 375: "750x1280", 1440: "3840x2160", 1920: "3840x2160", 2560: "3840x2160" },
                            thumbInfos1: { 375: "680x690", 1440: "1156x1174", 1920: "1156x1174", 2560: "1156x1174" },
                            thumbInfos2: { 375: "432x746", 1440: "676x1160", 1920: "676x1160", 2560: "676x1160" },
                            thumbInfos3: { 375: "164x746", 1440: "254x1160", 1920: "254x1160", 2560: "254x1160" },
                            availableOffset: { 375: 40, 1440: 24, 1920: 24, 2560: 40 },
                        };
                    },
                },
                p =
                    (a(349),
                    Object(r.a)(
                        u,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a("div", { staticClass: "info_suggest" }, [
                                a("div", { staticClass: "cont_bnv" }, [
                                    a(
                                        "img",
                                        t._b(
                                            {
                                                directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos0[t.screenType], expression: "thumbInfos0[screenType]" }],
                                                staticClass: "img_bnv",
                                                attrs: { alt: t.suggestData.banner.image.imgDescription },
                                            },
                                            "img",
                                            t.toThumb(t.thumbInfos0, t.suggestData.banner.image.url),
                                            !1
                                        )
                                    ),
                                ]),
                                t._v(" "),
                                a("div", { staticClass: "cont_feature ty_basic" }, [
                                    a("div", { staticClass: "wrap_cont" }, [
                                        a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.suggestData.feature.title) } }),
                                        t._v(" "),
                                        a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.suggestData.feature.description) } }),
                                    ]),
                                    t._v(" "),
                                    a("div", { staticClass: "wrap_thumb" }, [
                                        a(
                                            "img",
                                            t._b(
                                                {
                                                    directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos1[t.screenType], expression: "thumbInfos1[screenType]" }],
                                                    staticClass: "img_bnv",
                                                    attrs: { alt: t.suggestData.feature.image.imgDescription },
                                                },
                                                "img",
                                                t.toThumb(t.thumbInfos1, t.suggestData.feature.image.url),
                                                !1
                                            )
                                        ),
                                    ]),
                                ]),
                                t._v(" "),
                                a("div", { staticClass: "cont_feature ty_parallax" }, [
                                    a("div", { staticClass: "wrap_cont" }, [
                                        a("strong", { staticClass: "tit_item", domProps: { innerHTML: t._s(t.suggestData.parallax.title) } }),
                                        t._v(" "),
                                        a("p", { staticClass: "desc_item", domProps: { innerHTML: t._s(t.suggestData.parallax.description) } }),
                                    ]),
                                    t._v(" "),
                                    a(
                                        "div",
                                        { staticClass: "wrap_thumb" },
                                        [
                                            a("Parallax", { attrs: { speedFactor: 1, direction: "right", availableOffset: 0 } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos2[t.screenType], expression: "thumbInfos2[screenType]" }],
                                                            staticClass: "img_bnv",
                                                            attrs: { alt: t.suggestData.parallax.images[0].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.thumbInfos2, t.suggestData.parallax.images[0].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                            t._v(" "),
                                            a("Parallax", { attrs: { speedFactor: 1, direction: "left", availableOffset: t.availableOffset[t.screenType] } }, [
                                                a(
                                                    "img",
                                                    t._b(
                                                        {
                                                            directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.thumbInfos3[t.screenType], expression: "thumbInfos3[screenType]" }],
                                                            staticClass: "img_bnv",
                                                            attrs: { alt: t.suggestData.parallax.images[1].imgDescription },
                                                        },
                                                        "img",
                                                        t.toThumb(t.thumbInfos3, t.suggestData.parallax.images[1].url),
                                                        !1
                                                    )
                                                ),
                                            ]),
                                        ],
                                        1
                                    ),
                                ]),
                            ]);
                        },
                        [],
                        !1,
                        null,
                        "3c58ad27",
                        null
                    ).exports),
                d = a(60),
                h = a(24),
                v = a(33),
                g = {
                    components: { productBanner: i.a, vodInfo: s.a, infoFeature: o, infoAssemble: m, infoSuggest: p, infoSpecs: d.a, AppBNV: h.a, BottomBNV: v.a },
                    asyncData: function (t) {
                        var e = t.store,
                            a = e.getters.deviceType,
                            i = void 0 === a ? "pc" : a;
                        return (
                            e.dispatch("setHeadings", { headings: { h2: "제품", h3: "KakaoMini" } }),
                            e.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                            e.dispatch("hasBanner", { hasBanner: !1 }),
                            {
                                visualData: {
                                    title: '어디서든 <i class="line_mo"></i>더 쉽고 편하게<br>카카오미니',
                                    scrollText: "More About <em>Kakaomini</em>",
                                    imageUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_visual.jpg?v=20090904"),
                                },
                                introData: {
                                    title: "라이프 어시스턴트",
                                    desc: "카카오미니는 당신의 생활을 더 쉽고 편리하게 만들기 위해 태어났습니다. 다양한 공간에서 카카오미니를 즐겨보세요, 여러분의 생활을 즐거운 일상으로 만들어 드릴께요.",
                                    thumbInfo: { 375: "690x412", 1440: "3200x1912", 1920: "3200x1912", 2560: "3200x1912" },
                                    vodData: [
                                        {
                                            image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_video.jpg"), imgDescription: "" },
                                            video: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/vod_promotion.mp4",
                                            etc: "Promotional Video",
                                        },
                                    ],
                                },
                                assembleData: {
                                    title: '현장감 있는 음질, <i class="line_pc line_mo"></i>폭넓은 음역대의 <i class="line_mo"></i>사운드',
                                    description:
                                        '카카오미니에 굳 헤르츠 사운드 알고리즘을 적용하여, 음악과 음폭 기능을 향상시켰습니다.<i class="line_pc"></i> 음악과 음성 재생 시 내장된 프로세서를 이용해 실시간으 로 음질을 개선하여 저음과 고음을 더 세밀하게 들려줍니다.',
                                    imageText: "2inch<br>360<br>Sound",
                                    images: [
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_component_01.png?v=20090904"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "528x222", 1440: "900x380", 1920: "900x380", 2560: "900x380" },
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_component_02.png?v=20090904"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "382x54", 1440: "652x92", 1920: "652x92", 2560: "652x92" },
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_component_03.png?v=20090904"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "474x514", 1440: "810x878", 1920: "810x878", 2560: "810x878" },
                                            frameUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/frame_arrow1.png"),
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_component_04.png?v=20090904"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "366x222", 1440: "622x378", 1920: "622x378", 2560: "622x378" },
                                            frameUrl: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/frame_arrow2.png"),
                                        },
                                        {
                                            url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_component_05.png?v=20090904"),
                                            imgDescription: "스피커",
                                            thumbInfos: { 375: "506x222", 1440: "864x378", 1920: "864x378", 2560: "864x378" },
                                        },
                                    ],
                                    features: [
                                        {
                                            title: "편리한 사용성을 고려한 4개의 아날로그 버튼",
                                            description: '자주 사용하는 기능을 스피커 상단의 버튼에 담아 <i class="line_pc"></i>기기 설정이 용이합니다.',
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_func_01.png?v=20090904"), imgDescription: "" },
                                        },
                                        {
                                            title: '당신과 소통하는, <i class="line_pc line_mo"></i>풀컬러 LED 라이트링',
                                            description: "당신이 묻는 질문에 대한 인터렉션을 시각적으로 다채롭게 보여줍니다. 불빛으로 기기 상태를 파악할 수 있습니다.",
                                            image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_func_01.png?v=20090904"), imgDescription: "" },
                                        },
                                    ],
                                    videos: ["https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/pc/video_progress_b.mov", "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/pc/video_progress_c.mov"],
                                },
                                featureData: {
                                    title: '평범한 듯,<i class="line_mo"></i> 비범한 외형 <i class="line_pc"></i>일상에 자연스럽게 녹아드는 친숙한 디자인',
                                    description:
                                        "'새롭지만 자연스럽게 일상의 환경에 녹아들게 하기’ 카카오미니의 디자인을 고안하면서 가장 중요하게 생각한 가치입니다. 자연스럽고 친숙한 디자인으로 어느 곳에 놓더라도 주변과 잘 조화되도록 디자인하였습니다.",
                                    backgroundImage: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/bg_product_01.jpg?v=20090904"),
                                    image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_product_01.png?v=20090904"), imgDescription: "" },
                                    subTitle: '부드러운 곡선과 <i class="line_mo"></i>패브릭 소재로 이루어진 외형',
                                    subDescription: "기본적인 직사각의 형태와 각 모서리에는 앱아이콘을 연상시키는 부드러운 곡선이 드러나도록 디자인이 되었으며,외형에 패브릭 소재를 적용하여 따뜻하고 편안한 감성을 담았습니다.",
                                },
                                suggestData: {
                                    feature: {
                                        title: "함께 이동 가능한 포터블팩으로 선 없는 자유를 느껴보세요",
                                        description: "전원 연결이 어려운 실내 공간이나, 탁 트인 야외에서도 카카오미니C를 즐길 수 있어요.",
                                        image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_func_02.png?v=20090904"), imgDescription: "" },
                                    },
                                    parallax: {
                                        title: "먼거리에서도 버튼하나로 호출해 보세요",
                                        description: "카카오미니가 어디에 있던 보이스 리모트가 내 손에 있다면 힘들이지 않고 음성 명령 및 기기 제어가 가능해요.",
                                        images: [
                                            { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_func_03.png?v=20090904"), imgDescription: "" },
                                            { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_func_04.png?v=20090904"), imgDescription: "" },
                                        ],
                                    },
                                    banner: { image: { url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_product_02.jpg?v=20090904"), imgDescription: "" } },
                                },
                                specDatas: [
                                    {
                                        title: "카카오미니 C",
                                        isOn: !0,
                                        items: [
                                            { title: "제품명", cont: "Kakao Mini C" },
                                            { title: "모델명", cont: "KM-1500" },
                                            { title: "스피커", cont: "2인치 Full Range(+Passive Radiator)" },
                                            { title: "마이크", cont: "4채널 내장 마이크" },
                                            { title: "크기 / 무게", cont: "76.6 X 76.6 X 110.2(mm) / 390g" },
                                            { title: "색상", cont: "Cozy Black" },
                                            { title: "Materials", cont: "Plastic, Fabric" },
                                            { title: "사용전원", cont: "5.0V / 2.4A" },
                                            { title: "소비전력", cont: "Max 12W" },
                                            { title: "출력", cont: "정격 7W(순간최대출력 14W)" },
                                            { title: "AUX", cont: "3.5mm 스테레오 단자 출력" },
                                            { title: "블루투스", cont: "Bluetooth 4.2 + EDR and BLE" },
                                            { title: "와이파이", cont: "802.11 a / b / g / n / ac" },
                                        ],
                                        description: "*카카오미니를 사용하기 위해서는 와이파이 연결이 필요합니다.<br>*카카오미니는 음성명령을 통한 블루투스 IN / OUT 기능을 지원합니다.",
                                    },
                                    {
                                        title: "카카오미니 포터블팩",
                                        isOn: !1,
                                        items: [
                                            { title: "제품명", cont: "Kakao Mini C Portable Pack" },
                                            { title: "모델명", cont: "MPP-1500" },
                                            { title: "배터리", cont: "Li-po, 3820mAh, 3.7V / 14.1Wh, 103450, 1S-2P" },
                                            { title: "입력 정격전압", cont: "5.0V / 2.4A" },
                                            { title: "출력 정격전압", cont: "3.7V / 2A" },
                                            { title: '카카오미니C<i class="line_mo"></i>와의 연결', cont: "포고핀(8pin)" },
                                            { title: "크기", cont: "76.8 × 76.8 × 27.7(mm)" },
                                            { title: "무게", cont: "150g" },
                                            { title: "제조국가", cont: "중국" },
                                            { title: "생산처", cont: "Dongguan Hajen Co., Ltd." },
                                            { title: "인증받은자의 상호", cont: "주식회사 하젠" },
                                            { title: "인증번호(KC)", cont: "R–R–HJ8–MPP1500" },
                                            { title: "안전확인신고번호", cont: "XU100330-18014A" },
                                            { title: "제조일자", cont: "제품 바닥면에 별도 표기" },
                                        ],
                                    },
                                    {
                                        title: "카카오미니 보이스 리모트",
                                        isOn: !1,
                                        items: [
                                            { title: "제품명", cont: "Kakao Mini Voice Remote" },
                                            { title: "모델명", cont: "MVR-1500" },
                                            { title: "주파수 대역", cont: "2402~2480 MHz" },
                                            { title: "수신 감도", cont: "-94 dBm" },
                                            { title: "크기", cont: "115.5 × 28.8 × 15.4 (mm)" },
                                            { title: "무게", cont: "32.55g(건전지 미포함)" },
                                            { title: "전원", cont: "3V / 알카라인 건전지(AAA x 2)" },
                                            { title: "동작온도", cont: "10℃ ~ 50℃" },
                                            { title: "제조자", cont: "(주)오성전자" },
                                            { title: "제조국가", cont: "중국" },
                                            { title: "인증번호(KC)", cont: "R-C-OHS-B812" },
                                            { title: "공급자", cont: "(주)카카오" },
                                            { title: "제조일자", cont: "별도표기" },
                                        ],
                                    },
                                ],
                                nextProduct: {
                                    title: "카카오홈으로 만드는<br>똑똑한 우리집",
                                    image: { background: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_next.jpg?v=20090904") },
                                    about: { link: "/product/kakaohome", text: "More About <em>‘Kakaohome’</em>" },
                                },
                                bannerData: {
                                    title: "이제 스마트폰에서도 <i class=\"line_mo\"></i>'헤이카카오'를 불러보세요.",
                                    description: "Android: 5.0 이상 / iOS: 12.0 이상 지원 가능합니다.",
                                    moreText: "헤이카카오",
                                    image: { type: "SINGLE", url: "https://t1.kakaocdn.net/kakaoi_brand/images/product/kakaomini/".concat(i, "/img_app.png?v=20090904"), imgDescription: "" },
                                    link: { appStore: "https://apps.apple.com/kr/app/id1286618447", googlePlay: "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.kakao.i.connect" },
                                },
                            }
                        );
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "카카오미니", section: "제품", custom_props: "" });
                    },
                },
                _ =
                    (a(351),
                    Object(r.a)(
                        g,
                        function () {
                            var t = this,
                                e = t.$createElement,
                                a = t._self._c || e;
                            return a(
                                "div",
                                { staticClass: "product_kakaomini" },
                                [
                                    a("productBanner", { attrs: { visualData: t.visualData } }),
                                    t._v(" "),
                                    a("vodInfo", { attrs: { introData: t.introData } }),
                                    t._v(" "),
                                    a("infoFeature", { attrs: { featureData: t.featureData } }),
                                    t._v(" "),
                                    a("infoAssemble", { attrs: { assembleData: t.assembleData } }),
                                    t._v(" "),
                                    a("infoSuggest", { attrs: { suggestData: t.suggestData } }),
                                    t._v(" "),
                                    a("infoSpecs", { attrs: { specDatas: t.specDatas } }),
                                    t._v(" "),
                                    a("AppBNV", { attrs: { bannerData: t.bannerData, bannerLog: { name: "제품_앱다운로드_클릭", layer: "product_app_download" } } }),
                                    t._v(" "),
                                    a("BottomBNV", { attrs: { nextProduct: t.nextProduct } }),
                                ],
                                1
                            );
                        },
                        [],
                        !1,
                        null,
                        "767a1554",
                        null
                    ));
            e.default = _.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(20), a(12), a(7), a(5), a(9);
            var i = a(6),
                s = a(61),
                n = a(8);
            function r(t, e) {
                var a = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e &&
                        (i = i.filter(function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        })),
                        a.push.apply(a, i);
                }
                return a;
            }
            var o = {
                    layout: "errLayout",
                    components: { IcoLogo: s.a },
                    computed: (function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = null != arguments[e] ? arguments[e] : {};
                            e % 2
                                ? r(Object(a), !0).forEach(function (e) {
                                      Object(i.a)(t, e, a[e]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
                                : r(Object(a)).forEach(function (e) {
                                      Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(a, e));
                                  });
                        }
                        return t;
                    })({}, Object(n.b)(["isIOS"])),
                    asyncData: function (t) {
                        t.route;
                        var e = t.redirect,
                            a = t.store,
                            i = (t.query, a.getters.deviceType);
                        if ("pc" === (void 0 === i ? "pc" : i)) return e({ path: "/product/kakaomini" });
                    },
                    created: function () {
                        this.$router.push({ path: "/product/kakaomini" });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }),
                            this.isMobile && this.isIOS
                                ? (window.location.href = "https://itunes.apple.com/app/id1286618447?mt=8")
                                : (window.location.href = "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.kakao.i.connect");
                    },
                },
                c = (a(366), a(0)),
                l = Object(c.a)(
                    o,
                    function () {
                        var t = this.$createElement,
                            e = this._self._c || t;
                        return e("div", { staticClass: "wrap_loading" }, [e("h1", [e("IcoLogo")], 1)]);
                    },
                    [],
                    !1,
                    null,
                    "c9ba26a8",
                    null
                );
            e.default = l.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = (a(28), a(4)),
                n = a(13),
                r = {
                    components: { Banner: s.a, IcoArrCircle: n.a },
                    data: function () {
                        return {
                            listShowCnt: 8,
                            visualThumbInfo: { 375: "750x1270", 1440: "2880x1440", 1920: "3840x1720", 2560: "5120x1920" },
                            productThumbInfo: { BIG: { 375: "690x800", 1440: "1592x1152", 1920: "1592x1152", 2560: "1592x1152" }, SMALL: { 375: "690x800", 1440: "736x1152", 1920: "736x1152", 2560: "736x1152" } },
                            roleThumbInfo: { 375: "750x1280", 1440: "3200x1920", 1920: "3200x1920", 2560: "3200x1920" },
                            logoThumbInfo: { 375: "340x158", 1440: "466x216", 1920: "466x216", 2560: "466x216" },
                            test: [],
                            activeIdx: 1,
                        };
                    },
                    computed: {
                        nextItemEtc: function () {
                            var t = this;
                            return function (e) {
                                var a = e % t.partnerBanners.length,
                                    i = t.partnerBanners[a] || {},
                                    s = i.etc,
                                    n = i.title;
                                return s || (void 0 === n ? "" : n).replace(/\<br\/?\>/g, "");
                            };
                        },
                        chunkIdx: function () {
                            var t = 6;
                            return this.isMobile && (t = 2), t;
                        },
                        hideCount: function () {
                            var t = this.partnerList.length / 2;
                            return this.listShowCnt > t && (this.listShowCnt = t), this.listShowCnt;
                        },
                    },
                    asyncData: function (t) {
                        return Object(i.a)(
                            regeneratorRuntime.mark(function e() {
                                var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b, C, y, x, k;
                                return regeneratorRuntime.wrap(
                                    function (e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (a = t.app),
                                                        (i = t.store),
                                                        (s = t.redirect),
                                                        (e.prev = 1),
                                                        (n = i.getters.deviceType),
                                                        (r = void 0 === n ? "pc" : n),
                                                        (e.next = 5),
                                                        a.$axios.$get("/api/withpartners?deviceType=".concat(r))
                                                    );
                                                case 5:
                                                    if (((o = e.sent), (c = o.data).constructor !== Object || 0 !== Object.keys(c).length)) {
                                                        e.next = 9;
                                                        break;
                                                    }
                                                    return e.abrupt("return", s(301, "/el?e=rnf"));
                                                case 9:
                                                    if (
                                                        ((l = o.data),
                                                        (m = l.banner),
                                                        (u = void 0 === m ? [] : m),
                                                        (p = l.intro),
                                                        (d = void 0 === p ? {} : p),
                                                        (h = l.product),
                                                        (v = void 0 === h ? [] : h),
                                                        (g = l.identity),
                                                        (_ = void 0 === g ? {} : g),
                                                        (f = l.proposal),
                                                        (b = void 0 === f ? {} : f),
                                                        (C = l.partner),
                                                        (y = void 0 === C ? [] : C),
                                                        i.dispatch("setHeadings", { headings: { h2: "파트너", h3: "파트너 메인 페이지" } }),
                                                        i.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                                                        i.dispatch("hasBanner", { hasBanner: !1 }),
                                                        "pc" === r && 0 !== (x = y.length % 6))
                                                    )
                                                        for (k = 0; k < x; k++) y.push("");
                                                    return e.abrupt("return", { partnerBanners: u, partnerIntro: d, partnerproducts: v, partnerRole: _, partnerInfo: b, partnerList: y });
                                                case 18:
                                                    return (e.prev = 18), (e.t0 = e.catch(1)), e.abrupt("return", s(301, "/el?e=rnf"));
                                                case 21:
                                                case "end":
                                                    return e.stop();
                                            }
                                    },
                                    e,
                                    null,
                                    [[1, 18]]
                                );
                            })
                        )();
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "목록", section: "파트너", custom_props: "" });
                    },
                    methods: {
                        expandMore: function () {
                            this.listShowCnt += this.listShowCnt;
                        },
                        setActiveBNV: function (t) {
                            this.activeIdx = t;
                        },
                    },
                },
                o = (a(321), a(0)),
                c = Object(o.a)(
                    r,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { staticClass: "partner_main" }, [
                            a(
                                "div",
                                { staticClass: "info_visual" },
                                [
                                    a("Banner", {
                                        attrs: { options: { slotSize: t.partnerBanners.length, isBtnStatic: !1, isLoop: !0, alignItem: "left", type: "wide" } },
                                        on: { callback: t.setActiveBNV },
                                        scopedSlots: t._u(
                                            [
                                                t._l(t.partnerBanners, function (e, i) {
                                                    return {
                                                        key: "slot" + i,
                                                        fn: function () {
                                                            return [
                                                                a("div", { key: "bnv" + i, staticClass: "link_item" }, [
                                                                    a("div", { staticClass: "layer_cont" }, [
                                                                        e.link && e.link.more
                                                                            ? a(
                                                                                  "a",
                                                                                  {
                                                                                      staticClass: "wrap_cont",
                                                                                      attrs: { href: e.link.more || "javascript:;", "data-tiara-action-name": "파트너목록_상단배너_클릭", "data-tiara-layer": "top_banner" },
                                                                                  },
                                                                                  [
                                                                                      a("em", { staticClass: "tit_bnv", domProps: { innerHTML: t._s(e.title) } }),
                                                                                      t._v(" "),
                                                                                      a("strong", { staticClass: "sub_tit", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                                                  ]
                                                                              )
                                                                            : a("div", { staticClass: "wrap_cont" }, [
                                                                                  a("em", { staticClass: "tit_bnv", domProps: { innerHTML: t._s(e.title) } }),
                                                                                  t._v(" "),
                                                                                  a("strong", { staticClass: "sub_tit", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                                              ]),
                                                                    ]),
                                                                    t._v(" "),
                                                                    a(
                                                                        "img",
                                                                        t._b(
                                                                            {
                                                                                directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.visualThumbInfo[t.screenType], expression: "visualThumbInfo[screenType]" }],
                                                                                staticClass: "img_bnv",
                                                                                attrs: { alt: e.image.imgDescription },
                                                                            },
                                                                            "img",
                                                                            t.toThumb(t.visualThumbInfo, e.image.url),
                                                                            !1
                                                                        )
                                                                    ),
                                                                ]),
                                                            ];
                                                        },
                                                        proxy: !0,
                                                    };
                                                }),
                                                {
                                                    key: "controller",
                                                    fn: function () {
                                                        return [
                                                            !t.isMobile && t.partnerBanners.length > 1
                                                                ? a(
                                                                      "span",
                                                                      { staticClass: "wrap_more" },
                                                                      [
                                                                          a("span", { staticClass: "txt_next" }, [t._v("/ Next")]),
                                                                          t._v(" "),
                                                                          t._l(t.partnerBanners, function (e, i) {
                                                                              return [
                                                                                  a("transition", { key: "bnv" + i, attrs: { name: "fade" } }, [
                                                                                      a("span", {
                                                                                          directives: [{ name: "show", rawName: "v-show", value: t.activeIdx === i + 1, expression: "activeIdx === index + 1" }],
                                                                                          staticClass: "txt_etc",
                                                                                          domProps: { innerHTML: t._s(t.nextItemEtc(i + 1)) },
                                                                                      }),
                                                                                  ]),
                                                                              ];
                                                                          }),
                                                                      ],
                                                                      2
                                                                  )
                                                                : t._e(),
                                                        ];
                                                    },
                                                    proxy: !0,
                                                },
                                            ],
                                            null,
                                            !0
                                        ),
                                    }),
                                ],
                                1
                            ),
                            t._v(" "),
                            a("section", { staticClass: "info_intro" }, [
                                a("h4", { staticClass: "txt_partner", domProps: { innerHTML: t._s(t.partnerIntro.title) } }),
                                t._v(" "),
                                a("p", { staticClass: "desc_partner", domProps: { innerHTML: t._s(t.partnerIntro.subTitle) } }),
                                t._v(" "),
                                a(
                                    "ul",
                                    { staticClass: "list_product" },
                                    t._l(t.partnerproducts, function (e, i) {
                                        return a(
                                            "li",
                                            { key: i, class: { large: "BIG" === e.image.type } },
                                            [
                                                a("em", { staticClass: "txt_product", domProps: { innerHTML: t._s(e.title) } }),
                                                t._v(" "),
                                                a(
                                                    "router-link",
                                                    {
                                                        staticClass: "link_product",
                                                        attrs: { to: "partner/" + e.relatedCode || !1, "data-tiara-action-name": "파트너목록_" + e.relatedCode + "_클릭", "data-tiara-layer": "partner_" + e.relatedCode },
                                                    },
                                                    [
                                                        a(
                                                            "img",
                                                            t._b(
                                                                {
                                                                    directives: [
                                                                        {
                                                                            name: "lazy-image",
                                                                            rawName: "v-lazy-image",
                                                                            value: t.productThumbInfo[e.image.type][t.screenType],
                                                                            expression: "productThumbInfo[partnerproduct.image.type][screenType]",
                                                                        },
                                                                    ],
                                                                    staticClass: "img_product",
                                                                    attrs: { alt: e.image.imgDescription },
                                                                },
                                                                "img",
                                                                t.toThumb(t.productThumbInfo[e.image.type], e.image.url),
                                                                !1
                                                            )
                                                        ),
                                                    ]
                                                ),
                                                t._v(" "),
                                                a("strong", { staticClass: "tit_product", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                t._v(" "),
                                                a("p", { staticClass: "desc_product", domProps: { innerHTML: t._s(e.description) } }),
                                            ],
                                            1
                                        );
                                    }),
                                    0
                                ),
                            ]),
                            t._v(" "),
                            a("section", { staticClass: "info_role", style: { background: "url(" + t.toThumb(t.roleThumbInfo, t.partnerRole.image.url)["data-src"] + ") 50% 50% /cover no-repeat" } }, [
                                a("div", { staticClass: "wrap_txt" }, [
                                    t.partnerRole.title ? a("h4", { staticClass: "txt_role", domProps: { innerHTML: t._s(t.partnerRole.title) } }) : t._e(),
                                    t._v(" "),
                                    t.partnerRole.description ? a("p", { staticClass: "desc_role", domProps: { innerHTML: t._s(t.partnerRole.description) } }) : t._e(),
                                    t._v(" "),
                                    a(
                                        "a",
                                        { staticClass: "link_role", attrs: { href: t.partnerRole.link.more || "javascript:;", "data-tiara-action-name": "파트너목록_제휴제안_클릭", "data-tiara-layer": "partner_proposal" } },
                                        [a("span", { domProps: { innerHTML: t._s(t.partnerRole.moreText) } }), a("IcoArrCircle", { attrs: { isStatic: !0 } })],
                                        1
                                    ),
                                ]),
                            ]),
                            t._v(" "),
                            t.partnerInfo || t.partnerList
                                ? a("section", { staticClass: "info_partners" }, [
                                      t.partnerInfo ? a("h4", { staticClass: "tit_partners", domProps: { innerHTML: t._s(t.partnerInfo.title) } }) : t._e(),
                                      t._v(" "),
                                      t.partnerInfo ? a("p", { staticClass: "desc_partners", domProps: { innerHTML: t._s(t.partnerInfo.subTitle) } }) : t._e(),
                                      t._v(" "),
                                      t.partnerList
                                          ? a(
                                                "div",
                                                { staticClass: "wrap_list" },
                                                t._l(Math.ceil(t.partnerList.length / t.chunkIdx), function (e, i) {
                                                    return a(
                                                        "ul",
                                                        { key: i, staticClass: "list_partners", class: { hide: t.isMobile && i >= t.hideCount } },
                                                        t._l(t.partnerList.slice((e - 1) * t.chunkIdx, e * t.chunkIdx), function (e, i) {
                                                            return a("li", { key: i }, [
                                                                e.imageUrl
                                                                    ? a(
                                                                          "img",
                                                                          t._b(
                                                                              {
                                                                                  directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.logoThumbInfo[t.screenType], expression: "logoThumbInfo[screenType]" }],
                                                                                  staticClass: "img_partner",
                                                                                  attrs: { alt: e.name },
                                                                              },
                                                                              "img",
                                                                              t.toThumb(t.logoThumbInfo, e.imageUrl),
                                                                              !1
                                                                          )
                                                                      )
                                                                    : t._e(),
                                                            ]);
                                                        }),
                                                        0
                                                    );
                                                }),
                                                0
                                            )
                                          : t._e(),
                                      t._v(" "),
                                      t.isMobile && t.partnerList
                                          ? a(
                                                "button",
                                                { class: ["btn_expand", { hide: t.partnerList.length / 2 === t.listShowCnt }], attrs: { type: "button" }, on: { click: t.expandMore } },
                                                [a("IcoArrCircle"), t._v("Show me"), a("em", { staticClass: "emph_txt" }, [t._v("More Partner")])],
                                                1
                                            )
                                          : t._e(),
                                  ])
                                : t._e(),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "b2a5a81c",
                    null
                );
            e.default = c.exports;
        },
        function (t, e, a) {
            "use strict";
            a.r(e);
            a(7), a(5), a(9), a(19);
            var i = a(3),
                s = a(4),
                n = a(29),
                r = a(13),
                o = {
                    components: { VisualVideo: n.a, Banner: s.a, IcoArrCircle: r.a },
                    data: function () {
                        return {
                            imageUrl: "https://dummyimage.com/1570x1360/fff/000.jpg",
                            visualThumbInfo: { 375: "750x1270", 1440: "2880x1440", 1920: "3840x1720", 2560: "5120x1920" },
                            commandThumbInfo: { 375: "690x800", 1440: "1410x1292", 1920: "1410x1292", 2560: "1410x1292" },
                            partnerThumbInfo: { 375: "660x800", 1440: "2880x1292", 1920: "2880x1292", 2560: "2880x1292" },
                            tiaraLog: { name: "상단배너_클릭", layer: "top_banner" },
                        };
                    },
                    computed: {
                        videoOption: function () {
                            var t = { playBtn: !0, wide: !0, autoPlay: !0, isLoop: !0, controlsBtn: { playBtn: !1, fullscreen: !1 }, haslayerList: !1, hasText: !0 };
                            return this.isMobile && (t = { playBtn: !0, wide: !0, isLoop: !0, autoPlay: !0, controlsBtn: { playBtn: !1, fullscreen: !1 }, haslayerList: !1, hasText: !0 }), t;
                        },
                    },
                    asyncData: function (t) {
                        return Object(i.a)(
                            regeneratorRuntime.mark(function e() {
                                var a, i, s, n, r, o, c, l, m, u, p, d, h, v, g, _, f, b, C, y;
                                return regeneratorRuntime.wrap(
                                    function (e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (a = t.app), (i = t.store), (s = t.redirect), (e.prev = 1), (n = i.getters.deviceType), (r = void 0 === n ? "pc" : n), (e.next = 5), a.$axios.$get("/api/service?deviceType=".concat(r))
                                                    );
                                                case 5:
                                                    if (((o = e.sent), (c = o.data).constructor !== Object || 0 !== Object.keys(c).length)) {
                                                        e.next = 9;
                                                        break;
                                                    }
                                                    return e.abrupt("return", s(301, "/el?e=rnf"));
                                                case 9:
                                                    return (
                                                        (l = o.data),
                                                        (m = l.banner),
                                                        (u = void 0 === m ? [] : m),
                                                        (p = l.categories),
                                                        (d = void 0 === p ? [] : p),
                                                        (h = l.thirdService),
                                                        (v = void 0 === h ? [] : h),
                                                        (g = l.inside),
                                                        (_ = void 0 === g ? {} : g),
                                                        (f = l.heykakao),
                                                        (b = void 0 === f ? {} : f),
                                                        (C = l.intro),
                                                        (y = void 0 === C ? {} : C),
                                                        i.dispatch("setHeadings", { headings: { h2: "서비스", h3: "서비스 메인 페이지" } }),
                                                        i.dispatch("isHeaderTransparent", { isHeaderTransparent: !0 }),
                                                        b.constructor === Object && 0 === Object.keys(b).length
                                                            ? i.dispatch("hasBanner", { hasBanner: !1 })
                                                            : (i.dispatch("addbanner", { banner: { type: "app", data: b, tiaraLog: { name: "서비스목록_앱다운로드", layer: "service_app_download" } } }),
                                                              i.dispatch("hasBanner", { hasBanner: !0 })),
                                                        e.abrupt("return", { serviceVisualVideo: u, serviceBanners: v, serviceInfo: y.title, serviceList: d, partners: _ })
                                                    );
                                                case 16:
                                                    return (e.prev = 16), (e.t0 = e.catch(1)), e.abrupt("return", s(301, "/el?e=rnf"));
                                                case 19:
                                                case "end":
                                                    return e.stop();
                                            }
                                    },
                                    e,
                                    null,
                                    [[1, 16]]
                                );
                            })
                        )();
                    },
                    created: function () {
                        this.$store.commit("SNB/SET_SNBDATA", { SNBData: [] });
                    },
                    mounted: function () {
                        this.$store.dispatch("setStoreBtn", { productBannerHeight: 0 }), Tiara.trackPageView({ page: "목록", section: "서비스", custom_props: "" });
                    },
                },
                c = (a(324), a(0)),
                l = Object(c.a)(
                    o,
                    function () {
                        var t = this,
                            e = t.$createElement,
                            a = t._self._c || e;
                        return a("div", { staticClass: "service_main" }, [
                            a(
                                "div",
                                { staticClass: "info_visual" },
                                [a("VisualVideo", { attrs: { videoData: t.serviceVisualVideo, type: t.videoOption, thumbInfo: t.visualThumbInfo, thumbType: "C", useThumbF: !0, tiaraLog: t.tiaraLog } })],
                                1
                            ),
                            t._v(" "),
                            a("section", { staticClass: "info_service" }, [
                                a("h4", { staticClass: "screen_out" }, [t._v("서비스 카테고리 안내")]),
                                t._v(" "),
                                a("p", { staticClass: "desc_service", domProps: { innerHTML: t._s(t.serviceInfo) } }),
                                t._v(" "),
                                a(
                                    "ul",
                                    { staticClass: "list_service" },
                                    t._l(t.serviceList, function (e, i) {
                                        return a(
                                            "li",
                                            { key: i, class: { single: "SINGLE" === e.image.type }, style: { background: "url(" + t.toThumb(t.commandThumbInfo, e.image.url)["data-src"] + ") 50% 50% /cover no-repeat" } },
                                            [
                                                a(
                                                    "router-link",
                                                    {
                                                        staticClass: "link_service",
                                                        attrs: {
                                                            to:
                                                                "/service" +
                                                                [
                                                                    e.commandCategory
                                                                        ? [e.commandCategory.categoryParentCode ? "/" + e.commandCategory.categoryParentCode : ""] + [e.commandCategory.code ? "/" + e.commandCategory.code : ""]
                                                                        : "/" + e.link.more,
                                                                ],
                                                            "data-tiara-action-name": "서비스목록_" + e.title + "클릭",
                                                            "data-tiara-layer": "service_" + e.relatedCode,
                                                        },
                                                    },
                                                    [
                                                        a("em", { staticClass: "emph_type", domProps: { innerHTML: t._s(e.title) } }),
                                                        t._v(" "),
                                                        a("p", { staticClass: "desc_command", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                        t._v(" "),
                                                        t.isMobile ? t._e() : a("div", { staticClass: "txt_more" }, [a("span", { domProps: { innerHTML: t._s(e.moreText) } }), a("IcoArrCircle")], 1),
                                                    ]
                                                ),
                                            ],
                                            1
                                        );
                                    }),
                                    0
                                ),
                            ]),
                            t._v(" "),
                            a(
                                "section",
                                { staticClass: "info_partner" },
                                [
                                    a("h4", { staticClass: "tit_partner", domProps: { innerHTML: t._s(t.partners.title) } }),
                                    t._v(" "),
                                    a("p", { staticClass: "desc_partner", domProps: { innerHTML: t._s(t.partners.subTitle) } }),
                                    t._v(" "),
                                    a("a", {
                                        staticClass: "link_partners",
                                        attrs: { href: t.partners.link.more, "data-tiara-action-name": "서비스목록_제휴제안클릭", "data-tiara-layer": "service_proposalbtn", target: "_blank" },
                                        domProps: { innerHTML: t._s(t.partners.moreText) },
                                    }),
                                    t._v(" "),
                                    t.isMobile
                                        ? a(
                                              "ul",
                                              { class: ["list_partners", { list_xscroll: t.serviceBanners.length > 1 }] },
                                              t._l(t.serviceBanners, function (e, i) {
                                                  return a("li", { key: i }, [
                                                      a("a", { staticClass: "link_partner", attrs: { href: e.link.more, "data-tiara-action-name": "서비스목록_파트너서비스클릭", "data-tiara-layer": "service_partner" } }, [
                                                          a(
                                                              "img",
                                                              t._b(
                                                                  {
                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.partnerThumbInfo[t.screenType], expression: "partnerThumbInfo[screenType]" }],
                                                                      staticClass: "img_partner",
                                                                      attrs: { alt: e.image.imgDescription },
                                                                  },
                                                                  "img",
                                                                  t.toThumb(t.partnerThumbInfo, e.image.url),
                                                                  !1
                                                              )
                                                          ),
                                                          t._v(" "),
                                                          e.title ? a("em", { staticClass: "emph_type", domProps: { innerHTML: t._s(e.title) } }) : t._e(),
                                                          t._v(" "),
                                                          a("p", { staticClass: "desc_command", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                      ]),
                                                  ]);
                                              }),
                                              0
                                          )
                                        : a("Banner", {
                                              attrs: { options: { slotSize: t.serviceBanners.length, isBtnStatic: !1, isLoop: !0, alignItem: "center", isPagingInside: !1 } },
                                              scopedSlots: t._u(
                                                  [
                                                      t._l(t.serviceBanners, function (e, i) {
                                                          return {
                                                              key: "slot" + i,
                                                              fn: function () {
                                                                  return [
                                                                      a("div", { key: "bnv" + i, staticClass: "link_item" }, [
                                                                          a("div", { staticClass: "layer_cont" }, [
                                                                              e.title ? a("em", { staticClass: "tit_bnv", domProps: { innerHTML: t._s(e.title) } }) : t._e(),
                                                                              t._v(" "),
                                                                              a(
                                                                                  "a",
                                                                                  {
                                                                                      staticClass: "wrap_cont",
                                                                                      attrs: { href: e.link.more || "javascript:;", "data-tiara-action-name": "서비스목록_파트너서비스클릭", "data-tiara-layer": "service_partner" },
                                                                                  },
                                                                                  [
                                                                                      a("strong", { staticClass: "sub_tit", domProps: { innerHTML: t._s(e.subTitle) } }),
                                                                                      t._v(" "),
                                                                                      a("span", { staticClass: "txt_more" }, [a("span", { domProps: { innerHTML: t._s(e.moreText) } }), a("IcoArrCircle")], 1),
                                                                                  ]
                                                                              ),
                                                                          ]),
                                                                          t._v(" "),
                                                                          a(
                                                                              "img",
                                                                              t._b(
                                                                                  {
                                                                                      directives: [{ name: "lazy-image", rawName: "v-lazy-image", value: t.partnerThumbInfo[t.screenType], expression: "partnerThumbInfo[screenType]" }],
                                                                                      staticClass: "img_bnv",
                                                                                      attrs: { alt: "" },
                                                                                  },
                                                                                  "img",
                                                                                  t.toThumb(t.partnerThumbInfo, e.image.url),
                                                                                  !1
                                                                              )
                                                                          ),
                                                                      ]),
                                                                  ];
                                                              },
                                                              proxy: !0,
                                                          };
                                                      }),
                                                  ],
                                                  null,
                                                  !0
                                              ),
                                          }),
                                ],
                                1
                            ),
                        ]);
                    },
                    [],
                    !1,
                    null,
                    "03d54f85",
                    null
                );
            e.default = l.exports;
        },
    ],
]);
