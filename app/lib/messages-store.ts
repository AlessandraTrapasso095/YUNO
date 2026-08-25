"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "yuno_messages_store";
const STORAGE_EVENT = "yuno-messages-store-change";

export type MessageStatus = "sent" | "read";

export type YunoMessage = {
  id: string;
  profileId: number;
  sender: "me" | "them";
  text: string;
  createdAt: number;
  status: MessageStatus;
};

export type YunoConversation = {
  profileId: number;
  unread: number;
  updatedAt: number;
};

type MessageStore = {
  conversations: YunoConversation[];
  messages: YunoMessage[];
};

const emptyStore: MessageStore = {
  conversations: [],
  messages: [],
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

function parseStore(snapshot: string): MessageStore {
  if (!snapshot) return emptyStore;

  try {
    const parsed = JSON.parse(snapshot) as Partial<MessageStore>;

    return {
      conversations: Array.isArray(parsed.conversations)
        ? parsed.conversations
        : [],
      messages: Array.isArray(parsed.messages)
        ? parsed.messages
        : [],
    };
  } catch {
    return emptyStore;
  }
}

function saveStore(store: MessageStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Database persistence will replace this temporary store later.
  }
}

export function resetMessagesStore() {
  saveStore(emptyStore);
}

function readStore() {
  try {
    return parseStore(
      window.localStorage.getItem(STORAGE_KEY) ?? "",
    );
  } catch {
    return emptyStore;
  }
}

export function useMessagesStore() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const store = useMemo(
    () => parseStore(snapshot),
    [snapshot],
  );

  const unreadCount = store.conversations.reduce(
    (total, conversation) => total + conversation.unread,
    0,
  );

  function ensureConversation(profileId: number) {
    const current = readStore();

    if (
      current.conversations.some(
        (conversation) => conversation.profileId === profileId,
      )
    ) {
      return;
    }

    saveStore({
      ...current,
      conversations: [
        ...current.conversations,
        {
          profileId,
          unread: 0,
          updatedAt: Date.now(),
        },
      ],
    });
  }

  function sendMessage(profileId: number, text: string) {
    const current = readStore();
    const now = Date.now();

    const nextMessage: YunoMessage = {
      id: `me-${now}-${Math.random().toString(36).slice(2)}`,
      profileId,
      sender: "me",
      text,
      createdAt: now,
      status: "sent",
    };

    const existing = current.conversations.find(
      (conversation) => conversation.profileId === profileId,
    );

    const conversations = existing
      ? current.conversations.map((conversation) =>
          conversation.profileId === profileId
            ? {
                ...conversation,
                updatedAt: now,
              }
            : conversation,
        )
      : [
          ...current.conversations,
          {
            profileId,
            unread: 0,
            updatedAt: now,
          },
        ];

    saveStore({
      conversations,
      messages: [...current.messages, nextMessage],
    });

    return nextMessage.id;
  }

  function receiveMessage(
    profileId: number,
    text: string,
    unread = true,
  ) {
    const current = readStore();
    const now = Date.now();

    const nextMessage: YunoMessage = {
      id: `them-${now}-${Math.random().toString(36).slice(2)}`,
      profileId,
      sender: "them",
      text,
      createdAt: now,
      status: "read",
    };

    const existing = current.conversations.find(
      (conversation) => conversation.profileId === profileId,
    );

    const conversations = existing
      ? current.conversations.map((conversation) =>
          conversation.profileId === profileId
            ? {
                ...conversation,
                unread: unread
                  ? conversation.unread + 1
                  : 0,
                updatedAt: now,
              }
            : conversation,
        )
      : [
          ...current.conversations,
          {
            profileId,
            unread: unread ? 1 : 0,
            updatedAt: now,
          },
        ];

    saveStore({
      conversations,
      messages: [...current.messages, nextMessage],
    });
  }

  function markConversationRead(profileId: number) {
    const current = readStore();

    const hasUnread = current.conversations.some(
      (conversation) =>
        conversation.profileId === profileId &&
        conversation.unread > 0,
    );

    if (!hasUnread) return;

    saveStore({
      ...current,
      conversations: current.conversations.map(
        (conversation) =>
          conversation.profileId === profileId
            ? {
                ...conversation,
                unread: 0,
              }
            : conversation,
      ),
    });
  }

  function markMessageRead(messageId: string) {
    const current = readStore();

    saveStore({
      ...current,
      messages: current.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              status: "read",
            }
          : message,
      ),
    });
  }

  function getConversationMessages(profileId: number) {
    return store.messages
      .filter((message) => message.profileId === profileId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  return {
    conversations: store.conversations,
    messages: store.messages,
    unreadCount,
    ensureConversation,
    sendMessage,
    receiveMessage,
    markConversationRead,
    markMessageRead,
    getConversationMessages,
  };
}
