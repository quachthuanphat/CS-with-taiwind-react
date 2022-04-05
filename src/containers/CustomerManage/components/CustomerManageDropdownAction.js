import React from 'react';
import CustomerManageModalConfirm from './CustomerManageModalConfirm';
import { Menu, Dropdown, Button } from 'antd';
const CustomerManageDropdownAction = ({ selectedCustomer, handleConfirmDeleteCustomer }) => {


    const handleDeleteCustomer = () => {
        return CustomerManageModalConfirm({
            title: 'Do you want to remove these items?',
            onOk: handleConfirmDeleteCustomer,
            onCancel: () => {}
        })
    }

    const renderOverlay = () => (
        <Menu>
            <Menu.Item>Export</Menu.Item>
            <Menu.Item onClick={handleDeleteCustomer} disabled={!selectedCustomer?.length}>Delete Customer</Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={renderOverlay()} placement="bottomLeft" trigger="click">
                <Button>Manage Action</Button>
            </Dropdown>
        </>
    );
};

export default CustomerManageDropdownAction;
