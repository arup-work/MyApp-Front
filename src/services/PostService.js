import apiRequest from "../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../helpers/utils/toastUtils";

export default class PostService {
    static async index(auth, currentPage, postsPerPage) {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`/post?page=${currentPage}&limit=${postsPerPage}`,'GET', null, bearerToken);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while fetching data.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while fetching data.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }

    static async store(auth,data) {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest('post', 'POST', data, bearerToken);
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

    static async show(postId) {
        try {
            const response = await apiRequest(`post/${postId}`);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while fetching the post.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while fetching the post.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }

    static async update(postId, data) {
        try {
            const response = await apiRequest(`post/${postId}`, 'PUT', data);
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while updating the post.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while updating the post.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }

    static async deletePost(postId) {
        try {
            const response = await apiRequest(`post/${postId}`, 'DELETE');
            if (response.ok) {
                const data = response.data;
                showSuccessToast(response.message);
                return { data, error: null };
            } else {
                const errorMessage = response.message || 'An error occurred while deleting the post.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while deleting the post.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }
}
