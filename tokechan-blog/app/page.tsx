import styles from "./Home.module.css";

export default async function Home() {
    return (
        <main className={styles.main}>
          <h1 className={styles.h1}>Tokechan Blog</h1>
          <h2 className={styles.h2}>こちらはTokeの💬ブログです。</h2>
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