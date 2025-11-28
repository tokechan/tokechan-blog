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

  const posts = response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => {
      const properties = page.properties as PageProperties;
      const publishedDateProperty =
        (properties as Record<string, any>).PublishedDate ??
        (properties as Record<string, any>)["Publish Date"] ??
        null;

      // Statusプロパティの取得を試行（複数の型に対応）
      const statusProperty = properties.Status as any;
      let status = "";
      if (statusProperty?.select?.name) {
        status = statusProperty.select.name;
      } else if (statusProperty?.status?.name) {
        status = statusProperty.status.name;
      }

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text ?? "No Title",
        slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
        category: properties.Category?.select?.name ?? null,
        tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
        publishedDate: publishedDateProperty?.date?.start ?? null,
        status: status,
      };
    });

  // デバッグ: Statusプロパティの値を確認
  if (process.env.NODE_ENV === "development") {
    console.log(
      "All posts status:",
      posts.map((p) => ({ title: p.title, status: p.status }))
    );
  }

  const publishedPosts = posts.filter((post) => post.status === "Published");

  // デバッグ: フィルタリング後の件数を確認
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Total posts: ${posts.length}, Published posts: ${publishedPosts.length}`
    );
  }

  return publishedPosts;
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

  // Statusプロパティの取得を試行（複数の型に対応）
  const statusProperty = properties.Status as any;
  let status = "";
  if (statusProperty?.select?.name) {
    status = statusProperty.select.name;
  } else if (statusProperty?.status?.name) {
    status = statusProperty.status.name;
  }

  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text ?? "No Title",
    slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
    category: properties.Category?.select?.name ?? null,
    tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
    publishedDate: publishedDateProperty?.date?.start ?? null,
    status: status,
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
