"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Modal from "./modal";
import ForgetPasswordForm from "./ForgotPasswordForm";

export default function AuthModals() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <>
      <button onClick={() => setShowLoginModal(true)}>Login</button>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onForgotPassword={() => {
            setShowLoginModal(false);
            setShowForgotPassword(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <RegisterForm
          onOpenLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      >
        <ForgetPasswordForm
          onOpenLogin={() => {
            setShowForgotPassword(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>
    </>
  );
}