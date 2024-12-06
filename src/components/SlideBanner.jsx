import React, { useEffect, useState } from "react";
import styles from "./SlideBanner.module.css";

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";

const bannerImgs = [banner1, banner2, banner3, banner4, banner5];

const SlideBanner = () => {
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const bannerTransInterval = setInterval(() => {
            setActiveIdx((state) => (state + 1) % bannerImgs.length);
        }, 5000);
        return () => {
            clearInterval(bannerTransInterval);
        };
    }, []);

    return (
        <>
            <div className={styles["container"]}>
                {bannerImgs.map((item, idx) => (
                    <div className={`${styles["banner-item"]} ${activeIdx === idx ? styles["active"] : ""}`}>
                        <img src={item} alt="Banner" />
                    </div>
                ))}
                <div className={styles["nav-container"]}>
                    {bannerImgs.map((item, idx) => (
                        <div
                            className={`${styles["nav-button"]} ${activeIdx === idx ? styles["active"] : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIdx(idx);
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SlideBanner;
