import React from "react";
import styles from "./ProductPreviewItem.module.css";
import { formatPrice } from "../utils/formatter";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductPreviewItem = (props) => {
    // console.log(props.product);
    const navigate = useNavigate();
    function goToDetail() {
        navigate(`/product/${props.product._id}`);
    }
    return (
        <>
            <div className={`${styles["container"]} ${props.isFixedSize ? styles["fixed-size"] : ""}`}>
                <img
                    src={props.product.imageUrl[0] || ""}
                    className={styles["product-img"]}
                    onClick={() => {
                        goToDetail();
                    }}
                ></img>
                <div className={styles["product-info"]}>
                    <div className={styles["size-color-container"]}>
                        <span>{props.product.totalColors} Màu sắc</span>
                        <span>{props.product.totalSizes} Size</span>
                    </div>
                    <div className={styles["rating-section"]}>
                        <FaStar className={styles["icon"]} />
                        <span>{props.product.totalRate || "Chưa có đánh giá"}</span>
                    </div>
                    <h4 className={styles["product-title"]}>{props.product.name}</h4>
                    {props.product.promotionalPrice ? (
                        <>
                            <div className={styles["product-old-price"]}>{formatPrice(props.product.price)}</div>
                            <div className={styles["product-price"]}>{formatPrice(props.product.promotionalPrice)}</div>
                        </>
                    ) : (
                        <>
                            <div className={styles["product-price"]}>{formatPrice(props.product.price)}</div>
                        </>
                    )}

                    {/* <div>Chọn màu</div> */}
                </div>
            </div>
        </>
    );
};

export default ProductPreviewItem;
