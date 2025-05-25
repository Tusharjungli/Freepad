// components/RichWritingArea.tsx
"use client";
import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

function sanitize(input: string) {
  const div = document.createElement("div");
  div.innerHTML = input;
  return div.innerHTML;
}

type RichWritingAreaProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const RichWritingArea = forwardRef<HTMLDivElement, RichWritingAreaProps>(
  ({ value, onChange, placeholder = "Start writing..." }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);

    useImperativeHandle(ref, () => editorRef.current as HTMLDivElement, []);

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = sanitize(value);
      }
    }, [value]);

    const handleInput = () => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    return (
      <div className="relative w-full flex justify-center">
        {/* Placeholder absolutely positioned */}
        {!value && !focused && (
          <span
            className="absolute left-16 top-16 text-gray-400 pointer-events-none select-none z-10"
            style={{
              userSelect: "none",
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          className={`
            w-full
            max-w-5xl
            min-h-[420px] md:min-h-[600px] 
            p-12
            bg-gray-100 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-3xl shadow
            font-medium text-xl
            focus:outline-none
            transition
            z-20
            relative
          `}
          contentEditable
          suppressContentEditableWarning
          spellCheck={true}
          tabIndex={0}
          aria-label="Writing area"
          onInput={handleInput}
          style={{ outline: "none", minHeight: "420px" }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    );
  }
);

RichWritingArea.displayName = "RichWritingArea";
export default RichWritingArea;
