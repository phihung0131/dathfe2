import React from "react";
import styles from "./LoadingPopup.module.css"

const LoadingPopup = () => {
    return <>
        <div className={styles['background']}>
            <div className={styles['loader']}></div>
        </div>
    </>
}

export default LoadingPopup