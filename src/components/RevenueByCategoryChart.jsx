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

const RevenueByCategoryChart = ({ selectedDate }) => {
    const [data, setData] = useState([]);
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
                `https://domstore.azurewebsites.net/api/v1/reports/revenue-by-category/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                setData(response.data.data.revenueByCategory);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const message = "Lỗi khi lấy dữ liệu báo cáo: " + error.message;
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Báo cáo doanh thu theo danh mục</h2>
        {loading ? (
            <p className="text-center text-gray-500">Đang tải...</p>
        ) : (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc" }} 
                        labelStyle={{ color: "#333" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar
                        dataKey="totalRevenue"
                        name="Doanh thu"
                        fill="#4CAF50"
                    />
                </BarChart>
            </ResponsiveContainer>
        )}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <ToastContainer />
    </div>
);

};

export default RevenueByCategoryChart;
