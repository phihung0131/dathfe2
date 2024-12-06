import React, { useEffect, useRef, useState } from "react";
import styles from "./CollectionSection.module.css";
import ProductPreviewItem from "./ProductPreviewItem";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";

const CollectionSection = (props) => {
    const sliderRef = useRef(null);
    const { theme } = props;
    const [leftButton, setLeftButton] = useState(false);
    const [rightButton, setRightButton] = useState(false);
    const [products, setProducts] = useState([]);
    async function fetchData() {
        if (theme.dataPath) {
            try {
                const response = await axios.get(`${theme.dataPath}`);
                const data = response.data;
                console.log(data);

                setProducts(data.data.products);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("No datapath in ColletionSection");
        }
    }

    useEffect(() => {
        if (sliderRef.current) {
            const leftScroll = sliderRef.current.scrollLeft;
            const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            // console.log(leftScroll, maxScroll);

            if (leftScroll >= maxScroll) {
                setRightButton(false);
            } else {
                setRightButton(true);
            }
        }
    }, [products]);

    useEffect(() => {
        fetchData();
    }, []);

    const slide = (distance) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ top: 0, left: distance, behavior: "smooth" });
            const futureLeftScroll = sliderRef.current.scrollLeft + distance; // future position because smooth animation is asynchronous
            const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            if (futureLeftScroll <= 0) setLeftButton(false);
            else {
                setLeftButton(true);
            }
            if (futureLeftScroll >= maxScroll) {
                setRightButton(false);
            } else {
                setRightButton(true);
            }
        }
    };
    return (
        <>
            <div className={styles["container"]}>
                <h2 className={styles["collection-title"]}>{theme.title || "NULL"}</h2>
                {/* Or a banner representing the title */}
                <div className={styles["slider-wrapper"]}>
                    <div className={styles["product-slider-container"]} ref={sliderRef}>
                        {products.length > 0 &&
                            products.map((item) => <ProductPreviewItem product={item} isFixedSize={true} />)}
                    </div>
                    {leftButton && (
                        <div
                            className={styles["slider-left-button"]}
                            onClick={() => {
                                slide(-400);
                            }}
                        >
                            <IoIosArrowBack className={styles["icon"]} />
                        </div>
                    )}
                    {rightButton && (
                        <div
                            className={styles["slider-right-button"]}
                            onClick={() => {
                                slide(400);
                            }}
                        >
                            <IoIosArrowForward className={styles["icon"]} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CollectionSection;
