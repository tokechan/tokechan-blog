# Next.js Static Export（静的サイト生成）まとめ

## 概要

`next.config.ts`で`output: "export"`を設定すると、Next.jsは完全な静的サイトとして出力されます。
これにより、サーバーレスで高速・低コストなホスティングが可能になります。

## 開発モード vs 本番モード

### 開発モード（`npm run dev`）
- **用途**: 開発・デバッグ
- **キャッシュ**: 無効（毎回データ取得）
- **Notion API**: ページアクセスごとに呼ばれる
- **特徴**: ホットリロードで即座に変更反映

### 本番モード（`npm run build` + 静的配信）
- **用途**: 本番環境へのデプロイ
- **キャッシュ**: 有効（ビルド時に静的生成）
- **Notion API**: ビルド時のみ呼ばれる
- **特徴**: 超高速・APIコール最小限

## コマンド一覧

```bash
# 開発モード起動
npm run dev

# 本番ビルド（静的ファイル生成）
npm run build

# ローカルで本番動作確認
npx serve@latest out

# デプロイ（Cloudflare Pagesなど）
# → outディレクトリをアップロード
```

## 重要なポイント

### ✅ できること
- 完全な静的HTML/CSS/JSの生成
- CDN配信（Cloudflare Pages, Vercel, Netlifyなど）
- ビルド時のデータ取得（SSG）
- クライアントサイドでの動的機能（React）

### ❌ できないこと
- `next start`コマンド（サーバーが不要なため）
- ISR（Incremental Static Regeneration）
- サーバーサイドAPI Routes
- リアルタイムのデータ取得

## このプロジェクトでの利点

1. **Notion APIコール削減**
   - ビルド時のみアクセス
   - ユーザーアクセス時は静的ファイル配信のみ

2. **高速表示**
   - 事前レンダリング済み
   - CDNからの配信で世界中どこでも高速

3. **低コスト**
   - サーバー不要
   - Cloudflare Pagesなら無料枠で十分

4. **セキュリティ**
   - NOTION_TOKENは本番環境に不要
   - ビルド時のみ必要

## デプロイフロー

```
コード修正
   ↓
npm run build（ローカルまたはCI/CD）
   ↓
outディレクトリ生成
   ↓
Cloudflare Pagesにデプロイ
   ↓
世界中のCDNから配信
```

## 更新方法

ブログ記事を更新したい場合：
1. Notionで記事を編集
2. `npm run build`を再実行
3. 再デプロイ

または、CI/CDで自動化（例：Notion Webhook → 自動ビルド → 自動デプロイ）

---

**参考リンク**
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages](https://pages.cloudflare.com/)

