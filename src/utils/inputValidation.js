export function checkProductName(name) {
    if (!name.trim()) {
        return { result: false, msg: "Vui lòng nhập tên sản phẩm !" };
    }
    return { result: true };
}

export function checkDescription(description) {
    if (description.trim().length < 10) {
        return { result: false, msg: "Mô tả phải có ít nhất 10 kí tự !" };
    }
    return { result: true };
}

export function checkPrice(price) {
    let priceN = Number(price);
    if (!priceN || priceN < 0) return { result: false, msg: "Giá không hợp lệ !" };
    return { result: true };
}

export function checkSizeArr(sizeArr) {
    console.log(sizeArr);
    if (sizeArr.length < 1) {
        return { result: false, msg: "Phải có ít nhất 1 màu có kích cỡ và số lượng!" };
    }
    return { result: true };
}

export function checkEmptyString(str) {
    if (!str || !str.trim()) {
        return { result: false, msg: "Vui lòng điền đầy đủ các trường" };
    }
    return { result: true };
}
