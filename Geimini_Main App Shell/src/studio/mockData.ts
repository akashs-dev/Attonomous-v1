export interface Brief {
  id: number
  name: string
  category: string
  useCase: string
  segment: string
  received: string
  status: 'Pending' | 'In Progress' | 'Approved'
  objective: string
}

export interface Variant {
  id: number
  title: string
  body: string
  score: number
  hasWarning: boolean
}

export interface LibraryEntry {
  id: number
  name: string
  channel: string
  category: string
  useCase: string
  segment: string
  score: number
  approvedOn: string
  source: 'Brief' | 'Workshop'
  title: string
  body: string
}

export const mockBriefs: Brief[] = [
  { id: 1, name: "Loan — First-Time Borrower — 14 Apr 2026", category: "Promotional", useCase: "Loan", segment: "First-Time Borrower", received: "14 Apr 2026, 09:32", status: "Pending", objective: "Drive loan applications from new customers in the 25–35 age group." },
  { id: 2, name: "FD — Retiree Segment — 13 Apr 2026", category: "BAU", useCase: "FD", segment: "Retiree", received: "13 Apr 2026, 14:15", status: "In Progress", objective: "Promote fixed deposit rates to retirees looking for stable returns." },
  { id: 3, name: "Insurance — Young Professional — 12 Apr 2026", category: "Lifecycle", useCase: "Insurance", segment: "Young Professional", received: "12 Apr 2026, 11:00", status: "Approved", objective: "Re-engage young professionals with term insurance reminder." },
  { id: 4, name: "MF — Aspiring Investor — 11 Apr 2026", category: "Promotional", useCase: "Mutual Fund", segment: "Aspiring Investor", received: "11 Apr 2026, 16:45", status: "Pending", objective: "Drive SIP registrations from first-time investors." },
  { id: 5, name: "App — Lapsed User — 10 Apr 2026", category: "Retention", useCase: "App Re-engagement", segment: "Lapsed User", received: "10 Apr 2026, 08:20", status: "Pending", objective: "Re-activate users who haven't opened the app in 30+ days." },
]

export const mockVariants: Variant[] = [
  { id: 1, title: "Your loan, faster than ever", body: "Get up to ₹5L in minutes. No paperwork, no waiting. Apply now and get approved today.", score: 84, hasWarning: false },
  { id: 2, title: "Guaranteed approval — apply today!", body: "100% approval on personal loans. Instant disbursal. Don't miss out!", score: 42, hasWarning: true },
  { id: 3, title: "₹5L loan at 10.5% p.a. — Limited offer", body: "Bajaj Markets personal loan at competitive rates. Apply before 30 Apr for instant processing.", score: 71, hasWarning: false },
]

export const mockLibrary: LibraryEntry[] = [
  { id: 1, name: "Loan — First-Time Borrower — 12 Apr 2026", channel: "Push", category: "Promotional", useCase: "Loan", segment: "First-Time Borrower", score: 84, approvedOn: "12 Apr 2026", source: "Brief", title: "Your loan, faster than ever", body: "Get up to ₹5L in minutes. No paperwork, no waiting. Apply now and get approved today." },
  { id: 2, name: "FD — Retiree — 10 Apr 2026", channel: "Push", category: "BAU", useCase: "FD", segment: "Retiree", score: 79, approvedOn: "10 Apr 2026", source: "Workshop", title: "Earn more on your savings", body: "Lock in 8.5% p.a. on your FD. Limited period offer for Bajaj Markets customers. Open yours today." },
  { id: 3, name: "Insurance — Young Pro — 08 Apr 2026", channel: "Push", category: "Lifecycle", useCase: "Insurance", segment: "Young Professional", score: 91, approvedOn: "08 Apr 2026", source: "Brief", title: "Don't leave your family unprotected", body: "Term cover starting ₹499/month. Get ₹1 crore cover with Bajaj Markets. Quick, paperless process." },
  { id: 4, name: "MF — Aspiring Investor — 06 Apr 2026", channel: "Push", category: "Promotional", useCase: "Mutual Fund", segment: "Aspiring Investor", score: 67, approvedOn: "06 Apr 2026", source: "Workshop", title: "Start your SIP with ₹500", body: "Invest in top-rated mutual funds in minutes. No prior experience needed. Start today." },
  { id: 5, name: "App Re-engagement — Lapsed — 04 Apr 2026", channel: "Push", category: "Retention", useCase: "App Re-engagement", segment: "Lapsed User", score: 55, approvedOn: "04 Apr 2026", source: "Brief", title: "We miss you! Here's ₹100 cashback", body: "Log in to Bajaj Markets and claim your exclusive cashback. Offer valid for 48 hours only." },
  { id: 6, name: "Credit Card — HNI — 02 Apr 2026", channel: "Push", category: "Promotional", useCase: "Credit Card", segment: "HNI", score: 88, approvedOn: "02 Apr 2026", source: "Workshop", title: "Your invite to the Bajaj Prestige Card", body: "Exclusive benefits, zero annual fee, and 5X reward points. Accept your invite now." },
  { id: 7, name: "Loan — Existing Customer — 30 Mar 2026", channel: "Push", category: "BAU", useCase: "Loan", segment: "Existing Customer", score: 73, approvedOn: "30 Mar 2026", source: "Brief", title: "Pre-approved top-up loan for you", body: "₹2L top-up on your existing loan — already approved. Click to disburse in 10 minutes." },
  { id: 8, name: "Insurance — Renewal — 28 Mar 2026", channel: "Push", category: "Lifecycle", useCase: "Insurance", segment: "Near-Renewal", score: 82, approvedOn: "28 Mar 2026", source: "Brief", title: "Your policy renews in 7 days", body: "Don't let your cover lapse. Renew now and get a 5% loyalty discount. Tap to continue." },
]

export const campaignCategories = ["Promotional", "BAU", "Lifecycle", "Retention", "Acquisition"]
export const useCases = ["Loan", "FD", "Insurance", "Mutual Fund", "Credit Card", "App Re-engagement", "Savings Account"]
export const segments = ["First-Time Borrower", "Retiree", "Young Professional", "Aspiring Investor", "Lapsed User", "HNI", "Existing Customer", "Near-Renewal"]
