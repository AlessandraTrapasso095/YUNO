"use client";

import Image from "next/image";
import {
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { YunoProfile } from "../data";
import type {
  YunoConversation,
  YunoMessage,
} from "../lib/messages-store";
import { useI18n } from "../i18n/I18nProvider";

type MessagesViewProps = {
  profiles: YunoProfile[];
  conversations: YunoConversation[];
  messages: YunoMessage[];
  onOpenConversation: (profile: YunoProfile) => void;
  onDiscover: () => void;
};

export function MessagesView({
  profiles,
  conversations,
  messages,
  onOpenConversation,
  onDiscover,
}: MessagesViewProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const conversationProfiles = useMemo(() => {
    return conversations
      .map((conversation) => {
        const profile = profiles.find(
          (item) => item.id === conversation.profileId,
        );

        if (!profile) return null;

        const profileMessages = messages
          .filter(
            (message) =>
              message.profileId === conversation.profileId,
          )
          .sort((a, b) => b.createdAt - a.createdAt);

        return {
          profile,
          conversation,
          lastMessage: profileMessages[0] ?? null,
        };
      })
      .filter(
        (
          item,
        ): item is NonNullable<typeof item> => Boolean(item),
      )
      .sort(
        (a, b) =>
          b.conversation.updatedAt -
          a.conversation.updatedAt,
      );
  }, [conversations, messages, profiles]);

  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();

    if (!normalized) return conversationProfiles;

    return conversationProfiles.filter(({ profile }) => {
      const values = [
        profile.name,
        t(`profiles.${profile.key}.city`),
        t(`profiles.${profile.key}.country`),
        ...profile.teaches.map((skill) =>
          t(`skills.${skill}`),
        ),
      ];

      return values.some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      );
    });
  }, [conversationProfiles, query, t]);

  function formatTime(timestamp: number) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  }

  return (
    <section className="messages-view">
      <header className="messages-view__header">
        <div>
          <span className="app-kicker">
            {t("messages.inbox.kicker")}
          </span>

          <h1>{t("messages.inbox.title")}</h1>
          <p>{t("messages.inbox.copy")}</p>
        </div>

        {conversationProfiles.length > 0 && (
          <div className="messages-view__count">
            <MessageCircle size={15} />
            <strong>{conversationProfiles.length}</strong>
          </div>
        )}
      </header>

      {conversationProfiles.length > 0 && (
        <div className="messages-search">
          <Search size={18} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder={t("messages.inbox.search")}
            aria-label={t("messages.inbox.search")}
          />
        </div>
      )}

      {conversationProfiles.length === 0 ? (
        <div className="messages-empty">
          <span className="messages-empty__icon">
            <MessageCircle size={27} />
          </span>

          <span className="app-kicker">
            {t("messages.inbox.emptyKicker")}
          </span>

          <h2>{t("messages.inbox.emptyTitle")}</h2>
          <p>{t("messages.inbox.emptyCopy")}</p>

          <button type="button" onClick={onDiscover}>
            <Sparkles size={17} />
            {t("messages.inbox.emptyAction")}
          </button>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="messages-search-empty">
          <Search size={23} />
          <strong>
            {t("messages.inbox.noResultsTitle")}
          </strong>
          <span>{t("messages.inbox.noResultsCopy")}</span>
        </div>
      ) : (
        <div className="messages-list">
          {filteredConversations.map(
            ({
              profile,
              conversation,
              lastMessage,
            }) => (
              <button
                className="message-preview"
                type="button"
                key={profile.id}
                onClick={() =>
                  onOpenConversation(profile)
                }
              >
                <span className="message-preview__avatar">
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={58}
                    height={58}
                  />

                  <span
                    className="message-preview__online"
                    aria-label={t(
                      "messages.inbox.online",
                    )}
                  />
                </span>

                <span className="message-preview__content">
                  <span className="message-preview__top">
                    <strong>{profile.name}</strong>

                    <time>
                      {lastMessage
                        ? formatTime(
                            lastMessage.createdAt,
                          )
                        : t("messages.inbox.now")}
                    </time>
                  </span>

                  <span className="message-preview__bottom">
                    <span>
                      {lastMessage
                        ? `${
                            lastMessage.sender === "me"
                              ? t(
                                  "messages.inbox.youPrefix",
                                )
                              : ""
                          }${lastMessage.text}`
                        : t(
                            "messages.inbox.newMatchMessage",
                          )}
                    </span>

                    {conversation.unread > 0 && (
                      <em>
                        {conversation.unread}
                      </em>
                    )}
                  </span>
                </span>
              </button>
            ),
          )}
        </div>
      )}
    </section>
  );
}
