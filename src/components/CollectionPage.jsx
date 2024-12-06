import React, { createContext, Suspense, useContext, useEffect, useRef, useState } from "react";
import styles from "./CollectionPage.module.css";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { Await, defer, useLoaderData, useLocation, useNavigate, useSubmit } from "react-router-dom";
import Filter from "./Filter";
import ProductPreviewItem from "./ProductPreviewItem";
import MainPageNav from "./MainPageNav";
import { findParentNumByLink, urlMap } from "../utils/urlMapping";
import { getFilterOption, orderFilterOptions } from "../utils/filter";
import PageNavigation from "./PageNavigation";
const CollectionPageContext = createContext({});
/*
    params:
    + collectionName
    queryParams:
    + minRating
    + priceRange
    + sortBy
    + sortOrder
    + limit
    + page
*/
const loader = async ({ request, params }) => {
    console.log("loader");
    try {
        const collectionSearchParam = urlMap[params.collectionName];
        const requestURL = new URL(request.url);
        const queryParams = new URLSearchParams(requestURL.search);
        queryParams.append("category", collectionSearchParam);
        queryParams.append("limit", 20); // set default limit is 20
        let searchString = queryParams.toString();
        console.log("search string", searchString);
        const data = axios.get(`${apiURL}/products/search?${searchString}`).then((response) => response.data);
        return defer({ data });
    } catch (error) {
        console.log(error);
        return {};
    }
};

const action = async ({ request, params }) => {};

const CollectionPage = () => {
    console.log("CollecionPage render");

    const [activeNav, setActiveNav] = useState({ parentNum: 0 }); // for selecting the parent nav of mainpagenav
    const { data } = useLoaderData();
    const isFirstRender = useRef(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isNavigate = useRef(true); // to prevent re-navigate when user navigate to another location
    const [filterCondition, setFilterCondition] = useState({}); // filter options of the left section

    const [orderFilterCondition, setOrderFilterCondition] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    // filter options of the right section

    const priceRange = { min: 0, max: 9999999 };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        requestData();
    }, [filterCondition, orderFilterCondition, currentPage]);

    useEffect(() => {
        if (activeNav.link !== location.pathname) {
            setActiveNav({ link: location.pathname, parentNum: findParentNumByLink(location.pathname) }); // set to the newest URL
            isNavigate.current = false;
            setFilterCondition({}); // reset filter
            setOrderFilterCondition(0); // reset filter
            const queryParams = new URLSearchParams(location.search);
            const currentNum = queryParams.get("page");
            if (currentNum) setCurrentPage(parseInt(currentNum)); // set correct current page if page is requested by URL
        }
    }, [location]);

    function requestData() {
        if (isNavigate.current) {
            const queryString = new URLSearchParams();
            if (filterCondition.minRating) queryString.append("minRating", filterCondition.minRating);
            if (filterCondition.priceRange)
                queryString.append(
                    "priceRange",
                    `${Math.floor(filterCondition.priceRange.min)}-${Math.ceil(filterCondition.priceRange.max)}`
                );
            if (orderFilterCondition !== 0) {
                const filterOption = getFilterOption(orderFilterCondition);
                queryString.append("sortBy", filterOption.sortBy);
                queryString.append("sortOrder", filterOption.sortOrder);
            }
            queryString.append("page", currentPage);
            console.log("navigate to ", `${location.pathname}?${queryString.toString()}`);
            navigate(`${location.pathname}?${queryString.toString()}`);
        } else {
            isNavigate.current = true;
        }
    }
    return (
        <>
            <section className={styles["container"]}>
                <CollectionPageContext.Provider
                    value={{
                        filterCondition,
                        setFilterCondition,
                        priceRange,
                        orderFilterCondition,
                        setOrderFilterCondition,
                        activeNav,
                        setActiveNav,
                        isNavigate,
                    }}
                >
                    <MainPageNav />
                    <Filter />
                </CollectionPageContext.Provider>
                <Suspense fallback={<div>Loading...</div>}>
                    <Await resolve={data}>
                        {(data) => {
                            setMaxPage(data.data.totalPages);

                            return (
                                <>
                                    <div className={styles["product-flex-container"]}>
                                        {data.status === "success"
                                            ? data.data.products.map((product) => (
                                                  <ProductPreviewItem product={product} />
                                              ))
                                            : "Error"}
                                    </div>
                                    <PageNavigation
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        maxPage={maxPage}
                                    />
                                </>
                            );
                        }}
                    </Await>
                </Suspense>
            </section>
        </>
    );
};

export default CollectionPage;
export { loader };
export const useCollectionPageContext = () => {
    return useContext(CollectionPageContext);
};
