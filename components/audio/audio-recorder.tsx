import { useState, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const waveform = useRef<WaveSurfer | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.current.start(10);
      setIsRecording(true);

      // Start recording timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setRecordingTime(Date.now() - startTime);
      }, 100);

      return () => clearInterval(timer);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    setRecordingTime(0);
  };

  const togglePlayback = () => {
    if (!waveform.current) return;
    
    if (isPlaying) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        {audioChunks.current.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {isRecording && (
        <div className="space-y-2">
          <Progress value={(recordingTime / 60000) * 100} />
          <p className="text-sm text-gray-500">
            Recording: {Math.floor(recordingTime / 1000)}s
          </p>
        </div>
      )}

      <div id="waveform" className="w-full h-24" />
    </div>
  );
} 