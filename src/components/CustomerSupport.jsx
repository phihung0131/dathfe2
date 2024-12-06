import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Table, Button, Tag, Modal, Input, Select } from "antd";

const apiURL = "https://domstore.azurewebsites.net/api/v1/customer/support-tickets";

const CustomerSupport = () => {
    const { Option } = Select;
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTicket, setNewTicket] = useState({
        subject: "",
        description: "",
    });
    const [editTicket, setEditTicket] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deleteTicketId, setDeleteTicketId] = useState(null);
    const [viewContent, setViewContent] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [feedbackTicket, setFeedbackTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        setPagination({ ...pagination, total: filteredTickets.length });
    }, [tickets, searchText, filterStatus]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.data.status === "success") {
                setTickets(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async () => {
        if (!newTicket.subject || !newTicket.description) {
            toast.error("Chủ đề và Mô tả không được để trống");
            return;
        }
        try {
            const response = await axios.post(apiURL, newTicket, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.data.status === "success") {
                setTickets([...tickets, response.data.data]);
                setNewTicket({ subject: "", description: "" });
                setIsCreating(false);
                toast.success("Tạo Support Ticket thành công");
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleEditClick = (ticket) => {
        setEditTicket(ticket);
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditTicket({ ...editTicket, [name]: value });
    };

    const saveEdit = async () => {
        if (!editTicket.subject || !editTicket.description) {
            toast.error("Chủ đề và Mô tả không được để trống");
            return;
        }
        try {
            const response = await axios.put(`${apiURL}/${editTicket._id}`, editTicket, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.data.status === "success") {
                setTickets(tickets.map((ticket) => (ticket._id === editTicket._id ? editTicket : ticket)));
                setIsEditing(false);
                setEditTicket(null);
                toast.success("Cập nhật Support Ticket thành công");
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const confirmDeleteTicket = (id) => {
        setDeleteTicketId(id);
    };

    const deleteTicket = async () => {
        try {
            await axios.delete(`${apiURL}/${deleteTicketId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setTickets(tickets.filter((ticket) => ticket._id !== deleteTicketId));
            setDeleteTicketId(null);
            toast.success("Xóa Support Ticket thành công");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleFeedback = (ticket) => {
        setFeedbackTicket(ticket);
    };

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.description.toLowerCase().includes(searchText.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchText.toLowerCase());

        const matchesFilter = filterStatus === "" || ticket.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "_id",
            key: "_id",
            width: 120,
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (text) => format(new Date(text), "dd/MM/yyyy"),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 150,
            render: (text) => format(new Date(text), "dd/MM/yyyy"),
        },
        {
            title: "Chủ đề",
            dataIndex: "subject",
            key: "subject",
            width: 200,
            render: (text) => (
                <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {text.length > 50 ? (
                        <>
                            {text.substring(0, 50)}...
                            <Button type="link" onClick={() => setViewContent(text)}>
                                Xem thêm
                            </Button>
                        </>
                    ) : (
                        text
                    )}
                </div>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            width: 300,
            render: (text) => (
                <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {text.length > 50 ? (
                        <>
                            {text.substring(0, 50)}...
                            <Button type="link" onClick={() => setViewContent(text)}>
                                Xem thêm
                            </Button>
                        </>
                    ) : (
                        text
                    )}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (status) => (
                <Tag color={status === "finish" ? "green" : "yellow"}>
                    {status === "finish" ? "Đã phản hồi" : status === "pending" ? "Đang chờ" : ""}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (record) => (
                <div className="flex gap-2">
                    {record.status === "finish" && (
                        <Button
                            onClick={() => handleFeedback(record)}
                            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                        >
                            Phản hồi
                        </Button>
                    )}
                    {record.status === "pending" && (
                        <>
                            <Button onClick={() => handleEditClick(record)} type="primary" icon={<FaRegEdit />} />
                            <Button
                                onClick={() => confirmDeleteTicket(record._id)}
                                type="danger"
                                icon={<FaRegTrashAlt />}
                            />
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 flex flex-col">
            <ToastContainer position="bottom-center" autoClose={3000} />

            <h2 className="font-bold text-4xl text-center mb-6 text-gray-800 tracking-tight">Hỗ trợ khách hàng</h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden relative p-4">
                    <div
                        style={{
                            marginBottom: 16,
                            display: "flex",
                            gap: "1rem",
                        }}
                    >
                        <Input
                            placeholder="Tìm kiếm theo mô tả hoặc chủ đề"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: "30%" }}
                        />
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={filterStatus}
                            onChange={(value) => setFilterStatus(value || "")}
                            style={{ width: "20%" }}
                            allowClear
                            suffixIcon={null}
                        >
                            <Option value="pending">Đang chờ</Option>
                            <Option value="finish">Đã phản hồi</Option>
                        </Select>
                    </div>
                    <div className="overflow-x-auto mb-14">
                        <Table
                            columns={columns}
                            dataSource={filteredTickets.slice(
                                (pagination.current - 1) * pagination.pageSize,
                                pagination.current * pagination.pageSize
                            )}
                            rowKey="_id"
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                onChange: (page, pageSize) => {
                                    setPagination({
                                        ...pagination,
                                        current: page,
                                        pageSize,
                                    });
                                },
                            }}
                            scroll={{ x: "max-content" }}
                            className="rounded-lg"
                        />
                    </div>
                    <Button
                        type="primary"
                        className="absolute bottom-6 left-6 px-6 py-2 text-white bg-gradient-to-r from-blue-400 to-blue-600 shadow-md rounded-lg hover:from-blue-500 hover:to-blue-700"
                        onClick={() => setIsCreating(true)}
                    >
                        Tạo yêu cầu
                    </Button>
                </div>
            )}

            <Modal
                title={
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-t-lg">
                        <h3 className="text-white text-lg">Tạo yêu cầu mới</h3>
                    </div>
                }
                visible={isCreating}
                onOk={createTicket}
                onCancel={() => setIsCreating(false)}
                okText="Tạo"
                cancelText="Hủy"
                footer={null}
            >
                <Input
                    name="subject"
                    placeholder="Chủ đề"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="mb-4 p-3 rounded-md"
                />
                <Input.TextArea
                    name="description"
                    placeholder="Mô tả"
                    value={newTicket.description}
                    onChange={(e) =>
                        setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                        })
                    }
                    rows={4}
                    className="rounded-md"
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        onClick={() => setIsCreating(false)}
                        className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={createTicket}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg px-6 py-2"
                    >
                        Tạo
                    </Button>
                </div>
            </Modal>

            {isEditing && editTicket && (
                <Modal
                    title={
                        <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-t-lg">
                            <h3 className="text-white text-lg">Chỉnh sửa yêu cầu</h3>
                        </div>
                    }
                    visible={isEditing}
                    onOk={saveEdit}
                    onCancel={() => {
                        setIsEditing(false);
                        setEditTicket(null);
                    }}
                    okText="Lưu"
                    cancelText="Hủy"
                    footer={null}
                >
                    <Input
                        name="subject"
                        placeholder="Chủ đề"
                        value={editTicket?.subject}
                        onChange={handleInputChange}
                        className="mb-4 p-3 rounded-md"
                    />
                    <Input.TextArea
                        name="description"
                        placeholder="Mô tả"
                        value={editTicket?.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="rounded-md"
                    />
                    <div className="flex justify-end space-x-4 mt-4">
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setEditTicket(null);
                            }}
                            className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={saveEdit}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg px-6 py-2"
                        >
                            Lưu
                        </Button>
                    </div>
                </Modal>
            )}

            {deleteTicketId && (
                <Modal
                    title={
                        <div className="bg-gradient-to-r from-red-400 to-red-600 p-4 rounded-t-lg">
                            <h3 className="text-white text-lg">Xác nhận xóa</h3>
                        </div>
                    }
                    visible={!!deleteTicketId}
                    onOk={deleteTicket}
                    onCancel={() => setDeleteTicketId(null)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <p>Bạn có chắc chắn muốn xóa yêu cầu này không?</p>
                </Modal>
            )}

            {viewContent && (
                <Modal
                    title="Nội dung chi tiết"
                    visible={!!viewContent}
                    onOk={() => setViewContent(null)}
                    onCancel={() => setViewContent(null)}
                    okText="Đóng"
                    cancelText="Hủy"
                >
                    <p>{viewContent}</p>
                </Modal>
            )}

            {feedbackTicket && (
                <Modal
                    title={
                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-t-lg">
                            <h3 className="text-white text-lg">Phản hồi</h3>
                        </div>
                    }
                    visible={!!feedbackTicket}
                    footer={null}
                >
                    <div>
                        <p>
                            <strong>Chủ đề:</strong> {feedbackTicket.subject}
                        </p>
                        <p>
                            <strong>Mô tả:</strong> {feedbackTicket.description}
                        </p>
                        <p>
                            <strong>Phản hồi:</strong> {feedbackTicket.respond || "Chưa có phản hồi"}
                        </p>
                        <p>
                            <strong>Ngày cập nhật:</strong> {new Date(feedbackTicket.updatedAt).toLocaleString()}
                        </p>
                        <div className="text-right mt-4">
                            <Button
                                onClick={() => setFeedbackTicket(null)}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg px-6 py-2"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CustomerSupport;
