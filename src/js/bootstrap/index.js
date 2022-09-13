import './vendor';
import './init';
import './utils/parser';


if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").then(
            function (registration) {
                // Registration was successful
            },
            function (err) {
                // registration failed :(
            }
        );
    });
}