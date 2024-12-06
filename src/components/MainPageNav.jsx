import React, { createContext, memo, useContext, useEffect, useState } from "react";
import styles from "./MainPageNav.module.css";
import ChildNavItem from "./ChildNavItem";
import ProductPreviewItem from "./ProductPreviewItem";
import {navs } from "../utils/urlMapping";
import { useLocation } from "react-router-dom";
import { useCollectionPageContext } from "./CollectionPage";

const MainPageNavContext = createContext({});

const MainPageNav = (props) => {
    const { activeNav, setActiveNav } = useCollectionPageContext();

    return (
        <>
            <div className={styles["container"]}>
                <ul className={styles["nav-parent"]}>
                    <li
                        className={`${styles["nav-parent-item"]} ${activeNav.parentNum === 0 ? styles["active"] : ""} `}
                        onClick={() => {
                            setActiveNav(state => ({...state, parentNum: 0}));
                        }}
                    >
                        GIÀY NAM
                    </li>
                    <li
                        className={`${styles["nav-parent-item"]} ${activeNav.parentNum === 1 ? styles["active"] : ""}`}
                        onClick={() => {
                            setActiveNav(state => ({...state, parentNum: 1}));
                        }}
                    >
                        GIÀY NỮ
                    </li>
                    <li
                        className={`${styles["nav-parent-item"]} ${activeNav.parentNum === 2 ? styles["active"] : ""}`}
                        onClick={() => {
                            setActiveNav(state => ({...state, parentNum: 2}));
                        }}
                    >
                        GIÀY TRẺ EM
                    </li>
                </ul>

                <ul className={styles["nav-children"]}>
                    {navs
                        .filter((nav) => nav.parent === activeNav.parentNum)
                        .map((item) => (
                            <ChildNavItem item={item} />
                        ))}
                </ul>
            </div>
        </>
    );
};

export default MainPageNav;
export const useMainPageNavContext = () => {
    return useContext(MainPageNavContext);
};
