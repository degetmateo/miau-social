import { Filter, ObjectId } from "mongodb";
import GenericError from "../../../../errors/GenericError";
import DatabaseError from "../../../../errors/DatabaseError";
import { mongo } from "../../mongodb";

export default async (data: {
    thread: ObjectId[]
}) => {
    try {
        const collection = mongo.collection('publications');
        const query: Filter<Document> = {
            _id: { $in: data.thread }
        };
        const publications = await collection.find(query).sort({ _id: 1 }).toArray();
        return publications;
    } catch (error) {
        console.error(error);
        if (error instanceof GenericError) throw error;
        else throw new DatabaseError();
    };
};