import React, { useEffect, useState } from "react";
import styles from "./OrderFilter.module.css";
import { useCollectionPageContext } from "./CollectionPage";
import { getFilterOption, orderFilterOptions } from "../utils/filter";

const OrderFilter = () => {
    const [isOpen, setIsOpen] = useState(false); // control the state of the menu
    const { orderFilterCondition, setOrderFilterCondition } = useCollectionPageContext();

    return (
        <>
            <div
                className={styles["container"]}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((state) => !state);
                }}
            >
                <div className={styles["selected-filter"]}>{getFilterOption(orderFilterCondition)?.description}</div>
                <ul className={`${styles["option-container"]} ${isOpen ? styles["open"] : ""}`}>
                    {orderFilterOptions.map((item) => (
                        <li
                            key={item.description}
                            className={orderFilterCondition === item.optionNum ? styles["selected"] : ""}
                            onClick={() => {
                                setOrderFilterCondition(item.optionNum);
                            }}
                        >
                            {item.description}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default OrderFilter;
