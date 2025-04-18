import { getPostBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
import { marked } from "marked";
import 'highlight.js/styles/github.css';



type Params = {
    params: {
        slug: string;
    }
}

export default async function BlogPostPage({ params }: Params) {
    const post = await getPostBySlug(params.slug)

    if (!post) return notFound()

        const html = marked(post.content?.markdown || post.content?.parent || "");

        return (
            <main style={{ padding: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{post.title}</h1>
                <p style={{ color: "#666" }}>{post.publishedDate} | {post.category}</p>
                <div style={{ margin: "2rem 0" }}>
                    {post.tags.map((tag: string) => (
                        <span
                        key={tag}
                        style={{
                            display: "inline-block",
                            backgroundColor: "#f0f0f0",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            marginRight: "0.5rem",
                            fontSize: "0.8rem",
                        }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <hr style={{ margin: "2rem 0" }} />

                {/* <div>
                    {post.contentBlocks.map((block: any) =>{
                        if (block.type === "paragraph") {
                            return (
                            <p key={block.id} style={{ marginBottom: "1rem" }}>
                                {block.paragraph.rich_text.map((text: any) => text.plain_text).join("")}
                            </p>
                        )   
                    }
                    return null
                    })}
                </div> */}
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </main>
        )
}