import React, { createContext, useContext, useState } from "react";
import styles from "./Filter.module.css";
import IcFilter from "../assets/filter.svg";
import FilterOption from "./FilterOption";
import { useCollectionPageContext } from "./CollectionPage";
import SelectedFilterOption from "./SelectedFilterOption";
import OrderFilter from "./OrderFilter";

const FilterContext = createContext({});

const Filter = () => {
    const [expand, setExpand] = useState(-1);
    const { filterCondition, setFilterCondition, activeNavChild } = useCollectionPageContext();
    
    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["options"]}>
                    <div className={styles["left-section"]}>
                        <img src={IcFilter} alt="Filter Icon" style={{ width: "1.5rem" }} />
                        <FilterContext.Provider value={{ expand, setExpand }}>
                            <FilterOption optionNum={0} />
                            <FilterOption optionNum={1} />
                        </FilterContext.Provider>
                    </div>
                    <div className={styles["order-section"]}>
                        <OrderFilter />
                    </div>
                </div>
                <ul className={styles["selected-options"]}>
                    {Object.entries(filterCondition)
                        .filter((entry) => entry[1] !== 0 || (entry[1].min !== -1 && entry[1].max !== -1))
                        .map((entry) => (
                            <SelectedFilterOption entry={entry}></SelectedFilterOption>
                        ))}
                </ul>
            </div>
        </>
    );
};

export default Filter;
export const useFilterContext = () => {
    return useContext(FilterContext);
};
