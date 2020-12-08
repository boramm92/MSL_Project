var BoxingUI = (function() {

	var boxes = [];
	var selectionHandles= [];
	// 0  1  2
	// 3     4
	// 5  6  7

	var canvas;
	var ctx;
	var width;
	var height;

	var isDrag = false;
	var isResizeDrag = false;
	var expectResize = -1;
	var mx, my;

	var canvasValid = false;

	// selection
	var selectCell = null;
	var selectCellColor = '#CC0000';
	var selCellBlockSize = 6;
	var selectCellBoxColor = '#FF0000';

	// we use a fake canvas to draw individual shapes for selection testing
	var ghostcanvas;
	var gctx; // fake canvas context

	// since we can drag from anywhere in a node
	// instead of just its x/y corner, we need to save
	// the offset of the mouse when we start dragging.
	var offsetx, offsety;

	// Padding and border style widths for mouse offsets
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

	function init() {

	}

	function Box() {
		this.x = 0;
		this.y = 0;
		this.width = 1;
		this.height = 1;
		this.fill = '';
		this.text = '';
	}
	Box.prototype = {
		draw: function(context) {
			if(context === gctx) {
				context.fillStyle = 'black';
			} else {
				context.fillStyle = this.fill;
			}
			context.font = '10pt sans-serif';
			context.fillRect(this.x, this.y, this.width, this.height);

			// 선택한 셀 highlight
			if(selectCell === this) {
				context.strokeStyle = selectCellColor;
				context.listWidth = 1;
				context.strokeRect(this.x, this.y, this.width, this.height);

				var half = selCellBlockSize / 2;

				// moving block
				selectionHandles[0].x = this.x-half; 				selectionHandles[0].y = this.y-half;
				selectionHandles[1].x = this.x+this.width/2-half; 	selectionHandles[1].y = this.y-half;
				selectionHandles[2].x = this.x+this.width-half; 	selectionHandles[2].y = this.y-half;
				selectionHandles[3].x = this.x-half; 				selectionHandles[3].y = this.y+this.height/2-half;
				selectionHandles[4].x = this.x+this.width-half; 	selectionHandles[4].y = this.y+this.height/2-half;
				selectionHandles[5].x = this.x-half; 				selectionHandles[5].y = this.y+this.height-half;
				selectionHandles[6].x = this.x+this.width/2-half; 	selectionHandles[6].y = this.y-half;
				selectionHandles[7].x = this.x+this.width-half; 	selectionHandles[7].y = this.y+this.height-half;

				context.fillStyle = selectCellBoxColor;
				for(var i=0; i<8; i++) {
					var cursor = selectionHandles[i];
					context.fillRect(cursor.x, cursor.y, selCellBlockSize, selCellBlockSize);
				}
			}
			if(this.text) {
				context.fillStyle = '#00000080';
				context.fillRect(this.x, this.y, this.text.length*12, 14);
				context.fillStyle = '#ffffff';
				context.fillText(this.text, this.x, this.y+12);
			}
		}
	}

	function addRect(x, y, width, height, fillColor, text) {
		var rect = new Box;
		rect.x = x;
		rect.y = y;
		rect.width = width;
		rect.height = height;
		rect.fill = fillColor;
		rect.text = text;

		boxes.push(rect);
		invalidate();
	}

	function drawBoxes(boxList) {
		if(canvasValid == false) {
			clear(ctx);
			var boxCount = boxList.length;
			for(var i=0; i<boxCount; i++) {
				boxes[i].draw(ctx);
			}
		}
	}

	function clear(c) {
		c.clearRect(0, 0, WIDTH, HEIGHT);
	}

	function invalidate() {
		canvasValid = false;
	}

	return {
		init: init
	}
})();