// app/blog/page.tsx

import { getPosts } from "@/lib/notion";
import Link from "next/link";
import styles from "./page.module.css";



export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>💬Blog List</h1>
      <ul className={styles.postList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.postItem}>
            <Link href={`/blog/${post.slug}`} className={styles.postLink}>
              <h2>{post.title}</h2>
            </Link>
            <p className={styles.meta}>
              {post.publishedDate} 📁 {post.category}
            </p>
            <div>
              {post.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <h1>こちらはブログ一覧ページです。</h1>
    </main> 
  );
}
