"use client";

import Image from "next/image";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import type { YunoProfile } from "../data";
import { useI18n } from "../i18n/I18nProvider";

type ConversationViewProps = {
  profile: YunoProfile;
  onBack: () => void;
};

type DemoMessage = {
  id: number;
  text: string;
};

export function ConversationView({
  profile,
  onBack,
}: ConversationViewProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DemoMessage[]>([]);

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        text: trimmed,
      },
    ]);

    setMessage("");
  }

  return (
    <section className="conversation-view">
      <header className="conversation-header">
        <button
          className="conversation-header__back"
          type="button"
          onClick={onBack}
          aria-label={t("messages.back")}
        >
          <ArrowLeft size={19} />
        </button>

        <Image
          src={profile.image}
          alt={profile.name}
          width={52}
          height={52}
        />

        <div>
          <strong>{profile.name}</strong>
          <span>{t("messages.matchConnection")}</span>
        </div>
      </header>

      <div className="conversation-body">
        <div className="conversation-intro">
          <Image
            src={profile.image}
            alt={profile.name}
            width={76}
            height={76}
          />

          <span>{t("common.brandMatch")}</span>

          <strong>
            {t("messages.introTitle", {
              name: profile.name,
            })}
          </strong>

          <p>{t("messages.introCopy")}</p>
        </div>

        {messages.map((item) => (
          <div className="conversation-message conversation-message--mine" key={item.id}>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="conversation-composer">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder={t("messages.placeholder")}
          aria-label={t("messages.placeholder")}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={!message.trim()}
          aria-label={t("messages.send")}
        >
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
