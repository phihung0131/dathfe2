import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiUser, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    codeVoucher: ""
  });
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchCartItems();
  }, []);

  const handleApiError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    toast.error(errorMessage);
    setError(errorMessage);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://domstore.azurewebsites.net/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data.orders);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem("authToken");
      } else {
        handleApiError(error, "Không thể tải đơn hàng");
      }
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem chi tiết đơn hàng");
      return;
    }

    try {
      const response = await axios.get(`https://domstore.azurewebsites.net/api/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedOrder(response.data.data.order);
      setShowModal(true);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem("authToken");
      } else {
        handleApiError(error, "Không thể tải chi tiết đơn hàng");
      }
    }
  };

  const fetchCartItems = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://domstore.azurewebsites.net/api/v1/carts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data } = response.data;
      const cartItemsWithIds = data.cart.productInfo.map((item, index) => ({
        ...item,
        uniqueId: item.cartProductId || `cart_item_${index}`
      }));
      setCartItems(cartItemsWithIds);
      setTotal(data.cart.total);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem("authToken");
      } else {
        handleApiError(error, "Không thể tải giỏ hàng");
      }
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("https://domstore.azurewebsites.net/api/v1/auth/refresh-token");
      const newToken = response.data.token;
      localStorage.setItem("authToken", newToken);
      return newToken;
    } catch (error) {
      throw new Error("Không thể làm mới token");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BiLoaderAlt className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Đơn Hàng Của Bạn</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Đơn hàng #{order._id.slice(-6)}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${order.status === "Order successful" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {order.status === "Order successful" ? "Đặt hàng thành công" : "Đang xử lý"}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">{formatPrice(order.totalPrice)}</p>
              <p className="text-gray-700">{order.name}</p>
              <p className="text-gray-600 text-sm">{order.totalProduct} sản phẩm</p>
              <p className="text-gray-600 text-sm flex items-center">
                <FiPhone className="mr-2" /> {order.phone}
              </p>
              <p className="text-gray-600 text-sm flex items-center">
                <FiMapPin className="mr-2" /> {order.address}
              </p>
            </div>
            <button
              onClick={() => fetchOrderDetails(order._id)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Xem chi tiết đơn hàng"
            >
              Xem Chi Tiết
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chi Tiết Đơn Hàng</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thông Tin Khách Hàng</h3>
                    <div className="space-y-2">
                      <p className="flex items-center"><FiUser className="mr-2" /> {selectedOrder.name}</p>
                      <p className="flex items-center"><FiPhone className="mr-2" /> {selectedOrder.phone}</p>
                      <p className="flex items-center"><FiMapPin className="mr-2" /> {selectedOrder.address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tổng Quan Đơn Hàng</h3>
                    <div className="space-y-2">
                      <p>Trạng thái: <span className="font-medium">{selectedOrder.status === "Order successful" ? "Đặt hàng thành công" : "Đang xử lý"}</span></p>
                      <p>Tổng tiền: <span className="font-medium">{formatPrice(selectedOrder.totalPrice)}</span></p>
                      <p>Ngày đặt: <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")}</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Sản Phẩm</h3>
                  <div className="space-y-4">
                    {selectedOrder.products?.map((product) => (
                      <div key={product._id} className="flex items-center space-x-4 border-b pb-4">
                        <img
                          src={product.productId.imageUrl}
                          alt={product.productId.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2NDY0MjY4Mjc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{product.productId.name}</h4>
                          <p className="text-sm text-gray-600">
                            {product.color}, Kích thước: {product.size}
                          </p>
                          <p className="text-sm">
                            {formatPrice(product.productId.price)} × {product.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderPage;