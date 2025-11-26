// Cryptographically secure random number in range [min, max]
export const getRandomInt = (min: number, max: number): number => {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const cutoff = Math.floor((256 ** bytesNeeded) / range) * range;
  const bytes = new Uint8Array(bytesNeeded);
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    window.crypto.getRandomValues(bytes);
    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) + bytes[i];
    }
    if (value < cutoff) {
      return min + (value % range);
    }
  }
};

export const generateUUID = (): string => {
  return crypto.randomUUID();
};

export const generateHex = (length: number): string => {
  const array = new Uint8Array(Math.ceil(length / 2));
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, length);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

export const generatePassword = (length: number, options: { numbers: boolean; symbols: boolean; uppercase: boolean }): string => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lower;
  if (options.uppercase) chars += upper;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  let result = '';
  // Ensure at least one of each selected type
  const required: string[] = [];
  if (options.uppercase) required.push(upper[getRandomInt(0, upper.length - 1)]);
  if (options.numbers) required.push(numbers[getRandomInt(0, numbers.length - 1)]);
  if (options.symbols) required.push(symbols[getRandomInt(0, symbols.length - 1)]);

  // Fill the rest
  for (let i = 0; i < length - required.length; i++) {
    result += chars[getRandomInt(0, chars.length - 1)];
  }

  // Insert required chars at random positions
  const finalArray = result.split('');
  required.forEach(char => {
    finalArray.splice(getRandomInt(0, finalArray.length), 0, char);
  });

  return finalArray.join('');
};