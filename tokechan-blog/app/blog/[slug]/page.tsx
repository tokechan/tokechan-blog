import { getPostBySlug } from "@/lib/notion";
import MarkdownWrapper from "@/app/MarkdownWrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "./Blogs.module.css";

type Props = {
    params: { slug: string };
};

export default async function BlogPostPage( {params }: Props) {
    const post = await getPostBySlug(params.slug);
    

    if (!post) {
        return <div>記事が見つかりませんでした</div>;
    }

    return (
        <>
        
        <article style={{ padding: "2rem" }}>
        <Breadcrumb items={[
            { label: "ブログ一覧", href: "/blog/list" },
            { label: post.title, href: `/blog/${params.slug}` },
        ]} />
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.date}>{post.publishedDate}</p>
            <MarkdownWrapper html={post.content} className={styles.markdown} />
        </article>
        <Link href="/blog/list" >ブログ一覧に戻る</Link>
        </>
    );
}

