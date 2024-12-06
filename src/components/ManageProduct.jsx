import React, { useEffect, useRef, useState } from "react";
import styles from "./ManageProduct.module.css";
import PageNavigation from "./PageNavigation";
import axios from "axios";
import AdminProductItem from "./AdminProductItem";
import { generateUUID } from "../utils/id";
import LoadingPopup from "./LoadingPopup";
const apiURL = import.meta.env.VITE_API_URL;

// For admin
// Add product
// Delete product
// Modify product
//
const ManageProduct = () => {
    console.log("ManageProduct render");

    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const fetchProducts = async () => {
        const searchParams = new URLSearchParams();
        searchParams.append("limit", 30); // default limit products per page is 30
        searchParams.append("page", currentPage);
        try {
            const response = await axios.get(`${apiURL}/products/search?${searchParams.toString()}`);
            const data = response.data;
            if (data.status === "success") {
                setProducts(data.data.products);
                setTotalProducts(data.data.totalItems);
                setMaxPage(data.data.totalPages);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Ensure this runs after the try-catch block
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    return (
        <>
            <div className={styles["container"]}>
                <h2 className={styles["page-title"]}>Quản lý sản phẩm</h2>
                {isLoading ? (
                    <LoadingPopup />
                ) : (
                    <>
                        <div className={styles["stat"]}>Tổng số sản phẩm: {totalProducts}</div>

                        <div className={styles["product-container"]}>
                            {products.length > 0 &&
                                products.map((product) => <AdminProductItem product={product} key={generateUUID()} />)}
                        </div>
                        <PageNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} maxPage={maxPage} />
                    </>
                )}
            </div>
        </>
    );
};

export default ManageProduct;
