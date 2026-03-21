import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Paperclip } from 'lucide-react';
import LiquidButton from '../whacka/LiquidButton';

interface CreationSheetProps {
  onSubmit: (text: string) => void;
}

const quickActions = ['Budget App', 'Snake Game', 'Quiz', 'Todo List', 'Weather App'];

const CreationSheet: React.FC<CreationSheetProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Create something amazing</h2>
        <p className="text-sm text-muted-foreground">Describe your app idea and AI will build it</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => setText(action)}
            className="glass-button px-4 py-2 text-xs text-muted-foreground transition-colors min-h-[32px]"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="liquid-input rounded-2xl p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your app idea..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none resize-none text-sm leading-relaxed min-h-[100px]"
          rows={4}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mic Button */}
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className={`relative p-3 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isMicActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isMicActive && (
                <>
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-mic-pulse" />
                  <span className="absolute inset-0 rounded-full bg-primary/10 animate-mic-pulse [animation-delay:0.5s]" />
                </>
              )}
              <Mic size={20} className="relative z-10" />
            </button>
            <button className="p-3 rounded-full text-muted-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Paperclip size={20} />
            </button>
          </div>
          <LiquidButton
            variant="primary"
            size="sm"
            onClick={() => text.trim() && onSubmit(text)}
            icon={<Send size={16} />}
          >
            Generate
          </LiquidButton>
        </div>
      </div>
    </div>
  );
};

export default CreationSheet;
