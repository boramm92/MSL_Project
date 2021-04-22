/* MINDsLab. NBR. 20210422 */

// header fixed, background change
const header = document.querySelector('#header');

function headerScrollFixed(){ 
    if (pageYOffset > 5){ 
        header.classList.add('fixed'); 
    }else{ 
        header.classList.remove('fixed'); 
    } 
} 
window.addEventListener('scroll', headerScrollFixed);
