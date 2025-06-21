import VideoTutorials from '@/components/VideoTutorials';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Tutoriales - Conta-IA',
  description: 'Aprende a usar Conta-IA con nuestros video tutoriales paso a paso, desde conceptos básicos hasta características avanzadas',
};

export default function VideoTutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      <VideoTutorials />
    </div>
  );
}
