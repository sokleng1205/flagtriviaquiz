
import { Country } from '../types';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,region,subregion,population,cca2');
    if (!response.ok) throw new Error('Failed to fetch countries');
    const data = await response.json();
    // Filter out countries without essential data
    return data.filter((c: Country) => c.capital && c.capital.length > 0 && c.currencies);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};
