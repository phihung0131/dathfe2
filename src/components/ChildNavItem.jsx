import React from "react";
import styles from "./ChildNavItem.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMainPageNavContext } from "./MainPageNav";
import { useCollectionPageContext } from "./CollectionPage";

const ChildNavItem = (props) => {
    const navigate = useNavigate();
    // const { activeChildNav, setActiveChildNav } = useMainPageNavContext();
    const { activeNav } = useCollectionPageContext();
    function navigateToCollection() {
        navigate(props.item.link);
    }

    return (
        <>
            <li className={styles["nav-item"]}>
                <div
                    className={`${styles["nav-icon-container"]} ${
                        activeNav.link === props.item.link ? styles["active"] : ""
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigateToCollection();
                    }}
                >
                    <img src={props.item.img || ""} alt="" className={styles["nav-icon"]} />
                </div>

                <div
                    className={styles["nav-title"]}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigateToCollection();
                    }}
                >
                    {props.item.title}
                </div>
            </li>
        </>
    );
};
export default ChildNavItem;
