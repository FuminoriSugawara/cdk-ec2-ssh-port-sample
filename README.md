# AWS CDKでEC2インスタンスを作成し、SSHポートを22から10022に変更するサンプル

このリポジトリは、AWS Cloud Development Kit (CDK)を使用してEC2インスタンスを作成し、SSHポートを22から任意のポート（ここでは10022とします）に変更するサンプルを提供します。また、SSHポート番号を変更した後、ローカルマシンから変更されたポート番号でSSH接続できるようにする方法についても説明します。

### 必要なツール
このサンプルを実行するには、以下のツールが必要です。

- AWS CDK
- Node.js (TypeScript)
- AWS CLI

### セットアップ手順
このリポジトリをクローンします。
```shell
git clone https://github.com/FuminoriSugawara/aws-cdk-ec2-ssh-port-sample.git
````
必要なNode.jsパッケージをインストールします。
```shell
cd cdk
npm install
```

AWS CDKを使用して、スタックをデプロイします。
```
cdk deploy
```
これにより、EC2インスタンスが作成され、SSHポート番号が10022に変更されます。

### SSH接続手順
#### 秘密鍵の用意
AWS マネジメントコンソールからSSMにアクセスし、パラメータストア一覧を表示します。
パラメータストアの一覧画面で、ec2/keypairを選択します。
値を表示し、PrivateKeyの内容をコピーし、その内容をkey.pemとして保存します。

作成した鍵ファイルの権限を変更します。
```shell
chmod 600 key.pem
```

SSHクライアントを使用して、EC2インスタンスに接続します。以下は、ポート番号が10022の場合の例です。

```shell
ssh -i /path/to/your/key.pem ubuntu@your-ec2-instance-ip -p 10022
```
これにより、変更されたポート番号でSSH接続が確立されます。

### クリーンアップ
このサンプルで作成されたAWSリソースを削除するには、以下のコマンドを実行します。

```shell
cdk destroy
```
以上で、このサンプルの使い方について説明しました。詳細については、ソースコードを参照してください。