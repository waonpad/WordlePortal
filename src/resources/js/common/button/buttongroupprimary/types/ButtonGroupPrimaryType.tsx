export type ButtonGroupPrimaryProps = {
    head?: boolean;
    items: {
        text: string;
        value?: any;
        link?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        active: boolean;
    }[];
}