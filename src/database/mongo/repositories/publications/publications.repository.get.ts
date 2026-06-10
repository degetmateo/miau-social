import { Filter, ObjectId, Sort, UUID } from "mongodb";
import { mongo } from '../../mongodb'
import DatabaseError from "../../../../errors/DatabaseError";

export default async (params: {
    olderPublicationId: null | string;
    authorUsername: null | string;
    _id: null | string;
    targetPublicationId: null | string;
    rootPublicationId: null | string;
    type: string | null;
}) => {
    try {
        const collection = mongo.collection('publications');
        
        const query: Filter<Document> = {};

        if (params._id) query['_id'] = new UUID(params._id) as any;
        if (params.olderPublicationId) query['_id'] = { $lt: new UUID(params.olderPublicationId) as any };
        if (params.authorUsername) query['author.username'] = params.authorUsername;
        if (params.targetPublicationId) query['target_publication_id'] = new UUID(params.targetPublicationId);
        if (params.rootPublicationId) query['root_publication_id'] = new UUID(params.rootPublicationId);
        if (params.type) query['type'] = params.type;

        let publications = await collection.find(query).sort({ _id: -1 }).limit(20).toArray();

        if (params._id) {
            if (publications[0].type === 'reply') {
                const threadIds: ObjectId[] = publications[0].thread_ids;
                if (threadIds && threadIds.length > 0) {
                    const threadQuery: Filter<Document> = {
                        _id: { $in: threadIds }
                    };
                    
                    publications[0].thread_publications = await collection.find(threadQuery).sort({ _id: -1 }).toArray();
                };
            };
        };

        return publications;
    } catch (error) {
        console.error(error);
        throw new DatabaseError();
    };
};