import { ConnectToDB } from './config/db.config'
import { app } from './app'
import dotenv from 'dotenv'
dotenv.config({
    path: '../.env'
})


ConnectToDB().then(
    () => {
        const PORT = process.env['PORT'] || 8000;
        app.listen(PORT, () => {
            console.log("✅ App is Listening on Port " + PORT);
        })
    }
).catch(
    (e: Error) => {
        console.error(e);
    }
)
