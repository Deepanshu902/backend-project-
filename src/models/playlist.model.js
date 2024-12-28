import mongoose,{Schema} from "mongoose";


const playlistSchema  = mongoose.Schema(
    {
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        name:{
            type:String,
            required:true
        },
        discription:{
            type:String,
            required:true
        },
        video:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ]

        
    },
    {
        timestamp:true
    }
)

export const Playlist  = mongoose.model("Playlist",playlistSchema)