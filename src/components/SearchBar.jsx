import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState(""); // search input
    function searchProduct() {
        if (input.trim()) {
            let queryParams = new URLSearchParams();
            queryParams.append("search", encodeURIComponent(input));
            navigate(`/search?${queryParams.toString()}`);
        } else {
            alert("Vui lòng nhập tên sản phẩm bạn muốn tìm kiếm");
        }
    }

    return (
        <>
            <div className={styles["container"]}>
                <label htmlFor="search-input">Tìm kiếm sản phẩm bạn đang quan tâm</label>
                <div className={styles["search-bar"]}>
                    <div
                        className={styles["search-icon-container"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            searchProduct();
                        }}
                    >
                        <GoSearch className={styles["icon"]} />
                    </div>

                    <input
                        id="search-input"
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchProduct();
                            }
                        }}
                        className={styles["search-input"]}
                        placeholder="Nhập tên sản phẩm..."
                    />
                </div>
            </div>
        </>
    );
};

export default SearchBar;
