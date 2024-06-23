import apiRequest from "../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../helpers/utils/toastUtils";

export default class PostService {
    static async index(currentPage, postsPerPage){
        const response = await apiRequest(`/post?page=${currentPage}&limit=${postsPerPage}`);
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error : null};
        }else{
            const errorMessage = response.message || 'An error occurred while fetching data.';
            showErrorToast(errorMessage);
            return { data: null, error : errorMessage};
        }
    }

    static async store(data) {
        const response = await apiRequest('post','POST', data);
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error : null};
        }else{
            const errorMessage = response.message || 'An error occurred while fetching data.';
            showErrorToast(errorMessage);
            return { data: null, error : errorMessage};
        }
    }

    static async show(postId){
        const response = await apiRequest(`post/${postId}`);
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error: null};
        }else{
            const errorMessage = response.message || 'An error occurred while fetching data.';
            showErrorToast(errorMessage);
            return { data: null, error : errorMessage};
        }
    }

    static async update(postId,data) {
        const response = await apiRequest(`post/${postId}`, 'PUT', data);
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error: null};
        }else{
            const errorMessage = response.message || 'An error occurred while fetching data.';
            showErrorToast(errorMessage);
            return { data: null, error : errorMessage};
        }
    }
}