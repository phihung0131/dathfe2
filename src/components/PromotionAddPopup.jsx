import React, { useState } from "react";
import styles from "./PromotionModifyPopup.module.css";
import { formatDateForInput } from "../utils/formatter";
import { checkDescription, checkEmptyString } from "../utils/inputValidation";
import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL;

const PromotionAddPopup = (props) => {
    const [promotion, setPromotion] = useState({
        name: "",
        description: "",
        discountPercent: "",
        startDate: null,
        endDate: null,
        product: "",
    });
    const [products, setProducts] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const { addPromotion, displayPopup } = props;

    async function fetchNotPromotionalProducts() {
        if (products.length === 0) {
            try {
                const response = await axios.get(`${apiURL}/products?limit=1000`);
                const data = response.data;
                if (data.status === "success") {
                    const notPromotionalProducts = data.data.products.filter((product) => !product.promotionalPrice);
                    setProducts(notPromotionalProducts);
                    console.log(notPromotionalProducts);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["popup"]}>
                    <h2 className={styles["title"]}>Thêm thông tin khuyến mãi</h2>
                    <div>
                        <label htmlFor="promotion-name">Tên khuyến mãi</label>
                        <input
                            id="promotion-name"
                            type="text"
                            className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={promotion?.name}
                            onChange={(e) => {
                                setPromotion((state) => ({ ...state, name: e.target.value }));
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="product-id">Sản phẩm</label>
                        {/* <input
                            id="product-id"
                            type="text"
    className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={promotion?.product}
                            onChange={(e) => {
                                setPromotion((state) => ({ ...state, product: e.target.value }));
                            }}
                        /> */}
                        <select
                            name="id"
                            onFocus={() => {
                                fetchNotPromotionalProducts();
                            }}
                            onChange={(e) => {
                                setPromotion((state) => ({ ...state, product: e.target.value }));
                            }}
                            className="w-3/5 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Chọn sản phẩm</option>
                            {products.length > 0 &&
                                products.map((item) => <option value={item._id}>{item.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="promotion-description">Mô tả khuyến mãi</label>
                        <input
                            id="promotion-description"
                            type="text"
                            className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={promotion?.description}
                            onChange={(e) => {
                                setPromotion((state) => ({ ...state, description: e.target.value }));
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="discount">Phần trăm giảm giá</label>
                        <input
                            id="discount"
                            className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="date"
                            value={formatDateForInput(promotion?.startDate)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setErrorMsg(""); // error disappear when user's trying again
                            }}
                            onChange={(e) => {
                                const newStartDate = new Date(e.target.value);
                                if (promotion.endDate && newStartDate >= new Date(promotion.endDate)) {
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
                            className=" p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formatDateForInput(promotion?.endDate)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setErrorMsg(""); // error disappear when user's trying again
                            }}
                            onChange={(e) => {
                                const newEndDate = new Date(e.target.value);
                                console.log(promotion.startDate, newEndDate);

                                if (promotion.startDate && newEndDate <= new Date(promotion.startDate)) {
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
                            const descriptionChecking = checkDescription(promotion.description);
                            if (!descriptionChecking.result) {
                                setErrorMsg(descriptionChecking.msg);
                                return;
                            }
                            if (
                                checkEmptyString(promotion.name).result &&
                                checkEmptyString(promotion.product).result &&
                                checkEmptyString(promotion.discountPercent).result &&
                                checkEmptyString(promotion.startDate).result &&
                                checkEmptyString(promotion.endDate).result
                            ) {
                                addPromotion(promotion);
                            } else {
                                setErrorMsg("Vui lòng điền đầy đủ các trường!");
                            }
                        }}
                    >
                        Xác nhận
                    </button>
                    <button
                        className={styles["cancel-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            displayPopup(false);
                        }}
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </>
    );
};

export default PromotionAddPopup;
