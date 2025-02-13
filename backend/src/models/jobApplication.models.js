import mongoose, {Schema} from "mongoose";

const jobApplicationSchema = new Schema({
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Jobs",
        require : true
    },
    applicant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    status : {
        type : String,
        default : "Pending"
    }
},{timestamps : true})

export const Applications = mongoose.model("Applications",jobApplicationSchema)