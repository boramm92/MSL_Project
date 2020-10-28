'use strict';
var videoLipViewScript = (function() {
	var $mP;
	var $Object;
	var $UI;

	var defaultJobType = "LR";
	var jobClassName = "lip";

	let mediaRecorder;
	let recordedBlobs;

	var $videoRecorder;
	var $videoPlayer;
	var $guideText;

	const videoPlayerElem = document.querySelector("video#recorded");

	var isPlay = false;
	var isRecord = false;
	var isChecked = false;

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initVideoProject({
			projectId: projectId,
			projectType: "V",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		$videoRecorder = $("video#gum", $mP);
		$videoPlayer = $("video#recorded", $mP);
		$guideText = $("span.guide_txt", $mP);

		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnPrev", $mP).on("click", movePrevList);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);

		// about recording and play
		$("button.btnFrame", $mP).on("click", async () => {
			await startCamera();
		});
		$("button.btnRecord", $mP).on("click", async () => {
			await startRecording();
		});
		$("button.btnComplete", $mP).on("click", stopRecording);
		$("button.btnPlay", $mP).on("click", play);
		$("button.btnPause", $mP).on("click", pause);
		$("button.btnRetry", $mP).on("click", async () => {
			await startCamera();
		});
	}
	function movePrevList() {
		$.confirm("촬영을 중지하고 목록화면으로 나가시겠습니까?"
			, function() { MindsJS.replacePage("/project/projectList.do?menu-id=V"); }
			, null
			, "나가기"
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
	function saveAndGotoNext() {
		var message = "";
		if(isChecked) {
			if(recordedBlobs != null && recordedBlobs.length > 0) {
				message = "전송은 WI-FI 환경을 권장합니다.<br>작업한 내용을 전송하고 다음 작업을 하시겠습니까?"+"<br>(전송할 파일크기 : "+recordedBlobs.length+"bytes)";
			} else {
				message = "녹화된 내용이 없습니다. <br>촬영하려면 'Cancel'을 클릭하고<br>다음 작업을 하시려면 'OK'를 클릭해 주세요.";
			}
			$.confirm(message
				, function() {
					var param = {
						file: recordedBlobs != null ? new Blob(recordedBlobs, {type: 'video/webm'}) : null,
						jobId: $UI.jobId,
						contextId: $UI.contextId,
						context: $UI.context
					};
					$Object.uploadAttachFileForWork(param);
				}
				, null
				, "전송"
			);
		} else {
			$.alert("촬영한 영상을 검토 후 전송해 주세요.");
		}

	}
	function displayContents(context) {
		clearDisplay();
		$UI = context;
		if(context != null) {
			$("div.script_area > .textarea", $mP).html(context.context);
		}
	}
	function saveResult() {
		getCurrentJob();
	}
	function clearDisplay() {
		recordedBlobs = null;
		isChecked = false;

		pause();	// 재생중이면 중지
		stopRecording();	// 녹화중이면 정지
		$("button", $mP).removeClass("on");
		$("button.btnFrame", $mP).addClass("on");
		$(".guide_box span.guide_txt1").addClass("on");
		$('.guide_box').css('background', 'none');
		$('.camera_area span.guide_txt2').removeClass('on');

		$("div.script_area > .textarea", $mP).html("");
		$guideText.show();
		$videoRecorder.hide();
		$videoPlayer.hide();
	}
	/**
	 * GET DEVICE PERMISSION
	 * @returns {Promise<void>}
	 */
	async function initRecorder(constraints) {
		try {
			// device 권한 얻기 성공시
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			handleSuccess(stream);
		} catch (e) {
			// device 권한 얻기 실패시
			$.alert("카메라를 사용할 수 없습니다.<br>카메라가 켜져있거나 브라우저 앱의 녹화 기능이 꺼져 있을 수 있습니다.");
		}
	}
	function handleSuccess(stream) {
		window.stream = stream;
		const gumVideo = document.querySelector('video#gum');
		gumVideo.srcObject = stream;
		pause();	// 재생중인 영상을 중지

		$("button", $mP).removeClass("on");
		$("button.btnRecord", $mP).addClass("on");
		$('.guide_box').css('background', 'rgba(0,0,0,0.5)');
		$('.camera_area span.guide_txt1').removeClass('on');
		$('.camera_area span.guide_txt2').addClass('on');

		$guideText.hide();
		$videoPlayer.hide();
		$videoRecorder.show();
	}

	/**
	 * RECORDER & PLAYER CONTROL
	 * @returns {Promise<void>}
	 */
	async function startCamera() {
		isChecked = false;
		const constraints = {
			audio: {
				echoCancellation: {exact: true}
			},
			video: {
				width: 500, height: 500 , facingMode: 'user'		// or 'environment'
			}
		};
		await initRecorder(constraints);
	}
	// 스트리밍 데이터 PUSH
	function handleDataAvailable(event) {
		if (event.data && event.data.size > 0) {
			recordedBlobs.push(event.data);
		}
	}
	function startRecording() {
		if(!isRecord) {
			isRecord = true;
			isChecked = false;

			$("button", $mP).removeClass("on");
			$("button.btnComplete", $mP).addClass("on");
			$(".video_box", $mP).addClass("active");
			$('.guide_box').css('background', 'none');
			$('.camera_area span.guide_txt2').removeClass('on');

			recordedBlobs = [];
			let options = {mimeType: 'video/webm;codecs=vp9,opus'};
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				options = {mimeType: 'video/webm;codecs=vp8,opus'};
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					options = {mimeType: 'video/webm'};
					if (!MediaRecorder.isTypeSupported(options.mimeType)) {
						options = {mimeType: ''};
					}
				}
			}
			try {
				mediaRecorder = new MediaRecorder(window.stream, options);
			} catch (e) {
				$.alert(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
				return;
			}
			mediaRecorder.onstop = (event) => {
				const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
				videoPlayerElem.src = null;
				videoPlayerElem.srcObject = null;
				videoPlayerElem.src = window.URL.createObjectURL(superBuffer);
			};
			mediaRecorder.ondataavailable = handleDataAvailable;
			mediaRecorder.start();
		}
	}
	function stopRecording() {
		if(mediaRecorder != null && isRecord) {
			mediaRecorder.stop();

			isRecord = false;
			$("button", $mP).removeClass("on");
			$("button.btnPlay", $mP).addClass("on");
			$("button.btnRetry", $mP).addClass("on");
			$(".video_box", $mP).removeClass("active");

			$videoRecorder.hide();
			$videoPlayer.show();
		}
	}
	function play() {
		if(videoPlayerElem != null) {
			isPlay = true;
			isChecked = true;
			$(this).removeClass("on");
			$(this).siblings("button").addClass("on");

			videoPlayerElem.play();
		}
	}
	function pause() {
		if(isPlay) {
			isPlay = false;
			$(this).removeClass("on");
			$(this).siblings("button").addClass("on");

			videoPlayerElem.pause();
		}
	}

	function failCallback(result) {
		console.log(result);
	}

	return {
		init: init
	}
})();