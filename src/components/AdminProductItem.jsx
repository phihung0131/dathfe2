import React, { useState } from "react";
import styles from "./AdminProductItem.module.css";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatter";
import { FaTrash } from "react-icons/fa";
import { generateUUID } from "../utils/id";

const AdminProductItem = (props) => {
    const { product } = props;
    const [isExpand, setIsExpand] = useState(false);
    const [sizeExpand, setSizeExpand] = useState({});
    const navigate = useNavigate();
    function goToDetail() {
        if (product._id) navigate(`/admin/products/${product._id}`);
        else alert("Vui lòng thử lại sau");
    }

    return (
        <>
            <div
                className={styles["container"]}
                onClick={() => {
                    setIsExpand((state) => !state);
                }}
            >
                <h4 className={styles["product-title"]}>{product?.name}</h4>
                <div className={styles["price-container"]}>
                    <span className={product?.promotionalPrice ? styles["strike-through"] : styles["current-price"]}>
                        {formatPrice(product?.price)}
                    </span>
                    <span className={styles["current-price"]}>{formatPrice(product?.promotionalPrice)}</span>
                </div>
                <ul className={styles["stat-container"]}>
                    <li>Tổng số: {product?.totalQuantity}</li>
                    <li>Số màu: {product?.totalColors}</li>
                    <li>Số cỡ: {product?.totalSizes}</li>
                </ul>
                <div
                    className={styles["detail-button"]}
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetail();
                    }}
                >
                    Xem chi tiết
                </div>
            </div>
            {isExpand ? (
                <div className={styles["expand-container"]}>
                    {product?.colorSummary.length > 0 &&
                        product.colorSummary.map((item) => (
                            <div className={styles["color-summary"]}>
                                <span>Màu sắc: {item.color}</span>
                                {item.sizes.length > 0 &&
                                    item.sizes.map((size) => {
                                        return (
                                            <div
                                                className={`${styles["size-summary"]} ${
                                                    sizeExpand[item.color] === size.size ? styles["active"] : ""
                                                }`}
                                            >
                                                <div
                                                    className={styles["size-icon"]}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (sizeExpand[item.color] === size.size) {
                                                            setSizeExpand((state) => ({
                                                                ...state,
                                                                [item.color]: -1,
                                                            }));
                                                        } else {
                                                            setSizeExpand((state) => ({
                                                                ...state,
                                                                [item.color]: size.size,
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    {size.size}
                                                </div>
                                                <div className={styles["size-quantity"]}>Số lượng: {size.quantity}</div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export default AdminProductItem;
