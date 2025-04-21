import { getPostBySlug } from "@/lib/notion";
import MarkdownWrapper from "@/app/MarkdownWrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "./BlogPost.module.css";

export default async function BlogPostPage({ 
  params,
}: { 
  params: { slug: string } 
}) {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return <div>記事が見つかりませんでした</div>;
    }

    return (
        <article className={styles.article}>
            <Breadcrumb items={[
                { label: "ブログ一覧", href: "/blog/list" },
                { label: post.title, href: `/blog/${params.slug}` },
            ]} />
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.date}>{post.publishedDate}</p>
            <MarkdownWrapper html={String(post.content)} className={styles.markdown} />
            <Link href="/blog/list" className={styles.backButton}>ブログ一覧に戻る</Link>
        </article>
    );
}

