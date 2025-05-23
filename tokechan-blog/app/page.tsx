import styles from "./Home.module.css";

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600;

export default async function Home() {
    // 将来的にNotionからデータを取得
    // const posts = await getNotionPosts();

    return (
        <main className={styles.main}>
          <h1 className={styles.h1}>Tokechan Blog</h1>
          <h2 className={styles.h2}>こちらはTokeの💬ブログです。</h2>
          <p className={styles.description}>
            ISR対応済み - 1時間ごとに自動更新
          </p>
          <div className={styles.container}>
            <div className={styles.card}>
              <img 
              src="/images/top.jpeg"
              alt="top image"
              className={styles.centerImage}
              />
            </div>
          </div>
        </main>
    )
}