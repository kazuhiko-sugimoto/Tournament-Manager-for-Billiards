window.jQuery = window.$ = require('./js/jquery-2.1.4.min');
var _ = require('./js/underscore-min');

var sSkill = new Array("bg","C","B","A","SA","PRO");
var sSL = new Array("SL1","SL2","SL3","SL4","SL5","SL6","SL7","SL8","SL9");

var nScore = [];

var sPage;    //移動先ページ名
var date_now = new Date();
var webRoot = "/";

var nLang = 1;	//0:english 1:japanese
var callBack;
var t_cd;
var mnHistory;
//  *******************************************************
//  *** *** *** *** ***     class       *** *** *** *** ***
//  *******************************************************

//  *******************************************************
//  *** *** *** *** ***     表示   		 *** *** *** *** ***
//  *******************************************************
function popup_show(param){
	var name = param.name || "";
	var title = param.title || "";
	var width = param.width || "600px";
	var callback = param.callback || null;

	$.ajax({
		url: "./popup/" + name + ".html",
		//async: false,
		success:function(d){

			var id="pop_"+name;
			var html = '<div id="%id" title="%title">';
	    html+='%content'
	  	html+='</div>';
	  	html=template(html,{
	  		"%id" : id
	  		,"%content": d
	  		,"%title": title
	  	})
	  	$('body').append(html);

			$('#' + id).dialog({
				open: function ( event, ui ) {
					if (callback){
						callback();
					}
				}
				,beforeClose: function ( event, ui ) {
					$('#' + id).remove();
					//popup_hide(name);
				}
				,modal: true
				,width: width
			});
		},
		error:function(d){
		}
	});
}
function popup_hide(name){
	$('#pop_' + name).dialog( "close" );
	_.delay(
		function(){
			$('#pop_' + name).remove();
		}, 500);
}


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
			break;
		case 'm':
			break;
		case 'a':
			break;
		case 's':
			break;
	};
	//alert(msg);
	alert(msg);
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
	if ($('.sidebar').css("left")!="0px"){
		open_sidebar();
	} else {
		close_sidebar();
	}
}
function open_sidebar(){
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

//  *******************************************************
//  *** *** *** *** ***     help         *** *** *** *** ***
//  *******************************************************

//  *******************************************************
//  *** *** *** *** ***     goto         *** *** *** *** ***
//  *******************************************************
function gotoHome(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	//$.ui.loadContent("#page_index",false,false,"slide");
	page_show("title", init_index);
}
function goto(page_name){
	isMoving = false;
	switch (page_name){
		case "open":
			page_show(page_name, init_open);
			break;
	}
}

//  *******************************************************
//  *** *** *** *** ***     情報取得         *** *** *** *** ***
//  *******************************************************

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

//  *******************************************************
//  *** *** *** *** ***     function         *** *** *** *** ***
//  *******************************************************
// ローカルストレージへ保存
function fncSetJSON(object,item){
	var nativeJSON = JSON.stringify(object().get());
	localStorage.setItem(item, nativeJSON);
}
function getLocalStorage(){
	var lang;
	var nav_language = window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage;
	if  (nav_language.indexOf("ja")>=0){
        lang=1;
    } else {
    	lang=0;
    }
	nLang = parseInt(window.localStorage.getItem("nLang") || lang);
}
function setLocalStorage(){
	window.localStorage.setItem("nLang",nLang);
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

function chkIllegalCharacters(value)
{
    if ( value.match(/[<>\[\]&\^'\*;']/) )	// 入力値の禁則文字「<」、「>」、「[」、「]」、「&」、「^」、「'」、「*」 ,「;」 , 「'」
	{
		return true;
	}
	return false;
}


function checkSafeUrl(url){
    if( url.match( /^https?:\/\// ) || trim(url)==""){
        return true;
    } else {
         return false;
    }
}
function clickFab(){
    isShowFab = !isShowFab;
    if (isShowFab){
        $('.fixed-action-btn').openFAB();
    } else {
        $('.fixed-action-btn').closeFAB();
    }
}
/****************************************************************
* バイト数を数える
*
* 引数 ： str 文字列
* 戻り値： バイト数
*
****************************************************************/
function countLength(str) {
    var r = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            r += 1;
        } else {
            r += 2;
        }
    }
    return r;
}

//未使用
