/**
* Formats the price to display only the necessary decimal places.
* 
* Example:
* - formatPrice("R$ 123.45") => "123.45"
* - formatPrice("R$ 123,45") => "123.45"
* - formatPrice("$ 123.45") => "123.45"
* - formatPrice("$ 123,45") => "123.45"
* - formatPrice("123,45") => "123.45"
* - formatPrice("123.45") => "123.45"
* - formatPrice("123") => "123"
* 
*/

export const formatPrice = (value: string): string => {
  // rm non-numeric characters
  const numericPrice = value.replace(/[^0-9,.]/g, '');
  
  // em extra commas and replace dot with comma
  const formattedPrice = numericPrice.replace(/,{2,}/g, ',').replace('.', ',');

  // separate integer and decimal parts
  const parts = formattedPrice.split(',');

  // format integer part with no decimal places
  const integerPart = parts[0];

  // format decimal part with up to three decimal places
  const decimalPart = parts[1] ? `.${parts[1].slice(0, 3)}` : '';

  return `${integerPart}${decimalPart}`;
}
