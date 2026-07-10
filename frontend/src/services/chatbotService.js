import api from "../api";

export const sendMessage = async (message) => {

    const response = await api.post(
        "/chatbot/",
        {
            message,
        }
    );

    return response.data;
};