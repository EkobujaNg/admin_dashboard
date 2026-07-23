import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getContactSubmission,
  getContactSubmissions,
  getSupportErrorMessage,
  getSupportTicket,
  getSupportTickets,
  replyToSupportTicket,
  updateSupportTicketStatus,
} from "@/lib/support/api";
import type { UpdateTicketStatusPayload } from "@/lib/support/types";

type Options = { page?: number; limit?: number; ticketId?: string; contactId?: string; enableTickets?: boolean; enableContacts?: boolean };

export default function useSupportAPI({ page = 1, limit = 10, ticketId = "", contactId = "", enableTickets = false, enableContacts = false }: Options = {}) {
  const queryClient = useQueryClient();
  const ticketsQuery = useQuery({ queryKey: ["support-tickets", page, limit], queryFn: () => getSupportTickets(page, limit), enabled: enableTickets });
  const ticketQuery = useQuery({ queryKey: ["support-ticket", ticketId], queryFn: () => getSupportTicket(ticketId), enabled: Boolean(ticketId) });
  const contactsQuery = useQuery({ queryKey: ["contact-submissions", page, limit], queryFn: () => getContactSubmissions(page, limit), enabled: enableContacts });
  const contactQuery = useQuery({ queryKey: ["contact-submission", contactId], queryFn: () => getContactSubmission(contactId), enabled: Boolean(contactId) });
  const invalidateTickets = () => { queryClient.invalidateQueries({ queryKey: ["support-tickets"] }); queryClient.invalidateQueries({ queryKey: ["support-ticket"] }); };
  const statusMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateTicketStatusPayload }) => updateSupportTicketStatus(id, payload), onSuccess: () => { toast.success("Ticket status updated."); invalidateTickets(); }, onError: (error) => toast.error(getSupportErrorMessage(error, "Failed to update ticket status.")) });
  const replyMutation = useMutation({ mutationFn: ({ id, message }: { id: string; message: string }) => replyToSupportTicket(id, message), onSuccess: () => { toast.success("Reply sent."); invalidateTickets(); }, onError: (error) => toast.error(getSupportErrorMessage(error, "Failed to send reply.")) });

  return {
    tickets: ticketsQuery.data?.items ?? [], ticketsMeta: ticketsQuery.data, isLoadingTickets: ticketsQuery.isLoading, ticketsError: ticketsQuery.error,
    ticket: ticketQuery.data, isLoadingTicket: ticketQuery.isLoading,
    contacts: contactsQuery.data?.items ?? [], contactsMeta: contactsQuery.data, isLoadingContacts: contactsQuery.isLoading, contactsError: contactsQuery.error,
    contact: contactQuery.data, isLoadingContact: contactQuery.isLoading,
    updateStatus: (id: string, payload: UpdateTicketStatusPayload) => statusMutation.mutate({ id, payload }), isUpdatingStatus: statusMutation.isPending,
    reply: (id: string, message: string) => replyMutation.mutate({ id, message }), isReplying: replyMutation.isPending,
  };
}
