import { render, screen, userEvent } from "@/test-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ChatMessage, Conversation } from "@/lib/types";

const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Amina Bello",
    lastMessage: { text: "See you Friday", at: "2026-09-01T10:00:00Z", fromMe: true },
    unreadCount: 0,
  },
  {
    id: "c2",
    name: "Web Dev Cohort",
    lastMessage: { text: "Nice work everyone", at: "2026-09-01T09:00:00Z", fromMe: false },
    unreadCount: 2,
  },
];

const messages: ChatMessage[] = [
  {
    id: "m1",
    conversationId: "c1",
    senderId: "u-mentor",
    senderName: "Amina Bello",
    text: "Hello there",
    sentAt: "2026-09-01T09:30:00Z",
  },
  {
    id: "m2",
    conversationId: "c1",
    senderId: "u-me",
    senderName: "Me",
    text: "Hi mentor",
    sentAt: "2026-09-01T09:31:00Z",
  },
];

jest.mock("@/hooks/useChat", () => ({
  useConversations: jest.fn(),
  useMessages: jest.fn(),
  useSendMessage: jest.fn(),
}));

jest.mock("@/hooks/useSocketEvents", () => ({
  useSocketEvents: jest.fn(),
}));

jest.mock("@/hooks/useConnectivity", () => ({
  useConnectivity: jest.fn(() => true),
}));

jest.mock("@/stores/auth", () => ({
  getUser: jest.fn(() => ({ id: "u-me", email: "me@x.com", name: "Me", role: "SCHOLAR", organizationId: "org1" })),
}));

import { ChatView } from "./ChatView";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useChat";
import { useConnectivity } from "@/hooks/useConnectivity";

const mockUseConversations = useConversations as jest.MockedFunction<
  typeof useConversations
>;
const mockUseMessages = useMessages as jest.MockedFunction<typeof useMessages>;
const mockUseSendMessage = useSendMessage as jest.MockedFunction<
  typeof useSendMessage
>;

function convQueryResult(
  overrides: Partial<UseQueryResult<Conversation[], Error>>
): UseQueryResult<Conversation[], Error> {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    refetch: jest.fn(),
    status: "success",
    fetchStatus: "idle",
    ...overrides,
  } as UseQueryResult<Conversation[], Error>;
}

function msgQueryResult(
  overrides: Partial<UseQueryResult<ChatMessage[], Error>>
): UseQueryResult<ChatMessage[], Error> {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    refetch: jest.fn(),
    status: "success",
    fetchStatus: "idle",
    ...overrides,
  } as UseQueryResult<ChatMessage[], Error>;
}

function renderChat() {
  return render(<ChatView />);
}

describe("ChatView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMessages.mockReturnValue(msgQueryResult({ data: [] }));
    mockUseSendMessage.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      status: "idle",
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      submittedAt: 0,
      variables: undefined,
      data: undefined,
      failureCount: 0,
      failureReason: null,
      reset: jest.fn(),
      context: undefined,
    });
  });

  it("shows skeleton while loading conversations", () => {
    mockUseConversations.mockReturnValue(
      convQueryResult({ isLoading: true, isPending: true, data: undefined })
    );

    renderChat();

    const loader = screen.getByLabelText("Loading conversations");
    expect(loader).toHaveAttribute("aria-busy", "true");
  });

  it("shows error state with retry button for conversations", () => {
    const refetch = jest.fn();
    mockUseConversations.mockReturnValue(
      convQueryResult({ error: new Error("x"), isError: true, status: "error", refetch })
    );

    renderChat();

    expect(screen.getByText("Could not load conversations")).toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Try again" });
    retry.click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no conversations", () => {
    mockUseConversations.mockReturnValue(convQueryResult({ data: [] }));

    renderChat();

    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });

  it("renders conversation list with unread counts", () => {
    mockUseConversations.mockReturnValue(convQueryResult({ data: conversations }));

    renderChat();

    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Amina Bello")).toBeInTheDocument();
    expect(screen.getByText("Web Dev Cohort")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("opens a conversation thread on select", async () => {
    mockUseConversations.mockReturnValue(convQueryResult({ data: conversations }));
    mockUseMessages.mockReturnValue(msgQueryResult({ data: messages }));

    renderChat();

    await userEvent.click(screen.getByRole("button", { name: /Amina Bello/ }));

    expect(screen.getByText("Hello there")).toBeInTheDocument();
    expect(screen.getByText("Hi mentor")).toBeInTheDocument();
  });

  it("sends a message from the composer", async () => {
    const mutate = jest.fn();
    mockUseConversations.mockReturnValue(convQueryResult({ data: conversations }));
    mockUseMessages.mockReturnValue(msgQueryResult({ data: messages }));
    mockUseSendMessage.mockReturnValue({
      mutate,
      mutateAsync: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      status: "idle",
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      submittedAt: 0,
      variables: undefined,
      data: undefined,
      failureCount: 0,
      failureReason: null,
      reset: jest.fn(),
      context: undefined,
    });

    renderChat();

    await userEvent.click(screen.getByRole("button", { name: /Amina Bello/ }));
    const input = screen.getByLabelText("Message");
    await userEvent.type(input, "Thanks for the help!");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(mutate).toHaveBeenCalledWith("Thanks for the help!");
  });

  it("shows offline banner and disables composer when offline", async () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    mockUseConversations.mockReturnValue(convQueryResult({ data: conversations }));
    mockUseMessages.mockReturnValue(msgQueryResult({ data: messages }));

    renderChat();

    await userEvent.click(screen.getByRole("button", { name: /Amina Bello/ }));

    const sendButton = screen.getByRole("button", { name: "Send message" });
    expect(sendButton).toBeDisabled();
    expect(screen.getAllByText(/You're offline/).length).toBeGreaterThan(0);
  });

  it("shows empty thread state when conversation has no messages", async () => {
    mockUseConversations.mockReturnValue(convQueryResult({ data: conversations }));
    mockUseMessages.mockReturnValue(msgQueryResult({ data: [] }));

    renderChat();

    await userEvent.click(screen.getByRole("button", { name: /Web Dev Cohort/ }));

    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });
});
