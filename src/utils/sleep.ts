export const sleep = (ms:number) => {
  console.log('Sleeping for ', ms / 1000, ' second');
  return new Promise((resolve) => setTimeout(resolve, ms));
}