import React, { useState, useEffect } from 'react';

import { Modal, Button, Input, notification, Radio } from 'antd';
import customClassname from 'classnames';

import { createCustomerFields } from '../staticData';
import { validateEmail, validatePhone, uid } from '../../../common';

const CustomerManageModal = (props) => {
    const { handleCreateCustomer, handleCloseModal, customerEditData, handleEditCustomer, visible } = props;

    const [registerData, setRegisterData] = useState({});

    const renderPlaceholder = (fieldName) => `Please enter your ${fieldName}`;

    const handleChangeRegisterData = (fieldName, newValue) => {
        const newRegisterData = registerData ? { ...registerData } : {};
        newRegisterData[fieldName] = newValue;
        setRegisterData(newRegisterData);
    };

    const validateInformationData = () => {
        if (!registerData.email && !registerData.phone) return 'Please enter at least email or phone number';
        if (registerData.email && !validateEmail(registerData.email)) return 'Email is not valid';
        if (registerData.phone && !validatePhone(registerData.phone)) return 'Phone is not valid';
    };

    const handleSubmitForm = () => {
        const errorFormSubmit = validateInformationData();
        if (errorFormSubmit) {
            notification.error({ description: errorFormSubmit, message: 'Submit error', placement: 'bottomLeft' });
            return;
        }
        !registerData.editData ? handleCreateCustomer(registerData) : handleEditCustomer(registerData);
    };

    useEffect(() => {
        if (visible && customerEditData) setRegisterData({ ...customerEditData, editData: true });
        else setRegisterData({ editData: false });
    }, [visible, customerEditData]);

    return (
        <Modal
            visible={visible}
            width={600}
            afterClose={() => setRegisterData({})}
            onCancel={handleCloseModal}
            footer={[
                <Button key={uid()} type="text" onClick={handleCloseModal}>
                    Cancel
                </Button>,
                <Button key={uid()} type="primary" onClick={handleSubmitForm}>
                    Confirm
                </Button>
            ]}
        >
            <div className="font-bold uppercase text-base mb-4">{`${registerData.editData ? 'Edit' : 'Create'} Customer`}</div>
            {createCustomerFields
                .filter((field) => field !== 'gender')
                .map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex justify-between mb-4">
                        <div className="w-1/4 font-medium capitalize">{field}</div>
                        <div className="w-full">
                            <Input
                                value={registerData?.[field] || ''}
                                placeholder={renderPlaceholder(field)}
                                onChange={(e) => handleChangeRegisterData(field, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            <div className="flex justify-between">
                <div className="w-1/4 font-medium capitalize">Gender</div>
                <div className="w-full">
                    <Radio.Group onChange={(e) => handleChangeRegisterData('gender' ,e.target.value)} value={registerData?.gender}>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerManageModal;
