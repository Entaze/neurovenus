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

  /**
   * Build export URL with optional filters.
   *
   * Supported filters:
   * - participantId
   * - participantCode
   * - sessionOrder
   * - taskType
   * - taskVersion
   */
  getStudyExportUrl(studyId, filters = {}) {
    if (!studyId) return "";

    const params = new URLSearchParams({
      format: "csv",
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        params.append(key, value);
      }
    });

    return `${api.defaults.baseURL}/studies/${studyId}/export?${params.toString()}`;
  },

  /**
   * Convenience wrapper for participant export.
   */
  getParticipantExportUrl(studyId, participantId) {
    return this.getStudyExportUrl(studyId, {
      participantId,
    });
  },

  /**
   * Convenience wrapper for session export.
   */
  getSessionExportUrl(studyId, sessionOrder) {
    return this.getStudyExportUrl(studyId, {
      sessionOrder,
    });
  },

  /**
   * Convenience wrapper for assessment export.
   */
  getAssessmentExportUrl(studyId, taskType) {
    return this.getStudyExportUrl(studyId, {
      taskType,
    });
  },
};