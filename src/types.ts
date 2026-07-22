interface Pagination {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
}

export interface ImageType {
    _score: number
    title: string
    image_id: string
    artist_display: string
}

// 'Response' shadows the DOM's built-in Response type (return type of fetch()).
// Consider renaming to ArtworkSearchResponse or ApiResponse to avoid confusion in autocomplete.
export interface Response {
    pagination: Pagination;
    data: ImageType[];
}
