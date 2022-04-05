import React from 'react';
import { Modal } from 'antd';

const CustomerManageModalConfirm = ({ title, content, onOk }) => {
    return Modal.confirm({
        title,
        content,
        onOk,
        onCancel() {},
        centered: true,
        cancelText: 'Cancel'
    });
};

export default CustomerManageModalConfirm;
