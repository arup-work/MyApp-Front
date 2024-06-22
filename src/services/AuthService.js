import apiRequest from "../helpers/utils/api";
import { showSuccessToast, showErrorToast } from "../helpers/utils/toastUtils";

const AuthService = {
    async login(email, password) {
        try {
            const response = await apiRequest('/auth/login', 'POST' , { email, password});
            if (response.ok) {
                showSuccessToast('Login successful');
                return { data: response.data, error: null };
            }else{
                const errorMessage = response.message || 'An error occurred. Please try again later.';
                showErrorToast(errorMessage);
                return { data: null, error: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred. Please try again later.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }
}

export default AuthService;