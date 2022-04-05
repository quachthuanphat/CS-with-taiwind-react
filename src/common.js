export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhone = phone => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    return re.test(String(phone).toLowerCase());
}

const customerUpdate = (arrCustomer, updateData) => {
    return arrCustomer.map((customer) => {
        if (customer.key === updateData.key) return updateData;
        else return customer;
    });
}

const customerInsert = (arrCustomer, insertData) => {
    return [{...insertData, key: uid()}, ...arrCustomer]
}

const customerDelete = (arrCustomer, deleteDataArr) => {
    return [...arrCustomer].filter(customerData => !deleteDataArr.includes(customerData.key))
}

export const customerHelper = {
    update: customerUpdate,
    insert: customerInsert,
    delete: customerDelete
}