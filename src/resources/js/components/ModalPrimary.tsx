import React, { useState, useEffect, ReactNode } from 'react';
import Modal from "react-modal";

const customStyles = {
    overlay: {
      zIndex: 100
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

type ModalPrimaryProps = {
    isOpen: boolean
    children: ReactNode
}

Modal.setAppElement('#app');

// CAUTION //////////////////////////////////////
// モーダルの中身が表示されない場合がある
////////////////////////////////////////////

function ModalPrimary(props: ModalPrimaryProps): React.ReactElement {

    return (
        <Modal isOpen={props.isOpen} style={customStyles}>
            {props.children}
        </Modal>
    )
}

export default ModalPrimary;
