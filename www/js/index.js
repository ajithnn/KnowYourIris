
var socket;
var server="http://infinite-dusk-7803.herokuapp.com";

document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
$(document).ready(function() {
    socket = io(server);
    $("#click").click(function() {
        navigator.camera.getPicture(Upload, onFail, {
            quality: 30,
            destinationType: destinationType.FILE_URI,
            targetWidth: 512,
            targetHeight: 620
        });
    });
    $("#return").click(function() {
        $("#ButtonHold").show();
        $("#ImageHold").hide();
    });
});

function alertDismissed() {
    
}

function Upload(fileURL) {
    $("#ButtonHold").hide();
    $("#ImageHold").show();

    var win = function(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    socket.on('ImageModified', function(data) {
        $("#ValDisp img").remove();
        $("#ValDisp").append("<img src='" + server + data + "''/>");
    });

    var fail = function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        navigator.notification.alert(
            'Connect to the right network and try again', // message
            alertDismissed, // callback
            'Try Again', // title
            'Done' // buttonName
        );
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(fileURL, encodeURI(server + "/PostPhoto/"), win, fail, options);
}

function alertDismissed() {}

function onFail() {
}