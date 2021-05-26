// content ajax 
var linkBtn = document.getElementsByClassName('btn_link');

for(var i = 0; i < linkBtn.length; i++){
    linkBtn[i].onclick = function(e){    
        var thisBtn = e.target;
        var thisList = thisBtn.parentNode.parentNode;    
        var thisName =  thisBtn.getAttribute('name');
        var fileName = 'kr_cloudApiManual_' + thisName + '.html';
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementsByClassName('content')[0].innerHTML = this.responseText;
            }
        }

        xhttp.open('GET', fileName, true);
        xhttp.send();
    }
}

// snb 
var collapsible = document.getElementsByClassName('collapsible');

for(var i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener('click', function(){
        var sublist = this.childNodes[3];
        this.classList.toggle("active");       
        if(sublist.style.maxHeight){
            sublist.style.maxHeight = null;
        } else {
            sublist.style.maxHeight = sublist.scrollHeight + 'px';
        }
    });
}
	