import { Schema, model, Document } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

interface IKeyToken extends Document {
    user: Schema.Types.ObjectId;
    publicKey?: string;
    privateKey?: string;
    refreshToken?: string;
    refreshTokensUsed: string[];
}

const keyTokenSchema = new Schema<IKeyToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        publicKey: {
            type: String,
        },
        privateKey: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        refreshTokensUsed: {
            type: [String],
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true, // sửa từ timestamp thành timestamps
    }
);

export default model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);
