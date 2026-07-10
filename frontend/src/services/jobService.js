import api from "../api";

export const getJobs = async () => {
    const response = await api.get("/jobs/");
    return response.data;
};

export const createJob = async (job) => {
    const response = await api.post("/jobs/", job);
    return response.data;
};

export const updateJob = async (id, job) => {
    const response = await api.put(`/jobs/${id}`, job);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};