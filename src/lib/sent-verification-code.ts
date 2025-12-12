export async function sendCodeToEmail(email: string) {
  try {
    const response = await fetch("/api/verify-email/sent-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to send verification code",
      };
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return {
      success: false,
      message: "An error occurred while sending the verification code",
    };
  }
}
