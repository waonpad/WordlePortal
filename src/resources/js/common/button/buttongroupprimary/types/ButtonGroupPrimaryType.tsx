export type ButtonGroupPrimaryProps = {
    items: {
        text: string;
        value?: any;
        link?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        active: boolean;
    }[];
}