import apiRequest from "../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../helpers/utils/toastUtils";

export default class CommentService {
    static async store(auth, postId, data) {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${postId}`,'POST',data, bearerToken);
            console.log(response);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while creating the post.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while creating the post.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }

    static async fetchComment(auth, postId){
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${postId}`,'GET',null, bearerToken);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while creating the post.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while creating the post.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }
}