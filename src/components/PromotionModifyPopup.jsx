import React, { useState } from "react";
import styles from "./PromotionModifyPopup.module.css";
import { formatDateForInput } from "../utils/formatter";
const PromotionModifyPopup = (props) => {
    const [promotion, setPromotion] = useState(props.promotion || null);
    const [errorMsg, setErrorMsg] = useState("");
    const { modifyPromotion } = props;
    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["popup"]}>
                    <h2 className={styles["title"]}>Chỉnh sửa thông tin khuyến mãi</h2>
                    <div>
                        <label htmlFor="promotion-name">Tên khuyến mãi</label>
                        <input
                            id="promotion-name"
                            type="text"
                            value={promotion?.name}
                            onChange={(e) => {
                                setPromotion((state) => ({ ...state, name: e.target.value }));
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="discount">Phần trăm giảm giá</label>
                        <input
                            id="discount"
                            type="number"
                            value={promotion?.discountPercent}
                            onChange={(e) => {
                                const percentageN = Number(e.target.value);

                                if (percentageN < 0 || percentageN > 100) {
                                    return;
                                }
                                setPromotion((state) => ({ ...state, discountPercent: e.target.value }));
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate">Ngày bắt đầu</label>
                        <input
                            id="startDate"
                            type="date"
                            value={formatDateForInput(promotion?.startDate)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setErrorMsg(""); // error disappear when user's trying again
                            }}
                            onChange={(e) => {
                                const newStartDate = new Date(e.target.value);
                                if (newStartDate > new Date(promotion.endDate)) {
                                    console.log("Invalid startdate");
                                    setErrorMsg("Ngày bắt đầu không hợp lệ!");
                                    return;
                                } 
                                setPromotion((state) => ({ ...state, startDate: newStartDate.toISOString() }));
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate">Ngày kết thúc</label>
                        <input
                            id="endDate"
                            type="date"
                            value={formatDateForInput(promotion?.endDate)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setErrorMsg(""); // error disappear when user's trying again
                            }}
                            onChange={(e) => {
                                const newEndDate = new Date(e.target.value);
                                console.log(promotion.startDate, newEndDate);

                                if (newEndDate < new Date(promotion.startDate)) {
                                    console.log("Invalid enddate");
                                    setErrorMsg("Ngày kết thúc không hợp lệ!");
                                    return;
                                }

                                setPromotion((state) => ({ ...state, endDate: newEndDate.toISOString() }));
                            }}
                        />
                    </div>
                    {errorMsg ? <div className={styles["error-message"]}>{errorMsg}</div> : ""}
                    <button
                        className={styles["confirm-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            modifyPromotion(promotion);
                        }}
                    >
                        Xác nhận
                    </button>
                    <button
                        className={styles["cancel-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.displayPopup({ display: false, promotion: null });
                        }}
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </>
    );
};

export default PromotionModifyPopup;
