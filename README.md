# tasklist-crud-api

このリポジトリは Code Chrysalis の生徒であるときに作成しました（This was created during my time as a student at Code Chrysalis）

crud-api for task data

Sequelize
https://sequelize.org/master/

how to make seeds
https://sequelize.org/master/manual/migrations.html#creating-the-first-seed

###yarn script で作成したコマンド
yarn migrate : table drop と create table してくれる。
yarn seed : テーブルデータの bulk delete と bulk insert をしてくれる
yarn psql : psql の database_development データベースにログインしてくれる
yarn push : git push origin master してくれる
yarn test : test と lint 実行してくれる
yarn dev : nodemon でサーバ起動してくれる

###利用するコマンド

- ファイルや必要なディレクトリが作成される。
  yarn sequelize init これで、config
- DBmodel 作成コマンド。　これで migration ファイルも一緒に作成される。
  yarn sequelize model:create --force --name user --underscored --attributes name:string,token:string
  yarn sequelize model:create --name task --underscored --attributes userId:integer,task:string,project:string,priority:integer,due:date,comment:string,completed:boolean
  yarn sequelize model:create --name project --underscored --attributesuser:id, task:string, project:string, priority:integer, due:date, comment:string
- seed ファイル作成コマンド
  yarn sequelize seed:generate
-
