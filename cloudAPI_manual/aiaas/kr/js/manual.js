var collapsible = document.getElementsByClassName('collapsible');

for (var i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener('click', function(){
        var sublist = this.childNodes[3];
        console.log(sublist)

        this.classList.toggle("active");
        
        if (sublist.style.maxHeight) {
            sublist.style.maxHeight = null;
        } else {
            sublist.style.maxHeight = sublist.scrollHeight + 'px';
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
});	