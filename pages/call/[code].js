import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function Call() {
    const router = useRouter();
    const videoRef = useRef();

    useEffect(() => {
        const code = router.query.code;
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
    }, [router.query.code]);

    return (
        <div>
            <h2>Video Call</h2>
            <video ref={videoRef} autoPlay></video>
        </div>
    );
}
