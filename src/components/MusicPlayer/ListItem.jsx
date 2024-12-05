import React, { useEffect, useState } from 'react';

const ListItem = ({ song, onClick }) => {
    const [duration, setDuration] = useState(null);

    // Fetch the duration using the audio element
    useEffect(() => {
        const audio = new Audio(song.url);
        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration); // Set duration in seconds
        });

        // Clean up the event listener
        return () => {
            audio.removeEventListener('loadedmetadata', () => {});
        };
    }, [song.url]);

    return (
        <div
            className="flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-[#333333] w-full"
            onClick={onClick}
        >
            <img
                src={`${song.cover}`}
                alt={song.name}
                className="w-12 h-12 rounded-md object-cover"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/64')} // Fallback image
            />
            <div className="flex flex-col flex-grow">
                <h3 className="text-base font-medium truncate">{song.name}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>
            <div className="text-sm text-gray-400">
                {duration ? formatDuration(duration) : '--:--'}
            </div>
        </div>
    );
};

/**
 * Function to format duration (in seconds) to mm:ss format
 */
const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default ListItem;
