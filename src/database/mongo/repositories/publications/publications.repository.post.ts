import { Document, Filter, MongoOIDCError, ObjectId, OptionalId, UpdateFilter, UUID, WithId } from "mongodb";
import DatabaseError from "../../../../errors/DatabaseError";
import { mongo } from "../../mongodb";
import GenericError from "../../../../errors/GenericError";
import InvalidArgumentError from "../../../../errors/InvalidArgumentError";
const uuid = require('uuid');

export default async (data: {
    oomfyId: string;
    content: string | null;
    targetPublicationId: string | null;
    images: {
        url: string;
        imgbb_id?: string;
        delete_url?: string;
        source: "imgbb" | "tenor" | "other";
        index: number;
    }[] | null,
    type: string;
    spotify: { url: string; title: string; iframe_url: string; thumbnail_url: string; } | null;
}) => {
    try {
        const publications = mongo.collection('publications');
        const members = mongo.collection('members');

        const author = await members.findOne({ _id: new UUID(data.oomfyId) as any });
        delete author.icon.delete_url;
        delete author.banner.delete_url;

        const doc: OptionalId<Document> = {
            _id: new UUID(uuid.v7()) as any,
            author: {
                _id: author._id,
                name: author.name,
                username: author.username,
                role: author.role,
                icon_url: author.icon.url,
                banner_url: author.banner.url
            },
            type: data.type,
            created_at: new Date().toISOString()
        };

        if (data.type != 'shared') {
            doc.upvote_count = 0;
            doc.share_count = 0;
            doc.quote_count = 0;
            doc.comment_count = 0;

            if (!data.content && !data.images && !data.spotify) throw new InvalidArgumentError('Empty post.');

            if (data.content) {
                doc.content = data.content;
            };

            if (data.images && data.images.length > 0) {
                doc.images = data.images;
            };

            if (data.spotify) {
                doc.embeds = [{
                    type: 'spotify',
                    ...data.spotify
                }];
            };
        };

        let targetPublication: WithId<Document> = null;
        if (data.type != 'default') {
            const filter: Filter<Document> = {
                _id: new UUID(data.targetPublicationId) as any
            };

            const updateFilter: UpdateFilter<Document> = {
                $inc: { comment_count: 1 }
            };

            targetPublication = await publications.findOneAndUpdate(filter, updateFilter);

            if (targetPublication) {
                doc.target_publication_id = targetPublication._id;
                doc.target_publication = targetPublication;

                if (targetPublication.root_publication_id) {
                    doc.root_publication_id = targetPublication.root_publication_id;
                } else {
                    doc.root_publication_id = targetPublication._id;
                };
            };
        };

        if (data.type === 'reply' && targetPublication) {
            const updatedThread: ObjectId[] = targetPublication.thread_ids || [];
            updatedThread.push(targetPublication._id);
            doc.thread_ids = updatedThread;
        };

        await publications.insertOne(doc);
        return doc;
    } catch (error) {
        console.error(error);
        if (error instanceof GenericError) throw error;
        else throw new DatabaseError();
    };
};