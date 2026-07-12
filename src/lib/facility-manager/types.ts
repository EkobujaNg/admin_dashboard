type PhoneNumberPayload = {
  code: string;
  number: string;
};

export type FacilityManagerRecord = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: PhoneNumberPayload;
  idCard: string;
  createdAt: string;
};

export type PaginatedFacilityManagers = {
  pageItems: FacilityManagerRecord[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
};

export type GetFacilityManagersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CreateFacilityManagerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: PhoneNumberPayload;
  idCard: string;
};

export type CreateFacilityManagerResponse = {
  id?: string;
  message?: string;
  responseDescription?: string;
  responseMessage?: string;
  [key: string]: unknown;
};

export type AssignPropertyToFacilityManagerResponse = {
  message?: string;
  responseDescription?: string;
  responseMessage?: string;
  [key: string]: unknown;
};
