import React, { useEffect, useState } from "react";
import styles from "./AdminProductDetail.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { authConfig } from "../utils/axiosConfig";
import LoadingPopup from "./LoadingPopup";
import { IoTrashOutline } from "react-icons/io5";
import { colors } from "../utils/colors";
import { categoryIDMapping } from "../data/products";
import { checkDescription, checkPrice, checkProductName, checkSizeArr } from "../utils/inputValidation";

const apiURL = import.meta.env.VITE_API_URL;

const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        colorSummary: [],
        categoryId: categoryIDMapping[0].id,
    });
    const [warnings, setWarnings] = useState({ name: "", description: "", price: "", sizeArr: "" });
    const [sizeAdded, setSizeAdded] = useState({});
    const navigate = useNavigate();
    const [sizeAddedInfo, setSizeAddedInfo] = useState({});
    const [isAddColor, setIsAddColor] = useState(false); // enable form to add color
    const [addedColor, setAddedColor] = useState("Black"); // storing color name

    async function saveChanges() {
        try {
            let bodyData = new FormData();
            const sizeArr = [];
            for (let i = 0; i < product.colorSummary.length; i++) {
                const summary = product.colorSummary[i];
                for (let j = 0; j < summary.sizes.length; j++) {
                    sizeArr.push({
                        color: summary.color,
                        size: summary.sizes[j].size,
                        quantity: summary.sizes[j].quantity,
                    });
                }
            }
            const nameCheckResult = checkProductName(product.name);
            if (!nameCheckResult.result) {
                setWarnings((state) => ({ ...state, name: nameCheckResult.msg }));
                return;
            } else {
                setWarnings((state) => ({ ...state, name: "" }));
            }

            const descriptionCheckResult = checkDescription(product.description);
            if (!descriptionCheckResult.result) {
                setWarnings((state) => ({ ...state, description: descriptionCheckResult.msg }));
                return;
            } else {
                setWarnings((state) => ({ ...state, description: "" }));
            }

            const priceCheckResult = checkPrice(product.price);
            if (!priceCheckResult.result) {
                setWarnings((state) => ({ ...state, price: priceCheckResult.msg }));
                return;
            } else {
                setWarnings((state) => ({ ...state, price: "" }));
            }

            const sizeArrResult = checkSizeArr(sizeArr);
            if (!sizeArrResult.result) {
                setWarnings((state) => ({ ...state, sizeArr: sizeArrResult.msg }));
                return;
            } else {
                setWarnings((state) => ({ ...state, sizeArr: "" }));
            }
            setIsLoading(true); // display loading screen

            bodyData.append("name", product.name);
            bodyData.append("description", product.description);
            bodyData.append("categoryId", product.categoryId);
            bodyData.append("price", product.price);
            bodyData.append("infos", JSON.stringify(sizeArr));

            const response = await axios.post(`${apiURL}/products`, bodyData, authConfig);
            const data = response.data;
            console.log(data);
            if (data?.status === "success") {
                setProduct({
                    name: "",
                    description: "",
                    price: 0,
                    colorSummary: [],
                    categoryId: categoryIDMapping[0].id,
                });
                alert("Thêm sản phẩm thành công!");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau!");
            }
        } catch (error) {
            console.log(error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    }

    function removeSize(color, size) {
        setProduct((prevProduct) => ({
            ...prevProduct,
            colorSummary: prevProduct.colorSummary.map((colorItem) =>
                colorItem.color === color
                    ? {
                          ...colorItem,
                          sizes: colorItem.sizes.filter((sizeItem) => sizeItem.size !== size),
                      }
                    : colorItem
            ),
        }));
    }

    function addColorToProduct() {
        console.log("addedColor", addedColor);

        const existedColor = product.colorSummary.find((colorItem) => colorItem.color === addedColor);
        if (!existedColor) {
            setProduct((prevProduct) => ({
                ...prevProduct,
                colorSummary: [...prevProduct.colorSummary, { color: addedColor, sizes: [] }],
            }));
        } else {
            alert("Màu này đã tồn tại!");
        }
    }

    function deleteColor(color) {
        setProduct((prevProduct) => ({
            ...prevProduct,
            colorSummary: prevProduct.colorSummary.filter((colorItem) => colorItem.color !== color),
        }));
    }

    function addSizeToColor(color) {
        const colorItem = product.colorSummary.find((item) => item.color === color);
        if (colorItem) {
            const colorSizes = colorItem.sizes;
            console.log(colorSizes);

            const existSize = colorSizes.find((size) => size.size === sizeAddedInfo[color].size);
            if (!existSize) {
                console.log("Size not existed");
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    colorSummary: prevProduct.colorSummary.map((colorItem) =>
                        colorItem.color === color
                            ? {
                                  ...colorItem,
                                  sizes: [
                                      ...colorItem.sizes,
                                      { size: sizeAddedInfo[color].size, quantity: sizeAddedInfo[color].quantity },
                                  ], // Push the new size
                              }
                            : colorItem
                    ),
                }));

                return true; // successfully
            } else {
                alert("Size existed");
                return false; // failed
            }
        }
    }

    return (
        <>
            <div className={styles["container"]}>
                <h1 className={styles["page-title"]}>Thêm sản phẩm</h1>
                <section>
                    <label className={styles["section-label"]} htmlFor="">
                        Tên sản phẩm
                    </label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setWarnings((state) => ({ ...state, name: "" }));
                            }
                            setProduct((state) => ({ ...state, name: e.target.value }));
                        }}
                    />
                    {warnings.name ? <div className={styles["warning-message"]}>{warnings.name}</div> : ""}
                </section>

                <section>
                    <label className={styles["section-label"]} htmlFor="">
                        Mô tả
                    </label>
                    <textarea
                        type="text"
                        value={product.description}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setWarnings((state) => ({ ...state, description: "" }));
                            }
                            setProduct((state) => ({ ...state, description: e.target.value }));
                        }}
                    />
                    {warnings.description ? (
                        <div className={styles["warning-message"]}>{warnings.description}</div>
                    ) : (
                        ""
                    )}
                </section>

                <section>
                    <label className={styles["section-label"]} htmlFor="">
                        Giá
                    </label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => {
                            setWarnings((state) => ({ ...state, price: "" }));
                            setProduct((state) => ({ ...state, price: e.target.value }));
                        }}
                    />
                    {warnings.price ? <div className={styles["warning-message"]}>{warnings.price}</div> : ""}
                </section>

                <section>
                    <label className={styles["section-label"]} htmlFor="">
                        Danh mục
                    </label>
                    <select
                        value={product.categoryId}
                        onChange={(e) => {
                            setProduct((state) => ({
                                ...state,
                                categoryId: e.target.value,
                            }));
                        }}
                    >
                        {categoryIDMapping.map((category) => (
                            <option value={category.id}>{category.category}</option>
                        ))}
                    </select>
                </section>

                <section className={styles["color-summary"]}>
                    <h2 className={styles["section-label"]}>Bảng màu</h2>
                    {warnings.sizeArr ? <div className={styles["warning-message"]}>{warnings.sizeArr}</div> : ""}
                    {product.colorSummary.length > 0 &&
                        product.colorSummary.map((colorItem) => (
                            <>
                                <div className={styles["color-header"]}>
                                    <div className={styles["subsection-label"]}>{colorItem.color}</div>
                                    <button
                                        className={styles["button"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSizeAdded((state) => ({ ...state, [colorItem.color]: true }));
                                        }}
                                    >
                                        Thêm cỡ
                                    </button>
                                    <IoTrashOutline
                                        style={{ marginLeft: "10px", cursor: "pointer" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const result = window.confirm("Bạn chắc chắn muốn xóa màu này?");
                                            if (result) deleteColor(colorItem.color);
                                        }}
                                    />
                                </div>

                                <ul className={styles["size-list"]}>
                                    {colorItem.sizes.length > 0 &&
                                        colorItem.sizes.map((size) => (
                                            <li>
                                                <label className={styles["child-label"]} htmlFor="">
                                                    Kích cỡ
                                                </label>
                                                <input type="text" value={size.size} onChange={(e) => {}} />
                                                <label className={styles["child-label"]} htmlFor="">
                                                    Số lượng
                                                </label>
                                                <input type="text" value={size.quantity} />
                                                <IoTrashOutline
                                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const result = window.confirm("Bạn chắc chắn muốn xóa?");
                                                        if (result) removeSize(colorItem.color, size.size);
                                                    }}
                                                />
                                            </li>
                                        ))}
                                    {sizeAdded[colorItem.color] ? (
                                        <li>
                                            <label className={styles["child-label"]} htmlFor="">
                                                Kích cỡ
                                            </label>
                                            <input
                                                type="number"
                                                value={sizeAddedInfo[colorItem.color]?.size || 0}
                                                onChange={(e) => {
                                                    const newInfo = sizeAddedInfo[colorItem.color] || {};
                                                    newInfo.size = Number(e.target.value);
                                                    const newSizeAddedInfo = { ...sizeAddedInfo };
                                                    newSizeAddedInfo[colorItem.color] = newInfo;
                                                    setSizeAddedInfo(newSizeAddedInfo);
                                                }}
                                            />
                                            <label className={styles["child-label"]} htmlFor="">
                                                Số lượng
                                            </label>
                                            <input
                                                type="number"
                                                value={sizeAddedInfo[colorItem.color]?.quantity || 0}
                                                onChange={(e) => {
                                                    const newInfo = sizeAddedInfo[colorItem.color] || {};
                                                    newInfo.quantity = Number(e.target.value);
                                                    const newSizeAddedInfo = { ...sizeAddedInfo };
                                                    newSizeAddedInfo[colorItem.color] = newInfo;
                                                    setSizeAddedInfo(newSizeAddedInfo);
                                                }}
                                            />
                                            <button
                                                className={styles["confirm-button"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // check if the size existed
                                                    if (addSizeToColor(colorItem.color))
                                                        setSizeAddedInfo((state) => ({
                                                            ...state,
                                                            [colorItem.color]: { size: 0, quantity: 0 },
                                                        }));
                                                }}
                                            >
                                                Xác nhận
                                            </button>
                                            <button
                                                className={styles["cancel-button"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // close the adding size form
                                                    setSizeAdded((state) => ({
                                                        ...state,
                                                        [colorItem.color]: false,
                                                    }));
                                                    // reset the value
                                                    setSizeAddedInfo((state) => ({
                                                        ...state,
                                                        [colorItem.color]: { size: 0, quantity: 0 },
                                                    }));
                                                }}
                                            >
                                                Hủy bỏ
                                            </button>
                                        </li>
                                    ) : (
                                        ""
                                    )}
                                </ul>
                            </>
                        ))}
                    {isAddColor ? (
                        <>
                            <div>
                                <select
                                    value={addedColor}
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setAddedColor(e.target.value);
                                    }}
                                >
                                    {colors.map((colorItem) => (
                                        <option value={colorItem.color}>{colorItem.color}</option>
                                    ))}
                                </select>
                                <button
                                    className={styles["confirm-button"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addColorToProduct();
                                        setIsAddColor(false); // hide added form
                                    }}
                                >
                                    Xác nhận
                                </button>
                                <button
                                    className={styles["cancel-button"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAddedColor("Black"); // reset to the default color
                                        setIsAddColor(false); // hide added form
                                    }}
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                    <button
                        className={styles["add-color-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAddColor(true);
                        }}
                    >
                        + Thêm màu
                    </button>
                </section>
                <div className={styles["option-container"]}>
                    <button
                        className={styles["save-change-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            saveChanges();
                        }}
                    >
                        Lưu thay đổi
                    </button>
                    <button
                        className={styles["delete-product-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            const result = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
                            if (result) deleteProduct();
                        }}
                    >
                        Xóa sản phẩm
                    </button>
                </div>
            </div>
            {isLoading ? <LoadingPopup/> : ""}
        </>
    );
};

export default AddProduct;
