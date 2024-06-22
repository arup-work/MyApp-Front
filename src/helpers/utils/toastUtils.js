import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Function to display a success toast message
export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        className: "foo-bar"
    })
}

// Function to display a error toast message
export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        className: "foo-bar"
    })
}