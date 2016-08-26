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
  /*ENTRY({T_CD:{'==':t_cd}}).remove();
  var cd = 1;
  for (var i=0; i<8; i++){
    var name = "鈴木　一郎"+i;
    var hall = "At Pool";
    var skill = 2;
    var y_handy = 4;
    var h_handy = 4;
    var ampm = 0;
    ENTRY.insert(
        {
          T_CD: parseInt(t_cd),
      		CD: parseInt(cd),
          NAME: name,
          SKILL: parseInt(skill),
          HALL: hall,
          Y_HANDY: parseInt(y_handy),
          H_HANDY:  parseInt(h_handy),
          AM_PM: parseInt(ampm),
          RANK: null
    	}
    );
    cd++;
  }*/

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
          H_NUMBER: 8,
          H_TYPE: 1,
          H_HANDY0: 2,
          H_HANDY1: 3,
          H_HANDY2: 4,
          H_HANDY3: 5,
          H_HANDY4: 6,
          H_HANDY5: 7,
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
  for (var i=0; i<index.vm.entries.length; i++){
    var skill = index.vm.entries[i].SKILL;
    index.vm.entries[i].Y_HANDY = format.vm["Y_HANDY" + skill];
    index.vm.entries[i].H_HANDY = format.vm["H_HANDY" + skill];
  }
}
index.addRow = function(){
  if (index.vm.entries.length>=64){
    alert(M[16]);
    return;
  }
  index.vm.entries.push({
    NAME: "",
    SKILL: 2,
    HALL: "",
    Y_HANDY: format.vm.Y_HANDY2,
    H_HANDY: format.vm.H_HANDY2,
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

  for (var i=0; i<index.vm.entries.length; i++){
    var name = index.vm.entries[i].NAME.trim();
    if (!name){
      index.removeRow(i);
    }
  }


  for (var i=0; i<index.vm.entries.length; i++){
    var name = index.vm.entries[i].NAME.trim();
    var hall = index.vm.entries[i].HALL.trim();
    var skill = index.vm.entries[i].SKILL;
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
    var y_handy = index.vm.entries[i].Y_HANDY;
    var h_handy = index.vm.entries[i].H_HANDY;
    var ampm = index.vm.entries[i].AM_PM;
    console.debug(index.vm.entries[i]);
    ENTRY.insert(
        {
          T_CD: parseInt(t_cd),
      		CD: parseInt(cd),
          NAME: name,
          SKILL: parseInt(skill),
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
      t_cd: recentCd
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
        SKILL: r.SKILL,
        CHK: false
      });
    }
  });
  index.playerListVm.entries = entries;
}
index.getPlayerList = function(){
  var y_handy = [format.vm.Y_HANDY0,format.vm.Y_HANDY1,format.vm.Y_HANDY2,format.vm.Y_HANDY3,format.vm.Y_HANDY4,format.vm.Y_HANDY5];
  var h_handy = [format.vm.H_HANDY0,format.vm.H_HANDY1,format.vm.H_HANDY2,format.vm.H_HANDY3,format.vm.H_HANDY4,format.vm.H_HANDY5];
  for (var i=0; i<index.playerListVm.entries.length; i++){
    if (index.playerListVm.entries[i].CHK){
      var r = index.playerListVm.entries[i];
      index.vm.entries.push({
        CD: r.CD,
        NAME: r.NAME,
        SKILL: r.SKILL,
        HALL: r.HALL,
        Y_HANDY: y_handy[r.SKILL],
        H_HANDY: h_handy[r.SKILL],
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

		}
  }
