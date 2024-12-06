import { FiAlertCircle } from "react-icons/fi";
const DeleteModal = (props) => {
    const { action, message, handleDelete, handleModalVisibility } = props;

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <FiAlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">{action || "No action"}</h3>
                        <div className="mt-2 px-7 py-3">
                            <p className="text-sm text-gray-500">{message || "No action"}</p>
                        </div>
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                onClick={() => handleDelete()}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={() => handleModalVisibility(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteModal;
