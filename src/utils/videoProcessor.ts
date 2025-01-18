export const extractAudioFromVideo = (videoFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create video element to load the file
    const video = document.createElement('video');
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;

    // Set up audio context and nodes
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    let audioSource: MediaElementAudioSourceNode | null = null;
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks: BlobPart[] = [];

    // Handle audio data
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      URL.revokeObjectURL(videoUrl);
      resolve(audioBlob);
    };

    // Start recording when video can play
    video.oncanplay = () => {
      audioSource = audioContext.createMediaElementSource(video);
      audioSource.connect(destination);
      mediaRecorder.start();
      video.play();
    };

    // Handle video end
    video.onended = () => {
      if (audioSource) {
        audioSource.disconnect();
      }
      mediaRecorder.stop();
      audioContext.close();
    };

    // Handle errors
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to process video file'));
    };
  });
}; 