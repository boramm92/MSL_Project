
 (function(){
	function Init(){
		var fileSelect = document.getElementById('file-upload'),
			fileDrag = document.getElementById('file-drag'),
			submitButton = document.getElementById('submit-button'),
			fileListNum = document.querySelector('.fileNum'),
			filesVolume = document.querySelector('.fileVolume');

		// 파일 선택 시 
		fileSelect.addEventListener('change', fileSelectHandler, false);

		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			// 파일 드래그 앤 드롭 시
			fileDrag.addEventListener('dragover', fileDragHover, false);
			fileDrag.addEventListener('dragleave', fileDragHover, false);
			fileDrag.addEventListener('drop', fileSelectHandler, false);
		}
	}

	// 파일 드래그 앤 드롭 시 
	function fileDragHover(e){
		e.stopPropagation();
		e.preventDefault();

		var fileDrag = document.getElementById('file-drag');		
		fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
	}

	// 파일 선택 시
	function fileSelectHandler(e) {
		var fileUploadBox = document.querySelector('.upload_form_box'),
			fileAddButton = document.querySelectorAll('.btn_file_add')[1];
		fileUploadBox.classList.remove('active');

		// Fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// Cancel event and hover styling
		fileDragHover(e);

		// 파일 업로드 될 시 실행
		for (var i = 0, f; f = files[i]; i++) {
			parseFile(f);
			uploadFile(f);
		}
	}

	// 파일 목록 생성
	function output(msg){
		var m = document.getElementById('messages');
		m.innerHTML = msg + m.innerHTML;
	}

	// 파일 목록 생성 템플릿
	function parseFile(file){
		output(
			'<li>'
			+	'<em class="far fa-file-image"></em>'			
			+	'<span>' + encodeURI(file.name) +'</span>'
			+	'<button type="button" class="btn_file_delete"><span class="hide">파일삭제</span><em class="fas fa-times"></em></button>'
			+'</li>'
		);
	}

	function setProgressMaxValue(e){
		var pBar = document.getElementById('file-progress');

		if(e.lengthComputable){
			pBar.max = e.total;
		}
	}

	function updateFileProgress(e){
		var pBar = document.getElementById('file-progress');

		if(e.lengthComputable){
			pBar.value = e.loaded;
		}
	}

	function uploadFile(file){

		var xhr = new XMLHttpRequest(),
			fileInput = document.getElementById('class-roster-file'),
			pBar = document.getElementById('file-progress'),
			fileSizeLimit = 1024;	// In MB
		if (xhr.upload){
			// Check if file is less than x MB
			if (file.size <= fileSizeLimit * 1024 * 1024){
				// Progress bar
				xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
				xhr.upload.addEventListener('progress', updateFileProgress, false);

				// File received / failed
				xhr.onreadystatechange = function(e){
					if (xhr.readyState == 4){
						// Everything is good!						
						// progress.className = (xhr.status == 200 ? "success" : "failure");
						// document.location.reload(true);
					}
				};

				// Start upload
				// [D] 하단의 'xhr.send(file);' 부분은 퍼블환경에서 오류가 생겨 주석처리 하였습니다.
				xhr.open('POST', document.getElementById('file-upload-form').action, true);
				xhr.setRequestHeader('X-File-Name', file.name);
				xhr.setRequestHeader('X-File-Size', file.size);
				xhr.setRequestHeader('Content-Type', 'multipart/form-data');
				// xhr.send(file);
			}else{
				output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
			}
		}
	}

	// Check for the various File API support.
	if (window.File && window.FileList && window.FileReader){
		Init();
	}else{
		document.getElementById('file-drag').style.display = 'none';
	}
})();
