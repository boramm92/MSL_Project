(function ($){
	$.fn.initImageProject = function(settings) {
		var $this = $(this);
		var _object = new ImageJS.createJobInfo($this, settings);
		return _object;
	}

	$.fn.regContextUi = function(setting) {
		var $this = $(this);
		var _ui = new ImageUI.CreateUiHandler($this, setting);
		return _ui;
	}
})(jQuery);

var ImageUI = (function() {
	// ABOUT UI
	var $ui_canvas;
	var $ui_scaleTools;
	var $ui_drawTools;

	var sourceImage;
	var uiContext;

	var paramTemporary = null;
	var currentScale = 1;
	var zoomDelta = 0.1;

	var startX = 0, startY = 0, isMove = false;
	var moveXTemp = 0, moveYTemp = 0;
	var movedX = 0, movedY = 0;

	var currentDrawMode = null;
	var resizeX = 0, resizeY = 0;
	var offsetX = 0, offsetY = 0;
	var isDrag = false;
	var isResizeDrag = false;
	var expectResize = -1;
	var canvasValid = false;

	var MINIMUM_SIZE = 50;

	function ResizableBox() {
		this.x = 0;
		this.y = 0;
		this.width = 1;
		this.height = 1;
		this.fill = '';
		this.text = '';
	}
	ResizableBox.prototype = {
		draw: function() {
			var scaleX = (this.x-($ui_canvas.width/2)) * currentScale;
			var scaleY = (this.y-($ui_canvas.height/2)) * currentScale;
			var scaleW = this.width * currentScale;
			var scaleH = this.height * currentScale;

			// ResizeBox 스타일 지정
			if(this.width == MINIMUM_SIZE && this.height == MINIMUM_SIZE) {
				uiContext.fillStyle = '#00FF0020';
			} else {
				uiContext.fillStyle = this.fill;
			}
			uiContext.font = 35 + 'px sans-serif';
			uiContext.fillRect(scaleX, scaleY, scaleW, scaleH);

			if(this.width == MINIMUM_SIZE && this.height == MINIMUM_SIZE) {
				uiContext.strokeStyle = '#00FF00';
			} else {
				uiContext.strokeStyle = '#FFCC01';
			}
			uiContext.lineWidth = 5;
			uiContext.strokeRect(scaleX, scaleY, scaleW, scaleH);

			if (this.text) {
				uiContext.fillStyle = '#00000080';
				uiContext.fillRect(scaleX+uiContext.lineWidth, scaleY+uiContext.lineWidth,this.text.length * 35, 35);
				uiContext.fillStyle = '#ffffff';
				uiContext.fillText(this.text, scaleX, scaleY + 35);
			}
		}
	};

	function CreateUiHandler($this, settings) {
		var that = this;
		if(settings != null) {
			that._strokeColor = settings.strokeColor || '#FFCC01';
			that._checkPoint = settings.checkPoint;
			that._redraw = settings.redraw;
			that._drawType = settings.operateType || 'Segmentation';
		}

		init();
		function init() {
			// 화면의 UI Frame을 객체화
			$ui_canvas = $this.find("canvas#dataSourceCanvas") ? $this.find("canvas#dataSourceCanvas").get(0) : null;
			$ui_scaleTools = $this.find(".size_control") || null;
			$ui_drawTools = $this.find(".masking_tool") || null;

			bindEventHandler();
		}

		function bindEventHandler() {
			$this.find("canvas#dataSourceCanvas").on("click", generatePolygon);
			// zoom
			$ui_scaleTools.find(".btn_minus").on("click", zoomOut);
			$ui_scaleTools.find(".btn_plus").on("click", zoomIn);
			$ui_scaleTools.find(".btn_size_reset").on("click", zoomReset);
			$this.find("canvas#dataSourceCanvas").on("mousewheel", function(event) {
				event.originalEvent.wheelDelta > 0 ? zoomIn(event) : zoomOut(event);
				event.preventDefault();
			});

			$this.find("img#dataSource").on("load", function() {
				$ui_canvas.width = $(this).prop("naturalWidth");
				$ui_canvas.height = $(this).prop("naturalHeight");

				sourceImage = $(this).get(0);
				uiContext = $ui_canvas.getContext('2d');
				uiContext.translate($ui_canvas.width/2, $ui_canvas.height/2);
				uiContext.strokeStyle = that._strokeColor;
				uiContext.fillStyle = that._strokeColor+"60";
				uiContext.fontColor = '#FFFFFF';
				uiContext.font = "bold 12px Calibri";

				clearCanvas();
				drawImage();

				if(typeof that._redraw === 'function') {
					that._redraw();
				}
				$(this).disabled = true;
			});
			$this.find("canvas#dataSourceCanvas").on("mousemove", moveCanvas);
			$this.find("canvas#dataSourceCanvas").on("mousedown", mousedown);
			$this.find("canvas#dataSourceCanvas").on("mouseup", mouseup);
			$this.find("canvas#dataSourceCanvas").on("contextmenu", function(event) {
				event.preventDefault();
			});
		}

		function invalidate() {
			canvasValid = false;
		}
		function generatePolygon(event) {
			if(typeof that._checkPoint === 'function') {
				var pos = getMousePos(event);
				pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - moveXTemp;
				pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - moveYTemp;
				that._checkPoint(pos);
			}
		}
		function setDrawType(drawType) {
			if(uiContext == null) return;
			that._drawType = drawType;
			if(drawType == 'Keypoint') {
				uiContext.strokeStyle = "#FF0000";
				uiContext.fillStyle = "#FF0000";
				currentDrawMode = drawPointPath;
			} else if(drawType == 'Segmentation') {
				uiContext.strokeStyle = that._strokeColor;
				uiContext.fillStyle = that._strokeColor+"60";
				currentDrawMode = drawClosingPath;
			} else if(drawType == 'boxing') {
				currentDrawMode = drawBoxing;
			} else {
				currentDrawMode = null;
			}
		}

		function drawItems(param) {
			if(currentDrawMode == null) return;
			currentDrawMode(param);
		}

		function drawPointPath(param) {
			clearCanvas();
			drawImage();
			if($.isEmptyObject(param)) {
				param = [];
				paramTemporary = param;
			}
			else if(param == true) {
				param = paramTemporary;
			} else {
				paramTemporary = param;
			}
			if(typeof param === 'object') {
				var x=0, y=0;
				$.each(param, function(i, v) {
					if(Array.isArray(v)) {
						var nPointCount = 1;
						$.each(v, function(index, value) {
							x = index%2 == 0 ? value : x;
							y = index%2 == 1 ? value : y;

							if(index%2) {	// 홀수일때, y가 입력 됐을 때
								var scaledX = (x-($ui_canvas.width/2)) * currentScale;
								var scaledY = (y-($ui_canvas.height/2)) * currentScale;
								var scaledTextPosY = (y-($ui_canvas.height/2)-5) * currentScale;

								uiContext.beginPath();
								uiContext.arc(scaledX, scaledY, 3, 0, 2 * Math.PI);
								uiContext.fillText(nPointCount++, scaledX, scaledTextPosY);
								uiContext.closePath();
								uiContext.fill();
							}
						});
						return;
					}
				});
			}
		}
		function drawClosingPath(param) {
			clearCanvas();
			drawImage();
			if($.isEmptyObject(param)) {
				// param = paramTemporary;
				param = [];
				paramTemporary = param;
			}
			else if(param == true) {
				param = paramTemporary;
			} else {
				paramTemporary = param;
			}
			if(typeof param === 'object') {
				var x=0, y=0;
				uiContext.beginPath();
				$.each(param, function(i, v) {
					if(Array.isArray(v)) {
						var nPointCount = 1;
						uiContext.beginPath();
						$.each(v, function(index, value) {
							x = index%2 == 0 ? value : x;
							y = index%2 == 1 ? value : y;

							// if(index%2) {	// 홀수일때, y가 입력 됐을 때
							// 	uiContext.arc(x-($ui_canvas.width/2),y-($ui_canvas.height/2), 2, 0, 2 * Math.PI);
							// }
							if(index%2) {	// 홀수일때, y가 입력 됐을 때
								// 그래픽은 Canvas 의 센터 기준으로 찍힌다
								var scaleX = (x-($ui_canvas.width/2)) * currentScale;
								var scaleY = (y-($ui_canvas.height/2)) * currentScale;
								// uiContext.arc(x-($ui_canvas.width/2),y-($ui_canvas.height/2), 2, 0, 2 * Math.PI);
								uiContext.arc(scaleX,scaleY, 2, 0, 2 * Math.PI);
							}
						});
						// 같은 Item에 다른 Segment 구분하기 위해서
						uiContext.closePath();
						uiContext.stroke();
						uiContext.fill();
						return;
					}
					uiContext.closePath();
					uiContext.stroke();
					uiContext.fill();
				});
			}
		}
		function drawBoxing(param) {
			clearCanvas();
			drawImage();
			if($.isEmptyObject(param)) {
				param = [];
				paramTemporary = param;
				boxes = [];
			}
			else if(param == true) {
				param = paramTemporary;
			} else {
				paramTemporary = param;
			}

			if(typeof param === 'object') {
				var x=0, y=0;
				uiContext.beginPath();
				boxes = [];
				$.each(param, function(i, v) {
					var itemBox = new ResizableBox();
					itemBox.x = v.Box.x;
					itemBox.y = v.Box.y;
					itemBox.width = v.Box.w;
					itemBox.height = v.Box.h;
					itemBox.fill = "#0000CC30";
					itemBox.text = v.category_name;
					itemBox.ctg = v.category_id;
					itemBox.draw(v.isSelected);

					boxes.push(itemBox);
				});
			}
		}

		function zoomOut(event) {
			var scale = currentScale - zoomDelta;
			if(scale > 0.3) {
				currentScale = scale;
				clearCanvas();
				if(currentDrawMode != null) {
					currentDrawMode(true);
				}
			}
			$ui_scaleTools.find(".descScale").html(parseInt(currentScale * 100) + " %");
		}
		function zoomIn(event) {
			var scale = currentScale + zoomDelta;
			if(scale < 3.1) {
				currentScale = scale;
				clearCanvas();
				if(currentDrawMode != null) {
					currentDrawMode(true);
				}
			}
			$ui_scaleTools.find(".descScale").html(parseInt(currentScale * 100) + " %");
		}
		function zoomReset() {
			currentScale = 1;
			clearCanvas();
			if(currentDrawMode != null) {
				currentDrawMode(true);
			}
			$ui_scaleTools.find(".descScale").html(parseInt(currentScale * 100) + " %");
		}

		function mousedown(event) {
			if(event.buttons == 2) {
				var pos = getMousePos(event);
				startX = pos.x;
				startY = pos.y;
				movedX = startX;
				movedY = startY;
				isMove = true;
			}
		}
		function mouseup(event) {
			// if(event.button == 2) {
			// 	isMove = false;
			// }
		}
		function moveCanvas(event) {
			if(isMove && event.buttons == 2) {
				var pos = getMousePos(event);
				var x = pos.x;
				var y = pos.y;

				uiContext.translate(x - movedX, y - movedY);
				currentDrawMode(true);

				movedX = x;
				movedY = y;

				moveXTemp += movedX - startX;
				moveYTemp += movedY - startY;

				startX = x;
				startY = y;
			}
		}
		function oftenDraw() {
			// Box를 클릭하면 선택되는 효과
			if($.isEmptyObject(boxes)) {
				clearCanvas();
				drawImage();
				if(typeof that._redraw === 'function') {
					that._redraw(boxes);
					paramTemporary = [];
				}
				return;
			} else {
				clearCanvas();
				drawImage();
				boxes.forEach(function(v, i) {
					v.draw();
				});
				if(typeof that._redraw === 'function') {
					that._redraw(boxes);

					paramTemporary = [];
					$.each(boxes, function(i, v) {
						var param = {Box:{}};
						param.Box.x = v.x;
						param.Box.y = v.y;
						param.Box.w = v.width;
						param.Box.h = v.height;
						param.category_name = v.text;
						param.category_id = v.ctg;
						paramTemporary.push(param);
					});
				}
			}
			invalidate();
		}
		function getMousePos(event) {
			var rect = $ui_canvas.getBoundingClientRect();
			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			}
		}
		function clearCanvas() {
			setDrawType(that._drawType);
			uiContext.clearRect(
				-$ui_canvas.width*currentScale		// left
				, -$ui_canvas.height*currentScale	// top
				, $ui_canvas.width*2*currentScale	// right
				, $ui_canvas.height*2*currentScale	// bottom
			);
			if(!$.isEmptyObject($ui_scaleTools.find(".btn_size_reset"))) {
				if (currentScale != 1.0) {
					$ui_scaleTools.find(".btn_size_reset").addClass("active");
				} else {
					$ui_scaleTools.find(".btn_size_reset").removeClass("active");
				}
			}
		}
		function drawImage() {
			uiContext.save();
			uiContext.scale(currentScale, currentScale);
			uiContext.drawImage(sourceImage, -sourceImage.naturalWidth/2, -sourceImage.naturalHeight/2);
			uiContext.restore();
		}

		function clearUI() {
			clearCanvas();
			paramTemporary = null;
			currentScale = 1;
			startX = 0; startY = 0; isMove = false;
			moveXTemp = 0; moveYTemp = 0;
			movedX = 0, movedY = 0;
			$ui_scaleTools.find(".descScale").html(parseInt(currentScale * 100) + " %");
		}

		return {
			init: init,
			drawClosingPath: drawClosingPath,
			drawPointPath: drawPointPath,
			drawItems: drawItems,
			setDrawType: setDrawType,
			clearUI: clearUI
		}
	}

	return {
		CreateUiHandler: CreateUiHandler
	}
})();

var ImageJS = (function(){
		var prefixUri = "/biz/image/";		// '/' 지우면 안된다.
		/*var moveApi = {
			projectList: "/project/projectList.do"
		}*/
		function createJobInfo($this, settings) {
			var that = this;
			this._projectId = settings.projectId;
			this._projectType = settings.projectType;
			this._jobType = settings.jobType;
			this._jobClassName = settings.jobClassName ? settings.jobClassName : "";
			this._errorHandler = settings.errorHandler;
			this._callback = settings.nextCallback;
			this._isInteraction = $this != null;
			
			var jobInfo = {};
			var movePageUri = {
				projectList: "/project/projectList.do"
			};
			
			var requestApi = {
				requestAssignJob: prefixUri+"/getCurrentJob.json"					// job을 할당받는다.
				,requestEvaluate: prefixUri+"/evaluateJob.json"
				,requestConfirm: prefixUri+"/confirmJob.json"
				,requestReject: prefixUri+"/rejectJob.json"
				
				,getContext: prefixUri+that._jobClassName+"/getContext.json"	// job의 내용을 가져온다.
				,getContents: prefixUri+that._jobClassName+"/getSelectedImage.json"
				,selectWorkData: prefixUri+that._jobClassName+"/selectWorkData.json"// 작업한 데이터를 가져온다.
				
				// ,selectProjectCategorySubList:	"/biz/comm/selectCode.json"
				,selectProjectCategorySubList:	"/biz/comm/selectCodeWithExData.json"
				,saveWorkData: prefixUri+that._jobClassName+"/saveWorkData.json",	// 부분 반려,승인 결과를 저장한다.
			};
			
			init();
			function init() {
			}
		
		
		
		// ABOUT ACTION
		function goHome(message) {
			$.confirm(
				message != null ? message : "프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?"
				, function() {
					MindsJS.movePage(movePageUri.projectList);
				}
			);
		}
		// 내가 찜 한, 또는 작업 가능한 프로젝트(JOB)을 가져온다.
		function requestAssignJob(callback, failCallback) {
			// 콘텐츠를 가져올 때 UI를 변경할 지 여부를 판단하기 위한
			var preJobType = jobInfo.jobType;
			MindsJS.loadJson(
				requestApi.requestAssignJob
				, {
					projectId : that._projectId
				}
				, function(result) {
					if(result.success) {
						jobInfo = result.data;
						if($.isEmpty(preJobType) || preJobType == jobInfo.jobType) {
							if(typeof callback === 'function') {
								callback(jobInfo);
							} 
							else { $.alert("첫번째 파라미터에 CALLBACK 함수가 필요합니다."); }
						} else {
							MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
						}
					} else {
						// 서버에서의 오류 응답 줄 때 (RestController에서 return fail()일 때)
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
			);
		}
		function selectProjectCategorySubList(callback) {
			MindsJS.loadJson(
				requestApi.selectProjectCategorySubList,
				{ grpCode : jobInfo.projectCtg },
				function(result) {
					var data = result.data;
					if(typeof callback === 'function') {
						callback(data);
					}
				}	
			);
		}
		
		// job 기본정보, 파일정보나 포인트 정보
		function getCurrentJobContext(callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getContext
				, {
					projectId : that._projectId
					,jobId : jobInfo.jobId
				}
				, function(result) {
					if(result.success) {
						callback(result.data);
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
			);
		}

		// job의 세부 contents 를 가져온다.
		function selectCurrentContents(atchFileId, callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getContents,
				{
					projectId : that._projectId
					,jobId : jobInfo.jobId
					,atchFileId : atchFileId
				},
				function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}, false
			);
		}

		// job의 세부 contents 를 가져온다.
		function selectCurrentContents(atchFileId, callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getContents,
				{
					projectId : that._projectId
					,jobId : jobInfo.jobId
					,atchFileId : atchFileId
				},
				function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}, false
			);
		}
		
		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
		function selectData(callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { projectId: that._projectId, workId : jobInfo.workId };
			MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
				if(result.success) {
					var contentList = result.data;
					if(contentList.length > 0) {
						contentList.status = jobInfo.jobStatus;
					}
					if(typeof callback === 'function') {
						callback(contentList);
					}
				} else {
					// 서버에서의 오류 응답
					if(typeof failCallback === 'function') {
						failCallback(result);
					}
				}
			});
		}
		
		function requestEvaluate($form) {
			var parameter = {};
			if($form != null) {
				parameter = $form.formJson();
			}
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			parameter.standJobId = jobInfo.standJobId;
			
			MindsJS.loadJson(requestApi.requestEvaluate, parameter, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// 승인(검수&다음파일)
		function requestComplete() {
			var parameter = {};
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			parameter.standJobId = jobInfo.standJobId;
			
			MindsJS.loadJson(requestApi.requestConfirm, parameter, function(result) {
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// 반려
		function requestReject(rejectComment) {
			var parameter = {};
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			
			if(rejectComment != null) {
				parameter.comment = rejectComment;
			}
			
			MindsJS.loadJson(requestApi.requestReject, parameter, function(result) {
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}

		// 부분 반려, 승인 결과 저장
		function saveContentForSubInspection(parameter, callback, failCallback) {
			var param = convertObjectToJsonSegment(parameter);
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.items = param;
			parameter.saveKind = "sub";

			MindsJS.loadJson(
				requestApi.saveWorkData
				, parameter
				, function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				,false
			);
		}

		// 전체 반려, 승인 결과 저장
		function saveSubInspectionResult(parameter, callback, failCallback) {
			var param = convertMapToJsonSegment(parameter);
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.items = param;
			parameter.saveKind = "overall";

			MindsJS.loadJson(
				requestApi.saveWorkData
				, parameter
				, function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				,false
			);
		}

		function saveContentForWorkByParameter(parameter, callback, failCallback) {
			var param = convertMapToJsonSegment(parameter);
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.items = param;

			MindsJS.loadJson(
				requestApi.saveWorkData
				, parameter
				, function (result) {
					if (result.success) {
						if (typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if (typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				, false
			);
		}

		function convertObjectToJsonSegment(parameter) {
			var annotationList = [];
			annotationList.push(parameter);
			return JSON.stringify(annotationList);
		}

		function convertMapToJsonSegment(parameter) {
			var annotationList = [];
			for(var item of parameter) {
				if(item != null) {
					annotationList.push(item[1]);
				}
			}
			return JSON.stringify(annotationList);
		}
		
		return {
			init: init,
			goHome: goHome,
			requestAssignJob: requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			selectCurrentContents: selectCurrentContents,
			selectProjectCategorySubList: selectProjectCategorySubList,
			selectData: selectData,
			requestEvaluate: requestEvaluate,
			requestComplete: requestComplete,
			requestReject: requestReject,
			saveContentForSubInspection: saveContentForSubInspection,
			saveSubInspectionResult: saveSubInspectionResult,
			saveContentForWorkByParameter:saveContentForWorkByParameter
		}
		
	}
	function replaceAll(str, targetChar, replaceChar) {
		return str.split(targetChar).join(replaceChar);
	}

	//base64 -> blob 변환
	function base64ToBlob(base64, mime) {
		mime = mime || '';
		var sliceSize = 1024;
		var byteChars = window.atob(base64);
		var byteArrays = [];
		for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
			var slice = byteChars.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		return new Blob(byteArrays, { type: mime });
	}
	
	return {
		createJobInfo:	createJobInfo,
		base64ToBlob:	base64ToBlob
	}
})();