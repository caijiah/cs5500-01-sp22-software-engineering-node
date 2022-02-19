import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel.find({tuit: tid})
            .populate("likedBy")
            .exec();

    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel.find({likedBy: uid})
            .populate("tuit")
            .exec();

    userLikesTuit = async (tid: string, uid: string): Promise<Like> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    userUnlikesTuit = async (tid: string, uid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid})

    findAllLike = async (): Promise<Like[]> =>
        LikeModel.find()
            .populate('tuit')
            .populate('likedBy', {username: 1})
            .exec();
}