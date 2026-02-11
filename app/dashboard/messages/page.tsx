"use client";

import { useState, useEffect, useRef } from "react";
import { useMessageThreads, useThreadMessages, useSendChat } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads, isLoading: threadsLoading, error: threadsError } = useMessageThreads();
  const { data: messages, refetch: refetchMessages } = useThreadMessages(
    selectedThread?.senderId === session?.user?.id
      ? selectedThread?.receiverId
      : selectedThread?.senderId
  );
  const { mutate: sendChat, isPending: isSending } = useSendChat();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread || !session?.user?.id) return;

    const receiverId = selectedThread.senderId === session.user.id
      ? selectedThread.receiverId
      : selectedThread.senderId;

    sendChat(
      {
        message: newMessage,
        threadId: selectedThread.id,
        senderId: session.user.id,
        receiverId,
        senderType: "user",
      },
      {
        onSuccess: () => {
          setNewMessage("");
          refetchMessages();
        },
      }
    );
  };

  // Get the other user's info from the thread
  const getOtherUserInfo = (thread: any) => {
    if (thread.senderId === session?.user?.id) {
      return {
        id: thread.receiverId,
        name: thread.receiverName,
        picture: thread.receiverProfilePicture,
      };
    }
    return {
      id: thread.senderId,
      name: thread.senderName,
      picture: thread.senderProfilePicture,
    };
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown date";
      return date.toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  // Format time safely
  const formatTime = (dateString: string) => {
    if (!dateString) return "Unknown time";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown time";
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with other users</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[350px_1fr] gap-4 h-full">
        {/* Conversations List */}
        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <p className="text-sm text-muted-foreground">
              {threads?.payload?.length || 0} threads
            </p>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            {threadsError ? (
              <div className="p-4">
                <ErrorState
                  title="Failed to load threads"
                  message="We couldn't fetch your message threads. Please try again."
                />
              </div>
            ) : threadsLoading ? (
              <div className="space-y-2 p-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : threads?.payload && threads.payload.length > 0 ? (
              <div className="space-y-1 p-2 h-full overflow-y-auto">
                {threads.payload.map((thread: any) => {
                  const otherUser = getOtherUserInfo(thread);
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${selectedThread?.id === thread.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                          : "hover:bg-muted"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {otherUser.picture ? (
                          <img
                            src={otherUser.picture}
                            alt={otherUser.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {otherUser.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {otherUser.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {thread.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(thread.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with other users
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col overflow-hidden">
          {selectedThread ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  {(() => {
                    const otherUser = getOtherUserInfo(selectedThread);
                    return (
                      <>
                        {otherUser.picture ? (
                          <img
                            src={otherUser.picture}
                            alt={otherUser.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {otherUser.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                      </>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.payload && messages.payload.length > 0 ? (
                  messages.payload.map((msg: any) => {
                    const isSent = msg.senderId === session?.user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${isSent
                              ? "bg-blue-600 text-white"
                              : "bg-muted"
                            }`}
                        >
                          <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isSent ? "text-blue-100" : "text-muted-foreground"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    No messages in this thread yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" disabled={isSending || !newMessage.trim()}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
