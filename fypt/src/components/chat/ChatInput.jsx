import { useState, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  StopCircle,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const ChatInput = ({
  onSendMessage,
  onSendFile,
  placeholder = "Type your message...",
  disabled = false,
  loading = false,
  maxLength = 1000,
  supportedFileTypes = ["image/*", ".pdf", ".doc", ".docx", ".txt"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className,
  ...props
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Common emojis for quick access
  const quickEmojis = [
    "😊",
    "👍",
    "❤️",
    "😂",
    "😊",
    "🤔",
    "👏",
    "🙏",
    "💊",
    "🏥",
  ];

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();

      const messageText = message.trim();
      if (!messageText && selectedFiles.length === 0) return;

      try {
        if (selectedFiles.length > 0) {
          // Send file messages
          for (const file of selectedFiles) {
            await onSendFile?.(file.file, messageText || file.description);
          }
        } else {
          // Send text message
          await onSendMessage?.(messageText);
        }

        // Clear input
        setMessage("");
        setSelectedFiles([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [message, selectedFiles, onSendMessage, onSendFile]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        alert(
          `File ${file.name} is too large. Maximum size is ${
            maxFileSize / 1024 / 1024
          }MB`
        );
        return false;
      }

      // Check file type
      const isValidType = supportedFileTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace("*", ".*"));
      });

      if (!isValidType) {
        alert(`File ${file.name} is not supported`);
        return false;
      }

      return true;
    });

    const newFiles = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      description: "",
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input
    e.target.value = "";
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      // Cleanup object URLs
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return updated;
    });
  };

  const updateFileDescription = (fileId, description) => {
    setSelectedFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, description } : file))
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const file = new File([blob], "voice-message.wav", {
          type: "audio/wav",
        });
        handleFileSelect([file]);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setEmojiOpen(false);
    textareaRef.current?.focus();
  };

  const canSend =
    (message.trim().length > 0 || selectedFiles.length > 0) &&
    !disabled &&
    !loading;

  return (
    <div className={cn("relative", className)} {...props}>
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <Card className="mb-3 p-3 border-t">
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {file.type.startsWith("image/") ? (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <input
                    type="text"
                    placeholder="Add description..."
                    value={file.description}
                    onChange={(e) =>
                      updateFileDescription(file.id, e.target.value)
                    }
                    className="mt-1 w-full text-xs bg-transparent border-0 focus:ring-0 placeholder-gray-400"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Emoji Picker */}
      {emojiOpen && (
        <Card className="absolute bottom-full left-0 mb-2 p-3 z-10 shadow-lg">
          <div className="grid grid-cols-5 gap-1">
            {quickEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Main Input Area */}
      <Card
        className={cn(
          "border border-gray-200 overflow-hidden transition-colors",
          dragOver && "border-blue-500 bg-blue-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag Overlay */}
          {dragOver && (
            <div className="absolute inset-0 bg-blue-50/80 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">Drop files here</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex-shrink-0 h-9 w-9 p-0"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="w-full resize-none border-0 focus:ring-0 bg-transparent text-sm placeholder-gray-500 leading-relaxed"
                style={{ minHeight: "36px", maxHeight: "120px" }}
              />
              <div className="flex items-center justify-between mt-1">
                <span
                  className={cn(
                    "text-xs",
                    message.length > maxLength * 0.8
                      ? "text-amber-600"
                      : "text-gray-400",
                    message.length > maxLength * 0.95 ? "text-red-600" : ""
                  )}
                >
                  {message.length}/{maxLength}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Emoji Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEmojiOpen(!emojiOpen)}
                disabled={disabled}
                className="h-9 w-9 p-0"
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>

              {/* Voice Recording */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                className={cn(
                  "h-9 w-9 p-0",
                  isRecording && "text-red-600 bg-red-50"
                )}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? (
                  <StopCircle className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!canSend}
                className="h-9 w-9 p-0 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                title="Send message"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={supportedFileTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ChatInput;
