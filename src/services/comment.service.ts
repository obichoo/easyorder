import AxiosInstance from "@/services/axios.service";
import {Comment} from "@/models/comment.model";
import {User} from "@/models/user.model";

class CommentService {
    // Get all comments
    getAllComments() {
        return AxiosInstance.get("/comment");
    }

    getCommentsByUserType(userId: User['_id'], userType: 'recipient' | 'sender') {
        return AxiosInstance.get(`/comment/${userType}/${userId}`);
    }

    // Get comment by ID
    getCommentById(commentId: Comment['_id']) {
        return AxiosInstance.get(`/comment/${commentId}`);
    }

    // Create comment
    createComment(comment: Comment) {
        return AxiosInstance.post("/comment", comment);
    }

    // Update comment
    updateComment(comment: Comment) {
        return AxiosInstance.put(`/comment/${comment._id}`, comment);
    }

    // Delete comment
    deleteComment(commentId: Comment['_id']) {
        return AxiosInstance.delete(`/comment/${commentId}`);
    }
}

export default new CommentService();