import type {
  getPosts as GetPostsFn,
  getPostBySlug as GetPostBySlugFn,
  getPostAllPosts as GetPostAllPostsFn,
} from "@/lib/notion";

const mockDatabasesQuery = jest.fn();
const mockPageToMarkdown = jest.fn();
const mockToMarkdownString = jest.fn();
const mockMarked = jest.fn();

jest.mock("@notionhq/client", () => ({
  Client: jest.fn().mockImplementation(() => ({
    databases: {
      query: mockDatabasesQuery,
    },
  })),
}));

jest.mock("notion-to-md", () => ({
  NotionToMarkdown: jest.fn().mockImplementation(() => ({
    pageToMarkdown: mockPageToMarkdown,
    toMarkdownString: mockToMarkdownString,
  })),
}));

jest.mock("marked", () => ({
  marked: (...args: unknown[]) => mockMarked(...args),
}));

let getPosts: typeof GetPostsFn;
let getPostBySlug: typeof GetPostBySlugFn;
let getPostAllPosts: typeof GetPostAllPostsFn;

beforeAll(async () => {
  process.env.NOTION_TOKEN = "test-token";
  process.env.NOTION_DATABASE_ID = "test-database";

  const notionModule = await import("@/lib/notion");
  getPosts = notionModule.getPosts;
  getPostBySlug = notionModule.getPostBySlug;
  getPostAllPosts = notionModule.getPostAllPosts;
});

beforeEach(() => {
  mockDatabasesQuery.mockReset();
  mockPageToMarkdown.mockReset();
  mockToMarkdownString.mockReset();
  mockMarked.mockReset();
});

describe("lib/notion", () => {
  it("maps Notion pages into simplified posts", async () => {
    const notionResponse = {
      results: [
        {
          id: "page-1",
          properties: {
            Title: { title: [{ plain_text: "First Post" }] },
            Slug: { rich_text: [{ plain_text: "first-post" }] },
            Category: { select: { name: "Diary" } },
            Tags: { multi_select: [{ name: "next" }, { name: "notion" }] },
            Status: { select: { name: "Published" } },
            "Publish Date": { date: { start: "2025-10-10" } },
          },
        },
        { id: "page-without-properties" },
      ],
    };

    mockDatabasesQuery.mockResolvedValueOnce(notionResponse);

    const posts = await getPosts();

    expect(mockDatabasesQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        database_id: "test-database",
        filter: expect.any(Object),
      })
    );

    expect(posts).toEqual([
      {
        id: "page-1",
        title: "First Post",
        slug: "first-post",
        category: "Diary",
        tags: ["next", "notion"],
        publishedDate: "2025-10-10",
        status: "Published",
      },
    ]);
  });

  it("returns full post with rendered markdown for a slug", async () => {
    const notionPage = {
      id: "page-42",
      properties: {
        Title: { title: [{ plain_text: "Detail Post" }] },
        Slug: { rich_text: [{ plain_text: "detail-post" }] },
        Category: { select: { name: "Tech" } },
        Tags: { multi_select: [{ name: "Next.js" }] },
        Status: { select: { name: "Draft" } },
        PublishedDate: { date: { start: "2025-10-15" } },
      },
    };

    mockDatabasesQuery.mockResolvedValueOnce({ results: [notionPage] });
    mockPageToMarkdown.mockResolvedValueOnce([{ type: "paragraph", parent: "# Heading" }]);
    mockToMarkdownString.mockResolvedValueOnce({ parent: "# Heading" });
    mockMarked.mockResolvedValueOnce("<h1>Heading</h1>");

    const post = await getPostBySlug("detail-post");

    expect(mockDatabasesQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({
          property: "Slug",
        }),
      })
    );
    expect(mockPageToMarkdown).toHaveBeenCalledWith("page-42");
    expect(mockMarked).toHaveBeenCalledWith("# Heading");

    expect(post).toEqual({
      id: "page-42",
      title: "Detail Post",
      slug: "detail-post",
      category: "Tech",
      tags: ["Next.js"],
      publishedDate: "2025-10-15",
      status: "Draft",
      content: "<h1>Heading</h1>",
    });
  });

  it("returns null when slug does not match any page", async () => {
    mockDatabasesQuery.mockResolvedValueOnce({ results: [] });

    const post = await getPostBySlug("unknown");

    expect(post).toBeNull();
    expect(mockPageToMarkdown).not.toHaveBeenCalled();
  });

  it("maps all posts for auxiliary listing", async () => {
    const notionResponse = {
      results: [
        {
          id: "page-1",
          properties: {
            Title: { title: [{ plain_text: "One" }] },
            Slug: { rich_text: [{ plain_text: "one" }] },
            PublishedDate: { date: { start: "2025-10-01" } },
            Category: { select: { name: "Memo" } },
            Tags: { multi_select: [{ name: "misc" }] },
          },
        },
        {
          id: "page-2",
          properties: {
            Title: { title: [] },
            Slug: { rich_text: [] },
            PublishedDate: { date: { start: null } },
            Category: { select: null },
            Tags: { multi_select: [] },
          },
        },
      ],
    };

    mockDatabasesQuery.mockResolvedValueOnce(notionResponse);

    const posts = await getPostAllPosts();

    expect(posts).toEqual([
      {
        id: "page-1",
        title: "One",
        slug: "one",
        publishedDate: "2025-10-01",
        category: "Memo",
        tags: ["misc"],
      },
      {
        id: "page-2",
        title: "No Title",
        slug: "",
        publishedDate: "",
        category: "",
        tags: [],
      },
    ]);
  });
});
