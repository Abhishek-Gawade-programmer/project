import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Mic, Video, Loader } from "lucide-react";
import { transcribeAudio } from "../services/whisper";
import { extractAudioFromVideo } from "../utils/videoProcessor";

interface AudioUploadProps {
  onTranscriptionComplete: (text: string) => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  onTranscriptionComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      let audioBlob: Blob;

      if (file.type.startsWith("video/")) {
        setProgress("Extracting audio from video...");
        audioBlob = await extractAudioFromVideo(file);
        setProgress("Audio extracted, transcribing...");
      } else {
        audioBlob = file;
        setProgress("Transcribing audio...");
      }

      // Convert Blob to File for the transcription API
      const audioFile = new File([audioBlob], "audio.wav", {
        type: "audio/wav",
      });
      const text = await transcribeAudio(audioFile);
      onTranscriptionComplete(text);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process file. Please try again."
      );
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      await processFile(file);
    },
    [onTranscriptionComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB max size
  });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          {isLoading ? (
            <>
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-600">{progress}</p>
            </>
          ) : (
            <>
              <div className="flex space-x-4">
                <Mic className="w-8 h-8 text-gray-400" />
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600">
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag and drop an audio or video file, or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports MP3, WAV, M4A, OGG, MP4, WEBM, and MOV formats
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 100MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default AudioUpload;
