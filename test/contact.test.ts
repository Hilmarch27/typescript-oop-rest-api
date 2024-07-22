import supertest from "supertest";
import { ContactTest, UserTest } from "./test.util";
import { app } from "../src/applicaion/app";
import { logger } from "../src/applicaion/logging";

describe('POST /api/contacts', () => {
    beforeEach(async() => {
        await UserTest.create();
    })

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    })

    it('should create new contact',async () => {
        const response = await supertest(app)
          .post("/api/contacts")
          .set("X-API-TOKEN", "test")
          .send({
            first_name: "Hilman",
            last_name: "Kusumatomo",
            email: "aXUeh@example.com",
            phone: "08123456789",
          });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Hilman");
        expect(response.body.data.last_name).toBe("Kusumatomo");
        expect(response.body.data.email).toBe("aXUeh@example.com");
        expect(response.body.data.phone).toBe("08123456789");
    });
    
    it('should reject create new contact if request is invalid',async () => {
        const response = await supertest(app)
          .post("/api/contacts")
          .set("X-API-TOKEN", "test")
          .send({
            first_name: "",
            last_name: "Kusumatomo",
            email: "aXUehcom",
            phone: "08123666666666666456789",
          });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});
