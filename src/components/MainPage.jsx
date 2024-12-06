import React from "react";
import MainPageNav from "./MainPageNav";
import styles from "./MainPage.module.css";
import ProductPreviewItem from "./ProductPreviewItem";
import Filter from "./Filter";
import SearchBar from "./SearchBar";
import CollectionSection from "./CollectionSection";
import SlideBanner from "./SlideBanner";
const apiURL = import.meta.env.VITE_API_URL;
// some banners
// some preview collections (hot trend, ...)

const MainPage = () => {
    return (
        <>
            <div className={styles["container"]}>
                <SlideBanner />
                <SearchBar />
                <CollectionSection theme={{ title: "Sản phẩm mới ra mắt", dataPath: `${apiURL}/products?limit=20` }} />
                <CollectionSection
                    theme={{ title: "Sản phẩm khuyến mãi", dataPath: `${apiURL}/products/promotional?limit=20` }}
                />
            </div>
        </>
    );
};

export default MainPage;
