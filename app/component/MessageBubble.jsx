const MessageBubble = ({ isSender, text, time }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-2xs break-words ${
          isSender
            ? "bg-emerald-400 rounded-br-none"
            : "bg-white rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        <span className="text-xs text-gray-700 block mt-1 text-right">
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
