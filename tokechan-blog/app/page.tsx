import { getPosts } from "@/lib/notion";
import Link from "next/link";
import styles from "./Home.module.css";

export default async function Home() {
    const posts = await getPosts()
    return (
        <main style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>Tokechan Blog</h1>

  
          <h2 style={{ fontSize: "2.5rem", color: "rgb(115, 183, 201)" }}>こちらはTokeの💬ブログです。</h2>
        </main>
    )
}