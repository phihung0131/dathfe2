import React, { Suspense, useEffect } from "react";
import styles from "./SearchPage.module.css";
import { Await, defer, useLoaderData, useLocation } from "react-router-dom";
import axios from "axios";
import ProductPreviewItem from "./ProductPreviewItem";
import SearchBar from "./SearchBar";
const apiURL = import.meta.env.VITE_API_URL;

/*
    productData : {
        data: {
            currentPage,
            totalPages,
            products: [],
        },
        message,
        status
    }
 */

const loader = async ({ request, params }) => {
    const requestURL = new URL(request.url);
    console.log(`${apiURL}${requestURL.search}`);
    const data = axios
        .get(`${apiURL}/products/search${requestURL.search}`)
        .then((response) => response.data)
        .catch((error) => error);
    return defer({ productData: data });
};

const SearchPage = () => {
    const { productData } = useLoaderData();
    const location = useLocation();

    function getSearchInput() {
        // get search param's value
        const searchParams = new URLSearchParams(location.search);
        return decodeURIComponent(searchParams.get("search"));
    }

    useEffect(() => {
        console.log("productData in Effect", productData);
    }, [productData]);

    return (
        <>
            <div className={styles["container"]}>
                <h2 className={styles["page-title"]}>Tìm kiếm</h2>
                <Suspense>
                    <Await resolve={productData} errorElement={<div>Error</div>}>
                        {(productData) => {
                            if (productData.status === "success") {
                                return (
                                    <div className={styles["product-quantity-found-notify"]}>
                                        Tìm thấy <span>{productData.data.products.length} sản phẩm</span>
                                    </div>
                                );
                            }
                        }}
                    </Await>
                </Suspense>

                <SearchBar />
                <div className={styles["search-notify"]}>
                    Kết quả tìm kiếm cho <span>{getSearchInput()}</span>
                </div>
                <Suspense fallback={<div>Đang tải...</div>}>
                    <Await resolve={productData} errorElement={<div>Error</div>}>
                        {(productData) => {
                            // console.log(productData);

                            if (productData.status === "success") {
                                if (productData.data.products.length > 0) {
                                    return (
                                        <div className={styles["product-flex-container"]}>
                                            {productData.data.products.map((product) => (
                                                <ProductPreviewItem product={product} />
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return <div>Tiếc quá, sản phẩm bạn tìm kiếm không tồn tại!</div>;
                                }
                            } else {
                                return <div>Có lỗi xảy ra trong quá trình tìm kiếm</div>;
                            }
                        }}
                    </Await>
                </Suspense>
            </div>
        </>
    );
};

export default SearchPage;
export { loader };
