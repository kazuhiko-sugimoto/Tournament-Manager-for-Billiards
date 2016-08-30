var format = {};

format.show = function(param){
  format.callback = param.callback;
	popup_show({
		name: "format",
    title: "format",
    width: "800px",
		callback: format.init
	});
}

format.init = function(){
  var cnt = FORMAT().count();

  if (cnt>0){
    if (mnHistory!=1){
      t_cd = FORMAT().max("CD");
    }
    var r = FORMAT({CD:{'==':t_cd}}).first();
    format.vm = new Vue({
      el: '#format',
      data: {
        W: W,
        M: M,
        NAME: r.NAME,
        GAME: r.GAME,
        Y_TYPE: r.Y_TYPE,
        Y_GROUPS: r.Y_GROUPS,
        Y_HANDY0: r.Y_HANDY0,
        Y_HANDY1: r.Y_HANDY1,
        Y_HANDY2: r.Y_HANDY2,
        Y_HANDY3: r.Y_HANDY3,
        Y_HANDY4: r.Y_HANDY4,
        Y_HANDY5: r.Y_HANDY5,
        Y_HANDY6: r.Y_HANDY6,
        Y_HANDY7: r.Y_HANDY7,
        Y_HANDY8: r.Y_HANDY8,
        H_NUMBER: r.H_NUMBER,
        H_TYPE: r.H_TYPE,
        H_HANDY0: r.H_HANDY0,
        H_HANDY1: r.H_HANDY1,
        H_HANDY2: r.H_HANDY2,
        H_HANDY3: r.H_HANDY3,
        H_HANDY4: r.H_HANDY4,
        H_HANDY5: r.H_HANDY5,
        H_HANDY6: r.H_HANDY6,
        H_HANDY7: r.H_HANDY7,
        H_HANDY8: r.H_HANDY8,
        H_THIRD: r.H_THIRD,
        STATUS: r.STATUS,
        DATE: r.DATE
      }
    })
  } else {
    t_cd = 1;
    format.vm = new Vue({
      el: '#format',
      data: {
        W: W,
        M: M,
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
        H_HANDY6: 6,
        H_HANDY7: 7,
        H_HANDY8: 8,
        H_THIRD: 1,
        STATUS: 0
      }
    })
  }

}

format.changeGame = function(){
  var w_handy = [];
  var game = $('#game').val();
  switch (game){
    case "3":
      w_handy = [5,6,7,8,8,8];
      break;
    case "4":
      w_handy = [30,40,60,80,100,120];
      break;
    case "5":
      w_handy = [4,5,6,7,7,7];
      break;
    case "7":
      w_handy = [30,60,90,120,180,240];
      break;
    case "10":
      w_handy = [14,19,25,31,38,46,55,65,75];
      break;
    case "11":
      w_handy = [7,10,13,16,19,23,28,33,38];
      break;
    default:
      w_handy = [2,3,4,5,7,9];
  }
  for (var i=0; i<w_handy.length; i++){
    format.vm['Y_HANDY'+ i] =w_handy[i];
    format.vm['H_HANDY'+ i] =w_handy[i];
  }
}

format.save = function(){
  var name = format.vm.NAME.trim();
  var game = format.vm.GAME;
  var y_type = format.vm.Y_TYPE;
  var h_number = format.vm.H_NUMBER;
  var y_groups = format.vm.Y_GROUPS;
  var y_handy0 = format.vm.Y_HANDY0;
  var y_handy1 = format.vm.Y_HANDY1;
  var y_handy2 = format.vm.Y_HANDY2;
  var y_handy3 = format.vm.Y_HANDY3;
  var y_handy4 = format.vm.Y_HANDY4;
  var y_handy5 = format.vm.Y_HANDY5;
  var y_handy6 = format.vm.Y_HANDY6;
  var y_handy7 = format.vm.Y_HANDY7;
  var y_handy8 = format.vm.Y_HANDY8;
  var h_type = format.vm.H_TYPE;
  var h_third = format.vm.H_THIRD;
  var h_handy0 = format.vm.H_HANDY0;
  var h_handy1 = format.vm.H_HANDY1;
  var h_handy2 = format.vm.H_HANDY2;
  var h_handy3 = format.vm.H_HANDY3;
  var h_handy4 = format.vm.H_HANDY4;
  var h_handy5 = format.vm.H_HANDY5;
  var h_handy6 = format.vm.H_HANDY6;
  var h_handy7 = format.vm.H_HANDY7;
  var h_handy8 = format.vm.H_HANDY8;

  if (!name || name==W[37]){
    $('#errMsg_format').text(M[4]);
    $('#name_format').focus();
    return false;
  }
  if (format.vm.Y_TYPE!=0){
    if (!y_handy0 || y_handy0>255 || y_handy0<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy0').focus();
      return false;
    } else if (!y_handy1 || y_handy1>255 || y_handy1<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy1').focus();
      return false;
    } else if (!y_handy2 || y_handy2>255 || y_handy2<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy2').focus();
      return false;
    } else if (!y_handy3 || y_handy3>255 || y_handy3<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy3').focus();
      return false;
    } else if (!y_handy4 || y_handy4>255 || y_handy4<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy4').focus();
      return false;
    } else if (!y_handy5 || y_handy5>255 || y_handy5<1){
      $('#errMsg_format').text(M[1]);
      $('#y_handy5').focus();
      return false;
    }
    if (format.vm.GAME==10){
      if (!y_handy6 || y_handy6>255 || y_handy6<1){
        $('#errMsg_format').text(M[1]);
        $('#y_handy6').focus();
        return false;
      } else if (!y_handy7 || y_handy7>255 || y_handy7<1){
        $('#errMsg_format').text(M[1]);
        $('#y_handy7').focus();
        return false;
      } else if (!y_handy8 || y_handy8>255 || y_handy8<1){
        $('#errMsg_format').text(M[1]);
        $('#y_handy8').focus();
        return false;
      }
    }
  }
  if (!h_handy0 || h_handy0>255 || h_handy0<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy0').focus();
    return false;
  } else if (!h_handy1 || h_handy1>255 || h_handy1<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy1').focus();
    return false;
  } else if (!h_handy2 || h_handy2>255 || h_handy2<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy2').focus();
    return false;
  } else if (!h_handy3 || h_handy3>255 || h_handy3<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy3').focus();
    return false;
  } else if (!h_handy4 || h_handy4>255 || h_handy4<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy4').focus();
    return false;
  } else if (!h_handy5 || h_handy5>255 || h_handy5<1){
    $('#errMsg_format').text(M[1]);
    $('#h_handy5').focus();
    return false;
  }
  if (format.vm.GAME==10){
    if (!h_handy6 || h_handy6>255 || h_handy6<1){
      $('#errMsg_format').text(M[1]);
      $('#h_handy6').focus();
      return false;
    } else if (!h_handy7 || h_handy7>255 || h_handy7<1){
      $('#errMsg_format').text(M[1]);
      $('#h_handy7').focus();
      return false;
    } else if (!h_handy8 || h_handy8>255 || h_handy8<1){
      $('#errMsg_format').text(M[1]);
      $('#h_handy8').focus();
      return false;
    }
  }
  FORMAT({CD:{'==':t_cd}}).remove();
  FORMAT.insert(
      {
        CD: parseInt(t_cd),
        NAME: name,
        GAME: parseInt(game),
        Y_TYPE: parseInt(y_type),
        Y_GROUPS: parseInt(y_groups),
        Y_HANDY0: parseInt(y_handy0),
        Y_HANDY1: parseInt(y_handy1),
        Y_HANDY2: parseInt(y_handy2),
        Y_HANDY3: parseInt(y_handy3),
        Y_HANDY4: parseInt(y_handy4),
        Y_HANDY5: parseInt(y_handy5),
        Y_HANDY6: parseInt(y_handy6),
        Y_HANDY7: parseInt(y_handy7),
        Y_HANDY8: parseInt(y_handy8),
        H_NUMBER: parseInt(h_number),
        H_TYPE: parseInt(h_type),
        H_HANDY0: parseInt(h_handy0),
        H_HANDY1: parseInt(h_handy1),
        H_HANDY2: parseInt(h_handy2),
        H_HANDY3: parseInt(h_handy3),
        H_HANDY4: parseInt(h_handy4),
        H_HANDY5: parseInt(h_handy5),
        H_HANDY6: parseInt(h_handy6),
        H_HANDY7: parseInt(h_handy7),
        H_HANDY8: parseInt(h_handy8),
        H_THIRD: parseInt(h_third),
        STATUS: parseInt(format.vm.STATUS)
    }
  );
  alert(M[2]);
  popup_hide("format");
  format.callback();
}
