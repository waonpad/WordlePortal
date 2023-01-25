## このリポジトリは開発中です。動作の保証が出来ない部分があります。

## Feature
- Laravel ^9.11
- React ^17.0.2
- TypeScript ^4.7.4

## Start Up (on Windows using Makefile)
```
make build
```
> #### apkがエラーを吐いた場合
> docker/php/Dockerfileの8~10行目のコメントアウトを解除  
> 12,13行目をコメントアウトして再試行するか各自DNSの設定をしてください

> vendorとnode_modulesはvolumeマウントされているためホストOSで閲覧できません  
> エディタの警告回避等に必要な場合、srcディレクトリ下でホストにパッケージをインストールしてください  

> mui-chips-inputが原因で型定義エラーが出るので、  
> node_modules/mui-chips-input/node_modulesを各自削除してください

## Hot Reload
appコンテナ内でファイルを監視して自動コンパイル  
ローカルでファイルを監視してホットリロード
