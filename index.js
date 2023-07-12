"use strict";
/**
 * Displays a modal in the HTML document.
 * @param {Object} options - Configuration options for the modal.
 * @param {string} options.partnerURL - The URL of the partner.
 * @param {string} options.partnerToken - The token of the partner.
 * @param {string=} options.userToken - The user's token (optional).
 * @param {string=} options.userUUID - The user's UUID (optional).
 * @param {Partial<CSSStyleDeclaration>=} style - Additional CSS styles for the modal (optional).
 * @returns {void}
 */
function show({ partnerURL, partnerToken, userToken, userUUID }, style) {
  const urlRegex = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  if (partnerURL === undefined && partnerToken === undefined) {
    throw new Error(
      "Cannot display the modal without a partner URL and token."
    );
  }

  if (!userToken && !userUUID) {
    throw new Error(
      "The user uuid or user token parameter is required if no userToken is provided."
    );
  }

  if (!urlRegex.test(partnerURL)) {
    throw new Error(
      "Sorry, the provided URL is not valid. Please make sure to enter a valid URL."
    );
  }

  //validation of the message to close the modal
  function handleMessage(event) {
    if (event.data === "CLOSE_MODAL") {
      hide();
    }
  }

  window.addEventListener("message", handleMessage);

  var modalContainer = document.getElementById("modal-pfm");

  if (!modalContainer) {
    // Create the modal container if it doesn't exist
    modalContainer = document.createElement("div");
    modalContainer.id = "modal-pfm";
    document.body.appendChild(modalContainer);
    var modal_1 = document.createElement("div");
    modal_1.className = "modal modal-pfm";
    modal_1.id = "modal";

    // Add a "loader" class to the loader div element
    var loader_1 = document.createElement("div");
    loader_1.className = "loader";
    var iframe_1 = document.createElement("iframe");

    if (userToken) {
      iframe_1.src = `${partnerURL}?partnerToken=${partnerToken}&userToken=${userToken}`;
    } else if (userUUID) {
      iframe_1.src = `${partnerURL}?partnerToken=${partnerToken}&userUUID=${userUUID}`;
    } else {
      iframe_1.src = `${partnerURL}?partnerToken=${partnerToken}`;
    }

    // Append elements to the modal
    modal_1.appendChild(loader_1);
    modal_1.appendChild(iframe_1);
    modalContainer.appendChild(modal_1);

    var defaultIframeStyles = {
      width: "35%",
      height: "100%",
    };

    // Assign styles to the iframe
    Object.assign(iframe_1.style, defaultIframeStyles, style);
    modal_1.style.display = "flex";
    iframe_1.style.display = "none";

    // Show the loader while the iframe is loading
    iframe_1.addEventListener("load", function () {
      loader_1.style.display = "none";
      iframe_1.style.display = "flex";
    });

    // Close the modal when clicked outside of it

    modalContainer.addEventListener("click", function (event) {
      if (event.target === modal_1) {
        hide();
      }
    });

    return;
  }
}

function hide() {
  var modalContainer = document.getElementById("modal-pfm");

  if (modalContainer) {
    modalContainer.remove();
  }
}

function onMessagesListener(callback) {
  const handleMessage = (event) => {
    callback(event.data);
  };

  window.addEventListener("message", handleMessage);
}

var styles =
  "\n.modal {\n  position: fixed;\n  z-index: 1;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: none;\n  align-items: center;\n  justify-content: center;\n}\n\n.modal iframe {\n  width: auto;\n  height: auto;\n  max-width: 90%;\n  max-height: 90%;\n  border-radius: 20px;\n}\n\n.close-button {\n  position: absolute;\n  top: 7%;\n  right: 7%;\n  padding: 5px;\n  font-size: 16px;\n  background-color: #fff;\n  color: #000000;\n  font-weight: 500;\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  width: 30px;\n}\n\n.loader {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.loader:before {\n  content: '';\n  box-sizing: border-box;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 2px solid #fff;\n  border-top-color: transparent;\n  animation: loader-spin 0.8s linear infinite;\n}\n\n@keyframes loader-spin {\n  0% {\n    transform: rotate(0);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n";

// Agrega los estilos adicionales proporcionados
styles += `
@media screen and (max-width: 970px) {
  .modal-pfm iframe {
    width: 45% !important;
  }
}

@media screen and (max-width: 800px) {
  .modal-pfm iframe {
    width: 60% !important;
  }
}

@media screen and (max-width: 767px) {
  .modal-pfm iframe {
    width: 100% !important;
  }
}
`;

var styleElement = document.createElement("style");

styleElement.innerHTML = styles;

document.head.appendChild(styleElement);
