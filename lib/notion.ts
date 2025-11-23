import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";
import { PageProperties } from "../types/notion";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [
      {
        property: "Publish Date",
        direction: "descending",
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => {
      const properties = page.properties as PageProperties;
      const publishedDateProperty =
        (properties as Record<string, any>).PublishedDate ??
        (properties as Record<string, any>)["Publish Date"] ??
        null;

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text ?? "No Title",
        slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
        category: properties.Category?.select?.name ?? null,
        tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
        publishedDate: publishedDateProperty?.date?.start ?? null,
        status: properties.Status?.select?.name ?? "",
      };
    })
    .filter((post) => post.status === "Published");
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

  const page = response.results[0];
  if (!page) return null;
  if (!("properties" in page)) {
    throw new Error("Page does not have properties");
  }

  const typedPage = page as PageObjectResponse;
  const properties = typedPage.properties as PageProperties;

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const markdownObj = await n2m.toMarkdownString(mdBlocks);
  const html = await marked(markdownObj.parent);
  const publishedDateProperty =
    (properties as Record<string, any>).PublishedDate ??
    (properties as Record<string, any>)["Publish Date"] ??
    null;

  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text ?? "No Title",
    slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
    category: properties.Category?.select?.name ?? null,
    tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
    publishedDate: publishedDateProperty?.date?.start ?? null,
    status: properties.Status?.select?.name ?? "",
    content: html,
  };
}

export async function getPostAllPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [
      {
        property: "Publish Date",
        direction: "descending",
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
      title: properties.Title?.title?.[0]?.plain_text ?? "No Title",
      slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
      publishedDate: properties.PublishedDate?.date?.start ?? "",
      category: properties.Category?.select?.name ?? "",
      tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
    };
  });
}
