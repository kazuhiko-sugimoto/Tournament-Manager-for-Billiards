var PLAYERS = TAFFY();
var HALLS = TAFFY();
var BELONG = TAFFY();
var GROUPS = TAFFY();
var ACCESS = TAFFY();
var SYNC = TAFFY();
var STRAIGHT_POOL = TAFFY();
var VERSUS = TAFFY();
var BOWLARD = TAFFY();
var CSRS = TAFFY();
var GUEST = TAFFY();	//add 2014/09/10
var W_PLAYERS = TAFFY();
var APA9 = TAFFY(); //add apa
var APA8 = TAFFY(); //add ver5.01
var APA_TEAM = TAFFY(); //add apa
var APA_MEMBER = TAFFY(); //add apa
var APA_TEAM_ACCESS = TAFFY();  // add apa
var SHEET = TAFFY();  // add apa
var KAIRUN = TAFFY();  // add ver5.03
var sync_index;

var db={};

db.base_url = 'https://kazu-software-com.ssl-xserver.jp/house_edition/cgi/cgi.php';
//db.base_url = 'http://kazu-software.com/house_edition/cgi/cgi.php';
// ローカルストレージから読み込み
db.getTAFFY = function(){
 	HALLS.store("HALLS");
 	PLAYERS.store("PLAYERS");
 	BELONG.store("BELONG");
 	GROUPS.store("GROUPS");
 	ACCESS.store("ACCESS");
 	SYNC.store("SYNC");
 	VERSUS.store("VERSUS");
 	BOWLARD.store("BOWLARD");
 	STRAIGHT_POOL.store("STRAIGHT_POOL");
 	CSRS.store("CSRS");
    APA8.store("APA8"); //add ver5.01
    APA9.store("APA9"); //add apa
    APA_TEAM.store("APA_TEAM"); //add apa
    APA_MEMBER.store("APA_MEMBER"); //add apa
    APA_TEAM_ACCESS.store("APA_TEAM_ACCESS"); //add apa
    SHEET.store("SHEET"); //add apa
    KAIRUN.store("KAIRUN"); //update 2015.2.3

 	//add 2014/09/10
 	for (var i=0; i<6; i++){
		GUEST.insert(
		    {
				CD: -i,
				HALL: -1,
				NAME: "Guest_" + sSkill[i],
				CLASS: i,
				MEMO: "",
				PASSWORD: null,
				RATING: i<4 ? 100+i*200 : 450+i*100,
				SEX: 0,
				LAST_ACCESS: null,
				SEARCH_INDEX: null
			}
		);
	}
}

db.cgi = function(param){
	var action = param.action;
	var postArray = param.data || {};
	var successFnc = param.callback || null;
	var wait_msg = param.msg || "Loading...";
	var isAsync = _.isUndefined(param.async) ? true : param.async;
	var isNoWait = param.isNoWait || false;
	var error_callback = param.error_callback || null;
	if (postArray == undefined) {
        postArray = { "action": action };
    } else {
        postArray.action = action;
    }
	if (!isNoWait) wait(wait_msg);

	$.ajax({
		url: db.base_url,
		type:"POST",
		async: isAsync,
		data:postArray,
		timeout: 20000,
		success:function(d){
			if (!isNoWait) unwait();
			if (d == "ng") {
                msg("e",M[101]);
                //popup_hide();
                unwait();
                gotoHome();
            } else if (successFnc!=undefined){
                successFnc(d);
            }
		},
		error:function(xhr, status, error){
			if (!isNoWait) unwait();
            //popup_hide();
            $("#help").remove();
            $('#select_help').remove();

			if (error_callback){
				error_callback();
			} else if (!isNoWait){
				//msg("e",M[101]);	delete ver 4.5
				msg("e",M[101]);	// add ver 4.5
				gotoHome();
			}
		}
	});
}

/*	**************
	同期処理
***************	*/
db.doSync = function(callback){

    db.deffered = [false,false,false,false,false,false,false];
	//$('#content').hide();
    $('#footer').hide();
	db.doSync_callback = callback || null;
	sync_index = 0;
	var i=0;
	SYNC().order("CD").each(function (r) {
		//alert(list[i].TABLE_NAME + ":" + list[i].TABLE_CD);
		//while(i>sync_index){}
		switch (r.TABLE_NAME){
			case "PLAYERS":
				var row = PLAYERS({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertPlayer"
				    ,callback: db.doSync_insertPlayer
					,async: false
				    ,data: {
				        country: sCountry
						,area: nArea
						,hall: row.HALL
						,name: row.NAME
						,skill: row.CLASS
						,memo: row.MEMO
						,password: row.PASSWORD
						,sex: row.SEX
						,before: row.CD
						,creater: nPlayer
						,secret: row.SECRET 	//add ver4.00
				    }
				});
                // add ver2.00 start
                if (row.HALL!=0){
                    db.cgi({
                        action: "send_msg"
                	    ,data: {
                	        "country": sCountry
                	   		,"area": nArea
                	   		,"hall": row.HALL
                	   		,"player": null
                	   		,"from_hall": null
                	   		,"from_player": 19
                	   		,"msg": msg_bind(M[28],row.NAME)
                	    }
                	});
                }
                // add ver2.00 end
				break;
			case "VERSUS":
				var row = VERSUS({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertVersus"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
						,MONTH: row.MONTH
						,DAY: row.DAY
						,GAME: row.GAME
						,PLAYER1: row.PLAYER1
						,PLAYER2: row.PLAYER2
						,HANDY1: row.HANDY1
						,HANDY2: row.HANDY2
						,CLASS1: row.CLASS1
						,CLASS2: row.CLASS2
						,RATING1: row.RATING1
						,RATING2: row.RATING2
						,GET1: row.GET1
						,GET2: row.GET2
						,WIN1: row.WIN1
						,WIN2: row.WIN2
				    }
				});
				break;
			case "BOWLARD":
				var row = BOWLARD({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertBowlard"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,INING: row.INING
			    		,SCORE: row.SCORE
			    		,HIGH_SCORE: row.HIGH_SCORE
			    		,STRIKE: row.STRIKE
			    		,DIV_STRIKE: row.DIV_STRIKE
			    		,SPARE: row.SPARE
			    		,DIV_SPARE: row.DIV_SPARE
			    		,POCKET: row.POCKET
			    		,SHOOT: row.SHOOT
				    }
				});
				break;
			case "STRAIGHT_POOL":
				var row = STRAIGHT_POOL({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertStraight_pool"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,INING: row.INING
			    		,SCORE: row.SCORE
			    		,HIGH_RUN: row.HIGH_RUN
			    		,POCKET: row.POCKET
			    		,SHOOT: row.SHOOT
			    		,BREAK: row.BREAK
			    		,OK_BREAK: row.OK_BREAK
			    		,SAFETY: row.SAFETY
			    		,OK_SAFETY: row.OK_SAFETY
				    }
				});
				break;
			case "CSRS":
				var row = CSRS({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertCsrs"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,INING: row.INING
			    		,SCORE: row.SCORE
			    		,HIGH_SCORE: row.HIGH_SCORE
			    		,POCKET1: row.POCKET1
			    		,SHOOT1: row.SHOOT1
			    		,POCKET2: row.POCKET2
			    		,SHOOT2: row.SHOOT2
				    }
				});
				break;

            //add ver5.01
            case "APA8":
				var row = APA8({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertAPA8"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,POCKET: row.POCKET
			    		,SHOOT: row.SHOOT
			    		,BREAK: row.BREAK
			    		,RUNOUT: row.RUNOUT
                        ,BREAK2: row.BREAK2 //add ver5.01
                        ,BREAK_IN: row.BREAK_IN //add ver5.01
			    		,SAFETY: row.SAFETY
			    		,OK_SAFETY: row.OK_SAFETY
				    }
				});
				break;

            //add apa
            case "APA9":
				var row = APA9({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertAPA9"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,POCKET: row.POCKET
			    		,SHOOT: row.SHOOT
			    		,BREAK: row.BREAK
			    		,RUNOUT: row.RUNOUT
                        ,BREAK2: row.BREAK2 //add ver5.01
                        ,BREAK_IN: row.BREAK_IN //add ver5.01
			    		,SAFETY: row.SAFETY
			    		,OK_SAFETY: row.OK_SAFETY
				    }
				});
				break;
            case "APA_TEAM":
				var row = APA_TEAM({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertAPA_TEAM"
				    //,async: false
				    ,data: {
				        COUNTRY: sCountry
			    		,AREA: nArea
			    		,NAME: row.NAME
			    		,CREATOR: row.CREATOR
				    }
				});
				break;
            case "APA_MEMBER":
				var row = APA_MEMBER({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertAPA_MEMBER_ver6"
				    //,async: false
				    ,data: {
				        TEAM_CD: row.TEAM_CD
			    		,PLAYER_CD: row.PLAYER_CD
			    		,MANAGER: row.MANAGER
				    }
				});
				break;
            case "APA_TEAM_ACCESS":
                var row = APA_TEAM_ACCESS({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "updateTEAM_access"
				    //,async: false
				    ,data: {
				        TEAM_CD: row.TEAM_CD
				    }
				});
                break;

            //add ver5.03
            case "KAIRUN":
				var row = KAIRUN({CD:{'==':r.TABLE_CD}}).first();
				db.cgi({
				    action: "insertKairun"
				    //,async: false
				    ,data: {
				        YEAR: row.YEAR
			    		,MONTH: row.MONTH
			    		,DAY: row.DAY
			    		,PLAYER: row.PLAYER
			    		,INING: row.INING
			    		,SCORE: row.SCORE
			    		,HIGH_RUN: row.HIGH_RUN
                        ,OUU: row.OUU   //add 2015.2.3
				    }
				});
				break;

		}
		i++;
	});
    SYNC().remove();
    VERSUS().remove();
    STRAIGHT_POOL().remove();
	BOWLARD().remove();
	CSRS().remove();
    APA9().remove();    //add apa
    //APA_TEAM().remove();    //delete ver5.03
    APA_TEAM_ACCESS().remove();   //add apa
    APA8().remove();    //add ver5.03
    KAIRUN().remove();    //add ver5.03

    PLAYERS().remove();

    wait(W[44]);
	db.cgi({
	    action: "getHallList"
        ,isNoWait: true
	    ,callback: db.doSync_getHallList
	    //,msg: W[40]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
    db.cgi({
        action: "getBelongSync"
        ,isNoWait: true
	    ,callback: db.doSync_getBelongSync
	    //,msg: W[40]
	    ,data: {
	        player: nPlayer
	    }
	});
    db.cgi({
        action: "getPlayerSync"
        ,isNoWait: true
	    ,callback: db.doSync_getPlayerSync
	    //,msg: W[41]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});

    //add apa
    db.cgi({
	    action: "getTeamSync"
        ,isNoWait: true
	    ,callback: db.doSync_getTeamList
	    //,msg: W[40]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
    db.cgi({
	    action: "getMemberSync"
        ,isNoWait: true
	    ,callback: db.doSync_getMemberSync
	    //,msg: W[40]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
	db.cgi({
	    action: "getGroupsSync"
        ,isNoWait: true
	    ,callback: db.doSync_getGroupsList
	    //,msg: W[40]
	    ,data: {
	        player: nPlayer
	    }
	});
	db.cgi({
	    action: "getGroupPlayerSync"
        ,isNoWait: true
	    ,callback: db.doSync_getGroupPlayerList
	    //,msg: W[40]
	    ,data: {
	    	area: nArea
	        ,player: nPlayer
	    }
	});

    /*db.cgi({
        action: "getVersusSync"
        ,isNoWait: true
	    ,callback: db.doSync_getVersusSync
	    //,msg: W[42]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});*/
}

db.doSync_insertPlayer = function(d){
	var json = d; //JSON.parse(d);
	//alert(json.before + ":" + json.after);
	VERSUS({PLAYER1:{'==':json.before}}).update({
		PLAYER1:json.after
	});
	VERSUS({PLAYER2:{'==':json.before}}).update({
		PLAYER2:json.after
	});
	BOWLARD({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});
	STRAIGHT_POOL({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});
	CSRS({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});

    //add ver5.03
    APA8({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});
    KAIRUN({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});

    APA9({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});
    APA_MEMBER({PLAYER_CD:{'==':json.before}}).update({
		PLAYER_CD:json.after
	});

	ACCESS({PLAYER:{'==':json.before}}).update({
		PLAYER:json.after
	});

	sync_index++;
}

db.doSync_plusIndex = function(d){
	sync_index++;
}

db.deffere = function(num){
   db.deffered[num] = true;
   if (db.deffered[0] &&  db.deffered[1] && db.deffered[2] && db.deffered[3] && db.deffered[4] && db.deffered[5] && db.deffered[6]){
       db.doSync_fin();
   }

}
db.doSync_getHallList = function(d){
	json = d; //JSON.parse(d);
	HALLS().remove();
	for (var i=0; i<json.length; i++){
		HALLS.insert(
		    {
				CD: parseInt(json[i].CD),
				NAME: json[i].NAME,
				PASSWORD: json[i].PASSWORD,
				E_MAIL: json[i].E_MAIL,
				REGIST_DATE: json[i].REGIST_DATE,
				LIMIT_DATE: json[i].LIMIT_DATE,
				URL: json[i].URL
			}
		);
	}
    db.deffere(0);
	/*
    db.cgi({
	    action: "getBelongSync"
	    ,callback: db.doSync_getBelongSync
	    ,msg: W[40]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
    */
}

db.doSync_getBelongSync = function(d){
	json = d; //JSON.parse(d);
	BELONG().remove();
	for (var i=0; i<json.length; i++){
		BELONG.insert(
		    {
				PLAYER: parseInt(json[i].PLAYER),
				GROUP_CD: parseInt(json[i].GROUP_CD),
				MANAGER: parseInt(json[i].MANAGER)
			}
		);
	}
    db.deffere(1);
    /*
	db.cgi({
	    action: "getPlayerSync"
	    ,callback: db.doSync_getPlayerSync
	    ,msg: W[41]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
    */
}

db.doSync_getPlayerSync = function(d){
	json = d; //JSON.parse(d);
	//PLAYERS().remove();

	for (var i=0; i<json.length; i++){
		PLAYERS.insert(
		    {
				CD: parseInt(json[i].CD),
				HALL: parseInt(json[i].HALL),
				NAME: json[i].NAME,
				CLASS: parseInt(json[i].CLASS),
				MEMO: json[i].MEMO,
				PASSWORD: json[i].PASSWORD,
				RATING: parseInt(json[i].RATING) || null,
				SEX: parseInt(json[i].SEX || 0),
				SECRET: parseInt(json[i].SECRET || 0),	//add 2014.12.17
				LAST_ACCESS: json[i].LAST_ACCESS,
				SEARCH_INDEX: null,
				MANAGER: parseInt(json[i].MANAGER)
			}
		);

		if (!isHall && json[i].CD==nPlayer){
			nHall = json[i].HALL;
			sHall = getHallName(nHall);
			//alert(nHall);
		}
	}
    db.deffere(2);


}
db.doSync_getGroupPlayerList = function(d){
	json = d;
	for (var i=0; i<json.length; i++){
		PLAYERS.insert(
		    {
				CD: parseInt(json[i].CD),
				HALL: parseInt(json[i].HALL),
				NAME: json[i].NAME,
				CLASS: parseInt(json[i].CLASS),
				MEMO: json[i].MEMO,
				PASSWORD: json[i].PASSWORD,
				RATING: parseInt(json[i].RATING) || null,
				SEX: parseInt(json[i].SEX || 0),
				SECRET: parseInt(json[i].SECRET || 0),	//add 2014.12.17
				LAST_ACCESS: json[i].LAST_ACCESS,
				SEARCH_INDEX: null,
				MANAGER: parseInt(json[i].MANAGER)
			}
		);
	}
    db.deffere(6);
}
/*db.doSync_getVersusSync = function(d){
	json = d; //JSON.parse(d);
	VERSUS().remove();
	for (var i=0; i<json.length; i++){
		VERSUS.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				GAME: parseInt(json[i].GAME),
				PLAYER1: parseInt(json[i].PLAYER1),
				PLAYER2: parseInt(json[i].PLAYER2),
				HANDY1: parseInt(json[i].HANDY1),
				HANDY2: parseInt(json[i].HANDY2),
				CLASS1: null,
				CLASS2: null,
				RATING1: null,
				RATING2: null,
				GET1: parseInt(json[i].GET1),
				GET2: parseInt(json[i].GET2),
				WIN1: parseInt(json[i].WIN1),
				WIN2: parseInt(json[i].WIN2)
			}
		);
	}
    db.deffere(3);
 }*/

/*db.doSync14_1Sync = function(d){
	json = d; //JSON.parse(d);
	STRAIGHT_POOL().remove();
	for (var i=0; i<json.length; i++){
		STRAIGHT_POOL.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_RUN: null,
				POCKET: null,
				SHOOT: null,
				BREAK: null,
				OK_BREAK: null,
				SAFETY: null,
				OK_SAFETY: null
			}
		);
	}
	db.cgi({
	    action: "getBowlardSync"
	    ,callback: db.doSync_getBowlardSync
	    ,msg: W[43]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
 }

 db.doSync_getBowlardSync = function(d){
	json = d; //JSON.parse(d);
	BOWLARD().remove();
	for (var i=0; i<json.length; i++){
		BOWLARD.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_SCORE: null,
				STRIKE: null,
				DIV_STRIKE: null,
				SPARE: null,
				DIV_SPARE: null,
				POCKET: null,
				SHOOT: null
			}
		);
	}
	db.cgi({
	    action: "getCSRSSync"
	    ,callback: db.doSync_getCSRSSync
	    ,msg: W[43]
	    ,data: {
	        country:sCountry
	        ,area:nArea
	    }
	});
 }

 db.doSync_getCSRSSync = function(d){
	json = d; //JSON.parse(d);
	CSRS().remove();
	for (var i=0; i<json.length; i++){
		CSRS.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_SCORE: null,
				POCKET1: null,
				SHOOT1: null,
				POCKET2: null,
				SHOOT2: null
			}
		);
	}
 	//SYNC().remove();
	db.doSync_fin();
 }*/

 //add apa
 db.doSync_getTeamList = function(d){
	json = d; //JSON.parse(d);
	APA_TEAM().remove();
	for (var i=0; i<json.length; i++){
		APA_TEAM.insert(
		    {
				CD: parseInt(json[i].CD),
				NAME: json[i].NAME,
                CREATOR: json[i].CREATOR
			}
		);
	}
    db.deffere(3);
}
db.doSync_getMemberSync = function(d){
	json = d; //JSON.parse(d);
	APA_MEMBER().remove();
	for (var i=0; i<json.length; i++){
		APA_MEMBER.insert(
		    {
				CD: parseInt(json[i].CD),
				TEAM_CD: json[i].TEAM_CD,
                PLAYER_CD: json[i].PLAYER_CD,
                MANAGER: json[i].MANAGER
			}
		);
	}
    db.deffere(4);
}
db.doSync_getGroupsList = function(d){
	json = d; //JSON.parse(d);
	GROUPS().remove();
	for (var i=0; i<json.length; i++){
		GROUPS.insert(
		    {
				CD: parseInt(json[i].CD),
				NAME: json[i].NAME,
                MANAGER: parseInt(json[i].MANAGER)
			}
		);
	}
    db.deffere(5);
}

db.doSync_fin = function(){
    unwait();
	sSyncDate=getNowDate();
	setLocalStorage();

    msg('m',M[156]);  //add sync
    close_sidebar();    //add sync

	//$('#content').show();
	$('#footer').show();
	if (db.doSync_callback){
		db.doSync_callback();
	}
}
db.setAccess = function(cd){
	var cnt = ACCESS({PLAYER:{'==':cd}}).count();
	if (cnt){
		ACCESS({PLAYER:{'==':cd}}).update({
			DATE:getNowDate()
		});
	} else {
		ACCESS.insert(
		    {
				PLAYER:cd,
				DATE:getNowDate()
			}
		);
	}
}
//add ver2.00
db.setAccess_pass = function(cd,password){
    password=trim(password);
    var cnt = ACCESS({PLAYER:{'==':cd}}).count();
	if (cnt){
		ACCESS({PLAYER:{'==':cd}}).update({
			DATE:getNowDate(),
            PASSWORD:password
		});
	} else {
		ACCESS.insert(
		    {
				PLAYER:cd,
				DATE:getNowDate(),
                PASSWORD:password
			}
		);
	}
}

function fncSQL(){
	//alert(property.proc);
	//http://kazusoftware.minibird.jp/poolmanager
	//http://kazusoftware.xsrv.jp
	wait();
	$.ajax({
		url:"http://kazusoftware.xsrv.jp/house_query.php",
		type:"POST",
		async: false,
		data:m_property,
		success:function(d){
			unwait();
			switch (m_property.proc) {
			case 1:  	//get area list
			    var jsonData = eval(d);
			    //alert("ok");
			    var s ="";

			    var s = '<option value="-1">地域を選択してください</option>';

			    for (var i=0;i<jsonData.length;i++){
			    	s += '<option value="' + jsonData[i].AREA + '">' + jsonData[i].NAME + '</option>';
				}


			    $('#house_area').html(s).val(-1);//.selectmenu('refresh');
				mnArea_temp = -1;
			    break;
			case 2: 	//get hall list
			    var jsonData = eval(d);
			    var s="";
			    s = '<option value="-1">店舗を選択してください</option>';
				s += '<option value="0">無所属</option>';

			    for (var i=0;i<jsonData.length;i++){
			    	s += '<option value="' + jsonData[i].CD + '">' + jsonData[i].NAME + '</option>';
				}

			    $('#house_hall').html(s).val(-1);//.selectmenu('refresh');
				mnHall_temp=-1;
				s = '<option value="-1">プレイヤーを選択してください</option>';
				$('#house_player').html(s).val(-1);//.selectmenu('refresh');
				mnPlayer_temp=-1;
				disabled_ok_welcome();
			    break;
			case 3: 	//check hall password
			    if (d=='ok'){
				    playSound("nice");
				  	//alert(pass_tag);
				    switch (pass_tag){
			    	case "0_delete":
			    		property = {proc: 35, COUNTRY: msCountry , AREA: mnArea_temp, CD: edit_cd_data, check: 'kinueyamada'};
						fncSQL();
						break;
					case "0_update":
						goto_page(3,"data_edit_hall.txt",true);
						break;
					case "0_login":
						$('#footer_main').show();
						//$('.login').css("visibility","hidden");
	                    hidePopFrame();
	                    mnHall = mnHall_temp;
	                    mnArea = mnArea_temp;
						window.localStorage.setItem("hall", mnHall);
						window.localStorage.setItem("area", mnArea);
						fncDispHall();
				    }

				} else {
					hidePopFrame();
					alert("ログインに失敗しました。");
					playSound("faul");
					switch (pass_tag){
					case "0_login":
						show_welcome();
						break;
					default:
					    break;
					}
				}
			    break;
			case 4: 	//check hallName

			    if (isNaN(d)==false){

					wait();
					var property2 = {country: msCountry, area: mnArea_temp, name: property.name, email: property.email, cd: d, check: 'kinueyamada'};
					$.ajax({
						url:"http://kazusoftware.minibird.jp/poolmanager/send_regist_mail.php",
						type:"POST",
						dataType: "text",
						data: property2,
						async: false,
						success:function(d){
							unwait();
							playSound("nice");
							alert("仮登録が完了しました。24時間以内に登録メールアドレスから本登録をしてください。");

						},
						error:function(d){
							unwait();
							alert(msg[47]);
							goto_index();
						}
					});
					//$('#new_hall').css("visibility","hidden");
					//$('#welcome').css("visibility","visible");
					show_welcome();

				} else if (d=='exist'){
					alert("同名の店舗がすでに存在します。");
					playSound("faul");
				} else {
					alert("書き込みエラー");
					playSound("faul");
				}

			    break;
			case 5: 	//get hall info

				if (form_id=="#data_hall"){
					var jsonData = d; //JSON.parse(d);
					$("#name_hall_data").val(jsonData.NAME);
			        $("#pass_hall_data").val(jsonData.PASSWORD);
			        $("#mail_hall_data").val(jsonData.E_MAIL);
			        $("#url_hall_data").val(jsonData.URL);

				} else {

					if (d=='ng'){
						msHallNm="";
				    	msEmail="";
						mnPass="";
						msLimit="";
						show_welcome();
        				$('#footer_main').hide();
					} else {

						var jsonData = d; //JSON.parse(d);

				    	msHallNm=jsonData.NAME;
				    	msEmail=jsonData.E_MAIL;
						mnPass=jsonData.PASSWORD;
						msLimit = jsonData.LIMIT_DATE;

				    }

			    }

			    break;

			case 6:  	//search player list

				var jsonData = eval(d);
			    var s="";
			    s = '<option value="-1">プレイヤーを選択してください</option>';

			    for (var i=0;i<jsonData.length;i++){
			    	s += '<option value="' + jsonData[i].CD + '">' + jsonData[i].NAME;
			    	if (jsonData[i].MEMO!=""){
			    		s+=  '(' + jsonData[i].MEMO + ')';
			    	}
			    	s+='</option>';
				}

			    $('#house_player').html(s).val(-1);//.selectmenu('refresh');
				mnPlayer_temp=-1;

			    break;
			case 7: 	//add player
			    if (isNaN(d)==false){
			    	search_select_cd = parseInt(d,10);
				    playSound("nice");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
			    break;

			case 8: 	//get player info
				if (d=='ng'){
					getName[target_tag] = '';
				    getClass[target_tag] = 0;
	                getUuid[target_tag] = '';
	                getCountry[target_tag] = '';
	                getArea[target_tag] = 0;
	                getHall[target_tag] = 0;
	                getMemo[target_tag] = '';
	                getPassword[target_tag] = '';
				} else {
					var jsonData = d; //JSON.parse(d);

				    getName[target_tag] = jsonData.NAME;
				    getClass[target_tag] = parseInt(jsonData.CLASS,10);
	                getUuid[target_tag] = jsonData.UUID;
	                getCountry[target_tag] = jsonData.COUNTRY;
	                getArea[target_tag] = parseInt(jsonData.AREA,10);
	                getHall[target_tag] = parseInt(jsonData.HALL,10);
	                getMemo[target_tag] = jsonData.MEMO;
	                getPassword[target_tag] = jsonData.PASSWORD;
	            }

			    break;
            case 9: //analize
            	//alert(d);
            	var jsonData = d; //JSON.parse(d);
            	score_analize[0] = parseInt(jsonData.BOWLARD_SCORE,10);
            	ining_analize[0] = parseInt(jsonData.BOWLARD_INING,10);
	            tec_rating[0] = parseFloat(jsonData.BOWLARD_RATING);
	            score_analize[1] = parseInt(jsonData.STRAIGHTPOOL_SCORE,10);
	            ining_analize[1] = parseInt(jsonData.STRAIGHTPOOL_INING,10);
	            tec_rating[1] = parseFloat(jsonData.STRAIGHTPOOL_RATING);
	            score_analize[2] = parseInt(jsonData.CSRS_SCORE,10);
	            ining_analize[2] = parseInt(jsonData.CSRS_INING,10);
	            tec_rating[2] = parseFloat(jsonData.CSRS_RATING);
	            technical_rating = parseFloat(jsonData.TECHNICAL_RATING);
	            versus_avr[0] = parseFloat(jsonData.VERSUS_AVR0);
	            versus_avr[1] = parseFloat(jsonData.VERSUS_AVR1);
	            versus_avr[2] = parseFloat(jsonData.VERSUS_AVR2);
	            versus_avr[3] = parseFloat(jsonData.VERSUS_AVR3);
	            versus_avr[4] = parseFloat(jsonData.VERSUS_AVR4);
	            versus_avr[5] = parseFloat(jsonData.VERSUS_AVR5);
	            win_analize[0] = parseInt(jsonData.VERSUS_WIN0,10);
	            loose_analize[0] = parseInt(jsonData.VERSUS_LOOSE0,10);
	            win_analize[1] = parseInt(jsonData.VERSUS_WIN1,10);
	            loose_analize[1] = parseInt(jsonData.VERSUS_LOOSE1,10);
	            win_analize[2] = parseInt(jsonData.VERSUS_WIN2,10);
	            loose_analize[2] = parseInt(jsonData.VERSUS_LOOSE2,10);
	            win_analize[3] = parseInt(jsonData.VERSUS_WIN3,10);
	            loose_analize[3] = parseInt(jsonData.VERSUS_LOOSE3,10);
	            win_analize[4] = parseInt(jsonData.VERSUS_WIN4,10);
	            loose_analize[4] = parseInt(jsonData.VERSUS_LOOSE4,10);
	            win_analize[5] = parseInt(jsonData.VERSUS_WIN5,10);
	            loose_analize[5] = parseInt(jsonData.VERSUS_LOOSE5,10);
	            versus_rating = parseFloat(jsonData.VERSUS_RATING);
	            total_rating = parseFloat(jsonData.TOTAL_RATING);
	            //alert(win_analize[4] + ":" + loose_analize[4]);
                break;
            case 10: // insert bowlard data
                if (d=='ok'){
    			    //playSound("nice");
				} else {
					playSound("faul");
				}
                break;
            case 11: // insert csrs data
                if (d=='ok'){
        		    //playSound("nice");
				} else {
					playSound("faul");
				}
                break;
            case 12: // insert 14-1 data
                if (d=='ok'){
            	    //playSound("nice");
				} else {
					playSound("faul");
				}
                break;
            case 13: // insert versus data
                if (d=='ok'){
                    //playSound("nice");
				} else {
					playSound("faul");
				}
                break;
			case 14: // get versus data
				//alert(form_id);
                var jsonData = d; //JSON.parse(d);
                var w_win = jsonData.WIN;
				var w_loose = jsonData.LOOSE;
				var w_get = jsonData.GET;
				var w_lost = jsonData.LOST;
				var w_handy1 = jsonData.HANDY1;
				var w_handy2 = jsonData.HANDY2;
				if (form_id=="#select_player"){
					//alert(w_win + ":" + w_loose + ":" + w_get + ":"+ w_lost);
				    if (w_win==0 && w_loose==0 && w_get==0 && w_lost==0){
				    	if (game_type==5){
				    		//fujiyama
				    		if (getClass[0]==6 || getClass[1]==6){
				    			//unknown class include
				    			raceto[0] = class_handy[6];
				    			raceto[1] = class_handy[6];
				    		} else {
				    			var max = Math.max(getClass[0],getClass[1]);
				    			for (var i=0;i<2;i++){
				    				raceto[i] = class_handy[6-(max-getClass[i])];
				    			}
				    		}
				    	} else {
					        for (var i=0;i<2;i++){
					            raceto[i] = class_handy[getClass[i]];
					            $('#win_loss' + (i + 1)).text(msg[29]);
					        }
					    }
				    } else {
				        raceto[0] = parseInt(w_handy1,10);
				        raceto[1] = parseInt(w_handy2,10);
						$('#win_loss1').text(msg[20] + ':' + w_win + '  ' + msg[22] + ':' + w_get );
				    	$('#win_loss2').text(msg[20] + ':' + w_loose + '  ' + msg[22] + ':' + w_lost );

				    }

				    for (var num =1;num<=2;num++){
				        for ( var j=0;j<8;j++){
					        if (raceto[num-1]==$('#race_to' + num + '_' + j).text()){
					        	change_handy_select_player(num,j);
					        }
					    }
				    }
				} else {
					mnWin_work = w_win;
					mnLoose_work = w_loose;
					mnGet_work = w_get;
					mnLost_work = w_lost;
				}
			    break;
			case 15: 	//check exist data
				var jsonData = d; //JSON.parse(d);
				var param = new Array(jsonData.TECHNICAL_0, jsonData.TECHNICAL_1, jsonData.TECHNICAL_2,
									jsonData.VERSUS_0,jsonData.VERSUS_1,jsonData.VERSUS_2,
									jsonData.VERSUS_3,jsonData.VERSUS_4,jsonData.VERSUS_5,
									jsonData.VERSUS_6,jsonData.VERSUS_7,jsonData.VERSUS_8);

				for (var i=0; i<12; i++){
				    if (param[i]>0){
						$('#data_list_' + (3+i)).removeClass("hide");
					}
				}

			    break;
			case 16: 	//update player
			    if (d=='ok'){
				    playSound("nice");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
			    break;
			case 17:  	//get 14-1 data
			    var jsonData = eval(d);

				var culumns_STRAIGHT_POOL = new Array('DATE',msg[12],msg[13], msg[14],msg[15],msg[16]);
			    var width_STRAIGHT_POOL = new Array('15%', '22%', '8%', '23%','16%','16%');
			  	//fncShowJSON();
			    var i=0;
			    if (jsonData.length<=1){
			    	$('#table_data').text("データがありません");
			    	return;
			    }
				maxRows_data = jsonData.length-1;

		    	fncSetTable_data(width_STRAIGHT_POOL, culumns_STRAIGHT_POOL,maxRows_data+1);
				index_data = new Array(maxRows_data+1);
				for (var i=0;i<maxRows_data+1;i++){
					index_data[i] = jsonData[i].CD;
					$("td#data_" + i + "_0" ).text(jsonData[i].DATE);	//text(getDate(r.YEAR,r.MONTH,r.DAY));
					$("td#data_" + i + "_1" ).text(getDiv1(jsonData[i].SCORE,jsonData[i].INING) + "(" + getInt5(jsonData[i].SCORE,1) + "/"+ getInt5(jsonData[i].INING,1) +")");
					$("td#data_" + i + "_2" ).text(getInt3(jsonData[i].HIGH_RUN));
					$("td#data_" + i + "_3" ).text(getDiv3(jsonData[i].POCKET,jsonData[i].SHOOT) + "(" + getInt5(jsonData[i].POCKET) + "/"+ getInt5(jsonData[i].SHOOT) +")");
					$("td#data_" + i + "_4" ).text(getDiv2(jsonData[i].OK_BREAK,jsonData[i].BREAK) + "(" + jsonData[i].OK_BREAK + "/"+ jsonData[i].BREAK +")");
					$("td#data_" + i + "_5" ).text(getDiv2(jsonData[i].OK_SAFETY, jsonData[i].SAFETY) + "(" + jsonData[i].OK_SAFETY + "/"+ jsonData[i].SAFETY +")");
				}

				$("tr#data_tr_" + (maxRows_data)).addClass("total");



			    break;
			case 18:  	//get bowlard data
			    var jsonData = eval(d);

				var culumns_bowlard = new Array('DATE',msg[62],msg[63], msg[64], msg[14] );
			    var width_bowlard = new Array('16%','21%','21%', '21%', '21%' );
			  	//fncShowJSON();
			    var i=0;
			    if (jsonData.length<=1){
			    	$('#table_data').text("データがありません");
			    	return;
			    }
				maxRows_data = jsonData.length-1;

		    	fncSetTable_data(width_bowlard, culumns_bowlard,maxRows_data+1);
				index_data = new Array(maxRows_data+1);
				for (var i=0;i<maxRows_data+1;i++){
					index_data[i] = jsonData[i].CD;
					$("td#data_" + i + "_0" ).text(jsonData[i].DATE);	//text(getDate(r.YEAR,r.MONTH,r.DAY));
					$("td#data_" + i + "_1" ).text(getDiv0(jsonData[i].SCORE*10,jsonData[i].INING) + "(" + getInt5(jsonData[i].SCORE) + "/"+ getDiv1(jsonData[i].INING,10) +")");
					$("td#data_" + i + "_2" ).text(getDiv2(jsonData[i].STRIKE,jsonData[i].DIV_STRIKE)  + "(" + getInt5(jsonData[i].STRIKE) + "/"+ getInt5(jsonData[i].DIV_STRIKE) +")");
		        	$("td#data_" + i + "_3" ).text(getDiv2(jsonData[i].SPARE,jsonData[i].DIV_SPARE) + "(" + getInt5(jsonData[i].SPARE) + "/"+ getInt5(jsonData[i].DIV_SPARE) +")");
		        	$("td#data_" + i + "_4" ).text(getDiv3(jsonData[i].POCKET,jsonData[i].SHOOT) + "(" + getInt5(jsonData[i].POCKET) + "/"+ getInt5(jsonData[i].SHOOT) +")");
				}

				$("tr#data_tr_" + (maxRows_data)).addClass("total");

			    break;
			case 19:  	//get csrs data
			    var jsonData = eval(d);

				var culumns_csrs = new Array('DATE','Ave(SCORE/10GAME)','1pt(POCKET/SHOOT)', '2pt(POCKET/SHOOT)', 'Total(POCKET/SHOOT)' );
			    var width_csrs = new Array('16%','21%','21%', '21%', '21%' );
			  	//fncShowJSON();
			    var i=0;
			    if (jsonData.length<=1){
			    	$('#table_data').text("データがありません");
			    	return;
			    }
				maxRows_data = jsonData.length-1;

		    	fncSetTable_data(width_csrs, culumns_csrs,maxRows_data+1);
				index_data = new Array(maxRows_data+1);
				for (var i=0;i<maxRows_data+1;i++){
					index_data[i] = jsonData[i].CD;
		        	$("td#data_" + i + "_0" ).text(jsonData[i].DATE);
					$("td#data_" + i + "_1" ).text(getDiv0(jsonData[i].SCORE * 100,jsonData[i].INING) + "(" + getInt5(jsonData[i].SCORE) + "/"+ getDiv2(jsonData[i].INING,100) +")");
					$("td#data_" + i + "_2" ).text(getDiv3(jsonData[i].POCKET1, jsonData[i].SHOOT1) + "(" + getInt5(jsonData[i].POCKET1) + "/"+ getInt5(jsonData[i].SHOOT1) +")");
					$("td#data_" + i + "_3" ).text(getDiv3(jsonData[i].POCKET2, jsonData[i].SHOOT2) + "(" + getInt5(jsonData[i].POCKET2) + "/"+ getInt5(jsonData[i].SHOOT2) +")");
					$("td#data_" + i + "_4" ).text(getDiv3(jsonData[i].POCKET1 +jsonData[i].POCKET2,jsonData[i].SHOOT1 + jsonData[i].SHOOT2) + "(" + getInt5(jsonData[i].POCKET1 + jsonData[i].POCKET2) + "/"+ getInt5(jsonData[i].SHOOT1 + jsonData[i].SHOOT2) +")");

				}

				$("tr#data_tr_" + (maxRows_data)).addClass("total");

			    break;
			case 20:  	//get versus data
				//alert(d);

			    var jsonData = eval(d);

				culumns_VERSUS = new Array('DATE', 'VS','Class', msg[20], msg[21],msg[22],msg[23]  );
			   	width_VERSUS = new Array('15%', '25%', '12%','12%','12%','12%','12%');
			  	//fncShowJSON();
				if (jsonData.length<=1){
			    	$('#table_data').text("データがありません");
			    	return;
			    }
				maxRows_data = jsonData.length-1;
				//alert(maxRows_data);
		    	fncSetTable_data(width_VERSUS, culumns_VERSUS,maxRows_data+1);
				index_data = new Array(maxRows_data+1);
				for (var i=0;i<maxRows_data+1;i++){
					index_data[i] = jsonData[i].CD;
		        	//alert(i + ":" + index_data[i]);
					$("td#data_" + i + "_0" ).text(jsonData[i].DATE);
					$("td#data_" + i + "_1" ).text(jsonData[i].PLAYER2);
		            $("td#data_" + i + "_2" ).text(class_player[jsonData[i].CLASS]);
			        $("td#data_" + i + "_3" ).text(getDiv0(jsonData[i].WIN,1));
			        $("td#data_" + i + "_4" ).text(getDiv0(jsonData[i].LOOSE,1));
			        $("td#data_" + i + "_5" ).text(getDiv1(jsonData[i].GET,1));
			        $("td#data_" + i + "_6" ).text(getDiv1(jsonData[i].LOST,1));
				}

				$("tr#data_tr_" + (maxRows_data)).addClass("total");

			    break;
			case 21: 	//get versus table
				//alert("ok");
				var str;
				var jsonData = d; //JSON.parse(d);
				//alert("ok");
				var year = parseInt(jsonData.YEAR,10);
		        var month = parseInt(jsonData.MONTH,10);
		        var day = parseInt(jsonData.DAY,10);
		        if (year < 2000) { year += 1900; }
		        if (month < 10) { month = "0" + month; }
		    	if (day < 10) { day = "0" + day; }
		        str = year + "-" + month + "-" + day;

		        window.localStorage.setItem("editVersus_date" , str);
		        window.localStorage.setItem("editVersus_game" , jsonData.GAME);
		        window.localStorage.setItem("editVersus_cd" , jsonData.PLAYER1);
		        window.localStorage.setItem("editVersus_vscd" , jsonData.PLAYER2);
		        window.localStorage.setItem("editVersus_class1" , jsonData.CLASS1);
		        window.localStorage.setItem("editVersus_class2" , jsonData.CLASS2);
		        window.localStorage.setItem("editVersus_handy1" , jsonData.HANDY1);
		        window.localStorage.setItem("editVersus_handy2" , jsonData.HANDY2);
		        window.localStorage.setItem("editVersus_get" , jsonData.GET1);
		        window.localStorage.setItem("editVersus_lost" , jsonData.GET2);
		        window.localStorage.setItem("editVersus_win" , jsonData.WIN1);
		        window.localStorage.setItem("editVersus_loose" , jsonData.WIN2);

				break;
			case 22: 	// get 14-1 table

				var jsonData = d; //JSON.parse(d);
				var str;
				var year = parseInt(jsonData.YEAR,10);
		        var month = parseInt(jsonData.MONTH,10);
		        var day = parseInt(jsonData.DAY,10);
		        if (year < 2000) { year += 1900; }
		        if (month < 10) { month = "0" + month; }
		    	if (day < 10) { day = "0" + day; }
		        str = year + "-" + month + "-" + day;
		        window.localStorage.setItem("edit141_date" , str);
		        window.localStorage.setItem("edit141_player" , select_player_data);
		        window.localStorage.setItem("edit141_ining" , jsonData.INING);
		        window.localStorage.setItem("edit141_score" , jsonData.SCORE);
		        window.localStorage.setItem("edit141_high_run" , jsonData.HIGH_RUN);
		        window.localStorage.setItem("edit141_pocket" , jsonData.POCKET);
		        window.localStorage.setItem("edit141_shoot" , jsonData.SHOOT);
		        window.localStorage.setItem("edit141_break" , jsonData.BREAK);
		        window.localStorage.setItem("edit141_ok_break" , jsonData.OK_BREAK);
		        window.localStorage.setItem("edit141_safety" , jsonData.SAFETY);
		        window.localStorage.setItem("edit141_ok_safety" , jsonData.OK_SAFETY);
				break;
			case 23: 	// update versus
				if (d=='ok'){
                    playSound("update");
				} else {
					playSound("faul");
				}
				break;
			case 24: 	// update 14-1
				if (d=='ok'){
                    playSound("update");
				} else {
					playSound("faul");
				}
				break;
			case 25: 	// update bowlard
				if (d=='ok'){
                    playSound("update");
				} else {
					playSound("faul");
				}
				break;
			case 26: 	// get bowlard table
				var jsonData = d; //JSON.parse(d);
				var str;
				var year = jsonData.YEAR;
		        var month = jsonData.MONTH;
		        var day = jsonData.DAY;
		        if (year < 2000) { year += 1900; }
		        if (month < 10) { month = "0" + month; }
		    	if (day < 10) { day = "0" + day; }
		        str = year + "-" + month + "-" + day;
		        window.localStorage.setItem("editBowlard_date" , str);
		        window.localStorage.setItem("select_player_data" , select_player_data);
		        window.localStorage.setItem("editBowlard_ining" , jsonData.INING);
		        window.localStorage.setItem("editBowlard_score" , jsonData.SCORE);
		        window.localStorage.setItem("editBowlard_strike" , jsonData.STRIKE);
		        window.localStorage.setItem("editBowlard_spare" , jsonData.SPARE);
		        window.localStorage.setItem("editBowlard_shoot" , jsonData.SHOOT);
		        window.localStorage.setItem("editBowlard_pocket" , jsonData.POCKET);
				break;
			case 27: 	// get csrs table
				var jsonData = d; //JSON.parse(d);
				var str;
				var year = jsonData.YEAR;
		        var month = jsonData.MONTH;
		        var day = jsonData.DAY;
		        if (year < 2000) { year += 1900; }
		        if (month < 10) { month = "0" + month; }
		    	if (day < 10) { day = "0" + day; }
		        str = year + "-" + month + "-" + day;
		        window.localStorage.setItem("editCSRS_date" , str);
		        window.localStorage.setItem("select_player_data" , select_player_data);
		        window.localStorage.setItem("editCSRS_ining" , jsonData.INING);
		        window.localStorage.setItem("editCSRS_score" , jsonData.SCORE);
		        window.localStorage.setItem("editCSRS_shoot1" , jsonData.SHOOT1);
		        window.localStorage.setItem("editCSRS_pocket1" , jsonData.POCKET1);
		        window.localStorage.setItem("editCSRS_shoot2" , jsonData.SHOOT2);
		        window.localStorage.setItem("editCSRS_pocket2" , jsonData.POCKET2);
				break;
		    case 28: 	// update csrs
				if (d=='ok'){
                    playSound("update");
				} else {
					playSound("faul");
				}
				break;
			case 29: 	// delete player
				if (d=='ok'){
                    playSound("update");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
				break;
			case 30: 	// delete 14-1
				if (d=='ok'){
                    playSound("update");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
				break;
			case 31: 	// delete versus
				if (d=='ok'){
                    playSound("update");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
				break;
			case 32: 	// delete bowlard
				if (d=='ok'){
                    playSound("update");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
				break;
			case 33: 	// delete csrs
				if (d=='ok'){
                    playSound("update");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
				break;
			case 34: 	//update hall
			    if (d=='ok'){
				    playSound("nice");
				} else {
					alert(msg[47]);
					playSound("faul");
				}
			    break;
			case 35: 	//delete hall
			    if (d=='ok'){
				    playSound("nice");
				    if (property.COUNTRY == msCountry && property.AREA == mnArea && property.CD == mnHall){
				    	goto_page(0,"title.txt",true);
				    	show_welcome();
				    }
				} else {
					alert(msg[47]);
					playSound("faul");
				}
			    break;
			case 36: 	//get player password
				if (d=='ng'){
					playSound("faul");
			    	alert(msg[47]);
				    mnPlayerPass=-1;
				} else {
					var jsonData = d; //JSON.parse(d);

				    mnPlayerPass = jsonData.PASSWORD;
				    //msPlayerName = jsonData.NAME;
	            }
			    break;
			case 37: 	//update uuid
				if (d=='ng'){
					playSound("faul");
			    	alert(msg[47]);
				    mnPlayerPass=-1;
				    hidePopFrame();
				} else {
					playSound("nice");
					var wcd = window.localStorage.getItem('house_PlayerCd');
					if (wcd==null || wcd==""){
						alert(msg[96]);
						window.localStorage.setItem('house_PlayerCd', mnPlayer_temp);
					} else {
						alert(msg[97]);
						window.localStorage.setItem('house_PlayerCd', "");
					}
					hidePopFrame();
				    //msPlayerName = jsonData.NAME;
	            }
			    break;
			default:
			    break;
			}


			//$('.edit_mask').css("visibility","hidden");
			//$('#wait').css("visibility","hidden");

			//successCB_post_ok();

		},
		error:function(d){
			unwait();
			alert(msg[47]);
			goto_index();
			//$('#edit_mask').css("visibility","hidden");
			//$('#wait').css("visibility","hidden");
			//connect_error_post();
		}
	});
}

/*
		HALLS.insert(
		    {
				CD: json[i].CD,
				NAME: json[i].NAME,
				PASSWORD: json[i].PASSWORD,
				E_MAIL: json[i].E_MAIL,
				REGIST_DATE: json[i].REGIST_DATE,
				LIMIT_DATE: json[i].LIMIT_DATE,
				URL: json[i].URL
			}
		);

		BELONG.insert(
		    {
				PLAYER: json[i].PLAYER,
				HALL: json[i].HALL
			}
		);

		PLAYERS.insert(
		    {
				CD: json[i].CD,
				HALL: json[i].HALL,
				NAME: json[i].NAME,
				CLASS: json[i].CLASS,
				MEMO: json[i].MEMO,
				PASSWORD: json[i].PASSWORD,
				RATING: json[i].RATING,
				SEX: json[i].SEX,
				LAST_ACCESS: json[i].LAST_ACCESS,
				SEARCH_INDEX: null

			}
		);

		VERSUS.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				GAME: parseInt(json[i].GAME),
				PLAYER1: parseInt(json[i].PLAYER1),
				PLAYER2: parseInt(json[i].PLAYER2),
				HANDY1: null,
				HANDY2: null,
				CLASS1: null,
				CLASS2: null,
				RATING1: null,
				RATING2: null,
				GET1: parseInt(json[i].GET1),
				GET2: parseInt(json[i].GET2),
				WIN1: parseInt(json[i].WIN1),
				WIN2: parseInt(json[i].WIN2)
			}
		);

		STRAIGHT_POOL.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_RUN: null,
				POCKET: null,
				SHOOT: null,
				BREAK: null,
				OK_BREAK: null,
				SAFETY: null,
				OK_SAFETY: null
			}
		);

		BOWLARD.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_SCORE: null,
				STRIKE: null,
				DIV_STRIKE: null,
				SPARE: null,
				DIV_SPARE: null,
				POCKET: null,
				SHOOT: null
			}
		);

		CSRS.insert(
		    {
				CD: i,
				YEAR: null,
				MONTH: null,
				DAY: null,
				PLAYER: parseInt(json[i].PLAYER),
				INING: parseInt(json[i].INING),
				SCORE: null,
				HIGH_SCORE: null,
				POCKET1: null,
				SHOOT1: null,
				POCKET2: null,
				SHOOT2: null
			}
		);
*/
