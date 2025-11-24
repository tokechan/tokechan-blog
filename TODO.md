# 作業引き継ぎドキュメント

作成日: 2025-11-23
最終更新: 2025-11-24

## 現在の状況

### ✅ 完了した作業

1. **Notion Webhook Workerの実装**
   - Cloudflare WorkerでNotion Webhookを受信
   - `data_source.content_updated`イベントでGitHub Actionsをトリガー
   - 詳細なログ出力を実装
   - ファイル: `notion-webhook-worker/src/index.ts`

2. **GitHub Actionsワークフローの設定**
   - `repository_dispatch`イベントでトリガー
   - Notion APIからデータ取得 → ビルド → Cloudflare Pagesにデプロイ
   - 環境変数の確認ステップを追加
   - ファイル: `.github/workflows/deploy-on-notion-update.yml`

3. **Notion API連携の修正**
   - `lib/notion.ts`でStatusプロパティのフィルタリングを修正
   - Notion APIのフィルタリングを削除し、取得後にJavaScriptでフィルタリング

4. **マージコンフリクトの解決**
   - `wrangler.toml`
   - `app/Home.module.css`
   - `app/blog/list/BlogList.module.css`
   - `components/Footer.tsx`
   - `components/Breadcrumb.tsx`

5. **セキュリティ対策**
   - `SETUP_AUTO_DEPLOY.md`から機密情報（トークン、データベースID）を削除

### ✅ 解決した問題

1. **ビルドエラー: Notion API認証エラー**
   - ✅ ローカルの`.env.local`を更新
   - ✅ GitHub Secretsの`NOTION_TOKEN`を更新
   - ✅ テストを修正（`filter`から`sorts`への変更に対応）

2. **テストエラーの修正**
   - ✅ `__tests__/lib/notion.test.ts`を修正
   - ✅ `getPosts()`の実装変更（`filter`削除、取得後にJavaScriptでフィルタリング）に対応

3. **CLIでのデプロイ成功**
   - ✅ `wrangler pages deploy out --project-name=tokechan-blog --branch=main`でデプロイ成功
   - ✅ デプロイ先: `https://d8a30a76.tokechan-blog.pages.dev`

### ⚠️ 残っている問題

1. **Git連携の自動デプロイで環境変数が設定されない**
   - Cloudflare Pagesの自動ビルド（Git連携）で`Build environment variables: (none found)`と表示される
   - Production環境の「Variables and Secrets」で`NOTION_TOKEN`を設定しても反映されない
   - **調査が必要**: 帰宅後に調査予定

2. **Webhookの動作確認が未完了**
   - NotionでStatusを変更してもWebhookが発火していない
   - `wrangler tail`でログが表示されない
   - `data_source.content_updated`イベントがStatusプロパティの変更を検知するか未確認

## 次のステップ

### 1. Git連携の自動デプロイの環境変数設定（最優先）

#### 問題
- Cloudflare Pagesの自動ビルド（Git連携）で環境変数が設定されない
- `Build environment variables: (none found)`と表示される
- Production環境の「Variables and Secrets」で設定しても反映されない

#### 調査事項
- [ ] Cloudflare PagesのSettingsタブで、Environmentが「Production」になっているか確認
- [ ] Production環境の「Variables and Secrets」で`NOTION_TOKEN`と`NOTION_DATABASE_ID`が正しく設定されているか確認
- [ ] Preview環境とProduction環境で環境変数の設定が分かれているか確認
- [ ] Cloudflare Pagesのドキュメントで環境変数の設定方法を確認
- [ ] 必要に応じて、GitHub Actionsのワークフローでビルドとデプロイを実行する方法を検討

#### 確認方法
- Cloudflare Pagesのダッシュボード → `tokechan-blog` → Settings
- Environmentを「Production」に設定
- 「Variables and Secrets」セクションで環境変数を確認

### 2. Webhookの動作確認

#### 確認事項
- [ ] NotionのWebhook設定が有効か確認
- [ ] Workerがデプロイされているか確認
- [ ] `wrangler tail`でログを監視
- [ ] NotionでStatusを変更してWebhookが発火するか確認

#### 確認方法
```bash
cd notion-webhook-worker
npx wrangler tail
```

その後、NotionでStatusを「完了（Published）」に変更して、1-2分待つ。

### 3. Statusプロパティの型確認

#### 確認事項
- [ ] NotionデータベースのStatusプロパティの型を確認
- [ ] 現在の実装（`properties.Status?.select?.name`）が正しいか確認
- [ ] 必要に応じて、プロパティの型に合わせてコードを修正

#### 確認方法
- Notionでデータベースを開く
- Statusプロパティの設定を確認
- 型が`select`でない場合は、コードを修正

## ファイル構成

### 主要ファイル

- `notion-webhook-worker/src/index.ts` - Cloudflare Workerの実装
- `.github/workflows/deploy-on-notion-update.yml` - GitHub Actionsワークフロー
- `lib/notion.ts` - Notion API連携
- `SETUP_AUTO_DEPLOY.md` - セットアップガイド（ワークフロー遷移図含む）

### 設定ファイル

- `notion-webhook-worker/wrangler.jsonc` - Cloudflare Worker設定
- `wrangler.toml` - Cloudflare Pages設定

## 環境変数・シークレット

### GitHub Secrets（必須）
- `NOTION_TOKEN` - Notion統合の内部統合トークン（`ntn_`で始まる）
- `NOTION_DATABASE_ID` - NotionデータベースのID（32文字の16進数）
- `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare Account ID

### Cloudflare Worker Secrets（必須）
- `GITHUB_TOKEN` - GitHub Personal Access Token（`repo`スコープ）

## 実装の仕組み

### フロー
1. NotionでStatusを「完了（Published）」に変更
2. Notionが`data_source.content_updated`イベントを送信（1-2分の遅延の可能性）
3. Cloudflare Workerがイベントを受信
4. WorkerがGitHub Repository Dispatch APIを呼び出し
5. GitHub Actionsワークフローが起動
6. Notion APIからデータ取得 → Statusが「Published」の記事のみをビルド
7. Cloudflare Pagesにデプロイ

### 重要なポイント

- **Statusフィルタリング**: Notion APIのフィルタリングではなく、取得後にJavaScriptでフィルタリング（`lib/notion.ts`の`.filter((post) => post.status === "Published")`）
- **Webhookイベント**: `data_source.content_updated`のみを処理（他のイベントは無視）
- **集約イベント**: `data_source.content_updated`は集約イベントのため、1-2分の遅延がある可能性

## トラブルシューティング

### ビルドエラー: API token is invalid
- GitHub Secretsの`NOTION_TOKEN`を確認
- Notionでトークンを再発行
- トークンが`ntn_`で始まるか確認

### Webhookが発火しない
- NotionのWebhook設定を確認（有効になっているか）
- WorkerのURLが正しいか確認（`https://notion-webhook-worker.fleatoke.workers.dev/`）
- `wrangler tail`でログを確認
- Statusプロパティの変更が`data_source.content_updated`イベントをトリガーするか確認

### Statusプロパティの型エラー
- NotionデータベースのStatusプロパティの型を確認
- `properties.Status?.select?.name`が正しく動作するか確認
- 型が異なる場合は、コードを修正

## 参考リンク

- [Notion Webhook ドキュメント](https://developers.notion.com/reference/webhooks)
- [Notion API ドキュメント](https://developers.notion.com/reference)
- [GitHub Repository Dispatch API](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)

## メモ

- Statusプロパティの変更が`data_source.content_updated`イベントをトリガーするかは未確認
- もしWebhookが動作しない場合、ポーリング方式への切り替えも検討可能（ただし、リアルタイム性は低下）

## 今日の成果（2025-11-24）

### 完了した作業
1. ✅ ローカルの`.env.local`を更新してビルドエラーを解決
2. ✅ GitHub Secretsの`NOTION_TOKEN`を更新
3. ✅ テストを修正（`filter`から`sorts`への変更に対応）
4. ✅ CLIでのデプロイ成功（`wrangler pages deploy`）
5. ✅ Production環境とPreview環境の違いを理解

### 重要な発見
- **Git連携（自動デプロイ）**: `main`ブランチにpush → Production環境、その他のブランチ → Preview環境
- **CLIデプロイ**: `wrangler pages deploy`でデプロイ可能（環境変数は手動設定が必要）
- **環境変数の設定場所**: 
  - GitHub Secrets（GitHub Actions用）
  - Cloudflare PagesのVariables and Secrets（自動ビルド用）
  - ローカルの`.env.local`（ローカル開発用）

### 次の作業（帰宅後）
- Git連携の自動デプロイで環境変数が設定されない問題の調査
- Cloudflare PagesのProduction環境の環境変数設定方法の確認

