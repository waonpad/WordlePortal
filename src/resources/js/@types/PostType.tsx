export type PostData = {
    id: number | null;
    title: string;
    comment: string;
    categories: string[];
    submit: string;
}

export type PostErrorData = {
    id: string;
    title: string;
    comment: string;
    categories: string;
    submit: string;
}