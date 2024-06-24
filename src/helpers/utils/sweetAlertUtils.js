import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showSuccessModal = (title, text) => {
    return MySwal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonText: 'OK',
    });
};

export const showErrorModal = (title, text) => {
    return MySwal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK',
    });
};

export const showConfirmationModal = (title, text) => {
    return MySwal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    });
};