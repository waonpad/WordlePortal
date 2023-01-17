import { ParticalRenderLinkProps } from "../../../link/particalrenderlink/components/ParticalRenderLink";

export type ButtonGroupPrimaryProps = {
    head?: boolean;
    items: {
        attributes?: any;
        text: string;
        value?: any;
        link?: ParticalRenderLinkProps;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        active: boolean;
    }[];
}