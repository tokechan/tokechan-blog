import { getPostBySlug } from "@/lib/notion";
import MarkdownWrapper from "@/app/MarkdownWrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "./BlogPost.module.css";
import { getPosts } from "@/lib/notion";

export async function generateStaticParams() {
    const posts = await getPosts();

    return posts.map((post: any) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage(
  props: {
      params: Promise<{ slug: string }>;
    }
) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }


  return (
    <article className={styles.article}>
      <Breadcrumb
        items={[
          { label: "ブログ一覧", href: "/blog/list" },
          { label: post.title, href: `/blog/${params.slug}` },
        ]}
      />
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.date}>{post.publishedDate}</p>
      <MarkdownWrapper html={post.content} className={styles.markdown} />
      <Link href="/blog/list" className={styles.backButton}>
        ブログ一覧に戻る
      </Link>
    </article>
  );
}
  

