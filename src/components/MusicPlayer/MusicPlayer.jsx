import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import ListItem from "./ListItem";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";
import { FiVolumeX, FiVolume2 } from "react-icons/fi";  // Importing mute/unmute icons

const API_URL = "https://cms.samespace.com/items/songs";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);  // State to handle mute/unmute
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  const audioRef = useRef(null);

  const songGradients = [
    { name: "Colors", gradient: ["rgba(51, 30, 0, 0.9)", "rgba(106, 59, 31, 0.9)"] },
    { name: "August", gradient: ["rgba(10, 9, 47, 0.9)", "rgba(30, 27, 80, 0.9)"] },
    { name: "Fallen Leaves", gradient: ["rgba(89, 18, 63, 0.9)", "rgba(158, 42, 46, 0.9)"] },
    { name: "November", gradient: ["rgba(11, 86, 91, 0.9)", "rgba(78, 140, 143, 0.9)"] },
    { name: "Uplift", gradient: ["rgba(51, 26, 5, 0.9)", "rgba(180, 80, 40, 0.9)"] },
    { name: "First Touch", gradient: ["rgba(51, 43, 5, 0.9)", "rgba(110, 77, 41, 0.9)"] },
    { name: "Sunflowers", gradient: ["rgba(87, 0, 26, 0.9)", "rgba(206, 44, 29, 0.9)"] },
    { name: "Illusion Feel", gradient: ["rgba(22, 13, 94, 0.9)", "rgba(63, 42, 134, 0.9)"] },
  ];
  
  

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data.data;
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (selectedSong) {
      const index = songs.findIndex((song) => song.id === selectedSong.id);
      setCurrentSongIndex(index);
    }
  }, [selectedSong, songs]);

  useEffect(() => {
    if (selectedSong && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [selectedSong]);

  useEffect(() => {
    // Find the gradient for the selected song
    const songGradient = selectedSong
      ? songGradients.find((gradient) => gradient.name === selectedSong.name)?.gradient
      : null;

    // Apply the gradient to the body and song display section
    if (songGradient) {
      const gradientString = `linear-gradient(to right, ${songGradient[0]}, ${songGradient[1]})`;
      document.body.style.background = gradientString;
      document.getElementById("songDisplayColumn").style.background = "transparent"; // Make right section transparent
    } else {
      // If no gradient found, set a default background
      document.body.style.background = "#121212"; // Dark default background
      document.getElementById("songDisplayColumn").style.background = "transparent"; // Default transparent background
    }
  }, [selectedSong]);

  const filteredSongs =
    activeTab === "topTracks"
      ? songs.filter((song) => song.top_track)
      : songs.filter(
          (song) =>
            song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
    }
  }, [selectedSong]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentSongIndex > 0) {
      const prevSong = songs[currentSongIndex - 1];
      setSelectedSong(prevSong);
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      const nextSong = songs[currentSongIndex + 1];
      setSelectedSong(nextSong);
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const handleProgressBarChange = (e) => {
    const value = e.target.value;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="text-white py-4">
      <div className="flex flex-col lg:flex-row max-w-[1200px] mx-auto">
        {/* Left Section */}
        <div className="w-full lg:w-[200px] flex-shrink-0 flex flex-col items-start gap-6 mb-6 lg:mb-0">
          <div className="text-2xl font-bold flex items-center gap-2">
            <FaSpotify className="text-2xl" />
            <span>Spotify</span>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex-grow flex flex-col gap-6 px-6">
          <div className="flex gap-4 mb-4">
            <div
              onClick={() => setActiveTab("forYou")}
              className={`px-4 py-2 rounded-full cursor-pointer ${activeTab === "forYou" ? "bg-[#282828]" : "hover:bg-[#333333]"}`}
            >
              For You
            </div>
            <div
              onClick={() => setActiveTab("topTracks")}
              className={`px-4 py-2 rounded-full cursor-pointer ${activeTab === "topTracks" ? "bg-[#282828]" : "hover:bg-[#333333]"}`}
            >
              Top Tracks
            </div>
          </div>

          <div className="flex items-center bg-[#282828] rounded-full px-4 py-2 w-full max-w-[500px] mb-2">
            <FiSearch className="text-[#b3b3b3] mr-2" />
            <input
              type="text"
              placeholder="Search Song, Artist"
              className="bg-transparent border-none outline-none text-white flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredSongs.length === 0 ? (
              <p className="text-gray-500">No songs found.</p>
            ) : (
              filteredSongs.map((song) => (
                <ListItem
                  key={song.id}
                  song={{
                    ...song,
                    cover: `https://cms.samespace.com/assets/${song.cover}`,
                  }}
                  onClick={() => setSelectedSong(song)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Section */}
        <div
          id="songDisplayColumn"
          className="w-full lg:w-[500px] p-6 rounded-lg flex flex-col items-center"
        >
          {selectedSong ? (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-white mb-4">{selectedSong.name}</h2>
              <p className="text-lg text-gray-400 mb-6">{selectedSong.artist}</p>
              <img
                src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                alt={selectedSong.name}
                className="h-80 w-80 object-cover rounded-md mb-4"
              />
              <audio ref={audioRef} src={selectedSong.url} onEnded={handleNext} />
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleProgressBarChange}
                className="w-full my-4 h-1 bg-gray-700 rounded-full appearance-none"
                style={{
                  background: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, #4a4a4a ${(currentTime / duration) * 100}%)`,
                }}
              />
              <div className="flex gap-6 items-center">
                <button onClick={handlePrev} className="text-2xl">
                  <FiSkipBack />
                </button>
                <button onClick={togglePlayPause} className="text-2xl">
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <button onClick={handleNext} className="text-2xl">
                  <FiSkipForward />
                </button>
                <button onClick={toggleMute} className="text-2xl ml-4">
                  {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Select a song to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
