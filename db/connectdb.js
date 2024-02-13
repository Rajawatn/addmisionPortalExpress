
const { default: mongoose } = require("mongoose")
const Live_URL = "mongodb+srv://nikhil123:nikhil123@cluster0.fnlg7jm.mongodb.net/admissionPortal?retryWrites=true&w=majority"
const local_URL = "mongodb://127.0.0.1:27017/admission123"

const connectDb = () => {
    mongoose.connect(Live_URL)
        .then(() => {
            console.log("connected successfuly");

        }).catch((err) => {
            console.log(err)
        })
}
module.exports = connectDb