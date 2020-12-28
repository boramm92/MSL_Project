

jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		$('.changePlan').on('click', function(){	
			$('#changePlan').fadeIn(300);
		    $('.plan_oklayer').hide();
		});	
		$('.changeMethod').on('click', function(){	
			$('.lyr_method').fadeIn(300);
		});	
		$('.receiptPop').on('click', function(){	
			$('.lyr_receipt').fadeIn(300);
		});
		$('.unsubscribe').on('click', function(){	
			$('.lyr_planconf').fadeIn(300);
//			$('.lyr_plan').fadeOut(300);
		});	
		$('.planchangeBtn').on('click', function(){	
			$('.lyr_plan').hide();
			$('.plan_oklayer').show();
		});	
		$('#terminateBtn').on('click', function(){	
			$('.plan_change').fadeIn(300);
		    $('.lyr_planconf').hide();
		});
		$('#completBtn').on('click', function(){	
			$('.plan_change').fadeOut(300);
			$('.before_change').hide();
			$('.after_change').fadeIn(300);
		});
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_plan_bg').on('click', function () {			
			$('#changePlan').fadeOut(300);
			$('.lyr_method').fadeOut(300);
			$('.lyr_receipt').fadeOut(300);
			$('.lyr_planconf').fadeOut(300);
			$('.plan_oklayer').fadeOut(300);
			$('.plan_change').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});
	
		
	});	
});

var nowTemp = new Date();
var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
 
var checkin = $('#startDate').datepicker({
  onRender: function(date) {
	return date.valueOf() < now.valueOf() ? 'disabled' : '';
  }
}).on('changeDate', function(ev) {
  if (ev.date.valueOf() > checkout.date.valueOf()) {
	var newDate = new Date(ev.date)
	newDate.setDate(newDate.getDate() + 1);
	checkout.setValue(newDate);
  }
  checkin.hide();
}).data('datepicker');
	