import api from "../api";

export const getOnboarding = async () => {
    const response = await api.get("/onboarding/");
    return response.data;
};

export const onboardCandidate = async (applicationId) => {
    const response = await api.put(
        `/onboarding/${applicationId}`
    );

    return response.data;
};