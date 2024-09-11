import apiRequest from "../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../helpers/utils/toastUtils";

export default class CommentService {
    static async store(auth, postId, data) {
        console.log(data);
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${postId}`,'POST',data, bearerToken);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(data.message);
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

    static async updateComment(auth, comment, commentId){
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${commentId}`,'PUT',{comment}, bearerToken);
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

    static async deleteComment(auth, commentId){
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${commentId}`,'DELETE',null, bearerToken);
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
    static async likeComment(auth, commentId){
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${commentId}/likes`,'POST',null, bearerToken);
            if (response.ok) {
                const data = response.data;
                response.data.message != ''  && showSuccessToast( response.data.message);
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