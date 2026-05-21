const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const User = require("../src/models/User");
const Study = require("../src/models/Study");
const Organization = require("../src/models/Organization");
const Participant = require("../src/models/Participant");

const {
  connectTestDB,
  clearTestDB,
  closeTestDB,
} = require("./setupTestDb");

const JWT_SECRET = "test-secret";

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      organizationId: user.organizationId,
      role: user.role,
      organizationPlan: "standard",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

describe("Neurovenus Privacy Architecture", () => {
  let jane;
  let sarah;
  let janeToken;
  let sarahToken;
  let org;

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    org = await Organization.create({
      name: "UCT Sleep Lab",
      slug: "uct-sleep-lab",
      institution: "University of Cape Town",
      plan: "standard",
      status: "active",
      maxSeats: 1,
      maxActiveStudies: 10,
      maxParticipantsPerMonth: 2000,
      isActive: true,
    });

    const passwordHash = await bcrypt.hash("Password123!", 10);

    jane = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash,
      organizationId: org._id,
      institution: "University of Cape Town",
      role: "owner",
      status: "active",
      isActive: true,
    });

    sarah = await User.create({
      name: "Sarah Smith",
      email: "sarah@example.com",
      passwordHash,
      organizationId: org._id,
      institution: "University of Cape Town",
      role: "researcher",
      status: "active",
      isActive: true,
    });

    janeToken = createToken(jane);
    sarahToken = createToken(sarah);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  test("researchers only see studies they created", async () => {
    await Study.create({
      title: "Jane Memory Study",
      description: "Private Jane study",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    await Study.create({
      title: "Sarah Sleep Study",
      description: "Private Sarah study",
      organizationId: org._id,
      createdBy: sarah._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const janeResponse = await request(app)
      .get("/api/studies")
      .set("Authorization", `Bearer ${janeToken}`);

    expect(janeResponse.status).toBe(200);
    expect(janeResponse.body.studies).toHaveLength(1);
    expect(janeResponse.body.studies[0].title).toBe("Jane Memory Study");

    const sarahResponse = await request(app)
      .get("/api/studies")
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(sarahResponse.status).toBe(200);
    expect(sarahResponse.body.studies).toHaveLength(1);
    expect(sarahResponse.body.studies[0].title).toBe("Sarah Sleep Study");
  });

  test("researcher cannot fetch another researcher's study by ID", async () => {
    const janeStudy = await Study.create({
      title: "Jane Private Study",
      description: "Sarah must not access this",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const sarahResponse = await request(app)
      .get(`/api/studies/${janeStudy._id}`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(sarahResponse.status).toBe(404);
    expect(sarahResponse.body.success).toBe(false);
    expect(sarahResponse.body.message).toBe("Study not found");
  });

  test("researcher cannot fetch participants from another researcher's study", async () => {
    const janeStudy = await Study.create({
      title: "Jane Participant Study",
      description: "Sarah must not access participants",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    await Participant.create({
      studyId: janeStudy._id,
      organizationId: org._id,
      createdBy: jane._id,
      participantCode: "NV-JANE01",
      email: "participant@example.com",
      tokenId: "token-jane-01",
      accessTokenHash: "hash-placeholder",
    });

    const sarahResponse = await request(app)
      .get(`/api/participants?studyId=${janeStudy._id}`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(sarahResponse.status).toBe(404);
    expect(sarahResponse.body.success).toBe(false);
    expect(sarahResponse.body.message).toBe("Study not found");
  });

  test("researcher cannot export another researcher's study data", async () => {
    const janeStudy = await Study.create({
      title: "Jane Export Study",
      description: "Sarah must not export this",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const sarahResponse = await request(app)
      .get(`/api/studies/${janeStudy._id}/export?format=csv`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(sarahResponse.status).toBe(404);
    expect(sarahResponse.body.success).toBe(false);
    expect(sarahResponse.body.message).toBe("Study not found");
  });

  test("researcher can fetch their own study by ID", async () => {
    const sarahStudy = await Study.create({
      title: "Sarah Own Study",
      description: "Sarah can access this",
      organizationId: org._id,
      createdBy: sarah._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const response = await request(app)
      .get(`/api/studies/${sarahStudy._id}`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.study.title).toBe("Sarah Own Study");
  });

  test("researcher can export their own study data", async () => {
    const sarahStudy = await Study.create({
      title: "Sarah Export Study",
      description: "Sarah can export this",
      organizationId: org._id,
      createdBy: sarah._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const response = await request(app)
      .get(`/api/studies/${sarahStudy._id}/export?format=csv`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
  });

  test("researcher cannot update another researcher's study", async () => {
    const janeStudy = await Study.create({
      title: "Jane Original Study",
      description: "Private",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const response = await request(app)
      .patch(`/api/studies/${janeStudy._id}`)
      .set("Authorization", `Bearer ${sarahToken}`)
      .send({
        title: "Sarah Tried To Edit This",
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Study not found");

    const unchangedStudy = await Study.findById(janeStudy._id);
    expect(unchangedStudy.title).toBe("Jane Original Study");
  });

  test("researcher can update their own study", async () => {
    const sarahStudy = await Study.create({
      title: "Sarah Original Study",
      description: "Original description",
      organizationId: org._id,
      createdBy: sarah._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const response = await request(app)
      .patch(`/api/studies/${sarahStudy._id}`)
      .set("Authorization", `Bearer ${sarahToken}`)
      .send({
        title: "Sarah Updated Study",
        description: "Updated description",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.study.title).toBe(
      "Sarah Updated Study"
    );

    expect(response.body.study.description).toBe(
      "Updated description"
    );

    const updatedStudy = await Study.findById(sarahStudy._id);

    expect(updatedStudy.title).toBe(
      "Sarah Updated Study"
    );
  });

  test("researcher cannot invite participants into another researcher's study", async () => {
    const janeStudy = await Study.create({
      title: "Jane Protected Study",
      description: "Sarah must not invite into this",
      organizationId: org._id,
      createdBy: jane._id,
      protocolVersion: "custom",
      protocol: {
        type: "custom",
        version: "v1",
        sessions: [],
      },
      sessions: [],
      active: true,
    });

    const response = await request(app)
      .post("/api/participants/invite")
      .set("Authorization", `Bearer ${sarahToken}`)
      .send({
        studyId: janeStudy._id,
        email: "participant@example.com",
      });

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Study not found"
    );

    const participantCount = await Participant.countDocuments({
      studyId: janeStudy._id,
    });

    expect(participantCount).toBe(0);
  });

  test("standard plan cannot create more than 10 active studies", async () => {
    for (let i = 0; i < 10; i++) {
      await Study.create({
        title: `Study ${i + 1}`,
        description: "Existing study",
        organizationId: org._id,
        createdBy: sarah._id,
        protocolVersion: "custom",
        protocol: {
          type: "custom",
          version: "v1",
          sessions: [],
        },
        sessions: [],
        active: true,
      });
    }

    const response = await request(app)
      .post("/api/studies")
      .set("Authorization", `Bearer ${sarahToken}`)
      .send({
        title: "Study 11",
        description: "Should fail",
        protocolVersion: "custom",
        protocol: {
          type: "custom",
          version: "v1",
          sessions: [],
        },
      });

    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);

    expect(response.body.code).toBe("ACTIVE_STUDY_LIMIT_REACHED");

    expect(response.body.message).toBe(
      "Your current plan allows up to 10 active studies."
    );

    const studyCount = await Study.countDocuments({
      organizationId: org._id,
      createdBy: sarah._id,
      active: true,
    });

    expect(studyCount).toBe(10);
  });
});