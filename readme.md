# 概要
http://192.168.2.53/honda/xls2json を見本に、  
node-webkit（node.js + webkit）で再実装したものです。  

node-webkitにnodeが組み込まれているので、  
node.jsがインストールされていない環境でも動きます。  

# 使い方
nw.exeを起動し、convertボタンを押してください。  
/assets/data にあるxlsをコンバートし、  
/assets/json に出力します。  

# コマンドで使う場合
node.jsをインストールし、パスを通しておきます。  
nw.exeがあるフォルダに移動し
```
node
require('xls2json')()
```

または

```
node -e "require('xls2json')()"
```

ただし、windowsだとサンプルで入れたPhraseData.xlsが正しく読み込めないようです。  
Linuxでは問題なくコンバートできるようです。  

# 機能
* pythonのxls2jsonと同じで、1行目が人間が読む用、2行目がkey、3行目が型としてコンバートします。  
* key は key[0] のように配列形式もサポートしています。  
* 型は int と string のみです。dateはサポートしていません。  
* シート名の先頭に ! を付けたり @ を付けた場合の動作はサポートしていません。  
* セルに - をいれた場合の動作についてもサポートしていません。  

# 備考
node-webbkit は mac版、linux版もあるので、  
やろうと思えばwindows以外でnode-webkitが動くものも作れますが作ってません

# license
MIT License
