export const STATE_DOWN_PAYMENTS = {
    'Alabama': { percentage: 10.70, median: 8788 },
    'Alaska': { percentage: 12.20, median: 21354 },
    'Arizona': { percentage: 15.40, median: 34072 },
    'Arkansas': { percentage: 11.80, median: 11996 },
    'California': { percentage: 18.40, median: 84244 },
    'Colorado': { percentage: 18.50, median: 75304 },
    'Connecticut': { percentage: 16.60, median: 47342 },
    'Delaware': { percentage: 17.00, median: 40412 },
    'District of Columbia': { percentage: 20.90, median: 98670 },
    'Florida': { percentage: 15.90, median: 35572 },
    'Georgia': { percentage: 12.70, median: 18258 },
    'Hawaii': { percentage: 17.00, median: 67790 },
    'Idaho': { percentage: 20.20, median: 64985 },
    'Illinois': { percentage: 14.30, median: 27348 },
    'Indiana': { percentage: 12.60, median: 17477 },
    'Iowa': { percentage: 15.50, median: 26461 },
    'Kansas': { percentage: 13.10, median: 18325 },
    'Kentucky': { percentage: 13.40, median: 17548 },
    'Louisiana': { percentage: 9.20, median: 6470 },
    'Maine': { percentage: 16.00, median: 40400 },
    'Maryland': { percentage: 11.90, median: 25723 },
    'Massachusetts': { percentage: 18.90, median: 79206 },
    'Michigan': { percentage: 14.20, median: 23153 },
    'Minnesota': { percentage: 16.10, median: 38500 },
    'Mississippi': { percentage: 9.30, median: 5814 },
    'Missouri': { percentage: 12.90, median: 17832 },
    'Montana': { percentage: 21.00, median: 72833 },
    'Nebraska': { percentage: 15.40, median: 29617 },
    'Nevada': { percentage: 15.00, median: 33306 },
    'New Hampshire': { percentage: 20.00, median: 71500 },
    'New Jersey': { percentage: 18.10, median: 71547 },
    'New Mexico': { percentage: 12.60, median: 17576 },
    'New York': { percentage: 17.00, median: 50843 },
    'North Carolina': { percentage: 14.50, median: 31867 },
    'North Dakota': { percentage: 15.00, median: 24543 },
    'Ohio': { percentage: 12.30, median: 15064 },
    'Oklahoma': { percentage: 12.30, median: 13177 },
    'Oregon': { percentage: 17.30, median: 55015 },
    'Pennsylvania': { percentage: 13.80, median: 25402 },
    'Rhode Island': { percentage: 16.60, median: 45285 },
    'South Carolina': { percentage: 15.10, median: 24357 },
    'South Dakota': { percentage: 16.80, median: 37630 },
    'Tennessee': { percentage: 14.60, median: 25969 },
    'Texas': { percentage: 12.20, median: 18780 },
    'Utah': { percentage: 16.40, median: 43488 },
    'Vermont': { percentage: 17.50, median: 48354 },
    'Virginia': { percentage: 13.50, median: 29704 },
    'Washington': { percentage: 18.60, median: 86752 },
    'West Virginia': { percentage: 9.20, median: 6611 },
    'Wisconsin': { percentage: 15.00, median: 28333 },
    'Wyoming': { percentage: 16.00, median: 32389 }
  } as const;
  
  export type StateName = keyof typeof STATE_DOWN_PAYMENTS;