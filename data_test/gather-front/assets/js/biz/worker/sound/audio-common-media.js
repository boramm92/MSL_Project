(function ($) {
	$.fn.regAudioPlayer = function(settings) {
		var $this = $(this);
		var _handler = $this.data("audioPlayerHandler");
		_handler = new AudioPlayer.CreatePlayer($this, settings);
		$this.data("audioPlayerHandler", _handler);
		return _handler;
	};
	$.fn.regWavePlayer = function(settings) {
		var $this = $(this);
		var _handler = $this.data("wavePlayerHandler");
		_handler = new WaveJS.CreateWaveSurfer($this, settings);
		$this.data("wavePlayerHandler", _handler);
		return _handler;

	};
	$.fn.regRecorder = function(settings) {
		var $this = $(this);
		var _handler = $this.data("voiceRecorderHandler");
		_handler = new AudioRecorder.CreateRecorder($this, settings);
		$this.data("voiceRecorderHandler", _handler);
		return _handler;

	};
})(jQuery);

/**
 * Audio Player by HTML5
 */
var AudioPlayer = (function() {
	function CreatePlayer($this, settings) {
		var that = this;
		this._$e = $this;

		var $_player;
		var $_music;

		var mDuration;
		var btnPlay;
		var btnPause;
		var timelineWidth;
		var timeline;
		var playhead;
		var currTimer;

		init();
		function init() {
			createPlayer();
			bindEventHandler();
		}

		function createPlayer() {
			var playerHtml = $.templates("#audioPlayerTemplate").render();
			$_player = $this.html(playerHtml);
			$_music = $("#music", $_player).get(0);

			btnPlay = $("div.play", $_player);
			btnPause = $("div.pause", $_player);

			timeline = $("div.slider", $_player);
			playhead = $("div.elapsed", $_player);
			currTimer = $("p.timer", $_player);

			timelineWidth = timeline.get(0).offsetWidth - playhead.get(0).offsetWidth;
		}
		function bindEventHandler() {
			$_music.addEventListener("canplaythrough", canplaythrough, false);
			$_music.addEventListener("timeupdate", timeUpdate, false);
			$_music.addEventListener("pause", pauseEvent, false);
			$_music.addEventListener("play", playEvent, false);

			btnPlay.on("click", play);
			btnPause.on("click", pause);

			timeline.on("click", function(e) {
				$_music.currentTime = (e.offsetX / this.offsetWidth * $_music.duration);
			});

			$("span.plus", $_player).on("click", function() { $_music.currentTime = $_music.currentTime+5; });
			$("span.minus", $_player).on("click", function() { $_music.currentTime = $_music.currentTime-5; });

			$("button.fast", $_player).on("click", function() {$_music.playbackRate = $_music.playbackRate + 0.5; });
			$("button.normal", $_player).on("click", function() {$_music.playbackRate = 1.0; });
			$("button.slow", $_player).on("click", function() {$_music.playbackRate = $_music.playbackRate - 0.5 <= 0 ? 0.1 : $_music.playbackRate - 0.5; });
		}

		function play() {
			$_music.play();
			btnPlay.hide();
			btnPause.show();
		}

		function pause() {
			$_music.pause();
			btnPause.hide();
			btnPlay.show();
		}

		function canplaythrough() {
			mDuration = $_music.duration;
			$("p.timer_fr", $_player).html(convertTime(mDuration));
		}
		function timeUpdate() {
			var playPercent = timelineWidth * ($_music.currentTime / mDuration);
			playhead.css("width", playPercent + "px");

			if(mDuration >= 0) {
				var secondIn = Math.floor($_music.currentTime);
				currTimer.html(convertTime(secondIn));
			}
		}
		function pauseEvent() {
			$_music.playbackRate = 1.0;
		}
		function playEvent() {
		}

		// util
		function convertTime(longTime) {
			var min = "0";
			var sec = "00";

			min = longTime / 60;
			sec = longTime % 60;

			if (sec == 0) {
				sec = "00";
			}
			else if (Math.floor(sec) <= 9) {
				sec = "0" + sec.toFixed(1);
			} else {
				sec = sec.toFixed(1);//Math.floor(sec);
			}
			return Math.floor(min) + ":" + sec;
		}

		return $_player;
	}

	return {
		CreatePlayer: CreatePlayer
	}
})();

/**
 * Voice Recorder Custom Controller
 */
var AudioRecorder = (function() {
	function CreateRecorder($this, settings) {
		var that = this;
		this._$e = $this;
		// this._mimeType = settings.mimeType != null ? settings.mimeType : "audio/webm;codecs=opus";
		// this._fileType = settings.fileType != null ? settings.fileType : "audio/ogg;codecs=opus";
		this._mimeType = settings.mimeType != null ? settings.mimeType : "audio/wav";
		this._fileType = settings.fileType != null ? settings.fileType : "audio/wav";

		this._controller = settings.controller;

		var $_recorder;

		// 생성시 발동
		init();
		function init() {
			createControl();
			bindEventHandler();
		}

		function createControl() {
			var recorderHtml = $.templates("#recorderTemplate").render();

			$_recorder = $this.html(recorderHtml);
			if(that._controller != null) {
				var btnHtml = $.templates("#waveControlTemplate").render();
				var $controller = $(that._controller).html(btnHtml);
				if($controller.find("em.fa-microphone")) {
					$controller.find("em.fa-microphone").on("click", function(){
						stopRecord($(this));
					});
				}
				/*if($controller.find("em.fa-stop")) {
					$controller.find("em.fa-stop").on("click", function(){
						pausePlay($(this));
					});
				}*//*
				if($controller.find("button.btnRetry")) {
					$controller.find("button.btnRetry").on("click", function(){
						retryRecord();
					});
				}*/
			}

		}
		function bindEventHandler() {
			$("button.rcd_start", $_recorder).on("click", startRecord);
			$("button.rcd_end", $_recorder).on("click", stopRecord);
			$("button.rcd_listen", $_recorder).on("click", startPlay);
			$("button.rcd_stop", $_recorder).on("click", pausePlay);
			$("button.re_rcd", $_recorder).on("click", retryRecord);
		}

		function startRecord() {
			getPermissionForRecord();
			var $this = $(this);
			$('button.rcd_end', $_recorder).addClass('on')
			record(function() {
				isCheck = false;
				startTimer();
				$this.removeClass('on');
			});
		}
		function stopRecord($this) {
			stopTimer();
			stop();

			$(this).removeClass('on');
			$('button.rcd_listen,button.re_rcd', $_recorder).addClass('on');
		}
		function startPlay() {
			if(au != null) {
				console.log("--- start play");
				$(this).removeClass('on');
				$('button.rcd_stop', $_recorder).addClass('on');
				au.play();
			} else {
				$.alert("There is no recorded content.");
			}
		}
		function pausePlay($this) {
			if(au != null) {
				console.log("--- start pause");
				$(this).removeClass('on');
				$('button.rcd_listen', $_recorder).addClass('on');
				au.pause();
			}
		}
		function retryRecord() {
			if(au != null) {
				if(au.status) {

				}
				console.log("--- start pause");
				au.pause();
			}
			$('button', $_recorder).removeClass('on');
			startRecord();
		}

		/** voice recorder **/
		function getPermissionForRecord() {
			// 브라우저의 미디어 권한 불러오기
			if(navigator.permissions != 'undefined' && navigator.permissions != undefined) {
				navigator.permissions.query({name:'microphone'}).then(function(result) {
					if (result.state == 'granted') {	// 마이크 실행권한 있음
						console.log("granted");
					} else if (result.state == 'prompt') {	// 마이크 실행권한 없음
						console.log("prompt");
					} else if (result.state == 'denied') {	// 마이크 실행권한 차단됨
						console.log("denied");
					}
					result.onchange = function() {
						console.log("changed permission for microphone");
					};
				});
			}
		}
		var timerId = null;
		var timeSec = 0;
		function startTimer() {
			PrintTime();
			if(timerId == null) {
				timerId = setInterval(PrintTime, 1000);
			}
		}
		function PrintTime() {
			var ss = timeSec%60;
			var mi = parseInt(timeSec/60);
			timeSec += 1;
			$("button.rcd_end em").text((mi < 10 ? "0"+mi : mi)+" : "+(ss < 10 ? "0"+ss : ss));
		}
		function stopTimer() {
			if(timerId != null) {
				clearInterval(timerId);
				$("button.rcd_end em").text("00 : 00");
				timerId = null;
				timeSec = 0;
			}
		}

		var REC, REC2;
		var chunks = [];
		var audio_stream;
		var blob, blobTemp, au;	// blob : PCM (저장용), blobTemp : webm (재생용), au : 재생도구

		var isRecording = false;
		var isCheck = false;
		var isNextGen = true;
		function record(callback) {
			function hasGetUserMedia() {
				return !!(
					navigator.mediaDevices ||
					navigator.webkitGetUserMedia ||
					navigator.mozGetUserMedia ||
					navigator.msGetUserMedia
				);
			}
			if(hasGetUserMedia()) {
				var audio_context = new AudioContext;
				var promise = navigator.mediaDevices.getUserMedia({audio:true})
					.then(
						stream => {
							// 버퍼 초기화
							chunks = [];
							audio_stream = stream;
							//if(isNextGen) {
								// // 레코더 초기화
								REC = new Recorder(audio_context.createMediaStreamSource(stream)
									, {sampleRate: 8000});
							//} else {
								REC2 = new MediaRecorder(stream
									, {
									mimeType: that._mimeType
								});
								// 레코더 이벤트 핸들러 등록
								REC2.ondataavailable = e => { chunks.push(e.data); }
								REC2.onstart 		= e => { console.log("---- record start ----"); }
								REC2.onerror 		= e => { console.log("---- record error: " + e + "----"); }
								REC2.onstop 			= e => {
									console.log("---- record stop ----");
									stream.getTracks().forEach(t => t.stop());
									blobTemp = new Blob(chunks, {
										type: that._fileType
									});
									au = new Audio(URL.createObjectURL(blobTemp));
									au.onpause = e => {
										$('button.rcd_stop', $_recorder).removeClass('on');
										$('button.rcd_listen', $_recorder).addClass('on');
										isCheck = true;
									};
									au.controls = true;
								}
							//}
							startRecording(callback);
						}
					).catch(function(error) {
						$.alert("Check the device for recording.");
					});
			} else {
				console.log("음성녹음 지원 안함");
			}
		}

		function startRecording(callback) {
			if(!isRecording) {
				//isNextGen ? REC.record() : REC.start();
				REC.record();
				REC2.start();
				isRecording = true;
				if(typeof callback === 'function') {
					callback();
				}
				console.log("---- record start ----");
			}
		}

		function stop() {
			REC && REC.stop();
			REC2 && REC2.stop();
			isRecording = false;

			if(isNextGen) {
				var _AudioFormat = "aduio/pcm";
				audio_stream.getTracks().forEach(t => t.stop());
				REC && REC.exportPCM(function(AudioBLOB) {
					blob = AudioBLOB;
					// var url = URL.createObjectURL(AudioBLOB);
					// au = new Audio(url);
					// au.onpause = e => {
					// 	console.log("audio pause");
					// 	$('button.rcd_stop', $_recorder).removeClass('on');
					// 	$('button.rcd_listen', $_recorder).addClass('on');
					// 	isCheck = true;
					// };
					// au.controls = true;
					REC.clear();
				}, (_AudioFormat || "audio/pcm"));
			}
		}

		function getChunkData() {
			return chunks;
		}

		function getAudioBlob() {
			return blob;
		}

		function isChecked() {
			return isCheck;
		}

		return {
			getChunkData: getChunkData,
			getAudioBlob: getAudioBlob,
			isChecked: isChecked
		}
	}

	// Meter class that generates a number correlated to audio volume.
	// The meter class itself displays nothing, but it makes the
	// instantaneous and time-decaying volumes available for inspection.
	// It also reports on the fraction of samples that were at or near
	// the top of the measurement range.
	function SoundMeter(context) {
		this.context = context;
		this.instant = 0.0;
		this.slow = 0.0;
		this.clip = 0.0;
		this.script = context.createScriptProcessor(2048, 1, 1);
		var that = this;
		this.script.onaudioprocess = function(event) {
			var input = event.inputBuffer.getChannelData(0);
			var i;
			var sum = 0.0;
			var clipcount = 0;
			for (i = 0; i < input.length; ++i) {
				sum += input[i] * input[i];
				if (Math.abs(input[i]) > 0.99) {
					clipcount += 1;
				}
			}
			that.instant = Math.sqrt(sum / input.length);
			that.slow = 0.95 * that.slow + 0.05 * that.instant;
			that.clip = clipcount / input.length;
		};
	}

	SoundMeter.prototype.connectToSource = function(stream, callback) {
		try {
			this.mic = this.context.createMediaStreamSource(stream);
			this.mic.connect(this.script);
			// necessary to make sample run, but should not be.
			this.script.connect(this.context.destination);
			if (typeof callback !== 'undefined') {
				callback(null);
			}
		} catch (e) {
			console.error(e);
			if (typeof callback !== 'undefined') {
				callback(e);
			}
		}
	};
	SoundMeter.prototype.stop = function() {
		this.mic.disconnect();
		this.script.disconnect();
	};

	return {
		CreateRecorder: CreateRecorder
	}
})();

/**
 * # wavesurfer event type
 * + region
 * 		- region-created
 * 		- region-updated
 * 		- region-update-end
 * 		- region-removed
 * 		- region-play
 * 		- region-in
 * 		- region-out
 * 		- region-mouseenter
 * 		- region-mouseleave
 * 		- region-click
 * 		- region-dblclick
 */
var WaveJS = (function() {
	var $mActionHander;
	function CreateWaveSurfer($this, settings) {
		var that = this;
		this._$e = $this;
		this._timeliner = settings.timeliner;
		this._isMinimap = settings.isMinimap || false;
		this._isRegion = settings.isRegion || false;
		this._isCreatable = settings.isCreatable || false;
		this._controller = settings.controller;
		this._controlType = settings.controlType;
		this._regionHandler = settings.regionHandler;
		this._height = settings.waveHeight || 100;
		$mActionHander = settings.action;

		var wavesurfer;
		var regionDataList = [];

		// 변경이 필요함
		var lastCheckTime = 0;

		init();
		function init() {
			if($this == null) {
				return false;
			}
			create();
			bindEventHandler();
		}

		/************* EVENT HANDLER *************/
		function bindEventHandler() {
			if(wavesurfer != null) {
				// Region이 만들어 졌을 때
				wavesurfer.on("region-created", function(region) {
					that._regionHandler(region, "region-created");
//					region.on("remove", function() {
//					});
				});
				// 드래그 또는 re-sizing이 종료 됐을 때
				wavesurfer.on("region-update-end", function(region, e) {
					that._regionHandler(region, "update-end");
				});
				// Region에 play bar가 클릭됐을 때
				wavesurfer.on("region-click", function(region, e) {
					e.stopPropagation();
					if(typeof that._regionHandler === 'function') {
						that._regionHandler(region, "region-click");
					}
				});
				wavesurfer.on("region-dblclick", function(region, e) {
					e.stopPropagation();
					if(typeof that._regionHandler === 'function') {
						that._regionHandler(region, "region-dblclick");
					}
				});
				// Region의 음성이 재생중일 때
				wavesurfer.on("region-play", function(region) {
					if(typeof that._regionHandler === 'function') {
						that._regionHandler(region, "region-play");
					}
					// region에서 playbar가 벗어날 때
					region.once("out", function() {
						if(typeof that._regionHandler === 'function') {
							that._regionHandler($(this), "out");
						}
					});
				});
				// Region에 커서가 In 됐을 때
				/*wavesurfer.on("region-in", function(region) {
					if(typeof that._regionHandler === 'function') {
						that._regionHandler(region, "region-in");
					}
				});*/
				// 템플릿에 포함된 버튼이벤트 핸들러 (재생버튼, 일시정지버튼)
				if(that._controller != null) {
					var templateName = that._controlType == 1 ? "waveControlSimpleTemplate" : "waveControlTemplate";
					var btnHtml = $.templates("#"+templateName).render();
					var $controller = $(that._controller).html(btnHtml);
					if($controller.find("div.play")) {
						$controller.find("div.play").on("click", function(){
							wavesurfer.play();
							$(this).hide();
							$controller.find("div.pause").show();
						});
					}
					if($controller.find("div.pause")) {
						$controller.find("div.pause").on("click", function(){
							wavesurfer.pause();
							$(this).hide();
							$controller.find("div.play").show();
						});
					}
					if($controller.find("div.multiply button.slow")) {
						$controller.find("div.multiply button.slow").on("click", function(){
							slowly();
						});
					}
					if($controller.find("div.multiply button.normal")) {
						$controller.find("div.multiply button.normal").on("click", function(){
							normalSpeed();
						});
					}
					if($controller.find("div.multiply button.fast")) {
						$controller.find("div.multiply button.fast").on("click", function(){
							fastest();
						});
					}
				}
			}
		}

		function displayGraphic(waveSource, rashSourceData) {
			if(wavesurfer == null) {
				return;
			}
			var audio = new Audio();
			audio.src = URL.createObjectURL(waveSource);

			// rashSourceData는 json형태의 형식을 준수할 필요가 있음
			if(rashSourceData == null) {
				wavesurfer.util.ajax({
					responseType: 'json',
					url: '/assets/data/rashomon.json'			// default rashomon
				})
					.on('success', function(data, textStatus, jqXHR) {
						//wavesurfer.load(audio, data);
						wavesurfer.load(audio);
					});
			} else {
				wavesurfer.load(audio, rashSourceData);
			}
			return wavesurfer;
		}

		// 서버에서 로드한 데이터를 표시할 떄
		function displayScriptAndRegion(data) {
			var index = 0;
			if(data == null) { /* skip */  }
			else {
				data.forEach(function(region) {
					region.color = randomColor(0.1);
					region.drag = false;

					var map = {contextId : region.contextId, priority : region.priority };
					region.data = map;

					var regionProp = wavesurfer.addRegion(region);
					region.regionId = regionProp.id;

					// 데이터를 불러온 다음 마지막으로 이동하기 위한 구문
					seekTo(region.end);
					lastCheckTime = region.end;

					data[index++] = region;
				});
			}
			saveRegions();	// region정보 local변수에 저장
		}

		// 추가버튼 클릭시, Region에 추가한다. 
		// 화면 데이터 저장을 위해 생성한 값을 반환한다.
		function drawSplitPoint(isLastCheck) {
			// 반환할 데이터 생성
			var timeStamp = {};
			timeStamp.start = lastCheckTime;

			if(lastCheckTime == wavesurfer.getDuration()) {
				timeStamp.end = -1;
				timeStamp.start = -1;
				return timeStamp;
			}

			var rtnRegion;
			if(isLastCheck) {
				var currentTime = wavesurfer.getDuration();
				rtnRegion = addRegion(currentTime);
				lastCheckTime = rtnRegion.end;
				timeStamp.end = currentTime;
			} else {
				var currentTime = wavesurfer.getCurrentTime();
				if(currentTime > timeStamp.start) {
					rtnRegion = addRegion(currentTime);
					lastCheckTime = rtnRegion.end;
					timeStamp.end = currentTime;
				} else {
					timeStamp.end = currentTime;
					return timeStamp;
				}
			}
			timeStamp.regionId = rtnRegion.id;
			timeStamp.color = rtnRegion.color;
			return timeStamp;
		}

		// delete region
		function removeRegion(regionId) {
			var region = wavesurfer.regions.list[regionId];
			region.remove();
		}
		/************* FUNCTION FOR DRAWING *************/
		// return region
		function addRegion(currentTime) {
			if(lastCheckTime >= currentTime) {
				return lastCheckTime;
			}
			var option = {
				"start": lastCheckTime,
				"end": currentTime,
				"color":randomColor(0.1),
				"drag":false,
				"resize":true
			};
			return wavesurfer.addRegion(option);
		}
		function clearRegion() {
			lastCheckTime = 0;
			wavesurfer.clearRegions();

			saveRegions();	// region정보 local변수에 저장
		}

		/************* FUNCTION FOR PLAYING *************/
		function isPlayingAndPlay(start, end) {
			var bIsPlaying = false;
			if(wavesurfer != null) {
				if(start != null) {
					if(end != null) { wavesurfer.play(start, end); }
					else { wavesurfer.play(start); }
					bIsPlaying = true;
				} else {
					if(wavesurfer.isPlaying()) { bIsPlaying = false; } else { bIsPlaying = true; }
					wavesurfer.playPause();
				}
			} else {
				$.alert("재생할 음성을 로드해 주세요.");
				bIsPlaying = false;
			}
			return bIsPlaying;
		}

		function seekTo(time) {
			wavesurfer.pause();
			var temp = 0;
			if(time == null || isNaN(time)) {
				time = 0;
				temp = 0;
			} else {
				if(isNaN(wavesurfer.getDuration())) {
				} else {
					if(time > 0) {
						time = time/wavesurfer.getDuration();
					} else {
						time = 0;
					}
				}
			}
			if(time > 1 || time <= 0) {}
			else {
				wavesurfer.seekTo(time);
			}
			lastCheckTime = temp;
		}

		/*function seekTo(time) {
			var temp = isNaN(time) ? 0 : time;
			wavesurfer.pause();
			if(time == null) {
				time = 0;
			} else {
				if(isNaN(wavesurfer.getDuration())) {
				} else {
					time = time/wavesurfer.getDuration();
				}
			}
			if(time > 1) {}
			else {
				wavesurfer.seekTo(time);
			}
			lastCheckTime = temp;
		}*/

		/************* COTROLLER CREATE *************/
		function create() {
			var plugin = addPlugIn();

			wavesurfer = WaveSurfer.create({
				container: "#"+$this.attr("id"),
				height: that._height,
				pixelRatio: 1,
				scrollParent: true,
				normalize: true,
				minimap: that._isMiniMap,
				backend: 'MediaElement',
				drag: true,
				resize: true,
				//waveColor: '#ffcc01',
				//progressColor: '#ff0000',
				/*barWidth: 2,
			    barHeight: 1,
			    barGap: null,*/ // about bar
				/*renderer: 'SplitWavePointPlot',
			    plotFileUrl: '/assets/data/data.txt',
			    //plotArray:*/
				plugins: plugin
			});
			if(that._isRegion && that._isCreatable) {
				wavesurfer.enableDragSelection({
					color: 'rgba(37,153,214, 0.3)',
					drag: false,
					resize: true
				});
			}
		}
		function addPlugIn() {
			var plugin = [];
			if(that._isMinimap) {
				plugin.push(createMinimap());
			}
			if(that._timeliner != null) {
				plugin.push(createTimeline());
			}
			if(that._isRegion) {
				plugin.push(createRegion());
			}
			return plugin;
		}

		/************* PLUGIN CREATE *************/
		function createMinimap() {
			return WaveSurfer.minimap.create({height: 30, waveColor: '#ddd', progressColor: '#999', cursorColor: '#999'});
		}
		function createTimeline() {
			return WaveSurfer.timeline.create({container: that._timeliner, height: 10});
		}
		function createRegion() {
			return WaveSurfer.regions.create({ drag:true, resize:true });
		}

		/************* UTILITY *************/
		var colorPrior = 0;
		function randomColor(alpha) {
			colorPrior++;
			var checkNo = colorPrior % 2;
			return (
				'rgba(' +
				[ ~~(Math.random() * (checkNo == 0? 1 : 255)), ~~(Math.random() * (checkNo == 1? 1 : 255)), ~~(Math.random() * (checkNo == 2? 1 : 255)), alpha || 1 ]
				+ ')'
			);
		}

		// local변수에 Region배열정보 저장
		function saveRegions() {
			Object.keys(wavesurfer.regions.list).map(function(id) {
				var region = wavesurfer.regions.list[id];
				var map = { start: region.start, end: region.end, color: region.end, id: region.id };
				regionDataList.push(map);
			});
		}

		function slowly(){
			//var playRate = wavesurfer.getPlaybackRate() - 0.25;
			var playRate = wavesurfer.getPlaybackRate() * 0.5;
			if(playRate > 0) {
				wavesurfer.setPlaybackRate(playRate);
			} else {
				wavesurfer.pause();

				$controller.find("div.pause").show();
				$controller.find("div.pause").show();
			}
		}
		function normalSpeed(){ wavesurfer.setPlaybackRate(1); }
		function fastest(){
			//var playRate = wavesurfer.getPlaybackRate() + 0.25;
			var playRate = wavesurfer.getPlaybackRate() * 1.5;
			if(playRate > 0) {
				wavesurfer.setPlaybackRate(playRate);
			} else {
				wavesurfer.pause();
			}
		}

		return {
			// interface: function
			display: displayGraphic,				// file blob으로 wave surfer를 랜더링한다.
			displayScript: displayScriptAndRegion,	// wave surfer와 연계해 script를 랜더링한다. (region + script) with bulk's data
			play: isPlayingAndPlay,					// wave를 재생한다.
			drawSplitPoint: drawSplitPoint,					// 특정 timestamp의 region과 script를 추가한다.  with single data
			clearTimeStamp: clearRegion,				// wave split point 를 모두 지운다. (clearTimeStamp)
			seekTo: seekTo,							// cursor를 원하는 위치에 이동시킨 뒤 멈춤, default 0
			removeRegion: removeRegion,				// local 변수의 데이터로 새로 그리기
			// 속도 조절
			slowly: slowly,
			normalSpeed: normalSpeed,
			fastest: fastest
		}
	}

	function base64toBlob(base64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		return new Blob(byteArrays, { type: contentType });
	}

	function RegionEventHandler(region, e) {
		if(e == "region-play") {
		}
		else if(e == "region-click") {
			if(!$.isEmpty($mActionHander) && typeof $mActionHander.click === 'function') {
			}
			else { region.play(); }
		}
		else if(e == "region-created") {
			if(!$.isEmpty($mActionHander) && typeof $mActionHander.create === 'function') {
				$mActionHander.create(region);
			}
		}
		else if(e == "update-end") {
			if(!$.isEmpty($mActionHander) && typeof $mActionHander.update === 'function') {
				$mActionHander.update(region);
			}
		}
		else if(e == "region-dblclick") {
			if(!$.isEmpty($mActionHander) && typeof $mActionHander.dblclick === 'function') {
				$mActionHander.dblclick(region);
			}
		}
		else if(e == "out") {}
		else if(e == "region-in") {}
		else { console.log("undefined event: " + e); }
	}

	return {
		CreateWaveSurfer: CreateWaveSurfer,
		base64toBlob: base64toBlob,
		RegionEventHandler: RegionEventHandler
	}
})();