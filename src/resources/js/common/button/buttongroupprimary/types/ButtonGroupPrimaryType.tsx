export type ButtonGroupPrimaryProps = {
    head?: boolean;
    items: {
        attributes?: any;
        text: string;
        value?: any;
        link?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        active: boolean;
    }[];
}