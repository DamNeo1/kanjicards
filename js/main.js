CURRENT_KANJI_LIST = [];

$(document).ready(function(){

	var height = $(window).height();
	$("body").css("height",(height+80)+"px");

	//LOADING KANJI AFTER LEVEL CHOOSING
	$(".jlpt-choose-level").click(function(){

		if (! $(this).hasClass("not-available")) {

			loadKanjis($(this).attr("data-level"));
		}
  	});

	//LOADING KANJI'S CARD
  	$("#kanjis-list").on("click", ".kanji-mini", function(){

	    $("#kanjis-list").hide();
	    $("li").remove();
	    $("p").remove();
	    $("#kanji-card").show();
	    $(".jlpt-level-title").hide();
	    $("#back").hide();

	    window.scrollTo(0,0);

	    //Displaying data
	    var kanji_id = $(this).attr("data-kanji-id");
	    var kanji = CURRENT_KANJI_LIST[kanji_id].kanji;
	    $("#kanji-char").html(kanji);

	    var kuns = CURRENT_KANJI_LIST[kanji_id].KUN.split(",");
	    $(kuns).each(function(k,v){

	    	if (k<4){

	    		$(".kun-sentence").append("<li>"+v+"</li>");
	    	} 
	    });

	    var ons = CURRENT_KANJI_LIST[kanji_id].ON.split(",");
	    $(ons).each(function(k,v){

	    	if (k<4){

	    		$(".on-sentence").append("<li>"+v+"</li>");
	    	} 
	    });

	    var sign = CURRENT_KANJI_LIST[kanji_id].signification;
	    $("#definition").append("<p>"+sign+"</p>");
	});

  	//CLOSING CARD
	$("#close-card").click(function(){

		closingCard();
	});

	//GOING BACK TO MAIN MENU
	$("#back").click(function(){

		$("#back").hide();
		$(".jlpt-level-title").hide();
		$("#kanjis-list").hide();
		$("#main-menu").show();
		$("body").css("background","#aa90b5");

	});

	$(document).keyup(function(e) {
	  
	  if (e.keyCode === 27) {

	  	closingCard();
	  }
	});

});

function closingCard() {

	$("#kanji-card").hide();
	$(".jlpt-level-title").show();
	$("#kanjis-list").show();
	$("#back").show();
}


function loadKanjis(level) {

	$("#main-menu").hide();
	$("#kanjis-list").empty();
	$("#back").show();
	$(".jlpt-level-title").show();
	$("body").css("background","url('img/jlpt"+level+".png') repeat-x #aa90b5");

	$.getJSON("kanjis/jlpt"+level+".json",function(kanjis){
	  	

	  	$(".jlpt-level-title").empty().append("Kanjis - JLPT " + level + " (" + kanjis.length + ")");

		$(kanjis).each(function(key,val){

			$("#kanjis-list").append("<span class='kanji-mini' data-kanji-id='"+key+"'>"+val.kanji+"</span>");
		});

		CURRENT_KANJI_LIST = kanjis;
	});

	$("#kanjis-list").show();
}