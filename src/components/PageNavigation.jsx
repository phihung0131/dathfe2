import React from "react";
import styles from "./PageNavigation.module.css";
const PageNavigation = (props) => {
    // currentPage, maxPage, limit
    const { currentPage, setCurrentPage, maxPage } = props;

    const generateControlButton = () => {

        const pageButtonArr = [];
        let startingPoint = 1; // default is the first page
        if (currentPage === 1) {
        } else if (currentPage === maxPage) {
            startingPoint = maxPage - 2;
        } else {
            startingPoint = currentPage - 1;
        }
        startingPoint = Math.max(startingPoint, 1); // ensure the min is always 1
        for (let p = startingPoint; p <= Math.min(startingPoint + 2, maxPage); p++) {
            pageButtonArr.push(
                <div
                    className={`${styles["button"]} ${p === currentPage ? styles["active"] : ""}`}
                    onClick={() => handleTurnPage(p)}
                >
                    {p}
                </div>
            );
        }

        return (
            <>
                <div
                    className={`${styles["button"]} ${currentPage === 1 ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(1)}
                >
                    &lt;&lt;
                </div>
                <div
                    className={`${styles["button"]} ${currentPage === 1 ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(currentPage - 1)}
                >
                    &lt;
                </div>
                {pageButtonArr.map((button) => button)}
                <div
                    className={`${styles["button"]} ${currentPage === maxPage ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(currentPage + 1)}
                >
                    &gt;
                </div>
                <div
                    className={`${styles["button"]} ${currentPage === maxPage ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(maxPage)}
                >
                    &gt;&gt;
                </div>
            </>
        );
    };

    const handleTurnPage = (page) => {
        if (page !== currentPage && page > 0 && page <= maxPage) {
            setCurrentPage(page)
        }
    };

    return (
        <>
            <div className={styles["container"]}>{generateControlButton()}</div>
        </>
    );
};

export default PageNavigation;
