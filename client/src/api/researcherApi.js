import api from "./client";

export const researcherApi = {
  async getStudies() {
    const { data } = await api.get("/studies");
    return data;
  },

  async getStudy(studyId) {
    const { data } = await api.get(`/studies/${studyId}`);
    return data;
  },

  async createStudy(payload) {
    const { data } = await api.post("/studies", payload);
    return data;
  },

  async getParticipants(studyId) {
    const { data } = await api.get(`/participants?studyId=${studyId}`);
    return data;
  },

  async inviteParticipant(studyId, email) {
    const { data } = await api.post("/participants/invite", {
      studyId,
      email,
    });

    return data;
  },

  getStudyExportUrl(studyId) {
    return `${api.defaults.baseURL}/studies/${studyId}/export?format=csv`;
  },

  getParticipantExportUrl(studyId, participantId) {
    return `${api.defaults.baseURL}/studies/${studyId}/export?format=csv&participantId=${participantId}`;
  },
};