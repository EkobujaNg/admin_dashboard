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
    id: "inv-001",
    investorName: "Adewale Okonkwo",
    propertyName: "Sunset Heights",
    amountInvested: 5000000,
    units: 1,
    roi: 15,
    startDate: "2026-01-20T00:00:00Z",
    maturityDate: "2027-01-20T00:00:00Z",
    status: "Active",
    earnings: 187500,
  },
  {
    id: "inv-002",
    investorName: "Fatima Al-Hassan",
    propertyName: "Green Meadows Estate",
    amountInvested: 24000000,
    units: 2,
    roi: 18,
    startDate: "2026-02-15T00:00:00Z",
    maturityDate: "2027-02-15T00:00:00Z",
    status: "Active",
    earnings: 1080000,
  },
  {
    id: "inv-003",
    investorName: "Chukwuemeka Nwosu",
    propertyName: "Blue Waters Residence",
    amountInvested: 25000000,
    units: 1,
    roi: 20,
    startDate: "2026-03-10T00:00:00Z",
    maturityDate: "2027-03-10T00:00:00Z",
    status: "Active",
    earnings: 1250000,
  },
  {
    id: "inv-004",
    investorName: "Ngozi Eze",
    propertyName: "Sunset Heights",
    amountInvested: 10000000,
    units: 2,
    roi: 15,
    startDate: "2026-01-25T00:00:00Z",
    maturityDate: "2027-01-25T00:00:00Z",
    status: "Active",
    earnings: 375000,
  },
  {
    id: "inv-005",
    investorName: "Babatunde Adeyemi",
    propertyName: "Palm Court Gardens",
    amountInvested: 8000000,
    units: 1,
    roi: 14,
    startDate: "2025-12-01T00:00:00Z",
    maturityDate: "2026-12-01T00:00:00Z",
    status: "Active",
    earnings: 280000,
  },
];

const dummyEarningReports = [
  {
    id: "rep-001",
    investorName: "Adewale Okonkwo",
    propertyName: "Palm Court Gardens",
    amountEarned: 1120000,
    disbursementDate: "2026-05-01T00:00:00Z",
    status: "Disbursed",
    period: "Q1 2026",
  },
  {
    id: "rep-002",
    investorName: "Fatima Al-Hassan",
    propertyName: "Sunset Heights",
    amountEarned: 750000,
    disbursementDate: "2026-05-05T00:00:00Z",
    status: "Disbursed",
    period: "Q1 2026",
  },
  {
    id: "rep-003",
    investorName: "Chukwuemeka Nwosu",
    propertyName: "Green Meadows Estate",
    amountEarned: 2160000,
    disbursementDate: "2026-05-10T00:00:00Z",
    status: "Disbursed",
    period: "Q1 2026",
  },
  {
    id: "rep-004",
    investorName: "Ngozi Eze",
    propertyName: "Blue Waters Residence",
    amountEarned: 5000000,
    disbursementDate: "2026-05-15T00:00:00Z",
    status: "Pending",
    period: "Q1 2026",
  },
  {
    id: "rep-005",
    investorName: "Babatunde Adeyemi",
    propertyName: "Palm Court Gardens",
    amountEarned: 1120000,
    disbursementDate: "2026-05-20T00:00:00Z",
    status: "Pending",
    period: "Q1 2026",
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
          inv.investorName.toLowerCase().includes(activeSearch.toLowerCase()) ||
          inv.propertyName.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : dummyActiveInvestments;

  const filteredReports = reportSearch
    ? dummyEarningReports.filter(
        (rep) =>
          rep.investorName.toLowerCase().includes(reportSearch.toLowerCase()) ||
          rep.propertyName.toLowerCase().includes(reportSearch.toLowerCase())
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
      totalPages: Math.ceil(filteredActive.length / activeSize),
      pageNumber: activePage,
      pageSize: activeSize,
    },
    isLoadingActiveInvestments: false,
    activeError: null,
    refetchActiveInvestments: async () => {},

    earningReports: (enableReports ? reportsSlice : []) as any[],
    reportsMeta: {
      totalRecords: filteredReports.length,
      totalPages: Math.ceil(filteredReports.length / reportSize),
      pageNumber: reportPage,
      pageSize: reportSize,
    },
    isLoadingReports: false,
    reportsError: null,
    refetchReports: async () => {},
  };
}
