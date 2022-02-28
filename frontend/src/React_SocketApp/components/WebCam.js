import React from 'react';
import '../css/WebCam.css'

let WebCam = () => {

    var stop = () =>{
        var stream = video.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }
        video.srcObject = null;
    }

    var start = () => {
        var video = document.getElementById("video"),
            vendorURL = window.URL || window.webkitURL;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                }).catch(function (error) {
                    console.log("Something went wrong");
                });
        }
    }


    return(
        <div class="webcam">
            <div class="video-outer">
                <video id="video" height="100%" width="100%" autoplay></video>
            </div>

            <div class="webcam-start-stop">
                <a href="#!" class="btn-start" onclick={() => {start()}}>Start</a>
                <a href="#!" class="btn-stop" onclick={() => {stop()}}>Stop</a>
            </div>
        </div>
    )
}

export {WebCam}

