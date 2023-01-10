export type UserPrimaryDetailProps = {
    user: any;
    myself: boolean;
    follow: boolean;
    setFollow: React.Dispatch<React.SetStateAction<boolean>>;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}