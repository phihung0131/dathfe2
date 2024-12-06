import { useEffect, useState } from "react";
import { Table, Typography, Spin, message, Input, Select } from "antd";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;

const RevenueReportTable = ({ selectedDate }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (selectedDate) {
            fetchRevenueData(selectedDate);
        }
    }, [selectedDate]);

    const fetchRevenueData = async (date) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/revenue/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (response.data.status === "success") {
                const apiData = response.data.data.revenue;
                setData(apiData.orders);
                setFilteredData(apiData.orders); 
                setTotalRevenue(apiData.totalRevenue);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error(`Lỗi khi lấy dữ liệu doanh thu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = data.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item._id.toLowerCase().includes(value.toLowerCase()) ||
            item.customerId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(value);
    };

    const columns = [
        {
            title: "Mã Đơn hàng",
            dataIndex: "_id",
            key: "_id",
            sorter: (a, b) => a._id.localeCompare(b._id),
        },
        {
            title: "ID Khách hàng",
            dataIndex: "customerId",
            key: "customerId",
        },
        {
            title: "Khách hàng",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (totalPrice) => `${totalPrice.toLocaleString()} VND`,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (createdAt) => new Date(createdAt).toLocaleString(),
        },
    ];

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg mb-10">
            <Typography.Title level={3}>Báo cáo Doanh thu Ngày</Typography.Title>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm theo tên khách hàng, mã đơn hàng hoặc ID khách hàng"
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
                <Select defaultValue={10} onChange={handlePageSizeChange} style={{ width: 100 }}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                </Select>
            </div>
            
            {loading ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    pagination={{ pageSize }}
                    scroll={{ x: 'max-content' }}
                />
            )}
        </div>
    );
};

export default RevenueReportTable;
