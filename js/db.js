var FORMAT = TAFFY();
var ENTRY = TAFFY();
var TABLE = TAFFY();
var TREE = TAFFY();
var LEAGUE = TAFFY();

var db={};

db.base_url = 'https://kazu-software-com.ssl-xserver.jp/house_edition/cgi/cgi.php';
//db.base_url = 'http://kazu-software.com/house_edition/cgi/cgi.php';
// ローカルストレージから読み込み
db.getTAFFY = function(){
 	FORMAT.store("FORMAT");
  ENTRY.store("ENTRY");
  TABLE.store("TABLE");
  TREE.store("TREE");
  LEAGUE.store("LEAGUE");
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
