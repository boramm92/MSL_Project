// MINDsLab. 2019-08.27
//twodepth	

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var sublist = this.nextElementSibling;
    if (sublist.style.maxHeight){
		sublist.style.maxHeight = null;
//		$('.dropdwn').removeClass('active');
    } else {
		sublist.style.maxHeight = sublist.scrollHeight + "px";
//		$('.dropdwn').removeClass('active');
	
    } 
  });
}
	
$(document).ready(function (){	
	
	$('.snb ul li.collapsible').each(function(){
		if($(this).hasClass('active')){
			$(this).trigger( "click" );
			$(this).addClass( "active" );
		}
	});	

	
	$('.ico_menu span').on('click',function(){	
		var ind = $(this).index();
		var menu = $(this).parent().parent().next().children();	
		var twodepth = jQuery(menu);
		
		
		if( twodepth.hasClass('active') ){				
			twodepth.removeClass('active');
			twodepth.eq(ind).addClass('active');
		} else {			
			twodepth.eq(ind).addClass('active');
		}


	
	});
			
});	