import api from "./api";

export const parseResume = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/upload/parse-resume",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};