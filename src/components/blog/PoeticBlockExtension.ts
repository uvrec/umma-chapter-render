import { Node, mergeAttributes } from '@tiptap/core';

export interface PoeticBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    poeticBlock: {
      /**
       * Toggle poetic block
       */
      togglePoeticBlock: () => ReturnType;
      /**
       * Set poetic block
       */
      setPoeticBlock: () => ReturnType;
      /**
       * Unset poetic block
       */
      unsetPoeticBlock: () => ReturnType;
    };
  }
}

export const PoeticBlock = Node.create<PoeticBlockOptions>({
  name: 'poeticBlock',

  priority: 1000,

  group: 'block',

  content: 'block+',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'poetic-block',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.poetic-block',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setPoeticBlock:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      togglePoeticBlock:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
      unsetPoeticBlock:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-p': () => this.editor.commands.togglePoeticBlock(),
    };
  },
});
