import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaDollarSign, FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const BusinessOverview = ({ selectedDate }) => {
    const [businessData, setBusinessData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
    });

    const fetchBusinessOverview = async (date) => {
        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/business-overview/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                setBusinessData(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(
                "Lỗi khi lấy dữ liệu tổng quan kinh doanh: " + error.message,
            );
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchBusinessOverview(selectedDate);
        }
    }, [selectedDate]);

    return (
        <header className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-4">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-indigo-500 hover:to-blue-500">
                <div>
                    <p className="text-sm font-semibold">Tổng số người dùng</p>
                    <p className="text-2xl font-bold">{businessData.totalCustomers}</p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaUser size={30} className="text-white" />
                </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-green-500 hover:to-teal-500">
                <div>
                    <p className="text-sm font-semibold">Tổng doanh thu</p>
                    <p className="text-2xl font-bold">{businessData.totalRevenue} VNĐ</p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaDollarSign size={30} className="text-white" />
                </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-orange-500 hover:to-red-500">
                <div>
                    <p className="text-sm font-semibold">Tổng số đơn hàng</p>
                    <p className="text-2xl font-bold">{businessData.totalOrders}</p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaFileAlt size={30} className="text-white" />
                </div>
            </div>
        </header>
    );
    
};

export default BusinessOverview;
