import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import useFormFields from "../hooks/useFormFields";
import { signup } from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const [values, handleChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
    setError("All fields are required.");
    return;
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  const response = await fetch(
    "http://localhost:5000/api/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    }
  );

  const data = await response.json();

  localStorage.setItem(
    "accessToken",
    data.session.accessToken
  );

  localStorage.setItem(
    "refreshToken",
    data.session.refreshToken
  );

  onRegistered?.(data);
};

    try {
      await signup({
        email,
        password,
      });

      navigate("/candidate-details");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="signup"
      values={values}
      error={error}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerText="Already registered?"
      footerAction={() => navigate("/login")}
    />
  );
}
