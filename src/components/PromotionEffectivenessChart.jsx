import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PromotionEffectivenessChart = ({ selectedDate }) => {
    const [data, setData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [showUsed, setShowUsed] = useState(false);
    const [showNotUsed, setShowNotUsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (selectedDate) {
            fetchData(selectedDate);
        }
    }, [selectedDate]);

    const fetchData = async (date) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/promotion-effectiveness/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                const apiData = response.data.data;
                setData([
                    {
                        name: "Tổng số KM",
                        value: apiData["Tong So Khuyen Mai "],
                    },
                    {
                        name: "Số KM được sử dụng",
                        value: apiData["So Khuyen mai duoc su dung"],
                    },
                    {
                        name: "Sản phẩm bán được có KM",
                        value: apiData["So san pham da ban duoc co khuyen mai"],
                    },
                ]);
                setDetailData(apiData["Chi tiet"]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const message =
                "Lỗi khi lấy dữ liệu hiệu quả khuyến mãi: " + error.message;
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const usedPromotions = detailData.filter(item => item.DuocSuDung);
    const notUsedPromotions = detailData.filter(item => !item.DuocSuDung);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Hiệu quả chương trình khuyến mãi</h2>
            {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis type="number" tick={{ fill: "#4B5563", fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "#4B5563", fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB" }} labelStyle={{ color: "#374151" }} />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Bar dataKey="value" fill="#60A5FA" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <button
                                className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600"
                                onClick={() => setShowUsed(!showUsed)}
                            >
                                Đã sử dụng
                            </button>
                            <div
                                className={`transition-all duration-500 ease-in-out transform ${
                                    showUsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                } overflow-hidden`}
                            >
                                <ul className="mt-3 space-y-3">
                                    {usedPromotions.map((item, index) => (
                                        <li key={index} className="p-3 border border-teal-300 bg-teal-50 rounded-md">
                                            <strong>{item.name}</strong> - Đã sử dụng
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <button
                                className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                                onClick={() => setShowNotUsed(!showNotUsed)}
                            >
                                Chưa sử dụng
                            </button>
                            <div
                                className={`transition-all duration-500 ease-in-out transform ${
                                    showNotUsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                } overflow-hidden`}
                            >
                                <ul className="mt-3 space-y-3">
                                    {notUsedPromotions.map((item, index) => (
                                        <li key={index} className="p-3 border border-red-300 bg-red-50 rounded-md">
                                            <strong>{item.name}</strong> - Chưa sử dụng
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <ToastContainer />
        </div>
    );
};

export default PromotionEffectivenessChart;
