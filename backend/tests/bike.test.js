// These are our automated tests. They check that the API behaves
// correctly, WITHOUT us having to click around manually every time.
//   - Jest: the test runner (it gives us "describe", "test", "expect")
//   - Supertest: lets us send fake HTTP requests to our Express app

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
process.env.NODE_ENV = "test";
const app = require("../server");
const Bike = require("../models/Bike");

beforeAll(async () => {
  const testUri =
    process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/greenwheels_test";
  await mongoose.connect(testUri);
});

beforeEach(async () => {
  await Bike.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

const sampleBike = {
  bikeNumber: "BK-001",
  bikeType: "Mountain",
  brand: "Trek",
  colour: "Red",
  dailyRate: 12,
  weeklyRate: 60,
  status: "Available",
};

describe("Create Bike (POST /api/bikes)", () => {
  test("creates a new bike when data is valid", async () => {
    const response = await request(app).post("/api/bikes").send(sampleBike);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.bikeNumber).toBe("BK-001");
  });

  test("rejects a bike with a daily rate of zero", async () => {
    const badBike = { ...sampleBike, dailyRate: 0 };

    const response = await request(app).post("/api/bikes").send(badBike);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("rejects a duplicate bike number", async () => {
    await request(app).post("/api/bikes").send(sampleBike);

    const response = await request(app).post("/api/bikes").send(sampleBike);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Bike number already exists");
  });
});

describe("Read Bikes (GET /api/bikes)", () => {
  test("returns an empty list when there are no bikes", async () => {
    const response = await request(app).get("/api/bikes");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.data).toEqual([]);
  });

  test("returns all bikes that were added", async () => {
    await Bike.create(sampleBike);

    const response = await request(app).get("/api/bikes");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].bikeNumber).toBe("BK-001");
  });
});

describe("Update Bike (PUT /api/bikes/:id)", () => {
  test("updates an existing bike", async () => {
    const bike = await Bike.create(sampleBike);

    const response = await request(app)
      .put("/api/bikes/" + bike._id)
      .send({ status: "Maintenance" });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.status).toBe("Maintenance");
  });

  test("returns 404 when updating a bike that does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put("/api/bikes/" + fakeId)
      .send({ status: "Maintenance" });

    expect(response.statusCode).toBe(404);
  });
});

describe("Delete Bike (DELETE /api/bikes/:id)", () => {
  test("deletes an existing bike", async () => {
    const bike = await Bike.create(sampleBike);

    const response = await request(app).delete("/api/bikes/" + bike._id);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const stillThere = await Bike.findById(bike._id);
    expect(stillThere).toBeNull();
  });
});

describe("Integration test: frontend-style workflow", () => {
  // This test mimics exactly what our frontend script.js does:
  // add a bike, then fetch the list, then confirm it shows up.
  // It proves the frontend and backend can talk to each other correctly.
  test("a bike added through POST immediately appears in GET results", async () => {
    await request(app).post("/api/bikes").send(sampleBike);

    const listResponse = await request(app).get("/api/bikes?search=BK-001");

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.count).toBe(1);
    expect(listResponse.body.data[0].brand).toBe("Trek");
  });
});
