// src/components/WhatsAppButton.tsx
import "./WhatsAppButton.css";


interface Props {
  onClick: () => void;
}

export default function WhatsAppButton({ onClick }: Props) {
  return (
    <button className="Btn" onClick={onClick}>
      <span className="sign">
        <svg viewBox="0 0 32 32">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.837.74 5.5 2.03 7.84L0 32l8.39-2.02A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zM16 29.333c-2.667 0-5.2-.667-7.467-2l-.533-.267-4.933 1.2 1.333-4.8-.333-.533C3.333 21.6 2.667 18.933 2.667 16 2.667 8.933 8.933 2.667 16 2.667c7.067 0 13.333 6.267 13.333 13.333 0 7.067-6.267 13.333-13.333 13.333z"/>
        </svg>
      </span>
    </button>
  );
}
