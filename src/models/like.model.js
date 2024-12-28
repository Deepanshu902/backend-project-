import mongoose,{Schema, SchemaType} from "mongoose";


const likeSchema = mongoose.Schema(
    {
        comment:{
            type:Schema.Types.ObjectId,
            ref:"Comment"
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        likeBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"Tweet"
        }
    },
    {
        timestamp:true
    }
)

export const Like = mongoose.model("Like",likeSchema)