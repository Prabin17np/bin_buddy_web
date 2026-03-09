"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgetPasswordForm from "./ForgotPasswordForm";
import Modal from "./modal";

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogin(true)}>Login</button>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm
          onOpenRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onForgotPassword={() => {
            setShowLogin(false);
            setShowForgot(true);
          }}
        />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm
          onOpenLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </Modal>

      <Modal isOpen={showForgot} onClose={() => setShowForgot(false)}>
        <ForgetPasswordForm
          onOpenLogin={() => {
            setShowForgot(false);
            setShowLogin(true);
          }}
        />
      </Modal>
    </>
  );
}
