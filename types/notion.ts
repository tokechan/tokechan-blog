export type PageProperties = {
    Title?: {
      title?: {
        plain_text: string;
      }[];
    };
    Slug?: {
      rich_text?: {
        plain_text: string;
      }[];
    };
    Category?: {
      select?: {
        name: string;
      } | null;
    };
    Tags?: {
      multi_select?: {
        name: string;
      }[];
    };
    Status?: {
      select?: {
        name: string;
      } | null;
    };
    PublishedDate?: {
      date?: {
        start: string;
      } | null;
    };
  };
  