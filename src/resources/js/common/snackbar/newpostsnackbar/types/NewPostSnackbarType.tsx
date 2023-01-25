export type NewPostSnackbarProps = {
    open: boolean;
    handleApiGet: any;
    handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
    message: string;
    position: {
        top: number;
        left: number;
    }
}