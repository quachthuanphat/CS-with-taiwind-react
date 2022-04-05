import React, { useState, useEffect } from 'react';

import { Modal, Button, Input, notification } from 'antd';
import customClassname  from 'classnames'

import { createCustomerFields } from '../staticData'
import { validateEmail, validatePhone } from '../../../common';

const CustomerManageModal = (props) => {
    const { handleCreateCustomer, handleCloseModal, customerEditData, handleEditCustomer, visible  } = props;

    const [registerData, setRegisterData] = useState({});

    const fieldClass = (fieldIndex) => customClassname('flex justify-between', fieldIndex !== createCustomerFields.length - 1 ? 'mb-4' : '')

    const renderPlaceholder = (fieldName) => `Please enter your ${fieldName}`

    const handleChangeRegisterData = (fieldName, newValue) => {
        const newRegisterData = registerData ?  {...registerData} : {};
        newRegisterData[fieldName] = newValue
        setRegisterData(newRegisterData)
    }

    const validateInformationData = () => {
        if (!registerData.email && !registerData.phone) return 'Please enter at least email or phone number';
        if (registerData.email && !validateEmail(registerData.email)) return 'Email is not valid';
        if (registerData.phone && !validatePhone(registerData.phone)) return 'Phone is not valid';
    }


    const handleSubmitForm = () => {
        const errorFormSubmit = validateInformationData();
        if (errorFormSubmit) {
            notification.error({ description: errorFormSubmit, message: 'Submit error', placement: 'bottomLeft' })
            return
        }
        !registerData.editData ? handleCreateCustomer(registerData) : handleEditCustomer(registerData)
    }

    useEffect(() => {
        if (visible && customerEditData) setRegisterData({...customerEditData, editData: true })
        else setRegisterData({ editData: false })
    }, [visible, customerEditData])

    return (
        <Modal
            visible={visible}
            width={600}
            afterClose={() => setRegisterData({})}
            onCancel={handleCloseModal}
            footer={[
                <Button type='text' onClick={handleCloseModal}>
                    Cancel
                </Button>,
                <Button type="primary" onClick={handleSubmitForm}>
                    Confirm
                </Button>
            ]}
        >
            <div className='font-bold uppercase text-base mb-4'>{`${registerData.editData ? 'Edit' : 'Create'} Customer`}</div>
            {
                createCustomerFields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className={fieldClass(fieldIndex)}>
                        <div className='w-1/4 font-medium capitalize'>{field}</div>
                        <div className='w-full'>
                            <Input value={registerData?.[field] || ''} placeholder={renderPlaceholder(field)} onChange={(e) => handleChangeRegisterData(field, e.target.value)} />
                        </div>
                    </div>
                ))
            }
        </Modal>
    );
};

export default CustomerManageModal;
