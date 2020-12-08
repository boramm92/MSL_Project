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

	var sourceImage;	// Canvas 원본 이미지
	var uiContext;

	var paramTemporary = null;	// zoom-in,zoom-out,move등 현재 데이터가 유지되는 상황에 사용
	var currentScale = 1;
	var zoomDelta = 0.1;	// 1줌 당 변화량 (단위 scale)

	var MINIMUM_SIZE = 50;

	// Canvas 이동에 의한 좌표 offset
	var startX = 0, startY = 0, isMove = false;
	var moveXTemp = 0, moveYTemp = 0;
	var movedX = 0, movedY = 0;

	// Box Drawing을 위한 좌표
	var boxTop = 0, boxLeft =0, isBoxDrawing = false;

	var currentDrawMode = null;

	// padding 오차
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

	var boxes = [];
	// 선택 객체 bound line
	var selectionHandles = [];
	var cursorBlockSize = 6;

	var selectCell = null;
	var resizeX = 0, resizeY = 0;
	var offsetX = 0, offsetY = 0;
	var isDrag = false;
	var isResizeDrag = false;
	var expectResize = -1;
	var canvasValid = false;

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
			uiContext.fillStyle = this.fill;
			uiContext.font = '14px sans-serif';
			uiContext.fillRect(scaleX, scaleY, scaleW, scaleH);

			// 선택한 셀 highlight
			// if(amiSelectedCell) {
			if(selectCell === this) {
				uiContext.strokeStyle = '#FF0000';
				uiContext.listWidth = 1;
				uiContext.strokeRect(scaleX, scaleY, scaleW, scaleH);
				var half = cursorBlockSize / 2;

				// moving block

				selectionHandles[0].x = this.x - half;
				selectionHandles[0].y = this.y - half;
				selectionHandles[1].x = this.x + this.width / 2 - half;
				selectionHandles[1].y = this.y - half;
				selectionHandles[2].x = this.x + this.width - half;
				selectionHandles[2].y = this.y - half;
				selectionHandles[3].x = this.x - half;
				selectionHandles[3].y = this.y + this.height / 2 - half;
				selectionHandles[4].x = this.x + this.width - half;
				selectionHandles[4].y = this.y + this.height / 2 - half;
				selectionHandles[5].x = this.x - half;
				selectionHandles[5].y = this.y + this.height - half;
				selectionHandles[6].x = this.x + this.width / 2 - half;
				selectionHandles[6].y = this.y + this.height - half;
				selectionHandles[7].x = this.x + this.width - half;
				selectionHandles[7].y = this.y + this.height - half;

				uiContext.fillStyle = '#00FF00';
				for (var i = 0; i < 8; i++) {
					var cursor = selectionHandles[i];
					// uiContext.fillRect(cursor.x, cursor.y, cursorBlockSize, cursorBlockSize);
					uiContext.fillRect((cursor.x-($ui_canvas.width/2)) * currentScale, (cursor.y-($ui_canvas.height/2)) * currentScale,cursorBlockSize, cursorBlockSize);
				}
			}
			if (this.text) {
				uiContext.fillStyle = '#00000080';
				uiContext.fillRect(scaleX, scaleY,this.text.length * 14, 14);
				uiContext.fillStyle = '#ffffff';
				uiContext.fillText(this.text, scaleX, scaleY + 12);
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

			// set resize box template
			for(var i=0; i<8; i++) {
				var resizeBox = new ResizableBox;
				selectionHandles.push(resizeBox);
			}
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
				uiContext.fillStyle = that._strokeColor+"20";
				uiContext.fontColor = '#FFFFFF';
				uiContext.font = "bold 14px Calibri";

				moveXTemp = 0; moveYTemp = 0;
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
			$this.find("canvas#dataSourceCanvas").on("dblclick", generateItemBox);
		}

		function getMouseBoxPos(event) {

		}

		function invalidate() {
			canvasValid = false;
		}

		function generatePolygon(event) {
			if(that._drawType != 'boxing' && typeof that._checkPoint === 'function') {
				var pos = getMousePos(event);

				// pos.x -= moveXTemp;
				// pos.y -= moveYTemp;
				// pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2);
				// pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2);
				pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
				pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

				that._checkPoint(pos);
			}
		}
		function generateItemBox(event) {
			if(typeof that._checkPoint === 'function') {
				var pos = getMousePos(event);

				// pos.x -= moveXTemp;
				// pos.y -= moveYTemp;
				// pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2);
				// pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2);
				pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
				pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

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
			selectCell = null;
			if(currentDrawMode == null) return;
			currentDrawMode(param);
		}

		// private function
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
			// 우클릭 Down 일 때
			if(event.buttons == 2) {
				var pos = getMousePos(event);
				startX = pos.x;
				startY = pos.y;
				movedX = startX;
				movedY = startY;
				isMove = true;
			}
			else if(that._drawType == 'boxing' && event.buttons == 1) {
				// box 그리는 작업에서 클릭은 아이템 선택일 때만
				var pos = getMousePos(event);
				if(expectResize !== -1) {
					isResizeDrag = true;
					return;
				}

				// Box를 클릭하면 선택되는 효과
				if($.isEmptyObject(boxes)) {
					return;
				} else {
					clearCanvas();
					drawImage();
					var onlyOneSelect = false;
					selectCell = null;
					boxes.forEach(function(v, i) {
						if(!onlyOneSelect) {
							var scaleCursorX = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
							var scaleCursorY = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);
							// if (v.x < pos.x && v.x + v.width >= pos.x
							// 	&& v.y < pos.y && v.y + v.height >= pos.y) {
							if (v.x <= scaleCursorX && v.x + v.width >= scaleCursorX
								&& v.y <= scaleCursorY && v.y + v.height >= scaleCursorY) {
								// selected box
								selectCell = v;
								onlyOneSelect = true;
								isDrag = true;
							}
						}
						v.draw();
					});
					if(!$.isEmptyObject(selectCell)) {
						var pos = getMousePos(event);

						pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
						pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

						offsetX = pos.x - selectCell.x;
						offsetY = pos.y - selectCell.y;
					} else {
						offsetX = 0;
						offsetY = 0;
					}
				}
				return;
			}
		}
		function mouseup(event) {
			// 우클릭 UP 일 때
			if(that._drawType != 'boxing' && event.button == 0) {
				isMove = false;
			} else {
				isDrag = false;
				isMove = false;
				isResizeDrag = false;
				expectResize = -1;
				this.style.cursor='auto';
			}
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
			} else if(selectCell != null && isResizeDrag) {
				var pos = getMousePos(event);
				var oldx = selectCell.x;
				var oldy = selectCell.y;

				/// 0	1	2
				///	3		4
				/// 5	6	7
				var scaleCursorX = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
				var scaleCursorY = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

				switch (expectResize) {
					case 0:
						selectCell.x = selectCell.width > MINIMUM_SIZE ? scaleCursorX : selectCell.x;
						selectCell.width += oldx - scaleCursorX;
						selectCell.y = selectCell.height > MINIMUM_SIZE ? scaleCursorY : selectCell.y;
						selectCell.height += oldy - scaleCursorY;
						break;
					case 1:
						selectCell.y = selectCell.height > MINIMUM_SIZE ? scaleCursorY : selectCell.y;
						selectCell.height += oldy - scaleCursorY;
						break;
					case 2:
						selectCell.y = selectCell.height > MINIMUM_SIZE ? scaleCursorY : selectCell.y;
						selectCell.width = scaleCursorX - oldx;
						selectCell.height += oldy - scaleCursorY;
						break;
					case 3:
						selectCell.x = selectCell.width > MINIMUM_SIZE ? scaleCursorX : selectCell.x;
						selectCell.width += oldx - scaleCursorX;
						break;
					case 4:
						selectCell.width = scaleCursorX - oldx;
						break;
					case 5:
						selectCell.x = selectCell.width > MINIMUM_SIZE ? scaleCursorX : selectCell.x;
						selectCell.width += oldx - scaleCursorX;
						selectCell.height = scaleCursorY - oldy;
						break;
					case 6:
						selectCell.height = scaleCursorY - oldy;
						break;
					case 7:
						selectCell.width = scaleCursorX - oldx;
						selectCell.height = scaleCursorY - oldy;
						break;
					default:
						break;
				}
				if(selectCell.width < MINIMUM_SIZE) {
					selectCell.width = MINIMUM_SIZE;
				}
				if(selectCell.height < MINIMUM_SIZE) {
					selectCell.height = MINIMUM_SIZE;
				}
				oftenDraw();
			} else if(selectCell != null && isDrag) {
				var pos = getMousePos(event);

				pos.x = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
				pos.y = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

				if(pos.x - offsetX >= 0 && pos.x - offsetX + selectCell.width <= $ui_canvas.width) {
					selectCell.x = pos.x - offsetX;
				}
				if(pos.y - offsetY >= 0 && pos.y - offsetY + selectCell.height <= $ui_canvas.height) {
					selectCell.y = pos.y - offsetY;
				}

				// 선택 셀 이동
				oftenDraw();
				invalidate();
			}
			if(selectCell != null && !isResizeDrag) {
				var pos = getMousePos(event);
				// 커서 모양 변경
				for (var i = 0; i < 8; i++) {
					var cur = selectionHandles[i];
					// we dont need to use the ghost context because
					// selection handles will always be rectangles
					var scaleCursorX = ((pos.x - ($ui_canvas.width/2)) / currentScale) + ($ui_canvas.width/2) - (moveXTemp/currentScale);
					var scaleCursorY = ((pos.y - ($ui_canvas.height/2)) / currentScale) + ($ui_canvas.height/2) - (moveYTemp/currentScale);

					if (scaleCursorX >= cur.x && scaleCursorX <= cur.x + (cursorBlockSize/currentScale) &&
						scaleCursorY >= cur.y && scaleCursorY <= cur.y + (cursorBlockSize/currentScale)) {
						// we found one!
						expectResize = i;
						invalidate();

						switch (i) {
							case 0:
								this.style.cursor='nw-resize';
								break;
							case 1:
								this.style.cursor='n-resize';
								break;
							case 2:
								this.style.cursor='ne-resize';
								break;
							case 3:
								this.style.cursor='w-resize';
								break;
							case 4:
								this.style.cursor='e-resize';
								break;
							case 5:
								this.style.cursor='sw-resize';
								break;
							case 6:
								this.style.cursor='s-resize';
								break;
							case 7:
								this.style.cursor='se-resize';
								break;
						}
						return;
					}
					// not over a selection box, return to normal
					isResizeDrag = false;
					expectResize = -1;
					this.style.cursor='auto';
				}
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
		function removeSelectCell() {
			var removeItemIndex = -1;
			if(!$.isEmptyObject(boxes)) {
				boxes.forEach(function(v, i) {
					if(v === selectCell) {
						removeItemIndex = i;
						return;
					}
				});
			}
			if(removeItemIndex > -1) {
				boxes.splice(removeItemIndex, 1);
			}
			oftenDraw();
 		}
		function clearCanvas() {
			// selectCell = null;
			setDrawType(that._drawType);
			uiContext.clearRect(
				-$ui_canvas.width*2*currentScale		// left
				, -$ui_canvas.height*2*currentScale	// top
				, $ui_canvas.width*4*currentScale	// right
				, $ui_canvas.height*4*currentScale	// bottom
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
			startX = 0; startY = 0; isMove = false; isBoxDrawing = false;
			moveXTemp = 0; moveYTemp = 0;
			movedX = 0, movedY = 0;
			$ui_scaleTools.find(".descScale").html(parseInt(currentScale * 100) + " %");
		}

		return {
			init: init,
			drawClosingPath: drawClosingPath,
			drawPointPath: drawPointPath,
			drawItems: drawItems,
			removeSelectCell: removeSelectCell,
			setDrawType: setDrawType,
			clearUI: clearUI
		}
	}
	
	return {
		CreateUiHandler: CreateUiHandler,
		MINIMUM_SIZE: MINIMUM_SIZE
	}
})();

var ImageJS = (function(){
	var prefixUri = "/biz/image/";
	
	function createJobInfo($this, settings) {
		var that = this;
		// properties
		this._projectId = settings.projectId;
		this._projectType = settings.projectType;
		this._jobType = settings.jobType;
		this._jobClassName = settings.jobClassName ? settings.jobClassName : "";
		this._errorHandler = settings.errorHandler;
		this._modalCallbak = settings.modalCallback;
		this._callback = settings.nextCallback;
		this._isInteraction = $this != null;
		
		var jobInfo = {};
		var gParameter = {};
		var movePageUri = {
			projectList: "/project/projectList.do"
		};
		var requestApi = {
			requestAssignJob:	prefixUri+"/getCurrentJob.json",				// job을 할당받는다.
			requestInspect:		prefixUri+"/requestInspect.json",				// 검수요청
			requestIgnore:		prefixUri+"/requestIgnore.json",				// 작업불가 요청
			requestGiveupTask:	prefixUri+"/requestGiveup.json",									// GIVE UP
			
			uploadFile:			prefixUri+that._jobClassName+"/fileUpload.json",
			getContext:			prefixUri+that._jobClassName+"/getContext.json",	// job의 내용을 가져온다.
			// getContents:		prefixUri+that._jobClassName+"/getContents.json",	// job 내에 등록된 세부 기준 콘텐츠를 가져온다
			getContents: 		prefixUri+that._jobClassName+"/getSelectedImage.json",
			saveQuestionData:	prefixUri+that._jobClassName+"/saveQuestionData.json",	// quest modal 에서 저장되는 내용
			saveWorkData:		prefixUri+that._jobClassName+"/saveWorkData.json",		// quest에 대응하는 질문과 Clue를 저장하는 내용
			selectWorkData:		prefixUri+that._jobClassName+"/selectWorkData.json",	// 작업한 데이터를 가져온다.
			clearData:			prefixUri+that._jobClassName+"/clearWorkData.json",		// 작업한 데이터를 모두 지운다 (초기화)
			removeItem:			prefixUri+that._jobClassName+"/removeWorkItem.json",

			selectProjectCategorySubList:	"/biz/comm/selectCodeWithExData.json",
			selectPlaceCodeList:		"/biz/comm/selectPlaceCode.json"
		};
		
		init();
		function init() {}
		
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
			//var preJobType = jobInfo.jobType;
			MindsJS.loadJson(
				requestApi.requestAssignJob
				, {
					projectId : that._projectId
					,jobType : that._jobType
				}
				, function(result) {
					if(result.success) {
						$("div.reject_box", $this).html("");
						jobInfo = result.data;
						// if($.isEmpty(preJobType) || preJobType == jobInfo.jobType) {
						if(jobInfo != null) {
							// 상태가 반려일 때
							if(jobInfo.jobStatus == 'RJ') {
								// var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
								var param = {title: "반려 사유 :", comment: jobInfo.rejectComment};
								$("div.reject_box", $this).html($.templates("#commentBoxTemplate").render(param));
								// $.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
								$.alert("검수자에 의해 반려된 항목입니다. 반려사유를 확인 후 수정해 주세요.",null,"확인");
							} else {
								$("div.reject_box", $this).hide();
							}
							if(typeof callback === 'function') {
								callback(jobInfo);
							} 
							else { $.alert("첫번째 파라미터에 CALLBACK 함수가 필요합니다."); }
						} else {
							//MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
							$.alert("작업 가능한 프로젝트가 없습니다", function() {
								MindsJS.movePage("/project/projectList.do");
							});
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

		function selectPlaceCodeList(grpCode, callback) {
			MindsJS.loadJson(
				requestApi.selectPlaceCodeList,
				{ grpCode : grpCode },
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
					} else {d
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}, false
			);
		}

		function saveContentForWorkByParameter(parameter, callback, failCallback) {
			var param = convertMapToJsonSegment(parameter);
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			if(gParameter != null) {
				parameter.inOutCtg = gParameter.inOutCtg;
				parameter.areaCtg = gParameter.areaCtg;
				parameter.ctgContextId = gParameter.ctgContextId;
			}
			parameter.items = param;

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
		function saveContentForWork($form, callback, failCallback) {
			var parameter = {};
			if($form != null) {
				parameter = $form.formJson();
			}
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			if(gParameter != null) {
				parameter.inOutCtg = gParameter.inOutCtg;
				parameter.areaCtg = gParameter.areaCtg;
				parameter.ctgContextId = gParameter.ctgContextId;
			}
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

		function saveContentForWorkForFeeling(parameter, callback) {
			var param = parameter;

			param.projectId = that._projectId;
			param.jobId = jobInfo.jobId;
			param.workId = jobInfo.workId;

			MindsJS.loadJson(requestApi.saveWorkData, param, function(result) {
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
			}, false);
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

		function convertMapToJson(parameter) {
			var param = {};
			
			// for mrc
			var qa_id = [], answer = [], startIdx = [], endIdx = [];
			var reason = [], reason_start_index = [], reason_end_index = [];
			var answer_contentId = [], reason_contentId = [];
			
			parameter.forEach((value, key) => {
				qa_id.push(value.qa_id);
				
				answer.push(typeof value.answer === "undefined" ? "" : value.answer);
				startIdx.push(typeof value.start_index === "undefined" ? "" : value.start_index);
				endIdx.push(typeof value.end_index === "undefined" ? "" : value.end_index);
				answer_contentId.push(typeof value.answer_contentId === "undefined" ? "" : value.answer_contentId);
				
				reason.push(typeof value.reason_morpheme === "undefined" ? "" : value.reason_morpheme);
				reason_start_index.push(typeof value.reason_start_index === "undefined" ? "" : value.reason_start_index);
				reason_end_index.push(typeof value.reason_end_index === "undefined" ? "" : value.reason_end_index);
				reason_contentId.push(typeof value.reason_contentId === "undefined" ? "" : value.reason_contentId);
			});

			param.qa_id = qa_id;
			param.answer = answer;
			param.start_index = startIdx;
			param.end_index = endIdx;
			param.answer_contentId = answer_contentId;
			
			param.reason = reason;
			param.reason_start_index = reason_start_index;
			param.reason_end_index = reason_end_index;
			param.reason_contentId = reason_contentId;
			
			return param;
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
		function selectDetailData(contentId, callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { projectId: that._projectId, workId : jobInfo.workId,  qa_id: contentId };
			MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
				if(result.success) {
					var contentList = result.data;
					contentList.projectId = that._projectId;
					contentList.status = jobInfo.jobStatus;
					callback(contentList);
				} else {
					// 서버에서의 오류 응답
					if(typeof failCallback === 'function') {
						failCallback(result);
					}
				}
			});
		}
		
		// 검수요청
		function requestInspectForWork() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(requestApi.requestInspect, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						if(that._jobClassName == "mask"){
							$(".to-crop").selectAreas("reset");
						}
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// 작업불가요청
		function requestIgnoreForWork(comment) {
			var param = jobInfo;
			param.projectId = that._projectId;
			
			if(comment != null) param.comment = comment;
			MindsJS.loadJson(requestApi.requestIgnore, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// give up
		function requestGiveupTask() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(requestApi.requestGiveupTask, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		function removeItem(contextId, callback) {
			var param = jobInfo;
			param.contextId = contextId;
			MindsJS.loadJson(requestApi.removeItem, param, function(result){
				if(result.success) {
					if(callback != null && typeof callback === 'function') {
						callback();
					}
				} else {
				}
			});
		}
		function clearData(callback) {
			var param = jobInfo;
			if(gParameter != null) {
				param.inOutCtg = gParameter.inOutCtg;
				param.areaCtg = gParameter.areaCtg;
				param.ctgContextId = gParameter.ctgContextId;
			}
			MindsJS.loadJson(requestApi.clearData, param, function(result) {
				if(result.success) {
					if(callback != null && typeof callback === 'function') {
						callback();
					}
				} else {
				}
			});
		}
		function setGParameter(gCategory) {
			gParameter = gCategory;
		}
		return {
			init: init,
			goHome: goHome,
			requestAssignJob: requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			selectCurrentContents: selectCurrentContents,
			selectProjectCategorySubList: selectProjectCategorySubList,
			selectPlaceCodeList: selectPlaceCodeList,
			saveContentForWork: saveContentForWork,
			saveContentForWorkByParameter: saveContentForWorkByParameter,
			saveContentForWorkForFeeling: saveContentForWorkForFeeling,
			selectData: selectData,
			//selectDetailData: selectDetailData,
			requestInspectForWork: requestInspectForWork,
			requestIgnoreForWork: requestIgnoreForWork,
			removeItem: removeItem,
			clearData: clearData,
			setGParameter: setGParameter
		}
	
	}
	function convertContextToWord(text) {
		if(text == null || text.length <= 0) return;
		
		var wordsList = text.split("");
		var parsedWordsList = [];
		var totLength = 0;
		var incr_offset = 0;
		
		var bInterrupt = false;
		$.each(wordsList, function() {
			var $this = this;

			var startIndex = totLength;
			var wordLength = $this.length;
			
			// 태그가 시작되는지 판단 (위치 변경 불가능)
			if($this == "<") {
				bInterrupt = true;
			}
			var item = {};
			if(!bInterrupt) {
				item.start = totLength;
				item.morps = $this;
				item.end = (startIndex*1)+(wordLength*1);
				totLength += wordLength;
			} else {
				item.morps = $this;
			}
			// appending 작업이 끝나고 상태 변경 해야함 (위치 변경 불가)
			if($this == ">") {
				bInterrupt = false;
			}
			parsedWordsList.push(item);
		});
		/*if(wordsList != null && wordsList.length > 0) {
			for(var i in wordsList) {
				var startIndex = totLength;
				var wordLength = wordsList[i].length;
				
				var item = {};
				item.start = totLength;
				item.morps = wordsList[i];
				item.end = (startIndex*1)+(wordLength*1);
				totLength += wordLength;
				
				parsedWordsList.push(item);
			}
		}*/
		return parsedWordsList;
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
		parseContext:	convertContextToWord,
		base64ToBlob:	base64ToBlob
	}
})();
