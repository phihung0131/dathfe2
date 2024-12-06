import { useState } from "react";
import { toast } from "react-toastify";

const PasswordForgottenForm = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://domstore.azurewebsites.net/api/v1/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username }),
                }
            );

            const result = await response.json();
            console.log("Response:", result);

            if (result.status === "success") {
                toast.success("Yêu cầu đặt lại mật khẩu đã được gửi!", {
                    autoClose: 3000,
                });
            } else {
                toast.error("Không tìm thấy người dùng.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-4">
            <div className="mb-2">
                <p className="font-bold">Nhập username của bạn bên dưới.</p>
                <p>Chúng tôi sẽ gửi cho bạn một email để đặt lại mật khẩu.</p>
            </div>
            <div className="flex flex-col">
                <input
                    className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    name="username"
                    placeholder="Username của bạn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={handleForgotPassword}
                    className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-900 transition duration-300 focus:outline-none focus:shadow-outline"
                    type="button"
                    disabled={loading}
                >
                    {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
                </button>
            </div>
        </div>
    );
};

export default PasswordForgottenForm;
