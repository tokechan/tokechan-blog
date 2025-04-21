import { getPosts } from "@/lib/notion";
import styles from "./Home.module.css";

export default async function Home() {
    // const posts = await getPosts()


    return (
        <main className={styles.main}>
          <h1 className={styles.h1}>Tokechan Blog</h1>
          <h2 className={styles.h2}>こちらはTokeの💬ブログです。</h2>
        </main>
    )
}