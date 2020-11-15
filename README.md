# tasklist-crud-api

このリポジトリは Code Chrysalis の生徒であるときに作成しました（This was created during my time as a student at Code Chrysalis）

## ユーザ管理用 API の利用方法

### GET 　ユーザ検索

```
http://localhost:3000/api/user/:id?limit=:limit&offset=:offset
```

全ユーザのデータを一括取得することができる。  
id を URL param として付加することで、ユーザ id 検索が可能。  
url query に limit と offset を指定することで取得するデータを制御できる。

- URL param の中で設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | --------------------------------------------- | --- |
  | 任意 | id | ユーザ ID(設定することでユーザ ID 検索が可能) | Int |

- URL query に設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---- | ---- | ---- |
  | 任意 | limit | 取得する件数 | int |
  | 任意 | offset | 開始位置からスキップする件数 | int |

### POST 　ユーザ登録

```
http://localhost:3000/api/user
```

Request Body で設定したユーザデータを登録できる。

- Content-type  
  application/json
- Request Body に設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 必須 | name | ユーザ名（数値のみは禁止） | string |
  | 必須 | token | 認証に利用するトークン文字列 | string |

### PATCH 　ユーザ更新

```
http://localhost:3000/api/user/:id
```

Request Body で設定したユーザデータに更新できる。

- URL param の中で設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 必須 | id | 更新対象のユーザ ID | string |
- Content-type  
  application/json
- Request body の中で設定するパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 任意 | name | ユーザ名（数値のみは禁止） | string |
  | 任意 | token | 認証に利用するトークン文字列 | string |　
  ※name か token のいずれかは必須

### PUT

```
http://localhost:3000/api/user/:id
```

Request Body で設定したユーザデータに更新できる。

- URL param の中で設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 必須 | id | 更新対象のユーザ ID | string |
- Content-type  
  application/json
- Request body の中で設定するパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 必須 | name | ユーザ名（数値のみは禁止） | string |
  | 必須 | token | 認証に利用するトークン文字列 | string |

### DELETE

```
http://localhost:3000/api/user/:id
```

URL param で設定したユーザデータを削除できる。

- URL param の中で設定可能なパラメータ  
  | | パラメータ | 設定内容 | 型 |
  | ---- | ---------- | ---------------------------- | ------ |
  | 必須 | id | 更新対象のユーザ ID | string |

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
