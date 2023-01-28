import React from 'react';
import Modal from "react-modal";
import { ModalPrimaryProps } from '@/common/modal/modalprimary/types/ModalPrimaryType';

Modal.setAppElement('#app');

function ModalPrimary(props: ModalPrimaryProps): React.ReactElement {
    const {isOpen, children, maxWidth, minWidth} = props;

    const customStyles = {
        overlay: {
          zIndex: 100
        },
        content: {
            maxWidth: maxWidth ? maxWidth : '90%',
            minWidth: minWidth ? minWidth : 0,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    }

    return (
        <Modal isOpen={isOpen} style={customStyles}>
            {children}
        </Modal>
    )
}

export default ModalPrimary;
