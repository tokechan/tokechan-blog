// app/blog/page.tsx

import { getPosts } from "@/lib/notion";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Blog introduction</h1>
   
      <h1>こちらはブログ紹介ページです。</h1>
    </main>
  );
}
