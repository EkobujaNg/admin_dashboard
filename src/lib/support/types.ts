export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed" | string;

export type SupportTicketMessage = {
  id: string;
  body: string;
  author: "user" | "support" | string;
  createdAt: string | null;
  authorName: string | null;
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: string | null;
  status: SupportTicketStatus;
  userName: string | null;
  userEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  messages: SupportTicketMessage[];
};

export type ContactSubmission = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  createdAt: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UpdateTicketStatusPayload = { status: "resolved" | "closed" };
