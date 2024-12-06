import React, { useEffect, useState } from "react";
import styles from "./AdminSidebarNav.module.css";
import IcPromotion from "../assets/ic_promotion.jsx";
import IcVoucher from "../assets/ic_voucher.jsx";
import IcOrder from "../assets/ic_order.jsx";
import IcSupport from "../assets/ic_support.jsx";
import IcReport from "../assets/ic_report.jsx";
import IcProduct from "../assets/ic_product.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slicers/appSlicer.js";
import IcHome from "../assets/ic_home.jsx";

const adminNavs = {
    promotions: 0,
    vouchers: 1,
    products: 2,
    orders: 3,
    reports: 4,
    "customer-supports": 5,
};

const AdminSidebarNav = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [selectedNav, setSelectedNav] = useState(-1);

    useEffect(() => {
        function setSelectedNavButton() {
            let currentPath = location.pathname;
            if (currentPath.includes("/products")) {
            } else if (currentPath.includes("/vouchers")) {
            } else if (currentPath.includes("/promotions")) {
            } else if (currentPath.includes("/orders")) {
            } else if (currentPath.includes("/reports")) {
            }
        }
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const navigate = useNavigate();
    const { expand, setExpand } = props;
    function navigateToSubsection(e, srcPath) {
        setSelectedNav(adminNavs[srcPath]);
        const link = e.target.dataset.link;
        navigate(link);
    }

    return (
        <>
            <div className={`${styles["container"]} ${expand ? styles["expand"] : ""}`}>
                <div className={styles["header"]}>
                    {expand ? <h2>Đóm Store</h2> : ""}
                    <IoIosArrowBack
                        className={styles["toggle-icon"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpand(!expand);
                        }}
                    />
                </div>
                <div className={styles["divider"]}></div>
                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["promotions"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/promotions"}
                    onClick={(e) => {
                        navigateToSubsection(e, "promotions");
                    }}
                >
                    <IcPromotion className={styles["nav-icon"]} />
                    {expand ? <span>Quản lý khuyến mãi</span> : ""}
                </div>
                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["vouchers"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/vouchers"}
                    onClick={(e) => {
                        navigateToSubsection(e, "vouchers");
                    }}
                >
                    <IcVoucher className={styles["nav-icon"]} />
                    {expand ? <span>Quản lý voucher</span> : ""}
                </div>
                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["products"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/products"}
                    onClick={(e) => {
                        navigateToSubsection(e, "products");
                    }}
                >
                    <IcProduct className={styles["nav-icon"]} />
                    {expand ? <span>Quản lý sản phẩm</span> : ""}
                </div>
                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["orders"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/orders"}
                    onClick={(e) => {
                        navigateToSubsection(e, "orders");
                    }}
                >
                    <IcOrder className={styles["nav-icon"]} />
                    {expand ? <span>Quản lý đơn hàng</span> : ""}
                </div>

                <div className={styles["divider"]}></div>

                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["reports"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/reports"}
                    onClick={(e) => {
                        navigateToSubsection(e, "reports");
                    }}
                >
                    <IcReport className={styles["nav-icon"]} />
                    {expand ? <span>Báo cáo</span> : ""}
                </div>
                <div
                    className={`${styles["nav-item-container"]} ${
                        adminNavs["customer-supports"] === selectedNav ? styles["selected"] : ""
                    }`}
                    data-link={"/admin/customer-supports"}
                    onClick={(e) => {
                        navigateToSubsection(e, "customer-supports");
                    }}
                >
                    <IcSupport className={styles["nav-icon"]} />
                    {expand ? <span>Hỗ trợ khách hàng</span> : ""}
                </div>
                <div className={styles["divider"]}></div>
                <div
                    className={styles["nav-item-container"]}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <IcHome className={styles["nav-icon"]} />
                    {expand ? <span>Quay về màn hình chính</span> : ""}
                </div>
                <div
                    className={styles["nav-item-container"]}
                    onClick={(e) => {
                        handleLogout();
                    }}
                >
                    <BsFillDoorOpenFill className={styles["nav-icon"]} />
                    {expand ? <span>Đăng xuất</span> : ""}
                </div>
            </div>
        </>
    );
};

export default AdminSidebarNav;
