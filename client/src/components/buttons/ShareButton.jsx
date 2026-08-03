import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaTwitter,
  FaLinkedin,
  FaRegClipboard,
  FaClipboardCheck,
} from "react-icons/fa";
import { useState } from "react";


const ShareButton = ({ text, url , onClose}) => {
  const [copied, setCopied] = useState(false);

  const message = encodeURIComponent(`${text} ${url}`);

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleMessengerShare = () => {
    window.open(
      `fb-messenger://share/?link=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${message}`,
      "_blank"
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    });
  };

  return (
    <div className="mt-10 border rounded-3xl p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">
        <span className="text-amber-900" onClick={onClose}>X</span>
        Share this content
      </h1>

      <div className="flex justify-center gap-4 mb-5">
        <button
          onClick={handleWhatsAppShare}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <FaWhatsapp size={24} />
        </button>

        <button
          onClick={handleMessengerShare}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FaFacebookMessenger size={24} />
        </button>

        <button
          onClick={handleTwitterShare}
          className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500"
        >
          <FaTwitter size={24} />
        </button>

        <button
          onClick={handleLinkedInShare}
          className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800"
        >
          <FaLinkedin size={24} />
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
            copied
              ? "bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {copied ? (
            <FaClipboardCheck size={24} />
          ) : (
            <FaRegClipboard size={16} />
          )}

          {copied ? "Copied!" : "Copy URL"}
        </button>
      </div>
    </div>
  );
};

export default ShareButton;