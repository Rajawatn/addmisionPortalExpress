
const { default: mongoose } = require("mongoose")


const connectDb = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/admission123")
        .then(() => {
            console.log("connected successfuly");

        }).catch((err) => {
            console.log(err)
        })
}
module.exports = connectDb