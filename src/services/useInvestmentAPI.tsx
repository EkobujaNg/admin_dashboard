const dummySummary = {
  totalInvestors: 1284,
  activeInvestments: 847,
  totalAmountInvested: 2450000000,
  totalNetAssetValue: 3100000000,
  totalStocksOnTradeMarket: 320,
  availableInvestmentBalance: 185000000,
  coOwnedProperties: 12,
  totalEarningsDistributed: 312000000,
  pendingEarnings: 48000000,
  averageInvestmentAmount: 1910000,
};

const dummyActiveInvestments = [
  {
    investmentId: "INV-E001",
    userName: "Adewale Okonkwo",
    email: "adewale.okonkwo@gmail.com",
    assetOwned: "Sunset Heights",
    ownedPercentage: 5,
    amount: 5000000,
    maturityDate: "2027-01-20T00:00:00Z",
  },
  {
    investmentId: "INV-E002",
    userName: "Fatima Al-Hassan",
    email: "fatima.alhassan@gmail.com",
    assetOwned: "Green Meadows Estate",
    ownedPercentage: 10,
    amount: 24000000,
    maturityDate: "2027-02-15T00:00:00Z",
  },
  {
    investmentId: "INV-E003",
    userName: "Chukwuemeka Nwosu",
    email: "chukwuemeka.nwosu@gmail.com",
    assetOwned: "Blue Waters Residence",
    ownedPercentage: 8,
    amount: 25000000,
    maturityDate: "2027-03-10T00:00:00Z",
  },
  {
    investmentId: "INV-E004",
    userName: "Ngozi Eze",
    email: "ngozi.eze@gmail.com",
    assetOwned: "Sunset Heights",
    ownedPercentage: 12,
    amount: 10000000,
    maturityDate: "2027-01-25T00:00:00Z",
  },
  {
    investmentId: "INV-E005",
    userName: "Babatunde Adeyemi",
    email: "babatunde.adeyemi@gmail.com",
    assetOwned: "Palm Court Gardens",
    ownedPercentage: 6,
    amount: 8000000,
    maturityDate: "2026-12-01T00:00:00Z",
  },
];

const dummyEarningReports = [
  {
    investmentId: "INV-E001",
    userName: "Adewale Okonkwo",
    email: "adewale.okonkwo@gmail.com",
    propertyCode: "Palm Court Gardens",
    roi: 14,
    earnings: 1120000,
    distributedEarnings: 960000,
  },
  {
    investmentId: "INV-E002",
    userName: "Fatima Al-Hassan",
    email: "fatima.alhassan@gmail.com",
    propertyCode: "Sunset Heights",
    roi: 15,
    earnings: 750000,
    distributedEarnings: 750000,
  },
  {
    investmentId: "INV-E003",
    userName: "Chukwuemeka Nwosu",
    email: "chukwuemeka.nwosu@gmail.com",
    propertyCode: "Green Meadows Estate",
    roi: 18,
    earnings: 2160000,
    distributedEarnings: 1800000,
  },
  {
    investmentId: "INV-E004",
    userName: "Ngozi Eze",
    email: "ngozi.eze@gmail.com",
    propertyCode: "Blue Waters Residence",
    roi: 20,
    earnings: 5000000,
    distributedEarnings: 0,
  },
  {
    investmentId: "INV-E005",
    userName: "Babatunde Adeyemi",
    email: "babatunde.adeyemi@gmail.com",
    propertyCode: "Palm Court Gardens",
    roi: 14,
    earnings: 1120000,
    distributedEarnings: 800000,
  },
];

export default function useInvestmentAPI({
  activePage = 1,
  activeSize = 10,
  activeSearch = "",
  reportPage = 1,
  reportSize = 10,
  reportSearch = "",
  enableActive = false,
  enableReports = false,
  enableSummary = false,
} = {}) {
  const filteredActive = activeSearch
    ? dummyActiveInvestments.filter(
        (inv) =>
          inv.userName.toLowerCase().includes(activeSearch.toLowerCase()) ||
          inv.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
          inv.assetOwned.toLowerCase().includes(activeSearch.toLowerCase()) ||
          inv.investmentId.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : dummyActiveInvestments;

  const filteredReports = reportSearch
    ? dummyEarningReports.filter(
        (rep) =>
          rep.userName.toLowerCase().includes(reportSearch.toLowerCase()) ||
          rep.email.toLowerCase().includes(reportSearch.toLowerCase()) ||
          rep.propertyCode.toLowerCase().includes(reportSearch.toLowerCase()) ||
          rep.investmentId.toLowerCase().includes(reportSearch.toLowerCase())
      )
    : dummyEarningReports;

  const activeSlice = filteredActive.slice((activePage - 1) * activeSize, activePage * activeSize);
  const reportsSlice = filteredReports.slice((reportPage - 1) * reportSize, reportPage * reportSize);

  return {
    summary: (enableSummary ? dummySummary : undefined) as any,
    isLoadingSummary: false,
    summaryError: null,
    refetchSummary: async () => {},

    activeInvestments: (enableActive ? activeSlice : []) as any[],
    activeMeta: {
      totalRecords: filteredActive.length,
      totalPages: Math.ceil(filteredActive.length / activeSize) || 1,
      pageNumber: activePage,
      pageSize: activeSize,
    },
    isLoadingActiveInvestments: false,
    activeError: null,
    refetchActiveInvestments: async () => {},

    earningReports: (enableReports ? reportsSlice : []) as any[],
    reportsMeta: {
      totalRecords: filteredReports.length,
      totalPages: Math.ceil(filteredReports.length / reportSize) || 1,
      pageNumber: reportPage,
      pageSize: reportSize,
    },
    isLoadingReports: false,
    reportsError: null,
    refetchReports: async () => {},
  };
}
