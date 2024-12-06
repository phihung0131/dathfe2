import React from "react";
import styles from "./DropdownMenu.module.css";
import { useNavigate } from "react-router-dom";
import { navs } from "../utils/urlMapping";
const DropdownMenu = (props) => {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles["container"]}>
                {navs
                    .filter((nav) => nav.parent === props.parentNav)
                    .map((item) => (
                        <div
                            className={styles["item"]}
                            onClick={() => {
                                navigate(item.link);
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default DropdownMenu;
