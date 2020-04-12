CURRENT_KANJI_LIST = [];

$(document).ready(function(){

	init();

	//preparing all kind of events
	prepareMenuKanjisGroupClickEvent();
	prepareOpenCardClickEvent();
	prepareCloseCardClickEvent();
	prepareBackClickEvent();
	prepareShuffleClickEvent();
	prepareCloseAboutClickEvent();
	prepareAboutClickEvent();
	prepareEscapeKeyEvent();
	prepareKnowCheckButtonClikEvent();

});

function init() {

	//reset dynamically a bit of the height
	var height = $(window).height();
	$("body").css("height",(height+80)+"px");

	//check known kanjis cookie presence
	if (typeof $.cookie('known_kanjis') === "undefined") {

		$.cookie('known_kanjis','',{expires:1000});
	}
}

function prepareMenuKanjisGroupClickEvent() {

	//LOADING KANJI AFTER LEVEL CHOOSING
	$(".jlpt-choose-level").click(function(){

		if (! $(this).hasClass("not-available")) {

			loadKanjis($(this).attr("data-level"), $(this).attr("data-name-level"));
		}
  	});
}

function prepareOpenCardClickEvent() {

	//LOADING KANJI'S CARD
  	$("#kanjis-list").on("click", ".kanji-mini", function(){

  		openCard($(this).attr("data-kanji-id"));
	});
}
	
function prepareCloseCardClickEvent() {

	//CLOSING CARD
	$("#close-card").click(function(){

		closingCard();
	});

}

function prepareBackClickEvent() {

	//GOING BACK TO MAIN MENU
	$("#back").click(function(){

		$("#back").hide();
		$("#shuffle").hide();

		$(".jlpt-level-title").hide();
		$("#kanjis-list").hide();
		$("#main-menu").show();
		$("#footer").show();
		$("body").css("background","#aa90b5");

	});
}

function prepareShuffleClickEvent() {

	$("#shuffle").click(function(){

		shuffleKanjisList();
	});
}

function prepareCloseAboutClickEvent() {

	//CLOSING ABOUT
	$("#close-about").click(function(){

		$("#about").hide();
		window.scrollTo(0,0);
	});
}

function prepareAboutClickEvent() {

	//DISPLAY ABOUT
	$(".about-trigger").click(function(){

		$("#about").show();
	});	
}

function prepareEscapeKeyEvent() {

	$(document).keyup(function(e) {
	  
	  if (e.keyCode === 27) {

	  	closingCard();
	  }
	});
}

function prepareKnowCheckButtonClikEvent() {

	$("#check").click(function(){

		setKnownStatusKanji($(this).attr("data-kanji"), $(this).attr("class"));
	});
}

function setKnownStatusKanji(kanji, status) {

	(status == "check-empty") ? addKnownKanji(kanji) : removeKnownKanji(kanji);
}


function openCard(kanjiId) {

	$("#kanjis-list").hide();
    $("li").remove();
    $("p.signif").remove();
    $("#kanji-card").show();
    $(".jlpt-level-title").hide();
    $("#back").hide();
    $("#shuffle").hide();

    window.scrollTo(0,0);

    //Displaying data

    console.log(kanjiId);
    var kanji = CURRENT_KANJI_LIST[kanjiId].kanji;
    var group = CURRENT_KANJI_LIST[kanjiId].group;
    $("#kanji-char").html(kanji);

    var class_check = (kanjiIsKnown(kanji) ? $("#check").addClass('check-full') : $("#check").addClass('check-empty'));
    $("#check").attr("data-kanji",kanji);

    var kuns = CURRENT_KANJI_LIST[kanjiId].KUN.split(",");
    $(kuns).each(function(k,v){

    	if (k<4){

    		$(".kun-sentence").append("<li>"+v+"</li>");
    	} 
    });

    var ons = CURRENT_KANJI_LIST[kanjiId].ON.split(",");
    $(ons).each(function(k,v){

    	if (k<4){

    		$(".on-sentence").append("<li>"+v+"</li>");
    	} 
    });

    var sign = CURRENT_KANJI_LIST[kanjiId].signification;
    $("#definition").append("<p class='signif'>"+sign+"</p>");

	gtag('event', 'open', {
	  'event_category': 'kanjiCard',
	  'event_label': group + " - " + kanji
	});
}

function closingCard() {

	$("#kanji-card").hide();
	$(".jlpt-level-title").show();
	$("#kanjis-list").show();
	$("#back").show();
	$("#shuffle").show();

	var status = $("#check").attr("class");
	var kanji  = $("#check").attr("data-kanji");

	$("#check").removeClass();

	updateKanjiStatusInList(kanji, status);
}


function loadKanjis(level, nameLevel) {

	$("#footer").hide();
	$("#main-menu").hide();
	$("#kanjis-list").empty();
	$("#loading-container").show();
	$("#back").show();
	$("#shuffle").show();
	$(".jlpt-level-title").show();
	$("body").css("background-image","url('img/"+level+".png')");

	var known_kanjis = $.cookie("known_kanjis");

	$.getJSON("kanjis/"+level+".json",function(kanjis){
	  	

	  	$(".jlpt-level-title").empty().append(nameLevel + " (" + kanjis.length + ")");

		$(kanjis).each(function(key,val){

			var className = "kanji-mini";
			className += (known_kanjis.includes(val.kanji)) ? " is-known" : "";

			$("#kanjis-list").append("<span class='"+className+"' data-kanji-id='"+key+"' data-kanji='"+val.kanji+"'>"+val.kanji+"</span>");
		});

		$("#loading-container").hide();
		$("#kanjis-list").show();

		gtag('event', 'open', {
		  'event_category': 'kanjisList',
		  'event_label': nameLevel
		});

		CURRENT_KANJI_LIST = kanjis;
	});
}

function shuffleKanjisList(){

	CURRENT_KANJI_LIST = CURRENT_KANJI_LIST.sort(function() {

	    return Math.random() - .5
	});

	var new_content = "";
	var known_kanjis = $.cookie("known_kanjis");

	$(CURRENT_KANJI_LIST).each(function(key,val){

		//CHECKER QUE LA CARTE A SON STATUT CORRECTEMENT A JOUR DANS LA LISTE

		var className = "kanji-mini";
		className += (known_kanjis.includes(val.kanji)) ? " is-known" : "";

		new_content += "<span class='"+className+"' data-kanji-id='"+key+"' data-kanji='"+val.kanji+"'>"+val.kanji+"</span>"
	});

	$("#kanjis-list").empty().append(new_content);

	gtag('event', 'shuffle', {
	  'event_category': 'kanjisList',
	  'event_label': CURRENT_KANJI_LIST[0].group
	});
}

function addKnownKanji(kanji) {

	var str = $.cookie("known_kanjis");

	if (str != ""){
		str += ",";
	}

	str += kanji;
	$.cookie("known_kanjis", str, {expires:1000});

	$("#check").removeClass().addClass("check-full");

	gtag('event', 'addKnownKanji', {
	  'event_category': 'kanjiCard',
	  'event_label': kanji
	});
}

function removeKnownKanji(kanji){

	var tmp = $.cookie("known_kanjis").split(',');

	var index = tmp.indexOf(kanji);
	if (index > -1) {
	  tmp.splice(index, 1);
	}

	$.cookie("known_kanjis", tmp, {expires:1000});

	$("#check").removeClass().addClass("check-empty");
}

function kanjiIsKnown(kanji) {

	return $.cookie("known_kanjis").includes(kanji);
}

function updateKanjiStatusInList(kanji, status) {

	if (status == "check-empty") {

		$(".kanji-mini[data-kanji="+kanji+"]").removeClass("is-known");

	} else {

		$(".kanji-mini[data-kanji="+kanji+"]").addClass("is-known");
	}
}