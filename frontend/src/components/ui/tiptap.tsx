import '@tiptap/react';
import { TextAlign } from '@tiptap/extension-text-align';

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    TextAlign: {
      setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => ReturnType;
    };
  }
}
