var W = [];
var M = [];

function japanese(){
	W[0] = "ゲーム種類";
	W[1] = "トーナメント名称";
	W[2] = "予選";
	W[3] = "試合形式";
	W[4] = "本戦進出人数";
	W[5] = "予選グループ数";
	W[6] = "イニング";
	W[7] = "裏撞き";
	W[8] = "ハンデ設定";
	W[9] = "3掛け";
	W[10] = "4掛け";
	W[11] = "5掛け";
	W[12] = "6掛け";
	W[13] = "7掛け";
	W[14] = "通常";
	W[15] = "本戦";
	W[16] = "3位決定戦";
	W[17] = "予選なし";
	W[18] = "シングルイルミネーション";
	W[19] = "略式ダブルイルミネーション";
	W[20] = "リーグ戦";
	W[21] = "完全ダブルイルミネーション";
	W[22] = "新規登録";
	W[23] = "登録名簿から";
	W[24] = "名前";
	W[25] = "クラス";
	W[26] = "所属";
	W[27] = "時間指定";
	W[28] = "予選ハンデ";
	W[29] = "本戦ハンデ";
	W[30] = "指定なし";
	W[31] = "前半希望";
	W[32] = "後半希望";
	W[33] = "保存する";
	W[34] = "トーナメント実施";
	W[35] = "フォーマット";
	W[36] = "履歴";
	W[37] = "フォーマット未設定";
	W[38] = "本戦開始";
	W[39] = "試合確定";
	W[40] = "最終結果";
	W[41] = "勝者ゾーン";
	W[42] = "敗者ゾーン";
	W[43] = "決勝戦";
	W[44] = "プレーオフ";
	W[45] = "3位決定戦";
	W[46] = "回戦";
	W[47] = "不戦敗";
	W[48] = "確定試合取消";
	W[49] = "このテーブルを使用しない";
	W[50] = "試合中";
	W[51] = "勝";
	W[52] = "負";
	W[53] = "得点率";
	W[54] = "失点率";
	W[55] = "順位";
	W[56] = "不戦勝";
	W[57] = "不戦敗";

	M[0] = "12バイト以内で入力して下さい。";
	M[1] = "値が不正です。";
	M[2] = "保存しました。";
	M[3] = "20字以内で入力して下さい。";
	M[4] = "必須項目が未入力です。";
	M[5] = "予選は本戦進出人数の2倍のエントリーが必要です。";
	M[6] = "エントリー人数は最低4人必要です。";
	M[7] = "を削除してよろしいですか?";
	M[8] = "予選結果を確定してもよろしいですか？";
	M[9] = "試合結果を確定してもよろしいですか？";
	M[10] = "使用可に変更しました。";
	M[11] = "使用不可に変更しました。";
	M[12] = "試合結果を取り消してよろしいですか？";
	M[13] = "1グループの上限は12人までです";
	M[14] = "1グループの下限は3人以上です";
	M[15] = "の本戦進出者を決定してください";
	M[16] = "エントリーの上限は64人までです";
	M[17] = "同名の選手がすでに存在します。";
	M[18] = "削除してよろしいですか?";

 }

function english(){
	W[0] = "Game Type";
	W[1] = "Tournament Name";
	W[2] = "Qualifier";
	W[3] = "Tournament Type";
	W[4] = "Finalist";
	W[5] = "Groups";
	W[6] = "Inning";
	W[7] = "Post attack";
	W[8] = "Handy cap";
	W[9] = "30%";
	W[10] = "40%";
	W[11] = "50%";
	W[12] = "60%";
	W[13] = "70%";
	W[14] = "Normal";
	W[15] = "Finals";
	W[16] = "Third place playoff";
	W[17] = "no qualifier";
	W[18] = "single elimination";
	W[19] = "easy double elimination";
	W[20] = "League";
	W[21] = "full double elimination";
	W[22] = "Add";
	W[23] = "List";
	W[24] = "Name";
	W[25] = "Class";
	W[26] = "Home";
	W[27] = "Time specified";
	W[28] = "Handy cap(Q)";
	W[29] = "Handy cap(F)";
	W[30] = "unspecified";
	W[31] = "first half";
	W[32] = "Latter half";
	W[33] = "Save";
	W[34] = "Start";
	W[35] = "Format";
	W[36] = "History";
	W[37] = "Format is not set";
	W[38] = "Start Finals";
	W[39] = "define";
	W[40] = "final result";
	W[41] = "winner zone";
	W[42] = "looser zone";
	W[43] = "the final";
	W[44] = "play-off";
	W[45] = "3rd play-off";
	W[46] = "round";
	W[47] = "lose without fight";
	W[48] = "Undo definite game";
	W[49] = "Do not use this table";
	W[50] = "During";
	W[51] = "W";
	W[52] = "L";
	W[53] = "Got";
	W[54] = "Lost";
	W[55] = "Rank";
	W[56] = "unearned win";
	W[57] = "default";

	M[0] = "Enter up to 12 bytes.";
	M[1] = "Invalid value.";
	M[2] = "saved.";
	M[3] = "Enter within 20 characters.";
	M[4] = "Required items are not entered.";
	M[5] = "It needs twice of Finalists number.";
	M[6] = "At least four people are needed for entry.";
	M[7] = ", are you sure to delete?";
	M[8] = "Do you define qualifier result?";
	M[9] = "Do you define tournament game?";
	M[10] = "Enabled done.";
	M[11] = "Disabled done.";
	M[12] = "Are you sure to undo this game?";
	M[13] = "The maximum number in a group is 12.";
	M[14] = "At least three people are needed for a group.";
	M[15] = ", could you please confirm finalists.";
	M[16] = "The maximum entry number is 64.";
	M[17] = "That already exists.";
	M[18] = "Do you remove sure?";
}
