import WebApp from '@twa-dev/sdk';
export const smartAlert = (props = {}) => {
    const { platform = "telegram", title, message, type = 1, onConfirm = null, alertData = {}, cancelable = true } = props;
    // type 1 = alert, 2 = confirm

    if (platform === 'web') {
        if (type == 2) {
            const result = window.confirm([title, message].filter(Boolean).join('\n'))
            if (result) {
                onConfirm && onConfirm(alertData)
            }
        } else {
            alert(message)
        }

    } else if (platform == "telegram") {
        WebApp.ready();
        WebApp.showPopup({
            title: title,
            message: message,
            buttons: [
                {
                    id: "okay",
                    type: "default",
                    text: "Okay"
                }
            ]
        }).then((buttonId) => {
            if (buttonId) {
            }
        });

    }
}