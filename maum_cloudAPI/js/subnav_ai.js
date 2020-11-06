//twodepth	
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var sublist = this.nextElementSibling;
    if (sublist.style.maxHeight){
      sublist.style.maxHeight = null;
	  	
    } else {
      sublist.style.maxHeight = sublist.scrollHeight + "px";
		$('.dropdwn').removeClass('.active');
    } 
  });
}

//threedepth	
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		$('.snb ul li.collapsible').each(function(){
			if($(this).hasClass('active')){
				$(this).trigger( "click" );
				$(this).removeClass('active');
			}
		});	
		
		$("#flip").click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');	
			}else{
				$(this).addClass('active');
			}
			
			$(".panel").slideToggle("fast");
			var sublist = this.parentNode;
			sublist.style.maxHeight =  sublist.scrollHeight + $(".twodepthLst").prop('scrollHeight')+ "px";	
			
		});		
	});	
});
