/**
 * SkyBook Flight Reservation System
 * Flight Search & Filter Service
 */

import { sampleFlights, airports } from '../data/flights';
import { isDateInRange } from '../utils/dateUtils';
import { getClassMultiplier } from '../utils/pricing';

// Cache for dynamically generated flights so they persist across routes
const dynamicFlightsCache = new Map();

/**
 * Helper to find airport details by code or city name
 */
export const findAirport = (query) => {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  return (
    airports.find(
      (a) =>
        a.code.toLowerCase() === q ||
        a.city.toLowerCase() === q ||
        a.city.toLowerCase().includes(q) ||
        q.includes(a.city.toLowerCase()) ||
        q.includes(a.code.toLowerCase())
    ) || {
      city: query.toUpperCase(),
      airport: `${query.toUpperCase()} Airport`,
      code: query.slice(0, 3).toUpperCase(),
    }
  );
};

/**
 * Generate realistic sample flights for routes not in the static dataset
 */
const generateRouteFlights = (originCode, destCode, requestedClass = 'Economy') => {
  const originAirport = findAirport(originCode);
  const destAirport = findAirport(destCode);

  const cacheKey = `${originAirport.code}_${destAirport.code}_${requestedClass}`;
  if (dynamicFlightsCache.has(cacheKey)) {
    return dynamicFlightsCache.get(cacheKey);
  }

  // Check if international route
  const isInternational =
    ['DXB', 'SIN', 'LHR'].includes(originAirport.code) ||
    ['DXB', 'SIN', 'LHR'].includes(destAirport.code);

  const isLongHaul = originAirport.code === 'LHR' || destAirport.code === 'LHR';

  const basePrice = isLongHaul ? 36000 : isInternational ? 13500 : 4200;
  const durationMins = isLongHaul ? 530 : isInternational ? 250 : 130;
  const durHours = Math.floor(durationMins / 60);
  const durRemMins = durationMins % 60;
  const durationStr = `${durHours}h ${durRemMins > 0 ? durRemMins + 'm' : ''}`.trim();

  const airlinePresets = [
    {
      airline: 'Air India',
      logo: 'AI',
      prefix: 'AI',
      aircraft: isLongHaul ? 'Boeing 787-8 Dreamliner' : 'Airbus A321neo',
      amenities: ['In-flight Meals', 'Entertainment', 'USB Charging'],
      refundable: true,
      depHour: 6,
      depMin: 30,
      stops: 0,
      priceOffset: 400,
    },
    {
      airline: 'IndiGo',
      logo: '6E',
      prefix: '6E',
      aircraft: 'Airbus A320neo',
      amenities: ['USB Charging', 'Extra Legroom Option'],
      refundable: false,
      depHour: 9,
      depMin: 15,
      stops: 0,
      priceOffset: -300,
    },
    {
      airline: 'Vistara',
      logo: 'UK',
      prefix: 'UK',
      aircraft: isLongHaul ? 'Boeing 787-9' : 'Airbus A320neo',
      amenities: ['In-flight Meals', 'Entertainment', 'Wi-Fi', 'USB Charging'],
      refundable: true,
      depHour: 13,
      depMin: 45,
      stops: 0,
      priceOffset: 800,
    },
    {
      airline: 'SpiceJet',
      logo: 'SG',
      prefix: 'SG',
      aircraft: 'Boeing 737 MAX 8',
      amenities: ['USB Charging'],
      refundable: false,
      depHour: 17,
      depMin: 10,
      stops: 1,
      stopDetails: [{ city: 'Mumbai', code: 'BOM', layover: '50m' }],
      priceOffset: -600,
    },
    {
      airline: 'Akasa Air',
      logo: 'QP',
      prefix: 'QP',
      aircraft: 'Boeing 737-800',
      amenities: ['USB Charging', 'Café Akasa'],
      refundable: true,
      depHour: 20,
      depMin: 30,
      stops: 0,
      priceOffset: -150,
    },
  ];

  const generated = airlinePresets.map((preset, index) => {
    const flightNum = `${preset.prefix}-${Math.floor(100 + Math.random() * 899)}`;
    const depTime = `${String(preset.depHour).padStart(2, '0')}:${String(preset.depMin).padStart(2, '0')}`;
    
    // Arrival calculation
    const totalArrMins = preset.depHour * 60 + preset.depMin + durationMins + (preset.stops * 45);
    const arrHour = Math.floor(totalArrMins / 60) % 24;
    const arrMin = totalArrMins % 60;
    const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

    const mult = getClassMultiplier(requestedClass);
    const rawBasePrice = Math.max(2500, basePrice + preset.priceOffset);
    const calculatedPrice = Math.round(rawBasePrice * mult);

    return {
      id: `GEN_${originAirport.code}_${destAirport.code}_${index + 1}`,
      airline: preset.airline,
      airlineLogo: preset.logo,
      flightNumber: flightNum,
      origin: {
        city: originAirport.city,
        airport: originAirport.airport || `${originAirport.city} Airport`,
        code: originAirport.code,
      },
      destination: {
        city: destAirport.city,
        airport: destAirport.airport || `${destAirport.city} Airport`,
        code: destAirport.code,
      },
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: preset.stops > 0 ? `${durHours + 1}h ${durRemMins + 45}m` : durationStr,
      durationMinutes: durationMins + (preset.stops * 45),
      stops: preset.stops,
      stopDetails: preset.stopDetails || [],
      basePrice: rawBasePrice,
      baseCabinClass: 'Economy',
      cabinClass: requestedClass || 'Economy',
      price: calculatedPrice,
      childPrice: Math.round(calculatedPrice * 0.75),
      infantPrice: Math.round(calculatedPrice * 0.1),
      seatsAvailable: Math.floor(15 + Math.random() * 40),
      baggage: {
        cabin: '7 kg',
        checkin: isLongHaul ? '30 kg' : isInternational ? '25 kg' : '15 kg',
      },
      aircraft: preset.aircraft,
      amenities: preset.amenities,
      refundable: preset.refundable,
      cancellationFee: preset.refundable ? Math.round(calculatedPrice * 0.15) : 0,
      dateRange: ['2026-10-01', '2027-12-31'],
    };
  });

  dynamicFlightsCache.set(cacheKey, generated);
  return generated;
};

/**
 * Searches for flights matching the given search parameters.
 * Returns sampleFlights or dynamically generated realistic flights.
 *
 * @param {object} searchParams
 * @returns {Array} Matching flights
 */
export const searchFlights = (searchParams) => {
  const requestedCabin = searchParams?.cabinClass || 'Economy';
  const mult = getClassMultiplier(requestedCabin);

  const applyCabin = (flight) => {
    const basePrice = flight.basePrice || flight.price;
    const baseCabin = flight.baseCabinClass || 'Economy';
    const baseMult = getClassMultiplier(baseCabin) || 1;
    const adjustedPrice = Math.round(basePrice * (mult / baseMult));

    return {
      ...flight,
      basePrice,
      baseCabinClass: baseCabin,
      cabinClass: requestedCabin,
      price: adjustedPrice,
      childPrice: Math.round(adjustedPrice * 0.75),
      infantPrice: Math.round(adjustedPrice * 0.1),
    };
  };

  // If no params or empty search, return all sample flights with cabin applied
  if (!searchParams || (!searchParams.origin && !searchParams.destination)) {
    return sampleFlights.map(applyCabin);
  }

  const originRaw = (searchParams.origin || '').toLowerCase().trim();
  const destRaw = (searchParams.destination || '').toLowerCase().trim();

  // 1. Search in static sampleFlights
  const matched = sampleFlights.filter((flight) => {
    let originMatch = true;
    if (originRaw) {
      originMatch =
        flight.origin.code.toLowerCase() === originRaw ||
        flight.origin.city.toLowerCase() === originRaw ||
        flight.origin.city.toLowerCase().includes(originRaw) ||
        originRaw.includes(flight.origin.city.toLowerCase()) ||
        originRaw.includes(flight.origin.code.toLowerCase());
    }

    let destMatch = true;
    if (destRaw) {
      destMatch =
        flight.destination.code.toLowerCase() === destRaw ||
        flight.destination.city.toLowerCase() === destRaw ||
        flight.destination.city.toLowerCase().includes(destRaw) ||
        destRaw.includes(flight.destination.city.toLowerCase()) ||
        destRaw.includes(flight.destination.code.toLowerCase());
    }

    return originMatch && destMatch;
  });

  // If matches exist in sampleFlights, adjust for requested cabin class and return
  if (matched.length > 0) {
    return matched.map(applyCabin);
  }

  // 2. If no direct match in sampleFlights and both origin & destination given, generate realistic flights
  if (originRaw && destRaw) {
    return generateRouteFlights(searchParams.origin, searchParams.destination, requestedCabin);
  }

  // Fallback: return sampleFlights so the user always has flights to explore
  return sampleFlights.map(applyCabin);
};

/**
 * Returns a single flight by its ID.
 * Looks in sampleFlights, dynamic cache, or creates on the fly if needed.
 * @param {string} id
 * @returns {object|null}
 */
export const getFlightById = (id) => {
  if (!id) return null;

  // 1. Check sampleFlights
  const staticFlight = sampleFlights.find((f) => f.id === id);
  if (staticFlight) return staticFlight;

  // 2. Check dynamic cache
  for (const flights of dynamicFlightsCache.values()) {
    const found = flights.find((f) => f.id === id);
    if (found) return found;
  }

  // 3. If ID starts with GEN_ORIGIN_DEST_INDEX, reconstruct it
  if (id.startsWith('GEN_')) {
    const parts = id.split('_');
    if (parts.length >= 3) {
      const originCode = parts[1];
      const destCode = parts[2];
      const generated = generateRouteFlights(originCode, destCode);
      const found = generated.find((f) => f.id === id);
      if (found) return found;
      if (generated.length > 0) return generated[0];
    }
  }

  // Fallback to first sample flight
  return sampleFlights[0] || null;
};

/**
 * Applies filters to an array of flights.
 * Supports all filter parameter shapes (FlightFilters component, sliders, etc.)
 */
export const filterFlights = (flights, filters = {}) => {
  if (!flights || flights.length === 0) return [];
  if (!filters || Object.keys(filters).length === 0) return flights;

  let workingFlights = flights;

  // Cabin Class Filter - adjusts price dynamically if chosen
  const cabinFilter = filters.cabinClass;
  if (cabinFilter && cabinFilter !== 'all') {
    const mult = getClassMultiplier(cabinFilter);
    workingFlights = workingFlights.map((flight) => {
      const basePrice = flight.basePrice || flight.price;
      const baseCabin = flight.baseCabinClass || 'Economy';
      const baseMult = getClassMultiplier(baseCabin) || 1;
      const adjustedPrice = Math.round(basePrice * (mult / baseMult));
      return {
        ...flight,
        basePrice,
        baseCabinClass: baseCabin,
        cabinClass: cabinFilter,
        price: adjustedPrice,
        childPrice: Math.round(adjustedPrice * 0.75),
        infantPrice: Math.round(adjustedPrice * 0.1),
      };
    });
  }

  const priceMin =
    filters.priceMin !== undefined
      ? filters.priceMin
      : filters.priceRange
      ? filters.priceRange[0]
      : 0;

  const priceMax =
    filters.priceMax !== undefined && filters.priceMax > 0
      ? filters.priceMax
      : filters.priceRange && filters.priceRange[1] > 0
      ? filters.priceRange[1]
      : Infinity;

  const airlines =
    filters.selectedAirlines?.length > 0
      ? filters.selectedAirlines
      : filters.airlines?.length > 0
      ? filters.airlines
      : null;

  const stops = filters.stops;
  const depTime = filters.departureTime || filters.departureTimeRange;

  return workingFlights.filter((flight) => {
    // Price range
    if (priceMin > 0 && flight.price < priceMin) return false;
    if (priceMax < Infinity && flight.price > priceMax) return false;

    // Airlines
    if (airlines && !airlines.includes(flight.airline)) return false;

    // Stops
    if (stops && stops !== 'any') {
      if (typeof stops === 'string') {
        if (stops === '0' && flight.stops !== 0) return false;
        if (stops === '1' && flight.stops !== 1) return false;
        if (stops === '2+' && flight.stops < 2) return false;
      } else if (Array.isArray(stops) && stops.length > 0) {
        const matches = stops.some((s) => (s === 2 ? flight.stops >= 2 : flight.stops === s));
        if (!matches) return false;
      }
    }

    // Departure time
    if (depTime && depTime !== 'any') {
      const hour = parseInt((flight.departureTime || '00:00').split(':')[0], 10);
      const ranges = Array.isArray(depTime) ? depTime : [depTime];
      if (ranges.length > 0 && !ranges.includes('any')) {
        const matches = ranges.some((range) => {
          switch (range) {
            case 'early_morning':
              return hour >= 0 && hour < 6;
            case 'morning':
              return hour >= 6 && hour < 12;
            case 'afternoon':
              return hour >= 12 && hour < 18;
            case 'evening':
              return hour >= 18 && hour < 21;
            case 'night':
              return hour >= 21 || hour < 6;
            default:
              return true;
          }
        });
        if (!matches) return false;
      }
    }

    return true;
  });
};

/**
 * Sorts an array of flights by the given criteria.
 */
export const sortFlights = (flights, sortBy = 'price_asc') => {
  const sorted = [...flights];

  switch (sortBy) {
    case 'price_asc':
    case 'cheapest':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
    case 'expensive':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration_asc':
    case 'fastest':
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'duration_desc':
      return sorted.sort((a, b) => b.durationMinutes - a.durationMinutes);
    case 'departure_asc':
    case 'earliest':
      return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    case 'departure_desc':
    case 'latest':
      return sorted.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
    case 'seats_desc':
      return sorted.sort((a, b) => b.seatsAvailable - a.seatsAvailable);
    default:
      return sorted;
  }
};

/**
 * Extracts unique airline names from a list of flights.
 */
export const getAvailableAirlines = (flights) => {
  const airlines = [...new Set(flights.map((f) => f.airline))];
  return airlines.sort();
};

/**
 * Checks whether a flight is available on a specific date.
 */
export const isFlightAvailable = (flight, date) => {
  if (!flight || !date) return false;
  if (flight.seatsAvailable <= 0) return false;
  return isDateInRange(date, flight.dateRange[0], flight.dateRange[1]);
};

/**
 * Returns the price range (min/max) from a list of flights.
 */
export const getPriceRange = (flights) => {
  if (!flights || flights.length === 0) return { min: 0, max: 0 };
  const prices = flights.map((f) => f.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export default {
  searchFlights,
  getFlightById,
  filterFlights,
  sortFlights,
  getAvailableAirlines,
  isFlightAvailable,
  getPriceRange,
  findAirport,
};
