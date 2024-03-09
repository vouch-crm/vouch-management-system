import mongoose, {Schema} from 'mongoose';


type TimeSheetTemplateDTO = {
    employeeID: string,
    taskIDs: string[],
    name: string
}

const timeSheetTemplateSchema = new Schema({
    employeeID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    taskIDs: [String],
    name: String
});

const TimeSheetTemplateAgent = mongoose.model<TimeSheetTemplateDTO>(
    'TimeSheetTemplate', timeSheetTemplateSchema);

export {TimeSheetTemplateDTO, TimeSheetTemplateAgent}