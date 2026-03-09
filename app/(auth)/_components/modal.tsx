"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative z-50 w-full max-w-sm rounded-xl p-5 px-12 shadow-xl bg-[#354152] flex flex-col">
        <button
          className="absolute top-5 right-5 text-red text-[15px] z-40 cursor-pointer hover:bg-gray-500 pt-1 pr-2 pb-1 pl-2 rounded-2xl"
          onClick={() => onClose()}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}