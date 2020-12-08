'use strict';

var videoLipViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui
	var $modal;		// question modal

	var defaultJobType = "LR";
	var jobClassName = "lip";

	let mediaRecorder;
	let recordedBlobs;

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
		// about navi action
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);

		$("button.rcd_ready", $mP).on("click", async () => {
			await startRecord();
		});
		$("button.rcd_complete", $mP).on("click", stopRecord);

		$("button.rcd_check", $mP).on("click", play);
		$("button.rcd_pause", $mP).on("click", pause);
		$("button.rcd_redo", $mP).on("click", async () => {
			await startRecord();
		});
	}

	/** FOR NAVIGATE **/
	function goPrevJob() {
		$.confirm("촬영을 중지하고 목록화면으로 나가시겠습니까?"
			, function() {
				MindsJS.replacePage("/project/projectList.do?menu-id=V");
			}
			, null, "나가기"
		);
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml);
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// }
		$Object.getCurrentJobContext(displayContents, failCallback);
		// contents 를 새로 로드했을 때 isTemporary data = false
	}
	function selectQuestionData() {
		$Object.selectData(questionDataRender, failCallback);
	}
	function saveAndGotoNext() {
		$.confirm("작업한 내용을 전송하고 다음 작업을 하시겠습니까?", function() {
			$Object.saveContentForWork($answerMap, $Object.requestInspectForWork);
		});
	}
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
	function saveResult() {
		getCurrentJob();
	}
	// 임시저장
	function saveQuestionData(bViewMessage) {
		$Object.saveContentForWork($answerMap, function() {
			if(bViewMessage) {
				emptyTemporaryData();
				$.alert("작업한 내용이 임시저장 됐습니다.", selectQuestionData);
			} else {
				selectQuestionData();
			}
		});
	}

	function saveModalData(formData) {
		$Object.saveQuestionForWork(formData, function() {
			selectQuestionData();
		});
	}
	function displayContents(context) {
		clearDisplay();
		if(context != null) {
			$("div.script_area > .textarea", $mP).html(context.context);
		}
	}
	function clearDisplay() {
		if(typeof $UI != 'undefined') {
		}
		pause();	// 재생중이면 중지
		stopRecord();	// 녹화중이면 정지
		$("button.rcd_check", $mP).addClass("on");
		$("button.rcd_check", $mP).siblings("button").removeClass("on");
	}

	/** 페이지 내 고유 작업 **/
	var isPlay = false;
	var isRecord = false;
	async function startRecord() {
		pause();
		if(!isRecord) {
			console.log("recording");
			const constraints = {
				audio: {
					echoCancellation: {exact: true}
				},
				video: {
					width: 500, height: 500 //, facingMode: 'environment'
				}
			};
			await initRecorder(constraints);

			isRecord = true;
			$("button", $mP).removeClass("on");
			$("button.rcd_complete", $mP).addClass("on");
		}
	}
	function startRecording() {
		recordedBlobs = [];
		let options = {mimeType: 'video/webm;codecs=vp9,opus'};
		if (!MediaRecorder.isTypeSupported(options.mimeType)) {
			console.error(`${options.mimeType} is not supported`);
			options = {mimeType: 'video/webm;codecs=vp8,opus'};
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				console.error(`${options.mimeType} is not supported`);
				options = {mimeType: 'video/webm'};
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					console.error(`${options.mimeType} is not supported`);
					options = {mimeType: ''};
				}
			}
		}
		try {
			mediaRecorder = new MediaRecorder(window.stream, options);
		} catch (e) {
			console.error('Exception while creating MediaRecorder:', e);
			//errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
			$.alert(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
			return;
		}
		console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
		mediaRecorder.onstop = (event) => {
			console.log('Recorder stopped: ', event);
			console.log('Recorded Blobs: ', recordedBlobs);
		};
		mediaRecorder.ondataavailable = handleDataAvailable;
		mediaRecorder.start();
		console.log('MediaRecorder started', mediaRecorder);
	}
	function handleDataAvailable(event) {
		console.log('handleDataAvailable', event);
		if (event.data && event.data.size > 0) {
			recordedBlobs.push(event.data);
		}
	}
	function stopRecord() {
		if(isRecord) {
			mediaRecorder.stop();
			isRecord = false;
			$("button", $mP).removeClass("on");
			$("button.rcd_check", $mP).addClass("on");
			$("button.rcd_redo", $mP).addClass("on");
		}
	}
	function play() {
		if(!isPlay) {
			isPlay = true;
			$(this).removeClass("on");
			$(this).siblings("button").addClass("on");

			const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
			recordedVideo.src = null;
			recordedVideo.srcObject = null;
			recordedVideo.src = window.URL.createObjectURL(superBuffer);
			recordedVideo.controls = true;
			recordedVideo.play();
		}
	}
	function pause() {
		if(isPlay) {
			console.log("pause");
			recordedVideo.pause();
			isPlay = false;
			$(this).removeClass("on");
			$(this).siblings("button").addClass("on");
		}
	}

	async function initRecorder(constraints) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			handleSuccess(stream);
		} catch (e) {
			console.error('navigator.getUserMedia error:', e);
			$.alert(e);
		}
	}
	function handleSuccess(stream) {
		console.log('getUserMedia() got stream:', stream);
		window.stream = stream;

		const gumVideo = document.querySelector('video#gum');
		gumVideo.srcObject = stream;

		startRecording();
	}

	/** LOCAL FUNCTION AND UI **/
	function failCallback(result) {
		console.log(result);
	}

	// PUBLIC FUNCTION
	return {
		init: init
	}
})();