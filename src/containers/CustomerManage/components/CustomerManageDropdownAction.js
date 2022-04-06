import React from 'react';
import CustomerManageModalConfirm from './CustomerManageModalConfirm';
import { Menu, Dropdown, Button } from 'antd';
import { uid } from '../../../common';
import customerClassname from 'classnames'

const CustomerManageDropdownAction = ({ selectedCustomer, handleConfirmDeleteCustomer, controlModalExport }) => {

    const checkDisabledAction = () => {
        return customerClassname(!Array.isArray(selectedCustomer) || !selectedCustomer.length ? 'disabled' : '')
    }

    const handleDeleteCustomer = () => {
        return CustomerManageModalConfirm({
            title: 'Do you want to remove these items?',
            onOk: handleConfirmDeleteCustomer,
            onCancel: () => {}
        });
    };


    const renderOverlay = () => (
        <Menu>
            <Menu.Item key={uid()} onClick={() => controlModalExport(true)} className={checkDisabledAction()}>
                Export
            </Menu.Item>
            <Menu.Item key={uid()} onClick={handleDeleteCustomer} className={checkDisabledAction()}>
                Delete Customer
            </Menu.Item>
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
