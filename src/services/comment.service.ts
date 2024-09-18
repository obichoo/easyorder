import AxiosInstance from "@/services/axios.service";
import {Comment} from "@/models/comment.model";

class CommentService {
    // Get all comments
    getAllComments() {
        return AxiosInstance.get("/comment");
    }

    // Get comment by ID
    getCommentById(commentId: Comment['id']) {
        return AxiosInstance.get(`/comment/${commentId}`);
    }

    // Create comment
    createComment(comment: Comment) {
        return AxiosInstance.post("/comment", comment);
    }

    // Update comment
    updateComment(comment: Comment) {
        return AxiosInstance.put(`/comment/${comment.id}`, comment);
    }

    // Delete comment
    deleteComment(commentId: Comment['id']) {
        return AxiosInstance.delete(`/comment/${commentId}`);
    }
}

export default new CommentService();