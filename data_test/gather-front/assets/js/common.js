(function ($) {
	$.fn.formJson = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if(o[this.name]!=undefined) {
				if(!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	$.fn.loadJson = function(uri,callback) {
		var $this = $(this);
		if(uri == undefined || uri == null) {
			uri = $this.attr("action");
		}
		MindsJS.loadJson(uri, $this.serialize(), callback);
	};
	$.fn.paging = function(settings) {
		var $this = $(this);
		var _handler = $this.data("pagingHandler");
		_handler = new MindsJS.PagingHandler($this, settings);
		$this.data("pagingHandler", _handler);
		return _handler;
	};
	$.fn.uploadFile = function(settings) {
		var $this = $(this);
		MindsJS.uploadFile($this, settings);
	};
	$.fn.excelDownload = function(settings) {
		var $this = this;	// form
		var param = $this.formJson();
		param.logMenu = settings.subMenuId || 0;
		MindsJS.movePage(settings.uri, param);
	};
	$.fn.findFile = function(settings) {
		var $this = $(this);
		MindsJS.findFile($this, settings);
	}
	$.fn.show = function() {
		var $this = $(this);
		$this.css("display", "block");
		return $this;
	};
	$.fn.hide = function() {
		var $this = $(this);
		$this.css("display", "none");
		return $this;
	};
	$.fn.drop = function() {
		var $this = $(this);
		$this.remove();
	};
	$.fn.replaceAll = function(targetChar, replaceChar) {
		return $(this).val().split(targetChar).join(replaceChar);
	};
	$.fn.loadGPS = function(callback) {
		var param = $(this).formJson();
		MindsJS.loadGPS(param, callback, true);
	}
	$.fn.loadKakaoLoc = function(callback) {
		var param = $(this).formJson();
		MindsJS.loadKakaoLoc(param, callback, true);
	}
	
	$.error = function(result, func) {
		MindsJS.alert(result.failStack[0].error, function() {
			try {
				$('[name="'+result.failStack[0].targetId+'"]').get(result.failStack[0].targetRow).focus();
			} catch(Exception) {
				// Ignore case
			}
			if($.isFunction(func)) {
				func();
			}
		}, "알림");
	};
	$.alert = function(msg, func, title, okLabel) {
		MindsJS.alert(msg, func, title, okLabel);
	};
	$.confirm = function(msg, okFunc, cancelFunc, title, okLabel, cancelLabel) {
		MindsJS.confirm(msg, okFunc, cancelFunc, title, okLabel, cancelLabel);
	};
	$.batch = function(msg, okFunc, cancelFunc, title) {
		MindsJS.batch(msg, okFunc, cancelFunc, title);
	};
	$.comment = function(msg, okFunc, cancelFunc, title) {
		MindsJS.comment(msg, okFunc, cancelFunc, title);
	};
	$.commentAll = function(message, okCallback, cancelCallback, title, okTitle, cancelTitle, labelList) {
		MindsJS.comment(message, okCallback, cancelCallback, title, okTitle, cancelTitle, labelList);
	};
	$.isEmpty = function(string) {
		if(typeof string === 'undefined') return true; 
		if(string == null) return true;
		if(string == "") return true;
		if(string == 'undefined') return true;
		return false;
	};
	$.isEmptyObject = function(object) {
		if(typeof object === 'undefined') return true;
		if(object == null) return true;
		if(object.length <= 0) return true;
		return false;
	}
	$.getParameterByName = function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	$.checkPasswd = function(passwd, compare, minLength) {
		if(minLength == null || minLength <= 0) minLength = 8;
		if($.isEmpty(passwd)) {
			$.alert("패스워드를 입력해 주세요.");
			return false;
		}
		if(passwd.length < minLength) {
			$.alert("패스워드 최소 길이는 "+minLength+"자 입니다.");
			return false;
		}
		if(compare != null && passwd != compare) {
			$.alert("패드워드가 동일한지 확인해 주세요.");
			return false;
		}
		return true;
	};
	$.checkEmail = function(email) {
		if($.isEmpty(email)) return false;

		var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		return(email != '' && email != 'undefined' && regex.test(email));
	};
	$.checkSaup = function(inputUnit) {
		var regExp = /^(?:[0-9]{3})-(?:[0-9]{2})-(?:[0-9]{5})$/;
		var string = inputUnit.split("-").join("");
		if($.isEmpty(string)) {
			return false;
		}
		string = string.substring(0,3)+"-"+string.substring(3,5)+"-"+string.substring(5);
		if(regExp.test(string)) {
			return true;
		} else {
			return false;
		}
	};
	$.checkJumin = function(inputUnit) {
		var regExp = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/;
						// year      month            day(10)     day(1)        -
		var string = inputUnit.split("-").join("");
		if($.isEmpty(string)) {
			return false;
		}
		string = string.substring(0,6)+"-"+string.substring(6);
		if(regExp.test(string)) {
			return true;
		} else {
			return false;
		}
	};
	$.checkBirth = function(inputUnit) {
		var regExp = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/;
		// year      month            day(10)     day(1)        -
		var string = inputUnit.split("-").join("");
		if($.isEmpty(string)) {
			return false;
		}
		//string = string.substring(0,6);
		if(regExp.test(string)) {
			return true;
		} else {
			return false;
		}
	};

	Number.prototype.format = function(){
		if(this==0) return 0;

		var reg = /(^[+-]?\d+)(\d{3})/;
		var n = (this + '');

		while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

		return n;
	};
	// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
	String.prototype.format = function(){
		var num = parseFloat(this);
		if( isNaN(num) ) return "0";

		return num.format();
	};
})(jQuery);

var MindsJS = (function() {
	var isDev = false;
	var ajaxCallCount = 0;

	var specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	var morpheCharReqExp = /(\/nng|\/ss|\/jkb|\/jx|\/ep|\/vcp|\/jkg|\/jkq|\/jko|\/vx|\/vv|\/etm|\/jc|\/ec|\/ef|\/sf|\/x|\/p|\/o|\/q)/gi;
	
	$.ajaxSetup({
		type: "POST",
		async: true,
		timeout: 600000
	});
	
	function replaceMorpheme(morpheme) {
		return morpheme.replace(morpheCharReqExp, "");
	}
	
	function init() {
		console.info("commJS init");
		commIndicator.init();
		commDialog.init();
	}

	function loadKakaoLoc(locationList, callback, bActiveIndicator) {
		if(locationList != null) {
			var placeList = locationList.content;
			if(placeList != null && placeList.length > 0) {
				if (typeof placeList == 'string') {
				} else {
				}
			}
		} else {
			console.log("keyword 가 없습니다.");
			return;
		}
		loadJson(
			"/location/selectAddressFromKeyword.json"
			, locationList
			, function(result) {
				if(callback != null && typeof callback === 'function') {
					callback(result.data);
				}
			}
		);
	}

	function loadGPS(locationList, callback, bActiveIndicator) {
		if(bActiveIndicator) {
			if(ajaxCallCount == 0) {
				commIndicator.show();
			}
			ajaxCallCount++;
		}
		// google api 를 기본으로 사용
		var gApiKey = "AIzaSyBoMoQQhbDF8QgHHY4KK9SWDDZqFM9lTKw";
		var uri = "https://maps.googleapis.com/maps/api/geocode/json?key="+gApiKey+"&language=en&"+"address=";

		if(locationList != null) {
			var placeList = locationList.content;
			var requestCnt = 0;
			if(placeList != null && placeList.length > 0) {
				if (typeof placeList == 'string') {
					locationList.type = "";
					requestCnt = 1;
					var requestUri = uri + placeList;
					$.get(requestUri, null, function(data, status) {
						if(status == 'success') {
							if (data.status != null) {
								var dataList = data.results;
								if(dataList != null && dataList.length > 0) {
									if(dataList[0] != null) {
										var latitude = dataList[0]['geometry']['location']['lat'];
										var longitude = dataList[0]['geometry']['location']['lng'];
										locationList.latitude = typeof latitude == 'number' ? latitude.toFixed(6) : '';
										locationList.longitude = typeof longitude == 'number' ? longitude.toFixed(6) : '';

										if(!$.isEmptyObject(locationList.type)) {
											locationList.type = dataList[0]['types'][2];
										}
									} else {
										$.alert("Request Denied for Google Map API.");
										if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
										return;
									}
								}
							} else {
								$.alert(data.error_message);
								if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
								return;
							}
						} else {
							$.alert("Request Denied for Google Map API.");
							if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
							return;
						}
						if(--requestCnt <=0) {
							if(callback != null && typeof callback === 'function') {
								callback(locationList);
							}
							if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
							return;
						}
					});
				} else {
					locationList.type = [];
					locationList.latitude = [];
					locationList.longitude = [];
					requestCnt = placeList.length;
					for(var i in placeList) {
						var requestUri = uri + placeList[i];
						let index = i;
						$.get(requestUri, null, function(data, status) {
							if(status == 'success') {
								if (data.status != null) {
									var dataList = data.results;
									if(dataList != null && dataList.length > 0) {
										if(dataList[0] != null) {
											var latitude = dataList[0]['geometry']['location']['lat'];
											var longitude = dataList[0]['geometry']['location']['lng'];
											locationList.latitude[index] = typeof latitude == 'number' ? latitude.toFixed(6) : '';
											locationList.longitude[index] = typeof longitude == 'number' ? longitude.toFixed(6) : '';

											if(!$.isEmptyObject(locationList.type)) {
												locationList.type[index] = dataList[0]['types'][2];
											}
										} else {
											$.alert("Request Denied for Google Map API.");
											if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
											return;
										}
									}
								} else {
									$.alert(data.error_message);
									if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
									return;
								}
							} else {
								$.alert("Request Denied for Google Map API.");
								if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
								return;
							}
							if(--requestCnt <=0) {
								if(callback != null && typeof callback === 'function') {
									callback(locationList);
								}
								if(bActiveIndicator) { if(--ajaxCallCount == 0) { commIndicator.hide(); } }
								return;
							}
						});
					}
				}
			} else {
				// 전송할 장소가 없음
			}
		}
	}
	function loadJson(url, paramMap, callback, bActiveIndicator) {
		if(bActiveIndicator) {
			if(ajaxCallCount == 0) {
				commIndicator.show();
			}
			ajaxCallCount++;
		}
		var ctrlRef = $.ajax({
			url: contextPath+url,
			data: paramMap,
			dataType: "json",
			error: errorHandler,
			success: function(data, textStatus, jqXHR) {
				if(logoutHandler(jqXHR)) {return;}		// 로그인 또는 권한체크 여부 확인
				if(typeof callback === 'function') {
					callback(data);
				}
			},
			complete: function(jqXHR, textStatus) {
				if(bActiveIndicator) {
					if(--ajaxCallCount == 0) {
						commIndicator.hide();
					}
				}
			}
		});
	}
	function loadBlob(url, paramMap, callback, bActiveIndicator) {
		if(bActiveIndicator) {
			if(ajaxCallCount == 0) {
				commIndicator.show();
			}
			ajaxCallCount++;
		}
		var ctrlRef = $.ajax({
			url: contextPath+url,
			data: paramMap,
			dataType: "text",
			error: errorHandler,
			success: function(data, textStatus, jqXHR) {
				if(logoutHandler(jqXHR)) {return;}		// 로그인 또는 권한체크 여부 확인
				if(typeof callback === 'function') {
					callback(data);
				}
			},
			complete: function(jqXHR, textStatus) {
				if(bActiveIndicator) {
					if(--ajaxCallCount == 0) {
						commIndicator.hide();
					}
				}
			}
		});
	}
	function errorHandler(jqXHR, textStatus, errorThrow) {
		var errorX00 = (jqXHR.status / 100) * 100;
		if(errorX00 == 500) {
			var failStack = jqXHR.responseJSON.failStack[0];
			MindsJS.replacePage("/html/error/pages_500.jsp");
		}
		else if (errorX00 == 400) {
			var failStack = jqXHR.responseJSON.failStack[0];
			if(jqXHR.status == 401) {
				MindsJS.replacePage("/html/error/pages_401.jsp");
			}
			if(jqXHR.status == 404) {
				MindsJS.replacePage("/html/error/pages_404.jsp");
			}
			if(jqXHR.status == 400) {
				// MindsJS.replacePage("/html/error/pages_500.jsp");
				$.alert(failStack.error
					, function() {
						var targetId = failStack.targetId;
						if($.isEmpty(targetId)) {
							// 에러코드가 없으면 특정 작업을 하지 않는다.
						} else if(
							// 에러 종류에 따라 callback 액션 구분
							targetId == "ERROR_1001" ||
							targetId == "ERROR_1002" ||
							targetId == "ERROR_1003"
						) {
							MindsJS.replacePage("/project/projectList.do");
						} else if(
							targetId == "ERROR_1004"
						) {
							MindsJS.replacePage("/");
						} else {
						}
					}
					, "Alert"
				);
			}
		}
		else {
			console.log("textStatus = [" + textStatus + "], errorThrow = [" + errorThrow + "]");
		}
	}
	function logoutHandler(jqXHR) {
		// 백엔드에서 에러전달 구분 필요
		// 로그인오류
		if(jqXHR.status==401) {
			movePage(contextPath+"/");	// M_LOGIN_PAGE 정의 필요
			return true;
		}
		// 권한오류
		if(jqXHR.status==403) {
			$.alert(NO_ROLE);
			return false;
		}
		return false;
	}
	// 화면의 특정영역(div 등)에 새로운페이지를 로딩할때
	function loadPage(wrapperSelector, url, paramMap, callback, isModal) {
		url = contextPath+url;
		commIndicator.show();
		var $wrapperSelector = wrapperSelector;
		if(typeof $wrapperSelector === 'string') {
			$wrapperSelector = $(wrapperSelector);
		}
		movePage(url);
		
		$wrapperSelector.load(url, paramMap, function(response, status, jqXHR) {
			commIndicator.hide();
			if(logoutHandler(jqXHR)) {return;}
			if(status == 'error') {
				$wrapperSelector.html(jqXHR.responseText);
			}
			if(typeof callback === 'function') {
				callback(data);
			}
		});
    	//TOP으로 스크롤 이동
    	if(!isModal){
    		$('html,body').animate({ scrollTop : 0 }, 100); // 이동
    	}
	}
	// 다른페이지로 직접 이동할 때
	function movePage(url, paramMap) {
		url = contextPath+url;
		if(paramMap) {
			var tempUrl = url + "?" + $.param(paramMap);
			document.location.href = tempUrl;
		} else {
			document.location.href = url;
		}
	}
	// 다른페이지로 이동시 history를 남기지 않을 때
	function replacePage(url, paramMap) {
		url = contextPath+url;
		if(paramMap) {
			var tempUrl = url + "?" + $.param(paramMap);
			document.location.replace(tempUrl);
		} else {
			document.location.replace(url);
		}
	}
	
	function PagingHandler($this, settings) {
		var that = this;
		this._$e = $this;
		this._dataURI = settings.dataURI;
		this._renderCallback = settings.renderCallback;
		this._paramCallback = settings.paramCallback;
		this._currentPage = settings.initPage || 1;
		this._pageLength = settings.length || 10;		// 페이지당 콘텐츠 개수
		this._pageNav = settings.pageNav;
		this._pageViewType = settings.viewType;
		this._pageBlock = settings.pageBlock;
		this._baseParam = settings.param;
		this._compBtnCallback = settings.compBtnCallback
		this._saveBtnCallback = settings.saveBtnCallback;
		this._cancelBtnCallback = settings.cancelBtnCallback;
		this._pageType = settings.pageType;
		this._language = settings.param == null ? 'ko_KR' : settings.param.language == null ? 'ko_KR' : settings.param.language;
		// paging
		this._defaultOrder = settings.defaultOrder;
		this._desc = settings.desc;
		
		this.reload = function(page) {
			this._currentPage = page || 1;
			loadData();
		}
		this.getPage = function() {
			return this._currentPage;
		}
		
		init();
		
		function init() {
			// 최초 데이터를 사용자가 액션에 의해 조회하는 경우, reload 사용
			if(settings.loadByUserAction) {
				return false;
			}
			loadData();
		}
		function loadData() {
			var paramMap = {};
			if(typeof that._paramCallback === 'function') {
				paramMap = that._paramCallback();
			} else {
				paramMap = that._baseParam;
			}
			paramMap.page = that._currentPage;
			paramMap.length = that._pageLength;
			paramMap.pageBlock = that._pageBlock;
			if(that._defaultOrder != null) {
				paramMap.pagingOrder = that._defaultOrder;
			}
			if(that._desc) {
				paramMap.desc = 'desc'
			}
			MindsJS.loadJson(that._dataURI, paramMap, function(result) {
				if(!result.success) {
					$.error(result.error);
					return false;
				}
				var itemData = result.data;
				if(typeof that._renderCallback === 'function') {
					itemData.totCount = result.recordsTotal;
					itemData.curPage = result.page;
					itemData.pageLength = that._pageLength;
					that._renderCallback(itemData);
				}
				
				if(that._pageViewType != null && that._pageViewType == 'card') {
					renderPaging(result, "jobcardPagingTemplate");
				} else {
					renderPaging(result);
				}
			});
		}
		
		function renderPaging(result, pageTemplateName) {
			if(result.recordsTotal > 0) {
				var pagingInfo = getPageInfo(result, that._pageLength);
				pagingInfo.title = (that._language == 'ko-KR' ? that._baseParam.title : that._baseParam.title_eng) + "";
				pagingInfo.pageType = that._pageType;
				
				if(result.data != null && result.data.length > 0) {
					pagingInfo.status = result.data[0].status;
				}
				
				var pageTemplateId = "";
				if(pagingInfo.pageType == null) {
					pageTemplateId = pageTemplateName != null ? pageTemplateName : "generalPagingTempate";
				} else {
					pageTemplateId = pagingInfo.pageType == 'inspect' ? 'inspectPagingTemplate' : 'writerPagingTempate';
				}
				if(that._pageNav != null) {
					var pagingHtml = $.templates("#"+pageTemplateId).render(pagingInfo);
					var $pageList = that._pageNav.html(pagingHtml);
					// Bind Event
					bindEventHandler($pageList);
				}
				that._currentPage = pagingInfo.curPage;
			} else {
				if(that._pageType == 'inspect' || that._pageType == 'writer') {
					var pagingHtml = $.templates("#pagingEmptyTemplate").render();
					var $pageList = that._pageNav.html(pagingHtml);
				} else {
					if(that._pageNav != null) {
						that._pageNav.html("");
					}
				}
			}
		}
		
		function bindEventHandler($wrapper) {
			$(".prev,.next", $wrapper).on("click", paginationHandler);
			$("a.page", $wrapper).on("click", pageMove);
			if(typeof that._compBtnCallback === 'function') {
				$("#submit_request", $wrapper).off("click").on("click", that._compBtnCallback);
			}
			if(typeof that._saveBtnCallback === 'function') {
				$("#submit_qa", $wrapper).off("click").on("click", that._saveBtnCallback);
			}
			if(typeof that._cancelBtnCallback === 'function') {
				$("#submit_reject", $wrapper).off("click").on("click", that._cancelBtnCallback);
			}
			$("input[name=curPage]").on("keydown", function(e) {
				if(e.keyCode == 13) {
					var goPage = $(this).val();
					if(goPage*1 <= 0) { return; }
					var limitPage = $wrapper.find("div.context_count").attr("limit");
					if(goPage*1 > limitPage*1) {
						$.alert("바로가기는 최대 페이지를 넘을 수 없습니다.");
						return;
					}
					that._currentPage = $(this).val();
					loadData();
				}
			});
		}
		
		function paginationHandler() {
			var $this = $(this);
			if($this.hasClass("active")) {
				return false;
			}
			var movingPage = $this.attr("page");
			if(movingPage != null && movingPage > 0) {
				that._currentPage = $this.attr("page");
				loadData();
			} else {
				if($this.hasClass("prev")) {
					$.alert("이전 본문이 없습니다.");
				}
				if($this.hasClass("next")) {
					$.alert("이후 본문이 없습니다.");
				}
			}
		}

		function pageMove() {
			that._currentPage = $(this).attr("page");
			loadData();
		}
	}
	
	function getPageInfo(pageInfo, rowPerPage) {
		var pageSize = pageInfo.totalPage;
		var pageBlock = pageInfo.pageBlock || 5;
		var pageLength = rowPerPage || 10;
		var totalLength = pageInfo.recordsTotal || 0;
		
		// page index
		var curPage = pageInfo.page; // parseInt(start/pageSize) + 1;

		var viaStart = Math.floor((curPage-1)/pageBlock)*pageBlock+1;
		var viaEnd = viaStart + pageBlock -1;
		
		var totalPage = parseInt(pageInfo.recordsTotal/pageLength) + (pageInfo.recordsTotal%pageLength == 0 ? 0 : 1);
		
		// 총 페이지보다 많은 페이지가 나오는것을 막기 위함
		if(totalPage < viaEnd) {
			viaEnd = totalPage;
		}
		
		var pageItems = [];
		for(var i=viaStart; i<=viaEnd; i++) {
			var pageItem = {
					pageNo: i,
					start: (i-1) * pageSize,
					limit: pageSize
			};
			pageItems.push(pageItem);
		}
		
		var prevNo = viaStart -1;
		var nextNo = viaEnd +1;
		
		return {
			curPage: curPage,
			prevStart: prevNo,
			nextStart: nextNo,
			limit: pageSize,
			hasPrev: prevNo > 0,
			hasNext: nextNo <= totalPage,
			pageItems: pageItems,
			total: totalLength,
			totalPage: totalPage
		};
	}
	
	/*var commIndicator_old = {
		wrapperId: "common-indicator-wrapper",
		wrapper: null,
		init: function() {
			var indicatorWrapperId = commIndicator_old.wrapperId;
			commIndicator_old.wrapper = $('<div class="modal hide" id="' + indicatorWrapperId + '" role="dialog" style="z-index:1080`;"></div>');
			commIndicator_old.wrapper.appendTo("body");
		},
		show: function() {
			commIndicator_old.wrapper.removeClass("hide");	// css에 hide class 구현 필요
		},
		hide: function() {
			commIndicator_old.wrapper.addClass("hide");		// 상동
		}
	};*/
	
	var commIndicator = {
		wrapperId: "page_ldWrap",
		wrapper: null,
		init: function() {
			console.log("commIndicator init");
			var loadingWrapperId = commIndicator.wrapperId;
			commIndicator.wrapper = $('<div id="'+loadingWrapperId+'" class="page_loading pageldg_hide" style="z-index:-1; opacity:0.7;"><div class="loading_itemBox"><span></span><span></span><span></span><span></span></div></div>');
			commIndicator.wrapper.appendTo("body");
		},
		show: function() {
			// css에 hide class 구현 필요
			commIndicator.wrapper.removeClass("pageldg_hide").css({
				"z-index":1080
			});
		},
		hide: function() {
			commIndicator.wrapper.addClass("pageldg_hide").css({
				"z-index":-1
			});		// 상동
		}
	};
	
	var commDialog = {
		//alertWrapperId: "alertPopupWrapper",
		//confirmWrapperId: "confirmPopupWrapper",
		//commentWrapperId: "commentPopupWrapper",

		alertWrapperId: "pop_1",
		alertTemplateId: "alertTemplate",
		confirmWrapperId: "pop_2",
		confirmTemplateId: "confirmTemplate",
		batchWrapperId: "batchPopupWrapper",
		batchTemplateId: "batchTemplate",
		commentWrapperId: "pop_4",
		commentTemplateId: "commentTemplate",
		completeWrapperId: "pop_1",
		wrapperAlert: null,
		wrapperConfirm: null,
		wrapperBatch: null,
		wrapperComment: null,
		lockAlert: false,		// 해당 창이 띄워지면 동일한 창이 뜨지 않게 lock을 잡고 있는지 여부
		lockConfirm: false,
		lockBatch: false,
		lockComment: false,

		// 신규 공통 TEMPLATE
		//generalWrapperId: "generalPopTemplate",
		generalWrapperId: "pop_2",
		generalCount: 0,
		wrapperGeneral: null,
		lockGeneral: false,

		init: function() {
			commDialog.wrapperAlert = $('<div class="pop_simple complate" id="' + commDialog.alertWrapperId + '" style="z-index:1060"></div>');
			commDialog.wrapperAlert.appendTo("body");
			
			commDialog.wrapperConfirm = $('<div class="pop_simple" id="' + commDialog.confirmWrapperId + '" style="z-index:1050"></div>');
			commDialog.wrapperConfirm.appendTo("body");
			
			commDialog.wrapperBatch = $('<div class="pop_simple" id="' + commDialog.batchWrapperId + '" style="z-index:1040"></div>');
			commDialog.wrapperBatch.appendTo("body");

			commDialog.wrapperComment = $('<div class="pop_simple" id="' + commDialog.commentWrapperId + '" style="z-index:1030"></div>');
			commDialog.wrapperComment.appendTo("body");

			//commDialog.wrapperGeneral = $('');
			commDialog.wrapperGeneral = $('<div class="pop_simple pop_general" id="' + commDialog.generalWrapperId + '" style="z-index:1055"></div>');
			//commDialog.wrapperGeneral = $('<div class="pop_simple" id="' + commDialog.generalWrapperId + '" style="z-index:1055"></div>');
			commDialog.wrapperGeneral.appendTo("body");
		},
		general: function(htmlTemplateId, data, addClassList) {
			if(commDialog.lockGeneral) {
				return false;
			}
			// general 팝업이 무분별하게 늘어나는 것을 방지한다.
			if(++commDialog.generalCount == 3) {
				commDialog.lockGeneral = true;
			}

			var html = $.templates("#"+htmlTemplateId).render(data);
			var $generalDialog = commDialog.wrapperGeneral.html(html);
			if(addClassList != null) {
				if(typeof addClassList == 'string') {
					$generalDialog.addClass(addClassList);
				} else {
					for(var i in addClassList) {
						$generalDialog.addClass(addClassList[i]);
					}
				}
			}
			// if(addClassList != null) {
			// 	addClassList.forEach(val => {
			// 	  	$generalDialog.addClass(val);
			// 	});
			// }
			var $isHidding = $(".pop_simple.pop_general:first").css("display") == "none" ? true : false;
			if($isHidding) {
				$generalDialog.fadeOut(100).css('z-index', 1020);
			}

			$generalDialog.find(".ico_close").on("click", function() {
				var $dialogItself = $(this).parents(".pop_simple:first");
				if($dialogItself == null) return false;

				// general 최대 팝업 가능한 수를 줄여준다.
				commDialog.generalCount--;
				commDialog.lockAlert = false;

				$dialogItself.children().remove();
				$dialogItself.fadeIn(100);

				if(addClassList != null) {
					if(typeof addClassList == 'string') {
						$dialogItself.removeClass(addClassList);
					} else {
						for(var i in addClassList) {
							$dialogItself.removeClass(addClassList[i]);
						}
					}
				}
				// if(addClassList != null) {
				// 	addClassList.forEach(val => {;
				// 		$dialogItself.removeClass(val);
				// 	});
				// }
			});
			return $generalDialog;
		},
		alert: function(message, callback, title, okTitle) {
			if(commDialog.lockAlert) {
				return false;
			}
//			commDialog.lockAlert = true;
			if(title == null) {
				title = "Information";
			}
			var data = {message: message, messageTitle: title};
			if(okTitle != null) { data.okTitle = okTitle; }
			var html = $.templates("#"+commDialog.alertTemplateId).render(data);
			
			//commDialog.wrapperAlert.html(html);
			var $commDialog = commDialog.wrapperAlert.html(html);
			//$commDialog.fadeIn();
			$commDialog.show();
			//commDialog.wrapperAlert.show();

			// Enter, ESC키 입력시 창 닫음
			/*$(document).off("keydown").on("keydown", function(e) {
				if(e.keyCode === 27 || e.keyCode === 13) {
					commDialog.wrapperConfirm.find(".ico_close").click();
					e.preventDefault();
				}
			});*/
			
			$commDialog.find(".ico_close").on("click", function() {
				//commDialog.wrapperAlert.fadeOut();
				$commDialog.css("opacity", "hide");
				$commDialog.hide();
			});
			
			$commDialog.find(".btnOk").one("click", function() {
				//$commDialog.fadeOut();
				$commDialog.hide();
				if(typeof callback === 'function') {
					callback();
				}
			});
		},
		confirm: function(message, okCallback, cancelCallback, title, okTitle, cancelTitle) {
			if(commDialog.lockConfirm) {
				return false;
			}
			if(title == null) {
				title = "확인";
			}
//			commDialog.lockConfirm = true;
			var data = {message: message, messageTitle: title};
			if(okTitle != null) { data.okTitle = okTitle; }
			if(cancelTitle != null) { data.cancelTitle = cancelTitle; }
			var html = $.templates("#"+commDialog.confirmTemplateId).render(data);
			
			commDialog.wrapperConfirm.html(html);
			commDialog.wrapperConfirm.show();
			
			// Enter, ESC키 입력시 창 닫음
			/*$(document).off("keydown").on("keydown", function(e) {
				if(e.keyCode === 27) {
					commDialog.wrapperConfirm.find("button.btnCancel").click();
					e.preventDefault();
				}
				if(e.keyCode === 13) {
					commDialog.wrapperConfirm.find("button.btnOk").click();
					e.preventDefault();
				}
			});*/
			
			commDialog.wrapperConfirm.find(".ico_close").on("click", function() {
				$(document).off("keydown");
				commDialog.wrapperConfirm.hide(); 
			});
			commDialog.wrapperConfirm.find("button.btnCancel").one("click", function() {
				commDialog.wrapperConfirm.hide(); 
				if(typeof cancelCallback === 'function') {
					cancelCallback();
				}
			});
			commDialog.wrapperConfirm.find("button.btnOk").one("click", function() {
				commDialog.wrapperConfirm.hide(); 
				if(typeof okCallback === 'function') {
					okCallback();
				}
			});
		},
		batch: function(message, okCallback, cancelCallback, title, okTitle, cancelTitle) {
			if(commDialog.lockBatch) {
				return false;
			}
//			commDialog.lockBatch = true;
			var data = {message: message, messageTitle: title};
			if(okTitle != null) { data.okTitle = okTitle; }
			if(cancelTitle != null) { data.cancelTitle = cancelTitle; }
			var html = $.templates("#"+commDialog.batchTemplateId).render(data);
			
			commDialog.wrapperBatch.html(html);
			commDialog.wrapperBatch.show();
			
			// Enter, ESC키 입력시 창 닫음
			/*$(document).off("keydown").on("keydown", function(e) {
				if(e.keyCode === 27) {
					commDialog.wrapperBatch.find("button.btnCancel").click();
					e.preventDefault();
				}
				if(e.keyCode === 13) {
					commDialog.wrapperBatch.find("button.btnOk").click();
					e.preventDefault();
				}
			});*/
			
			commDialog.wrapperBatch.find(".close").on("click", function() {
				$(document).off("keydown");
				commDialog.wrapperBatch.hide(); 
			});

			if(typeof cancelCallback === 'function') {
				commDialog.wrapperBatch.find("button.btnCancel").one("click", cancelCallback);
			}
			if(typeof okCallback === 'function') {
				commDialog.wrapperBatch.find("button.btnOk").one("click", okCallback);
			}
		},
		comment: function(message, okCallback, cancelCallback, title, okTitle, cancelTitle, labelList) {
			if(commDialog.lockComment) {
				return false;
			}
//			commDialog.lockComment = true;
			var data = {message: message, messageTitle: title};
			if(okTitle != null) { data.okTitle = okTitle; }
			if(cancelTitle != null) { data.cancelTitle = cancelTitle; }
			
			if(labelList != null) {
				data.labelList = labelList;
			} else {
				labelList = [
					{label:"", lbl_type:"text", name:"", lbl_ph:"" }
				];
				data.labelList = labelList;
			}
			var html = $.templates("#"+commDialog.commentTemplateId).render(data);

			commDialog.wrapperComment.html(html);
			commDialog.wrapperComment.show();
			
			// Enter, ESC키 입력시 창 닫음
			/*$(document).off("keydown").on("keydown", function(e) {
				if(e.keyCode === 27) {
					commDialog.wrapperComment.find("button.btnCancel").click();
					e.preventDefault();
				}
				if(e.keyCode === 13) {
					commDialog.wrapperComment.find("button.btnOk").click();
					e.preventDefault();
				}
			});*/
			
			commDialog.wrapperComment.find(".ico_close").on("click", function() {
				$(document).off("keydown");
				commDialog.wrapperComment.hide(); 
			});
			commDialog.wrapperComment.find("button.btnCancel").one("click", function() {
				commDialog.wrapperComment.hide(); 
				if(typeof cancelCallback === 'function') {
					cancelCallback();
				}
			});
			commDialog.wrapperComment.find("button.btnOk").one("click", function() {
				var data = commDialog.wrapperComment.find("form").formJson();
				commDialog.wrapperComment.hide();
				if(typeof okCallback === 'function') {
					okCallback(data);
				}
			});
		}
	};
	
	function alert(msg, callback, title, okTitle) {
		commDialog.alert(msg, callback, title, okTitle);
	}
	
	function confirm(msg, okCallback, cancelCallback, title, okTitle, cancelTitle) {
		commDialog.confirm(msg, okCallback, cancelCallback, title, okTitle, cancelTitle);
	}
	
	function batch(msg, okCallback, cancelCallback, title, okTitle, cancelTitle) {
		commDialog.batch(msg, okCallback, cancelCallback, title, okTitle, cancelTitle);
	}

	function comment(msg, okCallback, cancelCallback, title, okTitle, cancelTitle, labelList) {
		commDialog.comment(msg, okCallback, cancelCallback, title, okTitle, cancelTitle, labelList);
	}

	function generalPopup(htmlTemplate, data, addClassList) {
		return commDialog.general(htmlTemplate, data, addClassList);
	}
	
	function convertContextToWord(text) {
		if(text == null || text.length <= 0) {
			return;
		}
		// 테이블 형태인지
		
		// 일반 텍스트 형태인지
//		var wordsList = text.split(/\s+/gi);
		var wordsList = text.split("");
		var parsedWordsList = [];
		var totLength = 0;
		if(wordsList != null && wordsList.length > 0) {
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
		}
		return parsedWordsList;
	}
	
	function getTodayString() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
		  dd = '0' + dd;
		} 
		if (mm < 10) {
		  mm = '0' + mm;
		} 
		var today = yyyy+"-"+mm+"-"+dd;
		return today;
	}
	
	function setCookie(cookieName, value, exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var cookieValue = escape(value) + ((exdays==null) ? "": "; expires=" + exdate.toGMTString());
		document.cookie = cookieName + "=" + cookieValue;
	}
	
	function deleteCookie(cookieName) {
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate()-1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}
	
	function getCookie(cookieName) {
	    cookieName = cookieName + '=';
	    var cookieData = document.cookie;
	    var start = cookieData.indexOf(cookieName);
	    var cookieValue = '';
	    if(start != -1){
	        start += cookieName.length;
	        var end = cookieData.indexOf(';', start);
	        if(end == -1)end = cookieData.length;
	        cookieValue = cookieData.substring(start, end);
	    }
	    return unescape(cookieValue);
	}
	
	// 파일찾기 기능이 필요한 곳에 사용
	function findFile($this, settings) {
		var inputFileBox = $this;
		var $showDiv = settings.filelist;
		
		$this.on("change", function() {
			var fileInput = $(this);
			var array = Object.values(fileInput[0].files);

			var html = $.templates("#selectListTemplate").render(array);
			$showDiv.html(html);
		});
	}
	
	// 파일업로드 기능이 필요한 곳에서 사용
	function uploadFile($this, settings) {
		var fileList = $this;
		
		var formData = new FormData;
		var fileTotSize = 0;
		var fileTotCount = 0;
		
		if(settings.param != null) {
			for(var key in settings.param) {
				var value = settings.param[key];
				// if(Array.isArray(value)) {
				//
				// } else {
				// 	formData.append(key, value);
				// }
				// if (Array.isArray(value)) {			// 값의 형태가 Array 이면
				// 	value.forEach(val => {
				// 		console.log(`${key}`);
				// 		formData.append(`${key}[]`, val);	// 배열형태로 formData에 추가
				// 	});
				// } else {
				// 	formData.append(key, value);			// 일반 객체형태로 formData에 추가
				// }
			}
		}
		
		if(fileList[0].files == null) {
			$.alert("업로드 할 파일을 선택해 주세요.");
			return ;
		}
		var fileLength = fileList[0].files.length;
		for(var i=0; i<fileLength; i++) {
			var $file = fileList[0].files[i];
			
			fileTotSize += $file.size;
			// 확장자 체크
			var nameArray = $file.name.split(".");
			if(
				nameArray[nameArray.length-1] != null 
				&& nameArray[nameArray.length-1].toUpperCase() != "JPG"
				&& nameArray[nameArray.length-1].toUpperCase() != "PNG"
				&& nameArray[nameArray.length-1].toUpperCase() != "WAV"
				&& nameArray[nameArray.length-1].toUpperCase() != "MP3"
				&& nameArray[nameArray.length-1].toUpperCase() != "ZIP"
				&& nameArray[nameArray.length-1].toUpperCase() != "TXT"
				&& nameArray[nameArray.length-1].toUpperCase() != "JPEG"
			) {
				// 지원하는 파일이 아니면 스킵
				continue;
			} else {
				fileTotCount++;
				formData.append("file", fileList[0].files[i]);
			}
		}
		
		// 파일 사이즈 체크
		if(fileTotSize > 10000000) {	// 토탈 10MB
			if(settings.showBodyObj != null) {
				settings.showBodyObject.html("");
			}
			$.alert("1회에 업로드 가능한 용량은 모든 파일을 합쳐 10MB이하 입니다. 다시 확인해 주세요.");
			return;
		}
		
		// 선택한 파일을 보여준다
		if(settings.showBodyObj != null) {
		}
		
		// 서버에 파일 전송 및 저장
		$.ajax({
			type: 'POST',
			url : settings.uri,
			processData: false,
			contentType: false,
			data: formData,
			success: function(result){
				// callback 실행
				if(typeof settings.callback === 'function') {
					settings.callback(result);
				}
			},
			error: function(e){
			    alert("파일 업로드 중 오류가 발생하였습니다. 다시 시도해 주세요.");
			}
		});
	}
	
	return {
		init: init,
		loadJson: loadJson,
    	PagingHandler: PagingHandler,
		loadPage: loadPage,
		loadBlob: loadBlob,
		movePage: movePage,
		replacePage: replacePage,
		loadKakaoLoc: loadKakaoLoc,
		loadGPS: loadGPS,
		alert: alert,
		confirm: confirm,
		batch: batch,
		comment: comment,
		generalPopup: generalPopup,
		replaceMorpheme: replaceMorpheme,
		parseContext: convertContextToWord,
		getToday : getTodayString,
		setCookie : setCookie,
		getCookie : getCookie,
		deleteCookie : deleteCookie,
		uploadFile : uploadFile,
		findFile : findFile
	}
})();