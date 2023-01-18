export type WordleCommentListProps = {
    head?: React.ReactElement;
    request_config: {
        api_url: string;
        params: object;
        response_keys: string[];
        listening_channel?: string;
        listening_event?: string;
    };
    listen?: boolean;
    no_item_text: string;
}

export type WordleCommentListItemProps = {
    wordle_comment: any;
}