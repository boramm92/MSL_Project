(function ($) {
	$.fn.regWavePlayer = function(settings) {
		var $this = $(this);
		var _handler = $this.data("wavePlayerHandler");
		_handler = new VoiceMediaJS.createWaveSurfer($this, settings);
		$this.data("wavePlayerHandler", _handler);
		return _handler;
	};
})(jQuery);

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
var VoiceMediaJS = (function() {
	function createWaveSurfer($this, settings) {
		var that = this;
		this._$e = $this;
		this._timeliner = settings.timeliner;
		this._isMinimap = settings.isMinimap || false;
		this._isRegion = settings.isRegion || false;
		this._isCreatable = settings.isCreatable || false;
		this._controller = settings.controller;
		this._regionHandler = settings.regionHandler;
		
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
					var btnHtml = $.templates("#waveControlTemplate").render();
					var $controller = $(that._controller).html(btnHtml);
					if($controller.find("button.btnPlay")) {
						$controller.find("button.btnPlay").on("click", function(){ wavesurfer.play(); });
					}
					if($controller.find("button.btnPause")) {
						$controller.find("button.btnPause").on("click", function(){ wavesurfer.pause(); });
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
					wavesurfer.play();
				});	
			} else {
				wavesurfer.load(audio, rashSourceData);
			}
			return wavesurfer;
		}
		
		// 서버에서 로드한 데이터를 표시할 떄
		function displayScriptAndRegion(data) {
			if(data == null) { /* skip */  } 
			else {
				data.forEach(function(region) {
					region.color = randomColor(0.1);
					region.drag = false;
					
					var map = {contextId : region.contextId, priority : region.priority };
					region.data = map;
					
		            wavesurfer.addRegion(region);
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
			if(isLastCheck) {
				var currentTime = wavesurfer.getDuration();
				lastCheckTime = addRegion(currentTime);
				timeStamp.end = currentTime;
			} else {
				var currentTime = wavesurfer.getCurrentTime();
				lastCheckTime = addRegion(currentTime);
				timeStamp.end = currentTime;
			}
			return timeStamp;
		}
		
		// delete region
		function removeRegion() {
			
		}		
		/************* FUNCTION FOR DRAWING *************/
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
			wavesurfer.addRegion(option);
			return currentTime;
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
			if(time == null) time = 0;
			wavesurfer.seekTo(time);
		}
		
		/************* COTROLLER CREATE *************/
		function create() {
			var plugin = addPlugIn();
			
			wavesurfer = WaveSurfer.create({
				container: "#"+$this.attr("id"),
				height: 100,
				pixelRatio: 1,
				scrollParent: true,
				normalize: true,
				minimap: that._isMiniMap,
				backend: 'MediaElement',
				drag: true,
				resize: true,
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
					color: 'rgba(1, 1, 1, 0.3)',
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
			return WaveSurfer.timeline.create({container: that._timeliner });
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
				var map = { start: region.start, end: region.end, color: region.end };
				regionDataList.push(map);
			});
		}
		
		return {
			// interface: function
			display: displayGraphic,				// file blob으로 wave surfer를 랜더링한다.
			displayScript: displayScriptAndRegion,	// wave surfer와 연계해 script를 랜더링한다. (region + script) with bulk's data
			play: isPlayingAndPlay,					// wave를 재생한다.
			drawSplitPoint: drawSplitPoint,					// 특정 timestamp의 region과 script를 추가한다.  with single data
			clearTimeStamp: clearRegion,				// wave split point 를 모두 지운다. (clearTimeStamp)
			seekTo: seekTo,							// cursor를 원하는 위치에 이동시킨 뒤 멈춤, default 0
			removeRegion: removeRegion				// local 변수의 데이터로 새로 그리기
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
	
	return {
		createWaveSurfer: createWaveSurfer,
		base64toBlob: base64toBlob
	}
})();