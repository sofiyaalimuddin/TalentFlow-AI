import api from "../api";

export const getApplications = async () => {
    const response = await api.get("/applications/");
    return response.data;
};

export const applyCandidate = async (jobId, candidateId) => {
    const response = await api.post("/applications/", null, {
        params: {
            job_id: jobId,
            candidate_id: candidateId,
        },
    });

    return response.data;
};

export const removeApplication = async (applicationId) => {
    await api.delete(`/applications/${applicationId}`);
};

export const downloadOfferLetter = async (applicationId) => {
    const response = await api.get(
        `/applications/${applicationId}/offer-letter`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const sendOfferEmail = async (applicationId) => {
    const response = await api.post(
        `/applications/${applicationId}/send-email`
    );

    return response.data;
};