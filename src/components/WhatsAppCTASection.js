import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaRegComment } from "react-icons/fa";
import { waLink, HOURS_DISPLAY } from "@/constants/business";

const whatsappLink = waLink("Hello Snaap Connections, I need help with...");

export default function WhatsAppCTASection() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative my-5 overflow-hidden rounded-[32px] px-2 py-4 text-center md:my-8 md:py-6"
      style={{ background: "linear-gradient(100deg, #6dd5ed 0%, #1e3c72 120%)", boxShadow: "0 4px 36px 0 #1e3c7211, 0 1.5px 16px #6dd5ed22" }}
    >
      <style>{`
        @keyframes whatsapp-pulse { 0% { box-shadow: 0 0 0 0 #25d36677;} 50% { box-shadow: 0 0 24px 8px #25d36644;} 100% { box-shadow: 0 0 0 0 #25d36677;} }
        .whatsapp-circular { background: linear-gradient(120deg,#25d366 60%,#128c7e 100%); color:#fff; border-radius:50%; width:68px; height:68px; display:flex; align-items:center; justify-content:center; margin:0 auto; box-shadow:0 4px 24px #25d36633; animation: whatsapp-pulse 2.5s infinite; transition: transform 0.25s cubic-bezier(.4,2,.4,1); }
        .whatsapp-circular:hover { transform: scale(1.09) rotate(-6deg); box-shadow:0 8px 36px #25d36677; }
        .cta-bubble { opacity: 0; }
        .cta-bubble.show { animation: bubbleIn 0.9s cubic-bezier(.4,2,.4,1) forwards; }
        @keyframes bubbleIn { 0% { opacity:0; transform: translateY(25px) scale(0.96);} 60% { opacity:1; transform: translateY(-6px) scale(1.07);} 100% { opacity:0.14; transform: translateY(0) scale(1);} }
      `}</style>

      <div className={`pointer-events-none absolute left-4 top-3 z-[1] md:left-16 md:top-5 ${showBubble ? "cta-bubble show" : "cta-bubble"}`} aria-hidden="true">
        <FaRegComment className="text-white text-[54px] md:text-[88px]" />
      </div>

      <div className="relative z-[2] flex flex-col items-center gap-6">
        <a href={whatsappLink} target="_blank" rel="noopener" className="whatsapp-circular" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp!">
          <FaWhatsapp className="text-[38px]" />
        </a>
        <h2 className="mb-1 font-extrabold tracking-wide text-white text-[1.5rem] md:text-[2.1rem]" style={{ textShadow: "0 2px 18px #1e3c72cc" }}>
          Need Help? Chat with Us on WhatsApp!
        </h2>
        <p className="mx-auto mb-2 max-w-[480px] font-medium text-[#e6f2ff] opacity-90">
          Our friendly team is ready to answer your questions, recommend the perfect phone, or assist with your order—instantly.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener"
          aria-label="Chat with us on WhatsApp"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-white shadow-[0_2px_12px_#25d36622] transition hover:shadow-[0_3px_24px_#25d36655] active:scale-95 text-[1.08rem] md:px-12 md:text-[1.19rem]"
          style={{ background: "linear-gradient(96deg,#1e3c72 50%,#25d366 100%)" }}
        >
          <FaWhatsapp className="text-[1.3em]" /> Start WhatsApp Chat
        </a>
        <p className="mt-2 text-center text-[#d6f9e7] opacity-80 text-sm">
          Available <b>{HOURS_DISPLAY}</b>
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-[-4px] left-0 z-[1] w-full" aria-hidden="true">
        <svg width="100%" height="36" viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,18 C360,36 1080,0 1440,18 L1440,36 L0,36 Z" fill="#25d366" fillOpacity="0.18" />
        </svg>
      </div>
    </section>
  );
}
