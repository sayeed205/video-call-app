import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleCreateCall = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            const response = await fetch('/api/call', { method: 'POST' });
            const { code } = await response.json();
            setCode(code);
            router.push(`/call/${code}`);
        } catch (error) {
            console.error('Error accessing camera and microphone:', error);
        }
    };

    const handleJoinCall = () => {
        const inputCode = prompt('Enter the unique code:');
        if (inputCode) {
            router.push(`/call/${inputCode}`);
        }
    };

    return (
        <div>
            {code && <p>Unique Code: {code}</p>}
            <button onClick={handleCreateCall}>Create Call</button>
            <button onClick={handleJoinCall}>Join Call</button>
        </div>
    );
}

/*<div className='flex flex-col w-48 gap-3 '>
            <button
                onClick={handleCreateCall}
                className='p-2 bg-blue-500 rounded-3xl'
            >
                Create Call
            </button>
            <button
                onClick={handleJoinCall}
                className='p-2 bg-blue-500 rounded-3xl'
            >
                Join Call
            </button>
        </div>
        */
