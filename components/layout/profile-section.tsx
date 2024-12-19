'use client'

import { useState } from 'react'
import { BrainCircuit, Upload, Edit2 } from 'lucide-react'

export default function ProfileSection() {
  const [title, setTitle] = useState('Welcome to\nHappy Brain:')
  const [subtitle, setSubtitle] = useState('The neuroscience of happiness\nin your pocket')
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative z-10 w-[80vw] mx-auto px-4 py-8 flex-grow flex flex-col justify-center" style={{ height: '70vh' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/4 w-[20vw] h-[20vh] bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-[15vw] h-[15vh] bg-white/5 rounded-full blur-2xl animate-pulse" />

      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center mb-4 overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-pink-400" />
            )}
            <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <Upload className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="relative group">
          {isEditing ? (
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-2 bg-transparent border-none focus:outline-none resize-none"
              rows={2}
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-2 drop-shadow-lg cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </span>
              ))}
              <Edit2 className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 inline-block ml-2" />
            </h1>
          )}
        </div>

        <div className="relative group">
          {isEditing ? (
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-base md:text-lg lg:text-xl text-white/90 text-center bg-transparent border-none focus:outline-none resize-none"
              rows={2}
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <p 
              className="text-base md:text-lg lg:text-xl text-white/90 text-center drop-shadow cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {subtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < subtitle.split('\n').length - 1 && <br />}
                </span>
              ))}
              <Edit2 className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 inline-block ml-2" />
            </p>
          )}
        </div>
      </div>
    </div>
  )
}