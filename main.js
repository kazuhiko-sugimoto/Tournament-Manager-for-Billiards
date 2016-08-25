'use strict';

// Electronのモジュール
const electron = require("electron");
var Menu = electron.Menu;

// アプリケーションをコントロールするモジュール
const app = electron.app;

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({width: 1200, height: 700});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

// メニュー情報の作成
var template = [
  {
    label: 'ReadUs',
    submenu: [
      {label: 'Quit', accelerator: 'Command+Q', click: function () {app.quit();}}
    ]
  }, {
    label: 'File',
    submenu: [
      {label: 'Open', accelerator: 'Command+O', click: function() {
        // 「ファイルを開く」ダイアログの呼び出し
        require('dialog').showOpenDialog({ properties: ['openDirectory']}, function (baseDir){
          if(baseDir && baseDir[0]) {
            openWindow(baseDir[0]);
          }
        });
      }}
    ]
  }, {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'Command+R', click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); } },
      { label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); } }
    ]
  }
];

var menu = Menu.buildFromTemplate(template);
