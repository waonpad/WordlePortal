import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, ButtonPropsColorOverrides, Box, Stack } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AreYouSureDialogProps } from '../types/AreYouSureDialogType';

/**
 * 削除確認ダイアログ
 */
export default function AreYouSureDialog(props: AreYouSureDialogProps) {
    const {
        onClose,
        title = "削除してもよろしいですか？",
        message = "一度削除すると元に戻すことはできません。",
        okText = "削除する",
        cancelText = "キャンセル",
        okColor = "error",
        cancelColor = "primary"
    } = props;

    return (
        <Dialog
            open
            onClose={() => onClose("close")}
            PaperProps={{
                elevation: 0,
                style: {
                    border: '1.5px solid rgb(204, 204, 204)'
                }
            }}
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.75)'
                },
            }}
        >
        <Stack justifyContent="center" alignItems="center" sx={styles.container}>
            <ErrorOutlineIcon sx={styles.icon} />
            <DialogTitle id="alert-dialog-title" sx={styles.title}>
            {title}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {message}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button
                variant="outlined"
                color={cancelColor}
                size="small"
                onClick={() => onClose("cancel")}
                autoFocus
            >
                {cancelText}
            </Button>
            <Button
                variant="outlined"
                color={okColor}
                size="small"
                onClick={() => onClose("ok")}
            >
                {okText}
            </Button>
            </DialogActions>
        </Stack>
        </Dialog>
    );
}

const styles = {
    container: {
        p: 2
    },
    icon: {
        fontSize: '100px',
        color: "#BF6761"
    },
    title: {
        fontWeight: "bold"
    }
};