import { useState } from "react";

const UserInfo = ({ userInfo, updateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(userInfo.name);
    const [editedAddress, setEditedAddress] = useState(userInfo.address);

    const handleSave = () => {
        updateUser({ name: editedName, address: editedAddress });
        setIsEditing(false);
    };

    return (
        <div className="hidden sm:block flex-1 bg-white border border-gray-200 p-6 mb-4 sm:mb-0 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Thông tin tài khoản
            </h3>
            <div className="sm:flex gap-6">
                <div className="flex-1">
                    <label className="text-gray-600 font-medium">Họ và tên</label>
                    <div className="mt-2 mb-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:border-blue-400"
                            />
                        ) : (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                                {userInfo.name}
                            </div>
                        )}
                    </div>
                    <label className="text-gray-600 font-medium">Địa chỉ email</label>
                    <div className="mt-2 mb-4 bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                        {userInfo.email}
                    </div>
                    <label className="text-gray-600 font-medium">Địa chỉ</label>
                    <div className="mt-2 mb-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedAddress}
                                onChange={(e) => setEditedAddress(e.target.value)}
                                className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:border-blue-400"
                            />
                        ) : (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                                {userInfo.address}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-gray-600 font-medium">ID người dùng</label>
                    <div className="mt-2 mb-4 bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                        {userInfo._id}
                    </div>
                    <label className="text-gray-600 font-medium">Role</label>
                    <div className="mt-2 mb-4 bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                        {userInfo.role}
                    </div>
                    <label className="text-gray-600 font-medium">Thời gian tham gia</label>
                    <div className="mt-2 mb-4 bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                        {new Date(userInfo.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition duration-200"
                    >
                        Lưu
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition duration-200"
                    >
                        Sửa thông tin
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
