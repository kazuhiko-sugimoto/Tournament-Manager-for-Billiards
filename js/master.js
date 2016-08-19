var sSkill = new Array("bg","C","B","A","SA","PRO");

var sCountry;
var isHall;
var nHall;
var sHall;
var nArea;
var sArea;
var nPlayer;
var sPlayer;
var sPassword;
var sLimit;
var sSyncDate;
var sCountryList = [];
var sCountryFullNameList = [];
var nIsFemale;

var nTouches;

var nRireki_cnt;
var nIning;
var nScore = [];

var sPage;    //移動先ページ名
var date_now = new Date();
var isOnline = false;
var isLockout = false;
var nLockout_cnt = 0;
var Lockout_time;
//players →
var nPlayers;	//プレイヤー人数
//var gameNm = new Array("8Ball","9Ball","10Ball","OnePocket","StraightPool","Fujiyama","JAPAN 9","Rotation","Bowlard","c.s.r.s", "Taiwan9");
// 0:8Ball 1:9Ball 2:10Ball 3:OnePocket 4:14-1 5:Fujiyama 6:JAPAN 7:Rotation 8:bowlard 9:c.s.r.s 10:BankPool →
var sGameNm = ["8Ball","9Ball","10Ball","OnePocket","StraightPool","SnookerPool","JAPAN 9","Rotation","Kairun","Bowlard","c.s.r.s", "StraightPool","APA 8Ball","APA 9Ball","Kairun"];   //update ver5.03
// 0:8Ball 1:9Ball 2:10Ball 3:OnePocket 4:14-1 5:Fujiyama 6:JAPAN 7:Rotation 8:taiwan9 9:bowlard 10:c.s.r.s
var sVersusNm = ["8Ball","9Ball","10Ball","OnePocket","StraightPool","SnookerPool","JAPAN 9","Rotation","Kairun","APA 8Ball","APA 9Ball"];  //update ver5.03

//game_type  →
var nGame;
//raceto →
var nRaceto = [0,0,0,0,0,0,0,0,0,0];	//update apa
var webRoot = "/";

var nLang = 1;	//0:english 1:japanese
var isTournament = false;
var nTabletCd;
var tabletTimeout;

var callBack;

var player = new Array(10);	//update apa

//drag&drop
var movingItems={};
var isMoving=false;
var imgOffsetX = 40;
var imgOffsetY = 40;
var mouseX;
var mouseY;

var timeout;
var timeout_page;

var isNoinit = false;

var nReadedCd;

//add 2014/09/13
var nGuest;
var oGuest = [];

var nTurn;	//add apa

var isShowFab;

var nOriginRaceto = [];

function getAnalize(){
	db.cgi({
	    action: "getAnalize"
	    ,callback: getAnalize_callback
	    ,data: {
	        player: 19
	    }
	});
}
function getAnalize_callback(d){
	alert(d.versus_rating);
	json = d; //JSON.parse(d);
}
//  *******************************************************
//  *** *** *** *** ***     class       *** *** *** *** ***
//  *******************************************************
var Player = function(cd){
	this.cd = cd;
	this.map = PLAYERS({CD:{'==':cd}}).first();
	if (cd==-1){
		this.name = M[124];
		this.class = null;
		this.rating = null;
		this.skill = "";
		//add apa
		this.sl8 = null;
		this.sl9 = null;

	} else {
		this.name = this.map.NAME;
		this.class = this.map.CLASS;
		this.skill = sSkill[this.map.CLASS];

		if (this.map.RATING){
			var num= parseInt(this.map.RATING)/100;
			var strI = " " + Math.floor(num);
			var strD = num + "00.00";
			this.rating = strI.substr(-1,1) + "." + strD.split(".")[1].substr(0,2);
			this.rating_num = this.map.RATING;
		} else {
			this.rating = W[127];
			switch (this.class){
				case 0:
					this.rating_num = 100;
					break;
				case 1:
					this.rating_num = 300;
					break;
				case 2:
					this.rating_num = 500;
					break;
				case 3:
					this.rating_num = 700;
					break;
				case 4:
					this.rating_num = 850;
					break;
				case 5:
					this.rating_num = 950;
					break;
			}

		}

		//add apa
        this.sl8 = getSL8fromRating(this.rating_num);
        this.sl9 = getSL9fromRating(this.rating_num);

	}
}
//  *******************************************************
//  *** *** *** *** ***     表示   		 *** *** *** *** ***
//  *******************************************************
//add   pop
function popup_show(param){
	var name = param.name || "";
	//var title = param.title || null;
	//var okFnc = param.okFnc || null;
	//var cancelFnc = param.cancelFnc || null;
	//var touchFnc = param.touchFnc || null;
	//var width = param.width || 25;
	//var height = param.height || null;
    //var left = param.left || null;
    //var top = param.top || null;
	var full = param.full || false;
	var full_w = param.full_w || false;
	var fix_footer = param.fix_footer ? "modal-fixed-footer" : "";
	var callback = param.callback || null;
	var autoClose;
	if (param.autoClose==undefined){
		autoClose = true;
	} else {
		autoClose = param.autoClose;
	}
    playSound("pop");
    $('.fixed-action-btn').hide();
	$.ajax({
		url: "./popup/" + name + ".html",
		//async: false,
		success:function(d){

			var id="pop_"+name;
			var html = '<div id="%id" class="modal %footer">';
		    html+='%content'
		  	html+='</div>';
		  	html=template(html,{
		  		"%id" : id
		  		,"%content": d
		  		,"%footer": fix_footer
		  	})
		  	$('body').append(html);

		  	$('#' + id).openModal({
		      	dismissible: autoClose,
		      	ready: function() {
		      		if (full){
		      			($('#'+id).css({"width":"100%", "max-height":"100%", "height":"100%", "top":"0px"}));
		      		} else if (full_w){
		      			($('#'+id).css({"width":"100%", "max-height":"100%"}));
		      		}
		      		if (callback){
		      			callback();
		      		}
		      	},
		      	complete: function () { $('.fixed-action-btn').show();}
			});
		},
		error:function(d){
		}
	});
}
function popup_hide(name){
	$('#pop_' + name).closeModal();
	$('.fixed-action-btn').show();
	_.delay(
		function(){
			$('#pop_' + name).remove();
		}, 500);
}

/*
function popup_withoutBtn_show(param){
	var name = param.name || "";
	var title = param.title || "";
	var callback = param.callback || null;
	var okFnc = param.okFnc || null;
	var width = param.width || 500;
	var height = param.height || 500;
	var top = (getBrowserHeight() - height)/2;
	var left = (100 - width)/2;
	$.ajax({
		url: "./popup/" + name + ".html",
		//async: false,
		success:function(d){
			playSound("pop");
			var s='<div id="mask" style="opacity:0.5; width:100%; height:100%;"></div>';
            s+='<div class="afPopup" style="top:%top; left:%left; width:%width; height:%height;">%body</div>';
            s=template(s,{
            	'%width':width+'%',
            	'%height':height+"px",
            	'%top':top+'px',
            	'%left':left+"%",
            	'%body':d
            });
			$('body').append(s);
			$('.afPopup').on("click",function(event) {
				$('.afPopup').unbind("click");
				$('.afPopup').remove();
				$('#mask').remove();
				if (okFnc){
					okFnc();
				}
			});
			if (callback){
				callback();
			}


		},
		error:function(d){
			//alert(d);
			//unwait();
			msg("e",L("M011"));
		}
	});
}*/
function page_show(name, callback){

	$("#index_help").remove();
	$('#select_help').remove();
	$("#help").remove();
	var page_id = "#content";

	wait();
	$.ajax({
		url: "./page/" + name + ".html",
		success:function(d){
			unwait();
			$(page_id).hide();
			$(page_id).html(d);
			isShowFab = false;

			if (callback){
				callback();
			}
			/*clearTimeout(timeout_page);
			timeout_page=setTimeout("page_show_callback();",30);*/
			_.delay(page_show_callback,30);
		},
		error:function(d){
			unwait();
			msg("e",M[101]);
		}
	});
}
page_show_callback = function(){
	//clearTimeout(timeout_page);
	$('#content').show();
	unwait();
}
function get_html(name,element){
	var language = nLang ? "japanese" : "english";
	var url = "./" + language + "/" + name + ".html";
	$.get(url, function(response){
	  $(element).html(response)
	});
}
function cssShow(id){
	$(id).css("visibility","visible");
}
function cssHide(id){
	$(id).css("visibility","hidden");
}
function dispShow(id){
	$(id).css("display","inline");
}
function dispHide(id){
	$(id).css("display","none");
}
//	switch
function showSwitch(tag, options, callback, value){
	callBack = callback;
	var width = parseInt((100-2) /options.length);
	var html = "";
	for (var i=0; i<options.length; i++){
		var s = "<button class='nav_button p_class size18' id='p_id'>p_value</button>";
		//onclick='clickSwitch(p_param,p_index);'
		var s = template(s,{
			p_class: tag
			,p_param: '"' + tag + '"'
			,p_id: tag + i
			,p_value : options[i]
			,p_index : i
		});
		html +=s;
	}
	$("#"+tag).html(html);
	$('.'+tag).css("width", width +"%");
	//alert(value);
	if (!isNaN(value)){
		changeSwitch(tag, value);
	}
	switch (options.length){
		case 10:
			$('#' + tag + 9).on("click",function(evt){clickSwitch(tag, 9, callback)});
		case 9:
			$('#' + tag + 8).on("click",function(evt){clickSwitch(tag, 8, callback)});
		case 8:
			$('#' + tag + 7).on("click",function(evt){clickSwitch(tag, 7, callback)});
		case 7:
			$('#' + tag + 6).on("click",function(evt){clickSwitch(tag, 6, callback)});
		case 6:
			$('#' + tag + 5).on("click",function(evt){clickSwitch(tag, 5, callback)});
		case 5:
			$('#' + tag + 4).on("click",function(evt){clickSwitch(tag, 4, callback)});
		case 4:
			$('#' + tag + 3).on("click",function(evt){clickSwitch(tag, 3, callback)});
		case 3:
			$('#' + tag + 2).on("click",function(evt){clickSwitch(tag, 2, callback)});
		case 2:
			$('#' + tag + 1).on("click",function(evt){clickSwitch(tag, 1, callback)});
		case 1:
			$('#' + tag + 0).on('click', function(e){clickSwitch(tag, 0, callback);});
			break;
	}
}
function clickSwitch(tag, index, callback){
	if (!$('#' + tag ).hasClass("hide")){
		playSound("switch");
		changeSwitch(tag, index);
		if (callback){
			_.delay(function(){callback(index);}, 50);
		}
	}
}
function changeSwitch(tag, index){
	$('.'+ tag).removeClass("nav_button_select").addClass("nav_button");
	$('#' + tag + index).removeClass("nav_button").addClass("nav_button_select");
}
//	on/off switch
function showCheckbox(tag, options, callback, value){
	//alert(tag);
	value = value || false;
	var html = "";
	var s = "<div class='nav_button' id='p_id' style='width:100%;'></div>";
	//onclick='clickSwitch(p_param,p_index);'
	var new_tag = tag + "_on_off";
	var s = template(s,{
		p_id: new_tag
	});
	html +=s;

	$("#"+tag).html(html);
	$('#' + new_tag ).text(options[value ? 1 : 0]);
	//alert(value);
	if (value) changeCheckbox(new_tag );
	$('#' + new_tag ).on("touchstart",function(evt){
		//clickCheckbox(new_tag , callback)
		if (!$('#' + new_tag ).parent().hasClass("hide")){
			playSound("switch");
			var val = changeCheckbox(new_tag);
			$('#' + new_tag ).text(options[val ? 1 : 0]);
			if (callback){
				callback(val);
			}
		}
	});
}
function clickCheckbox(tag, callback){
	if (!$('#' + tag ).parent().hasClass("hide")){
		playSound("switch");
		var val = changeCheckbox(tag);
		if (callback){
			_.delay(function(){callback(val);}, 50);
		}
	}
}
function changeCheckbox(tag){
	if ($('#' + tag ).hasClass("nav_button_select")){
		$('#' + tag ).removeClass("nav_button_select").addClass("nav_button");
		return false;
	} else {
		$('#' + tag ).addClass("nav_button_select").removeClass("nav_button");
		return true;
	}
}
function wait(text){
	text = text || 'please wait';
	var s = '<div class="edit_mask"></div>';
	s+='<div class="waiting">';
	//s+='<img style="position:absolute; left:0px; width:30px;" src="images/ajax_loader_gray_48.gif"/>';
	s+='<div class="preloader-wrapper small active pa">';
	s+='<div class="spinner-layer spinner-blue-only">';
	s+='  <div class="circle-clipper left">';
	s+='    <div class="circle"></div>';
	s+='  </div><div class="gap-patch">';
	s+='    <div class="circle"></div>';
	s+='  </div><div class="circle-clipper right">';
	s+='    <div class="circle"></div>';
	s+='  </div>';
	s+='</div>';
	s+='</div>';
	s+='<div style="position:absolute; left:50px; right:0px;" id="waiting_text">' + text + '</div>';
	s+='</div>';
    $('body').append(s);
}
function unwait(){
	$('.waiting').remove();
	$('.edit_mask').remove();
}
function wait_taffy(text){
	text = text || 'please wait';
	var s = '<div id="waiting_taffy">';
	s+='<img style="position:absolute; left:0px; width:30px;" src="images/ajax_loader_gray_48.gif"/>';
	s+='<div style="position:absolute; left:30px; right:0px;" id="waiting_taffy_text">' + text + '</div>';
	s+='</div>';
    $('body').append(s);
}
function unwait_taffy(){
	$('#waiting_taffy').remove();
}
function msg(type, msg){

	switch (type){
		case 'e':
			playSound("error");
			break;
		case 'm':
			playSound("info");
			break;
		case 'a':
			playSound("sumup");
			break;
		case 's':
			playSound("confirm");
			break;
	};
	//alert(msg);
	Materialize.toast(msg, 4000);
	/*_.delay(function(){
		msg_callback(msg);
	}, 510);*/
}
function msg_callback(msg){
	alert(msg);
}
function msg_bind(msg,s){
	return template(msg,{
		"%s": s
	});
}
function msg_bind2(msg,s1,s2){
	return template(msg,{
		"%s1": s1
		,"%s2": s2
	});
}
function toggle_sidebar(){
	playSound("switch");
	if ($('.sidebar').css("left")!="0px"){
		open_sidebar();
	} else {
		close_sidebar();
	}
}
function open_sidebar(){
	//playSound("switch");
	$( ".sidebar" ).animate({
   		left: "0px"
	});
	if (navigator.userAgent.indexOf('Android') > 0) {
        $( ".sidebarFrame" ).animate({
	   		left: "200px",
	   		width:"824px"
		});
    } else {
		$( ".sidebarFrame" ).animate({
	   		left: "200px"
		});
	}
	$('.open_menu').css("background-image","url(images/arrow-left.png)");
}
function close_sidebar(){
	$( ".sidebar" ).animate({
   		left: "-200px"
	});

	if (navigator.userAgent.indexOf('Android') > 0) {
		$( ".sidebarFrame" ).animate({
	   		left: "0px",
	   		width: "1024px"
		});
	} else {
		$( ".sidebarFrame" ).animate({
	   		left: "0px"
		});
	}

	$('.open_menu').css("background-image","url(images/arrow-right.png)");
	$("#help").remove();
	$('#select_help').remove();
}
//  *******************************************************
//  *** *** *** *** ***     タッチイベント   *** *** *** *** ***
//  *******************************************************
function touchMove(e){

	if (isMoving==true){
		e.preventDefault();
		//nTouches = e.touches.length;
		mouseX = (e.originalEvent.touches[0].pageX-imgOffsetX);
		mouseY = (e.originalEvent.touches[0].pageY-imgOffsetY);
		$(dragItem).css({"top":(mouseY/getBrowserHeight()*100)+"%", "left": (mouseX/getBrowserWidth()*100)+"%"});
	}
}
//  *******************************************************
//  *** *** *** *** ***     help         *** *** *** *** ***
//  *******************************************************
function drawLine(x1,y1,x2,y2){
	context_help.lineWidth = 6;
	context_help.strokeStyle = "palegreen";
	context_help.beginPath();
	context_help.moveTo(x1,y1);
	context_help.lineTo(x2,y2);
	context_help.stroke();
}
function drawText(x,y,text){
	context_help.font = "30px Chalkboard SE";
	context_help.fillStyle = "palegreen";
	context_help.fillText(text, x, y);
}
function drawRect(x,y,w,h){
	context_help.lineWidth = 6;
	context_help.strokeStyle = "palegreen";
	context_help.strokeRect(x,y,w,h);
}
function hideHelp(){
	cssHide('.help');
}
function clearHelp(){
	context_help.clearRect(0, 0, 1400, 900);
}
//  *******************************************************
//  *** *** *** *** ***     goto         *** *** *** *** ***
//  *******************************************************
function gotoHome(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	//$.ui.loadContent("#page_index",false,false,"slide");
	playSound("enter");
	page_show("title", init_index);
}
function goto(page_name){
	playSound("enter");
	isMoving = false;
	switch (page_name){
		case "versus":
			page_show(page_name, init_versus);
			break;
		case "select_japan":
			page_show(page_name,init_selectJapan);
			break;
		case "japan":
			page_show(page_name,init_japan);
			break;
		case "billboard":
			if (checkConnection()){
				page_show(page_name,init_billboard);
			}
			break;

        //add 2015.1.3
        case "select_data":
            if (checkConnection()){
				page_show(page_name,init_dataSelect);
			}
            break;
        case "analize":
            if (checkConnection()){
				page_show(page_name,init_analize);
			}
            break;

        case "data":
			if (checkConnection()){
                //update apa
				page_show(page_name,init_data);
                //page_show(page_name,data.click_type);
			}
			break;
		case "practice":
			page_show(page_name,init_practice);
			break;
		case "rotation":
			page_show(page_name,init_rotation);
			break;
		case "select_player":
			page_show(page_name,init_selectPlayer);
			break;
		case "select_taiwan":
			page_show(page_name,init_select_taiwan);
			break;
		case "set_match":
			page_show(page_name,init_set_match);
			break;
		case "settings":
			page_show(page_name,init_settings);
			break;
		case "straightpool":
			page_show(page_name,init_straightPool);
			break;
		case "taiwan":
			page_show(page_name,init_taiwan);
			break;
		case "bowlard":
			page_show(page_name,init_bowlard);
			break;
		case "csrs":
			page_show(page_name,init_csrs);
			break;
		case "worldranking":
			if (checkConnection()){
				page_show(page_name,init_worldranking);
			}
			break;
		case "analize":
			if (checkConnection()){
				page_show(page_name,init_analize);
			}
			break;
		case "statistics":
			if (checkConnection()){
				page_show(page_name,init_statistics);
			}
			break;
		case "one_pocket":
			page_show(page_name,init_op);
			break;
		case "fujiyama":
			page_show(page_name,init_fujiyama);
			break;
		case "wait_tournament":
			page_show(page_name,init_waitTournament);
			break;
		case "sponsor":
			if (checkConnection()){
				page_show(page_name,init_sponsor);
			}
			break;
		case "test":
			page_show(page_name,null);
			break;

		//add apa
		case "select_apa":
			page_show(page_name,init_selectApa);
			break;
		case "apa9":
			page_show(page_name,init_apa9);
			break;

        //add ver5.01
        case "apa8":
			page_show(page_name,init_apa8);
			break;

        //add ver5.03
        case "kairun":
			page_show(page_name,init_kairun);
			break;
		case "login":
			if (checkConnection()){
				page_show(page_name,init_login);
			}
			break;
		case "snooker":
			page_show(page_name,init_snooker);
			break;

	}
	/*$("body").on('swiperight', open_sidebar);
    $("body").on('swipeleft', close_sidebar);*/
}

//  *******************************************************
//  *** *** *** *** ***     情報取得         *** *** *** *** ***
//  *******************************************************
function getHallName(cd){
	var name;
	if (cd=="0" || !cd){
		name = W[102];
	} else {
		name = HALLS({ CD:{'==':cd}
					}).select("NAME");
	}
	return name;
}
function getPlayerName(cd){
	if (cd>0){
		var name = PLAYERS({
						CD:{'==':cd}
					}).select("NAME");
		return name;
	} else {
		return M[119];
	}
}
function getClass(cd){
	return parseInt(PLAYERS({CD:{'==':cd}}).select("CLASS"));
}
function getRating(cd){
	var rating = PLAYERS({CD:{'==':cd}}).select("RATING");
	if (rating==""){
		return W[127];
	} else {
		var num=rating/100;
		var strI = " " + Math.floor(num);
		var strD = num + "00.00";
		return strI.substr(-1,1) + "." + strD.split(".")[1].substr(0,2);
	}
};
function convRating( rating ){
	if (!rating){
		return W[127];
	} else {
		var num=rating/100;
		var strI = " " + Math.floor(num);
		var strD = num + "00.00";
		return strI.substr(-1,1) + "." + strD.split(".")[1].substr(0,2);
	}
};

//add apa start
function getRating_num(cd){
	var map = PLAYERS({CD:{'==':cd}}).first();
    var rating = map.RATING;

    if (!rating){
		switch (getClass(cd)){
            case 0:
                rating = 100;
                break;
            case 1:
                rating = 300;
                break;
            case 2:
                rating = 500;
                break;
            case 3:
                rating = 700;
                break;
            case 4:
                rating = 850;
                break;
            case 5:
                rating = 950;
                break;
        }
	}
    return rating;
}
function getSL9(cd){
    var rating = getRating_num(cd);
    var sl9 = getSL9fromRating(rating);
    return sl9;
}
function getSL9fromRating(rating){
    var sl9;
    if (rating<400){
        sl9 = Math.floor(1 + rating/400*4);
    } else if (rating<600){
        sl9 = Math.floor(5 + (rating-400)/200*3);
    } else if (rating<900){
        sl9 = Math.floor(8 + (rating-600)/300*2);
    } else {
        sl9 = 9;
    }
    return sl9;
}
function getSL8(cd){
    var rating = getRating_num(cd);
    var sl8 = getSL8fromRating(rating);
    return sl8;
}
function getSL8fromRating(rating){
    var sl8;
    if (rating<200){
        sl8 = Math.floor(2 + rating/200);
    } else if (rating<400){
        sl8 = Math.floor(3 + (rating-200)/200*2);
    } else if (rating<600){
        sl8 = Math.floor(5 + (rating-400)/200*2);
    } else {
        sl8 = 7;
    }
    return sl8;
}
function get_template(param){

	var name = param.name || "";
	var callback = param.callback || null;

	$.ajax({
		url: "./template/" + name + ".html",
		//async: false,
		success:function(d){
			if (callback){
				callback(d);
			}

		}
	});
}
//add apa end
//  *******************************************************
//  *** *** *** *** ***     日付         *** *** *** *** ***
//  *******************************************************
function getDateStr(date){

    var year = date.getYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (year < 2000) { year += 1900; }
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }

    return year + "/" + month +"/" + day ;
}
//add ver5.01
function getTimeStr(date){

    var hour = date.getHours();
    var minute = date.getMinutes();
    if (hour < 10) { hour += "0" + hour; }
    if (minute < 10) { minute = "0" + minute; }
    return hour + ":" + minute;
}

function createYMD(year,month,day){

    if (year < 2000) { year += 1900; }
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }

    return year + "/" + month +"/" + day ;
}
function createYM(year,month){

    if (year < 2000) { year += 1900; }
    if (month < 10) { month = "0" + month; }

    return year + "/" + month;
}
function getNowDate(){
	var date_now = new Date();
    var year = date_now.getFullYear();
    var month = date_now.getMonth() +1;
    var day = date_now.getDate();
    if (year < 2000) { year += 1900; }
    if (month < 10) { month = "0" + month; }
	if (day < 10) { day = "0" + day; }
    return year + "-" + month + "-" + day;
}
//  *******************************************************
//  *** *** *** *** ***     tablet         *** *** *** *** ***
//  *******************************************************
function chkTablet_timer(){
    clearTimeout(tabletTimeout);
    set_tabletScore();
    //tabletTimeout=setTimeout("chkTablet_timer();",5000);
}
function set_tabletScore(){
    clearTimeout(tabletTimeout);
    db.cgi({
        action: "setTabletScore"
        ,callback: successFnc_set_tabletScore
        ,async: true
        ,isNoWait : true
        ,data: {
            cd: nTabletCd
            , player1:player[0].cd
            , player2:player[1].cd
            , score1:nScore[0]
            , score2:nScore[1]
        }
    });
}
function successFnc_set_tabletScore(d){
    if (d=="fin"){
        $("body").show();
        clearTimeout(tabletTimeout);
        gotoHome();
    } else {
        tabletTimeout=setTimeout("chkTablet_timer();",5000);
    }
}
//  *******************************************************
//  *** *** *** *** ***     function         *** *** *** *** ***
//  *******************************************************
// ローカルストレージへ保存
function fncSetJSON(object,item){
	var nativeJSON = JSON.stringify(object().get());
	localStorage.setItem(item, nativeJSON);
}
function getLocalStorage(){
	isHall = window.localStorage.getItem("isHall")=="1" ? true : false;
	nHall = parseInt(window.localStorage.getItem("nHall") || -1);
	sHall = window.localStorage.getItem("sHall");
	sCountry = window.localStorage.getItem("sCountry");
	nArea = parseInt(window.localStorage.getItem("nArea") || 0);
	sArea = window.localStorage.getItem("sArea");
	nPlayer = parseInt(window.localStorage.getItem("nPlayer") || -1);
	sPlayer = window.localStorage.getItem("sPlayer");
	sSyncDate = window.localStorage.getItem("sSyncDate");
	var lang;
	var nav_language = window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage;
	if  (nav_language.indexOf("ja")>=0){
        lang=1;
        if (!sCountry) sCountry="jp";
    } else {
    	lang=0;
    }
	nLang = parseInt(window.localStorage.getItem("nLang") || lang);
	sPassword = window.localStorage.getItem("sPassword");
	nTabletCd = parseInt(window.localStorage.getItem("nTabletCd") || 0);
	sLimit = window.localStorage.getItem("sLimit");
    nIsFemale = parseInt(window.localStorage.getItem("nIsFemale") || 0);
}
function setLocalStorage(){
	window.localStorage.setItem("isHall",isHall==true ? "1" : "0");
	window.localStorage.setItem("nHall",nHall);
	window.localStorage.setItem("sHall",sHall);
	window.localStorage.setItem("sCountry",sCountry);
	window.localStorage.setItem("nArea",nArea);
	window.localStorage.setItem("sArea",sArea);
	window.localStorage.setItem("nPlayer",nPlayer);
	window.localStorage.setItem("sPlayer",sPlayer);
	window.localStorage.setItem("sSyncDate",sSyncDate);
	window.localStorage.setItem("nLang",nLang);
	window.localStorage.setItem("sPassword",sPassword);
	window.localStorage.setItem("nTabletCd",nTabletCd);
	window.localStorage.setItem("sLimit",sLimit);
    window.localStorage.setItem("nIsFemale", nIsFemale);
}
function getDiv0(s, d){
	if (d!=0 && isNaN(d)!=true){
		var str = "    "+Math.round(s/d);
		return str.substr(-5,5);
	} else {
		return '    0';
	}
}
function getDiv1(s, d){

	if (d!=0 && isNaN(d)!=true){
		var num = Math.round(s/d*10)/10;
		var strI = "     " + Math.floor(num);
		var strD = num + "0.0";
		return strI.substr(-5,5) + "." + strD.split(".")[1].substr(0,1);

	} else {
		return '    0.0';
	}
}
function getDiv2(s, d){
	if (d!=0 && isNaN(d)!=true){
		num=Math.round(s/d*100)/100;
		var strI = "  " + Math.floor(num);
		var strD = num + "00.00";
		//return strI.substr(-1,1) + "." + strD.split(".")[1].substr(0,2);
        return strI.substr(-2,2) + "." + strD.split(".")[1].substr(0,2);    //update ver5.03
	} else {
		return ' 0.00';
	}
}
function getDiv3(s, d){
	if (d!=0 && isNaN(d)!=true){
		num = Math.round(s/d*1000)/1000;
		var strI = "  " + Math.floor(num);
		var strD = num + "000.000";
		//return strI.substr(-1,1) + "." + strD.split(".")[1].substr(0,3);
        return strI.substr(-2,2) + "." + strD.split(".")[1].substr(0,3); //update ver5.03

	} else {
		return ' 0.000';
	}
}
function getInt5(s){
	var str = "    "+ s;
	return str.substr(-5,5);
}
function getInt4(s){
	var str = "   "+ s;
	return str.substr(-4,4);
}
function getInt3(s){
	var str = "  "+ s;
	return str.substr(-3,3);
}
function getInt2(s){
	var str = " "+ s;
	return str.substr(-2,2);
}
function validate(formID) {
    var f = document.getElementById(formID);
    if ( f.checkValidity() ) {
    	//ok
        return true;
    } else {
    	//bad
        return false;
    }
}
function form_submit(elements){
	for (var i=0; i<elements.length; i++){
		if (!validate(elements[i])){
			$('#'+elements[i]).css("background","red").focus();
			msg("e",M[125]);

			return false;
		} else {
			$('#'+elements[i]).css("background","white");
		}
	}
	return true;
}
function trim(target){
	var value = "" + target + "";
	//return value.replace(/(^s+)|(s+$)/g, "");
    return value.replace(/(^\s+)|(\s+$)/g, "");
}
function fncQuickSort(pcol,lngMin, lngMax){
    var lngIdxL;
	var lngIdxR;
	var vntKijunChi;
	var vntWk;
	var maxCol = sort_data[0].length;
	var col = Math.abs(pcol);
	var wid;

	//中央付近のインデックス内容値を基準値とします。
	wid = Math.floor((lngMin + lngMax) / 2);
	vntKijunChi = sort_data[wid][col];

	//最小インデックスをセット。
	lngIdxL = lngMin;

	//最大インデックスをセット。
	lngIdxR = lngMax;

	while(true){
		if (pcol>0){
			while (sort_data[lngIdxL][col] < vntKijunChi) lngIdxL++;
			while (vntKijunChi < sort_data[lngIdxR][col]) lngIdxR--;
		} else {
			while (sort_data[lngIdxL][col] > vntKijunChi) lngIdxL++;
			while (vntKijunChi > sort_data[lngIdxR][col]) lngIdxR--;
		}

		//最小インデックスと最大インデックスが同じか大きくになったらブレイクDOループ。
		if (lngIdxL >= lngIdxR) break;


		for (var i=0;i<=maxCol;i++){
			vntWk = sort_data[lngIdxL][i];
			sort_data[lngIdxL][i] = sort_data[lngIdxR][i];
			sort_data[lngIdxR][i] = vntWk;
		}

		//配列のインデックスの小さい方から基準値に向かってのインデックスを更新する。
		lngIdxL++;

		//配列のインデックスの大きい方から基準値に向かってのインデックスを更新する。
		lngIdxR--;
	}

	//左の配列の処理が必要か
	if (lngMin < lngIdxL-1) fncQuickSort(pcol,lngMin, lngIdxL - 1);

	//右の配列の処理が必要か
	if (lngIdxR+1 < lngMax) fncQuickSort(pcol,lngIdxR + 1, lngMax);
}
function template(s,options){
	for ( var i in options ){
		s = replaceAll(s, i, options[i]);
	}
 	return s;
}
// 全ての文字列 s1 を s2 に置き換える
function replaceAll(expression, org, dest){
    return expression.split(org).join(dest);
}
/*function playSound(name){
	var url = "sounds/" + name + ".mp3";
	if (isHall && (nHall == 1)){
		intel.xdk.player.playSound("sounds/none.mp3");
		clearTimeout(timeout);
		timeout=setTimeout("playSound_atpool('" + url + "');",250);
	} else {
		intel.xdk.player.playSound(url);
	}
}
function playSound_atpool(url){
	intel.xdk.player.playSound(url);
	clearTimeout(timeout);
}*/
function setSync(table_name, table_cd){
	var sync_max = SYNC().max("CD") +1;
    SYNC.insert(
        {
            CD: sync_max
            ,TABLE_NAME: table_name
            ,TABLE_CD: table_cd
        }
    );
}
function getBrowserWidth() {
        if ( window.innerWidth ) {
                return window.innerWidth;
        }
        else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
                return document.documentElement.clientWidth;
        }
        else if ( document.body ) {
                return document.body.clientWidth;
        }
        return 0;
}
function getBrowserHeight() {
        if ( window.innerHeight ) {
                return window.innerHeight;
        }
        else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
                return document.documentElement.clientHeight;
        }
        else if ( document.body ) {
                return document.body.clientHeight;
        }
        return 0;
}
function addMovingItem(ind){
   movingItems[ind]=1;
}
function chkIllegalCharacters(value)
{
    if ( value.match(/[<>\[\]&\^'\*;']/) )	// 入力値の禁則文字「<」、「>」、「[」、「]」、「&」、「^」、「'」、「*」 ,「;」 , 「'」
	{
		return true;
	}
	return false;
}
function setLockout(){
	nLockout_cnt++;
	if (nLockout_cnt>2){
		isLockout = true;
		Lockout_time = new Date().getTime();
		msg("e",M[126]);
		return true;
	} else {
		return false;
	}

}
function getIsIpad(){
	if( navigator.userAgent.indexOf('iPad') > 0 ){
		return true;
	} else {
		return false;
	}
}
function checkSafeUrl(url){
    if( url.match( /^https?:\/\// ) || trim(url)==""){
        return true;
    } else {
         return false;
    }
}
function checkConnection(noMsg){	// update sync
	var flg = noMsg || false;	// update sync
    var networkState = navigator.connection.type;
    if (networkState==Connection.NONE){

    	//update sync
        if (!flg){

            msg("e",M[101]);
        }

    	//delete ver 4.5
    	/*
    	if (!flg){
    		gotoHome();
    	}	*/
    	return false;
    } else {
    	return true;
    }
}
function clickFab(){
	playSound("pop");
    isShowFab = !isShowFab;
    if (isShowFab){
        $('.fixed-action-btn').openFAB();
    } else {
        $('.fixed-action-btn').closeFAB();
    }
}

//未使用
