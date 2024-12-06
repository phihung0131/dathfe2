import styles from "./Header.module.css";
import dropMenuStyles from "./DropdownMenu.module.css";
import Logo from "../assets/logo.jsx";
import { LuUserCircle2 } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import DropdownMenu from "./DropdownMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slicers/appSlicer";
import { useEffect, useRef, useState } from "react";

// logo + name, navigation, cart

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const appStatus = useSelector((state) => state.appState);
    const userPopupRef = useRef(null);
    console.log(appStatus);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Hide popup when user click outside the menu
    const handleHidePopup = (e) => {
        if (!userPopupRef.current.contains(e.target)) {
            setUserMenuOpen(false);
            document.removeEventListener("mousedown", handleHidePopup);
        }
    };

    useEffect(() => {
        if (userMenuOpen) {
            document.addEventListener("mousedown", handleHidePopup);
            return () => {
                document.removeEventListener("mousedown", handleHidePopup);
            };
        } else {
            document.removeEventListener("mousedown", handleHidePopup);
        }
    }, [userMenuOpen]);

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["logo-container"]}>
                    <Link to={"/"}>
                        <Logo width={"220px"} />
                    </Link>
                </div>
                <nav className={styles["navigation-container"]}>
                    <div className={styles["nav-button-container"]}>
                        GIÀY NAM
                        <div className={styles["dropdown-menu-wrapper"]}>
                            <DropdownMenu parentNav={0} />
                        </div>
                    </div>
                    <div className={styles["nav-button-container"]}>
                        GIÀY NỮ
                        <div className={styles["dropdown-menu-wrapper"]}>
                            <DropdownMenu parentNav={1} />
                        </div>
                    </div>
                    <div className={styles["nav-button-container"]}>
                        TRẺ EM
                        <div className={styles["dropdown-menu-wrapper"]}>
                            <DropdownMenu parentNav={2} />
                        </div>
                    </div>
                </nav>
                <div className={styles["action-container"]}>
                    {appStatus?.role === "ADMIN" || appStatus?.role === "OWNER" ? (
                        <div
                            className={styles["link"]}
                            onClick={() => {
                                navigate("/admin");
                            }}
                        >
                            Vào trang quản lý
                        </div>
                    ) : (
                        ""
                    )}
                    {appStatus?.isLoggedIn ? (
                        <>
                            <div
                                className={styles["action-button"]}
                                onClick={handleLogout}
                                style={{ marginRight: "5px" }}
                            >
                                <IoMdLogOut className="text-lg" />
                            </div>
                            <div
                                className={styles["action-button"]}
                                ref={userPopupRef}
                                style={{ marginRight: "5px" }}
                                onClick={() => {
                                    setUserMenuOpen((state) => !state);
                                }}
                            >
                                <LuUserCircle2 className={styles["action-icon"]} />
                                <div className={`${styles["user-drop-menu"]} ${userMenuOpen ? styles["visible"] : ""}`}>
                                    <div className={styles["item"]} onClick={() => navigate("/profile")}>
                                        <span>Xem hồ sơ</span>
                                    </div>
                                    <div className={styles["item"]} onClick={() => {navigate("/my-orders")}}>
                                        <span>Đơn hàng đã đặt</span>
                                    </div>
                                    {appStatus?.role === "CUSTOMER" && (
                                        <div className={styles["item"]} onClick={() => navigate("/supports")}>
                                            <span>Hỗ trợ khách hàng</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mr-2.5">
                            <Link to="/login" className="text-black hover:underline">
                                Đăng nhập
                            </Link>
                        </div>
                    )}

                    <div
                        className={styles["action-button"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/cart");
                        }}
                    >
                        <FiShoppingCart className={styles["action-icon"]} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
