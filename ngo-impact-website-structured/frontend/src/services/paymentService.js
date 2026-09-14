const API_URL =
  import.meta.env.VITE_API_URL;

export const createPaymentOrder =
  async (donationData) => {

    const response = await fetch(
      `${API_URL}/api/payment/create-order`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          donationData
        ),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to create payment order."
      );
    }

    return data;
  };


export const verifyPayment =
  async (paymentData) => {

    const response = await fetch(
      `${API_URL}/api/payment/verify-payment`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          paymentData
        ),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Payment verification failed."
      );
    }

    return data;
  };