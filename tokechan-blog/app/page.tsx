import { getPosts } from "@/lib/notion";
import { PostItem } from "@/components/PostItem";

export default async function Home() {
    const posts = await getPosts()

    return (
        <main style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Tokechan Blog</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
          </ul>
        </main>
    )
}