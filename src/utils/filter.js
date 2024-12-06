import { formatPrice } from "./formatter";

const orderFilterOptions = [
    { description: "Mặc định", optionNum: 0, sortBy: "", sortOrder: "" },
    { description: "Giá tăng dần", optionNum: 1, sortBy: "price", sortOrder: "asc" },
    { description: "Giá giảm dần", optionNum: 2, sortBy: "price", sortOrder: "desc" },
    { description: "Tên: A - Z", optionNum: 3, sortBy: "name", sortOrder: "asc" },
    { description: "Tên: Z - A", optionNum: 4, sortBy: "name", sortOrder: "desc" },
    { description: "Đánh giá tăng dần", optionNum: 5, sortBy: "rating", sortOrder: "asc" },
    { description: "Đánh giá giảm dần", optionNum: 6, sortBy: "rating", sortOrder: "desc" },
];

function getFilterOption(optionNum) {
    return orderFilterOptions.find((item) => item.optionNum === optionNum);
}

function formatSelectedFilter(option, data) {
    switch (option) {
        case "minRating": {
            return data + " sao";
        }
        case "priceRange": {
            return `${formatPrice(data.min)} - ${formatPrice(data.max)}`;
        }
        default:
            return "null";
    }
}

export { orderFilterOptions, getFilterOption, formatSelectedFilter };
