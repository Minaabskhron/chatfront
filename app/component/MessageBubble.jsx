import DeliveredSvg from "../_svg/DeliveredSvg";
import SentSvg from "../_svg/SentSvg";

const MessageBubble = ({ isSender, text, time, status }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
      <div>
        <div
          className={`px-4 py-2 rounded-2xl max-w-2xs break-words ${
            isSender
              ? "bg-blue-200 rounded-br-none"
              : "bg-gray-200 rounded-bl-none"
          }`}
        >
          <p>{text}</p>
        </div>
        <div
          className={`flex gap-1 ${
            isSender ? "justify-end" : "justify-start"
          } items-center`}
        >
          <div>{isSender && status === "sent" && <SentSvg />}</div>
          <div>{isSender && status === "delivered" && <DeliveredSvg />}</div>
          <span className="text-xs text-gray-700 block mt-1 text-right">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
