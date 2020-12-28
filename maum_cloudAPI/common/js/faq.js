
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
	
		$('.btn_search').on('click', function() {
			$('.qa_lst').fadeOut(300);
			
		});
	});	
});	

	
//notice 리스트	
var coll = document.getElementsByClassName("noticetit");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var noticetxt = this.nextElementSibling;
    if (noticetxt.style.maxHeight){
      noticetxt.style.maxHeight = null;
    } else {
      noticetxt.style.maxHeight = noticetxt.scrollHeight + "px";
    } 
  });
}
	
//fqa 리스트	
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}	
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();	
	
	