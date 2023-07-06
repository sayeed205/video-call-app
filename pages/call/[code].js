import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function Call() {
    const router = useRouter();
    const videoRef = useRef();
    const remoteVideoRef = useRef();
    const code = router.query.code;
    const peerConnectionRef = useRef(null);

    useEffect(() => {
        const initializePeerConnection = async () => {
            const videoStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            videoRef.current.srcObject = videoStream;

            const configuration = {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            };
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnectionRef.current = peerConnection;

            videoStream
                .getTracks()
                .forEach(track => peerConnection.addTrack(track, videoStream));

            peerConnection.ontrack = event => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    // Send the candidate to the other peer
                }
            };

            // Create and send an offer to the other peer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            // Send the offer to the other peer
        };

        initializePeerConnection();

        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
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
