import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function Call() {
    const router = useRouter();
    const videoRef = useRef();
    const remoteVideoRef = useRef();
    const code = router.query.code;

    useEffect(() => {
        const videoStream = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        videoStream.then(stream => {
            videoRef.current.srcObject = stream;
        });

        return () => {
            videoStream.then(stream => {
                stream.getTracks().forEach(track => track.stop());
            });
        };
    }, []);

    useEffect(() => {
        const peerConnection = new RTCPeerConnection();

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(stream => {
                stream
                    .getTracks()
                    .forEach(track => peerConnection.addTrack(track, stream));
            })
            .catch(error => {
                console.error('Error accessing camera and microphone:', error);
            });

        peerConnection.ontrack = event => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                // Send the candidate to the other peer
            }
        };

        // Create and send an offer to the other peer
        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer).then(() => {
                // Send the offer to the other peer
            });
        });

        // Handle the answer from the other peer
        // peerConnection.setRemoteDescription(answer);

        return () => {
            // Close the connection and stop the tracks
            peerConnection.close();
        };
    }, []);

    return (
        <div>
            <h2>Video Call</h2>
            <p>Unique Code: {code}</p>
            <video ref={videoRef} autoPlay></video>
            <video ref={remoteVideoRef} autoPlay></video>
        </div>
    );
}
