import api from "./client";

function getExportFilename(response, fallbackFilename) {
  const disposition = response.headers?.["content-disposition"];

  if (!disposition) return fallbackFilename;

  const match = disposition.match(/filename="?([^"]+)"?/);

  return match?.[1] || fallbackFilename;
}

function downloadBlob(blob, filename) {
  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(downloadUrl);
}

export const researcherApi = {
  async getStudies() {
    const { data } = await api.get("/studies");
    return data;
  },

  async getOrganizationUsage() {
    const { data } = await api.get("/organization/usage");
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

  async getResearchers() {
    const { data } = await api.get("/researchers");
    return data;
  },

  async inviteResearcher(email) {
    const { data } = await api.post("/researchers/invite", { email });
    return data;
  },

  getStudyExportUrl(studyId, filters = {}) {
    if (!studyId) return "";

    const params = new URLSearchParams({
      format: "csv",
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    return `/studies/${studyId}/export?${params.toString()}`;
  },

  async downloadStudyExport(studyId, filters = {}, filename = "neurovenus-export.csv") {
    if (!studyId) {
      throw new Error("Study is required for export.");
    }

    const url = this.getStudyExportUrl(studyId, filters);

    const response = await api.get(url, {
      responseType: "blob",
    });

    const finalFilename = getExportFilename(response, filename);

    downloadBlob(response.data, finalFilename);
  },

  async downloadParticipantExport(studyId, participantId, filename) {
    return this.downloadStudyExport(
      studyId,
      { participantId },
      filename || `neurovenus-participant-${participantId}.csv`
    );
  },

  async downloadSessionExport(studyId, participantId, sessionOrder, filename) {
    return this.downloadStudyExport(
      studyId,
      {
        participantId,
        sessionOrder,
      },
      filename || `neurovenus-participant-${participantId}-session-${sessionOrder}.csv`
    );
  },

  async downloadAssessmentExport(studyId, participantId, taskType, filename) {
    return this.downloadStudyExport(
      studyId,
      {
        participantId,
        taskType,
      },
      filename || `neurovenus-participant-${participantId}-${taskType}.csv`
    );
  },

  getParticipantExportUrl(studyId, participantId) {
    return this.getStudyExportUrl(studyId, {
      participantId,
    });
  },

  getSessionExportUrl(studyId, sessionOrder) {
    return this.getStudyExportUrl(studyId, {
      sessionOrder,
    });
  },

  getAssessmentExportUrl(studyId, taskType) {
    return this.getStudyExportUrl(studyId, {
      taskType,
    });
  },
};