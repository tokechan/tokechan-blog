import { getPosts } from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
    const posts = await getPosts()
    return (
        <main style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "5rem", fontWeight: "bold" }}>Tokechan Blog</h1>

  
          <h1 style={{ fontSize: "2.5rem", color: "#0070f3" }}>こちらはポートフォリオ用のブログトップページです。</h1>
        </main>
    )
}