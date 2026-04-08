/**
 * Saldo Seguro - Login / Profile Selection Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { User, Heart } from 'lucide-react';

const PROFILES: UserProfile[] = [
  { id: 'caio', name: 'Caio', avatar: '👨‍💻' },
  { id: 'vanessa', name: 'Vanessa', avatar: '👩‍🎨' },
];

export default function Login() {
  const handleSelectProfile = (profileId: string) => {
    storage.setCurrentUser(profileId);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Saldo Seguro</h1>
        <p className="text-muted-foreground">Selecione seu perfil para acessar</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        {PROFILES.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectProfile(profile.id)}
            className="flex flex-col items-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-5xl mb-4 group-hover:bg-primary/20 transition-colors">
              {profile.avatar}
            </div>
            <span className="text-xl font-semibold text-foreground">{profile.name}</span>
          </motion.button>
        ))}
      </div>

      <footer className="mt-16 text-muted-foreground flex items-center gap-2">
        Feito com <Heart size={16} className="text-destructive fill-destructive" /> para sua segurança financeira
      </footer>
    </div>
  );
}
