export type BusinessStatus =
  | 'new'
  | 'analyzed'
  | 'contacted'
  | 'follow_up_1'
  | 'follow_up_2'
  | 'follow_up_3'
  | 'report_paid'
  | 'huella_paid'
  | 'tutorial_paid'
  | 'site_active'
  | 'renewal_pending'
  | 'renewed'
  | 'lost'
  | 'closed_permanently'

export type IssueStatus = 'pending' | 'reviewed' | 'resolved' | 'ignored'
export type IssueType = 'wrong_profile' | 'incorrect_link' | 'outdated_info'
export type CityStatus = 'pending' | 'active' | 'completed' | 'paused'

export interface Business {
  id: string
  place_id: string
  slug: string
  name: string
  category: string | null
  city: string | null
  country: string
  address: string | null
  phone: string | null
  email: string | null
  email_source: string | null
  whatsapp: string | null
  whatsapp_source: string | null
  website: string | null
  needs_review: boolean
  missing_fields: string[] | null
  score_p2a: number
  score_p2b: number
  score_p2c: number
  score_p2d: number
  score_p2e: number
  score_p2f: number
  score_total: number
  rating: number | null
  num_reviews: number
  status: BusinessStatus
  plan: string | null
  has_reported_issue: boolean
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  latest_report_id: string | null
  scraped_at: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  business_id: string
  type: string
  generated_at: string
  score_total: number
  score_p2a: number
  score_p2b: number
  score_p2c: number
  score_p2d: number
  score_p2e: number
  score_p2f: number
  general_note: string | null
  general_note_edited: boolean
  modulo_p2a: ModuloData | null
  modulo_p2b: ModuloData | null
  modulo_p2c: ModuloData | null
  modulo_p2d: ModuloData | null
  modulo_p2e: ModuloData | null
  modulo_p2f: ModuloData | null
  is_public: boolean
  version: number
}

export interface ModuloData {
  score: number
  nota: string | null
  nota_editada: boolean
  datos: Record<string, unknown>
}

export interface OutreachLog {
  id: string
  business_id: string
  type: string
  status: 'sent' | 'opened' | 'replied' | 'bounced'
  sent_at: string
  metadata: Record<string, unknown> | null
}

export interface IssueReport {
  id: string
  business_id: string
  report_id: string | null
  type: IssueType
  detalle: string | null
  status: IssueStatus
  internal_note: string | null
  action_taken: string | null
  reported_at: string
  resolved_at: string | null
  businesses?: Pick<Business, 'name' | 'city' | 'country' | 'slug'>
}

export interface City {
  id: string
  name: string
  country: string
  status: CityStatus
  started_at: string | null
  last_run_at: string | null
  total_leads: number
  leads_with_email: number
  leads_with_whatsapp: number
  leads_contacted: number
  leads_paid: number
  peak_season_start: string | null
  peak_season_end: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

/* ── Country (master administrable) ─────────────────────────────── */

export type PaymentMethod = 'paypal' | 'mercadopago'

export interface Country {
  code:             string             // 'CL', 'CO', 'EC', 'BR', 'BO', 'PE'
  name:             string
  currency:         string
  enabled:          boolean
  payment_methods:  PaymentMethod[]
  launched_at:      string | null
  flag_emoji:       string | null
  notes:            string | null
  created_at:       string
  updated_at:       string
}

/* ── Lead (formulario del landing innovando-landing) ──────────────── */

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'discarded'
  | 'spam'

export interface Lead {
  id:               string
  source:           string                // 'landing' | 'reports' | ...
  page_key:         string | null
  page_slug:        string | null
  locale:           string | null
  service_interest: string | null
  business_type:    string | null
  name:             string
  email:            string | null
  message:          string | null
  instagram:        string | null
  facebook:         string | null
  website_linkedin: string | null
  phone:            string | null
  country:          string | null
  utm_source:       string | null
  utm_medium:       string | null
  utm_campaign:     string | null
  utm_term:         string | null
  utm_content:      string | null
  referrer:         string | null
  user_agent:       string | null
  ip:               string | null
  status:           LeadStatus
  internal_note:    string | null
  contacted_at:     string | null
  converted_at:     string | null
  business_id:      string | null
  assigned_to:      string | null         // auth.users.id
  status_changed_at: string | null
  created_at:       string
  updated_at:       string
}

/* Helper UI: usuario del dashboard mostrado en selects */
export interface DashboardUser {
  id:    string
  email: string | null
  name:  string | null
}
