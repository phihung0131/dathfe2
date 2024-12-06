import React, { useState } from "react";
import styles from "./SupportTicketPopup.module.css";
import { formatDate } from "date-fns";
import { button } from "framer-motion/client";
const SupportTicket = (props) => {
    const { ticketDetail, setTicketDetail, respondToTicket } = props;

    const [response, setResponse] = useState("");
    const [modifyResponse, setModifyResponse] = useState(false);

    function disableModification() {
        setResponse("");
        setModifyResponse(false);
    }

    function enableModification(oldReponse) {
        setModifyResponse(true); // allow modification
        setResponse(oldReponse); // set default to the previous response
    }

    return (
        <>
            <div className={`${styles["outer-container"]} ${ticketDetail.isOpen ? styles["visible"] : ""}`}>
                <div className={styles["container"]}>
                    {ticketDetail.ticket ? (
                        <>
                            <h3>Đơn hỗ trợ</h3>
                            <div className="grid grid-cols-2">
                                <div className={styles["section"]}>
                                    <div className={styles["label"]}>Khách hàng</div>
                                    <div>{ticketDetail.ticket.customer.name || ""}</div>
                                </div>
                                <div className={styles["section"]}>
                                    <div className={styles["label"]}>Email</div>
                                    <div>{ticketDetail.ticket.customer.email || ""}</div>
                                </div>
                            </div>

                            <div className={styles["section"]}>
                                <div className={styles["label"]}>Địa chỉ</div>
                                <div>{ticketDetail.ticket.customer.address || ""}</div>
                            </div>

                            <div className={styles["section"]}>
                                <div className={styles["label"]}>Chủ đề</div>
                                <div>{ticketDetail.ticket.subject || ""}</div>
                            </div>
                            <div className={styles["section"]}>
                                <div className={styles["label"]}>Nội dung</div>
                                <div>{ticketDetail.ticket.description || ""}</div>
                            </div>

                            <div className={styles["section"]}>
                                <div className={styles["label"]}>Ngày tạo yêu cầu</div>
                                <div>{formatDate(ticketDetail.ticket.createdAt || "", "hh:mm dd/MM/yyyy") || ""}</div>
                            </div>
                            {ticketDetail.ticket.status !== "pending" ? (
                                <>
                                    <div className={styles["section"]}>
                                        <div className={styles["label"]}>Ngày cập nhật</div>
                                        <div>
                                            {formatDate(ticketDetail.ticket.updatedAt || "", "hh:mm dd/MM/yyyy") || ""}
                                        </div>
                                    </div>
                                    <div className={styles["section"]}>
                                        <div className={styles["label"]}>Trạng thái</div>
                                        <div className={styles["status-text"]}>
                                            {ticketDetail.ticket.status === "finish"
                                                ? "Đã phản hồi"
                                                : ticketDetail.ticket.status === "update"
                                                ? "Đã cập nhật phản hồi"
                                                : ""}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                ""
                            )}

                            <label htmlFor="" className={styles["label"]}>
                                Phản hồi
                            </label>
                            {!modifyResponse &&
                            (ticketDetail.ticket.status === "finish" || ticketDetail.ticket.status === "update") ? (
                                <div>{ticketDetail.ticket.respond}</div>
                            ) : (
                                <>
                                    <textarea
                                        name=""
                                        onChange={(e) => {
                                            setResponse(e.target.value);
                                        }}
                                        value={response}
                                    ></textarea>
                                </>
                            )}

                            {!modifyResponse &&
                            (ticketDetail.ticket.status === "finish" || ticketDetail.ticket.status === "update") ? (
                                <>
                                    <button
                                        className={styles["respond-button"]}
                                        style={{ marginTop: "auto" }}
                                        onClick={() => {
                                            enableModification(ticketDetail.ticket.respond);
                                        }}
                                    >
                                        Sửa phản hồi
                                    </button>
                                    <button
                                        className={styles["cancel-button"]}
                                        onClick={() => {
                                            setTicketDetail({ isOpen: false, ticket: null });
                                        }}
                                    >
                                        Thoát
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={styles["respond-button"]}
                                        disabled={!response}
                                        onClick={() => {
                                            respondToTicket(response);
                                            disableModification();
                                        }}
                                    >
                                        Gửi phản hồi
                                    </button>
                                    <button
                                        className={styles["cancel-button"]}
                                        onClick={() => {
                                            setTicketDetail({ isOpen: false, ticket: null });
                                            disableModification();
                                        }}
                                    >
                                        Hủy bỏ
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
};

export default SupportTicket;
