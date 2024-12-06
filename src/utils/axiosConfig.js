const authConfig = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
};

function getAuthConfig() {
    const authToken = localStorage.getItem("authToken");
    // console.log("authToken", authToken);

    return {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    };
}

export { authConfig, getAuthConfig };
