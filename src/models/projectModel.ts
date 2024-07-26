import mongoose, {Schema} from 'mongoose';

type projectDTO = {
    clientID: string,
    name: string, 
    budget: number
}

const projectSchema = new Schema({
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    name: String,
    budget: Number
})

const projectAgent = mongoose.model<projectDTO>('project', projectSchema);

export {projectDTO, projectAgent}