# tokechan-blog

# 🎨 Styling Guidelines for this Project

## 🧱 技術スタック別スタイリング方針

このプロジェクトでは、Next.js（App Router）を使用し、以下のようにスタイリング手法を使い分けています。

---

## 📁 CSS Modules（`*.module.css`）

### ✅ 使用場所
- `page.tsx`（ブログ一覧ページ、詳細ページなど）
- `layout.tsx`（全体レイアウト）

### ✅ 理由
- Server Componentであるため `styled-components` が使えない
- スタイルを外部に分離し、構造をシンプルに保つ
- TypeScriptで型補完が効く

### ✅ 使用方法
```tsx
import styles from "./Blogs.module.css";

<h1 className={styles.title}>ブログ一覧</h1>
```

---

## 💅 styled-components

### ✅ 使用場所
- Client Component（例：`Header.tsx`, `Tag.tsx`, `Breadcrumb.tsx`）
- UI単位の再利用性が高いコンポーネント

### ✅ 理由
- コンポーネント内にスタイルを閉じ込められる
- 変数/propsを使って動的なスタイルが可能

### ✅ 使用方法
```tsx
const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

export default function Header() {
  return <Title>Hello</Title>;
}
```

---

## 🔄 選定基準まとめ
| 条件 | 選択するスタイル手法 |
|------|----------------------|
| Server Component | ✅ CSS Modules |
| Client Component | ✅ styled-components |
| ページレベルのファイル | ✅ CSS Modules |
| 再利用されるUI部品 | ✅ styled-components |

---

## 📝 今後の方針
- **Atomic Design** を意識し、UIコンポーネントはできるだけ `styled-components` で粒度を分けて作成する
- **ページ単位の構造（`page.tsx`）はCSS Modulesで構成**
- 必要に応じて `Home.module.css`, `Blogs.module.css` などに分割して、可読性と保守性を高めていく

修正する

ブログの方向性を考え直す必要あり！！
