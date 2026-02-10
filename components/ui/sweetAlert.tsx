import Swal, { SweetAlertIcon } from "sweetalert2";

interface AlertOptions {
    text?: string;
    timer?: number;
}

const showAlert = (
    icon: SweetAlertIcon,
    { text = "", timer }: AlertOptions = {}
) => {
    return Swal.fire({
        icon,
        text,
        timer,
        timerProgressBar: !!timer,
        showConfirmButton: icon === "success" || icon === "error",
        confirmButtonText: "OK",
        allowOutsideClick: icon !== "success",

        background: "#ffffff",
        color: "#000000",
        backdrop: "rgba(0,0,0,0.1)",

        customClass: {
            popup: "swal-popup-elegant",
            icon: "swal-icon-black",
            confirmButton: "swal-button-elegant",
            title: "swal-title-elegant",
            htmlContainer: "swal-text-elegant", // pour le texte
        },

    });
};

export const showInfo = (text?: string, timer = 3000) =>
    showAlert("info", { text, timer });

export const showWarning = (text?: string) => showAlert("warning", { text });

export const showSuccess = (text?: string, timer = 3500) =>
    showAlert("success", { text, timer });

export const showError = (text?: string) => showAlert("error", { text });
