// app/blog/page.tsx

import { getPosts } from "@/lib/notion";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Blog List</h1>
      <ul style={{ marginTop: "2rem" }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "1.5rem" }}>
            <Link href={`/blog/${post.slug}`}>
              <h2 style={{ fontSize: "1.2rem", color: "#0070f3" }}>{post.title}</h2>
            </Link>
            <p style={{ margin: "0.3rem 0", color: "#666" }}>
              {post.publishedDate}｜{post.category}
            </p>
            <div>
              {post.tags.map((tag: string) => (
                <span key={tag} style={{
                  backgroundColor: "#eee",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "0.5rem",
                  marginRight: "0.5rem",
                  fontSize: "0.8rem"
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <h1>こちらはブログ一覧ページです。</h1>
    </main>
  );
}
