import { useState } from "react";
import BusinessOverview from "./BusinessOverview";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import RevenueReportTable from "./RevenueReportTable";
import PromotionEffectivenessChart from "./PromotionEffectivenessChart";
import OrderSummaryOverview from "./OrderSummaryOverview";
import { DatePicker } from "antd";

const ReportsScreen = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        const formattedDate = date ? date.format("YYYY-MM-DD") : null;
        setSelectedDate(formattedDate);
    };

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-4">Báo cáo theo ngày</h1>
            <DatePicker className="mb-5" onChange={handleDateChange} />
            <BusinessOverview selectedDate={selectedDate} />
            <div className="flex flex-col mt-6 md:flex-row gap-6">
                <div className="flex-1">
                    <RevenueByCategoryChart selectedDate={selectedDate} />
                </div>
                <div className="flex-1">
                    <PromotionEffectivenessChart selectedDate={selectedDate} />
                </div>
            </div>

            <RevenueReportTable selectedDate={selectedDate} />
            <OrderSummaryOverview />
        </div>
    );
};

export default ReportsScreen;
