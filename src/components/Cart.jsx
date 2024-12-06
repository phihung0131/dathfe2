import React, { useState, useEffect } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        codeVoucher: "",
    });
    const [selectedPayment, setSelectedPayment] = useState("COD");
    const [errors, setErrors] = useState({});
    const [total, setTotal] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để xem giỏ hàng");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("https://domstore.azurewebsites.net/api/v1/carts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = response.data;

            // Add unique identifier for each cart item if not present
            const cartItemsWithIds = data.cart.productInfo.map((item, index) => ({
                ...item,
                uniqueId: item.cartProductId || `cart-item-${index}`,
            }));

            setCartItems(cartItemsWithIds);
            setTotal(data.cart.total);
            setLoading(false);
        } catch (error) {
            handleApiError(error, "Không thể tải giỏ hàng");
            setLoading(false);
        }
    };

    const handleApiError = (error, defaultMessage) => {
        if (error.response?.status === 404) {
            toast.error("Không tìm thấy API. Vui lòng kiểm tra cấu hình máy chủ.");
        } else if (error.response?.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
            localStorage.removeItem("authToken");
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(defaultMessage);
        }
        console.error("Lỗi API:", error);
    };

    const updateQuantity = async (uniqueId, newQuantity) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để cập nhật giỏ hàng");
            return;
        }

        const item = cartItems.find((item) => item.uniqueId === uniqueId);
        if (!item) {
            toast.error("Không tìm thấy sản phẩm");
            return;
        }

        try {
            await axios.put(
                "https://domstore.azurewebsites.net/api/v1/carts",
                {
                    cartProductId: item.cartProductId,
                    quantity: newQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchCartItems();
            toast.success("Cập nhật giỏ hàng thành công");
        } catch (error) {
            handleApiError(error, "Không thể cập nhật số lượng");
        }
    };

    const removeItem = async (uniqueId) => {
        if (isDeleting) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để xóa sản phẩm");
            return;
        }

        const item = cartItems.find((item) => item.uniqueId === uniqueId);
        if (!item) {
            toast.error("Không tìm thấy sản phẩm");
            return;
        }

        try {
            setIsDeleting(true);
            await axios.delete("https://domstore.azurewebsites.net/api/v1/carts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { cartProductId: item.cartProductId },
            });

            setCartItems((prevItems) => {
                const updatedItems = prevItems.filter((item) => item.uniqueId !== uniqueId);
                const newTotal = updatedItems.reduce(
                    (sum, item) => sum + (item.promotionalPrice || item.price) * item.quantity,
                    0
                );
                setTotal(newTotal);
                return updatedItems;
            });

            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
            await fetchCartItems();
        } catch (error) {
            handleApiError(error, "Không thể xóa sản phẩm");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOrder = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để đặt hàng");
            return;
        }

        try {
            setAddingToCart(true);
            const orderData = {
                products: cartItems.map((item) => ({
                    id: item.product_id || item.uniqueId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                })),
                codeVoucher: customerInfo.codeVoucher || "",
                paymentMethod: selectedPayment,
                name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
            };

            console.log("Sending order data:", orderData);

            const response = await axios.post("https://domstore.azurewebsites.net/api/v1/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Chuyển thành JSON
                },
            });

            const data = response.data;
            if (response.status === 200 || response.status === 201) {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
                toast.success("Đặt hàng thành công!");
                setCartItems([]);
                setTotal(0);
                setCustomerInfo({ name: "", phone: "", address: "", codeVoucher: "" });
                console.log(data.data.order);

                if (data.data.order.payment.method === "MOMO" || data.data.order.payment.method === "ZALO") {
                    console.log("here");
                    window.location.href = data.data.order.payment.paymentUrl;
                }
            }
        } catch (error) {
            console.log(error.response?.data); // In chi tiết lỗi
            handleApiError(error, "Không thể đặt hàng");
        } finally {
            setAddingToCart(false);
        }
    };

    // Rest of the component remains the same...
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!customerInfo.name) newErrors.name = "Vui lòng nhập họ tên";
        if (!customerInfo.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (!customerInfo.address) newErrors.address = "Vui lòng nhập địa chỉ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {showPopup && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-down">
                    Thêm vào giỏ hàng thành công!
                </div>
            )}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ Hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow text-center">
                                <p className="text-gray-500">Giỏ hàng trống</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                {cartItems.map((item) => (
                                    <div key={item.uniqueId} className="p-6 border-b border-gray-200">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.imageUrl[0]}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f";
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500">Màu sắc: {item.color}</p>
                                                <p className="text-gray-500">Kích thước: {item.size}</p>
                                                <p className="text-gray-500">ID: {item.uniqueId}</p>
                                                <p className="text-gray-900 font-semibold">
                                                    {item.promotionalPrice ? (
                                                        <>
                                                            <span className="line-through text-gray-500 mr-2">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                            {formatPrice(item.promotionalPrice)}
                                                        </>
                                                    ) : (
                                                        formatPrice(item.price)
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.uniqueId,
                                                                Math.max(1, item.quantity - 1)
                                                            )
                                                        }
                                                        className="p-2 hover:bg-gray-100"
                                                        disabled={addingToCart || isDeleting}
                                                    >
                                                        <FiMinus />
                                                    </button>
                                                    <span className="px-4">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100"
                                                        disabled={addingToCart || isDeleting}
                                                    >
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.uniqueId)}
                                                    className={`text-red-500 hover:text-red-700 ${
                                                        isDeleting ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                                    disabled={isDeleting}
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-6 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Tổng tiền:</span>
                                        <span className="text-xl font-bold text-blue-600">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            <h2 className="text-xl font-semibold">Thông Tin Đặt Hàng</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phương thức thanh toán
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {[
                                            { id: "COD", label: "Thanh toán khi nhận hàng" },
                                            { id: "MOMO", label: "Ví MoMo" },
                                            { id: "ZALO", label: "ZaloPay" },
                                        ].map((method) => (
                                            <div key={method.id} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={method.id}
                                                    name="payment"
                                                    value={method.id}
                                                    checked={selectedPayment === method.id}
                                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor={method.id} className="ml-2 block text-sm text-gray-700">
                                                    {method.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={customerInfo.name}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full rounded-md pd p-1 shadow-sm ${
                                                errors.name ? "border-red-500" : "border-gray-300"
                                            } focus:border-blue-500 focus:ring-blue-500`}
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={customerInfo.phone}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full rounded-md p-1 shadow-sm ${
                                                errors.phone ? "border-red-500" : "border-gray-300"
                                            } focus:border-blue-500 focus:ring-blue-500`}
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Địa chỉ giao hàng
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={customerInfo.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className={`mt-1 p-1 block w-full rounded-md shadow-sm ${
                                                errors.address ? "border-red-500" : "border-gray-300"
                                            } focus:border-blue-500 focus:ring-blue-500`}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="codeVoucher"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Mã giảm giá
                                        </label>
                                        <input
                                            type="text"
                                            id="codeVoucher"
                                            name="codeVoucher"
                                            value={customerInfo.codeVoucher}
                                            onChange={handleInputChange}
                                            className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleOrder}
                                    disabled={cartItems.length === 0 || addingToCart || isDeleting}
                                    className="w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {addingToCart ? "Đang xử lý..." : "Đặt hàng"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ShoppingCart;
