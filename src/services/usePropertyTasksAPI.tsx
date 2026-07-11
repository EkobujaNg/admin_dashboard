import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPropertyTaskById,
  getPropertyTaskErrorMessage,
  getPropertyTasksByPropertyId,
  setPropertyTaskAffectProperty,
} from "@/lib/property-tasks/api";
import type { PropertyTask } from "@/lib/property-tasks/types";

const EMPTY_TASKS: PropertyTask[] = [];

type UsePropertyTasksAPIOptions = {
  propertyId?: string;
  taskId?: string;
  enableList?: boolean;
  enableDetail?: boolean;
};

export default function usePropertyTasksAPI({
  propertyId = "",
  taskId = "",
  enableList = false,
  enableDetail = false,
}: UsePropertyTasksAPIOptions = {}) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["admin-property-tasks", propertyId],
    queryFn: () => getPropertyTasksByPropertyId(propertyId),
    enabled: enableList && Boolean(propertyId),
  });

  const detailQuery = useQuery({
    queryKey: ["admin-property-task", taskId],
    queryFn: () => getPropertyTaskById(taskId),
    enabled: enableDetail && Boolean(taskId),
  });

  const invalidate = (id?: string) => {
    if (propertyId) {
      queryClient.invalidateQueries({ queryKey: ["admin-property-tasks", propertyId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin-property-tasks"] });
    }
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["admin-property-task", id] });
    }
  };

  const affectMutation = useMutation({
    mutationFn: ({
      id,
      affectProperty,
      remark,
    }: {
      id: string;
      affectProperty: boolean;
      remark: string;
    }) => setPropertyTaskAffectProperty(id, { affectProperty, remark }),
    onSuccess: (_data, variables) => invalidate(variables.id),
  });

  const setAffectProperty = (
    id: string,
    affectProperty: boolean,
    remark: string,
    options?: { onSuccess?: () => void; onError?: (error?: unknown) => void }
  ) => {
    affectMutation.mutate(
      { id, affectProperty, remark: remark.trim() },
      {
        onSuccess: () => {
          toast.success(
            affectProperty
              ? "Task property value impact enabled."
              : "Task property value impact disabled."
          );
          options?.onSuccess?.();
        },
        onError: (error) => {
          toast.error(getPropertyTaskErrorMessage(error, "Failed to update property value impact."));
          options?.onError?.(error);
        },
      }
    );
  };

  return {
    tasks: listQuery.data?.items ?? EMPTY_TASKS,
    totalCount: listQuery.data?.totalCount ?? 0,
    isLoadingTasks: listQuery.isLoading,
    tasksError: listQuery.error,
    refetchTasks: listQuery.refetch,

    task: detailQuery.data,
    isLoadingTask: detailQuery.isLoading,
    taskError: detailQuery.error,
    refetchTask: detailQuery.refetch,

    setAffectProperty,
    isUpdatingAffectProperty: affectMutation.isPending,
    updatingAffectPropertyId: affectMutation.isPending ? affectMutation.variables?.id : undefined,
  };
}
