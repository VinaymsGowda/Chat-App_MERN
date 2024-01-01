import {mongoose,Schema} from "mongoose"

const ChatSchema=mongoose.Schema({
    chatName:{
        type:String,
        trim:true, //for trailing white spaces
    },
    isGroupChat:{
        type:Boolean,
        default:false,
        
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:'User',
        },
    ],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:'Message',
    },
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true,
});

const Chat=mongoose.model('Chat',ChatSchema);
export default Chat;