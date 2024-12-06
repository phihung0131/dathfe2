import React, { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiEye, FiPlusCircle, FiRotateCcw } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import axios from "axios";

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        discountPercent: "",
        expirationDate: "",
        quantity: "",
    });

    const API_BASE_URL = "https://domstore.azurewebsites.net/api/v1";

    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log("Unauthorized access - redirecting to login");
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/vouchers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setVouchers(response.data.data.vouchers);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            if (error.response?.status === 401) {
                setVouchers([]);
            }
        }
    };

    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/vouchers`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            await fetchVouchers();
            setIsCreateModalOpen(false);
            setFormData({ code: "", discountPercent: "", expirationDate: "", quantity: "" });
        } catch (error) {
            console.error("Error creating voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditVoucher = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/vouchers/${selectedVoucher._id}`,
                {
                    discountPercent: formData.discountPercent,
                    expirationDate: formData.expirationDate,
                    quantity: formData.quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            await fetchVouchers();
            setIsEditModalOpen(false);
            setSelectedVoucher(null);
        } catch (error) {
            console.error("Error updating voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVoucher = async () => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/vouchers/${selectedVoucher._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            await fetchVouchers();
            setIsDeleteModalOpen(false);
            setSelectedVoucher(null);
        } catch (error) {
            console.error("Error deleting voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateExpired = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${API_BASE_URL}/vouchers/deactivate-expired`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            await fetchVouchers();
        } catch (error) {
            console.error("Error deactivating expired vouchers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVoucherStats = async (voucherId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/vouchers/${voucherId}/stats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setStats(response.data.data);
        } catch (error) {
            console.error("Error fetching voucher stats:", error);
        }
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Quản lý Voucher </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                    >
                        <FiPlusCircle /> Tạo Voucher
                    </button>
                    <button
                        onClick={handleDeactivateExpired}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
                    >
                        <FiRotateCcw /> Vô hiệu hóa hết hạn
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã Voucher
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giảm giá (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày hết hạn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vouchers.map((voucher) => (
                            <tr key={voucher._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{voucher.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{voucher.discountPercent}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(voucher.expirationDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{voucher.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                setIsViewModalOpen(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                setFormData({
                                                    ...voucher,
                                                    expirationDate: new Date(voucher.expirationDate)
                                                        .toISOString()
                                                        .split("T")[0],
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                fetchVoucherStats(voucher._id);
                                                setIsStatsModalOpen(true);
                                            }}
                                            className="text-purple-500 hover:text-purple-700"
                                        >
                                            <BsGraphUp />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Tạo Voucher Mới</h2>
                        <form onSubmit={handleCreateVoucher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giảm Giá (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày Hết Hạn</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.expirationDate}
                                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số Lượng</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {loading ? "Đang Tạo..." : "Tạo Voucher"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Tạo Voucher Mới</h2>
                        <form onSubmit={handleCreateVoucher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giảm Giá (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày Hết Hạn</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.expirationDate}
                                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số Lượng</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {loading ? "Đang Tạo..." : "Tạo Voucher"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Sửa Voucher</h2>
                        <form onSubmit={handleEditVoucher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giảm giá (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.expirationDate}
                                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
                            >
                                {loading ? "Đang cập nhật..." : "Cập nhật Voucher"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Voucher">
                <div className="space-y-4">
                    <p>Bạn muốn xóa voucher?</p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteVoucher}
                            disabled={loading}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300"
                        >
                            {loading ? "Deleting..." : "Xóa"}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            {" "}
                            Hủy{" "}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Chi tiết">
                {selectedVoucher && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Mã Voucher</h3>
                            <p className="mt-1">{selectedVoucher.code}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Giảm giá</h3>
                            <p className="mt-1">{selectedVoucher.discountPercent}%</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Ngày hết hạn</h3>
                            <p className="mt-1">{new Date(selectedVoucher.expirationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Số lượng</h3>
                            <p className="mt-1">{selectedVoucher.quantity}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Ngày tạo</h3>
                            <p className="mt-1">{new Date(selectedVoucher.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} title="Thông kê Voucher">
                {stats && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700">Tổng số lượng </h3>
                                <p className="text-2xl font-bold text-blue-700">{stats.totalQuantity}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700">Đã sử dụng </h3>
                                <p className="text-2xl font-bold text-green-700">{stats.usedCount}</p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700">Số lượng còn lại</h3>
                                <p className="text-2xl font-bold text-purple-700">{stats.remainingCount}</p>
                            </div>
                            <div className="bg-orange-100 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700">Tỷ lệ sử dụng</h3>
                                <p className="text-2xl font-bold text-orange-700">
                                    {Math.round((stats.usedCount / stats.totalQuantity) * 100)}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VoucherManagement;
