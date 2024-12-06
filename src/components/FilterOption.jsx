import React, { useContext, useState } from "react";
import styles from "./FilterOption.module.css";
import { IoIosArrowDown } from "react-icons/io";
import PriceSlider from "./PriceSlider";
import { useCollectionPageContext } from "./CollectionPage";
import { useFilterContext } from "./Filter";

const options = [
    { name: "Đánh giá", options: [1, 2, 3, 4, 5] },
    { name: "Khoảng giá", range: [0, 4000000] },
];

const FilterOption = (props) => {
    // const [minRating, setMinRating] = useState(0);
    const { expand, setExpand } = useFilterContext();
    const { filterCondition, setFilterCondition } = useCollectionPageContext();
    return (
        <>
            <div
                className={styles["container"]}
                onClick={() => {
                    if (expand === props.optionNum) {
                        setExpand(-1);
                    } else {
                        setExpand(props.optionNum);
                    }
                }}
            >
                <div className={styles["filter-title"]}>{options[props.optionNum].name}</div>
                <IoIosArrowDown className={styles["arrow-icon"]} />
                <div
                    className={`${styles["filter-option-list"]} ${expand === props.optionNum ? styles["active"] : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {props.optionNum === 0 ? (
                        <ul className={styles["rating-container"]}>
                            {options[0].options.map((option) => (
                                <li
                                    className={filterCondition.minRating === option ? styles["selected"] : ""}
                                    key={option}
                                    data-rating={option}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterCondition((state) => ({
                                            ...state,
                                            minRating: Number(e.target.dataset.rating),
                                        }));
                                    }}
                                >
                                    {option} sao
                                </li>
                            ))}
                        </ul>
                    ) : (
                        ""
                    )}
                    {props.optionNum === 1 ? <PriceSlider /> : ""}
                </div>
            </div>
        </>
    );
};

export default FilterOption;
