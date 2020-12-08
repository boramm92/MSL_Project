'use strict';
var videoAbnormalViewScript = (function() {
	var $mP;
	var $Object;

	var defaultJobType = "AD";
	var jobClassName = "abnormal";

	var video = {
		obj: '',
		left: '',
		top: '',
		right: '',
		relativeLeft: '',
		relativeTop: '',
		rate: '', //fps
		scaleX: 0, //축소비율X
		scaleY: 0, //축소비율Y
		set data(val) {
			this.left = Number(Math.floor($(val).offset().left));
			this.top = Number(Math.floor($(val).offset().top));
			this.relativeLeft = Number($(val).position().left);
			this.relativeTop = Number($(val).position().top);
			this.right = Number($(val).position().left) + Number($(val).width());
			this.obj = val;

			this.scaleX = this.obj.videoWidth/this.obj.getBoundingClientRect().width;
			this.scaleY = this.obj.videoHeight/this.obj.getBoundingClientRect().height;
		},
		get data() {
			return this;
		}
	};

	var currentWorkData = {
		contextId: '',
		startX: '',
		startY: '',
		endX: '',
		endY: '',
		startTime: '',
		endTime: '',
		startFrame: '',
		endFrame: '',
		contentKind: '',
		contentKind1: '',
		contentKind2: '',
		contentKind3: '',
		set data(val) {
			if(val.length > 0){
				var value = val[0];

				this.contextId = value.contextId;
				if(value.start.length > 1) {
					[this.startX, this.startY] = String(value.start).split(',');
				}

				if(value.end.length > 1) {
					[this.endX, this.endY] = String(value.end).split(',');
				}

				this.startTime	= value.startTime != ''?Number(value.startTime) : '';
				this.endTime	= value.endTime != ''?Number(value.endTime) : '';
				this.startFrame	= value.startFrame != ''?Number(value.startFrame) : '';
				this.endFrame	= value.endFrame != ''?Number(value.endFrame) : '';
				this.contentKind	= value.contentKind;
				this.contentKind1	= value.contentKind1;
				this.contentKind2	= value.contentKind2;
				this.contentKind3	= value.contentKind3;
			} else {
				return '';
			}
		},
		get data() {
			return this;
		}
	};

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initVideoProject({
			projectId: projectId,
			projectType: "V",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});

		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		$("button.btn_undo", $mP).on("click", function (){
			video.obj.currentTime -= 0.1;
		});
		$("button.btn_redo", $mP).on("click", function (){
			video.obj.currentTime += 0.1;
		});
		$("button.btn_guide_view", $mP).on("click", getJobGuide);	// 가이드 보기
		$("button.btnSave", $mP).on("click", saveFixedData);	//임시저장
		$("button.btnNext", $mP).on("click", saveAndGotoNext);	// 저장 다음파일
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);	// 작업불가
	}
	function getJobGuide() {
		$Object.getJobGuide();
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		if(jobInfo.jobStatus == 'RJ') {
			var param = {title: "반려 사유 : ", comment: jobInfo.rejectComment};
			var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
			$("div.reject_box", $mP).html(rejectCommentHtml);
		}

		//video 영상 스트리밍
		var url = '/biz/video/videoDownload.do?jobId=' + jobInfo.jobId;
		$(".video_box .video", $mP).attr("src", url);

		$($('.video')[0]).on('error', function (event){
			$.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
			$(this).off(event);
		});

		$($('.video')[0]).off('loadeddata').on('loadeddata',function(){//video객체가 완전히 로드된 후
			video.data = $('.video')[0];
			displayTime('t',video.obj.duration);//영상 총 시간
			displayCoordinate();

			$(window).resize(function(){ //반응형 적용
				video.data = video.obj;
				displayCoordinate();

				var totalPercent = $('.progress_bar')[0].getBoundingClientRect().width-16;//16=버튼지름
				var cal = (totalPercent / video.obj.duration) * video.obj.currentTime;
				var percentage = Math.floor(cal);
				$('.progress_btn').css('left',percentage);
			});
			$(video.obj).off('timeupdate').on('timeupdate', function() {
				timeUpdate();
			});
			/** 영상 제어 관련된 버튼 이벤트 등록 */
			$('.btn_start').off('click').on('click',function(){ setSection('s',this) });
			$('.btn_end').off('click').on('click', function(){ setSection('e',this) });
			$('.play_btn_group button').off('click').on('click', togglePlay);
			$('.btn_startV').off('click').on('click',function (){
				if(!video.obj.paused) {
					video.obj.pause();
					isPaused()
				}
				video.obj.currentTime = currentWorkData.startTime;
			});
			$('.btn_endV').off('click').on('click',function (){
				if(!video.obj.paused) {
					video.obj.pause();
					isPaused()
				}
				video.obj.currentTime = currentWorkData.endTime;
			});

			$('.progress_btn').draggable({
				axis: 'x',
				containment: 'parent',
				start: function(e, ui) {
					$(video.obj).off('timeupdate');
					ui.helper.addClass("dragging");
				},drag: function (e, ui){
					progressBar(ui, $('.player'))

					displayTime('',video.obj.currentTime);
					displayCoordinate();
				},
				stop: function(e, ui) {
					ui.helper.removeClass("dragging");
					$(video.obj).on('timeupdate', function() {
						timeUpdate();
					});
				}
			});

			$('.btn_loop').off('click').on("click", function(){
				video.obj.currentTime = currentWorkData.startTime;
				$(video.obj).on('timeupdate', function(e){
					if(numberToFixed(video.obj.currentTime) >= numberToFixed(currentWorkData.endTime)){
						video.obj.pause();
						video.obj.currentTime = currentWorkData.endTime;
						$(this).off(e);
						$('.btn_pause').removeClass('on');
						$('.btn_play').addClass('on');
					}
				});
				video.obj.play();
				$('.btn_play').removeClass('on');
				$('.btn_pause').addClass('on');
			});

			$('.progress_bar').off('click').on('click', function (e){
				// 구간 반복 클릭 후 종료점에 도달하기 전 progress_bar를 클릭했을 경우를 위한 timeupdate event 재등록
				$(video.obj).off('timeupdate').on('timeupdate', function() {
					timeUpdate();
				});
				var width = $(this)[0].getBoundingClientRect().width-16;//16=버튼지름
				var percent = (e.pageX - $(this).offset().left) / width;
				video.obj.currentTime = percent * video.obj.duration;
			});

			$Object.getVideo(setVideo, failCallback);
		});

		selectAbnormalData();
	}

	function setVideo(context) {
		video.rate = context.playRate
		$('.file_name').text(context.orgFileName);
	}

	function saveResult() {
		Object.keys(currentWorkData).forEach(function (v,i) {
			currentWorkData[v] = '';
		});

		$('.progress_btn').css('left', 0);
		getCurrentJob();
	}
	function selectAbnormalData() {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
		$Object.selectData(displayAbnormalData, failCallback);
	}
	/**
	 * 저장 데이터 화면에 표시
	 * */
	function displayAbnormalData(data) {
		currentWorkData.data = data;//전역 변수에 담기

		displayTime('s', currentWorkData.startTime);
		displayTime('e', currentWorkData.endTime);
		displayCoordinate();

		$('.startX').text(Number(currentWorkData.startX).toFixed(2));
		$('.startY').text(Number(currentWorkData.startY).toFixed(2));
		$('.endX').text(Number(currentWorkData.endX).toFixed(2));
		$('.endY').text(Number(currentWorkData.endY).toFixed(2));

		btnDisabled($('.btn_loop'), currentWorkData.startTime, currentWorkData.endTime);
		btnDisabled($('.btn_startV'), currentWorkData.startTime);
		btnDisabled($('.btn_endV'), currentWorkData.endTime);

		//이상유형 랜딩
		var contentKind = currentWorkData.contentKind;
		renderAllcontentKind(contentKind, setContentKind);
		$('[name=contentKind]').off('change').on('change',function(){
			var value = $(this).val();
			renderAllcontentKind(value);
		});
	}

	/**
	 * 이상행동 유형 및 유형 상세 목록 모두 가져옴.
	 * @param contentKind : 이상행동
	 */
	function renderAllcontentKind(contentKind,callback) {
		if(contentKind == '') contentKind = 'H';
		renderContentKind(contentKind, '1', callback);
		if(contentKind == 'H') {//낙상인 경우
			renderContentKind(contentKind, '2', callback);
			renderContentKind(contentKind, '3', callback);
		}
	}
	/**
	 * TODO 카테고리 목록 세팅
	 * @param upperGrpCode : 이상행동
	 * @param ctn : 이상행동상세
	 */
	function renderContentKind(upperGrpCode, ctn, callback) {
		if( upperGrpCode ) {
			MindsJS.loadJson(
				'/biz/comm/selectCode.json',
				{grpCode: 'ABNOR_'+upperGrpCode+ctn},//레이어노출 카테고리
				function (result) {
					var html = "<option value=''>Select your option</option>";
					if (!$.isEmpty(result.data)) {
						html += $.templates("#selectOptionOnlyTemplate").render(result.data);
					}

					if(upperGrpCode == 'H') {
						$('.tbl_top').html('<span>낙상 직전 상태</span>\n' +
											'<span>낙상 요인</span>\n' +
											'<span>낙상 방향</span>');
						$('.selection_box_w').hide();
						$('.selection_box_h').css('display', 'table-row');
						$(".selection_box_h select[name=contentKind"+ctn+"]", $mP).html(html);
					} else if(upperGrpCode == 'W') {
						$('.tbl_top').html('<span>배회 유형</span>');
						$('.selection_box_h').hide();
						$('.selection_box_w').css('display', 'table-row');
						$(".selection_box_w select[name=contentKind"+ctn+"]", $mP).html(html);
					}

					if(callback) callback(ctn);
				}

			);

		}
	}

	/**
	 * 이상행동 유형 상세 값 세팅
	 * @param ctn : 이상행동_유형_상세구분
	 */
	function setContentKind(ctn) {
		var contentKind1Arr = $('[name=contentKind1]');
		if(currentWorkData.contentKind == '' || currentWorkData.contentKind == 'H'){
			$('#radio1').prop('checked',true);
			$('#radio2').prop('checked',false);
		} else {
			$('#radio2').prop('checked',true);
			$('#radio1').prop('checked',false);
		}
		if($('[name=contentKind]:checked').val() == 'H') {//낙상
			switch (ctn){
				case '1':
					$(contentKind1Arr[0]).val(currentWorkData.contentKind1);
					break;
				case '2':
					$('[name=contentKind2]').val(currentWorkData.contentKind2);
					break;
				case '3':
					$('[name=contentKind3]').val(currentWorkData.contentKind3);
					break;
				default:
					break;
			}
		} else if($('[name=contentKind]:checked').val() == 'W') {//배회
			$(contentKind1Arr[1]).val(currentWorkData.contentKind1);
		}
	}

	/**
	 * 시작점 & 종료점
	 * @param type : 시작(s)/종료(e)
	 */
	function setSection(type, obj) {
		if(!video.obj.paused) {
			video.obj.pause();
			isPaused()
		}

		if( $(obj).hasClass('on') ) { // 이미 클릭한 상태
			$(obj).removeClass('on');// 버튼 비활성화
			$('.video_box').find('.guide_txt').remove();
			$(video.obj).off('mousedown');
		} else {
			$(obj).addClass('on');// 버튼 활성화
			moseDownOnVideo(type, obj); //현재 버튼(obj)에 대한 이벤트 활성화

			var subObj;
			var subType;
			$('.video_box').find('.guide_txt').remove();
			var $guidTxt = $('<p/>').addClass('guide_txt').insertAfter(video.obj);

			if (type == 's') {
				subObj = $('.btn_end');
				subType = 'e';
				$guidTxt.text('화면에서 시작점을 등록해 주세요.');
			} else if (type == 'e') {
				subObj = $('.btn_start');
				subType = 's';
				$guidTxt.text('화면에서 종료점을 등록해 주세요.');
			}

			$('.guide_txt').show();
			setTimeout(function () {
				$guidTxt.fadeOut()
			}, 1500)

			// ex)시작점 등록(obj)을 눌렀다가 좌표등록을 하지 않은 채 종료점 등록(subObj)을 눌렀을 경우를 위한 이벤트 등록
			$(subObj).on('click', function (event) {
				$(obj).removeClass('on');
				$(obj).off(event);
				moseDownOnVideo(subType, subObj);
			});
		}
	}

	/**
	 * 시작/종료 시점 초기화
	 * @param type 시작(s)/종료(e)
	 */
	function resetSection(type, obj, event ) {
		var subType = '';
		var oppositeType = '';
		switch (type) {
			case 's':
				oppositeType = 'e';
				subType = 'end';
				break;
			case 'e':
				oppositeType = 's';
				subType = 'start';
				break;
			default:
				break;
		}
		//기존 값 reset
		currentWorkData[subType+'X'] = '';
		currentWorkData[subType+'Y'] = '';
		currentWorkData[subType+'Time'] = '';
		currentWorkData[subType+'Frame'] = '';
		displayTime(oppositeType, currentWorkData[subType+'Time']);
		btnDisabled($('.btn_'+subType+'V'), currentWorkData[subType+'Time'])
		$('.'+subType+'X').text('0.00');
		$('.'+subType+'Y').text('0.00');
		//새로 지정
		timeSet(type, obj, event);
	}

	/**
	 * 시작/종료점 지정을 위한 영상 mousedown 이벤트 적용.
	 * 시작/종료점 비교만 하고, 데이터 실제 setting은 timeSet함수 내에서 진행한다.
	 * @param type : 시작(s)/종료(e)
	 * @param obj : 이벤트 적용 객체
	 */
	function moseDownOnVideo(type, obj) {
		$(video.obj).add('.tooltip').off('mousedown').on('mousedown',function (e){ // video.obj:영상 & .tooltip:좌표 말풍선
			if(type == 's') {
				if( (typeof currentWorkData.endTime) == 'number' && numberToFixed(video.obj.currentTime) >= numberToFixed(currentWorkData.endTime) ) {
					$.confirm('시작 시점이 종료 시점보다 늦습니다. 종료점을 초기화시키겠습니까?', function (){ resetSection('s', obj, e) });
					return;
				}
			} else if(type == 'e') {
				if( (typeof currentWorkData.startTime) == 'number' && numberToFixed(video.obj.currentTime) <= numberToFixed(currentWorkData.startTime) ) {
					$.confirm('종료 시점이 시작 시점보다 빠릅니다. 시작점을 초기화시키겠습니까?', function (){ resetSection('e', obj, e) });
					return;
				}
			}
			timeSet(type, obj, e);
		});
	}

	/**
	 * 시작/종료 데이터 setting
	 * @param type
	 * @param obj
	 * @param event
	 */
	function timeSet(type, obj, event) {
		var subType = '';
		switch (type) {
			case 's':
				subType = 'start';
				break;
			case 'e':
				subType = 'end';
				break;
			default:
				break;
		}

		currentWorkData[subType+'X'] = event.pageX - video.left;
		currentWorkData[subType+'X'] = currentWorkData[subType+'X'] * video.scaleX //영상의 실 좌표값 구하기
		currentWorkData[subType+'Y'] = event.pageY - video.top;
		currentWorkData[subType+'Y'] = currentWorkData[subType+'Y'] * video.scaleY //영상의 실 좌표값 구하기
		currentWorkData[subType+'Time'] = video.obj.currentTime;
		currentWorkData[subType+'Frame'] = Math.round(video.rate * video.obj.currentTime);

		displayTime(type, currentWorkData[subType+'Time']);
		btnDisabled($('.btn_'+subType+'V'), currentWorkData[subType+'Time'])

		displayCoordinate();
		btnDisabled($('.btn_loop'), currentWorkData.startTime, currentWorkData.endTime);

		$(video.obj).add('.tooltip').off('mousedown');
		$(obj).removeClass('on');
	}

	function timeUpdate() {
		//현재 재생 시간
		displayTime('',video.obj.currentTime);
		// progress bar 진행율
		var totalPercent = $('.progress_bar')[0].getBoundingClientRect().width-16;//16=버튼지름
		var cal = (totalPercent / video.obj.duration) * video.obj.currentTime;
		var percentage = Math.floor(cal);
		$('.progress_btn').css('left',percentage);
		// 좌표 표시
		displayCoordinate();

		if(video.obj.duration == video.obj.currentTime) {
			$('.btn_pause').removeClass('on');
			$('.btn_play').addClass('on');
		}
	}

	/**
	 * 시간 표시
	 * @param type : 시작(s)/종료(e)/총 영상 시간(t)
	 * @param time
	 */
	function displayTime(type, time) {
		var min = Math.floor((time%3600)/60);
		var sec = numberToFixed(time%60);
		if(min < 10) min = '0' + min;
		if(sec < 10) sec = '0' + sec;

		switch (type) {
			case 's':
				$('.startTime').text(min+':'+sec);
				break;
			case 'e':
				$('.endTime').text(min+':'+sec);
				break;
			case 't':
				$('.totalTime').text(min+':'+sec);
				break;
			default:
				$('.currentTime').text(min+':'+sec);
				break;
		}
	}

	/**
	 * 시작점&종료점 좌표 표시
	 */
	function displayCoordinate() {
		$('.video_box').find('.tooltip').remove();
		if(video.obj.paused) {
			if((typeof currentWorkData.startTime) == 'number' && numberToFixed(video.obj.currentTime) == numberToFixed(currentWorkData.startTime)) {
				ctrlCoordinate('s', Number(currentWorkData.startX), Number(currentWorkData.startY), currentWorkData.startTime);
			} else if((typeof currentWorkData.endTime) == 'number' && numberToFixed(video.obj.currentTime) == numberToFixed(currentWorkData.endTime)) {
				ctrlCoordinate('e' ,Number(currentWorkData.endX) ,Number(currentWorkData.endY), currentWorkData.endTime);
			}
		}

	}

	/**
	 * 좌표 화면상 위치
	 * @param type : 시작(s)/종료(e)
	 * @param x
	 * @param y
	 * @param time
	 */
	function ctrlCoordinate(type ,x ,y, time){
		if(!$.isEmptyObject(time)) {
			isPaused()
			var innerHtml = '';
			if(type == 's') {
				$('.startX').text(Number(x).toFixed(2));
				$('.startY').text(Number(y).toFixed(2));
				innerHtml = '<em>시작</em>';
			} else {
				$('.endX').text(Number(x).toFixed(2));
				$('.endY').text(Number(y).toFixed(2));
				innerHtml = '<em>종료</em>';
			}

			//화면상 좌표
			x = x/video.scaleX;
			y = y/video.scaleY;

			var $html = $("<span />")
				.addClass("tooltip")
				.addClass("bl")
				.css({
					left: Number(video.relativeLeft)+Number(x)-4 + "px",
					top: Number(video.relativeTop)+Number(y)-28 + "px",
				})
				.insertAfter(video.obj);
			$html.append(innerHtml);

			if( y < 28 ) { // 위
				$html.removeClass().addClass('tooltip').addClass('tl');
				$html.css({
					top: Number(video.relativeTop)+Number(y)+8 + "px",
				})
				if( (video.right - (Number(video.relativeLeft)+Number(x))) < 40 ) { // 우
					$html.removeClass().addClass('tooltip').addClass('tr');
					$html.css({
						left: Number(video.relativeLeft)+Number(x)-36 + "px",
					})
				}
			} else { // 아래
				if( (video.right - (Number(video.relativeLeft)+Number(x))) < 40 ) { // 우
					$html.removeClass().addClass('tooltip').addClass('br');
					$html.css({
						left: Number(video.relativeLeft)+Number(x)-36 + "px",
					})
				}
			}
		}
	}


	function togglePlay() {
		var method = video.obj.paused ? 'play' : 'pause'; // 비디오 재생 상태에 따른 메소드 호출
		video.obj[method]();
		isPaused()
	}

	function isPaused() {
		if(video.obj.paused) {
			$('.btn_pause').removeClass('on');
			$('.btn_play').addClass('on');
		} else {
			$('.btn_play').removeClass('on');
			$('.btn_pause').addClass('on');
		}
	}

	/**
	 * 영상 진행률
	 * @param obj : 버튼
	 * @param parent : 버튼부모 Element
	 */
	function  progressBar(obj, parent) {
		var width = $(parent)[0].getBoundingClientRect().width-16;//16=버튼지름
		var percent = obj.position.left / width;
		video.obj.currentTime = percent * video.obj.duration;
	}

	/**
	 * 임시저장
	 */
	function saveFixedData(){
		var parameter = saveProc();
		$Object.saveContentForWork(parameter);
		$.alert('임시 저장되었습니다.');
	}

	/**
	 * 저장&다음파일
	 */
	function saveAndGotoNext(){
		var parameter = saveProc();
		//필수값 체크
		if(parameter.contentKind == '' || parameter.contentKind1 == '') {
			$.alert('이상행동 유형을 선택해 주세요.');
			return;
		}
		if(parameter.contentKind == 'H') {
			if (parameter.contentKind2 == '' || parameter.contentKind3 == '') {
				$.alert('이상행동 유형을 선택해 주세요.');
				return;
			}
		}
		if(parameter.startTime == '') {
			$.alert('시작점을 등록해 주세요.');
			return;
		}
		if(parameter.endTime == '') {
			$.alert('종료점을 등록해 주세요.');
			return;
		}

		$Object.saveContentForWork(parameter, $Object.requestInspectForWork);
	}

	function saveProc() {
		var workData = currentWorkData.data;

		var contentKind = $('[name=contentKind]:checked').val();
		var contentKind1Arr = $('[name=contentKind1]');

		$("form[name=work-data]", $mP).append('<input type="hidden" name="contentKind" value="'+contentKind+'"/>');
		if(contentKind == 'H') $("form[name=work-data]", $mP).append('<input type="hidden" name="contentKind1" value="'+$(contentKind1Arr[0]).val()+'"/>');
		else if(contentKind == 'W') $("form[name=work-data]", $mP).append('<input type="hidden" name="contentKind1" value="'+$(contentKind1Arr[1]).val()+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="contentKind2" value="'+$('[name=contentKind2]').val()+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="contentKind3" value="'+$('[name=contentKind3]').val()+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="start" value="'+workData.startX+','+workData.startY+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="end" value="'+workData.endX+','+workData.endY+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="startTime" value="'+workData.startTime+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="endTime" value="'+workData.endTime+'"/>');
		$("form[name=work-data]", $mP).append('<input type="hidden" name="startFrame" value="'+workData.startFrame+'"/>');

		$("form[name=work-data]", $mP).append('<input type="hidden" name="endFrame" value="'+workData.endFrame+'"/>');

		var parameter = $("form[name=work-data]", $mP).formJson();
		parameter.contextId = currentWorkData.contextId;
		$("form[name=work-data]", $mP).html('');

		return parameter;
	}

	/**
	 * 작업 불가
	 */
	function ignoreAndGotoNext() {
		var labelList = [
			{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }
		];
		$.commentAll(
			"작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
			, function(data) {
				$Object.requestIgnoreForWork(data.comment);
			}					// ok Function
			, null				// cancel Function
			, "작업불가 지정"		// Title
			, "작업불가"				// OK Title
			, "취소"				// Cancel Title
			, labelList			// label list
		);
	}

	function numberToFixed(number) {
		if( (typeof number) == 'number' ) return Number(Number(number).toFixed(1));
		else return '';
	}

	function btnDisabled(obj, time1, time2) {
		if( (typeof time2) == 'number' ) {
			if( (typeof time1) == 'number' && (typeof time2) == 'number' ) {
				$(obj).attr('disabled', false);
				$(obj).css('color', '#fff');
			} else {
				$(obj).attr('disabled', true);
				$(obj).css('color', '#ccc');
			}
		} else {
			if( (typeof time1) == 'number' && (typeof time2) != 'string') {
				$(obj).attr('disabled', false);
				$(obj).css('color', '#73829a');
			} else {
				$(obj).attr('disabled', true);
				$(obj).css('color', '#ccc');
			}
		}

	}

	function failCallback(result) {
		console.log(result);
	}

	return {
		init: init
	}
})();