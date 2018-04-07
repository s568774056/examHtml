
$(document).ready(function(){
  $("#main-menu li a").click(function(){
   
	setIframe(this);
  });
});

function setIframe(obj){

	var name=$(obj).attr("name");
	if(name!=undefined){
       $("#body_iframe").attr("src",name+".html");
	}
}
