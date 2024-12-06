import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../slicers/appSlicer";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(
                    "https://domstore.azurewebsites.net/api/v1/users/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    },
                );
                const data = await response.json();
                if (data.status === "success") {
                    setUserInfo(data.data.user);
                    dispatch(
                        setToken({
                            token: localStorage.getItem("authToken"),
                            username: data.data.user.username,
                            role: data.data.user.role,
                        }),
                    );
                } else {
                    setErrorMessage("Lỗi khi tải thông tin cá nhân.");
                }
            } catch (error) {
                setErrorMessage("Không thể kết nối đến máy chủ.");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserInfo();
    }, []);
    const updateUser = async (updatedInfo) => {
        try {
            const response = await fetch(
                "https://domstore.azurewebsites.net/api/v1/users/profile",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedInfo),
                },
            );

            const data = await response.json();
            if (data.status === "success") {
                toast.success("Cập nhật thông tin thành công!");
                setUserInfo(data.data.user);
            } else {
                toast.error("Cập nhật thông tin thất bại.");
            }
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ.");
        }
    };
    return (
        <div className="p-3 sm:p-8 pt-0 text-[#444444]">
            <div className="flex flex-col gap-12 sm:grid sm:grid-cols-2">
                {loadingUser ? (
                    <p>Loading...</p>
                ) : errorMessage ? (
                    <p>{errorMessage}</p>
                ) : (
                    <UserInfo userInfo={userInfo} updateUser={updateUser} />
                )}
                <ChangePassword userInfo={userInfo} />
            </div>
            <ToastContainer />
        </div>
    );
    
};

export default Profile;
