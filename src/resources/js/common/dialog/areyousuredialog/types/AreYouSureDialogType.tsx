import { OverridableStringUnion } from "@mui/types";
import { ButtonPropsColorOverrides } from "@mui/material";

export type AreYouSureDialogProps = {
    onClose: (value: string) => void;
    title?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    okColor?: OverridableStringUnion<
        | "inherit"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning",
        ButtonPropsColorOverrides
    >;
    cancelColor?: OverridableStringUnion<
        | "inherit"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning",
        ButtonPropsColorOverrides
    >;
};