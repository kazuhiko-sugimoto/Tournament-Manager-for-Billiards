var open = {};
var group;
var grpPlayer;
var df = [];
var lh = 40;
var vm;
var x_center;

/*

  $ionicModal.fromTemplateUrl('templates/pop_totalResult.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      open.modal_totalResult = modal;
  });
  $ionicModal.fromTemplateUrl('templates/pop_selectPlayer.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      open.modal_selectPlayer = modal;
  });
  $ionicModal.fromTemplateUrl('templates/pop_honsenResult_league.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      open.modal_honsenResult_league = modal;
  });
  $ionicModal.fromTemplateUrl('templates/pop_upload.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      open.modal_upload = modal;
  });

  $ionicHistory.clearHistory();

  angular.element($window).bind('orientationchange', function () {
  	open.$apply(changeOrientation)
});*/

///	///	///	///	///	///	///	///	///	///	/////				def						///
function open_tournament(from1, from2, player1, player2) {
	this.from1 = from1;
    this.from2 = from2;
    this.player1 = player1;
	this.player2 = player2;
}
function open_loc(x, y) {
	this.x = x;
    this.y = y;
}
function open_tree_def(player1, player2, from1, from2, x1, y1, x2, y2, zone, level, score1, score2, name1, name2){
    this.player1 = player1;
	this.player2 = player2;
	this.from1 = from1;
    this.from2 = from2;
    this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
    this.y2 = y2;
    this.zone = zone;
	this.level = level;
	this.score1 = score1;
	this.score2 = score2;
}
function open_entry_def(CD,NAME,SKILL,PLAY,RANK,HALL){
	this.CD =　CD;
	this.NAME =　NAME;
	this.SKILL =　SKILL;
	this.PLAY = PLAY;
	this.RANK = RANK;
	this.HALL = HALL;
}
function group_def(player, skill,　name){
	this.player = player;
	this.skill = skill;
	this.name = name;
}
function open_league_def(grp, no, player1, player2, score1, score2){
	this.grp = grp;
	this.no = no;
	this.player1 = player1;
	this.player2 = player2;
	this.score1 = score1;
	this.score2 = score2;
}
function rank_def(player,rank){
	this.player = player;
	this.rank = rank;
}
function result_def(win,loose, get, lost, get_all, lost_all, honsen){
	this.win = win;
	this.loose = loose;
	this.get = get;
	this.lost = lost;
	this.get_all = get_all;
	this.lost_all = lost_all;
	this.honsen = honsen;
}
function tab_def(ZONE,LEVEL,GRP,NO,PLAYER1, PLAYER2, NAME1, NAME2, HANDY1, HANDY2, HALL1, HALL2){
	this.ZONE = ZONE;
	this.LEVEL = LEVEL;
	this.GRP = GRP;
	this.NO = NO;
	this.PLAYER1 = PLAYER1;
	this.PLAYER2 = PLAYER2;
	this.NAME1 = NAME1;
	this.NAME2 = NAME2;
	this.HANDY1 = HANDY1;
	this.HANDY2 = HANDY2;
	this.HALL1 = HALL1;
	this.HALL2 = HALL2;
}
///	///	///	///	///	///	///	///	///	///	/////				設定変更					///
function init_open(){
	//format.init();
	vm = new Vue({
    el: '#open',
    data: {
      W: W,
      M: M,
      FORMAT: null,
      ENTRIES: null,
      isShowFin: false,
			isShowNav0: false,
			isShowNav1: false,
			isShowResult: false,
			isShowSettings: false,
			isShowShuffle: false,
			isShowOpen: false,
			isShowReset: false,
			isShowFootArea: false,
			table: [],
			grp: 0,
			nHistory: mnHistory,
			entryNum: 0,
			useTable: [true,true,true,true,true,true,true,true,true,true],
			tType: 0,
			isSingle: true,
			nIsHonsen: 0,
			colors: ["Royalblue","Crimson","Mediumorchid","Springgreen","Orange","Burlywood","hotpink","Yellowgreen","Mediumseagreen","Brown"]
    }
  });

	open.wTableNm = ["1","2","3","4","5","6","7","8","9","10"];
	var r = TABLE().first();
	var wTableEnabled;
	if (r){
		wTableEnabled = [r.TABLE1,r.TABLE2,r.TABLE3,r.TABLE4,r.TABLE5,r.TABLE6,r.TABLE7,r.TABLE8,r.TABLE9,r.TABLE10];
	} else {
		wTableEnabled = [true,true,true,true,true,true,true,true,true,true];
		TABLE.insert(
    {
			TABLE1: true,
			TABLE2: true ,
			TABLE3: true ,
			TABLE4: true ,
			TABLE5: true ,
			TABLE6: true ,
			TABLE7: true ,
			TABLE8: true ,
			TABLE9: true ,
			TABLE10: true
			}
		);
	}
	for (var i=0; i<10; i++){
		$('#open_lblTable'+i).text(open.wTableNm[i]);
		if (wTableEnabled[i]==true){
			open_setEnabledTable(i,true);
		} else {
			open_setEnabledTable(i,false);
		}
		$('#insideTable'+i).html("<br><br><br>");
	}

	canvas =document.getElementById('canvas');
  context =canvas.getContext('2d');

	open_refresh();



}
function open_refresh(){
	var entries = [];
  ENTRY({T_CD:{'==':t_cd}}).each(function (r) {
     entries.push({
       CD: r.CD,
       NAME: r.NAME,
       SKILL: r.SKILL,
       HALL: r.HALL,
       Y_HANDY: r.Y_HANDY,
       H_HANDY: r.H_HANDY,
       AM_PM: r.AM_PM,
       RANK: r.RANK
     })
  });
	vm.ENTRIES = entries;

	format.init();
	vm.FORMAT = format.vm;
	vm.isShowFin = false;
	vm.isShowNav0 =  false;
	vm.isShowNav1 = false;
	vm.isShowResult = false;
	vm.isShowSettings = false;
	vm.isShowShuffle = false;
	vm.isShowOpen = false;
	vm.isShowReset = false;
	vm.isShowFootArea = false;

	open.treeFormat = [];
	open.tree = [];
	open.league = [];
	open.line = [];
	vm.table_check = []; //new Array(128);
	open.selectTab = null;
	vm.tableInfo = []; //new Array(10);
	vm.grpRank = [];	//グループ内順位
	//open.isFin = false;	//リーグ予選主終了
	vm.grp = 0; 	//リーグ戦選択グループ
	open.result = [];
	if ((vm.FORMAT.STATUS==0 && vm.FORMAT.Y_TYPE==0) || (vm.FORMAT.STATUS>=2)){
		vm.nIsHonsen = 1;
	} else {
		vm.nIsHonsen = 0;
	}
	//open_getEntryData();

	open_get_entryNum();

	open_switch_nav(vm.nIsHonsen);

	changeLayout();
}
function open_get_entryNum(){
	if (vm.nIsHonsen==0){
		vm.entryNum = vm.ENTRIES.length;
	} else {
		vm.entryNum = 0;
		for (var i=0; i<vm.ENTRIES.length; i++){
			if (vm.ENTRIES[i].RANK==null){
				vm.entryNum++;
			}
		}
	}
	lh = ((20*40)/vm.ENTRIES.length);
	if (lh<40) lh=40;
	/*var b_height = getBrowserHeight();
	lh = ((b_height-40)/vm.ENTRIES.length)*1.5;
	if (lh<40) lh=40;
	var w_height = vm.ENTRIES.length*lh+40;
	var w_height2 = w_height*1000/2200;
	$('#canvas').attr("height",w_height).css("height",w_height2);
	$('#win_zone').css("height",w_height2);
	$('#lose_zone').css("height",w_height2);
	$('#open_tournament').css("height",w_height2);
	open.tournament_height=w_height2*1.7;*/
}
//予選/本戦の切り替え、トーナメント表/リーグ表の初期設定
function open_switch_nav(num){

	vm.nIsHonsen = num;
	open_get_entryNum();

	var wHonsen = 1;

	if (vm.nIsHonsen==1){
		//予選なし
		vm.tType = parseInt(vm.FORMAT.H_TYPE);
		open.groups =1;
	} else {
		vm.tType = parseInt(vm.FORMAT.Y_TYPE);
		switch (vm.FORMAT.Y_TYPE) {
		case 1:
			wHonsen = parseInt(vm.FORMAT.H_NUMBER)*2;
			break;
		case 2:
		case 3:
			wHonsen = parseInt(vm.FORMAT.H_NUMBER);
			break;
		default:
			open.groups = parseInt(vm.FORMAT.Y_GROUPS);
			break;
		}
	}

	if (vm.tType==1){
		vm.isSingle = true;
	} else {
		vm.isSingle = false;
	}
	if (vm.tType==0){

	} else if (vm.tType!=4) {
		if ((vm.FORMAT.STATUS==0 && (vm.nIsHonsen==0 || (vm.nIsHonsen==1 && vm.FORMAT.Y_TYPE==0))) || (vm.FORMAT.STATUS==2 && vm.nIsHonsen==1)){
			open_initTreeTable();
			open_setTreeTable(wHonsen);

		} else {
			open_resetInGame();
		}
		open_showTreeTable();

	} else {
		if ((vm.FORMAT.STATUS==0 && (vm.nIsHonsen==0 || (vm.nIsHonsen==1 && vm.FORMAT.Y_TYPE==0))) || (vm.FORMAT.STATUS==2 && vm.nIsHonsen==1)){
			open_setLeagueTable();
		} else {
			open_resetInGame();
			//getData( "open/resetInGame", {type: vm.tType, cd: t_cd, honsen: vm.nIsHonsen}, fncNone,false );
			showLeagueTable();
		}
	}
}
//画面の表示/非表示
function changeLayout(){
	$("#t_condition").text("参加人数:" + vm.ENTRIES.length+"人");

	if ((vm.FORMAT.Y_TYPE==0 && (vm.FORMAT.STATUS!=0 && vm.FORMAT.STATUS!=2)) || vm.ENTRIES.length<8){
		vm.isShowNav0 = false;
	} else {
		vm.isShowNav0 = true;
	}

	if (vm.FORMAT.STATUS>=2 || vm.FORMAT.Y_TYPE==0 ){
		vm.isShowNav1 = true;
	} else {
		vm.isShowNav1 = false;
	}
	if (vm.FORMAT.STATUS==4 || open.nHistory==1){
		vm.isShowResult = true;
	} else {
		vm.isShowResult = false;
	}
	if (((vm.nIsHonsen==0 && (vm.FORMAT.STATUS>2 ||(vm.FORMAT.STATUS==2 && vm.FORMAT.Y_TYPE!=0))) || ( vm.nIsHonsen==1 && vm.FORMAT.STATUS<2)) && (vm.nIsHonsen!=1 || vm.FORMAT.STATUS!=0 || vm.FORMAT.Y_TYPE!=0)){
		vm.isShowSettings = false;
    vm.isShowShuffle = false;
    vm.isShowOpen =false;
    vm.isShowReset = true;
	} else {

		if (vm.FORMAT.STATUS!=0 && vm.FORMAT.STATUS!=2){
			vm.isShowShuffle = false;
			vm.isShowOpen =false;
			vm.isShowSettings = false;
			vm.isShowReset = true;
			if (vm.FORMAT.STATUS==4){
				//vm.isShowFootArea = false; //dispHide("#open_footArea");
			} else {
				//vm.isShowFootArea = true; //dispShow("#open_footArea");
			}
		} else {
			vm.isShowShuffle = true;
			vm.isShowOpen =true;
			vm.isShowReset = false;
			if (open.nHistory==0){
				vm.isShowSettings = true;
			} else {
				vm.isShowSettings = false;
			}
		}
	}
}
function open_resetInGame(){
	if (vm.tType!=4){
		TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':0},SCORE2:{'==':0}}).update({
	    	SCORE1:null,
			SCORE2:null
		});
	} else {
		LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':0},SCORE2:{'==':0}}).update({
	    	SCORE1:null,
			SCORE2:null
		});
	}
}
///	///	///	///	///	///	///	///	///	///	/////				on-tap					///
function open_click_open(){
	//tStatus = 0;
	vm.isShowFootArea = true;
	if (vm.nIsHonsen==0){
		vm.FORMAT.STATUS = 1;
	} else {
		vm.FORMAT.STATUS = 3;
	}
	FORMAT({CD:{'==':t_cd}}).update({
		STATUS:vm.FORMAT.STATUS
	});
	//intel.xdk.player.playSound("sounds/thinking2.mp3");
	openingPop_show();
	//$.ui.loadContent("#page_openpop",false,false,"fade");
	changeLayout();
}
//予選・本戦切り替え
function open_click_nav(num){
	vm.nIsHonsen = num;
	vm.nIsHonsen = num;
	open_get_entryNum();
	open_switch_nav(num);
	changeLayout();
}
//リセット
function open_click_tReset(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	var s="";
	if (vm.nIsHonsen==0){
		s=W[2];
	} else {
		s=W[15];
	}
	if (confirm(vm.FORMAT.NAME + ":" + s + M[7])){
		open_proc_tReset();
	}
}
function open_proc_tReset(){
	//intel.xdk.player.playSound("sounds/info.mp3");
	var status;
	if (vm.nIsHonsen==0 || vm.FORMAT.Y_TYPE==0){
		status = 0;
	} else {
		status = 2;
	}
	var wHonsenNum;
	if (vm.FORMAT.Y_TYPE==0){
		wHonsenNum = vm.ENTRIES.length;
	} else {
		wHonsenNum = vm.FORMAT.H_NUMBER;
	}

	FORMAT({CD:{'==':t_cd}}).update({
		STATUS:status
	});
	if (vm.nIsHonsen==0){
		ENTRY({T_CD:{'==':t_cd}}).update({
			RANK:null
		});
		if (vm.tType!=4){
			TREE({T_CD:{'==':t_cd}}).remove();
		} else {
			LEAGUE({T_CD:{'==':t_cd}}).remove();
		}
	} else {
		ENTRY({T_CD:{'==':t_cd}, RANK:{'<=':wHonsenNum}}).update({
			RANK:null
		});
		if (vm.tType!=4){
			TREE({T_CD:{'==':t_cd}, HONSEN:{'==':1}}).remove();
		} else {
			LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':1}}).remove();
		}
	}

	if (open.nHistory==0){
		init_open();
		//open.modal_navOpen.hide();
		//location.href="#/open";
	} else {
		//open.modal_navOpen.hide();
		gotoHome();

	}
	//getData( "open/resetTournament", {type: vm.tType, cd: t_cd, honsen: vm.nIsHonsen, h_number: wHonsenNum}, suucessFnc_open_proc_tReset,true );
}
function open_click_shuffle(){
	if (vm.nIsHonsen==1){
		switch (vm.FORMAT.H_TYPE) {
		case 1:
			open_initTreeTable();
			open_setTreeTable(1);
			open_showTreeTable();
			break;
		case 2:
		case 3:
			open_initTreeTable();
			open_setTreeTable(1);
			open_showTreeTable();
			break;
		default:
			open_setLeagueTable();
			showLeagueTable();
			break;
		}
	} else {
		switch (vm.FORMAT.Y_TYPE) {
		case 1:
			open_initTreeTable();
			open_setTreeTable(parseInt(vm.FORMAT.H_NUMBER)*2);
			open_showTreeTable();
			break;
		case 2:
		case 3:
			open_initTreeTable();
			open_setTreeTable(parseInt(vm.FORMAT.H_NUMBER));
			open_showTreeTable();
			break;
		default:
			open_setLeagueTable();
			showLeagueTable();
			break;
		}
	}
}
function open_click_undoGame(){
	popup_show({
		name: "undoGame",
    title: W[48],
    width: "600px",
		callback: undoGamePop_callback
	});
}
function undoGamePop_callback(){
	var undoLists = [];
	if (vm.tType!=4){

		TREE({
				T_CD:{'==':t_cd}
				,HONSEN:{'==':vm.nIsHonsen}
		}).each(function (r) {
			if ((r.SCORE1!=null && r.SCORE1!=0) || (r.SCORE2!=null && r.SCORE2!=0)){
				var flg = true;
				var r2 = TREE({
						T_CD:{'==':t_cd}
						,HONSEN:{'==':vm.nIsHonsen}}
						,[{FROM1:{'==':r.NO}}, {FROM2:{'==':r.NO}}]
					).first();
				if (r2){
					if (r2.SCORE1!=null){
						flg = false;
					}
				}
				if (flg){
					var player1 = r.PLAYER1;
					var player2 = r.PLAYER2;
					var score1 = r.SCORE1;
					var score2 = r.SCORE2;
					var handy1 = open_getHandy(r.PLAYER1);
					var handy2 = open_getHandy(r.PLAYER2);
					if (open_getWinner(score1,score2,handy1,handy2)==1){
						score1 = "W";
					} else {
						score2 = "W";
					}

					undoLists.push({
						no: r.NO,
						level: getTournamentLevel_proc(r.LEVEL,r.ZONE),
						player1: vm.ENTRIES[player1].NAME,
						player2: vm.ENTRIES[player2].NAME,
						handy1: handy1,
						handy2: handy2,
						score1: score1,
						score2: score2,
						memo1: vm.ENTRIES[r.PLAYER1].HALL,
						memo2: vm.ENTRIES[r.PLAYER2].HALL
					});
				}
			}
		});
	} else {
		LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}}).each(function (r) {
			if ((r.SCORE1!=null && r.SCORE1!=0) || (r.SCORE2!=null && r.SCORE2!=0)){
				var player1 = r.PLAYER1;
				var player2 = r.PLAYER2;
				var score1 = r.SCORE1;
				var score2 = r.SCORE2;
				var handy1 = open_getHandy(r.PLAYER1);
				var handy2 = open_getHandy(r.PLAYER2);
				if (open_getWinner(score1,score2,handy1,handy2)==1){
					score1 = "W";
				} else {
					score2 = "W";
				}
				if (player1!=null && player2!=null){
				   /*s+="<a style='background:lightcoral' onclick='open_click_undoLeagueList(" + r.GRP + "," + r.NO + ")'>";
				   s+="GROUP:" + (parseInt(r.GRP)+1) + " ";
				   s+= vm.ENTRIES[player1].NAME + " " + r.SCORE1 + " - " + r.SCORE2 + " " + vm.ENTRIES[player2].NAME + "</a>";*/
					undoLists.push({
						no: r.GRP*100 + r.NO,
						level: "Group" + (r.GRP+1),
						player1: vm.ENTRIES[player1].NAME,
						player2: vm.ENTRIES[player2].NAME,
						handy1: handy1,
						handy2: handy2,
						score1: score1,
						score2: score2,
						memo1: vm.ENTRIES[r.PLAYER1].HALL,
						memo2: vm.ENTRIES[r.PLAYER2].HALL
					});
				}
			}
		});
	}
	new Vue({
		el: '#undoGame',
		data: {
			undoLists: undoLists
		}
	})
}
function open_click_Fin(){
	////intel.xdk.player.playSound("sounds/confirm.mp3");

	if (vm.FORMAT.STATUS==1){
		open_click_yFin();
	} else {
		open_click_hFin();
	}
}
//click yFin
function open_click_yFin(){
	if (confirm(M[8])){
		open_proc_click_yFin();
	}
}
function open_proc_click_yFin(){
	var wRankList = [];
	var wLevel = 0;
	var wRank;
	var wWinner;
	var wLooser;
	switch (vm.tType){
	case 1:
		for (var i=open.tree.length-1; i>0; i--){
			if (open.tree[i].level!=wLevel){
				wRank = vm.ENTRIES.length - i + 1;
				wLevel = open.tree[i].level;
			}
			var wHandy1 = open_getHandy(open.tree[i].player1);
			var wHandy2 = open_getHandy(open.tree[i].player2);
			var winner = open_getWinner(open.tree[i].score1,open.tree[i].score2,wHandy1,wHandy2);
			if (winner==1){
				wLooser = open.tree[i].player2;
			} else {
				wLooser = open.tree[i].player1;
			}
			wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, wRank);
		}
		break;
	case 2:
	case 3:
		wRank = parseInt(vm.FORMAT['H_NUMBER']) + 1;
		var tmpRank = wRank;
		for (var i=open.tree.length-1; i>0; i--){
			if (open.tree[i].zone==1){
				if (open.tree[i].level!=wLevel){
					wRank = tmpRank;
					wLevel = open.tree[i].level;
				}
				var wHandy1 = open_getHandy(open.tree[i].player1);
				var wHandy2 = open_getHandy(open.tree[i].player2);
				var winner = open_getWinner(open.tree[i].score1,open.tree[i].score2,wHandy1,wHandy2);
				if (winner==1){
					wLooser = open.tree[i].player2;
				} else {
					wLooser = open.tree[i].player1;
				}
				wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, wRank);
				tmpRank++;
			}
		}
		break;

	case 4:
		var badGroup = showBtnResultLeague();
		if (badGroup!=0){
			alert("Group"+badGroup + M[15]);
			vm.grp = badGroup-1;
			return;
		}

		wRank = parseInt(vm.FORMAT['H_NUMBER']) + 1;
		var wchk = [];
		for (var j=0; j<open.result.length; j++){
			wchk[j] = false;
		}
		var saveMax = 0;

		for (var j=0; j<open.result.length-parseInt(vm.FORMAT['H_NUMBER']); j++){
			var wMax = -1;
			var wMaxPlayer = -1;
			for (var k=0; k<open.result.length; k++){
				if (wchk[k] == false && open.result[k].honsen==0){
					var wValue = ((open.result[k].win / (open.result[k].win + open.result[k].loose)*1000)*1000000 + ( open.result[k].get/ open.result[k].get_all*1000)*1000 + ( 1000- open.result[k].lost/ open.result[k].lost_all*1000));
					if (wMax<wValue){
						wMaxPlayer = k;
						wMax = wValue;
					}
				}
			}
			wchk[wMaxPlayer] = true;
			if (saveMax!=wMax){
				wRank = j+1+parseInt(vm.FORMAT['H_NUMBER']);
				saveMax = wMax;
			}
			wRankList[wMaxPlayer] = new rank_def(vm.ENTRIES[wMaxPlayer].CD, wRank);
		}
		break;
	}

	//getData( "open/fin", {data: wRankList, cd:t_cd, honsen: vm.nIsHonsen,grade: grade}, suucess_open_click_yFin,false );
	//intel.xdk.player.playSound("sounds/info.mp3");
	open_setRanking(wRankList);
	vm.nIsHonsen=1;
	//init_open();
	open_refresh();

}
function suucess_open_click_yFin(d){
	 template_change();
}
//click hFin
function open_click_hFin(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	if (confirm(M[9])){
		open_proc_click_hFin();
	}
}
function open_proc_click_hFin(){
	//intel.xdk.player.playSound("sounds/confirm.mp3");
	var wRankList = [];
	var wLevel = 0;
	var wZone=0;
	var wRank;
	var wWinner;
	var wLooser;
	switch (vm.tType){
	case 1:
		var fourth=-1;
		for (var i=open.tree.length-1; i>0; i--){

			if (open.tree[i].level!=wLevel || open.tree[i].zone!=wZone ){
				wRank = vm.entryNum - i + 1;
				wLevel = open.tree[i].level;
				wZone = open.tree[i].zone;
			}
			var score1 = open.tree[i].score1;
			var score2 = open.tree[i].score2;
			var handy1 = open_getHandy(open.tree[i].player1);
			var handy2 = open_getHandy(open.tree[i].player2);
			var winner = open_getWinner(score1,score2,handy1,handy2);
			if (winner==1){
				wWinner = open.tree[i].player1;
				wLooser = open.tree[i].player2;
			} else {
				wWinner = open.tree[i].player2;
				wLooser = open.tree[i].player1;
			}
			if (open.tree[i].zone==2){
				//決勝
				wRankList[wWinner] = new rank_def(vm.ENTRIES[wWinner].CD, 1);
				wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, 2);
			} else if (open.tree[i].zone==4){
				//3位決定戦
				fourth = wLooser;
			} else {
				wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, wRank);
			}
		}
		if (fourth>=0){
			wRankList[fourth] = new rank_def(vm.ENTRIES[fourth].CD, 4);
		}
		break;
	case 2:
	case 3:
		wRank = 1;
		var tmpRank = wRank;
		for (var i=open.tree.length-1; i>0; i--){
			if (open.tree[i].zone!=0 && open.tree[i].player2!=null){
				if (open.tree[i].level!=wLevel){
					wRank = tmpRank;
					wLevel = open.tree[i].level;
				}
				var score1 = open.tree[i].score1;
				var score2 = open.tree[i].score2;
				var handy1 = open_getHandy(open.tree[i].player1);
				var handy2 = open_getHandy(open.tree[i].player2);
				var winner = open_getWinner(score1,score2,handy1,handy2);
				if (winner==1){
					wWinner = open.tree[i].player1;
					wLooser = open.tree[i].player2;
				} else {
					wWinner = open.tree[i].player2;
					wLooser = open.tree[i].player1;
				}
				if (open.tree[i].zone==2){
					//決勝
					wRankList[wWinner] = new rank_def(vm.ENTRIES[wWinner].CD, 1);
					wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, 2);
					tmpRank=3;
				} else if (open.tree[i].zone==3){
					//プレーオフ
					wRankList[wWinner] = new rank_def(vm.ENTRIES[wWinner].CD, 1);
					wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, 2);
					tmpRank=3;
					i--;
				} else {
					wRankList[wLooser] = new rank_def(vm.ENTRIES[wLooser].CD, wRank);
					tmpRank++;
				}


			}
		}
		break;

	case 4:
		wRank = 1;
		var wchk = [];
		for (var j=0; j<open.result.length; j++){
			wchk[j] = false;
		}
		var saveMax = 0;

		for (var j=0; j<vm.entryNum; j++){
			var wMax = -1;
			var wMaxPlayer = -1;
			for (var k=0; k<open.result.length; k++){

				if (wchk[k] == false && open.result[k].honsen==1){
					var wValue = ((open.result[k].win / (open.result[k].win + open.result[k].loose)*1000)*1000000 + ( open.result[k].get/ open.result[k].get_all*1000)*1000 + ( 1000- open.result[k].lost/ open.result[k].lost_all*1000));

					if (wMax<wValue){
						wMaxPlayer = k;
						wMax = wValue;
					}
				}
			}
			wchk[wMaxPlayer] = true;
			if (saveMax!=wMax){
				wRank = j+1;
				saveMax = wMax;
			}
			wRankList[wMaxPlayer] = new rank_def(vm.ENTRIES[wMaxPlayer].CD, wRank);

		}
		break;
	}

	//getData( "open/fin", {data: wRankList, cd:t_cd, honsen: vm.nIsHonsen, grade: grade}, suucess_open_click_hFin,false );
	open_setRanking(wRankList);
	//dispHide('#open_fin');
	vm.isShowFin = false;
	vm.isShowResult=true;
	vm.isShowFootArea = false;
	open_click_showTotalResult();

}
function open_setRanking(list){
	console.debug(list);
	var wstatus;
	if (vm.nIsHonsen==0){
		wstatus = 2;
	} else {
		wstatus = 4;
	}
	var date = getDateStr(new Date());
	FORMAT({CD:{'==':t_cd}}).update({
		STATUS:wstatus,
		DATE: date
	});
	for (var i=0; i<list.length; i++){
		if (list[i]){
			ENTRY({T_CD:{'==':t_cd}, CD:{'==':list[i].player}}).update({
				RANK:list[i].rank
			});
		}
	}
	vm.FORMAT.STATUS = wstatus;
}
function open_click_showTotalResult(){
	popup_show({
		name: "totalResult",
    title: W[40],
    width: "600px",
		callback: totalResultPop_callback
	});
}
function totalResultPop_callback(){
	var list = [];
	ENTRY({T_CD:{'==':t_cd}}).order("RANK").each(function (r) {
		list.push({
			rank: r.RANK ,
			name: r.NAME
		})
	});
	new Vue({
		el: '#totalResult',
		data: {
			items: list
		}
	})
}
function click_grp(index){
	vm.grp = index;
}
///	///	///	///	///	///	///	///	///	///	/////				footer table関連			///
function open_setEnabledTable(num,flg){
	vm.useTable[num] = flg;
	if (flg==true){
		////intel.xdk.player.playSound("sounds/select.mp3");
		$('#table'+num).removeClass("none");
	} else {
		////intel.xdk.player.playSound("sounds/error.mp3");
		$('#table'+num).addClass("none");
	}
	TABLE().update({
		TABLE1:vm.useTable[0],
		TABLE2:vm.useTable[1] ,
		TABLE3:vm.useTable[2] ,
		TABLE4:vm.useTable[3] ,
		TABLE5:vm.useTable[4] ,
		TABLE6:vm.useTable[5] ,
		TABLE7:vm.useTable[6] ,
		TABLE8:vm.useTable[7] ,
		TABLE9:vm.useTable[8] ,
		TABLE10:vm.useTable[9]
	})
}
function hold_tableTab(){
	num = open.selectTab;
	if (vm.useTable[num]==false){

		open_setEnabledTable(num,true);
		alert(M[10]);
	} else {
		if (vm.tableInfo[num]) return;
		open_click_disabledTable(num);
		//alert(M[11]);
		popup_hide("selectGame");
	}
}
function open_click_tableTab(num){
	//intel.xdk.player.playSound("sounds/select.mp3");
	open.selectTab = num;
	if (vm.tableInfo[open.selectTab]){
		//試合結果入力
		//showPopFrame("open/setResult",{}, 450, success_open_click_tableTab, true, "試合結果");
		open_showPop_setResult();

	} else {
		if (vm.useTable[num]){
			//試合セット
			//property = {cd:t_cd, honsen:vm.nIsHonsen, proc:"show"};
			//showPopFrame("open/nextList",{type:vm.tType, cd:t_cd, honsen:vm.nIsHonsen, proc:"show"},450, suucessFnc_open_click_tableTab, true, "試合選択");
			open_showPop_nextList();
		} else {
			hold_tableTab();
		}
	}
}
function open_click_disabledTable(num){
	open_setEnabledTable(num,false);
}
function open_click_auto(){
	//intel.xdk.player.playSound("sounds/switch.mp3");
	//getData("open/getAuto", {type: vm.tType, cd:t_cd, honsen:vm.nIsHonsen}  , suucessFnc_clickAuto,true );
	var jsonData = [];
	var i=0;
	if (vm.tType!=4){
		TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':null}, SCORE2:{'==':null}}).order("NO asec").each(function (r) {
			if (r.PLAYER1!=null && r.PLAYER2!=null){
				jsonData[i] = r;
				i++;
			}
		});
	} else {
		//LEAGUE().order("NO asec, GRP asec");
		LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':null}, SCORE2:{'==':null}}).order("NO asec, GRP asec").each(function (r) {
			if (r.PLAYER1!=null && r.PLAYER2!=null && vm.ENTRIES[r.PLAYER1].PLAY==null && vm.ENTRIES[r.PLAYER2].PLAY==null) {
				var flg = false;
				for (var j=0; j<i; j++){
					if (jsonData[j].PLAYER1==r.PLAYER1 || jsonData[j].PLAYER2==r.PLAYER1 ||
						jsonData[j].PLAYER1==r.PLAYER2 || jsonData[j].PLAYER2==r.PLAYER2){
						flg = true;
						break;
					}
				}
				if (flg==false){
					jsonData[i] = r;
					i++;
				}
			}
		});
	}
	if (i==0){
		return;
	}

	open.autoLists = [];
	var j=0;
	for (var i=0; i<10; i++){
		if (vm.useTable[i] && !vm.tableInfo[i]){
			var no = jsonData[j].NO;
			open.selectTab = i;
			if (vm.tType!=4){
				open_setTreeTab(no);
				open.autoLists.push({
					tabNo: open.selectTab,
					level: getTournamentLevel(open.selectTab),
					player1: vm.tableInfo[open.selectTab].NAME1,
					player2: vm.tableInfo[open.selectTab].NAME2,
					handy1: vm.tableInfo[open.selectTab].HANDY1,
					handy2: vm.tableInfo[open.selectTab].HANDY2,
					memo1: vm.tableInfo[open.selectTab].HALL1,
					memo2: vm.tableInfo[open.selectTab].HALL2
				});
				//getData("open/setGameStart", {type: vm.tType, cd:t_cd, honsen:vm.nIsHonsen, no:jsonData[j].NO}  , suucessFnc_none, false );
			} else {
				var grp = jsonData[j].GRP;
				open_setLeagueTab(grp,no);
				open.autoLists.push({
					tabNo: open.selectTab,
					level: "Group" + (vm.tableInfo[open.selectTab].GRP+1),
					player1: vm.tableInfo[open.selectTab].NAME1,
					player2: vm.tableInfo[open.selectTab].NAME2,
					handy1: vm.tableInfo[open.selectTab].HANDY1,
					handy2: vm.tableInfo[open.selectTab].HANDY2,
					memo1: vm.tableInfo[open.selectTab].HALL1,
					memo2: vm.tableInfo[open.selectTab].HALL2
				});
				//getData("open/setGameStart", {type: vm.tType, cd:t_cd, honsen:vm.nIsHonsen, group:jsonData[j].GRP, no:jsonData[j].NO}  , suucessFnc_none, false );
			}
			j++;
			if (j>=jsonData.length){
				break;
			}
		}
	}
	if (vm.tType!=4){
		open_showTreeTable();
	} else {
		showLeagueTable();
	}
	popup_show({
		name: "showAutoList",
    title: "New Games List",
    width: "600px",
		callback: showAutoList_callback
	});
}
function showAutoList_callback(){
	new Vue({
		el: '#showAutoList',
		data: {
			autoLists: open.autoLists,
			colors: vm.colors
		}
	})
}
function footClass(num){
	if (vm.useTable[num]){
		if (vm.tableInfo[num]){
			return "ion-record";
		} else {
			return "ion-android-radio-button-off";
		}
	} else {
		return "ion-android-remove";
	}
}
function open_setTreeTab(no){

	TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, NO:{'==':no}}).update({
    	SCORE1:0,
		SCORE2:0
	});

	var r = TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, NO:{'==':no}}).first();

	var name1 = vm.ENTRIES[r.PLAYER1].NAME;
	var name2 = vm.ENTRIES[r.PLAYER2].NAME;
	var handy1 = open_getHandy(r.PLAYER1);
	var handy2 = open_getHandy(r.PLAYER2);
	var hall1 = vm.ENTRIES[r.PLAYER1].HALL;
	var hall2 = vm.ENTRIES[r.PLAYER2].HALL;

	vm.tableInfo[open.selectTab] =new tab_def(r.ZONE,r.LEVEL,null,no,r.PLAYER1, r.PLAYER2, name1, name2, handy1, handy2, hall1, hall2);

  var compiled = _.template($('#template_tab').html());
  $('#insideTable'+open.selectTab).html(compiled({tab: vm.tableInfo[open.selectTab]}));
	//open_showTabInfo(open.selectTab);
	vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER1].PLAY = open.selectTab;
	vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER2].PLAY = open.selectTab;
}
function open_setLeagueTab(grp,no){
	LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, GRP:{'==':grp},NO:{'==':no}}).update({
    	SCORE1:0,
		SCORE2:0
	});
	var r = LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, GRP:{'==':grp}, NO:{'==':no}}).first();
	var name1 = vm.ENTRIES[r.PLAYER1].NAME;
	var name2 = vm.ENTRIES[r.PLAYER2].NAME;
	var handy1 = open_getHandy(r.PLAYER1);
	var handy2 = open_getHandy(r.PLAYER2);
	var hall1 = vm.ENTRIES[r.PLAYER1].HALL;
	var hall2 = vm.ENTRIES[r.PLAYER2].HALL;

	vm.tableInfo[open.selectTab] =new tab_def(null,null,grp,no,r.PLAYER1, r.PLAYER2, name1, name2, handy1, handy2, memo1, memo2);
	//open_showTabInfo(open.selectTab);
	var compiled = _.template($('#template_tab').html());
  $('#insideTable'+open.selectTab).html(compiled({tab: vm.tableInfo[open.selectTab]}));

	vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER1].PLAY = open.selectTab;
	vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER2].PLAY = open.selectTab;
}
function open_showPop_nextList(){
	popup_show({
		name: "selectGame",
    title: "Select Game",
    width: "600px",
		callback: selectGamePop_callback
	});
}
function selectGamePop_callback(){
	var s="";
	var gameLists = [];
	if (vm.tType!=4){
		var line=0;

		TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':null}, SCORE2:{'==':null}}).order("NO asec").each(function (r) {
			var player1 = r.PLAYER1;
			var player2 = r.PLAYER2;
			if (player1!=null && player2!=null){
				gameLists.push({
					no: r.NO,
					level: getTournamentLevel_proc(r.LEVEL,r.ZONE),
					player1: vm.ENTRIES[player1].NAME,
					player2: vm.ENTRIES[player2].NAME,
					handy1: open_getHandy(r.PLAYER1),
					handy2: open_getHandy(r.PLAYER2),
					memo1: vm.ENTRIES[r.PLAYER1].HALL,
					memo2: vm.ENTRIES[r.PLAYER2].HALL
				});
				line++;
			}
		});
	} else {
		var line=0;
		LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}, SCORE1:{'==':null}, SCORE2:{'==':null}}).order("NO asec, GRP asec").each(function (r) {
			var player1 = r.PLAYER1;
			var player2 = r.PLAYER2;
			if (player1!=null && player2!=null){
				if (vm.ENTRIES[r.PLAYER1].PLAY==null && vm.ENTRIES[r.PLAYER2].PLAY==null){
				   s+="<a style='background:lavender' onclick='open_click_nextLeagueList(" + r.GRP + "," + r.NO + ")'>";
				   s+="GROUP:" + (parseInt(r.GRP)+1) + " ";
				   s+= vm.ENTRIES[player1].NAME + " vs " + vm.ENTRIES[player2].NAME + "</a>";
				   line++;
				   gameLists.push({
						no: r.GRP*100 + r.NO,
						level: "Group" + (r.GRP+1),
						player1: vm.ENTRIES[player1].NAME,
						player2: vm.ENTRIES[player2].NAME,
						handy1: open_getHandy(r.PLAYER1),
						handy2: open_getHandy(r.PLAYER2),
						memo1: vm.ENTRIES[r.PLAYER1].HALL,
						memo2: vm.ENTRIES[r.PLAYER2].HALL
					});
					line++;
				}
			}
		});
	}
	new Vue({
		el: '#selectGame',
		data: {
			gameLists: gameLists,
			W: W
		}
	})
}
///	///	///	///	///	///	///	///	///	///	/////				Taffy DB関連				///
function open_save_Table(paramT){
	if (vm.tType !=4){
		//トーナメント
		TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}}).remove();
		for (var i=1; i<paramT.length; i++){
			TREE.insert({
				T_CD:t_cd
				,HONSEN:vm.nIsHonsen
				,NO:i
				,PLAYER1:paramT[i].player1
				,PLAYER2:paramT[i].player2
				,FROM1:paramT[i].from1
				,FROM2:paramT[i].from2
				,X1:paramT[i].x1
				,Y1:paramT[i].y1
				,X2:paramT[i].x2
				,Y2:paramT[i].y2
				,ZONE:paramT[i].zone
				,LEVEL:paramT[i].level==null ? 1: paramT[i].level
				,SCORE1:paramT[i].score1
				,SCORE2:paramT[i].score2
				,X_CENTER: x_center
			});
		}
	} else {
		//リーグ
		LEAGUE({T_CD:t_cd, HONSEN:vm.nIsHonsen}).remove();
		for (var i=0; i<paramT.length; i++){
			LEAGUE.insert({
				T_CD:t_cd
				,HONSEN:vm.nIsHonsen
				,GRP:paramT[i].grp
				,NO:paramT[i].no
				,PLAYER1:paramT[i].player1
				,PLAYER2:paramT[i].player2
				,SCORE1:paramT[i].score1
				,SCORE2:paramT[i].score2
			});
		}
	}
}
function showUpload(){
	open.isSpinner = false;
	open.modal_upload.show();
}
function done_upload(){
	open.isSpinner =true;
	var keyArray = ["0","1","2","3","4","5","6","7","8","9",
					"a","b","c","d","e","f","g","h","i","j",
					"k","l","m","n","o","p","q","r","s","t",
					"u","v","w","x","y","z"];
	var keycode = "";
	for (var i=0; i<5; i++){
		keycode += keyArray[Math.floor(Math.random()*36)];
	}
	checkKeycode(keycode);

}
function checkKeycode(keycode){
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: {action: "login", key: keycode}
    }).success(function(data, status, headers, config) {
    	if (data=="ok"){
    		done_upload();
    	} else {

    		procUpload(keycode);
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
function network_error(){
	open.isSpinner = false;
	alert('network error');
}
function procUpload(keycode){
	for (var i=0; i<5; i++){
		df[i] = $.Deferred();
	}
	registMaster(keycode);
	uploadSettings(keycode);
	uploadEntry(keycode);
	uploadTree(keycode);
	uploadLeague(keycode);

	$.when(df[0],df[1],df[2],df[3],df[4])
    .done(function() {
    	open.isSpinner = false;
    	var alertPopup = $ionicPopup.alert({
		    title: 'Download Key',
		    template: '<h1>' + keycode + '</h1>'
		});
    })  // 非同期処理1,2,3すべてresolveしたら COMPLETE! を表示する
    .fail(function() { network_error(); });

}
function registMaster(keycode){
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: {action: "registMaster", key: keycode, uuid: device.uuid}
    }).success(function(data, status, headers, config) {
    	if (data){
    		df[0].resolve();
    	} else {
    		network_error();
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
function uploadSettings(keycode){
	var param = vm.FORMAT;
	param.action = "insertvm.FORMAT";
	param.key = keycode;
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: param
    }).success(function(data, status, headers, config) {
    	if (data){
    		df[1].resolve();
    	} else {
    		network_error();
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
function uploadEntry(keycode){
	var entry = [];
	ENTRY({T_CD:{'==':t_cd}}).each(function (r) {
	    entry.push({
	   		CD: r.CD,
	   		NAME: r.NAME,
	   		SKILL: r.SKILL,
	   		HALL: r.HALL,
	   		RANK: r.RANK
	   });
	});
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: {action: "insertEntry", key: keycode, entry: entry}
    }).success(function(data, status, headers, config) {
    	if (data){
    		df[2].resolve();
    	} else {
    		network_error();
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
function uploadTree(keycode){
	var list = [];
	TREE({T_CD:{'==':t_cd}}).each(function (r) {
	    list.push({
	   		HONSEN: r.HONSEN
			,NO: r.NO
			,PLAYER1: r.PLAYER1
			,PLAYER2: r.PLAYER2
			,FROM1: r.FROM1
			,FROM2: r.FROM2
			,X1: r.X1
			,Y1: r.Y1
			,X2: r.X2
			,Y2: r.Y2
			,ZONE: r.ZONE
			,LEVEL: r.LEVEL
			,SCORE1: r.SCORE1
			,SCORE2: r.SCORE2
	   });
	});
	if (list.length==0){
		df[3].resolve();
		return;
	}
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: {action: "insertTree", key: keycode, list: list}
    }).success(function(data, status, headers, config) {
    	if (data){
    		df[3].resolve();
    	} else {
    		network_error();
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
function uploadLeague(keycode){
	var list = [];
	LEAGUE({T_CD:{'==':t_cd}}).each(function (r) {
	    list.push({
	   		HONSEN: r.HONSEN
			,GRP: r.GRP
			,NO: r.NO
			,PLAYER1: r.PLAYER1
			,PLAYER2: r.PLAYER2
			,SCORE1: r.SCORE1
			,SCORE2: r.SCORE2
	   });
	});
	if (list.length==0){
		df[4].resolve();
		return;
	}
	$http({
    	method : 'POST',
    	url : cgi_url,
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	data: {action: "insertLeague", key: keycode, list: list}
    }).success(function(data, status, headers, config) {
    	if (data){
    		df[4].resolve();
    	} else {
    		network_error();
    	}
    }).error(function(data, status, headers, config) {
    	network_error();
    });
}
///	///	///	///	///	///	///	///	///	///	/////				modal 関連				///
//オープニング
function openingPop_show(){
	popup_show({
		name: "opening",
    title: " ",
    width: "600px",
		callback: openingPop_show_callback
	});
}
function openingPop_show_callback(){
	var name = "";
	name = vm.FORMAT.NAME;
	var wYH;
	if (vm.nIsHonsen==0){
		wYH = "Qualifier";
	} else {
		wYH = "Finals";
	}
	new Vue({
		el: '#openpop_div',
		data: {
			date: getDateStr(new Date()),
			name: name,
			yh: wYH
		}
	})
}
function openpop_click_start(){
	popup_hide("opening");
}
//score
function open_showPop_setResult(){
	var level;
	if (vm.tType!=4){
		level = getTournamentLevel(open.selectTab);
	} else {
		level = "Group" + (vm.tableInfo[open.selectTab].GRP+1);
	}
	popup_show({
		name: "score",
    title: level,
    width: "400px",
		callback: scorePop_callback
	});
	/*open.isFirstTime = true;
	open.modal_score.show();
	var level;
	if (vm.tType!=4){
		level = getTournamentLevel(open.selectTab);
	} else {
		level = "Group" + (vm.tableInfo[open.selectTab].GRP+1);
	}
	open.score = {
		title: level,
		handy: [vm.tableInfo[open.selectTab].HANDY1,vm.tableInfo[open.selectTab].HANDY2],
		isWin: [false,false],
		score: [0,0],
		name: [vm.tableInfo[open.selectTab].NAME1, vm.tableInfo[open.selectTab].NAME2],
		disabled: [[false,false,false,false,false,false,false,false,false,false],
					[false,false,false,false,false,false,false,false,false,false]]
	}
	for (var i=0; i<2; i++){
		if (open.score.handy[i]<10){
			open.score.disabled[i][0] = true;
			for (var j=open.score.handy[i]+1; j<10; j++){
				open.score.disabled[i][j] = true;
			}
		}
	}*/

}
function scorePop_callback(){
	var wk_scores = [[],[]];
	var wk_handy = [vm.tableInfo[open.selectTab].HANDY1,vm.tableInfo[open.selectTab].HANDY2];
	for (var i=0; i<2; i++){
		wk_scores[i].push({val: -1, text:W[47]});
		for (var j=0; j<=wk_handy[i]; j++){
			var score;
			if (j==wk_handy[i]){
				wk_scores[i].push({val: j, text:"W"});
			} else {
				wk_scores[i].push({val: j, text: j});
			}
		}
	}
	open.scoreVm = new Vue({
		el: '#score',
		data: {
			name1: vm.tableInfo[open.selectTab].NAME1,
			name2: vm.tableInfo[open.selectTab].NAME2,
			hall1: vm.tableInfo[open.selectTab].HALL1,
			hall2: vm.tableInfo[open.selectTab].HALL2,
			score1: 0,
			score2: 0,
			scores1: wk_scores[0],
			scores2: wk_scores[1],
			isShow_okBtn: false
		}
	})
}
function tap_Number(player, num){
	var old_value = open.score.score[player];
	var limitter = 100;
	if (open.score.handy[player]<10){
		open.isFirstTime = true;
	} else if (open.score.handy[player]<100){
		limitter = 10;
	}

	var new_value;
	if (num<0){
		new_value=0;
	} else {
		if (open.isFirstTime){
			new_value = num;
		} else {
			new_value = (old_value < limitter) ? (old_value * 10 + num) : old_value;
		}
	}

	open.score.score[player] = new_value;

	if (open.score.score[player]>=open.score.handy[player]){
		open.score.score[player] = open.score.handy[player];
		open.score.isWin[player] = true;
		open.score.isWin[1-player] = false;
		if (open.score.score[1-player]>=open.score.handy[1-player]){
			open.score.score[1-player] = 0;
		}
	} else {
		open.score.isWin[player] = false;
	}

	open.isFirstTime = false;
}
function score_change_score(){
	var score1 = $('#result_score1').val();
	var score2 = $('#result_score2').val();

	if ((score1 == vm.tableInfo[open.selectTab].HANDY1 && score2 != vm.tableInfo[open.selectTab].HANDY2) ||
		(score1 != vm.tableInfo[open.selectTab].HANDY1 && score2 == vm.tableInfo[open.selectTab].HANDY2)){
		open.scoreVm.isShow_okBtn = true;
	} else {
		open.scoreVm.isShow_okBtn = false;
	}
}
function score_clickNum(player){

	/*var element = '#score_score'+no;
	$('.score_board.selected').removeClass("selected");
	for (var i=1; i<=10; i++){
		cssShow('#numBtn'+i);
	}
	if (open.handy[no-1]!=null){
		if (open.handy[no-1]<10){
			for (var i=open.handy[no-1]+1; i<=10; i++){
				cssHide('#numBtn'+i);
			}
		}
	}

	$(element).addClass("selected");
	$.ui.toggleNavMenu(true);
	msNumBoxId = element;
	mbInputFirst = true;
	var wscore = getNumber(msNumBoxId);
	wscore++;
	if (open.handy[no-1]!=null){
		if (open.handy[no-1]<wscore){
			wscore--;
		}
	}
	tap_Number(wscore);
	score_change_score();*/
	open.score.isWin[player] = true;
	open.score.isWin[1-player] = false;
	open.score.isWin[1-player] = false;
	if (open.score.score[1-player]>=open.score.handy[1-player]){
		open.score.score[1-player] = 0;
	}
	open.score.score[player] = open.score.handy[player];
}
function score_reach(no){
	clearTimeout(msgTimeout);
	open.flashCnt=10;
	msgTimeout=setTimeout("score_flash(" + no + ");",10);
}
function score_flash(no){
	var on_off = open.flashCnt % 2;
	if (on_off==0){
		$("#score_score" + no).addClass("reach");
	} else {
		$("#score_score" + no).removeClass("reach");
	}
	if (open.flashCnt>0){
		open.flashCnt--;
		msgTimeout=setTimeout("score_flash(" + no + ");",10);
	} else {
		clearTimeout(msgTimeout);
	}
}
function score_click_setGame(){
	var wscore = new Array(2);

	wscore = [open.scoreVm.score1, open.scoreVm.score2];
	var player1 = vm.tableInfo[open.selectTab].PLAYER1;
	var player2 = vm.tableInfo[open.selectTab].PLAYER2;
	var winner;
	var looser;
	var no = vm.tableInfo[open.selectTab].NO;
	var win = open_getWinner(wscore[0],wscore[1],vm.tableInfo[open.selectTab].HANDY1,vm.tableInfo[open.selectTab].HANDY2);
	if (vm.tType!=4){
		//脱落
		var zone = parseInt(vm.tableInfo[open.selectTab].ZONE);
		if (win==1){
			winner = player1;
			looser = player2;
			if (zone==1 || vm.isSingle==true){
				vm.ENTRIES[player2].PLAY = -1;
			}
		} else if (win==2){
			winner = player2;
			looser = player1;
			if (zone==1 || vm.isSingle==true){
				vm.ENTRIES[player1].PLAY = -1;
			}
		}
		TREE({T_CD:{'==':t_cd}
				,HONSEN:{'==':vm.nIsHonsen}
				,NO:{'==':no}
			}).update({
			SCORE1:wscore[0],
			SCORE2:wscore[1]
		});

		//勝者登録
		var r1 = TREE({
					T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,FROM1:{'==':no}
				}).first();
		var r2 = TREE({
					T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,FROM2:{'==':no}
				}).first();
		if (r1){
			TREE({T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,NO:{'==':r1.NO}
					}).update({
				PLAYER1:winner
			});
		} else if (r2){
			TREE({T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,NO:{'==':r2.NO}
					}).update({
				PLAYER2:winner
			});
		}
		//敗者登録
		//var zone = vm.tableInfo[open.selectTab].ZONE;
		if (zone==0 || (zone==2 && win==2)){
			r1 = TREE({
					T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,FROM1:{'==':-no}
				}).first();
			r2 = TREE({
					T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,FROM2:{'==':-no}
				}).first();

			if (r1){
				TREE({T_CD:{'==':t_cd}
						,HONSEN:{'==':vm.nIsHonsen}
						,NO:{'==':r1.NO}
						}).update({
					PLAYER1:looser
				});
			} else if (r2){
				TREE({T_CD:{'==':t_cd}
						,HONSEN:{'==':vm.nIsHonsen}
						,NO:{'==':r2.NO}
						}).update({
					PLAYER2:looser
				});
			}
		}
		var w_kbn = (zone==1 || zone==3 || zone==5 ) ? 1 : 0;
	} else {
		var grp = vm.tableInfo[open.selectTab].GRP;
		LEAGUE({T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,GRP:{'==':grp}
					,NO:{'==':no}
					}).update({
			SCORE1: wscore[0]
			,SCORE2: wscore[1]
		});
		vm.grp = grp;
		//score_procSetGame();
	}
	score_procSetGame();
	//mbNoInit=true;
	//$.ui.loadContent("#page_open",false,false,"down");
	popup_hide("score");
}
function score_cancel(){
	//mbNoInit=true;
	$.ui.loadContent("#page_open",false,false,"down");
}
function score_click_resetGame(){
	var no = vm.tableInfo[open.selectTab].NO;
	if (vm.tType!=4){
		TREE({T_CD:{'==':t_cd}
				,HONSEN:{'==':vm.nIsHonsen}
				,NO:{'==':no}
			}).update({
			SCORE1:null,
			SCORE2:null
		});
	} else {
		var grp = vm.tableInfo[open.selectTab].GRP;
		LEAGUE({T_CD:{'==':t_cd}
					,HONSEN:{'==':vm.nIsHonsen}
					,GRP:{'==':grp}
					,NO:{'==':no}
					}).update({
			SCORE1: null
			,SCORE2: null
		});
	}
	score_procSetGame();
	//mbNoInit=true;
	//$.ui.loadContent("#page_open",false,false,"fade");
	popup_hide("score");

}
function score_procSetGame(){
	$('#insideTable'+open.selectTab).html("<br><br><br>");
	if (vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER1].PLAY>=0){
		vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER1].PLAY = null;
	}
	if (vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER2].PLAY>=0){
		vm.ENTRIES[vm.tableInfo[open.selectTab].PLAYER2].PLAY = null;
	}
	vm.tableInfo[open.selectTab] = null;
	if (vm.tType!=4){
		open_showTreeTable();
	} else {
		showLeagueTable();
	}
}
//selectGame
function open_click_nextList(no){
	popup_hide("selectGame");
	if (vm.tType!=4){
		open_setTreeTab(no);
		open_showTreeTable();
	} else {
		open_setLeagueTab(Math.floor(no/100), no % 100);
		showLeagueTable()
	}
}
//undoGame
function open_click_undoList(no){
	if (confirm(M[18])){
		if (vm.tType!=4){
				open_proc_undoTreeList(no);
			} else {
				open_proc_undoLeagueList(Math.floor(no),no % 100);
			}
	}
}
function open_proc_undoTreeList(no){

	vm.ENTRIES[open.tree[no].player1].PLAY = null;
	vm.ENTRIES[open.tree[no].player2].PLAY = null;

	TREE(
		{
			T_CD:{'==':t_cd}
			,HONSEN:{'==':vm.nIsHonsen}
		},[
			{FROM1:{'==':no}}
			,{FROM1:{'==':-no}}
		]).update({
		PLAYER1:null
	});
	TREE(
		{
			T_CD:{'==':t_cd}
			,HONSEN:{'==':vm.nIsHonsen}
		},[
			{FROM2:{'==':no}}
			,{FROM2:{'==':-no}}
		]).update({
		PLAYER2:null
	});
	TREE(
		{
			T_CD:{'==':t_cd}
			,HONSEN:{'==':vm.nIsHonsen}
			,NO:{'==':no}
		}).update({
		SCORE1:null,
		SCORE2:null
	});
	popup_hide("undoGame");
	vm.isShowFin = false;
 	vm.isShowFootArea = true;
	open_showTreeTable();
}
function open_proc_undoLeagueList(grp,no){
	LEAGUE(
		{
			T_CD:{'==':t_cd}
			,HONSEN:{'==':vm.nIsHonsen}
			,GRP:{'==':grp}
			,NO:{'==':no}
		}).update({
		SCORE1:null,
		SCORE2:null
	});
	popup_hide("undoGame");
	vm.isShowFin = false;
 	vm.isShowFootArea = true;
	showLeagueTable();
}
//リーグ戦結果関連
function showSelectPlayerPop(grp){
	if (vm.nIsHonsen==1){
		showHonsenResultLeague();
		return;
	}
	//intel.xdk.player.playSound("sounds/select.mp3");
	open.selectPlayer = {
		list:[]
	};;
	//var grp = parseInt($('#confirm_grp').text());
	for (var i=0; i<vm.grpRank[vm.grp].length; i++){
		var wPlayer = vm.grpRank[vm.grp][i].player;
		/*s+="<tr id='confirmPlayer" + wPlayer + "' onclick='open_click_confirm(" + grp + "," + wPlayer + ")'>";
		s+="<td>" + vm.grpRank[grp][i].rank + "</td>";
		s+="<td>" + vm.ENTRIES[wPlayer].NAME + "</td>";
		s+="<td>" + open.result[wPlayer].win + "</td>";
		s+="<td>" + open.result[wPlayer].loose + "</td>";
		s+="<td>" + getDiv1(open.result[wPlayer].get*100,  open.result[wPlayer].get_all) + "%(" + open.result[wPlayer].get + "/" + open.result[wPlayer].get_all + ")</td>";
		s+="<td>" + getDiv1(open.result[wPlayer].lost*100,  open.result[wPlayer].lost_all) + "%(" + open.result[wPlayer].lost + "/" + open.result[wPlayer].lost_all + ")</td>";
		s+="</tr>";*/
		open.selectPlayer.list.push({
			player: wPlayer,
			rank: vm.grpRank[grp][i].rank ,
			name: vm.ENTRIES[wPlayer].NAME ,
			memo: vm.ENTRIES[wPlayer].HALL ,
			win: open.result[wPlayer].win,
			lose: open.result[wPlayer].loose,
			get : getDiv1(open.result[wPlayer].get*100,  open.result[wPlayer].get_all) + "%(" + open.result[wPlayer].get + "/" + open.result[wPlayer].get_all + ")",
			lost: getDiv1(open.result[wPlayer].lost*100,  open.result[wPlayer].lost_all) + "%(" + open.result[wPlayer].lost + "/" + open.result[wPlayer].lost_all + ")"
		})
	}
	open.modal_selectPlayer.show();

	//showLeagueHonsenPlayer_pop(grp);
}
//本戦進出者選択/選択
function open_click_confirm(grp,player){
	if (vm.FORMAT.STATUS==1){
		if (open.result[player].honsen==1){
			//$('#confirmPlayer' + player).removeClass("confirm");
			open.result[player].honsen = 0;
		} else {
			//$('#confirmPlayer' + player).addClass("confirm");
			open.result[player].honsen = 1;
		}
		showLeagueHonsenPlayer_pop(grp);
		showBtnResultLeague();	//　本戦進出者選択ポップアップ表示ボタン色セット
		showLeagueHonsenPlayer();	//メイン画面と連動
	}
}
//本戦進出プレイヤー色設定(ポップアップ版)
function showLeagueHonsenPlayer_pop(grp){
	var leagueWinner = parseInt(vm.FORMAT['H_NUMBER'])/open.groups;
	//var grp = parseInt($('#confirm_grp').text());
	var wconfirmNum = 0;
	/*for (var i=0; i<vm.grpRank[grp].length; i++){
		var wPlayer = vm.grpRank[grp][i].player;
		if (open.result[wPlayer].honsen==1){
			$('#confirmPlayer' + wPlayer).addClass("confirm");
			wconfirmNum++;
		}  else {
			$('#confirmPlayer' + wPlayer).removeClass("confirm");
		}
	}*/
	for (var j=0; j<vm.grpRank[grp].length; j++){
		var wPlayer = vm.grpRank[grp][j].player;
		if (open.result[wPlayer].honsen==1){
			//vm.table.grps[grp].rows[wPlayer].color = open_getPlayColor(10);
			wconfirmNum++;
			//$('.leaguePlayer' + i + "-" + j).css("color",open_getPlayColor(10));
		} else {
			//$('.leaguePlayer' + i + "-" + j).css("color",open_getPlayColor(-1));
			//vm.table.grps[grp].rows[wPlayer].color = open_getPlayColor(-1);
		}
	}
	if (leagueWinner==wconfirmNum){
		$('#btn_ok_confirm').css("display","inopen.line");
	} else {
		$('#btn_ok_confirm').css("display","none");
	}
}
function showHonsenResultLeague(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	 //showPopFrame("open/showConfirmPlayer",{group:1},600, successFnc_showHonsenResultLeaguep, true, "本戦リーグ結果");

	/*var s='<div id="total_result" style="overflow:scroll;">';
	s+='<table id="confirm_table" style="width:100%;">';
	s+='<colgroup span="3" style="text-align:center;">';
	s+='<tr>';
	s+='<th>Rank</th>';
	s+='<th>Name</th>';
	s+='<th>Win</th>';
	s+='<th>Loose</th>';
	s+='<th>Get</th>';
	s+='<th>Lost</th>';
	s+='</tr>';*/
	var grp = vm.grp;
	wRank = 1;
	var wchk = [];
	for (var j=0; j<open.result.length; j++){
		wchk[j] = false;
	}
	var saveMax = 0;
	open.selectPlayer = {
		list:[]
	};;
	for (var j=0; j<vm.entryNum; j++){
		var wMax = -1;
		var wMaxPlayer = -1;
		for (var k=0; k<open.result.length; k++){
			if (wchk[k] == false && open.result[k].honsen==1){
				var wValue = ((open.result[k].win / (open.result[k].win + open.result[k].loose)*1000)*1000000 + ( open.result[k].get/ open.result[k].get_all*1000)*1000 + ( 1000- open.result[k].lost/ open.result[k].lost_all*1000));
				if (wMax<wValue){
					wMaxPlayer = k;
					wMax = wValue;
				}
			}
		}
		wchk[wMaxPlayer] = true;
		if (saveMax!=wMax){
			wRank = j+1;
			saveMax = wMax;
		}
		var wPlayer = wMaxPlayer;
		/*s+="<tr>";
		s+="<td>" + wRank + "</td>";
		s+="<td>" + vm.ENTRIES[wPlayer].NAME + "</td>";
		s+="<td>" + open.result[wPlayer].win + "</td>";
		s+="<td>" + open.result[wPlayer].loose + "</td>";
		s+="<td>" + getDiv1(open.result[wPlayer].get*100,  open.result[wPlayer].get_all) + "%(" + open.result[wPlayer].get + "/" + open.result[wPlayer].get_all + ")</td>";
		s+="<td>" + getDiv1(open.result[wPlayer].lost*100,  open.result[wPlayer].lost_all) + "%(" + open.result[wPlayer].lost + "/" + open.result[wPlayer].lost_all + ")</td>";
		s+="</tr>";*/
		open.selectPlayer.list.push({
			player: wPlayer,
			rank: wRank ,
			name: vm.ENTRIES[wPlayer].NAME ,
			memo: vm.ENTRIES[wPlayer].HALL ,
			win: open.result[wPlayer].win,
			lose: open.result[wPlayer].loose,
			get : getDiv1(open.result[wPlayer].get*100,  open.result[wPlayer].get_all) + "%(" + open.result[wPlayer].get + "/" + open.result[wPlayer].get_all + ")",
			lost: getDiv1(open.result[wPlayer].lost*100,  open.result[wPlayer].lost_all) + "%(" + open.result[wPlayer].lost + "/" + open.result[wPlayer].lost_all + ")"
		})

	}
	open.modal_honsenResult_league.show();
	/*s+="</table></div>";
	$("#afui").popup({ title:msg(66),
      message:s,
      cancelText:"OK",
      cancelCallback: function(){open_click_ok_confirm();},
      cancelOnly:true}
    );*/
	//showLeagueHonsenPlayer_pop();
}
///	///	///	///	///	///	///	///	///	///	/////				テーブル描画				///
function open_initTreeTable(){
	//勝者1回戦
	for (var i=1; i<=32; i++){
		open.treeFormat[i] = new open_tournament(null, null, null, null);
	}
	//敗者1回戦
	open.treeFormat[33] = new open_tournament(-1, -3, null, null);
	open.treeFormat[34] = new open_tournament(-2, -4, null, null);
	open.treeFormat[35] = new open_tournament(-5, -7, null, null);
	open.treeFormat[36] = new open_tournament(-6, -8, null, null);
	open.treeFormat[37] = new open_tournament(-9, -11, null, null);
	open.treeFormat[38] = new open_tournament(-10, -12, null, null);
	open.treeFormat[39] = new open_tournament(-13, -15, null, null);
	open.treeFormat[40] = new open_tournament(-14, -16, null, null);
	open.treeFormat[41] = new open_tournament(-17, -19, null, null);
	open.treeFormat[42] = new open_tournament(-18, -20, null, null);
	open.treeFormat[43] = new open_tournament(-21, -23, null, null);
	open.treeFormat[44] = new open_tournament(-22, -24, null, null);
	open.treeFormat[45] = new open_tournament(-25, -27, null, null);
	open.treeFormat[46] = new open_tournament(-26, -28, null, null);
	open.treeFormat[47] = new open_tournament(-29, -31, null, null);
	open.treeFormat[48] = new open_tournament(-30, -32, null, null);
	//勝者2回戦
	for (var i=49; i<=64; i++){
		open.treeFormat[i] = new open_tournament((i-49)*2+1, (i-49)*2+2, null, null);
	}
	//敗者2回戦
	open.treeFormat[65] = new open_tournament(33, -51, null, null);
	open.treeFormat[66] = new open_tournament(34, -52, null, null);
	open.treeFormat[67] = new open_tournament(35, -49, null, null);
	open.treeFormat[68] = new open_tournament(36, -50, null, null);
	open.treeFormat[69] = new open_tournament(37, -55, null, null);
	open.treeFormat[70] = new open_tournament(38, -56, null, null);
	open.treeFormat[71] = new open_tournament(39, -53, null, null);
	open.treeFormat[72] = new open_tournament(40, -54, null, null);
	open.treeFormat[73] = new open_tournament(41, -59, null, null);
	open.treeFormat[74] = new open_tournament(42, -60, null, null);
	open.treeFormat[75] = new open_tournament(43, -57, null, null);
	open.treeFormat[76] = new open_tournament(44, -58, null, null);
	open.treeFormat[77] = new open_tournament(45, -63, null, null);
	open.treeFormat[78] = new open_tournament(46, -64, null, null);
	open.treeFormat[79] = new open_tournament(47, -61, null, null);
	open.treeFormat[80] = new open_tournament(48, -62, null, null);
	//勝者3回戦
	for (var i=81; i<=88; i++){
		open.treeFormat[i] = new open_tournament((i-81)*2+49, (i-81)*2+50, null, null);
	}
	//敗者3回戦
	for (var i=89; i<=96; i++){
		open.treeFormat[i] = new open_tournament((i-89)*2+65, (i-89)*2+66, null, null);
	}
	//敗者4回戦
	open.treeFormat[97] = new open_tournament(89, -85, null, null);
	open.treeFormat[98] = new open_tournament(90, -87, null, null);
	open.treeFormat[99] = new open_tournament(91, -86, null, null);
	open.treeFormat[100] = new open_tournament(92, -88, null, null);
	open.treeFormat[101] = new open_tournament(93, -81, null, null);
	open.treeFormat[102] = new open_tournament(94, -83, null, null);
	open.treeFormat[103] = new open_tournament(95, -82, null, null);
	open.treeFormat[104] = new open_tournament(96, -84, null, null);
	//勝者4回戦
	for (var i=105; i<=108; i++){
		open.treeFormat[i] = new open_tournament((i-105)*2+81, (i-105)*2+82, null, null);
	}
	//敗者5回戦
	for (var i=109; i<=112; i++){
		open.treeFormat[i] = new open_tournament((i-109)*2+97, (i-109)*2+98, null, null);
	}
	//敗者6回戦
	open.treeFormat[113] = new open_tournament(109, -106, null, null);
	open.treeFormat[114] = new open_tournament(110, -108, null, null);
	open.treeFormat[115] = new open_tournament(111, -105, null, null);
	open.treeFormat[116] = new open_tournament(112, -107, null, null);
	//勝者5回戦
	open.treeFormat[117] = new open_tournament(105, 106, null, null);
	open.treeFormat[118] = new open_tournament(107, 108, null, null);
	//敗者7回戦
	open.treeFormat[119] = new open_tournament(113, 114, null, null);
	open.treeFormat[120] = new open_tournament(115, 116, null, null);
	//敗者8回戦
	open.treeFormat[121] = new open_tournament(119, -117, null, null);
	open.treeFormat[122] = new open_tournament(120, -118, null, null);
	//勝者6回戦
	open.treeFormat[123] = new open_tournament(117, 118, null, null);
	//敗者９回戦
	open.treeFormat[124] = new open_tournament(121, 122, null, null);
	//敗者10回戦
	open.treeFormat[125] = new open_tournament(124, -123, null, null);
	//勝者決勝
	open.treeFormat[126] = new open_tournament(123, 125, null, null);
	//プレーオフ
	open.treeFormat[127] = new open_tournament(126, -126, null, null);

	//open.line
	for (var i=1; i<=127; i++){
		open.line[i] = new Array(2);
	}
	//勝者1回戦
	for (var i=1; i<=32; i++){
		open.line[i][0] = new Array( new open_loc(-8,(i-1)*2+1), new open_loc(-7,(i-1)*2+1), new open_loc(-7,(i-1)*2+1.5));
		open.line[i][1] = new Array( new open_loc(-8,(i-1)*2+2), new open_loc(-7,(i-1)*2+2), new open_loc(-7,(i-1)*2+1.5));
	}
	//敗者1回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			for (var k=0 ; k<2; k++){
				for (var l=0; l<2; l++){
					open.line[i*8 + j*4 + k*2 + l +33][0] = new Array( new open_loc(11,l*3+k*7+j*15+i*31+1), new open_loc(10,l*3+k*7+j*15+i*31+1), new open_loc(10,l*3+k*7+j*15+i*31+1.5));
					open.line[i*8 + j*4 + k*2 + l +33][1] = new Array( new open_loc(11,l*3+k*7+j*15+i*31+2), new open_loc(10,l*3+k*7+j*15+i*31+2), new open_loc(10,l*3+k*7+j*15+i*31+1.5));
				}
			}
		}
	}
	//勝者2回戦
	for (var i=49; i<=64; i++){
		open.line[i][0] = new Array( new open_loc(-7,(i-49)*4+1.5), new open_loc(-6,(i-49)*4+1.5), new open_loc(-6,(i-49)*4+2.5));
		open.line[i][1] = new Array( new open_loc(-7,(i-49)*4+3.5), new open_loc(-6,(i-49)*4+3.5), new open_loc(-6,(i-49)*4+2.5));
	}
	//敗者2回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			for (var k=0 ; k<2; k++){
				for (var l=0; l<2; l++){
					open.line[i*8 + j*4 + k*2 + l +65][0] = new Array( new open_loc(10,l*3+k*7+j*15+i*31+1.5), new open_loc(9,l*3+k*7+j*15+i*31+1.5), new open_loc(9,l*3+k*7+j*15+i*31+2));
					open.line[i*8 + j*4 + k*2 + l +65][1] = new Array( new open_loc(11,l*3+k*7+j*15+i*31+3), new open_loc(9,l*3+k*7+j*15+i*31+3), new open_loc(9,l*3+k*7+j*15+i*31+2));
				}
			}
		}
	}
	//勝者3回戦
	for (var i=81; i<=88; i++){
		open.line[i][0] = new Array( new open_loc(-6,(i-81)*8+2.5), new open_loc(-5,(i-81)*8+2.5), new open_loc(-5,(i-81)*8+4.5));
		open.line[i][1] = new Array( new open_loc(-6,(i-81)*8+6.5), new open_loc(-5,(i-81)*8+6.5), new open_loc(-5,(i-81)*8+4.5));
	}
	//敗者3回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			for (var k=0 ; k<2; k++){
				open.line[i*4 + j*2 + k + 89][0] = new Array( new open_loc(9,k*7+j*15+i*31+2), new open_loc(8,k*7+j*15+i*31+2), new open_loc(8,k*7+j*15+i*31+3.5));
				open.line[i*4 + j*2 + k + 89][1] = new Array( new open_loc(9,k*7+j*15+i*31+5), new open_loc(8,k*7+j*15+i*31+5), new open_loc(8,k*7+j*15+i*31+3.5));
			}
		}
	}
	//敗者4回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			for (var k=0 ; k<2; k++){
				open.line[i*4 + j*2 + k + 97][0] = new Array( new open_loc(8,k*7+j*15+i*31+3.5), new open_loc(7,k*7+j*15+i*31+3.5), new open_loc(7,k*7+j*15+i*31+5));
				open.line[i*4 + j*2 + k + 97][1] = new Array( new open_loc(11,k*7+j*15+i*31+7), new open_loc(7,k*7+j*15+i*31+7), new open_loc(7,k*7+j*15+i*31+5));
			}
		}
	}
	//勝者4回戦
	for (var i=105; i<=108; i++){
		open.line[i][0] = new Array( new open_loc(-5,(i-105)*16+4.5), new open_loc(-4,(i-105)*16+4.5), new open_loc(-4,(i-105)*16+8.5));
		open.line[i][1] = new Array( new open_loc(-5,(i-105)*16+12.5), new open_loc(-4,(i-105)*16+12.5), new open_loc(-4,(i-105)*16+8.5));
	}
	//敗者5回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			open.line[i*2 + j + 109][0] = new Array( new open_loc(7,j*15+i*31+5), new open_loc(6,j*15+i*31+5), new open_loc(6,j*15+i*31+8.5));
			open.line[i*2 + j + 109][1] = new Array( new open_loc(7,j*15+i*31+12), new open_loc(6,j*15+i*31+12), new open_loc(6,j*15+i*31+8.5));
		}
	}
	//敗者6回戦
	for (var i=0; i<2; i++){
		for (var j=0; j<2; j++){
			open.line[i*2 + j + 113][0] = new Array( new open_loc(6,j*15+i*31+8.5), new open_loc(5,j*15+i*31+8.5), new open_loc(5,j*15+i*31+12));
			open.line[i*2 + j + 113][1] = new Array( new open_loc(11,j*15+i*31+15), new open_loc(5,j*15+i*31+15), new open_loc(5,j*15+i*31+12));
		}
	}
	//勝者5回戦
	for (var i=117; i<=118; i++){
		open.line[i][0] = new Array( new open_loc(-4,(i-117)*32+8.5), new open_loc(-3,(i-117)*32+8.5), new open_loc(-3,(i-117)*32+16.5));
		open.line[i][1] = new Array( new open_loc(-4,(i-117)*32+24.5), new open_loc(-3,(i-117)*32+24.5), new open_loc(-3,(i-117)*32+16.5));
	}
	//敗者7回戦
	for (var i=0; i<2; i++){
		open.line[i + 119][0] = new Array( new open_loc(5,i*31+12), new open_loc(4,i*31+12), new open_loc(4,i*31+19.5));
		open.line[i + 119][1] = new Array( new open_loc(5,i*31+27), new open_loc(4,i*31+27), new open_loc(4,i*31+19.5));
	}
	//敗者8回戦
	for (var i=0; i<2; i++){
		open.line[i + 121][0] = new Array( new open_loc(4,i*31+19.5), new open_loc(3,i*31+19.5), new open_loc(3,i*31+25));
		open.line[i + 121][1] = new Array( new open_loc(11,i*31+31), new open_loc(3,i*31+31), new open_loc(3,i*31+25));
	}
	//勝者6回戦
	open.line[123][0] = new Array( new open_loc(-3,16.5), new open_loc(-2,16.5), new open_loc(-2,32.5));
	open.line[123][1] = new Array( new open_loc(-3,48.5), new open_loc(-2,48.5), new open_loc(-2,32.5));
	//敗者９回戦
	open.line[124][0] = new Array( new open_loc(3,25), new open_loc(2,25), new open_loc(2,27));
	open.line[124][1] = new Array( new open_loc(3,56), new open_loc(2,56), new open_loc(2,27));
	//敗者10回戦
	open.line[125][0] = new Array( new open_loc(2,27), new open_loc(1,27), new open_loc(1,32.5));
	open.line[125][1] = new Array( new open_loc(11,63), new open_loc(1,63), new open_loc(1,32.5));
	//勝者決勝
	open.line[126][0] = new Array( new open_loc(-2,32.5), new open_loc(-1,32.5));
	open.line[126][1] = new Array( new open_loc(1,32.5), new open_loc(-0.5,32.5));
	//open.line[126][1] = new Array( new open_loc(-2,64), new open_loc(-1,64));
	//プレーオフ
	open.line[127][0] = new Array( new open_loc(1,32.5), new open_loc(-0.5,32.5));
	open.line[127][1] = new Array( new open_loc(1,32.5), new open_loc(-0.5,32.5));
	//open.line[127][1] = new Array( new open_loc(11,64), new open_loc(0,64), new open_loc(0,32.5));
}
function open_setTreeTable(h_number){
	//var x_scale = 1600/19;
	var y_scale = lh; //32;
	var y_base = 0; //60;
	open_get_entryNum();


	//var vm.entryNum = entry.length;

	for (var i=1; i<=127; i++){
		vm.table_check[i] = [false, false];
	}

	//エントリー数による余分な試合の削除
	if (vm.entryNum<=4){
		for (var i=0; i<vm.entryNum; i++){
			vm.table_check[(i % 2)+117][Math.floor(i/2)] = true;
		}
		open_setTreeY(117,118);
	} else if (vm.entryNum<=8){
		var seqArray = [0,4,2,6,1,5,3,7];
		for (var i=0; i<vm.entryNum; i++){
			vm.table_check[Math.floor(seqArray[i]/2)+105][seqArray[i]%2] = true;
		}
		open_setTreeY(105,108);
	} else if (vm.entryNum<=16){
		var seqArray = [0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15];
		for (var i=0; i<vm.entryNum; i++){
			vm.table_check[Math.floor(seqArray[i]/2)+81][seqArray[i]%2] = true;
		}
		open_setTreeY(81,88);
	} else if (vm.entryNum<=32){
		var seqArray = [0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23,15,31];
		for (var i=0; i<vm.entryNum; i++){
			vm.table_check[Math.floor(seqArray[i]/2)+49][seqArray[i]%2] = true;
		}
		open_setTreeY(49,64);

	} else {
		var seqArray = [0,32,16,48,8,40,24,56,4,36,20,52,12,44,28,60,2,34,18,50,10,42,26,58,6,38,22,54,14,46,30,62,1,33,17,49,9,41,25,57,5,37,21,53,13,45,29,61,3,35,19,51,11,43,27,59,7,39,23,55,15,47,31,63];
		for (var i=0; i<vm.entryNum; i++){
			vm.table_check[Math.floor(seqArray[i]/2)+1][seqArray[i] % 2] = true;
		}
		open_setTreeY(1,32);
	}

	//余分な試合(相手なし)の削除
	for (var i=1; i<=127; i++){

		if (vm.table_check[i][0]==true || vm.table_check[i][1]==true){
			if (vm.table_check[i][0]==true && vm.table_check[i][1]==true){
				for (var j=i+1; j<=127; j++){
					if (open.treeFormat[j].from1 ==i || open.treeFormat[j].from1 ==-i){
						vm.table_check[j][0]=true;
					}
					if (open.treeFormat[j].from2 ==i || open.treeFormat[j].from2 ==-i){
						vm.table_check[j][1]=true;
					}
				}
			} else {
				//敗者ゾーン
				for (var j=i+1; j<=127; j++){
					if (open.treeFormat[j].from1 ==i){
						vm.table_check[j][0]=true;
					}
					if (open.treeFormat[j].from2 ==i){
						vm.table_check[j][1]=true;
					}
				}
			}
		}
	}

	//open_setTreeY2(11);

	for (var i=1; i<=127; i++){
		if (vm.table_check[i][0]==true && vm.table_check[i][1]==true){
			open.line[i][0][1].y = open.line[i][0][0].y;
			open.line[i][1][1].y = open.line[i][1][0].y;
			open_setTreeCenter(i);
		} else if (vm.table_check[i][0]==true ^ vm.table_check[i][1]==true){

			var xx;
			var yy;
			if (vm.table_check[i][0]==true){
				xx = open.line[i][0][0].x;
				yy = open.line[i][0][0].y;
			} else {
				xx = open.line[i][1][0].x;
				yy = open.line[i][1][0].y;
			}

			var k = i;
			var flg = true;
			do{
				var l = k;
				k=-1;
				for (var j=l+1; j<=127; j++){
					if (open.treeFormat[j].from1==l || open.treeFormat[j].from2==l){
						k=j;

						break;
					}
				}
				if (k==-1){

					flg = false;
				} else {

					//alert(k+"," + vm.table_check[k][0] + "," + vm.table_check[k][1]);
					if ( vm.table_check[k][0]==true && vm.table_check[k][1]==true){
						if (open.treeFormat[k].from1 ==l){
							open.line[k][0][0].x = xx;
							open.line[k][0][0].y = yy;
							open.line[k][0][1].y = yy;
							if (vm.table_check[i][0]==true){
								open.treeFormat[k].from1 = open.treeFormat[i].from1;
							} else {
								open.treeFormat[k].from1 = open.treeFormat[i].from2;
							}
						} else {
							open.line[k][1][0].x = xx;
							open.line[k][1][0].y = yy;
							open.line[k][1][1].y = yy;
							if (vm.table_check[i][0]==true){
								open.treeFormat[k].from2 = open.treeFormat[i].from1;
							} else {
								open.treeFormat[k].from2 = open.treeFormat[i].from2;
							}

						}
						var centerY = (open.line[k][0][1].y + open.line[k][1][1].y) /2;
						open.line[k][0][2].y = centerY;
						open.line[k][1][2].y = centerY;
						flg = false;
						//break;

					} else {
						//vm.table_check[l][0]=false;
						//vm.table_check[l][1]=false;
						vm.table_check[k][0]=false;
						vm.table_check[k][1]=false;

					}
				}


			} while (flg == true);
			vm.table_check[i][0]=false;
			vm.table_check[i][1]=false;
		}
	}

	open_setTreeY2(11);


	//本戦出場人数による余分な試合の削除
	switch (h_number) {
	case 4:
		for (var i=123; i<=126; i++){
			vm.table_check[i][0] = false;
			vm.table_check[i][1] = false;
		}
		break;
	case 8:
		for (var i=117; i<=126; i++){
			vm.table_check[i][0] = false;
			vm.table_check[i][1] = false;
		}
		break;
	case 16:
		for (var i=105; i<=126; i++){
			vm.table_check[i][0] = false;
			vm.table_check[i][1] = false;
		}
		break;
	case 32:
		for (var i=81; i<=126; i++){
			vm.table_check[i][0] = false;
			vm.table_check[i][1] = false;
		}
		break;
	}

	//予選の場合、プレーオフ削除
	if (h_number!=1 || vm.tType==3){
		vm.table_check[127][0] = false;
		vm.table_check[127][1] = false;
	}

	//シングルイリミでいらない試合の削除
	if (vm.isSingle==true){
		//x_scale*=2;
		x_center=x_center*2-200;
		for (var i=1; i<=125; i++){
			if (open.line[i][0][0].x>0){
				vm.table_check[i][0] = false;
				vm.table_check[i][1] = false;
			}
		}
		vm.table_check[126][0] = false;
		vm.table_check[126][1] = false;
		vm.table_check[127][0] = false;
		vm.table_check[127][1] = false;
	}

	//3位決定戦
	if (vm.isSingle==true && h_number==1 && vm.FORMAT.THIRD==1){

		vm.table_check[125][0] = true;
		vm.table_check[125][1] = true;
		open.treeFormat[125].from1 = -117;
		open.treeFormat[125].from2 = -118;
		open.line[125][0] = [new open_loc(11,1), new open_loc(10,1), new open_loc(10,1.5)];
		open.line[125][1] = [new open_loc(11,2), new open_loc(10,2), new open_loc(10,1.5)];
	}

	var max_x = 0;
	var min_x = 0;
	//X座標最大値・最小値取得
	for (var i=1; i<=127; i++){
		for (var j=0; j<2; j++){
			if (vm.table_check[i][j]==true){
				var wX = open.line[i][j][0].x;
				if (wX<min_x){
					min_x = wX;
				}
				if (wX>max_x && wX!=11){
					max_x = wX;
				}
			}
		}

	}
	max_x++;

	x_scale = 1600/(max_x - min_x);
	x_center = 200 - (x_scale * min_x);

	/*var x_scale = [550/(max_x[0]-min_x[0]+1), 550/(max_x[1]-min_x[1]+1)];// 1600/(max_x - min_x);
	for (var i=1; i<=127; i++){
		for (var j=0; j<2; j++){
			if (vm.table_check[i][j]==true){
				var wX = open.line[i][j][0].x;
				var w_kbn = (wX>0) ? 1 : 0;
				if (w_kbn){
					if (wX==11){
						open.line[i][j][0].x = max_x[1]-min_x[1]+1;
					} else {
						open.line[i][j][0].x-=min_x[1]-1;
					}
				} else {
					open.line[i][j][0].x-=max_x[0]+1;
				}
			}
		}

	}*/

	var gameNo = 0;
	var yLevel = 0;
	var hLevel = 1;
	//var yLevel_x = max_x;
	var yLevel_x = 11;
	var hLevel_x = min_x;
	open.tree = [];
	for (var i=1; i<=127; i++){

		if (vm.table_check[i][0]==true){
			gameNo++;
			open.tree[gameNo] = new open_tree_def(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
			open.tree[gameNo].from1 = open.treeFormat[i].from1;
			open.tree[gameNo].from2 = open.treeFormat[i].from2;

			if (i==126 || (i==123 && vm.isSingle==true)){
				//決勝
				open.tree[gameNo].zone =2;
			} else if (i==127){
				//プレーオフ
				open.tree[gameNo].zone =3;
			} else if (i==125 && vm.isSingle==true && h_number==1 && vm.FORMAT.THIRD==1){
				//3位決定戦
				open.tree[gameNo].zone =4;
			/*} else if (i==125 && vm.isSingle==false){
				//敗者決勝
				open.tree[gameNo].zone =5;*/
			} else if (open.line[i][0][0].x<0){
				open.tree[gameNo].zone =0;
				if (open.line[i][0][0].x>hLevel_x){
					hLevel_x = open.line[i][0][0].x;
					hLevel++;
				}
				open.tree[gameNo].level =hLevel;
			} else {
				open.tree[gameNo].zone =1;
				if (open.line[i][0][1].x<yLevel_x){
					yLevel_x = open.line[i][0][1].x;
					yLevel++;
				}
				open.tree[gameNo].level =yLevel;
			}
			for (var j=i; j<=127; j++){
				if (open.treeFormat[j].from1==i){
					open.treeFormat[j].from1 = gameNo;
				} else if (open.treeFormat[j].from1==-i){
					open.treeFormat[j].from1 = -gameNo;
				}
				if (open.treeFormat[j].from2==i){
					open.treeFormat[j].from2 = gameNo;
				} else if (open.treeFormat[j].from2==-i){
					open.treeFormat[j].from2 = -gameNo;
				}
			}
			for (var j=0; j<2; j++){
				for (var k=0; k<open.line[i][j].length; k++){
					var wX = open.line[i][j][k].x;

					if (wX==11){
						wX = max_x;
					}
					var w_x = parseInt(x_center+wX*x_scale);
					var w_y = parseInt(open.line[i][j][k].y*y_scale+y_base);
					if (k==0){
						//context1.moveTo(w_x,w_y);
						if (j==0){
							open.tree[gameNo].x1 = w_x;
							open.tree[gameNo].y1 = w_y;
						} else {
							open.tree[gameNo].x2 = w_x;
							open.tree[gameNo].y2 = w_y;
						}
					} else {
						//context1.lineTo(w_x,w_y);

					}
				}
			}
		} else {

			for (var j=i; j<=127; j++){
				if (open.treeFormat[j].from1==i){
					open.treeFormat[j].from1 = null;
				} else if (open.treeFormat[j].from1==-i){
					open.treeFormat[j].from1 = null;
				} else if (open.treeFormat[j].from2==i){
					open.treeFormat[j].from2 = null;
				} else if (open.treeFormat[j].from2==-i){
					open.treeFormat[j].from2 = null;
				}
			}

		}

	}
	for (var i=1; i<open.tree.length; i++){
		if (open.tree[i].zone==1){
			if (open.tree[i].from1>0){
				open.tree[i].y1 = (open.tree[open.tree[i].from1].y1 + open.tree[open.tree[i].from1].y2)/2;
			}
			if (open.tree[i].from2>0){
				open.tree[i].y2 = (open.tree[open.tree[i].from2].y1 + open.tree[open.tree[i].from2].y2)/2;
			}
		}
	}




	//エントリーメンバー配置
	var returnArray = open_shuffle(false);
	var idx=0;
	for (var i=1; i<open.tree.length; i++){
		if (open.tree[i].x1<=200){
			open.tree[i].player1 = returnArray[idx];
			idx++;
		}
		if (open.tree[i].x2<=200){
			open.tree[i].player2 = returnArray[idx];
			idx++;
		}
	}
	open_save_Table(open.tree);
}
//トーナメント表表示
function open_showTreeTable(){
	var flg = false;
	open.tree = [];
	var i=1;

	TREE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}}).each(function (r) {

	  open.tree[i] = new open_tree_def(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
		open.tree[i].player1 = r.PLAYER1;
		open.tree[i].player2 = r.PLAYER2;
		open.tree[i].from1 = r.FROM1;
		open.tree[i].from2 = r.FROM2;
		open.tree[i].score1 = r.SCORE1;
		open.tree[i].score2 = r.SCORE2;
		open.tree[i].x1 = r.X1;
		open.tree[i].x2 = r.X2;
		open.tree[i].y1 = r.Y1;
		open.tree[i].y2 = r.Y2;
		open.tree[i].zone = r.ZONE;
		open.tree[i].level = r.LEVEL;

		x_center = r.X_CENTER;

		if (open.tree[i].player1!=null && open.tree[i].player2!=null){
			if ((open.tree[i].score1==null && open.tree[i].score2==null) ||
				(open.tree[i].score1==0 && open.tree[i].score2==0)){
				flg = true;
			}
		}

		//脱落者決定

		if (vm.isSingle==true || (vm.isSingle==false && (open.tree[i].zone==1 || open.tree[i].zone==3))){
			if (open.tree[i].score1!=null && open.tree[i].score2!=null){
				var winner = open_getTreeWinner(i);
				if (winner==1){
					vm.ENTRIES[open.tree[i].player2].PLAY = -1;
				} else if (winner==2){
					vm.ENTRIES[open.tree[i].player1].PLAY = -1;
				}
			}
		}

	   i++
	});
	if (flg==false){
	 	switch (vm.FORMAT.STATUS){
	 		case 0:
	 			vm.isShowFin = false;
	 		case 1:
	 			vm.isShowFin = vm.nIsHonsen ?  false : true;
	 			break;
	 		case 2:
	 			vm.isShowFin = false;
	 			break;
	 		case 3:
	 			vm.isShowFin = vm.nIsHonsen ?  true : false;
	 			break;
	 		case 4:
	 			vm.isShowFin = false;
				vm.isShowResult = true;
				break;
	 	}
	 	vm.isShowFootArea = false;
	 } else {
	 	switch (vm.FORMAT.STATUS){
	 		case 0:
	 			vm.isShowFootArea = false;
	 			break;
	 		case 1:
	 			vm.isShowFootArea = true;
	 			break;
	 		case 2:
	 			vm.isShowFootArea = false;
	 			break;
	 		case 3:
	 			vm.isShowFootArea = true;
	 			break;
	 		case 4:
	 			vm.isShowFootArea = false;
				vm.isShowResult = true;
				break;
	 	}
	 	vm.isShowFin = false;
	 }
	 open_procShowTreeTable();
}
function open_procShowTreeTable(){
	console.debug("center", x_center);
	//var x_scale = 1600/19;
	//var y_scale = 32;
	var y_base = 60;

	//x最大値取得
	var max_x = [-1000,1000];
	for (var i=1; i<open.tree.length; i++){
		if (open.tree[i].zone!=4){
			var w_kbn = (open.tree[i].zone==1 || open.tree[i].zone==3 || open.tree[i].zone==5 ) ? 1 : 0;
			var w_x1 = open.tree[i].x1;
			var w_x2 = open.tree[i].x2;
			if (w_kbn){
				max_x[1] = max_x[1]>w_x1 ? w_x1 : max_x[1];
				max_x[1] = max_x[1]>w_x2 ? w_x2 : max_x[1];
			} else {
				max_x[0] = max_x[0]<w_x1 ? w_x1 : max_x[0];
				max_x[0] = max_x[0]<w_x2 ? w_x2 : max_x[0];
			}
		}
	}

	context.clearRect(0,0,canvas.width,canvas.height);

	context.fillStyle = "white";
	context.fillRect(0,0,2000,2600);

	context.font = "28px Arial";

	if (vm.isSingle==false){
		context.fillStyle = "green";
		context.fillText(W[41], 400, 40);
		context.fillStyle = "red";
		context.fillText(W[42], 1400, 40);
	}

	//vm.entryNum = vm.ENTRIES.length;

	//context1.fillStyle = "Dodgerblue";
	//context1.strokeStyle = "DarkSlategray";

	context.beginPath();
	for (var i=1; i<open.tree.length; i++){
		var wX1 = open.tree[i].x1;
		var wY1 = open.tree[i].y1;
		var wX2 = open.tree[i].x2;
		var wY2 = open.tree[i].y2;
		var wX_next	= 0;
		var wY_next = 0;
		var winner = 0;
		//var yh_kbn = (open.tree[i].zone==1 || open.tree[i].zone==3 || open.tree[i].zone==4  | open.tree[i].zone==5) ? 1 : 0;
		//player1 名前表示
		if (wX1<=200 || wX1==1800){
			if (open.tree[i].player1!=null){
				var flg=false;
				if (open.tree[i].zone==0){
					for (var j=i; j<open.tree.length; j++){
						if (open.tree[j].zone==1 && (open.tree[j].player1 == open.tree[i].player1 || open.tree[j].player2 == open.tree[i].player1)){
							flg = true;
							break;
						}
					}
				}
				if (flg==true ){
					context.fillStyle = open_getPlayColor(-1);
				} else {
					context.fillStyle = open_getPlayColor(vm.ENTRIES[open.tree[i].player1].PLAY);
				}
				context.fillText(vm.ENTRIES[open.tree[i].player1].NAME, 20+open.tree[i].zone*1800, wY1+10);

			}
		}
		//player2 名前表示
		if (wX2<=200 || wX2==1800){
			if (open.tree[i].player2!=null){

				var flg=false;
				if (open.tree[i].zone==0){
					for (var j=i; j<open.tree.length; j++){
						if (open.tree[j].zone==1 && (open.tree[j].player1 == open.tree[i].player2 || open.tree[j].player2 == open.tree[i].player2)){
							flg = true;
							break;
						}
					}
				}
				if (flg==true){
					context.fillStyle = open_getPlayColor(-1);
				} else {
					context.fillStyle = open_getPlayColor(vm.ENTRIES[open.tree[i].player2].PLAY);
				}
				if (open.tree[i].zone==3 || open.tree[i].zone==1){
					context.fillText(vm.ENTRIES[open.tree[i].player2].NAME, 1800, wY2+10);
				} else {
					context.fillText(vm.ENTRIES[open.tree[i].player2].NAME, 20, wY2+10);
				}
			}
		}
		//決勝
		if (open.tree[i].zone==2 && vm.isSingle==false){
			wX_next = -100; //(wX1+wX2)/2;
			if (wY1>wY2){
				wY_next = wY2;
			} else {
				wY_next = wY1;
			}
			var winnerNm ="";
			if (open.tree[i].score1!=null){
				var wHandy1;
				var wHandy2;
				wHandy1 = open_getHandy(open.tree[i].player1);
				wHandy2 = open_getHandy(open.tree[i].player2);
				winner = open_getWinner(open.tree[i].score1,open.tree[i].score2,wHandy1,wHandy2);
				/*
				if (open.tree[i].score1 == wHandy1){
					winnerNm = vm.ENTRIES[open.tree[i].player1].NAME;
					winner = 1;
				} else if (i!=open.tree.length){
					//プレーオフあり
					if (open.tree[i+1].player1!=null){
						if (open.tree[i+1].score1 == vm.ENTRIES[open.tree[i+1].player1].H_HANDY && open.tree[i+1].score1!=null){
							winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
							winner = 2;
						}
					}
				} else if (open.tree[i].score2 == wHandy2) {
					winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
					winner = 2;
				}
				*/
				if (winner == 1){
					winnerNm = vm.ENTRIES[open.tree[i].player1].NAME;
				} else if (winner==2){
					if (vm.tType==2){
						if (i!=open.tree.length){
							//プレーオフあり
							if (open.tree[i+1].player1!=null){
								var w_Handy1 = open_getHandy(open.tree[i+1].player1);
								var w_Handy2 = open_getHandy(open.tree[i+1].player2);
								var w_winner = open_getWinner(open.tree[i+1].score1,open.tree[i+1].score2,w_Handy1,w_Handy2);
								if (w_winner==1){
									winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
								} else if (w_winner==2){
									winner = 1;
									winnerNm = vm.ENTRIES[open.tree[i].player1].NAME;
								} else {
									winner = 0;
								}
							} else {
								winner = 0;
							}
						} else {
							winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
						}
					} else {
						winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
					}
				}
			}

			//勝者ゾーンライン
			if (winner!=1){
				context.lineWidth = 4;
				context.strokeStyle = "DarkSlategray";
			} else {
				context.lineWidth = 4;
				context.strokeStyle = "red";
			}
			context.beginPath();
			move(wX1, wY1);
			line(wX_next,wY_next);
			context.stroke();
			//勝者ゾーン敗者ライン
			if (winner!=2){
				context.lineWidth = 4;
				context.strokeStyle = "DarkSlategray";
			} else {
				context.lineWidth = 4;
				context.strokeStyle = "red";
			}
			context.beginPath();
			move(wX_next,wY_next);
			line(wX2,wY2);
			context.stroke();
			//上ちょんライン
			if (winner==0){
				context.lineWidth = 4;
				context.strokeStyle = "DarkSlategray";
			} else {
				context.lineWidth = 4;
				context.strokeStyle = "red";
			}
			context.beginPath();
			move(wX_next,wY_next);
			line(wX_next,wY_next-20);
			context.stroke();
			rect(700,wY_next-60,400,60);
			context.fillStyle = "black";
			filltext(winnerNm, 760, wY_next-30);
		//プレーオフ
		} else if (open.tree[i].zone==3){
			/*if (open.tree[i].player1 == open.tree[i-1].player2 && open.tree[i].player1!=null ){
				if (open.tree[i-1].y1>open.tree[i-1].y2){
					wY_next = open.tree[i-1].y2;
				} else {
					wY_next = open.tree[i-1].y1;
				}
				var w_Handy1 = open_getHandy(open.tree[i].player1, open.tree[i].zone);
				var w_Handy2 = open_getHandy(open.tree[i].player2, open.tree[i].zone);
				var w_winner = open_getWinner(open.tree[i].score1,open.tree[i].score2,w_Handy1,w_Handy2);
				if (w_winner==2 && open.tree[i].score2!=null){
					winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
					context[yh_kbn].fillStyle = "black";
					filltext(yh_kbn, winnerNm, 760, 76); //context[yh_kbn].fillText(winnerNm, 760, 76);
					context[yh_kbn].lineWidth = 4;
					context[yh_kbn].strokeStyle = "red";
					wY_next = 100;
				} else {
					context[yh_kbn].lineWidth = 2;
					context[yh_kbn].strokeStyle = "DarkSlategray";
				}*/


				/*context[yh_kbn].beginPath();
				context[yh_kbn].moveTo(wX2,wY2);
				context[yh_kbn].lineTo((wX1+open.tree[i-1].x1)/2,wY2);
				context[yh_kbn].lineTo((wX1+open.tree[i-1].x1)/2,wY_next);
				context[yh_kbn].stroke();*/
			//}

		} else {
			//次の試合の起点座標取得
			for (var j=i; j<open.tree.length; j++){
				if (open.tree[j].from1==i){

					wX_next = open.tree[j].x1;
					wY_next = open.tree[j].y1;
					if (open.tree[j].player1!=null){
						if (open.tree[j].player1 == open.tree[i].player1){
							winner = 1;
						} else if (open.tree[j].player1 == open.tree[i].player2){
							winner = 2;
						}
					}
				} else if (open.tree[j].from2==i){
					wX_next = open.tree[j].x2;
					wY_next = open.tree[j].y2;
					if (open.tree[j].player2!=null){
						if (open.tree[j].player2 == open.tree[i].player1){
							winner = 1;
						} else if (open.tree[j].player2 == open.tree[i].player2){
							winner = 2;
						}
					}
				}
			}
			//if (wX_next==0 || open.tree[i].zone==5){
			if (wX_next==0){
				var winnerNm ="";
				if (wY_next==0){
					wY_next = (wY1+wY2)/2;
				}
				if (open.tree[i].score1!=null){
					var wHandy1;
					var wHandy2;
					wHandy1 = open_getHandy(open.tree[i].player1);
					wHandy2 = open_getHandy(open.tree[i].player2);
					winner = open_getWinner(open.tree[i].score1,open.tree[i].score2,wHandy1,wHandy2);

					if (winner==1){
						winnerNm = vm.ENTRIES[open.tree[i].player1].NAME;
					} else if (winner==2) {
						winnerNm = vm.ENTRIES[open.tree[i].player2].NAME;
					}
				}
				/*if (open.tree[i].zone==5){
					//敗者決勝

				} else if (open.tree[i].zone!=1){*/
				if (open.tree[i].zone!=1){
					//wX_next = Math.max(wX1, wX2) + 200;
					wX_next = x_center - 250; //Math.max(wX1, wX2) + 200; //-250;
					if (winnerNm!=""){
						context.fillStyle = "black";
						filltext(winnerNm, wX_next+30, wY_next+10);
						context.lineWidth = 4;
						context.strokeStyle = "red";
					} else {
						context.lineWidth = 4;
						context.strokeStyle = "DarkSlategray";
					}
					rect(wX_next+20,wY_next-20,200,40);
				} else {
					//wX_next = Math.min(wX1, wX2) - 200;
					wX_next = x_center + 250; //Math.min(wX1, wX2) - 200; //250;
					if (winnerNm!=""){
						context.fillStyle = "black";
						filltext(winnerNm, wX_next-210, wY_next+10);
						context.lineWidth = 4;
						context.strokeStyle = "red";
					} else {
						context.lineWidth = 4;
						context.strokeStyle = "DarkSlategray";
					}
					rect(wX_next-220,wY_next-20,200,40);
				}
			}
			if (wX_next!=0){
				//wY_next = (wY1+wY2)/2;
				if (winner!=1){
					context.lineWidth = 4;
					context.strokeStyle = "DarkSlategray";
				} else {
					context.lineWidth = 4;
					context.strokeStyle = "red";
				}
				context.beginPath();
				move(wX1,wY1);
				line(wX_next,wY1);
				line(wX_next,wY_next);
				context.stroke();
				if (winner!=2){
					context.lineWidth = 4;
					context.strokeStyle = "DarkSlategray";
				} else {
					context.lineWidth = 4;
					context.strokeStyle = "red";
				}
				context.beginPath();
				move(wX2,wY2);
				line(wX_next,wY2);
				line(wX_next,wY_next);
				context.stroke();
			}
		}
	}
}
function move(x, y){
	context.moveTo(x,y);
}
function line(x, y){
	context.lineTo(x,y);
}
function filltext(str, x,y){
	context.fillText(str, x, y);
}
function rect(x,y,w,h){
	context.strokeRect(x,y,w,h);
}
function open_setTreeY(ss,ee){

	var yy = 0;
	for (var i=ss; i<=ee; i++){
		for (var j=0; j<2; j++){
			if (vm.table_check[i][j] == true){
				yy++;
				open.line[i][j][0].y =yy;
				open.line[i][j][1].y =yy;
			}
		}
	}
}
function open_setTreeY2(xx){
	for (var i=1; i<=125; i++){

		if (vm.table_check[i][0] == true && vm.table_check[i][1] == true && open.line[i][0][0].x>0){
			//if (vm.table_check[Math.abs(open.treeFormat[i].from1)][0] ==false){
			if (open.treeFormat[i].from1<0){
				open.line[i][0][0].x =xx;
			} else if (vm.table_check[open.treeFormat[i].from1][0] ==false){
				open.line[i][0][0].x =xx;
			}
			//if (vm.table_check[Math.abs(open.treeFormat[i].from2)][0] ==false){
			if (open.treeFormat[i].from2<0){
				open.line[i][1][0].x =xx;
			}
		}
	}
	var sortArray = new Array(20);
	var k = 0;
	for (var i=1; i<=127; i++){
		if (vm.table_check[i][0] == true && vm.table_check[i][1] == true){
			for (var j=0; j<2; j++){
				if (open.line[i][j][0].x ==xx){
					sortArray[k] = ("000" + open.line[i][j][0].y).substr(-3);
					k++;

				}
			}
		}
	}
	sortArray.sort();

	for (var i=1; i<=127; i++){
		if (vm.table_check[i][0] == true && vm.table_check[i][1] == true){
			for (var j=0; j<2; j++){
				if (open.line[i][j][0].x ==xx){
					for (var k =0; k<sortArray.length; k++){
						if (sortArray[k] == open.line[i][j][0].y){
							open.line[i][j][0].y =k+1;
							open.line[i][j][1].y =k+1;
							break;
						}
					}
				}
			}
			open_setTreeCenter(i);
		}
	}
	/*for (var i=1; i<=125; i++){
		if (vm.table_check[i][0] == true && vm.table_check[i][1] == true){
			open_setTreeCenter(i)
		}
	}		*/
}
function open_setTreeCenter(i){
	var centerY = (open.line[i][0][1].y + open.line[i][1][1].y) /2;
	var centerX = open.line[i][0][1].x;
	try{
		open.line[i][0][2].y = centerY;
		open.line[i][1][2].y = centerY;
		for (var j=i+1; j<=127; j++){
			if (open.treeFormat[j].from1 ==i){
				open.line[j][0][0].x = centerX;
				open.line[j][0][0].y = centerY;
				open.line[j][0][1].y = centerY;
				break;
			} else if (open.treeFormat[j].from2 ==i){
				open.line[j][1][0].y = centerX;
				open.line[j][1][0].y = centerY;
				open.line[j][1][1].y = centerY;
				break;
			}
		}
	}catch( e ){
	  //alert( i );
	}
}
///	///	///	///	///	///	///	///	///	///	/////				リーグ表描画				///
function getLeagueTable(players){
	var ret = [];
	switch (players){
	case 3:
		ret[0] = [2,3];
		ret[1] = [1,3];
		ret[2] = [1,2];
		break;
	case 4:
		ret[0] = [2,4];
		ret[1] = [1,3];
		ret[2] = [2,3];
		ret[3] = [1,4];
		ret[4] = [3,4];
		ret[5] = [1,2];
		break;
	case 5:
		ret[0] = [2,5];
		ret[1] = [3,4];
		ret[2] = [1,5];
		ret[3] = [3,2];
		ret[4] = [1,4];
		ret[5] = [3,5];
		ret[6] = [4,2];
		ret[7] = [3,1];
		ret[8] = [4,5];
		ret[9] = [1,2];
		break;
	case 6:
		ret[0] = [3,4];
		ret[1] = [2,5];
		ret[2] = [1,6];
		ret[3] = [2,3];
		ret[4] = [6,4];
		ret[5] = [1,5];
		ret[6] = [6,2];
		ret[7] = [5,3];
		ret[8] = [1,4];
		ret[9] = [5,6];
		ret[10] = [4,2];
		ret[11] = [1,3];
		ret[12] = [4,5];
		ret[13] = [3,6];
		ret[14] = [1,2];
		break;
	case 7:
		ret[0] = [2,4];
		ret[1] = [3,6];
		ret[2] = [5,7];
		ret[3] = [4,1];
		ret[4] = [2,6];
		ret[5] = [3,7];
		ret[6] = [1,5];
		ret[7] = [4,6];
		ret[8] = [2,7];
		ret[9] = [3,5];
		ret[10] = [6,1];
		ret[11] = [4,7];
		ret[12] = [2,5];
		ret[13] = [1,3];
		ret[14] = [6,7];
		ret[15] = [4,5];
		ret[16] = [2,3];
		ret[17] = [1,7];
		ret[18] = [5,6];
		ret[19] = [3,4];
		ret[20] = [1,2];
		break;
	case 8:
		ret[0] = [4,5];
		ret[1] = [3,6];
		ret[2] = [2,7];
		ret[3] = [1,8];
		ret[4] = [3,4];
		ret[5] = [2,5];
		ret[6] = [8,6];
		ret[7] = [1,7];
		ret[8] = [2,3];
		ret[9] = [8,4];
		ret[10] = [7,5];
		ret[11] = [1,6];
		ret[12] = [8,2];
		ret[13] = [7,3];
		ret[14] = [6,4];
		ret[15] = [1,5];
		ret[16] = [7,8];
		ret[17] = [6,2];
		ret[18] = [5,3];
		ret[19] = [1,4];
		ret[20] = [6,7];
		ret[21] = [5,8];
		ret[22] = [4,2];
		ret[23] = [1,3];
		ret[24] = [5,6];
		ret[25] = [4,7];
		ret[26] = [3,8];
		ret[27] = [1,2];
		break;
	case 9:
		ret[0] = [2,4];
		ret[1] = [3,6];
		ret[2] = [5,8];
		ret[3] = [7,9];
		ret[4] = [4,1];
		ret[5] = [2,6];
		ret[6] = [3,8];
		ret[7] = [5,9];
		ret[8] = [1,7];
		ret[9] = [4,6];
		ret[10] = [2,8];
		ret[11] = [3,9];
		ret[12] = [5,7];
		ret[13] = [6,1];
		ret[14] = [4,8];
		ret[15] = [2,9];
		ret[16] = [3,7];
		ret[17] = [1,5];
		ret[18] = [6,8];
		ret[19] = [4,9];
		ret[20] = [2,7];
		ret[21] = [3,5];
		ret[22] = [8,1];
		ret[23] = [6,9];
		ret[24] = [4,7];
		ret[25] = [2,5];
		ret[26] = [1,3];
		ret[27] = [8,9];
		ret[28] = [6,7];
		ret[29] = [4,5];
		ret[30] = [2,3];
		ret[31] = [9,1];
		ret[32] = [7,8];
		ret[33] = [5,6];
		ret[34] = [3,4];
		ret[35] = [1,2];
		break;
	case 10:
		ret[0] = [5,6];
		ret[1] = [4,7];
		ret[2] = [3,8];
		ret[3] = [2,9];
		ret[4] = [1,10];
		ret[5] = [4,5];
		ret[6] = [3,6];
		ret[7] = [2,7];
		ret[8] = [10,8];
		ret[9] = [1,9];
		ret[10] = [3,4];
		ret[11] = [2,5];
		ret[12] = [10,6];
		ret[13] = [9,7];
		ret[14] = [1,8];
		ret[15] = [2,3];
		ret[16] = [10,4];
		ret[17] = [9,5];
		ret[18] = [8,6];
		ret[19] = [1,7];
		ret[20] = [10,2];
		ret[21] = [9,3];
		ret[22] = [8,4];
		ret[23] = [7,5];
		ret[24] = [1,6];
		ret[25] = [9,10];
		ret[26] = [8,2];
		ret[27] = [7,3];
		ret[28] = [6,4];
		ret[29] = [1,5];
		ret[30] = [8,9];
		ret[31] = [7,10];
		ret[32] = [6,2];
		ret[33] = [5,3];
		ret[34] = [1,4];
		ret[35] = [7,8];
		ret[36] = [6,9];
		ret[37] = [5,10];
		ret[38] = [4,2];
		ret[39] = [1,3];
		ret[40] = [6,7];
		ret[41] = [5,8];
		ret[42] = [4,9];
		ret[43] = [3,10];
		ret[44] = [1,2];
		break;
	case 11:
		ret[0] = [2,4];
		ret[1] = [3,6];
		ret[2] = [5,8];
		ret[3] = [7,10];
		ret[4] = [9,11];
		ret[5] = [4,1];
		ret[6] = [2,6];
		ret[7] = [3,8];
		ret[8] = [5,10];
		ret[9] = [7,11];
		ret[10] = [1,9];
		ret[11] = [4,6];
		ret[12] = [2,8];
		ret[13] = [3,10];
		ret[14] = [5,11];
		ret[15] = [7,9];
		ret[16] = [6,1];
		ret[17] = [4,8];
		ret[18] = [2,10];
		ret[19] = [3,11];
		ret[20] = [5,9];
		ret[21] = [1,7];
		ret[22] = [6,8];
		ret[23] = [4,10];
		ret[24] = [2,11];
		ret[25] = [3,9];
		ret[26] = [5,7];
		ret[27] = [8,1];
		ret[28] = [6,10];
		ret[29] = [4,11];
		ret[30] = [2,9];
		ret[31] = [3,7];
		ret[32] = [1,5];
		ret[33] = [8,10];
		ret[34] = [6,11];
		ret[35] = [4,9];
		ret[36] = [2,7];
		ret[37] = [3,5];
		ret[38] = [10,1];
		ret[39] = [8,11];
		ret[40] = [6,9];
		ret[41] = [4,7];
		ret[42] = [2,5];
		ret[43] = [1,3];
		ret[44] = [10,11];
		ret[45] = [8,9];
		ret[46] = [6,7];
		ret[47] = [4,5];
		ret[48] = [2,3];
		ret[49] = [11,1];
		ret[50] = [9,10];
		ret[51] = [7,8];
		ret[52] = [5,6];
		ret[53] = [3,4];
		ret[54] = [1,2];
		bresk;
	case 12:
		ret[0] = [6,7];
		ret[1] = [5,8];
		ret[2] = [4,9];
		ret[3] = [3,10];
		ret[4] = [2,11];
		ret[5] = [1,12];
		ret[6] = [5,6];
		ret[7] = [4,7];
		ret[8] = [3,8];
		ret[9] = [2,9];
		ret[10] = [12,10];
		ret[11] = [1,11];
		ret[12] = [4,5];
		ret[13] = [3,6];
		ret[14] = [2,7];
		ret[15] = [12,8];
		ret[16] = [11,9];
		ret[17] = [1,10];
		ret[18] = [3,4];
		ret[19] = [2,5];
		ret[20] = [12,6];
		ret[21] = [11,7];
		ret[22] = [10,8];
		ret[23] = [1,9];
		ret[24] = [2,3];
		ret[25] = [12,4];
		ret[26] = [11,5];
		ret[27] = [10,6];
		ret[28] = [9,7];
		ret[29] = [1,8];
		ret[30] = [12,2];
		ret[31] = [11,3];
		ret[32] = [10,4];
		ret[33] = [9,5];
		ret[34] = [8,6];
		ret[35] = [1,7];
		ret[36] = [11,12];
		ret[37] = [10,2];
		ret[38] = [9,3];
		ret[39] = [8,4];
		ret[40] = [7,5];
		ret[41] = [1,6];
		ret[42] = [10,11];
		ret[43] = [9,12];
		ret[44] = [8,2];
		ret[45] = [7,3];
		ret[46] = [6,4];
		ret[47] = [1,5];
		ret[48] = [9,10];
		ret[49] = [8,11];
		ret[50] = [7,12];
		ret[51] = [6,2];
		ret[52] = [5,3];
		ret[53] = [1,4];
		ret[54] = [8,9];
		ret[55] = [7,10];
		ret[56] = [6,11];
		ret[57] = [5,12];
		ret[58] = [4,2];
		ret[59] = [1,3];
		ret[60] = [7,8];
		ret[61] = [6,9];
		ret[62] = [5,10];
		ret[63] = [4,11];
		ret[64] = [3,12];
		ret[65] = [1,2];
		break;
	}
	return ret;
}
function open_setLeagueTable(){
	open_get_entryNum();
	if (vm.entryNum/open.groups>12){
		alert(M[13]);
		gotoHome();
		return;
	} else if (vm.entryNum/open.groups<3){
		alert(M[14]);
		gotoHome();
		return;
	}
	group = new Array(open.groups);
	var widx = new Array(open.groups);
	for (var i=0; i<open.groups; i++){
		group[i] = [];
		widx[i] = 0;
	}
	//var member = open_shuffle(true);
	var member = new Array(vm.ENTRIES.length);
	var wchk = new Array(vm.ENTRIES.length);
	for (var i=0; i<vm.ENTRIES.length; i++){
		wchk[i] = false;
	}
	for (var i=0; i<vm.entryNum; i++){
		var wmax = -1;
		var wplayer;
		for (var j=0; j<vm.ENTRIES.length; j++){
			if (wchk[j]==false && vm.ENTRIES[j].RANK==null){
				value = vm.ENTRIES[j].SKILL;
				if (wmax<value){
					wmax = value;
					wplayer = j;
				}
			}
		}
		member[i] = wplayer;
		wchk[wplayer] = true;
	}
	var loop1 = Math.ceil((vm.entryNum)/open.groups);
	for (var i=0; i<loop1; i++){
		wchk = new Array(open.groups);
		for (var j=0; j<open.groups; j++){
			wchk[j] = false;
		}
		if (i==Math.ceil((vm.entryNum)/open.groups)-1){
			var loop2 = vm.entryNum % open.groups;
			if (loop2==0){
				loop2 = open.groups;
			}
			for (var j=0; j<loop2; j++){
				var wnum;
				do {
					wnum = Math.floor(Math.random()*open.groups);
				} while (wchk[wnum]==true);
				var wplayer = i*open.groups + j;
				group[wnum][widx[wnum]] = new group_def(member[wplayer],vm.ENTRIES[member[wplayer]].SKILL, vm.ENTRIES[member[wplayer]].NAME);
				wchk[wnum] = true;
				widx[wnum]++;
			}
		} else {
			for (var j=0; j<open.groups; j++){
				var wnum;
				do {
					wnum = Math.floor(Math.random()*open.groups);
				} while (wchk[wnum]==true);
				var wplayer = i*open.groups + j;
				group[wnum][widx[wnum]] = new group_def(member[wplayer],vm.ENTRIES[member[wplayer]].SKILL, vm.ENTRIES[member[wplayer]].NAME);
				wchk[wnum] = true;
				widx[wnum]++;
			}
		}
	}

	var idx = 0;
	open.league = [];
	for (var i=0; i<open.groups; i++){
		var wTable = getLeagueTable(group[i].length);
		for (var j=0; j<wTable.length; j++){
			//var work = group[i][wTable[j][0]].player;
			//var work = group[i][wTable[j][1]].player;
			open.league[idx] = new open_league_def(i,j, group[i][wTable[j][0]-1].player, group[i][wTable[j][1]-1].player,null, null);
			idx++;
		}
	}

	open_save_Table(open.league);
	showLeagueTable();
}
function showLeagueTable(){
	//alert("ss" + d + "ss");
	open.isFin = false;
	 /*
	 var s="";
	 alert(data.length);
	 for (var i=0; i<data.length; i++){
		s+=data[i].grp+"," +data[i].no+"\n";
	 }
	 alert(s);
	 */
	 var flg = false;
	 open.league = [];
	 var i=0;
	 LEAGUE({T_CD:{'==':t_cd}, HONSEN:{'==':vm.nIsHonsen}}).each(function (r) {

		open.league[i] = new open_league_def(null, null, null, null, null, null);
		open.league[i].player1 = r.PLAYER1;
		open.league[i].player2 = r.PLAYER2;
		open.league[i].score1 = r.SCORE1;
		open.league[i].score2 = r.SCORE2;
		open.league[i].no = r.NO;
		open.league[i].grp = r.GRP;

		if (open.league[i].score1==null || (open.league[i].score1==0 && open.league[i].score2==0)){
			flg = true;
		}
		i++;
	 });
	if (flg==false){
	 	switch (vm.FORMAT.STATUS){
	 		case 0:
	 			vm.isShowFin = false;
	 		case 1:
	 			vm.isShowFin = vm.nIsHonsen ?  false : true;
	 			break;
	 		case 2:
	 			vm.isShowFin = false;
	 			break;
	 		case 3:
	 			vm.isShowFin = vm.nIsHonsen ?  true : false;
	 			break;
	 		case 4:
	 			vm.isShowFin = false;
				vm.isShowResult = true;
				break;
	 	}
	 	vm.isShowFootArea = false;
	 	open.isFin = true;
	 } else {
	 	switch (vm.FORMAT.STATUS){
	 		case 0:
	 			vm.isShowFootArea = false;
	 			break;
	 		case 1:
	 			vm.isShowFootArea = true;
	 			break;
	 		case 2:
	 			vm.isShowFootArea = false;
	 			break;
	 		case 3:
	 			vm.isShowFootArea = true;
	 			break;
	 		case 4:
	 			vm.isShowFootArea = false;
				vm.isShowResult = true;
				break;
	 	}
	 	vm.isShowFin = false;
	 	open.isFin = false;
	 }
	 procShowLeagueTable();
}
function procShowLeagueTable(){
	var s="";
	var wgrpPlayer = [];
	grpPlayer = [];
	var grp = -1;
	for (var i=0; i<open.league.length; i++){
		if (open.league[i].grp>grp){
			grp = open.league[i].grp;
			wgrpPlayer[grp] = new Array();
		}
		if (wgrpPlayer[grp].indexOf(open.league[i].player1)==-1){
			wgrpPlayer[grp].push(open.league[i].player1);
		}
		if (wgrpPlayer[grp].indexOf(open.league[i].player2)==-1){
			wgrpPlayer[grp].push(open.league[i].player2);
		}

	}

	//クラス・rating順sort
	for (var i=0; i<=grp; i++){
		grpPlayer[i] = new Array(wgrpPlayer[i].length);	//new Array(grp+1);
		var wchk = new Array(wgrpPlayer[i].length);	//new Array(grp+1);
		for (var j=0; j<wgrpPlayer[i].length; j++){
			wchk[j] = false;
		}
		for (var j=0; j<wgrpPlayer[i].length; j++){
			var max = -1;
			var idx;
			for (var k=0; k<wgrpPlayer[i].length; k++){
				if (wchk[k] == false){
					var value = vm.ENTRIES[wgrpPlayer[i][k]].SKILL;
					if (value>max){
						max = value;
						idx = k;
					}
				}
			}
			wchk[idx] = true;
			grpPlayer[i][j] = wgrpPlayer[i][idx];
		}

	}

	vm.table = {
	 	grps: []
	};

	for (var i=0; i<grpPlayer.length; i++){
		vm.table.grps.push({
			rows: []
			,btn_theme: "button-stable"
		});
		for (var j=0; j<grpPlayer[i].length; j++){
			vm.table.grps[i].rows.push({
				name: vm.ENTRIES[grpPlayer[i][j]].NAME,
				color: "black",
				cols: []
			});
			for (var k=0; k<grpPlayer[i].length; k++){
				vm.table.grps[i].rows[j].cols.push({text:'', color:''});
			}
		}
	}


	/*for (var i=0; i<grpPlayer.length; i++){
		s+="<button id='btnResult" + i + "' class='button' onclick='showSelectPlayerPop(" + i + ");' >" + msg(27) + "</button>";
		s+="<table border='1' width='100%'><tr>";
		s+="<th style='width:15%; background:gray; color:white;'>Group" + (i+1) + "</th>";
		for (var j=0; j<grpPlayer[i].length;j++){
			s+="<th style='text-overflow: ellipsis; width:" + (85/grpPlayer[i].length)+ "%;' class='leaguePlayer" + i + "-" + j + "'>" + vm.ENTRIES[grpPlayer[i][j]].NAME + "</th>";
		}
		s+="</tr>";
		for (var j=0; j<grpPlayer[i].length;j++){
			s+="<tr><th class='leaguePlayer" + i + "-" + j + "'>" + vm.ENTRIES[grpPlayer[i][j]].NAME +"</th>";
			for (var k=0; k<grpPlayer[i].length;k++){
				if (j==k){
					s+="<td>----</td>";
				} else {
					s+="<td id='open_league_td" + i + "-" + j + "-" + k +"'></td>";
				}
			}
			s+="</tr>";
		}
		s+="</table><br>";
	}*/

	//$('#open_league').html(s);

	//セル値書き込み

	for (var i=0; i<open.league.length; i++){
		if (open.league[i].score1!=null){
			var wgrp = open.league[i].grp;
			var wplayer1 = -1;
			var wplayer2 = -1;
			//player1取得
			for (var j=0; j<grpPlayer[wgrp].length; j++){
				if (open.league[i].player1 == grpPlayer[wgrp][j]){
					wplayer1 = j;
				}
			}
			//player2取得
			for (var j=0; j<grpPlayer[wgrp].length; j++){
				if (open.league[i].player2 == grpPlayer[wgrp][j]){
					wplayer2 = j;
				}
			}
			if (wplayer1>=0 && wplayer2>=0){
				if (open.league[i].score1==0 && open.league[i].score2==0){
					//試合中

					var play = vm.ENTRIES[open.league[i].player1].PLAY;
					var wcolor = open_getPlayColor(play);
					//$('#open_league_td'+wgrp+"-"+wplayer1+"-"+wplayer2).css("color",wcolor).text(msg(65));
					//$('#open_league_td'+wgrp+"-"+wplayer2+"-"+wplayer1).css("color",wcolor).text(msg(65));
					vm.table.grps[wgrp].rows[wplayer1].cols[wplayer2] = {text:"", color:wcolor};

					vm.table.grps[wgrp].rows[wplayer2].cols[wplayer1] = {text:"", color:wcolor};

				} else {
					//確定試合
					var wHandy1;
					var wHandy2;
					var wstr1="×";
					var wstr2="×";
					wHandy1 = open_getHandy(open.league[i].player1);
					wHandy2 = open_getHandy(open.league[i].player2);
					var winner = open_getWinner(open.league[i].score1,open.league[i].score2,wHandy1,wHandy2);

					if (winner==1){
						wstr1="W"; //"○";
					} else if (winner==2) {
						wstr2="W"; //"○";
					}
					var wcolor = "black";
					//$('#open_league_td'+wgrp+"-"+wplayer1+"-"+wplayer2).css("color",wcolor).text(wstr1+"(" + open.league[i].score1 + "-" + open.league[i].score2 + ")");
					//$('#open_league_td'+wgrp+"-"+wplayer2+"-"+wplayer1).css("color",wcolor).text(wstr2+"(" + open.league[i].score2 + "-" + open.league[i].score1 + ")");
					vm.table.grps[wgrp].rows[wplayer1].cols[wplayer2] = {text:wstr1, color:""};
					vm.table.grps[wgrp].rows[wplayer2].cols[wplayer1] = {text:wstr2, color:""};
				}
			}
		}
	}
	if (open.isFin==true){
		//if (vm.nIsHonsen==0 && vm.FORMAT.STATUS==1){
		if (vm.nIsHonsen==0){
			setLeagueYosenResult();
		} else if (vm.nIsHonsen==1 && vm.FORMAT.STATUS==3){
			setLeagueHonsenResult();
			showHonsenResultLeague();
		}
	} else {
		for (var i=0; i<open.groups; i++){
			//$('#btnResult'+i).removeClass("none").addClass("none");
			cssHide('#btnResult'+i);
		}
	}
	alert("ok");
}
//予選結果セット
function setLeagueYosenResult(){
	var wRank;
	var wWinner;
	var wLooser;
	var leagueWinner = parseInt(vm.FORMAT['H_NUMBER'])/open.groups;
	result = [];
	vm.grpRank = [];
	for (var i=0; i<vm.ENTRIES.length; i++){
		open.result[i] = new result_def(0,0,0,0,0,0,0);
	}
	for (var i=0; i<open.league.length; i++){
		var wPlayer1 = open.league[i].player1;
		var wPlayer2 = open.league[i].player2;
		var wHandy1 = open_getHandy(wPlayer1);
		var wHandy2 = open_getHandy(wPlayer2);
		var winner = open_getWinner(open.league[i].score1,open.league[i].score2,wHandy1,wHandy2);
		if (winner==1){
			wLooser = wPlayer2;
			wWinner = wPlayer1;
		} else {
			wLooser = wPlayer1;
			wWinner = wPlayer2;
		}
		open.result[wWinner].win++;
		open.result[wLooser].loose++;
		if (open.league[i].score1>=0 && open.league[i].score2>=0){
			open.result[wPlayer1].get+= open.league[i].score1;
			open.result[wPlayer2].lost+= open.league[i].score1;
			open.result[wPlayer2].get+= open.league[i].score2;
			open.result[wPlayer1].lost+= open.league[i].score2;

			open.result[wPlayer1].get_all+= wHandy1;
			open.result[wPlayer2].lost_all+= wHandy1;
			open.result[wPlayer2].get_all+= wHandy2;
			open.result[wPlayer1].lost_all+= wHandy2;

		}
	}
	for (var i=0; i<open.groups; i++){
		var wchk = [];
		vm.grpRank[i] = [];
		for (var j=0; j<grpPlayer[i].length; j++){
			wchk[j] = false;
		}
		var saveMax = 0;
		for (var j=0; j<grpPlayer[i].length; j++){
			var wMax = -1;
			var wMaxPlayer = -1;
			for (var k=0; k<grpPlayer[i].length; k++){
				if (wchk[k] == false){
					var wPlayer = grpPlayer[i][k];
					var wValue = (open.result[wPlayer].win*1000000 + ( open.result[wPlayer].get/ open.result[wPlayer].get_all*1000)*1000 + ( 1000- open.result[wPlayer].lost/ open.result[wPlayer].lost_all*1000));
					if (wMax<wValue){
						wMaxPlayer = k;
						wMax = wValue;
					}
				}
			}
			wchk[wMaxPlayer] = true;
			if (saveMax!=wMax){
				wRank = j+1;
				saveMax = wMax;
			}
			vm.grpRank[i][j] =  new rank_def(grpPlayer[i][wMaxPlayer], wRank);
			if (wRank<=leagueWinner){
				open.result[grpPlayer[i][wMaxPlayer]].honsen = 1;
			}
		}
	}

	showBtnResultLeague();
	showLeagueHonsenPlayer();
}
//本戦進出者セット
function showBtnResultLeague(){
	var leagueWinner = parseInt(vm.FORMAT['H_NUMBER'])/open.groups;
	var returnValue = 0;
	for (var j=0; j<open.groups; j++){
		//cssShow('#btnResult'+j);
		var wconfirmNum = 0;
		for (var i=0; i<vm.grpRank[j].length; i++){
			var wPlayer = vm.grpRank[j][i].player;
			if (open.result[wPlayer].honsen==1){
				wconfirmNum++;
			}
		}
		if (leagueWinner!=wconfirmNum){
			//$('#btnResult'+j).addClass("red");
			vm.table.grps[j].btn_theme = "button-assertive";
			returnValue = j+1;
		} else {
			//$('#btnResult'+j).removeClass("red");
			vm.table.grps[j].btn_theme = "button-stable";
		}
	}
	return returnValue;
}
//本戦進出者色セット
function showLeagueHonsenPlayer(){
	for (var i=0; i<open.groups; i++){
		for (var j=0; j<vm.grpRank[i].length; j++){
			var wPlayer = grpPlayer[i][j];
			if (open.result[wPlayer].honsen==1){
				vm.table.grps[i].rows[j].color = open_getPlayColor(10);
				//$('.leaguePlayer' + i + "-" + j).css("color",open_getPlayColor(10));
			} else {
				//$('.leaguePlayer' + i + "-" + j).css("color",open_getPlayColor(-1));
				vm.table.grps[i].rows[j].color = open_getPlayColor(-1);
			}
		}
	}
}
function setLeagueHonsenResult(){
	var wRank;
	var wWinner;
	var wLooser;

	result = [];
	for (var i=0; i<vm.ENTRIES.length; i++){
		open.result[i] = new result_def(0,0,0,0,0,0,0);
	}
	for (var i=0; i<open.league.length; i++){
		var wPlayer1 = open.league[i].player1;
		var wPlayer2 = open.league[i].player2;
		var wHandy1 = open_getHandy(wPlayer1);
		var wHandy2 = open_getHandy(wPlayer2);
		var winner = open_getWinner(open.league[i].score1,open.league[i].score2,wHandy1,wHandy2);
		if (winner==1){
			wLooser = wPlayer2;
			wWinner = wPlayer1;
		} else {
			wLooser = wPlayer1;
			wWinner = wPlayer2;
		}
		open.result[wWinner].win++;
		open.result[wLooser].loose++;
		if (open.league[i].score1>=0 && open.league[i].score2>=0){
			open.result[wPlayer1].get+= open.league[i].score1;
			open.result[wPlayer2].lost+= open.league[i].score1;
			open.result[wPlayer2].get+= open.league[i].score2;
			open.result[wPlayer1].lost+= open.league[i].score2;
			/*open.result[wPlayer1].get_all+= wHandy1 ;
			open.result[wPlayer2].lost_all+= wHandy1 ;
			open.result[wPlayer2].get_all+= wHandy2;
			open.result[wPlayer1].lost_all+= wHandy2;*/

			open.result[wPlayer1].get_all+= wHandy1;
			open.result[wPlayer2].lost_all+= wHandy1;
			open.result[wPlayer2].get_all+= wHandy2;
			open.result[wPlayer1].lost_all+= wHandy2;

		}
		open.result[wPlayer1].honsen = 1;
		open.result[wPlayer2].honsen = 1;
	}
}
///	///	///	///	///	///	///	///	///	///	/////				get						///
function open_getPlayColor(num){
	var color;
	switch (num) {
	case 0:
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
	case 6:
	case 7:
	case 8:
	case 9:
		color = vm.colors[num];
		break;
	case -1:
		color="grey";
		break;
	default:
		color="black";
		break;
	}
	return color;
}
function open_getWinner(score1,score2,handy1,handy2){
	var wscore = new Array(2);
	var whandy = new Array(2);
	var winner;
	wscore[0] = score1;
	wscore[1] = score2;
	whandy[0] = handy1;
	whandy[1] = handy2;

	var flg=0;
	if (score1!=null){
		for (var i=0; i<2; i++){
			if (wscore[i]==whandy[i]){
				winner = i+1;
				flg++;
			}
		}
		if (whandy[0]==null){
			if (wscore[0]>wscore[1]){
				winner = 1;
				flg=1;
			} else if (wscore[0]<wscore[1]){
				winner = 2;
				flg =1;
			}
		}
	}
	if (flg==1){
		return winner;
	} else {
		return 0;
	}
}
function getTournamentLevel(tabNo){
	var level = vm.tableInfo[tabNo].LEVEL;
	var zone = parseInt(vm.tableInfo[tabNo].ZONE);
	return getTournamentLevel_proc(level,zone);
}
function getTournamentLevel_proc(level,zone){
	var s="";
	switch (zone) {
	case 0:
	case 1:
		if (vm.tType!=1){
			if (zone==0){
				s+=W[41] + "　";
			} else {
				s+=W[42] + "　";
			}
		}
		break;
	case 2:
		s+=W[43] + "　";
		break;
	case 3:
		s+=W[44] + "　";
		break;
	default:
		s+=W[45] + "　";
		break;
	}
	if (zone<2){
		s+=level + W[46];
	}
	return s;
}
function open_getHandy(player){
	/*var skill = vm.ENTRIES[player].SKILL;
	var handy;
	var setdown;
	if (vm.nIsHonsen==1){
		if (vm.FORMAT.INPUT_MODE==2){
			handy = vm.FORMAT['H_HANDY'+skill];
			if (vm.FORMAT.H_SETDOWN && zone==1){
				if (handy>vm.FORMAT.H_MINIMUM){
					handy--;
				}
			}
		} else {
			return null;
		}
	} else {
		if (vm.FORMAT.INPUT_MODE==2){
			handy = vm.FORMAT['Y_HANDY'+skill];
			if (vm.FORMAT.Y_SETDOWN && zone==1){
				if (handy>vm.FORMAT.Y_MINIMUM){
					handy--;
				}
			}
		} else {
			return null;
		}
	}
	return handy;*/
	if (vm.nIsHonsen==1){
		return vm.ENTRIES[player].H_HANDY;
	} else {
		return vm.ENTRIES[player].Y_HANDY;
	}
}
function open_shuffle(IsLeague){
	var w_chk = new Array(vm.entryNum);
	var am_number = 0;
	var pm_number = 0;

	if (IsLeague==true){
		for (var i=0; i<vm.ENTRIES.length; i++){
			if (vm.ENTRIES[i].RANK==null){
				var wnum;
				do {
					wnum = Math.floor(Math.random()*vm.entryNum);
				} while (isNaN(w_chk[wnum])==false);
				w_chk[wnum] = i;
			}
		}
	} else {
		if ((vm.FORMAT.Y_TYPE=="0" && vm.nIsHonsen==1) || (vm.nIsHonsen==0)){

			/*for (var i=0; i<vm.ENTRIES.length; i++){
					var wnum;
					do {
						wnum = Math.floor(Math.random()*vm.ENTRIES.length);
					} while (isNaN(w_chk[wnum])==false);
					w_chk[wnum] = i;
				}*/
				for (var i=0; i<vm.ENTRIES.length; i++){
					if (vm.ENTRIES[i].AM_PM==1){
						//console.debug("am" + i);
						am_number++;
					} else if (vm.ENTRIES[i].AM_PM==2){
						//console.debug("pm" + i);
						pm_number++;
					}
				}

				if (am_number<vm.ENTRIES.length/2){
					am_number=Math.round(vm.ENTRIES.length/2);
				}
				if (pm_number<vm.ENTRIES.length/2){
					pm_number=Math.round(vm.ENTRIES.length/2);
				}

				for (var i=0; i<vm.ENTRIES.length; i++){
					if (vm.ENTRIES[i].AM_PM==1){
						var wnum;
						do {
							wnum = Math.floor(Math.random()*am_number);
						} while (isNaN(w_chk[wnum])==false);
						w_chk[wnum] = i;
					} else if(vm.ENTRIES[i].AM_PM==2){
						var wnum;
						do {
							wnum = vm.ENTRIES.length - Math.floor(Math.random()*pm_number)-1;
						} while (isNaN(w_chk[wnum])==false);
						w_chk[wnum] = i;
					}
				}
				for (var i=0; i<vm.ENTRIES.length; i++){
					if (vm.ENTRIES[i].AM_PM==0){
						var wnum;
						do {
							wnum = Math.floor(Math.random()*vm.ENTRIES.length);
						} while (isNaN(w_chk[wnum])==false);
						w_chk[wnum] = i;
					}

				}
				for (var i=0; i<vm.ENTRIES.length; i++){
				}
		} else {
			//予選脱落者除去
			for (var i=0; i<vm.ENTRIES.length; i++){
				if (vm.ENTRIES[i].RANK==null){
					var wnum;
					do {
						wnum = Math.floor(Math.random()*vm.entryNum);
					} while (isNaN(w_chk[wnum])==false);
					w_chk[wnum] = i;
				}
			}
		}
	}
	return w_chk;
}
function open_getTreeWinner(no){
	var score1 = open.tree[no].score1;
	var score2 = open.tree[no].score2;
	var player1 = open.tree[no].player1;
	var player2 = open.tree[no].player2;
	var zone = open.tree[no].zone;
	var winner;

	if (score1==open_getHandy(player1)){
		winner = 1;
	} else if (score2==open_getHandy(player2)){
		winner = 2;
	} else {
		winner = 0;
	}

	return winner;
}
function open_showHelp(){
	//intel.xdk.player.playSound("sounds/select.mp3");
	clearHelp();
	cssShow('.help');

	drawRect(5,20,900,60);
	drawText(80,60,msg(53));

	drawLine(950,0,960,30);
	drawLine(960,30,1390,30);
	drawLine(1390,30,1400,0);
	drawLine(1200,30,900,300);

	drawText(100,130,msg(70));
	drawText(100,160,msg(71));

	drawText(100,300,msg(54));
	drawText(100,350,msg(55));
	drawText(100,400,msg(56));
	drawText(100,450,msg(57));
	drawText(100,500,msg(58));
	drawText(100,550,msg(59));

	if (vm.FORMAT.STATUS==1 || vm.FORMAT.STATUS==3){
		drawRect(5,800,1330,100);
		drawText(100,835,msg(60));
		drawText(100,875,msg(61));

		drawRect(1350,800,50,100);
		drawLine(1370,800,1000,720);
		drawText(600,700,msg(62));
	}

}
