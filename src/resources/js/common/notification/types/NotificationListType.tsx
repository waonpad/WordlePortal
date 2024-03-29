export type NotificationListProps = {
    head?: React.ReactElement;
    forwardRef?: React.Ref<HTMLDivElement>;
    // notifications: any[];
    // request_config: {
    //     api_url: string;
    //     params: object;
    //     response_keys: string[];
    //     listening_channel?: string;
    //     listening_event?: string;
    // };
    // listen?: boolean;
    no_item_text: string;
}

export type NotificationListItemFollowProps = {
    follow_notification: any;
}

export type NotificationListItemFWordleCommentProps = {
    wordle_comment_notification: any;
}

export type NotificationListItemFWordleLikeProps = {
    wordle_like_notification: any;
}
