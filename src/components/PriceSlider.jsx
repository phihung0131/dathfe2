import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./PriceSlider.module.css";
import { formatPrice } from "../utils/formatter";
import { useCollectionPageContext } from "./CollectionPage";
import { useFilterContext } from "./Filter";

const PriceSlider = (props) => {
    const leftKnobRef = useRef(null);
    const rightKnobRef = useRef(null);
    const sliderRef = useRef(null);
    const { filterCondition, setFilterCondition, priceRange } = useCollectionPageContext();
    const { expand, setExpand } = useFilterContext();
    const [min, setMin] = useState(priceRange.min);
    const [max, setMax] = useState(priceRange.max);

    useEffect(() => {
        if (leftKnobRef.current) {
            let halfKnobWidth = 8; // half width of the knob
            function reposition(e) {
                console.log(halfKnobWidth);

                let distance = e.clientX - halfKnobWidth - sliderRef.current.getBoundingClientRect().left;
                // from the left boundary to the MIDDLE of the knob
                // console.log(e.clientX + halfKnobWidth , rightKnobRef.current.getBoundingClientRect().left);

                if (distance <= 0) {
                    // if the MIDDLE of the knob is over the left boundary then stop
                    leftKnobRef.current.style.left = "0px";
                    setMin(priceRange.min);
                } else if (e.clientX + halfKnobWidth >= rightKnobRef.current.getBoundingClientRect().left) {
                } else {
                    leftKnobRef.current.style.left = distance + "px";
                    const percentage = distance / sliderRef.current.getBoundingClientRect().width;
                    setMin(percentage * priceRange.max);
                }
            }

            // halfKnobWidth = leftKnobRef.current.getBoundingClientRect().width / 2;

            leftKnobRef.current.addEventListener("mousedown", (e) => {
                document.addEventListener("mousemove", reposition);
            });
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", reposition);
            });
        }
    }, [leftKnobRef]);

    useEffect(() => {
        if (rightKnobRef.current) {
            let halfKnobWidth = 8;
            function reposition(e) {
                const sliderWidth = sliderRef.current.getBoundingClientRect().width;
                let distance = e.clientX - halfKnobWidth - sliderRef.current.getBoundingClientRect().left;
                if (distance + 2 * halfKnobWidth >= sliderWidth) {
                    // maximum
                    rightKnobRef.current.style.left = sliderWidth - 2 * halfKnobWidth;
                    setMax(priceRange.max);
                } else if (e.clientX - halfKnobWidth <= leftKnobRef.current.getBoundingClientRect().right) {
                } else {
                    rightKnobRef.current.style.left = distance + "px";
                    const percentage = (distance + 2 * halfKnobWidth) / sliderWidth;
                    setMax(percentage * priceRange.max);
                }
            }
            // halfKnobWidth = rightKnobRef.current.getBoundingClientRect().width / 2;
            rightKnobRef.current.addEventListener("mousedown", () => {
                document.addEventListener("mousemove", reposition);
            });
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", reposition);
            });
        }
    }, [rightKnobRef]);

    const applyPriceFilter = () => {
        const newPriceRange = { min, max }; 
        // set new range of price 
        setFilterCondition((state) => ({ ...state, priceRange: newPriceRange }));
        setExpand(-1); // close the filter
    };

    const cancelFilter = () => {
        setExpand(-1); // close the filter
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["amount-wrapper"]}>
                    <span style={{ fontWeight: 500 }}>Khoảng giá:</span> {formatPrice(min)} - {formatPrice(max)}
                </div>
                <div ref={sliderRef} className={styles["slider"]}>
                    <div style={{ left: "0px" }} ref={leftKnobRef} className={styles["slider-left-knob"]}></div>
                    <div style={{ left: "90%" }} ref={rightKnobRef} className={styles["slider-right-knob"]}></div>
                </div>
                <div className={styles["action-container"]}>
                    <button
                        className={styles["apply-button"]}
                        onClick={() => {
                            applyPriceFilter();
                        }}
                    >
                        Áp dụng
                    </button>
                    <button
                        className={styles["cancel-button"]}
                        onClick={() => {
                            cancelFilter();
                        }}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </>
    );
};

export default PriceSlider;
