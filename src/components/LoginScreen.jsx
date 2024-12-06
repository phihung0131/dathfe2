import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MilkRetailImage from "../assets/Milk-Retail Design.jpg";
import Sneaker from "../assets/snapedit_1728645326495.png";
import { setToken } from "../slicers/appSlicer";
import { useNavigate } from "react-router-dom";
import PasswordForgottenForm from "./PasswordForgottenForm";

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await fetch(
                "https://domstore.azurewebsites.net/api/v1/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                },
            );
    
            const tokenFromUrl = new URL(response.url).searchParams.get("token");
            if (tokenFromUrl) {
                const userResponse = await fetch("https://domstore.azurewebsites.net/api/v1/users/profile", {
                    headers: {
                        Authorization: `Bearer ${tokenFromUrl}`,
                    },
                });
                const userData = await userResponse.json();
                if (userData.status === "success") {
                    const { username, role } = userData.data.user;
                    dispatch(setToken({ token: tokenFromUrl, username, role }));
                    toast.success("Đăng nhập thành công!", {
                        autoClose: 3000,
                    });
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    toast.error("Không thể lấy thông tin người dùng.");
                }
            } else {
                toast.error("Token không tồn tại. Đăng nhập thất bại.");
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
    };
    
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("authToken");
        const usernameFromStorage = localStorage.getItem("username");
        if (tokenFromStorage && usernameFromStorage) {
            dispatch(
                setToken({
                    token: tokenFromStorage,
                    username: usernameFromStorage,
                }),
            );
            navigate("/");
        }
    }, [dispatch, navigate]);
    const handleGoogleLogin = async () => {
        window.location.href =
            "https://domstore.azurewebsites.net/api/v1/auth/google";
    };

    const handleFacebookLogin = () => {
        window.location.href =
            "https://domstore.azurewebsites.net/api/v1/auth/facebook";
    };

    
    
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <ToastContainer />
            <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center">
                <div className="w-full max-w-md px-4">
                    <div className="flex items-start justify-start mb-20 mt-5">
                        <img src={Sneaker} alt="Logo" className="h-10 mr-2" />
                        <h2 className="text-xl text-[#1b2834] font-Questrial font-semibold">
                            DomStore
                        </h2>
                    </div>

                    <div className="flex items-center justify-start mb-6">
                        <h2 className="text-2xl text-[#1b2834] font-Questrial font-semibold">
                            Đăng nhập tài khoản
                        </h2>
                    </div>

                    <form>
                    <div className="mb-4">
    <label
        className="block text-[#1b2834] text-sm font-bold mb-2 text-left font-Questrial"
        htmlFor="username"
    >
        Tên đăng nhập
    </label>
    <input
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#1b2834] leading-tight focus:outline-none focus:shadow-outline font-Questrial focus:border-gray-500"
        id="username"
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />
</div>


                        <div className="mb-4">
                            <label
                                className="block text-[#1b2834] text-sm font-bold mb-2 text-left font-Questrial"
                                htmlFor="password"
                            >
                                Mật khẩu
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#1b2834] leading-tight focus:outline-none focus:shadow-outline font-Questrial focus:border-gray-500"
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="text-right mt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForgotPassword(
                                            !showForgotPassword,
                                        )
                                    }
                                    className="text-sm text-gray-500 hover:text-[#1b2834] transition duration-300 font-Questrial font-bold"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={login}
                                className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-900 transition duration-300 focus:outline-none focus:shadow-outline font-Questrial"
                                type="button"
                            >
                                ĐĂNG NHẬP
                            </button>
                        </div>
                    </form>

                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            showForgotPassword ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                        <PasswordForgottenForm />
                    </div>

                    <div className="text-center font-Questrial mt-4">
                        <p className="text-sm text-gray-500">
                            Bạn chưa có tài khoản?{" "}
                            <a
                                href="/register"
                                className="text-[#1b2834] hover:text-blue-800 transition duration-300 font-Questrial font-bold"
                            >
                                Đăng ký
                            </a>
                        </p>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={handleFacebookLogin}
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg mb-5 hover:bg-blue-700 transition duration-300 focus:outline-none focus:shadow-outline font-Questrial"
                        >
                            Đăng nhập bằng Facebook
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg mb-20 hover:bg-red-700 transition duration-300 focus:outline-none focus:shadow-outline font-Questrial"
                        >
                            Đăng nhập bằng Google
                        </button>
                    </div>

                    <div className="text-center font-Questrial mt-4 mb-6">
                        <p className="text-sm text-gray-500">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#1b2834] transition duration-300"
                            >
                                Điều khoản & Điều kiện
                            </a>{" "}
                            |{" "}
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#1b2834] transition duration-300"
                            >
                                Chính sách bảo mật
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full">
                <img
                    className="h-full w-full object-cover"
                    src={MilkRetailImage}
                    alt="Side Image"
                />
            </div>
        </div>
    );
};

export default LoginScreen;