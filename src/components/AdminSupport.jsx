import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import axios from "axios";
import { getAuthConfig } from "../utils/axiosConfig";
import SupportTicket from "./SupportTicketPopup";
const apiURL = import.meta.env.VITE_API_URL;

const AdminSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ticketDetail, setTicketDetail] = useState({ isOpen: false, ticket: null });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        sort: "",
    });

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const authConfig = getAuthConfig();
            if (!authConfig.headers.Authorization) {
                setIsAuthenticated(false);
                toast.error("Please login to continue");
                setError("Authentication required");
                return;
            }

            const queryParams = new URLSearchParams({
                ...(filters.status && { status: filters.status }),
                ...(filters.sort && { sort: filters.sort }),
            }).toString();

            const response = await axios.get(`${apiURL}/admin/support-tickets?${queryParams.toString()}`, authConfig);
            if (response.status === 401) {
                setIsAuthenticated(false);
                localStorage.removeItem("authToken");
                toast.error("Session expired. Please login again.");
                setError("Session expired");
                return;
            }

            // Ensure orders is always an array
            //   console.log(response.data);
            const data = response.data;
            //   console.log(ordersData);

            setTickets(data.data);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
            // Set empty array in case of error
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const respondToTicket = async (response) => {
        try {
            const authConfig = getAuthConfig();
            if (!authConfig.headers.Authorization) {
                setIsAuthenticated(false);
                toast.error("Đăng nhập để tiếp tục");
                return;
            }

            const res = await axios.put(
                `${apiURL}/admin/support-tickets/${ticketDetail.ticket._id}`,
                { respond: response },
                authConfig
            );

            if (res.status === 401) {
                setIsAuthenticated(false);
                localStorage.removeItem("authToken");
                toast.error("Session expired. Please login again.");
                return;
            }

            toast.success("Trả lời hỗ trợ thành công!");
            fetchTickets();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setTicketDetail({ isOpen: false, ticket: null });
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTickets();
        }
    }, [filters, isAuthenticated]);

    const handleSearch = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    // Error Boundary Component
    const ErrorFallback = ({ error, resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={resetErrorBoundary}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <p className="text-red-600 text-lg">Vui lòng đăng nhập để sử dụng chức năng này</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="font-bold text-3xl self-center mb-4">Hỗ trợ khách hàng</h2>
                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm đơn hàng..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={filters.search}
                                onChange={handleSearch}
                            />
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        </div> */}

                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">Đang chờ</option>
                            <option value="update">Đang cập nhật</option>
                            <option value="finish">Đã hoàn thành</option>
                        </select>

                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Tất cả</option>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>

                        {/* <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        /> */}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    /* Orders Table */
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã yêu cầu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày yêu cầu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày cập nhật
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chủ đề
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets && tickets.length > 0 ? (
                                        tickets.map((ticket) => (
                                            <tr key={ticket._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{ticket._id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(ticket.createdAt), "dd/MM/yyyy")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(ticket.updatedAt), "dd/MM/yyyy")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ticket.customer.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ticket.subject}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                              ticket.status === "finish"
                                  ? "bg-green-100 text-green-800"
                                  : ticket.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ticket.status === "update"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                          }
                        `}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-4 py-4 whitespace-nowrap text-xs cursor-pointer hover:text-blue-600 hover:underline"
                                                    onClick={(e) => {
                                                        setTicketDetail({ isOpen: true, ticket: ticket });
                                                    }}
                                                >
                                                    Chi tiết
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                Không có đơn hỗ trợ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="flex items-center px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                    >
                        <FiChevronLeft className="mr-2" />
                        Trước
                    </button>

                    <span className="text-gray-600">Trang {filters.page}</span>

                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={tickets.length === 0 || tickets.length < filters.limit}
                        className="flex items-center px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                    >
                        Tiếp
                        <FiChevronRight className="ml-2" />
                    </button>
                </div>
            </div>
            <SupportTicket
                ticketDetail={ticketDetail}
                setTicketDetail={setTicketDetail}
                respondToTicket={respondToTicket}
            />
        </>
    );
};

export default AdminSupport;
