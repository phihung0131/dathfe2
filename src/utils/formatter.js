import { format } from "date-fns";
function formatPrice(value, locale = "vi-VN") {
    if (value) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0, // No decimal places for VND
            maximumFractionDigits: 0,
        }).format(value);
    }
    return "";
}

function formatDate(date) {
    if (date) {
        const dateObj = new Date(date);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return dateObj.toLocaleDateString("vi-VN", options);
    }
    return "";
}

function formatDateTime(date) {
    if (date) {
        const dateObj = new Date(date);
        return format(dateObj, "dd/MM/yyyy hh:mm:ss");
    }
    return "";
}

function formatDateForInput(date) {
    if (date) {
        const dateObj = new Date(date);
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(
            dateObj.getDate()
        ).padStart(2, "0")}`;
    }
    return "";
}

export { formatPrice, formatDate, formatDateForInput, formatDateTime };
