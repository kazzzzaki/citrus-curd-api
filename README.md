# tasklist-crud-api

このリポジトリは Code Chrysalis の生徒であるときに作成しました（This was created during my time as a student at Code Chrysalis）

## crud-api for task data ###ユーザ管理用 API の利用方法

### GET

- 全ユーザ検索  
  URL : /api/user  
  全ユーザのデータを取得する場合は、id や名前を指定しない。

- ID 検索  
  URL : /api/user/:id  
  id を URL パラメータに追加することで id 指定での検索ができる。

- 名前検索  
  URL : /api/user/:name  
  name を URL パラメータに追加することで 名前指定での検索ができる。

上記 URL 全てでページネーション可能
| パラメータ | 設定内容 | 型 |
| ---- | ---- | ---- |
| limit | 取得する件数 | int |
| offset | 開始位置からスキップする件数 | int |

### POST

- 名前検索  
  URL : /api/user/:name  
  name を URL パラメータに追加することで 名前指定での検索ができる。

### PATCH

### PUT

### DELETE

## 利用したサービス

### Node.js

<img src="./nodejs.png" width="300">

https://nodejs.org/ja/

### express

<img src="./Express.jpeg" width="300">

https://expressjs.com/ja/

### express-validator

<img src="./express-validator.jpeg" width="300">

https://express-validator.github.io/docs/

### Sequelize

<img src="./sequelize.png" width="300">

https://sequelize.org/master/
