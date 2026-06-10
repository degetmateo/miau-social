import { Document, Filter, UUID } from "mongodb";
import DatabaseError from "../../../../errors/DatabaseError";
import { mongo } from "../../mongodb";

export default async (query: {
    id: null | string;
    username: null | string;
}) => {
    try {
        const collection = mongo.collection('members');
        const filter: Filter<Document> = {};
        if (query.id) filter._id = new UUID(query.id) as any;
        if (query.username) filter.username = query.username;
        const members = await collection.find(filter).sort({ created_at: -1 }).limit(20).toArray();
        return members;
    } catch (error) {
        console.error(error);
        throw new DatabaseError("🟥 | Ocurrió un error en MONGOMEMBER GET");
    };
};