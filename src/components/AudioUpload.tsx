import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Mic, Loader } from "lucide-react";
import { transcribeAudio } from "../services/whisper";

interface AudioUploadProps {
  onTranscriptionComplete: (text: string) => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  onTranscriptionComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const audioFile = acceptedFiles[0];
      if (!audioFile) return;

      setIsLoading(true);
      setError(null);

      try {
        const text = await transcribeAudio(audioFile);
        onTranscriptionComplete(text);
      } catch (err) {
        setError("Failed to transcribe audio. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [onTranscriptionComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg"],
    },
    maxFiles: 1,
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
              <p className="text-gray-600">Transcribing audio...</p>
            </>
          ) : (
            <>
              <Mic className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-gray-600">
                  {isDragActive
                    ? "Drop the audio file here"
                    : "Drag and drop an audio file, or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports MP3, WAV, M4A, and OGG formats
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
