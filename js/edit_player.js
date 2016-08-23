var edit_player = {};

edit_player.show = function(param){
  edit_player.callback = param.callback;
	popup_show({
		name: "edit_player",
    title: "新規登録",
		callback: edit_player.init
	});
}

edit_player.init = function(){
}
