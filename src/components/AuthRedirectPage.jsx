import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../slicers/appSlicer"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthRedirectPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("authToken", token);

            const verifyToken = async (token) => {
                try {
                    const response = await fetch("https://domstore.azurewebsites.net/api/v1/users/profile", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === "success") {
                            const { username, role } = data.data.user;
                            dispatch(setToken({ token, username, role }));
                            toast.success("Đăng nhập thành công!", { autoClose: 3000 });
                            navigate("/"); 
                        } else {
                            toast.error("Token không hợp lệ.");
                            navigate("/login");
                        }
                    } else {
                        toast.error("Token không hợp lệ.");
                        navigate("/login");
                    }
                } catch (error) {
                    toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
                    navigate("/login");
                }
            };

            verifyToken(token);
        } else {
            toast.error("Token không tồn tại. Đăng nhập thất bại.");
            navigate("/login");
        }
    }, [dispatch, navigate]);

    return (
        <div className="h-screen flex items-center justify-center">
            <h2>Đang xử lý đăng nhập...</h2>
        </div>
    );
};

export default AuthRedirectPage;
