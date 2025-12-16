import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API = import.meta.env.VITE_API_URL + "/api/auth";


const LoginOtp = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState("enter-identifier");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendAvailable, setResendAvailable] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpTimer, setOtpTimer] = useState(300);

  const inputRefs = useRef([]);

  /* clear error automatically */
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  /* OTP validity timer */
  useEffect(() => {
    let interval;
    if (step === "enter-otp" && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  /* Resend cooldown timer */
  useEffect(() => {
    let interval;
    if (!resendAvailable && step === "enter-otp" && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setResendAvailable(true);
    }
    return () => clearInterval(interval);
  }, [resendAvailable, resendTimer, step]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

const sendOtpRequest = async () => {
  try {
    const value = identifier.trim();

    if (!value) {
      return setError("Enter email or phone");
    }

    const payload = value.includes("@")
      ? { email: value }
      : { phone: value };

    console.log("Sending OTP payload:", payload);

    await axios.post(`${API}/send-otp`, payload);

    setStep("enter-otp");
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(300);
    setResendAvailable(false);
    setResendTimer(30);
  } catch (err) {
    console.error("Send OTP Error:", err.response?.data);
    setError(err.response?.data?.message || "Failed to send OTP");
  }
};



  const handleSendOtp = () => {
    if (!identifier) return setError("Enter email or phone");
    sendOtpRequest();
  };

  const handleResendOtp = () => {
    if (resendAvailable) sendOtpRequest();
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return setError("Invalid OTP");
    try {
      await axios.post(`${API}/verify-otp`, {
        identifier,
        otp: finalOtp,
      });

      setUser({
        email: identifier,
        name: identifier.split("@")[0],
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-white flex">
      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2 h-[calc(100vh-4rem)]">
        <img
          src="/bg.png"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-4">
        <div className="w-full max-w-md flex flex-col justify-between min-h-[80vh]">
          <div className="mt-12">
            <h1 className="text-xl md:text-2xl font-semibold text-blue-800 mb-6 text-center md:text-left">
              {step === "enter-identifier"
                ? "Login to your Productr Account"
                : "Enter OTP"}
            </h1>

            {step === "enter-identifier" ? (
              <>
                <input
                  className="w-full px-4 py-3 rounded-md border focus:ring-2 focus:ring-blue-700 outline-none"
                  placeholder="Email or Phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />

                <p className="text-red-500 text-sm mt-2">{error}</p>

                <button
                  onClick={handleSendOtp}
                  className="mt-6 w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Send OTP
                </button>

                {/* SIGNUP CTA */}
               <p className="mt-30 text-sm border border-gray-300 text-gray-600 text-center py-4">
                  Don’t have a <span className="font-medium">Productr</span>{" "}
                  account?{" "}
                  <br />
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-blue-700 font-semibold cursor-pointer hover:underline"
                  >
                    Signup here
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between gap-2 mb-3 mt-4">
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      value={v}
                      maxLength={1}
                      onChange={(e) => handleChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-12 h-12 border rounded-md text-center text-lg focus:ring-2 focus:ring-blue-700"
                    />
                  ))}
                </div>

                <p className="text-red-500 text-sm">{error}</p>

                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={handleResendOtp}
                    disabled={!resendAvailable}
                    className={`text-blue-800 font-semibold text-sm ${
                      !resendAvailable
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Resend OTP {!resendAvailable && `(${resendTimer}s)`}
                  </button>
                  <span className="text-gray-500 text-sm">
                    OTP valid: {formatTime(otpTimer)}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                >
                  Verify OTP
                </button>

                <p
                  onClick={() => setStep("enter-identifier")}
                  className="mt-5 text-sm text-center text-blue-700 cursor-pointer hover:underline"
                >
                  ← Back to Login
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOtp;
