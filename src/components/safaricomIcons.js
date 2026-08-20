import React from "react";
import {
  FaBroadcastTower, FaMoneyBillWave, FaFileInvoiceDollar, FaPhone, FaSms, FaThLarge,
  FaSimCard, FaWifi, FaHome, FaStore, FaWallet, FaMobileAlt, FaNetworkWired, FaLaptop,
  FaMoneyCheckAlt, FaHeadset,
} from "react-icons/fa";

/**
 * Icon per Safaricom service tile, keyed by `iconKey`.
 *
 * Shared by the homepage Safaricom Corner (whose tiles are admin-managed and
 * carry an iconKey from the database) and the /safaricom hub (whose tiles come
 * from constants/safaricomServices.js). One map, so a service cannot end up
 * with two different icons depending on where you meet it.
 */
const ICONS = {
  iot: FaBroadcastTower,
  mpesa: FaMoneyBillWave,
  paybill: FaFileInvoiceDollar,
  voice: FaPhone,
  sms: FaSms,
  sim: FaSimCard,
  data: FaWifi,
  fibre: FaHome,
  business: FaStore,
  pochi: FaWallet,
  app: FaMobileAlt,
  connectivity: FaNetworkWired,
  devices: FaLaptop,
  bulk: FaMoneyCheckAlt,
  support: FaHeadset,
  default: FaThLarge,
};

export default function ServiceIcon({ iconKey, className = "text-3xl" }) {
  const Icon = ICONS[iconKey] || ICONS.default;
  return <Icon className={className} aria-hidden="true" />;
}
