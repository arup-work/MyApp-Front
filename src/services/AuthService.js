import apiRequest from "../helpers/utils/api";
import { showSuccessToast, showErrorToast } from "../helpers/utils/toastUtils";

const AuthService = {
    async login(email, password) {
        try {
            const { ok, data, message} = await apiRequest('/auth/login', 'POST' , { email, password});
            if (ok) {
                showSuccessToast('Login successful');
                return data;
            }else{
                showErrorToast(message || 'Login failed');
                throw new Error(message || 'Login failed');
            }
        } catch (error) {
            showErrorToast('An error occurred.Please try again letter');
            throw error;
        }
    }
}

export default AuthService;