import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'antd';
import CustomerManageModal from './components/CustomerManageModal';
import CustomerManageDropdownAction from './components/CustomerManageDropdownAction';
import CustomerManageModaExportData from './components/CustomerManageModaExportData';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { fakeCustomerData, customerTableColumns, createCustomerFields } from './staticData';
import { uid, customerHelper, renderHeadingXLSXFile, renderWorkSheetColWidth, capitalizeFirstLetter } from '../../common';

const CustomerManage = () => {
    const [customerSearch, setCustomerSearch] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const [customerEditData, setCustomerEditData] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState([]);
    const [selectedCustomerKeys, setSelectedCustomerKeys] = useState([]);
    const [openModalExport, setOpenModalExport] = useState(false);

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
            setCustomerSearch(customerHelper['insert']([...customerSearch], registerData));
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

    const handleSelectCheckboxTableRow = (selectedRows, rowData) => {
        setSelectedCustomerKeys(selectedRows);
        setSelectedCustomer(rowData);
    };

    const renderTotal = () => {
        if (searchKeyWord) return customerSearch.length;
        return customerData.length;
    };

    const handleConfirmDeleteCustomer = () => {
        setCustomerData(customerHelper['delete']([...customerData], selectedCustomerKeys));
        if (searchKeyWord && customerSearch.length) {
            setCustomerSearch(customerHelper['delete']([...customerSearch], selectedCustomerKeys));
        }
        setSelectedCustomer([]);
    };

    const controlModalExport = (visible) => setOpenModalExport(visible);

    const handleExportCustomerData = (exportType, exportColumn) => {
        if (exportType === 'xlsx') {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            const exportData = customerHelper['process-before-export-xlsx']([...selectedCustomer], exportColumn);
            const workSheet = XLSX.utils.json_to_sheet(renderHeadingXLSXFile(exportColumn), {
                header: exportColumn,
                skipHeader: true,
                origin: 0
            });
            workSheet['!cols'] = renderWorkSheetColWidth(exportData, exportColumn);
            XLSX.utils.sheet_add_json(workSheet, exportData, {
                header: exportColumn,
                skipHeader: true,
                origin: -1
            });
            const workBook = { Sheets: { data: workSheet }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
            const finalData = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(finalData, 'customer_data' + fileExtension);
            return;
        }
        const pageUnit = 'pt';
        const pageSize = 'A4'; // Use A1, A2, A3 or A4
        const pageOrientation = 'portrait'; // portrait or landscape
        const marginLeft = 40;
        const PDFDoc = new jsPDF(pageOrientation, pageUnit, pageSize);
        const PDFDocTitle = 'Customer Data';
        const PDFDocHeader = [exportColumn.map((column) => capitalizeFirstLetter(column))];
        const PDFDocDataExport = customerHelper['process-before-export-pdf']([...selectedCustomer], exportColumn);

        let content = {
            startY: 50,
            head: PDFDocHeader,
            body: PDFDocDataExport
        };
        PDFDoc.setFontSize(15);
        PDFDoc.text(PDFDocTitle, marginLeft, 40);
        PDFDoc.autoTable(content);
        PDFDoc.save('report.pdf');
    };

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
                    <div className="w-2/4 flex items-center">
                        <div className="mr-4">
                            Total <span className="font-bold">{renderTotal()}</span> Customer
                        </div>
                        <CustomerManageDropdownAction
                            selectedCustomer={selectedCustomerKeys}
                            handleConfirmDeleteCustomer={handleConfirmDeleteCustomer}
                            controlModalExport={controlModalExport}
                        />
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
                            onChange: (rowKeyArr, rowData) => handleSelectCheckboxTableRow(rowKeyArr, rowData)
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
            <CustomerManageModaExportData
                visible={openModalExport}
                handleCloseModal={() => controlModalExport(false)}
                handleExportCustomerData={handleExportCustomerData}
            />
        </div>
    );
};

export default CustomerManage;
