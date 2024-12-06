import React, { useRef } from "react";
import styles from "./Promotion.module.css";
import { formatDate } from "../utils/formatter";
import { IoTrashOutline } from "react-icons/io5";
import IcFix from "../assets/ic_fix.svg";
const Promotion = (props) => {
    const { item } = props;
    const containerRef = useRef(null);

    return (
        <>
            <div className={styles["container"]} ref={containerRef}>
                <div className={styles["left-part"]}>
                    <span>{item?.discountPercent || "NULL"}%</span>
                </div>
                <div className={styles["divider"]}></div>
                <div className={styles["right-part"]}>
                    <div>{item?.name}</div>
                    <div>
                        dành cho sản phẩm&nbsp;
                        <span className={styles["product-name"]}>{item?.product?.name || "NULL"}</span>
                    </div>
                    <div className={styles["applied-date"]}>
                        áp dụng từ ngày {formatDate(item?.startDate) || "Unknown"} đến hết ngày{" "}
                        {formatDate(item?.endDate) || "Unknown"}
                    </div>
                </div>
                <div className={styles["options-container"]}>
                    <img
                        src={IcFix}
                        className={styles["fix-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.displayPopup({ display: true, promotion: item });
                        }}
                    />
                    <IoTrashOutline
                        className={styles["delete-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.requestDelete(item, containerRef.current, styles["disappear"]);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Promotion;
