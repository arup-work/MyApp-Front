import apiRequest from "../helpers/utils/api";
import { showSuccessToast, showErrorToast } from "../helpers/utils/toastUtils";
import ResetPassword from "../views/Auth/ResetPassword";

const AuthService = {
    async login(email, password) {
        const response = await apiRequest('/auth/login', 'POST', { email, password });
        if (response.ok) {
            showSuccessToast('Login successful');
            return { data: response.data, error: null };
        } else {
            const errorMessage = response.message || 'An error occurred. Please try again later.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    async register(name, email, password, confirmPassword) {
        const response = await apiRequest('/auth/register', 'POST', { name, email, password, confirmPassword });
        if (response.ok) {
            showSuccessToast('Registration successful');
            return { data: response.data, error: null };
        } else {
            const errorMessage = response.message || 'An error occurred. Please try again later.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    async forgetPassword(email){
        const response = await apiRequest('/auth/forget-password','POST', {email});
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error: null};
        }else{
            const errorMessage = response.message || 'An error occurred. Please try again later.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    async resetPassword(password, token) {
        console.log("sdgfxchbn",token);
        const response = await apiRequest(`/auth/reset-password/${token}`, 'PUT', { newPassword : password});
        if (response.ok) {
            const data = response.data;
            showSuccessToast(response.message);
            return { data, error: null};
        }else{
            const errorMessage = response.message || 'An error occurred. Please try again later.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }
}

export default AuthService;
