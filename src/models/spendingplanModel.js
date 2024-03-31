import mongoose,{models,Schema} from "mongoose";
const mycategoriesSchema = new Schema({
            mycategoryId:{
                type:mongoose.SchemaTypes.ObjectId,
                ref: "Category",
            },
            //adding 21424:
            isChecked:{
             type:Boolean,
             default:false
            },
            planamount:{
                //type: { type:mongoose.SchemaTypes.Decimal128 },
                type:mongoose.SchemaTypes.Decimal128,
                default:0.00,
                required:true
            },
            categorynotes:{ type:String,default:'' },
            explain:{type:String,default:'' }

})
const SpendingplanSchema = new Schema(
    {
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    planmonthyear:{
        type: Date,
        default: new Date(),
        required:true
    },
    mycategories:[mycategoriesSchema],
    incometype :{
        type: String,
        required: true,
        enum: [ 
                "wages",
                "tips",
                "interest",
                "child-support",
                "retirement-income",
                "other"
            ]
    },
    incomedate:{
        type: Date,
        //type: new ISODate("<YYYY-mm-dd>"), doesnt wk
        default: new Date(),
        required:true
        },
    incomedescr:{
            type: String,
            required: true,
            min:6
    },
    incomeamount:{
        default:1.00,
        type:mongoose.Schema.Types.Decimal128,
        //get: getAmount
        required:true
    }
    // difference:{
    //     type:mongoose.SchemaTypes.Decimal128,
    //     default:0.00
    // },
    
    },
    {timestamps: true}
);
const Spendingplan = mongoose.models.Spendingplan || mongoose.model("Spendingplan", SpendingplanSchema);
export default Spendingplan;