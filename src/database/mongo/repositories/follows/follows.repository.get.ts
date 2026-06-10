import { mongo } from "../../mongodb";
import DatabaseError from "../../../../errors/DatabaseError";
import { Document, Filter, UUID } from "mongodb";

export default async (query: {
    followedUsername: string | null;
    followerUsername: string | null;
    olderId: string | null;
}) => {
    try {
        const collection = mongo.collection('follows');
        
        const filter: Filter<Document> = {};
        if (query.followedUsername) filter['followed.username'] = query.followedUsername;
        if (query.followerUsername) filter['follower.username'] = query.followerUsername;
        if (query.olderId) filter['_id'] = { $lt: new UUID(query.olderId) as any };

        const follows = await collection.find(filter).sort({ _id: -1 }).limit(20).toArray();
        return follows;
    } catch (error) {
        console.error(error);
        throw new DatabaseError();  
    };
};