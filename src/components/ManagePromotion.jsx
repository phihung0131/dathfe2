import React, { useEffect, useRef, useState } from "react";
import styles from "./ManagePromotion.module.css";
import Promotion from "./Promotion";
import axios from "axios";
import { authConfig, getAuthConfig } from "../utils/axiosConfig";
import PromotionModifyPopup from "./PromotionModifyPopup";
import PromotionAddPopup from "./PromotionAddPopup";
import LoadingPopup from "./LoadingPopup";
import DeleteModal from "./DeleteModal";
const apiURL = import.meta.env.VITE_API_URL;

const ManagePromotion = () => {
    const [promotions, setPromotions] = useState([]);
    const [modifyPopup, setModifyPopup] = useState({ display: false, promotion: null });
    const [addPopup, setAddPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deletePopup, setDeletePopup] = useState(false); // deletePopup visibility
    const deleteInfoRef = useRef(null);
    

    async function getPromotions() {
        try {
            const response = await axios.get(`${apiURL}/promotion`, getAuthConfig());
            const data = response.data;
            if (data.status === "success") {
                setPromotions(data.data.promotions);
            }
        } catch (error) {
            console.error(error);
            alert(`Có lỗi xảy ra, vui lòng thử lại sau ${error.response.data.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    async function deletePromotion() {
        const { promotion, itemContainer, disappearStyle } = deleteInfoRef.current;
        if (promotion) {
            try {
                const response = await axios.delete(`${apiURL}/promotion/${promotion._id}`, getAuthConfig());
                const data = response.data;
                if (data.status === "success") {
                    if (itemContainer) {
                        itemContainer.classList.add(disappearStyle); // run disappear anim
                    }
                    deleteInfoRef.current = null; // empty the delete info
                    setDeletePopup(false); // hide the delete popup
                    setTimeout(() => {
                        getPromotions(); // refetch data
                    }, 300);
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau");
                }
            } catch (error) {
                console.error(error);
                alert(`Có lỗi xảy ra, vui lòng thử lại sau ${error.response.data.message}`);
            }
        }
    }

    function requestDelete(promotion, itemContainer, disappearStyle) {
        deleteInfoRef.current = { promotion, itemContainer, disappearStyle };
        setDeletePopup(true);
    }

    function handleCancelDelete() {
        deleteInfoRef.current = null;
        setDeletePopup(false);
    }

    async function modifyPromotion(promotion) {
        try {
            promotion.discountPercent = parseInt(promotion.discountPercent);
            const response = await axios.put(`${apiURL}/promotion/${promotion._id}`, promotion, getAuthConfig());
            const data = response.data;
            if (data.status === "success") {
                getPromotions(); // refetch data
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau");
        } finally {
            setModifyPopup({ display: false, promotion: null });
        }
    }

    async function addPromotion(promotion) {
        try {
            promotion.discountPercent = parseInt(promotion.discountPercent);
            const response = await axios.post(`${apiURL}/promotion`, promotion, getAuthConfig());
            const data = response.data;
            if (data.status === "success") {
                getPromotions(); // refetch data
                alert(`Tạo khuyến mãi thành công`);
            }
        } catch (error) {
            console.error(error);
            alert(`Có lỗi xảy ra, vui lòng thử lại sau ${error.response.data.message}`);
        } finally {
            setAddPopup(false);
        }
    }

    useEffect(() => {
        getPromotions();
    }, []);

    return (
        <>
            {isLoading ? (
                <LoadingPopup />
            ) : (
                <>
                    <div className={styles["container"]}>
                        <h2>Quản lý khuyến mãi</h2>
                        <button
                            className={styles["add-button"]}
                            onClick={(e) => {
                                e.stopPropagation();
                                setAddPopup(true);
                            }}
                        >
                            Tạo khuyến mãi
                        </button>
                        <div className={styles["promotion-container"]}>
                            {promotions.length > 0 &&
                                promotions.map((item) => (
                                    <Promotion
                                        key={item._id}
                                        item={item}
                                        requestDelete={requestDelete}
                                        displayPopup={setModifyPopup}
                                    ></Promotion>
                                ))}
                        </div>
                    </div>
                    {modifyPopup.display ? (
                        <PromotionModifyPopup
                            displayPopup={setModifyPopup}
                            promotion={modifyPopup.promotion}
                            modifyPromotion={modifyPromotion}
                        />
                    ) : (
                        ""
                    )}

                    {addPopup ? <PromotionAddPopup displayPopup={setAddPopup} addPromotion={addPromotion} /> : ""}
                    {deletePopup ? (
                        <DeleteModal
                            action="Xóa khuyến mãi"
                            message={"Bạn có chắc muốn xóa khuyến mãi này không?"}
                            handleModalVisibility={() => handleCancelDelete()}
                            handleDelete={deletePromotion}
                        />
                    ) : (
                        ""
                    )}
                </>
            )}
        </>
    );
};

export default ManagePromotion;
