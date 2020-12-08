var yapUI = (function() {
	/*********************
	 * Private variables
	 ********************/
	var isInit      = false;
	
	var layout = {
		util   : "lyap-util",
		gnb    : "lyap-gnb",
		main   : "lyap-main",
		lnb    : "lyap-lnb",
		content: "lyap-content",
		footer : "lyap-footer"
	};
	
	var defaultOptions = {
		datePicker: {
			format: "YYYY-MM-DD",
			pickTime: false,
			showToday: true,
			widgetParent: "#lyap-footer",
			defaultDate: new Date()
		},
		timePicker: {
			minuteStepping: 10,
			format: "HH:mm",
			pickDate: false,
			widgetParent: "#lyap-footer"
		},
		dateTimePicker: {
			minuteStepping: 10,
			format: "YYYY-MM-DD HH:mm",
			direction:"bottom",
			showToday: true,
			widgetParent: "#lyap-footer",
			defaultDate: new Date()
		},
		dataTable : {
			sDom: 'r<"table-responsive"t><"dt-panelfooter clearfix"p>',
			scrollX: true,
			searching: false,
	        processing: true,
	        serverSide: true,
	        order: [[ 0, "desc" ]],
			lengthChange: false,
			pageLength: 10,
			autoWidth: false,
			ajax : {error : function(jqXHR, textStatus, errorThrown){
						//로그인 여부 처리
    					if(yapFN.logoutHandler(jqXHR)){return;}
					}
				}
		},
		select2: {
			minimumResultsForSearch: Infinity
		},
		scrollTable: {
			setWidths: false,
			tableClass: "admin-form",
			maxHeight: 400
		}
	};
	
	var YAP_TAB_MAX     = 10;
	var yapMenuSelector = ".fyap-menu";
	var yapTabSelector  = ".fyap-tab";
	var $lyapTabNav     = $("#lyap-tab-nav");
	var $lyapTabContent = $("#lyap-tab-content");
	
	var parentDataKey   = "yap-tab-parent-id";

	/*********************
	 * Private functions
	 ********************/
	function init() {
		if(isInit) {
			console.log("Already Initialized! Skip the process.");
			return false;
		}
		
		// 레이어 별 초기화
		$.each(layout, function(key, value) {
			initLayout(value);
		});
		
		// 공통 초기화
		commIndicator.init();
		commDialog.init();
		commCheckbox.init();
		commAllControl.init();
		
		//메뉴 Tab이벤트
		/*
		 * .show.bs.tab : 클릭한 탭이 보이기 전에 실행합니다.
			.shown.bs.tab : 클릭한 탭이 보인 후에 실행됩니다. 위와 시간적으로 거의 차이가 없습니다.
			.hide.bs.tab : 이전의 탭이 감춰지기 전에 실행됩니다.
			.hidden.bs.tab : 이전의 탭이 감춰진 후에 실행됩니다.
		 */
		
		
		$(document).on("show.bs.tab","#lyap-tab-nav a", function(e) {
			
			var id = $(e.target).parents('li').first().data('menuId');
			
			console.log('id>>>',id);
			
			var $depth3Obj = $('li[yap-tab-id='+id+']');
			if($depth3Obj){
				var topMenuId = $depth3Obj.attr('top-menu-id');
				$('li[sub-menu-id='+topMenuId+']').click();
				
				$('li.fyap-tab').removeClass('active');
				$depth3Obj.addClass('active');
				$depth3Obj.focus();
				$depth3Obj.blur();
				
			}
			
			//console.log("target",id);   // newly activated tab
			//console.log("relatedTarget",e.relatedTarget);  // previous active tab
		});
			 
		if($('ul.fyap-top-menu').size()>0){
			// 메인 상단 탭 초기화
			initMainCtrl();
			isInit = true;
		}
			
		
	}
	
	function initLayout(targetId) {
		commTrans.init(targetId);
		commCollapse.init(targetId);
		commImageUpload.init(targetId);
	}
	
	function initContent(targetId) {
		if(!targetId) {
			alert("wrapper id is missing![initContent]");
			return false;
		}
		initLayout(targetId);
		console.log(targetId + " is initialized!");
		return $("#" + targetId);
	}
	
	/**==============================================*/
	/** Main Tab Action */
	/**==============================================*/
	function initMainCtrl() {
		$(document).on("click", yapTabSelector, mainTabAction);
		$(document).on("click", "#lyap-tab-nav a i", removeTab);

		$(yapMenuSelector).on("click", mainMenuAction);
		
		// 기본 메뉴 설정
		/*
		$(yapMenuSelector).filter("[yap-menu-default=Y]").click();
		$(yapTabSelector).filter("[yap-tab-default=Y]").click();
		*/
		
		
		//메인탬 생성.
		var tabParams = {
			tabId: 'mainTab',
			tabTitle: M_MAIN_TAB_NAME,
			isDefault: 'Y',
			reqUri: M_DASH_PAGE
		};
		addTab(tabParams);
		
		$('li.fyap-menu').first().click();
		
	}
	
	function mainMenuAction() {
		changeMenu(this);
	}
	
	function changeMenu(obj){
		var $this = $(obj);
		var subId = $this.attr("sub-menu-id");
		$this.siblings().removeClass("active").end().addClass("active");
		$("#" + subId).siblings("ul").addClass("hide").end().removeClass("hide");
	}
	
	function checkTabCount() {
		return $lyapTabNav.find(">li").length >= YAP_TAB_MAX;
	}
	
	function mainTabAction() {
		var $this = $(this);
		var tabId = $this.attr("yap-tab-id");
		if(!tabId) {
			alert("필수속성 누락 : yap-tab-id");
			return false;
		}
		
		var yapMenuId = $this.attr("yap-menu-id");
		var menuId = tabId;
		if(yapMenuId!=null){
			menuId = yapMenuId;
		}
		
		
		var reqUrl = $this.attr("yap-req-url");
		if(!reqUrl) {
			yapUI.alert("url not match");
			return false;
		}
		
		var tabParams = {
			tabId: tabId,
			tabTitle: $this.attr("yap-tab-title"),
			isDefault: $this.attr("yap-tab-default"),
			menuId: menuId,
			isMenu : 'Y',
			parentId: $this.attr(parentDataKey),
			reqUri: reqUrl,
			reqParam: $this.attr("yap-req-param")
		};
		addTab(tabParams);
	}
	
	function addTab(paramMap) {
		var tabId = paramMap.tabId;
		var $tabContent = $("#" + tabId);
		// 존재여부 확인
		
//		console.log("tabId ==> ",tabId);
		
		if($tabContent.length) {
			// 해당화면으로 탭전환
			console.log("already Exist");
			
			var $nextTab = $lyapTabNav.find(">li[yap-tab-content-id=" + tabId + "]");
			var isMenu = $nextTab.data("isMenu");
			if(isMenu=='N'){
				yapUI.confirm(M_CLOSE_TAB,function(){
					closeTab($nextTab);
					if(paramMap.menuId==null && $lyapTabNav.find(">li.active")){
						paramMap.menuId = $lyapTabNav.find(">li.active").data('menuId');
						paramMap.isMenu = 'N';
						console.log('paramMap.menuId',paramMap.menuId)
					}
					createTab(paramMap);
				}
				,function(){
					$lyapTabNav.find(">li[yap-tab-content-id=" + tabId + "] a").tab("show");
				});
				
			}else{
				$lyapTabNav.find(">li[yap-tab-content-id=" + tabId + "] a").tab("show");
			}
		}
		else {
			if(paramMap.menuId==null && $lyapTabNav.find(">li.active")){
				paramMap.menuId = $lyapTabNav.find(">li.active").data('menuId');
				paramMap.isMenu = 'N';
				console.log('paramMap.menuId',paramMap.menuId)
			}
			
			createTab(paramMap);
		}
	}
	
	function createTab(paramMap) {
		// 탭 수량 확인
		if(checkTabCount()) {
			yapUI.alert("Too many tabs");
			return false;
		}
		
		// 기본값을 false, 생략가능
		var isDefault = paramMap.isDefault === "Y";
		
		// 탭 선택 해제
		$lyapTabNav.find(">li").removeClass("active");
		$lyapTabContent.find(">div.tab-pane").removeClass("in active");
		
		if(!paramMap.tabTitle) {
			paramMap.tabTitle = paramMap.tabId;
		}
		
		var tabInfo = { id: paramMap.tabId, targetId: "#" + paramMap.tabId, title: paramMap.tabTitle, init: true, isDefault: paramMap.isDefault };
		
		var tabNav  = $.templates("#lyap-tab-nav-template").render(tabInfo);
		var $tabNav = $(tabNav).appendTo($lyapTabNav);
		$tabNav.data("yap-tab-content-id", paramMap.tabId);
		$tabNav.data(parentDataKey, paramMap.parentId);
		$tabNav.data("yap-tab-uri", paramMap.reqUri);
		$tabNav.data("menuId", paramMap.menuId);
		$tabNav.data("isMenu", paramMap.isMenu);
		
		var tabContent  = $.templates("#lyap-tab-content-template").render(tabInfo);
		var $tabContent = $(tabContent).appendTo($lyapTabContent);
		
		var loadURL   = paramMap.reqUri;
		var loadParam = paramMap.reqParam;
		yapFN.loadPage($tabContent, loadURL, loadParam);
	}

	function removeTab(e) {
		e.preventDefault();
		e.stopPropagation();
		var $tabNav = $(this).parents("li");
		yapUI.confirm("Remove this?", function() {
			closeTab($tabNav);
		});
	}

	function closeCurrentTab() {
		closeTab($lyapTabNav.find(">li.active"));
	}
	
	// 화면에서 직접 호출할 수 있도록 준비
	function closeTab($tabNav) {
		if(typeof $tabNav === "string") {
			$tabNav = $lyapTabNav.find(">li[yap-tab-content-id=" + $tabNav + "]");
		}
		var $selectOther = null;
		if($tabNav.hasClass("active")) {
			$selectOther = $tabNav.prev();
			// 부모 탭이 존재하는 경우, 해당 탭으로 이동
			var parentId = $tabNav.data(parentDataKey);
			if(parentId) {
				var $checkParent = $lyapTabNav.find(">li[yap-tab-content-id=" + parentId + "]");
				if($checkParent.length) {
					$selectOther = $checkParent;
				}
			}
		}
		var targetId = $tabNav.data("yap-tab-content-id");
		
		// 엘리먼트 제거
		$tabNav.remove();
		$lyapTabContent.find(">#" + targetId).remove();
		
		/**
		 * 삭제 대상이 활성상태 였으면, 앞으로 당겨진 탭을 보여준다.
		 * 당겨지는 탭이 없을 경우, 바로 앞 탭을 보여준다.
		 */
		if($selectOther) {
			$selectOther.find("a").tab("show");
		}
		$('html,body').animate({ scrollTop : 0 }, 100); // 이동
	}
	
	function refreshTab(paramMap, loadURI) {
		var $activeTab   = $lyapTabNav.find(">li.active");
		// 활성화된 탭이 없을 경우에는 아무것도 하지 않음
		if($activeTab.length == 0) {
			return false;
		}
		var tabContentId = $activeTab.data("yap-tab-content-id");
		var tabURI       = $activeTab.data("yap-tab-uri");
		var $tabContent  = $("#" + tabContentId);
		if(loadURI) {
			tabURI = loadURI;
		}
		yapFN.loadPage($tabContent, tabURI, paramMap);
	}
	
	/**==============================================*/
	
	/*********************
	 * Private Module
	 ********************/
	/** 인디케이터 */
	var commIndicator = {
		wrapperId: "yap-indicator-wrapper",
		wrapper: null, 
		init: function() {
			var indicatorWrapperId = commIndicator.wrapperId;
			commIndicator.wrapper = $('<div class="modal" id="' + indicatorWrapperId + '" role="dialog"></div>');
			commIndicator.wrapper.appendTo("body");
		},
		show: function(targetSelector) {
			if(targetSelector) {
				var $target = $(targetSelector);
				var pos = $target.position();
				var $copy = $target.clone(false);
				$copy.css({top:pos.top, left:pos.left, position:"absolute", width:"100%", height:"100%"});
				$copy.removeAttr("id").removeAttr("class").html("<div style='width:100%; height:100%; opacity:0.2; filter:alpha(opacity=20); background-color:#bfbebe;'></div>").spin("flower", "red");
				$target.after($copy);
				$target.data("copy", $copy);
			}
			else {
				commIndicator.wrapper.modal({keyboard: false, backdrop:false});
				commIndicator.wrapper.spin("large", "#1680D1");	
			}
		},
		hide: function(targetSelector) {
			if(targetSelector) {
				var $target = $(targetSelector);
				var $copy = $target.data("copy");
				$copy.remove();
				$target.spin(false);
			}
			else {
				commIndicator.wrapper.modal("hide");
				commIndicator.wrapper.spin(false);
			}
		}
	};
	/**========================================================*/
	
	/** 다디얼로그 */
	var commDialog = {
		alertTemplateId: "alertTemplate",
		confirmTemplateId: "confirmTemplate",
		batchTemplateId: "batchTemplate",
		alertWrapperId: "yap-alert-wrapper",
		confirmWrapperId: "yap-confirm-wrapper",
		batchWrapperId: "yap-batch-wrapper",
		wrapperAlert: null,
		wrapperConfirm: null,
		wrapperBatch: null,
		lockAlert: false,
		lockConfirm: false,
		lockBatch: false,
		init: function() {
			commDialog.wrapperAlert = $('<div class="modal" id="' + commDialog.alertWrapperId + '" role="dialog" style="z-index:1060"></div>');
			commDialog.wrapperAlert.appendTo("body");
			commDialog.wrapperAlert.on('hidden.bs.modal', function() {
				commDialog.lockAlert = false;
			});
			
			commDialog.wrapperConfirm = $('<div class="modal" id="' + commDialog.confirmWrapperId + '" role="dialog" style="z-index:1060"></div>');
			commDialog.wrapperConfirm.appendTo("body");
			commDialog.wrapperConfirm.on('hidden.bs.modal', function() {
				commDialog.lockConfirm = false;
			});
			
			commDialog.wrapperBatch = $('<div class="modal" id="' + commDialog.batchWrapperId + '" role="dialog" style="z-index:1060"></div>');
			commDialog.wrapperBatch.appendTo("body");
			commDialog.wrapperBatch.on('hidden.bs.modal', function() {
				commDialog.lockBatch = false;
			});
		},
		alert: function(message, callback, title) {
			console.log("commDialog.alert");
			if(commDialog.lockAlert) {
				return false;
			}
			commDialog.lockAlert = true;
			var data = {message: message, messageTitle: title};
			var html = $.templates("#" + commDialog.alertTemplateId).render(data);
			
			commDialog.wrapperAlert.html(html);
			commDialog.wrapperAlert.modal({keyboard: false, backdrop:"static"});
			
			//Enter , ESC 입력시 창을 닫는다.
			$(document).off("keydown").on("keydown",function(e){
				console.log('alert keyevent');
			    if(e.keyCode === 13 || e.keyCode === 27){
			        e.preventDefault();
			        commDialog.wrapperAlert.find("button.yap-alert-ok").click();
			    }
			});
			
			//Enter , ESC 입력시 창을 닫는 이벤트를 릴리즈 한다.
			commDialog.wrapperAlert.find("button.yap-alert-ok").off('click').on('click',function(){
				$(document).off("keydown");
			});
			
			if(typeof callback === "function") {
				commDialog.wrapperAlert.find("button.yap-alert-ok").one("click",callback);
			}
		},
		confirm: function(message, callback, cancelCallback) {
			console.log("commDialog.confirm");
			if(commDialog.lockConfirm) {
				return false;
			}
			commDialog.lockConfirm = true;
			
//			var data = {message: message, messageTitle: title};
			var data = {message: message};
			var html = $.templates("#" + commDialog.confirmTemplateId).render(data);
			
			commDialog.wrapperConfirm.html(html);
			commDialog.wrapperConfirm.modal({keyboard: false, backdrop:"static"});
			
			//Enter , ESC 입력시 창을 닫는다.
			$(document).off("keydown").on("keydown",function(e){
				console.log('alert keyevent');
			    if(e.keyCode === 13){
			        //e.preventDefault();
			        commDialog.wrapperConfirm.find("button.yap-confirm-ok").click();
			    }
			    if(e.keyCode === 27){
			    	//e.preventDefault();
			    	commDialog.wrapperConfirm.find("button.yap-confirm-cancel").click();
			    }
			});
			
			//Enter , ESC 입력시 창을 닫는 이벤트를 릴리즈 한다.
			commDialog.wrapperConfirm.find("button.yap-confirm-ok,button.yap-confirm-cancel").off('click').on('click',function(){
				$(document).off("keydown");
			});
			
			if(typeof callback === "function") {
				commDialog.wrapperConfirm.find("button.yap-confirm-ok").one("click",callback);
			}
			if(cancelCallback!=null && typeof cancelCallback === "function") {
				commDialog.wrapperConfirm.find("button.yap-confirm-cancel").one("click", cancelCallback);
			}
		},
		batch: function(batchReqMap) {
			console.log("commDialog.batch");
			if(commDialog.lockBatch) {
				return false;
			}
			commDialog.lockBatch = true;
			var data = {batchTitle: batchReqMap.title, batchBody: batchReqMap.body, batchListData: batchReqMap.listData};
			var html = $.templates("#" + commDialog.batchTemplateId).render(data);
			
			commDialog.wrapperBatch.html(html);
			commDialog.wrapperBatch.modal({keyboard: false, backdrop:"static"});
			
			if(typeof batchReqMap.callback === "function") {
				commDialog.wrapperBatch.find("button.yap-batch-save").one("click", function() {
					var actionCode = commDialog.wrapperBatch.find("input[name=batchAction]:checked").val();
					batchReqMap.callback(batchReqMap.uri, actionCode);
				});
			}
		}
	};
	/**========================================================*/
	
	/** 화면전환 */
	var commTrans = {
		isBind: false,
		selector: {
			modal : " .fyap-modal",
			window: " .fyap-window",
			load  : " .fyap-load",
			move  : " .fyap-move"
		},
		savedWrapperIds: [],
		init: function(targetId) {
			var transSelector = commTrans.selector;
			var wrapperIds = [];
			// modal 대상 초기화
			$.each($("#" + targetId + transSelector.modal), function(i, item) {
				var $item     = $(item);
				var wrapperId = $item.attr("yap-modal-wrapper");
				var savedWrapperId = commTrans.savedWrapperIds[wrapperId];
				if(!savedWrapperId) {
					wrapperIds.push(wrapperId);
					commTrans.savedWrapperIds[wrapperId] = true;
				}
			});
			console.log(targetId + " > [" + wrapperIds + "]");
			if(wrapperIds.length > 0) {
				commTrans.renderModalWrappers(wrapperIds);			
			}
			
			// live event 이므로 최초 한번만 수행
			if(!commTrans.isBind) {
				commTrans.bindEventHandler();
				commTrans.isBind = true;
			}
		},
		bindEventHandler: function() {
			var transSelector = commTrans.selector;
			$(document).on("click", transSelector.modal, commTrans.showModalHelper);
			$(document).on("click", transSelector.window, commTrans.openWindow);
			$(document).on("click", transSelector.load, commTrans.loadPage);
			$(document).on("click", transSelector.move, commTrans.movePage);
		},
		renderModalWrappers: function(wrapperIds) {
			$.each(wrapperIds, function(i, wrapperId) {
				commTrans.renderModalWrapper(wrapperId);
			});
		},
		renderModalWrapper: function(wrapperId) {
			var $wrapper = $('<div class="modal" id="' + wrapperId + '" role="dialog"></div>');
			$wrapper.appendTo("body");
			$wrapper.on('show.bs.modal', commTrans.showModalHandler).on('hidden.bs.modal', commTrans.hideModalHandler);
		},
		showModalHandler: function() {
			console.log("showModalHandler");
		},
		hideModalHandler: function() {
			console.log("hideModalHandler");
			$(this).empty();
		},
		showModalHelper: function() {
			console.log("yap-modal click >> showModalHelper");
			var $this = $(this);
			var wrapperId = $this.attr("yap-modal-wrapper");
			var loadURL   = $this.attr("yap-req-url");
			var loadParam = $this.attr("yap-req-param");
			commTrans.showModal(wrapperId, loadURL, loadParam);
		},
		renderModalWrapperSingle: function(wrapperId) {
			// wrapper 직접 생성 시 호출
			// 존재여부 다시 확인
			if($("#" + wrapperId).length > 0) {
				return false;
			}
			// 존재하지 않을 경우에만 생성
			commTrans.renderModalWrapper(wrapperId);
			commTrans.savedWrapperIds[wrapperId] = true;
		},
		showModal: function(wrapperId, loadURL, loadParam) {
			// wrapper 확인
			commTrans.renderModalWrapperSingle(wrapperId);
			// 화면 가져오기
			yapFN.loadPage("#" + wrapperId, loadURL, loadParam, function() {
				// 모달 보여주기
				var $wrapper  = $("#" + wrapperId);
				$wrapper.modal({keyboard: false, backdrop:"static"});					
			}, true);
		},
		openWindow: function() {
			console.log("yap-window click >> openWindow");
			var $this = $(this);
			var loadURL   = $this.attr("yap-req-url");
			var loadParam = $this.attr("yap-req-param");
			window.open(loadURL + "?" + loadParam);
		},
		loadPage: function() {
			console.log("yap-load click >> loadPage");
			var $this = $(this);
			var wrapperId = $this.attr("yap-wrapper");
			var loadURL   = $this.attr("yap-req-url");
			var loadParam = $this.attr("yap-req-param");
			yapFN.loadPage("#" + wrapperId, loadURL, loadParam);
		},
		movePage: function() {
			console.log("yap-move click >> movePage");
			var $this = $(this);
			var loadURL   = $this.attr("yap-req-url");
			var loadParam = $this.attr("yap-req-param");
			location.href = loadURL + "?" + loadParam;
		}
	};
	/**========================================================*/
	/** FileUpload Init */
	var commImageUpload = {
		init : function(targetId){
			var $mP = $('#' + targetId);
		    this.bindClick($mP);
		    $( ".sortable",$mP).sortable({
		    	containment: "parent",
		    	helper: function(event, ui) {
		    		var $clone =  $(ui).clone();
		    		$clone .css('position','absolute');
		    		return $clone.get(0);
		    	}
		    });
		    $( ".sortable",$mP).disableSelection();
		}
		,bindClick : function($mP){
			// give file-upload preview onclick functionality
		    var fileUpload = $('.fileupload-preview',$mP);
		    if (fileUpload.length) {
		    	fileUpload.each(function(i, e) {
		    		var $_this = $(e);
		    		var $_parent = $_this.parents('.fileupload');
	    			var fileForm = $_parent.find('.btn-file > input');
    				$(e).off('click').on('click', function() {
						fileForm.click();
    				});
    				//이미지 PlaceHolder 처리
    				try{
    					if($_this.find('img').size()>0){
    						Holder.run({
    							images: $_this.find('img').get(0)
    						});
    					}
    					//이미지 제거 처리.
    					var $btnClear = $_parent.find('button.btn-clear-image');
    					if($btnClear.length>0){
    						$btnClear.off('click').on('click', function() {
								yapUI.confirm(CFR_DELETE_IMG, function() {
									// 이미지 미리보기 삭제
									$_this.find('img').remove();
									// 키 값 초기화
									$_parent.find("input[name=IMG_PK]").val("");
									// 버튼 초기화
									$_parent.addClass("fileupload-new").removeClass("fileupload-exists");
								});
    						});
    					}
    				}catch(Exception){console.info('Exception',Exception)}
		    	});
		    }
		}
	}

	
	var customChain = {
		mSelector: ".fyap-ui-sel-custom",
		init : function($parent,templateId,loadJson,callBack){
			var mChainGroup = {};
			
			var $yapWrapper = $parent.find(customChain.mSelector);
			$.each($yapWrapper, function(i, item) {
				var $item = $(item);
				var chain = $item.attr("chain");
				var childId = $item.attr("childId");
				if(!mChainGroup.hasOwnProperty(chain)){
					mChainGroup[chain] = new Array();
					mChainGroup[chain].push($item);
				}else{
					mChainGroup[chain].push($item)
				}
				
				if(childId!=null){
					
					$item.on("change", function(){
						
						var childs = childId.split(",");
						for(idx=0;idx<childs.length;idx++){
							var innerChild = childs[idx];
							
							var $child = $("#" + innerChild,$parent);
							var innerChain = $item.attr("chain");
							var match = false;
							$.each(mChainGroup[innerChain],function(){
								if(this==$item){
									match = true;
								}
								if(this!=$item && match){
									this.html('');
									try{
										this.val('');
									}catch(Exception){}
								}
							});
							
							
							var loadJsonRst = loadJson($(this),$child);
							if(loadJsonRst.uri==null){
								continue;
							}
							
							customChain.loadJson($child,loadJsonRst,templateId,callBack);
							
						}
						
						
						
						
					});
				}
			});
			$.map(mChainGroup,function(v,k){
				v[0].change();
			});
			
		},
		loadJson : function($child,loadJsonRst,templateId,callBack){
			yapFN.loadJson(loadJsonRst.uri, loadJsonRst.param, function(result) {
				if(!result.success){
					return;
				}
				var innerChild = $child.prop("id");
				result['childId'] = innerChild;
				var html = $.templates("#" + templateId).render(result);
				$child.html(html);
				
				
				var initCode = $child.attr("selval");
				if(initCode!=null){
					if($child.is('select')){
						$child.val(initCode);
						$child.removeAttr("selval");
					}else{
						var splitVal = initCode.split("|");
						for(idx=0;idx<splitVal.length;idx++){
							var tmpVal = splitVal[idx];
							$('input[value="'+tmpVal+'"]',$child).prop('checked',true);
						}
					}
				}
				
				if($.isFunction(callBack)){
					callBack($child,result)
				}
				
				var nextChildId = $child.attr("childId");
				if(innerChild!=null){
					$child.change()
				}
			}, true);
		}
		
	}
	
	/** 선택 체인 */
	var commChainSelect = {
		mActionURI: "/test/list.json",
		mTemplateId: "selectTemplate",
		selector: "select.fyap-ui-sel",
		
		
		init: function(targetId, actionURI, templateId) {
			if(!actionURI) {
				actionURI = "/test/list.json"; // 공통코드 URI
			}
			if(!templateId) {
				templateId = "selectTemplate"; // 공통 템플릿
			}
			commChainSelect.mActionURI  = actionURI;
			commChainSelect.mTemplateId = templateId;
			// 초기화
			var commSelector = commChainSelect.selector;
			var $yapWrapper = $("#" + targetId).find(commSelector);
			$.each($yapWrapper, function(i, item) {
				var $item = $(item);
				var initCode = $item.attr("selval");
				$item.val(initCode);
			});
			
			commChainSelect.bindEventHandler();
		},
		bindEventHandler: function() {
			var commSelector = commChainSelect.selector;
			$(commSelector).on("change", commChainSelect.changeEventHandler);
		},
		loadGroupDetail: function(codeGroup, codeDetail, callback) {
			if(codeDetail) {
				yapFN.loadJson(commChainSelect.mActionURI, {codeGroup: codeGroup, codeDetail: codeDetail}, function(result) {
					result.isEmpty = false;
					callback(result);
				}, true);
			}
			else {
				var result = {isEmpty: true};
				callback(result);
			}
		},
		renderSelect: function(elementId, codeGroup, codeDetail, renderAfter) {
			console.log("renderSelect [" + codeGroup + "][" + codeDetail + "]");
			commChainSelect.loadGroupDetail(codeGroup, codeDetail, function(result) {
				var html = $.templates("#" + commChainSelect.mTemplateId).render(result);
				$("#" + elementId).html(html);
				renderAfter();
			});	
		},
		changeEventHandler: function() {
			var $this    = $(this);
			var cdDtl    = $this.val();
			var cdGrp    = $this.attr("cdGrp");
			var childId  = $this.attr("childId");
			console.log("cdGrp = " + cdGrp + ", cdDtl = " + cdDtl + ", childId = " + childId);
			if(childId) {
				commChainSelect.renderSelect(childId, cdGrp, cdDtl, function() {
					$("#" + childId).change();
				});
			}
		}
	};
	/**========================================================*/
	
	/** select2 컨트롤 */
	var commSelect2 = {
		render: function(selector, $parent, options) {
			var select2Options = defaultOptions.select2;
			if(options) {
				select2Options = $.extend(true, {}, select2Options, options);
			}
			var $selector = $parent ? $(selector, $parent):$(selector);
			$selector.select2(select2Options);
			return $selector;
		}
	};
	/**========================================================*/
	
	/** 보이기/안보이기 컨트롤 */
	var commCollapse = {
		upClass: "glyphicon-chevron-up",
		downClass: "glyphicon-chevron-down",
		init: function(targetId) {
			var $wrapper = $("#" + targetId);
			$wrapper.find(".fyap-collapse").on("hide.bs.collapse", commCollapse.toggle).on("show.bs.collapse", commCollapse.toggle);
		},
		findIcon: function(element, e) {
			e.stopPropagation();
			var $this = $(element);
			var id = $this.prop("id");
			console.log(id);
			return $this.parent().find("[data-target='#" + id + "'] span[class*='glyphicon-chevron-']");
		},
		toggle: function(e) {
			console.log("collapse show");
			var $icon = commCollapse.findIcon(this, e);
			if($icon.hasClass(commCollapse.downClass)) {
				$icon.removeClass(commCollapse.downClass).addClass(commCollapse.upClass);
			}
			else {
				$icon.removeClass(commCollapse.upClass).addClass(commCollapse.downClass);
			}
			
		}
	}
	/**========================================================*/
	
	/** 보이기/안보이기 컨트롤 */
	var commDateTimePicker = {
		datePicker: function(selector, $parent, options) {
			commDateTimePicker.makePicker(selector, $parent, defaultOptions.datePicker, options);
		},
		timePicker: function(selector, $parent, options) {
			commDateTimePicker.makePicker(selector, $parent, defaultOptions.timePicker, options);
		},
		dateTimePicker: function(selector, $parent, options) {
			commDateTimePicker.makePicker(selector, $parent, defaultOptions.dateTimePicker, options);
		},
		makePicker: function(selector, $parent, defaultOpt, options) {
			var pickerOptions = defaultOpt;
			if(options) {
				pickerOptions = $.extend(true, {}, defaultOpt, options);
			}
			var $selector = $parent ? $(selector, $parent):$(selector);
			$selector.datetimepicker(pickerOptions);
		},
		bindDateBtnCtrl: function(btnDivId, viaStartId, viaEndId, $parent) {
			$("#" + btnDivId, $parent).find("button").on("click", function() {
				console.log("dateBtnCtrl");
				var $this      = $(this);
				var dataClass  = $this.prop("class").split(" ")[0];
				var dataArray  = dataClass.split("-");
				var term       = dataArray[1];
				var amount     = dataArray[2];
				
				var $dateStartPicker = $("#" + viaStartId, $parent).data("DateTimePicker");
				var $dateEndPicker = $("#" + viaEndId, $parent).data("DateTimePicker");
				
				if(amount === "all") {
					$dateStartPicker.disable();
					$dateEndPicker.disable();
				}
				else {
					$dateStartPicker.enable();
					$dateEndPicker.enable();
					var amountNum = parseInt(amount,10) * -1;
					var endDate = new Date();
					var startDate = moment(endDate).add(amountNum, term);
					$dateStartPicker.setDate(startDate);
					$dateEndPicker.setDate(endDate);
				}
				
				var btns = $this.parents("div:first").find('button');
				btns.removeClass("btn-default");
				btns.addClass("btn-base");

				$this.addClass("btn-default");
				$this.removeClass("btn-base");
			});
		}
	}
	/**========================================================*/
	
	/** 체크박스 기본 컨트롤 */
	var commCheckbox = {
		init: function() {
			$(document).on("click", "table thead th.fyap-check-all", commCheckbox.checkAll);
			$(document).on("click", "table tbody td.fyap-check", commCheckbox.checkItem);
		},
		checkAll: function(e) {
			console.log("click checkAll");
			var $checkbox = commCheckbox.checkCommon(e, this);
			var isChecked = $checkbox.is(":checked");
			var chkName   = $checkbox.prop("name");
			$checkbox.parents("table").find("tbody td.fyap-check input[name=" + chkName + "]").prop("checked", isChecked);
		},
		checkItem: function(e) {
			console.log("click checkItem");
			var $checkbox = commCheckbox.checkCommon(e, this);
			var chkName   = $checkbox.prop("name");
			var checkboxCount = $checkbox.parents("tbody").find("td.fyap-check input[name=" + chkName + "]").length;
			var checkedCount  = $checkbox.parents("tbody").find("td.fyap-check input[name=" + chkName + "]:checked").length;
			var $checkboxAll = $checkbox.parents("table").find("th.fyap-check-all input[name=" + chkName + "]");
			$checkboxAll.prop("checked", checkboxCount == checkedCount);
		},
		checkCommon: function(e, element) {
			e.preventDefault();
			e.stopPropagation();
			if(!$(e.target).is("input")) {
				$("input:checkbox", element).prop('checked', function (i, value) {
					return !value;
				});
			}
			return $(element).find("input[type=checkbox]");
		}
	}
	/**========================================================*/
	
	/** 전체와 상세 체크박스 기본 컨트롤 */
	var commAllControl = {
		targetClass: "fyap-all-control",
		init: function() {
			$(document).on("click", "div." + commAllControl.targetClass + " input:checkbox", commAllControl.checkHandler);
		},
		checkHandler: function() {
			console.log("checkHandler");
			var $this    = $(this);
			var chkName  = $this.prop("name");
			var $wrapper = $this.parents("div." + commAllControl.targetClass + ":first");
			if(!chkName) {
				var related = $this.attr("related");
				$("input[name=" + related + "]", $wrapper).prop("checked", $this.is(":checked"));
				// 전체가 선택될 경우, 조회조건 처리를 하지 않기 위한 값 설정
				$this.prev().val($this.is(":checked") ? "Y":"");
			}
			else {
				var $target = $wrapper.find("input[related=" + chkName + "]");
				var checkboxCount = $wrapper.find("input[name=" + chkName + "]").length;
				var checkedCount  = $wrapper.find("input[name=" + chkName + "]:checked").length;
				$target.prop("checked", checkboxCount == checkedCount);
				// 전체가 선택될 경우, 조회조건 처리를 하지 않기 위한 값 설정
				$target.prev().val(checkboxCount == checkedCount ? "Y":"");
			}
		}
	}
	/**========================================================*/
	
	/** DataTable 기본 컨트롤 */
	var commDataTable = {
		renderDt : function($selector,options){
			var dtOption = defaultOptions.dataTable;
			
			
			if(options) {
				dtOption = $.extend(true, {}, defaultOptions.dataTable, options);
			}
			var $dt = $selector.DataTable(dtOption);
//			list-group-item에 영향이 있음.
//			$("div.top").css({float:"left","padding-bottom":"5px"});
			return $dt;
		},
		//DataTable AJAX  parameter에 동적으로 데이타를 바인딩한다.
		paramDt : function(dataTable,json){
			$.each(json, function (key, data) {
				dataTable[key] = data; 
			});
		},
		getDataDt : function(obj,$dataTable){
			 var tr = $(obj).closest('tr');
			 var row = $dataTable.row( tr );
			 var data = row.data();
			 return data;
		},
		renderTotal : function(settings,$p){
			try{
	        	var tableId = settings.sTableId;
	        	var $_this = $('#'+tableId,$p).parents('div.panel');
	        	if($_this.size()==0){
	        		$_this = $('#'+tableId,$p).parents('div.modal-content');
	        	}
	        	commDataTable.renderTotalToWrapper(settings, $_this);
        	}catch(Exception){}
		},
		renderTotalToWrapper : function(settings, $wrapper){
			try{
	        	var $_total   = $wrapper.find('span.total');
	        	var $_showing = $wrapper.find('span.showing');
	        	
	        	var displayTotal = parseInt(settings._iRecordsTotal);
	        	var displayStart = parseInt(settings._iDisplayStart)+1;
	        	var displayEnd   = parseInt(settings._iDisplayLength)+parseInt(settings._iDisplayStart)
	        	
	        	$_total.html(settings._iRecordsTotal);
	        	if(displayEnd>displayTotal){
	        		displayEnd = displayTotal;
	        	}
	        	if(displayTotal>0){
	        		$_showing.html(displayStart +" ~ "+displayEnd);
	        	}else{
	        		$_showing.html("-");
	        	}
        	}catch(Exception){}
		},
		changeLen : function($dt,$select){
			// pageLength 초기값 설정
			$select.val($dt.page.len());
			$select.on('change',function(){
				$dt.page.len($(this).val());
				$dt.ajax.reload();
			});
		},
		renderIndex: function(meta) {
			var viaStart = meta.settings._iDisplayStart;
			return viaStart + meta.row + 1;
		},
		renderIndexDesc: function(meta) {
			var totRecord = meta.settings._iRecordsDisplay;
			var viaStart = meta.settings._iDisplayStart;
			return totRecord - viaStart - meta.row;
		}
	};
	/**========================================================*/
	
	/** Scroll Table */
	var commScrollTable = {
		render: function(selector, $parent, options) {
			var scrollTableOptions = defaultOptions.scrollTable;
			if(options) {
				scrollTableOptions = $.extend(true, {}, scrollTableOptions, options);
			}
			var $selector = $parent ? $(selector, $parent):$(selector);
			$selector.scrolltable(scrollTableOptions);
			return $selector;
		}
	};
	/**========================================================*/
	
	/** Error Handle */
	var error = {
		render: function(data,$_form) {
			if(data.failStack){
				var errorMsgStack = [];
				var isTarget = false;
				$.each(data.failStack,function(){
    				var stack = this;
    				var $_target = $('[name="'+stack.targetId+'"]',$_form).eq(stack.targetRow);
	    			if($_target.attr('type')=='checkbox' || $_target.attr('type')=='radio'){
	    				$_target.parents('div:eq(1)').after("<span class='help-block help-block--top mt5 text-info'>"+stack.error+"</span>");
	    			}else if($_target.attr('type')=='hidden'){
	    				errorMsgStack[errorMsgStack.length] = stack.error;
	    			}else{
		    			$_target.after("<span class='help-block help-block--top mt5 text-info'>"+stack.error+"</span>");
		    			if(!isTarget){
		    				$_target.focus();
		    				isTarget = true;
		    			}
	    			}
				});
				if(errorMsgStack.length>0){
					var msg = "";
					$.each(errorMsgStack,function(){
						msg += this+"<BR>";
					});
					yapUI.alert(msg);
				}
			}else if(data.targetId!=null){
    			var $_target = $('[name="'+data.targetId+'"]',$_form).eq(data.targetRow);
    			if($_target.attr('type')=='checkbox' || $_target.attr('type')=='radio'){
    				$_target.parents('div:eq(1)').after("<span class='help-block help-block--top mt5 text-info'>"+data.error+"</span>");
    			}else if($_target.attr('type')=='hidden'){
    				yapUI.alert(data.error);
    			}else{
	    			$_target.after("<span class='help-block help-block--top mt5 text-info'>"+data.error+"</span>");
    			}
    			
    			$_target.focus();
			}else{
				yapUI.alert(data.error);
			}
		}
		,removeError : function($p){
			$('span.help-block',$p).remove();
		}
		,alertError : function(data){
			if(data.failStack){
				var errorMsgStack = [];
				$.each(data.failStack,function(){
					var stack = this;
					errorMsgStack[errorMsgStack.length] = stack.error;
				});
				
				if(errorMsgStack.length>0){
					var msg = "";
					$.each(errorMsgStack,function(){
						msg += this+"<BR>";
					});
					yapUI.alert(msg);
				}
			}
		}
	};
	/**========================================================*/
	

	/** UI Base Control Handler */
	var baseControlHandler = {
		settingHandler: function () {
			console.log("settingHandler");
			var $this          = $(this);
			var targetClassName = $this.attr("target");
			var $panelHeading  = $this.parents("div.panel-heading:first");
			var $panel         = $this.parents("div.panel:first");
			$panelHeading.addClass("hide");
			$panel.find("div." + targetClassName).removeClass("hide");
		},
		checkShowHideHandler: function() {
			var $this      = $(this);
			var targetName = $this.attr("target");
			var $panelBody = $this.parents("div.panel-body:first");
			var $target    = $panelBody.find("div." + targetName);
			if($this.is(":checked")) {
				$target.removeClass("hide");
			}
			else {
				$target.addClass("hide");
			}
		}
	};
	/**========================================================*/
	
	/*********************
	 * Public API
	 ********************/
    return {
    	init: init,
    	initContent: initContent,
    	showIndicator: commIndicator.show,
    	hideIndicator: commIndicator.hide,
    	alert: commDialog.alert,
    	confirm: commDialog.confirm,
    	batch: commDialog.batch,
    	datePicker: commDateTimePicker.datePicker,
    	timePicker: commDateTimePicker.timePicker,
    	dateTimePicker: commDateTimePicker.dateTimePicker,
    	bindDateBtnCtrl: commDateTimePicker.bindDateBtnCtrl,
    	dt: commDataTable,
    	showModal: commTrans.showModal,
    	addTab: addTab,
    	closeTab:  closeTab,
    	closeCurrentTab: closeCurrentTab,
    	refreshTab:  refreshTab,
    	renderSelect: commSelect2.render,
    	createTab: createTab,
    	renderScrollTable: commScrollTable.render,
    	initImgUpload: commImageUpload.bindClick,
    	customChain: customChain.init,
    	showError: error.render,
    	removeError: error.removeError,
    	alertError: error.alertError,
    	chainSelectInit: commChainSelect.init,
    	settingHandler: baseControlHandler.settingHandler,
    	checkShowHideHandler: baseControlHandler.checkShowHideHandler
    };
})();

