import "module-alias/register"
import { MongoHelper } from "../infra/utils/mongo-helper"
import env from "./config/env"

MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const { setupApp } = await import("./config/app")
        const app = await setupApp()
        app.listen(env.port, () =>
            console.log(`Server running at http://localhost:${env.port}`)
        )
    })
    .then(() => MongoHelper.createIndexes())
    .catch(e => console.log(e))