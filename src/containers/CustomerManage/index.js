import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'antd';
import CustomerManageModal from './components/CustomerManageModal';
import CustomerManageDropdownAction from './components/CustomerManageDropdownAction';

import { fakeCustomerData, customerTableColumns, createCustomerFields } from './staticData';
import { uid, customerHelper } from '../../common';

const CustomerManage = () => {
    const [customerSearch, setCustomerSearch] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const [customerEditData, setCustomerEditData] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState([])

    const getInitialData = async () => {
        setCustomerData(
            [...fakeCustomerData].map((fakeData) => ({
                ...fakeData,
                key: uid()
            }))
        );
    };

    const controlModalCreate = (visible) => setOpenModalCreate(visible);

    const handleCreateCustomer = (registerData) => {
        setCustomerData(customerHelper['insert']([...customerData], registerData));
        if (searchKeyWord && customerSearch.length) {
            setCustomerSearch(customerHelper['insert']([...customerSearch], registerData))
        }
        controlModalCreate(false);
    };

    const handleEditCustomer = (editData) => {
        setCustomerData(customerHelper['update']([...customerData], editData));
        if (searchKeyWord && customerSearch.length) {
            setCustomerSearch(customerHelper['update']([...customerSearch], editData));
        }
        controlModalCreate(false);
    };

    const handleSearchCustomer = (keyword) => {
        if (keyword) {
            const newCustomerSearch = [...customerData].filter((myCustomerData) => {
                return createCustomerFields.some((field) => {
                    const valueInCustomerField = myCustomerData[field]?.trim() || '';
                    return (
                        valueInCustomerField &&
                        myCustomerData[field].toString().toLowerCase().includes(keyword.toLowerCase().trim())
                    );
                });
            });
            setCustomerSearch(newCustomerSearch);
        }
        setSearchKeyword(keyword);
    };

    const handleClickOnRow = (selectCustomerData) => {
        setCustomerEditData({ ...selectCustomerData, editData: true });
        controlModalCreate(true);
    };

    const handleSelectCheckboxTableRow = (selectedRows) => {
        setSelectedCustomer(selectedRows)
    };

    const renderTotal = () => {
        if (searchKeyWord) return customerSearch.length;
        return customerData.length;
    }

    const handleConfirmDeleteCustomer = () => {
        setCustomerData(customerHelper['delete']([...customerData], selectedCustomer))
        if (searchKeyWord && customerSearch.length) {
            setCustomerSearch(customerHelper['delete']([...customerSearch], selectedCustomer));
        }
        setSelectedCustomer([])
    }

    useEffect(() => {
        getInitialData();
    }, []);

    return (
        <div className="customer-manage-page">
            <div className="customer-manage-page__header bg-white px-3.5 w-full h-16 flex items-center">
                <div className="text-black font-bold text-2xl">Testing</div>
            </div>
            <div className="customer-manage-page__body p-11">
                <div className="flex items-center">
                    <div className="text-2xl font-bold mr-3">Customer List</div>
                    <Button type="primary" onClick={() => controlModalCreate(true)}>
                        Add New
                    </Button>
                </div>
                <div className="flex justify-between mt-6">
                    <div className='w-2/4 flex items-center'>
                        <div className='mr-4'>Total <span className='font-bold'>{renderTotal()}</span> Customer</div>
                        <CustomerManageDropdownAction selectedCustomer={selectedCustomer} handleConfirmDeleteCustomer={handleConfirmDeleteCustomer} />
                    </div>
                    <div className="w-1/4">
                        <Input.Search
                            value={searchKeyWord}
                            onChange={(e) => handleSearchCustomer(e.target.value)}
                            placeholder="Customer search...."
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (rowKeyArr) =>
                                handleSelectCheckboxTableRow(rowKeyArr)
                        }}
                        onRow={(record) => {
                            return {
                                onClick: () => handleClickOnRow(record)
                            };
                        }}
                        dataSource={!searchKeyWord ? customerData : customerSearch}
                        columns={customerTableColumns}
                    />
                </div>
            </div>
            <CustomerManageModal
                visible={openModalCreate}
                handleCreateCustomer={handleCreateCustomer}
                handleEditCustomer={handleEditCustomer}
                handleCloseModal={() => controlModalCreate(false)}
                customerEditData={customerEditData}
            />
        </div>
    );
};

export default CustomerManage;
