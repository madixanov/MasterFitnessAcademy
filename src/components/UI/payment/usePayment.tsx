"use client";

import { useState } from "react";
import { createPayment, PaymentPayload } from "@/services/payment/payment.api";

export function usePayment() {
  const [paying, setPaying] = useState(false);

  const payWithClick = async (
    payload: PaymentPayload,
    onSuccess?: () => void
  ) => {
    try {
      setPaying(true);

      const { paymentUrl } = await createPayment(payload);

      if (!paymentUrl) {
        throw new Error("Payment URL not found");
      }

      window.location.href = paymentUrl;
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании платежа");
    } finally {
      setPaying(false);
    }
  };

  return {
    paying,
    payWithClick,
  };
}
