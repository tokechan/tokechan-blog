import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";
import { PageProperties } from "../types/notion";

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
                property: "PublishedDate",
                direction: "descending",
            },
        ],
    })
    return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map((page) => {
            const properties = page.properties as PageProperties;
            return {
                id: page.id,
                title: properties.Title?.title?.[0]?.plain_text || 'No Title',
                slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
                category: properties.Category?.select?.name || null,
                tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
                publishedDate: properties.PublishedDate?.date?.start || null,
            };
        });
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
        // 型チェック
        if (!("properties" in page)) {
            throw new Error("Page does not have properties");
        }

        const typedPage = page as PageObjectResponse;
        const properties = typedPage.properties as PageProperties;


        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const markdownObj = await n2m.toMarkdownString(mdBlocks);
        const html = await marked(markdownObj.parent);
        
        return {
            id: page.id,
            title: properties.Title?.title?.[0]?.plain_text ?? 'No Title',
            slug: properties.Slug?.rich_text?.[0]?.plain_text ?? '',
            category: properties.Category?.select?.name ?? null,
            tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
            publishedDate: properties.PublishedDate?.date?.start ?? null,
            status: properties.Status?.select?.name ?? null,
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
        if (!("properties" in pages)) {
            throw new Error("Page does not have properties");
        }

        const typedPage = pages as PageObjectResponse;
        const properties = typedPage.properties as PageProperties;

        return {
            id: pages.id,
            title: properties.Title?.title?.[0]?.plain_text ?? 'No Title',
            slug: properties.Slug?.rich_text?.[0]?.plain_text ?? '',
            publishedDate: properties.PublishedDate?.date?.start ?? '',
            category: properties.Category?.select?.name ?? '',
            tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
        };
    });
}
