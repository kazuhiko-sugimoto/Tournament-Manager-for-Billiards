const {BrowserWindow} = require('electron').remote;



index = {};
function init_index(){
   //$('ul.tabs').tabs();
  format.init();
  index.entries = [];
  ENTRY({T_CD:{'==':t_cd}}).each(function (r) {
     index.entries.push({
       NAME: r.NAME,
       SKILL: r.SKILL,
       HALL: r.HALL,
       Y_HANDY: r.Y_HANDY,
       H_HANDY: r.H_HANDY,
       AP_PM: r.AM_PM
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
      Y_STATUS: format.vm.Y_STATUS,
      entries: index.entries
    }
  });

  index.addRow();

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

index.clickAdd = function(){
  edit_player.show({
    callback: index.clickAdd_callback
  });
}
index.clickAdd_callback = function(){

}
index.addRow = function(){
  index.vm.entries.push({
    NAME: "",
    SKILL: 2,
    HALL: "",
    Y_HANDY: format.vm.Y_HANDY2,
    H_HANDY: format.vm.H_HANDY2,
    AP_PM: 0
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
  var cd = 1;
  for (var i=0; i<index.vm.entries.length; i++){
    var name = index.vm.entries[i].NAME.trim();
    var hall = index.vm.entries[i].HALL.trim();
    var skill = index.vm.entries[i].SKILL;
    var y_handy = index.vm.entries[i].Y_HANDY;
    var h_handy = index.vm.entries[i].H_HANDY;
    var ampm = index.vm.entries[i].AP_PM;
    //if (name){
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
      ENTRY({T_CD:{'==':t_cd}}).remove();
      ENTRY.insert(
          {
            T_CD: t_cd,
        		CD: cd,
            NAME: name,
            SKILL: skill,
            HALL: hall,
            Y_HANDY: y_handy,
            H_HANDY:  h_handy,
            AP_PM: ampm
      	}
      );
    //}
  }
  $('#errMsg').text(M[2]);
  return true;
}
