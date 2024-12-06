import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaShoppingCart,
    FaChartLine,
    FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const OrderSummaryOverview = () => {
    const [orderSummary, setOrderSummary] = useState({
        totalOrders: 0,
        overallAverageValue: 0,
        failureCount: 0,
        failureAverageValue: 0,
        orderSuccessCount: 0,
        orderSuccessAverageValue: 0,
        successCount: 0,
        successAverageValue: 0,
    });

    const fetchOrderSummary = async () => {
        try {
            const response = await axios.get(
                "https://domstore.azurewebsites.net/api/v1/reports/orders/summary",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                const data = response.data.data.ordersSumary;
                const failureData = data.statusBreakdown.find(
                    (item) => item._id === "Failure",
                );
                const orderSuccessData = data.statusBreakdown.find(
                    (item) => item._id === "Order successful",
                );
                const successData = data.statusBreakdown.find(
                    (item) => item._id === "Success",
                );

                setOrderSummary({
                    totalOrders: data.totalOrders,
                    overallAverageValue: data.overallAverageValue,
                    failureCount: failureData ? failureData.count : 0,
                    failureAverageValue: failureData
                        ? failureData.averageValue
                        : 0,
                    orderSuccessCount: orderSuccessData
                        ? orderSuccessData.count
                        : 0,
                    orderSuccessAverageValue: orderSuccessData
                        ? orderSuccessData.averageValue
                        : 0,
                    successCount: successData ? successData.count : 0,
                    successAverageValue: successData
                        ? successData.averageValue
                        : 0,
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            toast.error(
                "Lỗi khi lấy dữ liệu tổng hợp đơn hàng: " + error.message,
            );
        }
    };

    useEffect(() => {
        fetchOrderSummary();
    }, []);

    return (
        <header className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mb-4">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-indigo-500 hover:to-blue-500">
                <div>
                    <p className="text-sm font-semibold">Tổng số đơn hàng</p>
                    <p className="text-2xl font-bold">{orderSummary.totalOrders}</p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaShoppingCart size={30} className="text-white" />
                </div>
            </div>
    
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-emerald-500 hover:to-green-500">
                <div>
                    <p className="text-sm font-semibold">Giá trị đơn trung bình</p>
                    <p className="text-2xl font-bold">
                        {orderSummary.overallAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaChartLine size={30} className="text-white" />
                </div>
            </div>
    
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-orange-500 hover:to-red-500">
                <div>
                    <p className="text-sm font-semibold">Đơn hàng thất bại</p>
                    <p className="text-2xl font-bold">{orderSummary.failureCount}</p>
                    <p className="text-sm">
                        Giá trị TB: {orderSummary.failureAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaExclamationTriangle size={30} className="text-white" />
                </div>
            </div>
    
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-orange-500 hover:to-yellow-500">
                <div>
                    <p className="text-sm font-semibold">Đặt hàng thành công</p>
                    <p className="text-2xl font-bold">{orderSummary.orderSuccessCount}</p>
                    <p className="text-sm">
                        Giá trị TB: {orderSummary.orderSuccessAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaChartLine size={30} className="text-white" />
                </div>
            </div>
    
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl shadow-lg text-white transition duration-300 hover:from-green-500 hover:to-teal-500">
                <div>
                    <p className="text-sm font-semibold">Giao hàng thành công</p>
                    <p className="text-2xl font-bold">{orderSummary.successCount}</p>
                    <p className="text-sm">
                        Giá trị TB: {orderSummary.successAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-16 h-16 flex justify-center items-center bg-white bg-opacity-20 rounded-full">
                    <FaChartLine size={30} className="text-white" />
                </div>
            </div>
        </header>
    );
    
};

export default OrderSummaryOverview;