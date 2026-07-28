"use client";
import React from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import {
  ADDRESS,
  EMAIL,
  HOURS_DISPLAY,
  PHONE_DISPLAY,
  PHONE_E164,
  SOCIAL,
  waLink,
} from "@/constants/business";

/**
 * Rebuilt 27 Jul 2026. The previous version was unmodified starter-template
 * boilerplate: a Nigerian street address, a Nigerian placeholder phone number,
 * a malformed wa.me link with a duplicated country-code digit, invented opening
 * hours, dead social links, and a Google Maps embed whose src was a literal
 * ellipsis. Every value below now comes from src/constants/business.js.
 */
export default function ContactSection() {
  const mapsQuery = encodeURIComponent(`${ADDRESS.full}`);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600">
            WhatsApp is the fastest way to reach us — that is how we take orders.
            Walk-ins are welcome at the shop on Digo Road.
          </p>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0" />
              <span>{ADDRESS.full}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaWhatsapp className="shrink-0" />
              <a
                href={waLink("Hello Snaap Connections, I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline font-medium"
              >
                Chat on WhatsApp — {PHONE_DISPLAY}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="shrink-0" />
              <a href={`tel:${PHONE_E164}`} className="text-blue-600 hover:underline">
                {PHONE_DISPLAY}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="shrink-0" />
              <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">
                {EMAIL}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <FaClock className="shrink-0" />
              <span>{HOURS_DISPLAY}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snaap Connections on Facebook"
              className="text-blue-700 hover:scale-110 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snaap Connections on Instagram"
              className="text-pink-500 hover:scale-110 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snaap Connections on TikTok"
              className="text-gray-900 hover:scale-110 transition"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>

        <div className="w-full rounded-xl overflow-hidden shadow-lg bg-white p-6">
          {/*
            No map embed until the Google Business Profile is claimed and gives us a
            verified pin. The previous embed pointed at a placeholder URL and the
            directions link pointed at Lagos, Nigeria. A search link is honest and
            always resolves.
          */}
          <h3 className="font-semibold text-gray-800 text-lg">Find the shop</h3>
          <p className="text-gray-600 mt-2">
            We are on Digo Road, opposite Baroda Mall, in Mombasa town.
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition mt-4"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
