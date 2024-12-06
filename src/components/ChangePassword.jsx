import { useState } from "react";
import { toast } from "react-toastify";

const ChangePassword = ({ userInfo }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        "https://domstore.azurewebsites.net/api/v1/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Đổi mật khẩu thành công!");
      } else {
        toast.error(data.message || "Đã xảy ra lỗi không xác định.");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="hidden sm:flex flex-1 flex-col bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="text-gray-600 font-medium">Mật khẩu cũ</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu cũ"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-2 mb-4 border border-gray-300 px-4 py-2 rounded-lg focus:border-blue-400"
        />

        <label className="text-gray-600 font-medium">Mật khẩu mới</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 mb-4 border border-gray-300 px-4 py-2 rounded-lg focus:border-blue-400"
        />

        <label className="text-gray-600 font-medium">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 mb-4 border border-gray-300 px-4 py-2 rounded-lg focus:border-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 hover:shadow-lg rounded-lg text-white font-bold mt-4 py-2 transition duration-200"
        >
          Thay đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
