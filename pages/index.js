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
            const uniqueCode = generateUniqueCode();
            setCode(uniqueCode);
            router.push(`/call/${uniqueCode}`);
        } catch (error) {
            console.error('Error accessing camera and microphone:', error);
        }
    };

    const handleJoinCall = () => {
        const inputCode = prompt('Enter the unique code:');
        if (inputCode) {
            if (inputCode === code) {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then(() => {
                        router.push(`/call/${inputCode}`);
                    })
                    .catch(error => {
                        console.error(
                            'Error accessing camera and microphone:',
                            error
                        );
                    });
            } else {
                alert('Call is not available. Invalid code.');
            }
        }
    };

    return (
        <div className='flex flex-col w-48 gap-3 '>
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
    );
}

function generateUniqueCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
