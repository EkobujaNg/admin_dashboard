import { toast } from "sonner";

const dummyUsers = [
  {
    userId: "usr-001",
    firstName: "Adewale",
    lastName: "Okonkwo",
    email: "adewale.okonkwo@email.com",
    phoneNumber: "+234 801 234 5678",
    role: "Investor",
    isActive: true,
    status: "Active",
    dateCreated: "2026-01-10T09:00:00Z",
    totalInvested: 15000000,
    referralCode: "AWO001",
    kycStatus: "Verified",
  },
  {
    userId: "usr-002",
    firstName: "Fatima",
    lastName: "Al-Hassan",
    email: "fatima.alhassan@email.com",
    phoneNumber: "+234 802 345 6789",
    role: "Investor",
    isActive: true,
    status: "Active",
    dateCreated: "2026-01-18T10:30:00Z",
    totalInvested: 24000000,
    referralCode: "FAH002",
    kycStatus: "Verified",
  },
  {
    userId: "usr-003",
    firstName: "Chukwuemeka",
    lastName: "Nwosu",
    email: "chukwuemeka.nwosu@email.com",
    phoneNumber: "+234 803 456 7890",
    role: "Investor",
    isActive: true,
    status: "Active",
    dateCreated: "2026-02-05T11:00:00Z",
    totalInvested: 25000000,
    referralCode: "CHN003",
    kycStatus: "Verified",
  },
  {
    userId: "usr-004",
    firstName: "Ngozi",
    lastName: "Eze",
    email: "ngozi.eze@email.com",
    phoneNumber: "+234 804 567 8901",
    role: "Investor",
    isActive: true,
    status: "Active",
    dateCreated: "2026-02-14T08:00:00Z",
    totalInvested: 10000000,
    referralCode: "NGE004",
    kycStatus: "Pending",
  },
  {
    userId: "usr-005",
    firstName: "Babatunde",
    lastName: "Adeyemi",
    email: "babatunde.adeyemi@email.com",
    phoneNumber: "+234 805 678 9012",
    role: "Investor",
    isActive: true,
    status: "Active",
    dateCreated: "2025-12-01T07:30:00Z",
    totalInvested: 8000000,
    referralCode: "BAA005",
    kycStatus: "Verified",
  },
  {
    userId: "usr-006",
    firstName: "Amina",
    lastName: "Yusuf",
    email: "amina.yusuf@email.com",
    phoneNumber: "+234 806 789 0123",
    role: "Investor",
    isActive: false,
    status: "Pending",
    dateCreated: "2026-05-28T14:00:00Z",
    totalInvested: 0,
    referralCode: "AMY006",
    kycStatus: "Pending",
  },
  {
    userId: "usr-007",
    firstName: "Emeka",
    lastName: "Obiora",
    email: "emeka.obiora@email.com",
    phoneNumber: "+234 807 890 1234",
    role: "Investor",
    isActive: false,
    status: "Inactive",
    dateCreated: "2025-09-15T10:00:00Z",
    totalInvested: 3500000,
    referralCode: "EMO007",
    kycStatus: "Verified",
  },
];

const dummySummaryStats = {
  totalRegisteredUsers: 1284,
  totalUsers: 1284,
  activeUsers: 1102,
  pendingUsers: 87,
  pendingRequests: 87,
  inactiveUsers: 95,
  deactivatedAccounts: 95,
  verifiedKyc: 1150,
  pendingKyc: 134,
  newUsersThisMonth: 43,
  earliestSignupDate: "2024-01-05T00:00:00Z",
};

export const useUserAPI = ({
  sortByDate = true,
  role = "",
  userId = "",
  enableUsers = false,
} = {}) => {
  const filteredUsers = role
    ? dummyUsers.filter((u) => u.role.toLowerCase() === role.toLowerCase())
    : dummyUsers;
  const sortedUsers = sortByDate
    ? [...filteredUsers].sort(
        (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
    : filteredUsers;

  const matchedUser = dummyUsers.find((u) => u.userId === userId) || null;

  const addUser = async (_payload: any, _options?: any) => {
    toast.success("User added successfully");
    _options?.onSuccess?.();
  };

  const editUser = async (_payload: any, _options?: any) => {
    toast.success("User updated successfully");
    _options?.onSuccess?.();
  };

  const deleteUser = async (_id: any, _options?: any) => {
    toast.success("User deleted successfully");
    _options?.onSuccess?.();
  };

  const acceptUser = async (_id: any, _options?: any) => {
    toast.success("User accepted");
    _options?.onSuccess?.();
  };

  const rejectUser = async (_id: any, _options?: any) => {
    toast.success("User rejected");
    _options?.onSuccess?.();
  };

  const deactivateUser = async (_id: any, _options?: any) => {
    toast.success("User deactivated");
    _options?.onSuccess?.();
  };

  return {
    users: (enableUsers ? sortedUsers : null) as any,
    isLoadingUsers: false,
    usersError: null,
    refetchUsers: async () => {},

    summaryStats: dummySummaryStats as any,
    isLoadingSummary: false,
    summaryError: null,
    refetchSummary: async () => {},

    userDetail: (userId ? matchedUser : null) as any,
    isLoadingUserDetail: false,
    userDetailError: null,
    refetchUserDetail: async () => {},

    addUser,
    editUser,
    deleteUser,
    acceptUser,
    rejectUser,
    deactivateUser,
    isAddingUser: false,
    isEditingUser: false,
    isDeletingUser: false,
    isAcceptingUser: false,
    isRejectingUser: false,
    isDeactivatingUser: false,
  };
};

export default useUserAPI;
