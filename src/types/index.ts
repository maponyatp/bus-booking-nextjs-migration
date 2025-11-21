export interface Operator {
  id: number;
  companyName: string;
  contactPerson?: string;
  contactDetails?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  logoUrl?: string;
  createdAt?: string;
}

export interface User {
  id: number;
  operatorId?: number;
  username: string;
  email: string;
  name?: string;
  role: 'Admin' | 'SalesAgent' | 'FleetManager' | 'SuperAdmin' | 'TerminalAdmin' | 'TerminalSecurity' | 'TerminalCashier';
}

export interface Route {
  id: number;
  operatorId: number;
  name: string;
  startPoint: string;
  endPoint: string;
  weekdayPrice: number;
  weekendPrice: number;
  stops?: RouteStop[];
}

export interface RouteStop {
  id: number;
  routeId: number;
  stopName: string;
  stopOrder: number;
  priceFromStart: number;
  isPickupPoint: boolean;
  isDropoffPoint: boolean;
  arrivalTime?: string;
  departureTime?: string;
}

export interface SeatLayoutCell {
  label?: string;
  type: 'seat' | 'aisle' | 'driver' | 'empty';
}

export interface Bus {
  id: number;
  operatorId: number;
  name: string;
  registration: string;
  capacity: number;
  layout?: SeatLayoutCell[][] | string; // JSON string or object
  status: 'Available' | 'On Trip' | 'Maintenance';
}

export interface Driver {
  id: number;
  operatorId: number;
  name: string;
  licenseNumber: string;
  contactNumber?: string;
}

export interface Departure {
  id: number;
  routeId: number;
  busId: number;
  driverId?: number;
  operatorId: number;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM:SS
  status: 'Scheduled' | 'Boarding' | 'Departed' | 'Arrived' | 'Cancelled';
}

export interface Customer {
  id: number;
  name: string;
  contactNumber: string; // This is 'phone' in some frontend contexts
  email?: string; // Added from frontend usage
  surname?: string; // Added from frontend usage
  operatorId: number;
  nextOfKinName?: string;
  nextOfKinContact?: string;
}

export interface Booking {
  id: number;
  departureId: number;
  seatNumber?: number | string; // Changed to accept string ('N/A')
  passengerName: string;
  passengerContact: string;
  nextOfKinName?: string;
  nextOfKinContact?: string;
  bookingRef: string;
  base_price: number;
  system_fee: number;
  amount: number;
  agentId?: number;
  agentName?: string;
  operatorId: number;
  status: 'Confirmed' | 'Cancelled' | 'Redeemed' | 'Pending Payment';
  bookingType: 'OneWay' | 'Return' | 'OpenReturn';
  linkedBookingId?: number;
  notes?: string;
  createdAt: string;
  
  // Joined fields often returned by API
  routeName?: string;
  busName?: string;
  fromStop?: string;
  toStop?: string;
  departureDate?: string;
  departureTime?: string;
  operatorName?: string;
  companyName?: string; // For display
}

export interface Parcel {
  id: number;
  operatorId: number;
  routeId: number;
  trackingNumber: string;
  senderName: string;
  senderContact: string;
  receiverName: string;
  receiverContact: string;
  description?: string;
  weight?: number;
  cost: number;
  status: 'Booked' | 'In Transit' | 'Delivered';
  agentId?: number;
  createdAt: string;
  
  // Joined fields
  fromStop?: string;
  toStop?: string;
  operatorName?: string;
  dateSent?: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface SearchResult {
  departure: Departure;
  route: Route & { fromStop?: string; toStop?: string }; // Enriched route info
  bus: Bus;
  operator: Operator;
  price: number;
  availableSeats: number;
  bookedCount: number;
}

export interface BookingDetails {
  trip: SearchResult;
  selectedSeats: string[];
  bookingPrice: number;
  pickupStopName?: string;
  dropoffStopName?: string;
}

export interface OrgBranding {
  orgLogoUrl: string;
  faviconUrl: string;
  company_name?: string;
}

export interface Invoice {
  id: number;
  operatorId: number;
  invoiceDate: string;
  generatedAt: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  ticketsSold: number;
  systemFeeTotal: number;
  operatorName: string;
  operatorAddress?: string;
  operatorContactEmail?: string;
  operatorContactPhone?: string;
}

export interface TicketData {
  bookingRef: string;
  passengerName: string;
  routeName: string;
  seatNumber: string;
  departureDate: string;
  departureTime: string;
  amount: string | number;
  status: string;
  companyName?: string;
  logoUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
}
