## このリポジトリは開発中です。動作の保証が出来ない部分があります。

## Feature
- Laravel ^9.11
- React ^17.0.2
- TypeScript ^4.7.4
- [Base Repository][Base Repository]
- [Reset CSS][Reset CSS]

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

## 搭載機能 (随時加筆修正)
- [API認証][Auth]
- Global/Private/Presence Channel (using Pusher)
- DataBase Notification
- Postの投稿/Like
- UserのFollow
- Material UIによるHeader/Drawer Component

## 調整中
- PrivateChat/Post
- GroupChat/Post

## ディレクトリ構成
本プロジェクトは、機能第一のディレクトリ構成でフロントエンドを設計する  
任意の場所にstylesフォルダを配置して、肥大化したファイルからスタイルを分割すする  

```
/js
    route.tsx
    app.js
    bootstrap.js
    /contexts
        context,axiosのinterceptorsを纏めたファイル等,どのページでも利用するがUIを持たない機能
        ...
    /common
        /pages
            汎用的なpage component
            ...
        /汎用的な機能を有するcomponentの名前を持つフォルダ
            /components
                機能を構成するcomponent
                ...
        ...
        /types
            汎用的に使用される型を纏めたファイル
    /大まかな機能に関連するファイルを全て纏めた,任意の名前のフォルダ
        /types
            関連する型を纏めたファイル
        /機能を更に詳細に分割した,最大1つのpage componentを直下に持つ,独自の機能の名前を持つフォルダ
            (page component)
            /components
                page componentがあれば,それに依存するcomponent
                ...
                /components配下のファイル名をフォルダ名に持つ,それに依存するcomponentを纏めたフォルダ
                    機能を構成するcomponent
                    ...
                    /依存componentを纏めたフォルダを任意の階層同じように作成できる
        ...
        /components
            機能に関連していて,汎用性の高いcomponent
            ...
            /components配下のファイル名をフォルダ名に持つ,それに依存するcomponentを纏めたフォルダ
                機能を構成するcomponent
                ...
                /依存componentを纏めたフォルダを任意の階層同じように作成できる
    ...
```


[Base Repository]: https://github.com/mariebell/fullstack-project
[Reset CSS]: https://raw.githubusercontent.com/twbs/bootstrap/v4-dev/dist/css/bootstrap-reboot.css
[Auth]: https://akiblog10.com/authentication-spa-laravel-react/
