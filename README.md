<<<<<<< HEAD
# 🎨 Tokechan Blog

Next.js 15とNotion APIを使用したモダンなブログアプリケーション

## 🚀 プロジェクト概要

このプロジェクトは、NotionをCMS（コンテンツ管理システム）として使用し、Next.js 15で構築された静的サイトジェネレーション（SSG）ブログです。

### ✨ 主な特徴

- **📝 Notion CMS**: Notionをコンテンツ管理システムとして使用
- **⚡ Next.js 15**: 最新のApp Routerを使用したモダンなReactフレームワーク
- **🎨 静的サイト生成**: 高速で安全な静的サイト
- **💅 Styled Components**: CSS-in-JSによるスタイリング
- **📱 レスポンシブデザイン**: モバイルファーストなUI
- **🔧 TypeScript**: 型安全な開発環境
- **☁️ Cloudflare Pages**: 高速なグローバル配信

## 🏗️ 技術スタック
=======
# Tokechan Blog

Next.js 15とNotion APIを使用したモダンなブログアプリケーション

## プロジェクト概要

このプロジェクトは、NotionをCMS（コンテンツ管理システム）として使用し、Next.js 15で構築された静的サイトジェネレーション（SSG）ブログ

### 主な特徴

- **Notion CMS**: Notionをコンテンツ管理システムとして使用
- **Next.js 15**: 最新のApp Routerを使用したモダンなReactフレームワーク
- **静的サイト生成**: 高速で安全な静的サイト
- **Styled Components**: CSS-in-JSによるスタイリング
- **レスポンシブデザイン**: モバイルファーストなUI
- **TypeScript**: 型安全な開発環境
- **Cloudflare Pages**: 高速なグローバル配信

## 技術スタック
>>>>>>> origin/main

### **フロントエンド**
- **Next.js 15.3.1** - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript 5** - 型安全なJavaScript
- **Styled Components 6.1.17** - CSS-in-JS

### **CMS・データ**
- **Notion API** - コンテンツ管理
- **@notionhq/client** - Notion APIクライアント
- **notion-to-md** - Notion → Markdown変換

### **マークダウン・コンテンツ**
- **marked 15.0.8** - Markdownパーサー
- **highlight.js** - シンタックスハイライト

### **開発・ビルド**
- **ESLint 9** - コード品質管理
- **Cloudflare Wrangler** - デプロイツール

<<<<<<< HEAD
## 📁 プロジェクト構造

```
tokechan-blog/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # ルートレイアウト
│   ├── layout.module.css       # レイアウト用CSS
│   ├── page.tsx                # ホームページ
│   ├── globals.css             # グローバルスタイル
│   ├── Home.module.css         # ホームページスタイル
│   ├── MarkdownWrapper.tsx     # Markdown表示用ラッパー
│   └── blog/                   # ブログルート
│       ├── page.tsx            # ブログトップ
│       ├── [slug]/             # 動的ルート（記事詳細）
│       │   ├── page.tsx
│       │   └── BlogPost.module.css
│       └── list/               # 記事一覧
│           ├── page.tsx
│           └── BlogList.module.css
├── components/                 # 再利用可能なコンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostItem.tsx
│   ├── Tag.tsx
│   └── Breadcrumb.tsx
├── lib/                        # ユーティリティ
│   └── notion.ts
├── types/                      # TypeScript型定義
│   └── notion.ts
├── public/                     # 静的ファイル
│   └── images/
│       └── top.jpeg
├── next.config.ts              # Next.js設定
├── package.json                # 依存関係管理
├── tsconfig.json               # TypeScript設定
├── eslint.config.mjs           # ESLint設定
├── .gitignore
├── .node-version
├── .nvmrc
├── README.md
└── out/                        # ビルド成果物（静的HTML等）
```

## 🎨 スタイリング戦略

このプロジェクトでは、以下のスタイリング手法を使い分けています：

### **📁 CSS Modules（`*.module.css`）**
=======
## プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx            # ルートレイアウト
│   ├── page.tsx              # ホームページ
│   ├── globals.css           # グローバルスタイル
│   ├── Home.module.css       # ホームページスタイル
│   └── blog/              # ブログルート
│       ├── page.tsx          # ブログトップ
│       ├── [slug]/        # 動的ルート（記事詳細）
│       └── list/          # 記事一覧
├── components/             # 再利用可能なコンポーネント
│   ├── Header.tsx            # ヘッダーコンポーネント
│   ├── Footer.tsx            # フッターコンポーネント
│   ├── PostItem.tsx          # 記事アイテム
│   ├── Tag.tsx               # タグコンポーネント
│   └── Breadcrumb.tsx        # パンくずナビ
├── lib/                   # ユーティリティ
│   └── notion.ts             # Notion API連携
├── types/                 # TypeScript型定義
│   └── notion.ts             # Notion関連の型
├── public/                # 静的ファイル
│   └── images/            # 画像ファイル
├── out/                     # `npm run build` で生成される静的成果物
├── next.config.ts            # Next.js設定
├── package.json              # 依存関係管理
├── tsconfig.json             # TypeScript設定
└── wrangler.toml             # Cloudflare設定
```

## スタイリング戦略

このプロジェクトでは、以下のスタイリング手法を試している：

### **CSS Modules（`*.module.css`）**
>>>>>>> origin/main
- **使用場所**: `page.tsx`, `layout.tsx`（Server Component）
- **理由**: Server Componentでは`styled-components`が使用できないため

```tsx
import styles from "./Home.module.css";
<h1 className={styles.title}>ブログ一覧</h1>
```

<<<<<<< HEAD
### **💅 Styled Components**
=======
### **Styled Components**
>>>>>>> origin/main
- **使用場所**: Client Component（`Header.tsx`, `Tag.tsx`など）
- **理由**: コンポーネント内スタイルの閉じ込めと動的スタイル

```tsx
const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;
```

<<<<<<< HEAD
## 🚀 セットアップ・開発手順

### **1. 環境変数の設定**

`.env.local` ファイルを作成して、Notion APIの設定を行います：
=======
## セットアップ・開発手順

### **1. 環境変数の設定**

`.env.local` ファイルを作成して、Notion APIの設定を行う：
>>>>>>> origin/main

```bash
# Notion API設定
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

### **2. 依存関係のインストール**

```bash
<<<<<<< HEAD
cd tokechan-blog
=======
>>>>>>> origin/main
npm install
```

### **3. 開発サーバーの起動**

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて確認

### **4. ビルド・デプロイ**

```bash
# 静的サイト生成
npm run build

# Cloudflare Pagesへデプロイ
wrangler pages deploy
```

<<<<<<< HEAD
## 📦 利用可能なスクリプト
=======
## 利用可能なスクリプト
>>>>>>> origin/main

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド（静的サイト生成） |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintによるコード検証 |

<<<<<<< HEAD
## 🔧 Notion設定

### **データベース構造**

Notionデータベースには以下のプロパティが必要です：
=======
## Notion設定

### **データベース構造**

Notionデータベースには以下のプロパティが必要：
>>>>>>> origin/main

| プロパティ名 | 型 | 説明 |
|-------------|---|------|
| `Title` | タイトル | 記事タイトル |
| `Slug` | リッチテキスト | URL用スラッグ |
| `Published` | チェックボックス | 公開状態 |
| `Publish Date` | 日付 | 公開日 |
| `Tags` | マルチセレクト | タグ |
| `Category` | セレクト | カテゴリ |
| `Status` | セレクト | ステータス |

<<<<<<< HEAD
## 🌐 デプロイ・本番環境

### **Cloudflare Pages**
- 静的サイトホスティング
- グローバルCDN配信
- 自動HTTPS
- プレビューデプロイ機能

### **環境変数（本番）**
本番環境では、Cloudflare Pagesの環境変数設定で以下を設定：
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

## 🔮 今後の予定・改善点

### **機能追加**
- [ ] ISR（Incremental Static Regeneration）対応
- [ ] 検索機能
- [ ] ダークモード対応
- [ ] RSS Feed生成
- [ ] SEO最適化強化

### **技術改善**
- [ ] TypeScriptエラーの根本的解決
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ向上
- [ ] テスト環境構築

## 🤝 貢献・開発

### **開発環境要件**
- Node.js 18.0+ 
- npm 9.0+

### **開発フロー**
1. Issueの作成
2. ブランチの作成
3. 実装・テスト
4. プルリクエスト

## 📄 ライセンス

MIT License

## 👤 作成者

**Toke** - Tokechan Blog

---

**🎨 Design Philosophy**: シンプルで美しく、パフォーマンスを重視したモダンなブログ体験を提供



=======
## デプロイ・本番環境

### **Cloudflare Pages**
- 静的サイトホスティング
- `wrangler.toml` で `npm run build` を実行し、生成された `out/` を配信

---

>>>>>>> origin/main
