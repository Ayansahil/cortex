import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React from "react";
import { Bold, Italic, List, Heading1, Heading2 } from "lucide-react";

const NoteEditor = ({ content, onChange, placeholder = "Start typing your thoughts..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] prose prose-invert max-w-none text-gray-300 font-sans leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="relative">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex bg-zinc-900 border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-white/5 ${editor.isActive('bold') ? 'text-indigo' : 'text-gray-400'}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-white/5 ${editor.isActive('italic') ? 'text-indigo' : 'text-gray-400'}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 hover:bg-white/5 ${editor.isActive('heading', { level: 1 }) ? 'text-indigo' : 'text-gray-400'}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-white/5 ${editor.isActive('bulletList') ? 'text-indigo' : 'text-gray-400'}`}
        >
          <List size={16} />
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
