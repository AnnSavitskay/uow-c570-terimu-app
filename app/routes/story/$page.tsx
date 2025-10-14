import { Button } from "~/components/ui/button";
import type { Route } from "./+types/$page";
import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import { useEffect, useRef, useState } from "react";
import { story } from "./data";

const gameConfig = [
  { game: 1, afterPage: 4, url: "/game/1" },
  { game: 2, afterPage: 6, url: "/game/2" },
  { game: 3, afterPage: 17, url: "/game/3" },
] as const;

export default function Page({ params }: Route.ComponentProps) {
  const currentPage = parseInt(params.page);
  if (isNaN(currentPage) || currentPage <= 0 || currentPage > story.pages.length) {
    return (
      <div className=" p-4 flex">
        <div className="max-w-4xl mx-auto grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
          >
            <Link to="/story/1">Go to First Page</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pageId = currentPage - 1;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  let nextPage = currentPage < story.pages.length ? currentPage + 1 : null;

  const gameForThisPage = gameConfig.find((config) => config.afterPage === currentPage); //TODO

  let nextPath: string | null = null;
  if (gameForThisPage && nextPage) {
    nextPath = `${gameForThisPage.url}?redirect=/story/${nextPage}`;
  } else if (nextPage) {
    nextPath = `/story/${nextPage}`;
  }

  const prevPath = prevPage ? `/story/${prevPage}` : null;
  const vidPath = `/vid/v${currentPage}.mp4`;
  const imgPath = `/img/p${currentPage}.png`;

  const { lang, toggleLanguage } = useLang("mi");

  // Get audio data for current page and language
  const currentPageData = story.pages[pageId];
  const audioData = currentPageData.audio["mi"];
  const audPath = audioData.src;

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Update audio source when page or language changes
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current && audPath) {
      audioRef.current.src = audPath;
      audioRef.current.load();

      // Set start time if available
      if (audioData?.start !== undefined) {
        audioRef.current.currentTime = audioData.start;
      }
    }
  }, [currentPage, lang, audPath, audioData]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    const handleAudioError = () => {
      setIsPlaying(false);
      console.log(`Audio file for page ${currentPage} not found`);
    };

    const handleTimeUpdate = () => {
      // Stop audio at end time if specified
      if (audioData?.end !== undefined && audio.currentTime >= audioData.end) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      // Set start time when metadata is loaded
      if (audioData?.start !== undefined) {
        audio.currentTime = audioData.start;
      }
    };

    audio.addEventListener("ended", handleAudioEnd);
    audio.addEventListener("error", handleAudioError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.removeEventListener("error", handleAudioError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentPage, audioData]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Set start time before playing
      if (audioData?.start !== undefined) {
        audioRef.current.currentTime = audioData.start;
      }

      audioRef.current.play().catch((error) => {
        console.log("Audio play failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-full p-4 flex">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      <div className="max-w-4xl mx-auto grow flex flex-col">
        {/* Header */}
        <div className="text-center mb-3">
          {/* <h1 className="text-2xl font-bold text-gray-800 mb-2">{story.title[lang]}</h1> */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {/* <span>
              Page {currentPage + 1} of {story.pages.length}
            </span> */}
            <div className="flex gap-1 items-center justify-center">
              {story.pages.map((_, index) => (
                <NavLink
                  key={index}
                  to={`/story/${index + 1}`}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    setIsPlaying(false);
                  }}
                  className="rounded-full hover:bg-purple-300 bg-gray-300 size-2 [&.active]:bg-purple-500 [&.active]:size-3"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Main Story Card */}
        <div
          className="shadow-2xl rounded-2xl overflow-hidden p-0 grow flex flex-col"
          // onTouchStart={onTouchStart}
          // onTouchMove={onTouchMove}
          // onTouchEnd={onTouchEnd}
        >
          {/* Story Image */}
          <div className="relative w-full aspect-square overflow-hidden">
            <video
              src={vidPath}
              poster={imgPath}
              autoPlay
              loop
              muted
              playsInline
              controlsList="nodownload nofullscreen noremoteplayback"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 flex">
              {prevPage && (
                <Link
                  to={`/story/${prevPage}`}
                  className="grow bg-gradient-to-l from-transparent to-black/20 transition-opacity hover:opacity-100 opacity-0 duration-500"
                />
              )}

              {nextPage && (
                <Link
                  to={`/story/${nextPage}`}
                  className="grow bg-gradient-to-r from-transparent to-black/20 transition-opacity hover:opacity-100 opacity-0 duration-500"
                />
              )}
            </div>
            <div className="absolute flex items-center gap-2 bottom-0 right-0 m-3">
              <Button
                onClick={toggleLanguage}
                size="lg"
                className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full flex "
              >
                <RefreshCcw className="w-4 h-4" />
                <p>{lang === "en" ? "English" : "Te Reo Māori"}</p>
              </Button>
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                <AudioLines className={`w-6 h-6 ml-1 ${isPlaying ? "animate-caret-blink" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Story Text */}
          <div className="p-6 flex flex-col justify-between grow sm:min-h-72">
            <div className="">
              <div className="flex justify-end items-center mb-4">
                {/* <h2 className="text-2xl md:text-3xl font-bold">{story.title[lang]}</h2> */}
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                {story.pages[pageId].text[lang]}
              </p>
            </div>

            {/* Last Page */}
            {/* {currentPage === story.pages.length - 1 && (
              <div className="flex justify-center flex-col md:flex-row gap-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
                >
                  <Link to="/game1">Play "Find Te Rimu"</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
                >
                  <Link to="/game2">Play "Correct the Story"</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
                >
                  <Link to="/game3">Play "Matching game"</Link>
                </Button>
              </div>
            )} */}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {currentPage > 1 && (
                <Button
                  // onClick={prevPage}
                  // disabled={currentPage === 0}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  asChild
                >
                  <Link to={`/story/${currentPage - 1}`}>
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                </Button>
              )}
              <div className="grow" />

              {currentPage === story.pages.length ? (
                <Button
                  asChild
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Link to="/game/3">Play "Find Te Rimu"</Link>
                </Button>
              ) : nextPath ? (
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  asChild
                >
                  <Link to={nextPath}>
                    {gameForThisPage ? `Play Game ${gameForThisPage.game}` : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useLang(initial: "mi" | "en" = "mi") {
  const [lang, setLang] = useState<"mi" | "en">(initial);
  const toggleLanguage = () => setLang((l) => (l === "mi" ? "en" : "mi"));
  return { lang, toggleLanguage };
}
