import React, { useEffect, useState } from "react";
import styles from "./AdminProductDetail.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { authConfig, getAuthConfig } from "../utils/axiosConfig";
import LoadingPopup from "./LoadingPopup";
import { IoTrashOutline } from "react-icons/io5";
import IcReturn from "../assets/ic_return.png";
import { colors } from "../utils/colors";
const apiURL = import.meta.env.VITE_API_URL;

const AdminProductDetail = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [sizeAdded, setSizeAdded] = useState({});
    const navigate = useNavigate();
    const [sizeAddedInfo, setSizeAddedInfo] = useState({});
    const [isAddColor, setIsAddColor] = useState(false); // enable form to add color
    const [addedColor, setAddedColor] = useState("Black"); // storing color name

    useEffect(() => {
        fetchProductDetail();
    }, []);

    async function fetchProductDetail() {
        try {
            const response = await axios.get(`${apiURL}/products/${id}`);
            const data = response.data;
            if (data.status === "success") {
                setProduct(data.data);
            } else {
                console.log("Get product ", data.status);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function saveChanges() {
        setIsLoading(true);
        try {
            let bodyData = {};
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
            bodyData["infos"] = sizeArr;
            bodyData["name"] = product.name;
            bodyData["description"] = product.description;
            bodyData["price"] = product.price;
            const response = await axios.put(`${apiURL}/products/${id}`, bodyData, getAuthConfig());
            console.log(response.data);
        } catch (error) {
            console.log(error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteProduct() {
        try {
            const response = await axios.delete(`${apiURL}/products/${id}`, getAuthConfig());
            const data = response.data;
            if (data.status === "success") {
                navigate("/admin/products"); // navigate to products
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        } catch (error) {
            console.log(error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau");
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
                {isLoading ? (
                    <LoadingPopup />
                ) : (
                    <>
                        <div
                            className={styles["back-button"]}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Quay về trang tất cả sản phẩm
                            <img src={IcReturn} className={styles["back-icon"]} />
                        </div>
                        <h1 className={styles["page-title"]}>Chi tiết sản phẩm</h1>
                        <section>
                            <label className={styles["section-label"]} htmlFor="">
                                Tên sản phẩm
                            </label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => {
                                    setProduct((state) => ({ ...state, name: e.target.value }));
                                }}
                            />
                        </section>

                        <section>
                            <label className={styles["section-label"]} htmlFor="">
                                Mô tả
                            </label>
                            <textarea
                                type="text"
                                value={product.description}
                                onChange={(e) => {
                                    setProduct((state) => ({ ...state, description: e.target.value }));
                                }}
                            />
                        </section>

                        <section>
                            <label className={styles["section-label"]} htmlFor="">
                                Giá
                            </label>
                            <input
                                type="text"
                                value={product.price}
                                onChange={(e) => {
                                    setProduct((state) => ({
                                        ...state,
                                        price: Number(e.target.value)
                                        // price: e.target.value,
                                    }));
                                }}
                            />
                        </section>

                        <section className={styles["color-summary"]}>
                            <h2 className={styles["section-label"]}>Bảng màu</h2>
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
                                                        <input type="text" defaultValue={size.size} readOnly />
                                                        <label className={styles["child-label"]} htmlFor="">
                                                            Số lượng
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={size.quantity}
                                                            onChange={(e) => {
                                                                setProduct((prevProduct) => ({
                                                                    ...prevProduct,
                                                                    colorSummary: prevProduct.colorSummary.map((item) =>
                                                                        item.color === colorItem.color
                                                                            ? {
                                                                                  ...item,
                                                                                  sizes: item.sizes.map((sizeItem) =>
                                                                                      sizeItem.size === size.size
                                                                                          ? {
                                                                                                ...sizeItem,
                                                                                                quantity: Number(
                                                                                                    e.target.value
                                                                                                ),
                                                                                                // quantity:
                                                                                                //     e.target.value,
                                                                                            }
                                                                                          : sizeItem
                                                                                  ),
                                                                              }
                                                                            : item
                                                                    ),
                                                                }));
                                                            }}
                                                        />
                                                        <IoTrashOutline
                                                            style={{ marginLeft: "10px", cursor: "pointer" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const result =
                                                                    window.confirm("Bạn chắc chắn muốn xóa?");
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
                                                        type="text"
                                                        value={sizeAddedInfo[colorItem.color]?.size || 0}
                                                        onChange={(e) => {
                                                            const newInfo = sizeAddedInfo[colorItem.color] || {};
                                                            newInfo.size = Number(e.target.value);
                                                            // newInfo.size = e.target.value;
                                                            const newSizeAddedInfo = { ...sizeAddedInfo };
                                                            newSizeAddedInfo[colorItem.color] = newInfo;
                                                            setSizeAddedInfo(newSizeAddedInfo);
                                                        }}
                                                    />
                                                    <label className={styles["child-label"]} htmlFor="">
                                                        Số lượng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={sizeAddedInfo[colorItem.color]?.quantity || 0}
                                                        onChange={(e) => {
                                                            const newInfo = sizeAddedInfo[colorItem.color] || {};
                                                            newInfo.quantity = Number(e.target.value);
                                                            // newInfo.quantity =e.target.value;
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
                    </>
                )}
            </div>
        </>
    );
};

export default AdminProductDetail;
