import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            }
        },
        sorts: [
            {
                property: "Publish Date",
                direction: "descending",
            },
        ],
    })

    return response.results.map((page: any) => {
        const properties =page.properties
        
        return {
            id: page.id,
            title: properties.Title?.title?.[0]?.plain_text || 'No Title',
            slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
            category: properties.Category?.select?.name || null,
            tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
            publishedDate: properties['Publish Data']?.date?.start || null,
            status: properties.Status?.select?.name || null,
            }
    })
}

export async function getPostBySlug(slug: string) {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID!,
            filter: {
                property: "Slug",
                rich_text: {
                    equals: slug,
                },
            },
        })

        const page = response.results[0]
        if (!page) return null

        const blocks = await notion.blocks.children.list({
            block_id: page.id!,
        })

        const properties = page.properties

        return {
            id: page.id,
            title: properties.Title?.title?.[0]?.plain_text || 'No Title',
            slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
            category: properties.Category?.select?.name || null,
            tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
            publishedDate: properties['Publish Data']?.date?.start || null,
            status: properties.Status?.select?.name || null,
            contentBlocks: blocks.results,
        }
}                       