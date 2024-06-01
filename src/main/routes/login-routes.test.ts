import { MongoHelper } from "@/infra/utils/mongo-helper"
import { setupApp } from "@/main/config/app"
import { hash } from "bcrypt"
import { Express } from "express"
import { Collection } from "mongodb"
import request from "supertest"

let app: Express
let accountCollection: Collection

describe("Login routes", () => {
    beforeAll(async () => {
        app = await setupApp()
        await MongoHelper.connect(process.env.MONGO_URL!)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("/signup", () => {
        it("should return 200 when sending valid account data", async () => {
            await request(app)
                .post("/api/signup")
                .send({
                    name: "any_name",
                    email: "any_email@gmail.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                })
                .expect(200)
        })
        it("should return authentication accessToken and name when sending valid data", async () => {
            await request(app)
                .post("/api/signup")
                .send({
                    name: "any_name",
                    email: "any_email@gmail.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                })
                .then(response => {
                    expect(response.body.accessToken).toBeTruthy()
                    expect(response.body.email).toBeTruthy()
                })
        })
    })
    describe("/login", () => {
        it("should return 200 when login with an existing account", async () => {
            await accountCollection.insertOne({
                name: "any_name",
                email: "any_email@gmail.com",
                password: await hash("any_password", 12),
            })
            await request(app)
                .post("/api/login")
                .send({
                    email: "any_email@gmail.com",
                    password: "any_password",
                })
                .expect(200)
        })
        it("should return accessToken and name when sending valid data", async () => {
            await accountCollection.insertOne({
                name: "any_name",
                email: "any_email@gmail.com",
                password: await hash("any_password", 12),
            })
            await request(app)
                .post("/api/login")
                .send({
                    email: "any_email@gmail.com",
                    password: "any_password",
                })
                .then(response => {
                    expect(response.body.accessToken).toBeTruthy()
                    expect(response.body.email).toBeTruthy()
                })
        })
    })
})
