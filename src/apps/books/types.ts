export interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
    infoLink?: string;
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: BookVolume[];
}
