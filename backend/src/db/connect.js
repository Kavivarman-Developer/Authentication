import mongoose from "mongoose";


const connect = async () => {
    try {
        console.log("Connectiong Attempt...")
        await mongoose.connect(process.env.MONGO_URL, {})
        console.log('DB is connected...')
    } catch (error) {
        console.log("Faild to connect to database...", error.message);
        process.exit(1);
    }
}

export default connect