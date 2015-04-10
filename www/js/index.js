
var socket;
var id;
var server="http://infinite-dusk-7803.herokuapp.com";
var networkState;

document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    Direction = navigator.camera.Direction;
    networkState = navigator.connection.type;
}
$(document).ready(function() {
    socket = io(server);
    socket.on('connect',function(){
        id = socket.io.engine.id;
    });

    $("#click").click(function() {
        if(networkState == "3g" || networkState == "wifi")
        {
        navigator.camera.getPicture(Upload, onFail, {
            quality: 100,
            cameraDirection:Direction.FRONT,
            destinationType: destinationType.FILE_URI
        });
    }
    else{
        navigator.camera.getPicture(Upload, onFail, {
            quality: 70,
            cameraDirection:Direction.FRONT,
            destinationType: destinationType.FILE_URI,
            targetWidth: 960,
            targetHeight: 1280    
        });        
    }
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
        $.ajax({
            url:server + "/runpy?id=" + id,
            type:"GET",
            success:alertDismissed
        });
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
