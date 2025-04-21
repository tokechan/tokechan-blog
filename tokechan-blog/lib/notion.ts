import { Client } from "@notionhq/client";
import { PageObjectResponse, PartialPageObjectResponse, } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";


const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion});


export async function getPosts() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [
            {
                property: "Publish Date",
                direction: "descending",
            },
        ],
    })
    console.log("🟣 Notionから取得したposts", response.results);


    return response.results.map((page: any) => {
        const properties =page.properties
        
        return {
            id: page.id,
            title: properties.Title?.title?.[0]?.plain_text || 'No Title',
            slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
            category: properties.Category?.select?.name || null,
            tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
            publishedDate: properties['Publish Data']?.date?.start || null,
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
        });

        const page = response.results[0]
        if (!page) return null
       
        if (!("properties" in page)) {
            throw new Error("Page does not have properties");
        }

        const typedPage = page as PageObjectResponse;
        const properties = typedPage.properties;


        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const markdownObj = await n2m.toMarkdownString(mdBlocks);
        const html = await marked(markdownObj.parent);
        
        console.log("Serverでのhtmlの型",typeof html)
    

        return {
            id: page.id,
            title: (properties.Title as { title: { plain_text: string }[] })?.title?.[0]?.plain_text ?? 'No Title',
            slug: (properties.Slug as { rich_text: { plain_text: string }[] })?.rich_text?.[0]?.plain_text ?? '',
            category: (properties.Category as { select: { name: string } })?.select?.name ?? null,
            tags: (properties.Tags as { multi_select: { name: string }[] })?.multi_select?.map((tag) => tag.name) ?? [],
            publishedDate: (properties['Publish Data'] as { date: { start: string } })?.date?.start ?? null,
            status: (properties.Status as { select: { name: string } })?.select?.name ?? null,
            content: html,
        }
}             

export async function getPostAllPosts() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        sorts: [
            {
                property: 'PublishedDate',
                direction: 'descending',
            },
        ],
    });

    return response.results.map((pages) => {
        const properties = pages.properties;

        return {
            id: pages.id,
            title: properties.Title?.title?.[0]?.plain_text ?? 'No Title',
            slug: properties.Slug.rich_text?.[0]?.plain_text ?? '',
            publishedDate: properties.PublishedData?.date?.start ?? '',
            category: properties.Category?.select?.name ?? '',
            tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
        };
    });
}