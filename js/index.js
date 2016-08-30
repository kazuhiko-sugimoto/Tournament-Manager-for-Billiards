const {BrowserWindow} = require('electron').remote;



index = {};
function init_index(){
   //$('ul.tabs').tabs();
   if (nLang){
       $('#lang_ja').prop("checked", "checked");
   } else {
       $('#lang_en').prop("checked", "checked");
   }
  format.init();

  //index.createPlayer_debug(8);

  if (format.vm.STATUS==4){
    t_cd++;
    FORMAT.insert(
        {
          CD: parseInt(t_cd),
          NAME: W[37],
          GAME: 1,
          Y_TYPE: 3,
          Y_GROUPS: 4,
          Y_HANDY0: 2,
          Y_HANDY1: 3,
          Y_HANDY2: 4,
          Y_HANDY3: 5,
          Y_HANDY4: 6,
          Y_HANDY5: 7,
          Y_HANDY6: 0,
          Y_HANDY7: 0,
          Y_HANDY8: 0,
          H_NUMBER: 8,
          H_TYPE: 1,
          H_HANDY0: 2,
          H_HANDY1: 3,
          H_HANDY2: 4,
          H_HANDY3: 5,
          H_HANDY4: 6,
          H_HANDY5: 7,
          H_HANDY6: 0,
          H_HANDY7: 0,
          H_HANDY8: 0,
          H_THIRD: 1,
          STATUS: 0
      }
    );
    format.init();
  } else if (format.vm.STATUS>0){
    goto("open");
  }

  var entries = [];
  ENTRY({T_CD:{'==':t_cd}}).each(function (r) {
     entries.push({
       CD: r.CD,
       NAME: r.NAME,
       SKILL: r.SKILL,
       SL: r.SL,
       HALL: r.HALL,
       Y_HANDY: r.Y_HANDY,
       H_HANDY: r.H_HANDY,
       AM_PM: r.AM_PM,
       RANK: r.RANK
     })
  });

  index.vm = new Vue({
    el: '#entry',
    data: {
      W: W,
      M: M,
      NAME: format.vm.NAME,
      GAME: format.vm.GAME,
      Y_TYPE: format.vm.Y_TYPE,
      H_TYPE: format.vm.H_TYPE,
      STATUS: format.vm.STATUS,
      entries: entries
    }
  });


  /*if (index.vm.entries.length<64){
    index.addRow();
  }*/

}
index.createPlayer_debug = function(num){
  ENTRY({T_CD:{'==':t_cd}}).remove();
  var cd = 1;
  for (var i=0; i<num; i++){
    var name = "鈴木　一郎"+i;
    var hall = "At Pool";
    var skill = 2;
    var sl = 6;
    var y_handy = 4;
    var h_handy = 4;
    var ampm = 0;
    ENTRY.insert(
        {
          T_CD: parseInt(t_cd),
      		CD: parseInt(cd),
          NAME: name,
          SKILL: parseInt(skill),
          SL: parseInt(sl),
          HALL: hall,
          Y_HANDY: parseInt(y_handy),
          H_HANDY:  parseInt(h_handy),
          AM_PM: parseInt(ampm),
          RANK: null
    	}
    );
    cd++;
  }
}
index.clickLang = function(lang){
  nLang = lang;
  setLocalStorage();
  if (nLang){
      japanese();
  } else {
      english();
  }
  gotoHome();
}
index.clickFormat = function(){
  format.show({
    callback: index.clickFormat_callback
  });
};
index.clickFormat_callback = function(){
  index.vm.NAME = format.vm.NAME;
  index.vm.GAME = format.vm.GAME;
  index.vm.Y_TYPE = format.vm.Y_TYPE;
  index.vm.H_TYPE = format.vm.H_TYPE;
  for (var i=0; i<index.vm.entries.length; i++){
    var skill;
    if (index.vm.GAME<10){
      skill = index.vm.entries[i].SKILL;
    } else {
      skill = index.vm.entries[i].SL;
    }
    index.vm.entries[i].Y_HANDY = format.vm["Y_HANDY" + skill];
    index.vm.entries[i].H_HANDY = format.vm["H_HANDY" + skill];
  }
  $('#errMsg').text("");
}
index.addRow = function(){
  if (index.vm.entries.length>=64){
    alert(M[16]);
    return;
  }
  index.vm.entries.push({
    NAME: "",
    SKILL: 2,
    SL: 5,
    HALL: "",
    Y_HANDY: index.vm.GAME<10 ? format.vm.Y_HANDY2 : format.vm.Y_HANDY5,
    H_HANDY: index.vm.GAME<10 ? format.vm.H_HANDY2 : format.vm.H_HANDY5,
    AM_PM: 0
  })
}
index.removeRow = function(row){
  var wk_entries = _.clone(index.vm.entries);
  index.vm.entries= [];
  for (var i=0; i<wk_entries.length; i++){
    if (i!=row){
      index.vm.entries.push(wk_entries[i]);
    }
  }
}
index.click_Save = function(){
  $('#errMsg').text("");
  var wk_entries = _.clone(index.vm.entries);
  index.vm.entries= [];
  for (var i=0; i<wk_entries.length; i++){
    var name = wk_entries[i].NAME.trim();
    if (name!=""){
      index.vm.entries.push(wk_entries[i]);
    }
  }

  for (var i=0; i<index.vm.entries.length; i++){
    var name = index.vm.entries[i].NAME.trim();
    var hall = index.vm.entries[i].HALL.trim();
    var skill = index.vm.entries[i].SKILL;
    var sl = index.vm.entries[i].SL;
    var y_handy = index.vm.entries[i].Y_HANDY;
    var h_handy = index.vm.entries[i].H_HANDY;
    var ampm = index.vm.entries[i].AM_PM;

    if (countLength(name)>12){
      $('#errMsg').text(M[0]);
      $('#name'+i).focus();
      return false;
    } else if (countLength(hall)>12){
      $('#errMsg').text(M[0]);
      $('#hall'+i).focus();
      return false;
    } else if (index.vm.Y_TYPE!=0 && (!y_handy || y_handy>255 || y_handy<1)){
      $('#errMsg').text(M[1]);
      $('#yHandy'+i).focus();
      return false;
    } else if (!h_handy || h_handy>255 || h_handy<1){
      $('#errMsg').text(M[1]);
      $('#hHandy'+i).focus();
      return false;
    }
    for (var j=0; j<index.vm.entries.length; j++){
      if (i!=j){
        var wk_name = index.vm.entries[j].NAME.trim();
        if (name==wk_name){
          $('#errMsg').text(M[17]);
          $('#name'+j).focus();
          return false;
        }
      }
    }
  }

  ENTRY({T_CD:{'==':t_cd}}).remove();
  var cd = 1;
  for (var i=0; i<index.vm.entries.length; i++){
    var name = index.vm.entries[i].NAME.trim();
    var hall = index.vm.entries[i].HALL.trim();
    var skill = index.vm.entries[i].SKILL;
    var sl = index.vm.entries[i].SL;
    var y_handy = index.vm.entries[i].Y_HANDY;
    var h_handy = index.vm.entries[i].H_HANDY;
    var ampm = index.vm.entries[i].AM_PM;
    ENTRY.insert(
        {
          T_CD: parseInt(t_cd),
      		CD: parseInt(cd),
          NAME: name,
          SKILL: parseInt(skill),
          SL: parseInt(sl),
          HALL: hall,
          Y_HANDY: parseInt(y_handy),
          H_HANDY:  parseInt(h_handy),
          AM_PM: parseInt(ampm),
          RANK: null
    	}
    );
    cd++;

  }
  $('#errMsg').text(M[2]);
  return true;
}
index.click_Open = function(){
  var result = index.click_Save();
  if (result){
    if (!index.vm.NAME || index.vm.NAME==W[37]){
      alert(W[37]);
      index.clickFormat();
      return false;
    }
    if (format.vm.Y_TYPE!=0 && (index.vm.entries.length<format.vm.H_NUMBER*2)){
      	$('#errMsg').text(M[5]);
        return false;
    }
    mnHistory = 0;
    goto("open");
  }
}
index.addByList = function(){
  popup_show({
    name: "playerList",
    title: "出場登録者リスト",
    width: "800px",
    callback: index.addByList_callback
  });
}
index.addByList_callback = function(){
  var formats = [];

  var recentCd=-1;
  FORMAT({CD:{'!=':t_cd}}).order("DATE").each(function (r) {
    formats.push({
      CD: r.CD,
      NAME: r.NAME,
      DATE: r.DATE
    })
    recentCd = r.CD;
  });

  index.playerListVm = new Vue({
    el: '#playerList',
    data: {
      formats: formats,
      entries: [],
      t_cd: recentCd,
      game: index.vm.GAME
    }
  });

  index.addByList_getEntries(recentCd);
}
index.changeFormat = function(){
  var recentCd = $('#playerList_format').val();
  index.addByList_getEntries(recentCd);
}
index.addByList_getEntries = function(recentCd){
  var entries = [];
  ENTRY({T_CD:{'==':recentCd}}).order("NAME").each(function (r) {
    var flg = false;
    for (var i=0; i<index.vm.entries.length; i++){
      if (index.vm.entries[i].NAME==r.NAME && index.vm.entries[i].HALL==r.HALL){
        flg = true;
      }
    }
    if (!flg){
      entries.push({
        CD: r.CD,
        NAME: r.NAME,
        HALL: r.HALL,
        SKILL_NM: sSkill[r.SKILL],
        SL_NM: sSL[r.SL],
        SKILL: r.SKILL,
        SL: r.SL,
        CHK: false
      });
    }
  });
  index.playerListVm.entries = entries;
}
index.getPlayerList = function(){
  var y_handy = [format.vm.Y_HANDY0,format.vm.Y_HANDY1,format.vm.Y_HANDY2,format.vm.Y_HANDY3,format.vm.Y_HANDY4,format.vm.Y_HANDY5,format.vm.Y_HANDY6,format.vm.Y_HANDY7,format.vm.Y_HANDY8];
  var h_handy = [format.vm.H_HANDY0,format.vm.H_HANDY1,format.vm.H_HANDY2,format.vm.H_HANDY3,format.vm.H_HANDY4,format.vm.H_HANDY5,format.vm.H_HANDY6,format.vm.H_HANDY7,format.vm.H_HANDY8];
  for (var i=0; i<index.playerListVm.entries.length; i++){
    if (index.playerListVm.entries[i].CHK){
      var r = index.playerListVm.entries[i];
      index.vm.entries.push({
        CD: r.CD,
        NAME: r.NAME,
        SKILL: r.SKILL,
        SL: r.SL,
        HALL: r.HALL,
        Y_HANDY: index.vm.GAME<10 ? y_handy[r.SKILL] : y_handy[r.SL],
        H_HANDY: index.vm.GAME<10 ? h_handy[r.SKILL] : h_handy[r.SL],
        AM_PM: 0,
        RANK: null
      })
    }
  }
  popup_hide("playerList");
}
index.th_click = function(num){
	if (index.nOrder==num){
		index.nOrder = - num;
	} else {
		index.nOrder= num;
	}

	switch (index.nOrder){
		case 1:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.NAME.toUpperCase()});
			break;
		case -1:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.NAME.toUpperCase()}).reverse();
			break;
		case 2:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.SKILL});
			break;
		case -2:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return -obj.SKILL});
			break;
		case 3:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.HALL.toUpperCase()});
			break;
		case -3:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.HALL.toUpperCase()}).reverse();
			break;
		case 4:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.AM_PM});
			break;
		case -4:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return -obj.AM_PM});
			break;
    case 5:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.Y_HANDY});
			break;
		case -5:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return -obj.Y_HANDY});
			break;
    case 6:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.H_HANDY});
			break;
		case -6:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return -obj.H_HANDY});
			break;
    case 7:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return obj.SL});
			break;
		case -7:
			index.vm.entries = _.sortBy(index.vm.entries, function(obj){ return -obj.SL});
			break;

	}
}
index.clickHistory = function(){
  popup_show({
    name: "history",
    title: W[36],
    width: "600px",
    callback: index.clickHistory_callback
  });
}
index.clickHistory_callback = function(){
  var historyLists = index.getHistoryLists();
  index.historyVM = new Vue({
		el: '#history',
		data: {
			historyLists: historyLists
		}
	})
}
index.getHistoryLists= function(){
  var historyLists = [];
  FORMAT({CD:{'!=':t_cd}}).order("DATE desc").each(function (r) {
     historyLists.push({
       CD: r.CD,
       NAME: r.NAME,
       DATE: r.DATE
     })
  });
  return historyLists;
}
index.historyOk = function(cd){
  popup_hide("history");
  mnHistory = 1;
  t_cd = cd;
  goto("open");
}
index.changeSkill = function(idx){
  var skill = parseInt($('#skill'+idx).val());
  index.vm.entries[idx].Y_HANDY = format.vm["Y_HANDY" + skill];
  index.vm.entries[idx].H_HANDY = format.vm["H_HANDY" + skill];
  switch (skill){
    case 0:
      index.vm.entries[idx].SL = 1;
      break;
    case 1:
      index.vm.entries[idx].SL = 3;
      break;
    case 2:
      index.vm.entries[idx].SL = 5;
      break;
    case 3:
      index.vm.entries[idx].SL = 6;
      break;
    case 4:
      index.vm.entries[idx].SL = 8;
      break;
    case 5:
      index.vm.entries[idx].SL = 8;
      break;
  }
}
index.changeSl = function(idx){
  var sl = parseInt($('#sl'+idx).val());
  index.vm.entries[idx].Y_HANDY = format.vm["Y_HANDY" + sl];
  index.vm.entries[idx].H_HANDY = format.vm["H_HANDY" + sl];
  switch (sl){
    case 0:
      index.vm.entries[idx].SKILL = 0;
      break;
    case 1:
      index.vm.entries[idx].SKILL = 0;
      break;
    case 2:
      index.vm.entries[idx].SKILL = 1;
      break;
    case 3:
      index.vm.entries[idx].SKILL = 1;
      break;
    case 4:
      index.vm.entries[idx].SKILL = 2;
      break;
    case 5:
      index.vm.entries[idx].SKILL = 2;
      break;
    case 6:
      index.vm.entries[idx].SKILL = 2;
      break;
    case 7:
      index.vm.entries[idx].SKILL = 3;
      break;
    case 8:
      index.vm.entries[idx].SKILL = 3;
      break;
  }
}
