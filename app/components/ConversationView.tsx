"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Send,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { YunoProfile } from "../data";
import type { YunoMessage } from "../lib/messages-store";
import { playYunoSound } from "../lib/sound";
import { useI18n } from "../i18n/I18nProvider";

type ConversationViewProps = {
  profile: YunoProfile;
  messages: YunoMessage[];
  onBack: () => void;
  onSend: (text: string) => string;
  onReceive: (text: string) => void;
  onMarkRead: () => void;
  onMarkMessageRead: (messageId: string) => void;
};

export function ConversationView({
  profile,
  messages,
  onBack,
  onSend,
  onReceive,
  onMarkRead,
  onMarkMessageRead,
}: ConversationViewProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    onMarkRead();

    return () => {
      mountedRef.current = false;
    };
  }, [onMarkRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing]);

  function formatTime(timestamp: number) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  }

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    const messageId = onSend(trimmed);

    void playYunoSound("messageSent");

    setMessage("");
    setTyping(true);

    window.setTimeout(() => {
      onMarkMessageRead(messageId);
    }, 700);

    window.setTimeout(() => {
      if (mountedRef.current) {
        setTyping(false);
      }

      onReceive(
        t("messages.demoReply", {
          name: profile.name,
        }),
      );

      void playYunoSound("messageReceived");
    }, 1500);
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

        <span className="conversation-header__avatar">
          <Image
            src={profile.image}
            alt={profile.name}
            width={52}
            height={52}
          />
          <span className="conversation-header__online" />
        </span>

        <div>
          <strong>{profile.name}</strong>
          <span>{t("messages.online")}</span>
        </div>
      </header>

      <div className="conversation-body">
        {messages.length === 0 && (
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
        )}

        {messages.map((item) => (
          <div
            className={`conversation-message ${
              item.sender === "me"
                ? "conversation-message--mine"
                : "conversation-message--theirs"
            }`}
            key={item.id}
          >
            <div className="conversation-message__bubble">
              <span>{item.text}</span>

              <small>
                {formatTime(item.createdAt)}

                {item.sender === "me" && (
                  item.status === "read"
                    ? <CheckCheck size={13} />
                    : <Check size={13} />
                )}
              </small>
            </div>
          </div>
        ))}

        {typing && (
          <div className="conversation-message conversation-message--theirs">
            <div className="conversation-typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
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
