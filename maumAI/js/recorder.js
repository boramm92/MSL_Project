(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.Recorder = f()
    }
})(function () {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {exports: {}};
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }

        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
            1: [function (require, module, exports) {
                "use strict";

                module.exports = require("./recorder").Recorder;

            }, {"./recorder": 2}], 2: [function (require, module, exports) {
                'use strict';

                var _createClass = (function () {
                    function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ("value" in descriptor) descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }

                    return function (Constructor, protoProps, staticProps) {
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                    };
                })();

                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.Recorder = undefined;

                var _inlineWorker = require('inline-worker');

                var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : {default: obj};
                }

                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError("Cannot call a class as a function");
                    }
                }

                var Recorder = exports.Recorder = (function () {
                    function Recorder(source, cfg) {
                        var _this = this;
                        _classCallCheck(this, Recorder);

                        this.config = {
                            bufferLen: 4096,
                            numChannels: 1,
                            sampleRate: cfg.sampleRate
                        };
                        this.recording = false;
                        this.callbacks = {
                            getBuffer: [],
                            exportPCM: [],
                            recordingBuffer: []
                        };

                        Object.assign(this.config, cfg);
                        this.context = source.context;
                        this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

                        this.node.onaudioprocess = function (e) {
                            if (!_this.recording) return;

                            var buffer = [];
                            for (var channel = 0; channel < _this.config.numChannels; channel++) {
                                buffer.push(e.inputBuffer.getChannelData(channel));
                            }
                            _this.worker.postMessage({
                                command: 'record',
                                buffer: buffer
                            });
                        };

                        source.connect(this.node);
                        this.node.connect(this.context.destination); //this should not be necessary

                        var self = {};
                        this.worker = new _inlineWorker2.default(function () {
                                var recLength = 0,
                                    recBuffers = [],
                                    sampleRate = undefined,
                                    numChannels = undefined;
                                var recordBuffer;
                                var muteCount = 0;
                                var muteStart = false;
                                self.onmessage = function (e) {
                                    switch (e.data.command) {
                                        case 'init':
                                            init(e.data.config);
                                            break;
                                        case 'record':
                                            record(e.data.buffer);
                                            break;
                                        case 'exportPCM':
                                            exportPCM(e.data.type);
                                            break;
                                        case 'getBuffer':
                                            getBuffer(sampleRate);
                                            break;
                                        case 'recordingBuffer':
                                            recordingBuffer(sampleRate);
                                            break;
                                        case 'clear':
                                            clear();
                                            break;
                                    }
                                };

                                function init(config) {
                                    sampleRate = config.sampleRate;
                                    numChannels = config.numChannels;
                                    initBuffers();
                                }

                                function record(inputBuffer) {
                                    for (var channel = 0; channel < numChannels; channel++) {
                                        recBuffers[channel].push(inputBuffer[channel]);
                                    }
                                    recordBuffer = inputBuffer;
                                    recLength += inputBuffer[0].length;
                                }

                                function exportPCM(type) {
                                    var buffers = [];
                                    for (var channel = 0; channel < numChannels; channel++) {
                                        var buffer = mergeBuffers(recBuffers[channel], recLength);
                                        buffer = interpolateArray(buffer, sampleRate, 44100);
                                        buffers.push(buffer);
                                    }
                                    var interleaved = undefined;
                                    if (numChannels === 2) {
                                        interleaved = interleave(buffers[0], buffers[1]);
                                    } else {
                                        interleaved = buffers[0];
                                    }
                                    var dataview = encodePCM(interleaved);
                                    var audioBlob = new Blob([dataview], {type: type});

                                    self.postMessage({command: 'exportPCM', data: audioBlob});
                                }

                                function interpolateArray(data, newSampleRate, oldSampleRate) {
                                    // simpleRate ???????????? ??????
                                    var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
                                    var newData = new Array();
                                    var springFactor = new Number((data.length - 1) / (fitCount - 1));
                                    newData[0] = data[0]; // for new allocation
                                    for (var i = 1; i < fitCount - 1; i++) {
                                        var tmp = i * springFactor;
                                        var before = new Number(Math.floor(tmp)).toFixed();
                                        var after = new Number(Math.ceil(tmp)).toFixed();
                                        var atPoint = tmp - before;
                                        newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
                                    }
                                    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
                                    return newData;
                                }

                                function linearInterpolate(before, after, atPoint) {
                                    return before + (after - before) * atPoint;
                                }

                                function getBuffer(sampleRate) {
                                    var buffers = [];
                                    for (var channel = 0; channel < numChannels; channel++) {
                                        var buffer = mergeBuffers(recBuffers[channel], recLength);
                                        buffer = interpolateArray(buffer, sampleRate, 44100);
                                        buffers.push(buffer);
                                    }
                                    self.postMessage({command: 'getBuffer', data: buffers, sampleRate: sampleRate});
                                }

                                function clear() {
                                    recLength = 0;
                                    recBuffers = [];
                                    initBuffers();
                                }

                                function recordingBuffer(sampleRate) {
                                    var buffers = [];
                                    var buffer = mergeBuffers(recordBuffer, 4096);
                                    buffer = interpolateArray(buffer, sampleRate, 44100);
                                    buffers.push(buffer);
                                    self.postMessage({command: 'recordingBuffer', data: buffers, sampleRate: sampleRate});
                                }

                                function initBuffers() {
                                    for (var channel = 0; channel < numChannels; channel++) {
                                        recBuffers[channel] = [];
                                    }
                                }

                                function mergeBuffers(recBuffers, recLength) {
                                    var result = new Float32Array(recLength);
                                    var offset = 0;
                                    for (var i = 0; i < recBuffers.length; i++) {
                                        result.set(recBuffers[i], offset);
                                        offset += recBuffers[i].length;
                                    }
                                    return result;
                                }

                                function interleave(inputL, inputR) {
                                    var length = inputL.length + inputR.length;
                                    var result = new Float32Array(length);

                                    var index = 0,
                                        inputIndex = 0;

                                    while (index < length) {
                                        result[index++] = inputL[inputIndex];
                                        result[index++] = inputR[inputIndex];
                                        inputIndex++;
                                    }
                                    return result;
                                }

                                function floatTo16BitPCM(output, offset, input) {
                                    for (var i = 0; i < input.length; i++, offset += 2) {
                                        var s = Math.max(-1, Math.min(1, input[i]));
                                        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                                    }
                                }

                                function writeString(view, offset, string) {
                                    for (var i = 0; i < string.length; i++) {
                                        view.setUint8(offset + i, string.charCodeAt(i));
                                    }
                                }

                                function encodePCM(samples) {
                                    var buffer = new ArrayBuffer(samples.length * 2);
                                    var view = new DataView(buffer);

                                    floatTo16BitPCM(view, 0, samples);
                                    return view;
                                }
                            }

                            ,
                            self
                        );

                        this.worker.postMessage({
                            command: 'init',
                            config: {
                                sampleRate: this.config.sampleRate,
                                numChannels: this.config.numChannels
                            }
                        });

                        this.worker.onmessage = function (e) {
                            var cb = _this.callbacks[e.data.command].pop();
                            if (typeof cb == 'function') {
                                cb(e.data.data);
                            }
                        };
                    }

                    _createClass(Recorder, [{
                        key: 'record',
                        value: function record() {
                            this.recording = true;
                        }
                    }, {
                        key: 'stop',
                        value: function stop() {
                            this.recording = false;
                        }
                    }, {
                        key: 'clear',
                        value: function clear() {
                            this.worker.postMessage({command: 'clear'});
                        }
                    }, {
                        key: 'recordingBuffer',
                        value: function recordingBuffer(cb) {
                            cb = cb || this.config.callback;
                            if (!cb) throw new Error('Callback not set');

                            this.callbacks.recordingBuffer.push(cb);
                            this.worker.postMessage({command: 'recordingBuffer'});
                        }

                    }, {
                        key: 'getBuffer',
                        value: function getBuffer(cb) {
                            cb = cb || this.config.callback;
                            if (!cb) throw new Error('Callback not set');

                            this.callbacks.getBuffer.push(cb);

                            this.worker.postMessage({command: 'getBuffer'});
                        }
                    }, {
                        key: 'exportPCM',
                        value: function exportPCM(cb, mimeType) {
                            mimeType = mimeType || this.config.mimeType;
                            cb = cb || this.config.callback;
                            if (!cb) throw new Error('Callback not set');

                            this.callbacks.exportPCM.push(cb);

                            this.worker.postMessage({
                                command: 'exportPCM',
                                type: mimeType
                            });
                        }
                    }], [{
                        key: 'forceDownload',
                        value: function forceDownload(blob, filename) {
                            var url = (window.URL || window.webkitURL).createObjectURL(blob);
                            var link = window.document.createElement('a');
                            link.href = url;
                            link.download = filename || 'output.wav';
                            var click = document.createEvent("Event");
                            click.initEvent("click", true, true);
                            link.dispatchEvent(click);
                        }
                    }]);

                    return Recorder;
                })
                ();

                exports.default = Recorder;

            }, {"inline-worker": 3}
            ],
            3: [function (require, module, exports) {
                "use strict";

                module.exports = require("./inline-worker");
            }, {"./inline-worker": 4}], 4: [function (require, module, exports) {
                (function (global) {
                    "use strict";

                    var _createClass = (function () {
                        function defineProperties(target, props) {
                            for (var key in props) {
                                var prop = props[key];
                                prop.configurable = true;
                                if (prop.value) prop.writable = true;
                            }
                            Object.defineProperties(target, props);
                        }

                        return function (Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    })();

                    var _classCallCheck = function (instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    };

                    var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

                    var InlineWorker = (function () {
                        function InlineWorker(func, self) {
                            var _this = this;

                            _classCallCheck(this, InlineWorker);

                            if (WORKER_ENABLED) {
                                var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
                                var url = global.URL.createObjectURL(new global.Blob([functionBody], {type: "text/javascript"}));

                                return new global.Worker(url);
                            }

                            this.self = self;
                            this.self.postMessage = function (data) {
                                setTimeout(function () {
                                    _this.onmessage({data: data});
                                }, 0);
                            };

                            setTimeout(function () {
                                func.call(self);
                            }, 0);
                        }

                        _createClass(InlineWorker, {
                            postMessage: {
                                value: function postMessage(data) {
                                    var _this = this;

                                    setTimeout(function () {
                                        _this.self.onmessage({data: data});
                                    }, 0);
                                }
                            }
                        });

                        return InlineWorker;
                    })();

                    module.exports = InlineWorker;
                }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
            }, {}]
        },
        {}
        ,
        [1]
    )
    (1)
})
;
