import React, { useState } from 'react';
import { Modal, Button, Radio, Select } from 'antd';
import { createCustomerFields } from '../staticData';

const CustomerManageModaExportData = ({ visible, handleCloseModal, handleExportCustomerData }) => {
    const [exportRow, setExportRow] = useState([]);
    const [exportType, setExportType] = useState('xlsx');

    const handleDestroyModal = () => {
        console.log('handleDestroyModal', handleDestroyModal);
        setExportRow([]);
        setExportType('xlsx');
    };
    return (
        <Modal
            visible={visible}
            width={600}
            afterClose={handleDestroyModal}
            onCancel={handleCloseModal}
            footer={[
                <Button type="text" onClick={handleCloseModal}>
                    Cancel
                </Button>,
                <Button
                    type="primary"
                    onClick={() => handleExportCustomerData(exportType, exportRow.length ? exportRow : [...createCustomerFields])}
                >
                    Export
                </Button>
            ]}
        >
            <div className="font-bold uppercase text-base mb-4">Export Customer Data</div>
            <div className="mt-6 flex items-center">
                <div className="font-medium w-36">Export type</div>
                <Radio.Group onChange={(e) => setExportType(e.target.value)} value={exportType}>
                    <Radio value="xlsx">Xlsx</Radio>
                    <Radio value="pdf">PDF</Radio>
                </Radio.Group>
            </div>
            <div className="mt-6 flex items-center">
                <div className="font-medium w-36">Export columns</div>
                <div className="w-3/4">
                    <Select
                        mode="multiple"
                        placeholder="Select your export row. If not it will export all"
                        onChange={(rowChange) => setExportRow(rowChange)}
                        style={{ width: '100%' }}
                        value={exportRow}
                    >
                        {createCustomerFields.map((field, fieldIndex) => (
                            <Select.Option key={fieldIndex} value={field}>
                                <span className="capitalize">{field}</span>
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerManageModaExportData;
