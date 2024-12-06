import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import styles from "./SelectedFilterOption.module.css";
import { formatSelectedFilter } from "../utils/filter";
import { useCollectionPageContext } from "./CollectionPage";

const SelectedFilterOption = (props) => {
    console.log(props.entry);
    const { filterCondition, setFilterCondition } = useCollectionPageContext();

    return (
        <>
            <li
                className={styles["container"]}
                onClick={(e) => {
                    e.stopPropagation();
                    let newFilterCondition = { ...filterCondition };
                    delete newFilterCondition[props.entry[0]];
                    setFilterCondition(newFilterCondition);
                }}
            >
                <span className={styles["filter-name"]}>{formatSelectedFilter(props.entry[0], props.entry[1])}</span>
                <IoIosCloseCircleOutline className={styles["cancel-icon"]}></IoIosCloseCircleOutline>
            </li>
        </>
    );
};

export default SelectedFilterOption;
