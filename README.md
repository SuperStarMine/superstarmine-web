# スーパースターマイン 公式Webサイト
<hr>

## クイックスタートガイド for Editors

### 概要
このガイドではニュースをはじめとするサイト内の各種コンテンツを編集する際の手順を案内します。バグ修正や機能改善のために開発環境を構築したい場合は後述の[クイックスタートガイド for Developers](#クイックスタートガイド-for-developers)を参照してください。

### このガイドで出来るようになること
- 新しいコンテンツを追加する（例: ニュースを追加する、メンバーを追加する）
- 基本的な文章を変更する（例: 概要の内容を変える）
- レイアウトを入れ替える（例: ニュースと概要を入れ替える）

### このガイドでは出来るようにならいこと
- 新しい機能を追加する（例: Vimeoの動画を埋め込めるようにする）
- サイトの機能に埋め込まれた文章を変更する（例: フッターのライセンスの文体を変える）
- バグ修正をする

### 目次

- [ステップ 1. 環境構築](#ステップ-1-環境構築)
  - [1-1. Homebrewのインストール](#1-1-homebrewのインストール)
  - [1-2. 必要なソフトウェアのインストール](#1-2-必要なソフトウェアのインストール)
- [ステップ 2. Gitのリポジトリを準備する](#ステップ-2-gitのリポジトリを準備する)
  - [2-1. ForkかCloneを選択する](#2-1-forkかcloneを選択する)
    - [Fork](#fork)
    - [Clone](#clone)
  - [2-2-A. Forkして編集をする](#2-2-a-forkして編集をする)
  - [2-2-B. Cloneして編集をする](#2-2-b-cloneして編集をする)
- [情報: main.jsの構文](#情報-mainjsの構文)
  - [ニュースを追加する](#ニュースを追加する)
  - [メンバーカードを追加する](#メンバーカードを追加する)
- [情報: 画像を追加する](#情報-画像を追加する)
<hr>

### ステップ 1. 環境構築
このWebサイトの内容を編集するには以下のソフトウェアが必要です。
- シェルコマンドを実行できるソフトウェア（例: iTerm、ターミナル.app、xterm、WSL）
- Node.js（例: Node.js v16.0.0）
- Gitを操作できるソフトウェア（例: gitコマンド、Sourcetree）
- テキストファイルを編集できるソフトウェア（例: VSCode、テキストエディット.app、vi）

また、画像ファイルを新たに追加する際には追加で以下のソフトウェアが必要です。
- ImageMagick

このステップにおいて、以降は暫定的にmacOSユーザー向けに限定して案内を行います。それ以外の環境をお使いの方は各自お調べの上、POSIX準拠相当の環境であれば同様の環境が構築できるはずです。

#### 1-1. Homebrewのインストール
これらの環境を用意するにはコマンドラインを用いると簡単で安全です。既にHomebrewまたはMacPortsを導入済みの場合は[1-2. 必要なソフトウェアのインストール](#1-2-必要なソフトウェアのインストール)へ進んでください。
以下のコマンドをコピーしてターミナルに貼り付けて実行します。これによりHomebrewがお使いのMacにインストールされます。実行の際にはMacがインターネットに接続されている必要があります。
```Shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Homebrewはさまざまなソフトウェアをコマンドラインからインストールするためのツールです。

#### 1-2. 必要なソフトウェアのインストール
Homebrewを使ってコマンドラインで必要なソフトウェアをインストールします。[ステップ 1.  環境構築](#ステップ-1-環境構築)のリストで必要なソフトウェアを確認します。以下に実行するコマンドの一例を示します。
- iTermをインストールする
```shell
brew install iterm2
```
- Node.jsをインストールする
```shell
brew install node
```

- Gitコマンドをインストールする
```shell
brew install git
```
- VSCodeをインストールする
```shell
brew install visual-studio-code
```
- ImageMagickをインストールする
```shell
brew install imagemagick
```
<details>
<summary>上級者のためのヒント（クリックして開く）</summary>

```shell
brew search hub
```
のようにコマンドを実行すると任意のキーワードでソフトウェアを検索できます。この例ではhubコマンドを検索しています。hubコマンドはgitコマンドの上位互換性をもつソフトウェアで、issueの閲覧やPull Requestの作成など、GitHubの機能をコマンドラインから利用することができます。
</details>
<hr>

### ステップ 2. Gitのリポジトリを準備する
このWebサイトはGitで管理されています。このステップではGitHub上にあるリポジトリの内容を編集できるようにします。Gitについて不明な場合は各自で調べて確認してください。

#### 2-1. ForkかCloneを選択する
このWebサイトを編集するにはリポジトリをForkするか、Cloneする必要があります。それぞれの操作の特徴は以下の通りです。
##### Fork
- 変更を本番環境に反映させる前に、[dev.superstarmine.ga](https://dev.superstarmine.ga)でWebサイトの変更を確認できます。
- Websサイトの変更を[dev.superstarmine.ga](https://dev.superstarmine.ga)で確認するには[dev.superstarmine.gaが紐づけられているリポジトリの管理者](https://github.com/HIBIKI-CUBE/)の承認が必要です。
- 変更を本番環境に反映させるには[dev.superstarmine.gaが紐づけられているリポジトリの管理者](https://github.com/HIBIKI-CUBE/)による操作が必要です。
- この方法を選択する場合は[2-2-A. Forkして編集をする](#2-2-a-forkして編集をする)に進んでください。
##### Clone
- スーパースターマインのOrganizationに所属している人であれば誰でも変更をWebサイトに反映させることができます。
- Websサイトの変更を[dev.superstarmine.ga](https://dev.superstarmine.ga)で確認することはできません。
- 現段階ではこの方法は推奨していません。この方法を選択する場合はWebサイトの管理者と相談の上各自で調べるか、今後整備予定の[2-2-B. Cloneして編集をする](#2-2-b-cloneして編集をする)に進んでください。

#### 2-2-A. Forkして編集をする

⚠️注意 このセクションのうちのWebブラウザで行う操作の一部はスマートフォン向けの画面レイアウトでは行えません。
1. Webブラウザで[GitHub](https://github.com/login)を開き、GitHubにログインします。
2. Webブラウザで[dev.superstarmine.gaが紐づけられているリポジトリ](https://github.com/HIBIKI-CUBE/superstarmine-web)を開き、画面右上にある「Fork」ボタンをクリックします。
3. Forkが完了し、自分のアカウントにコピーされたリポジトリのページが表示されたら緑色の「Code」ボタンをクリックし、Cloneに必要な情報をコピーします。gitコマンドを使用する場合には既に選択されている「HTTPS」のままで、クリップボードのアイコンをクリックしてURLをコピーします。
4. コピーした情報を使ってリポジトリをローカルにCloneします。gitコマンドを使用する場合には任意のディレクトリで以下のコマンドを実行します。
```shell
bash;git clone $(pbpaste);exit
```
5. superstarmine-webというフォルダの中のsrcフォルダの中にあるmain.jsを任意のテキストエディタで開き、編集を行います。書き方は既にファイル内にあるものに従ってください。詳しい構文は[情報: main.jsの構文](#mainjsの構文)を参照してください。
6. Webサイトのビルドを行います。上記の手順で作成したリポジトリのディレクトリまでコマンドライン上で移動してください。```pwd```とコマンドを打って表示された結果の末尾に```superstarmine-web```と表示されていれば問題ありません。
7. 以下のコマンドを実行します。このコマンドではWebサイトのビルドに必要なファイルをこのディレクトリ内にインストールします。
```shell
npm i
```
8. 以下のコマンドを実行します。このコマンドではWebサイトをビルドします。
```Shell
npm run build
```
9. Gitで変更をコミットします。コミットメッセージは以下のようにします。
```
1行目: Edit {編集内容を日本語で簡潔にまとめる}
2行目: {空白行}
3行目: {必要であれば編集の詳細や備考をこれ以降の行に記述する}
```
10. Gitで変更をプッシュします。
11. 上記のForkの手順で自分のアカウントにコピーしたリポジトリのページを開き、Pull Requestを作成します。通常であれば画面上半分右寄りに表示されているPull Requestというグレーのリンクが使えるはずです。
12. 表示された画面で緑色の「Create Pull Request」ボタンを押します。
13. 次に表示された画面でタイトルとコメントを適切に記述した上で、同様の緑色の「Create Pull Request」ボタンを押します。
14. Pull Requestが承認され次第、[dev.superstarmine.ga](https://dev.superstarmine.ga)でWebサイトの変更を確認できるようになります。必要に応じて[dev.superstarmine.gaが紐づけられているリポジトリの管理者](https://github.com/HIBIKI-CUBE/)に連絡をしてください。
#### 2-2-B. Cloneして編集をする
このセクションは未整備です。

### 情報: main.jsの構文
main.jsはWebサイト内ほぼ全てのコンテンツを定義しているファイルです。このファイルを編集することでWebサイトの内容を簡単に変更することができます。このファイルを編集する際には以下の構文に従って下さい。
main.jsはその拡張子からも分かる通り、JavaScriptのコードを記述したファイルです。このファイルの構文について正確に理解するにはjavaScriptについての知識を深めて下さい。特に、オブジェクト、文字列、配列、数値、真偽値については最低限よく理解しておいて下さい。

Webサイトのコンテンツはmain.js内で宣言されているapp定数オブジェクト内のpropsメンバーによって定義されています。
<hr>

#### ニュースを追加する
1. main.js内の以下の場所を参照してください。
```JavaScript
app.props.settings.find(setting => setting.title == 'NEWS').contents.articles;
```
2. articles配列の先頭に新しくオブジェクトを追加します。既にあるものをコピーするか、以下をコピーして貼り付けてください。
```JavaScript
{
  title: '',
  date: {
    year: '',
    month: '',
    day: ''
  },
  url: ''
},
```
3. それぞれの値を入力してください。title以外の値は必須ではありません。

⚠️注意
データの構造は改変しないでください。例えば、以下のようなデータ構造では日付が表示されません。
```JavaScript
{
  title: 'ニュースのタイトル',
  year: '2021',
  month: '4',
  day: '25'
  url: ''
},
```
また、各データの順番についても、可読性を保つために改変しないでください。

<hr>

#### メンバーカードを追加する
1. main.js内の以下の場所を参照してください。
```JavaScript
app.props.settings.find(setting => setting.title == 'MEMBERS').contents.cards;
```
2. cards配列の先頭に新しくオブジェクトを追加します。既にあるものをコピーするか、以下をコピーして貼り付けてください。
```JavaScript
{
  name: '',
  imageId: '',
  post: [
    '',
    ''
  ],
  accounts: [
    {
      name: '',
      id: ''
    },
    {
      name: '',
      id: ''
    }
  ]
},
```
3. それぞれの値を入力してください。name以外の値は必須ではありません。

⚠️注意
データの構造は改変しないでください。例えば、以下のようなデータ構造ではWebサイト全体が正しく表示されなくなります。
```JavaScript
{
  name: 'マチコー',
  imageId: 'machiko',
  post: [
    'リーダー',
    'プランナー'
  ],
  {
    name: 'twitter',
    id: 'MachiCollider'
  },
  {
    name: 'facebook',
    id: 'MachiCollider'
  },
  {
    name: 'note',
    id: 'machikou_mk2'
  }
},
```

<hr>

### 情報: 画像を追加する
   1. 十分高画質な画像を用意します。
   2. 用意した画像ファイルをsuperstarmine-webというフォルダの中の``img``フォルダ内に移動させ、わかりやすい名前をつけます。この時のファイル名の拡張子よりも前の部分が``imageId``となります。ただし、メンバーカードのプロフィール写真に使う画像は``img/members``に移動させます。
   3. superstarmine-webというディレクトリ（フォルダ）にコマンドライン上で移動した上で、以下のコマンドを実行します。
   ```Shell
   ./tools/processimage.sh {追加したファイルへのパス}
   ```
   例えば、foo.pngという画像ファイルを追加した場合は以下のコマンドを実行します。
   ```Shell
   ./tools/processimage.sh ./img/foo.png
   ```
   4. 追加した画像を使用したい場所の``imgageId``に、上記で決めた``imageId``を設定してください。

<hr>

## クイックスタートガイド for Developers
Node.jsの環境を準備した上で、リポジトリをフォーク、クローンし以下のコマンドを実行して下さい。


```Shell
npm -i
npm run dev
```

Pull Requestを行う際にはその前に以下のコマンドを実行し、コミットとプッシュを行って下さい。

```shell
npm run build
```
