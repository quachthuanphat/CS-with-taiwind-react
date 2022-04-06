export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(String(phone).toLowerCase());
};

const customerUpdate = (arrCustomer, updateData) => {
    return arrCustomer.map((customer) => {
        if (customer.key === updateData.key) return updateData;
        else return customer;
    });
};

const customerInsert = (arrCustomer, insertData) => {
    return [{ ...insertData, key: uid() }, ...arrCustomer];
};

const customerDelete = (arrCustomer, deleteDataArr) => {
    return [...arrCustomer].filter((customerData) => !deleteDataArr.includes(customerData.key));
};

const processBeforeExportXLSX = (arrCustomer, arrColumn) => {
    return [...arrCustomer].map((customerData) => {
        delete customerData.key;
        const keyInCustomerData = Object.keys(customerData);
        keyInCustomerData.forEach((customerKey) => {
            if (!arrColumn.includes(customerKey)) {
                delete customerData[customerKey];
            }
        });
        return customerData;
    });
};

const processBeforeExportPDF = (arrCustomer, arrColumn) => {
    const exportData = [...arrCustomer].map((customerData) => {
        return [...arrColumn].map((column) => customerData[column]);
    });
    return exportData;
};

export const customerHelper = {
    update: customerUpdate,
    insert: customerInsert,
    delete: customerDelete,
    'process-before-export-xlsx': processBeforeExportXLSX,
    'process-before-export-pdf': processBeforeExportPDF
};

export const renderHeadingXLSXFile = (exportColumn) => {
    const headerObj = {};
    exportColumn.forEach((row) => {
        headerObj[row] = capitalizeFirstLetter(row);
    });
    return [headerObj];
};

export const renderWorkSheetColWidth = (exportData, exportColumn) => {
    const workSheetCol = [];
    exportColumn.forEach((column) => {
        const columnWidth = { wch: Math.max(...exportData.map((customer) => customer[column].length)) };
        workSheetCol.push(columnWidth);
    });
    return workSheetCol;
};

export const cloneDeep = (cloneData) => {
    const cloneDataStringtify = JSON.stringify(cloneData);
    return JSON.parse(cloneDataStringtify)
}
