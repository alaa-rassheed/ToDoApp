const CATALYST_PROJECT_ID = import.meta.env.VITE_CATALYST_PROJECT_ID;
const CATALYST_ENV = import.meta.env.VITE_CATALYST_ENVIRONMENT || 'Development';

let catalystInstance = null;

export async function initCatalyst() {
  if (catalystInstance) return catalystInstance;

  // When Catalyst Web SDK is available, initialize here:
  // const catalyst = await import('@zohocatalyst/catalyst-sdk-js');
  // catalystInstance = catalyst.initialize({
  //   projectId: CATALYST_PROJECT_ID,
  //   environment: CATALYST_ENV,
  // });

  return catalystInstance;
}

export function getCatalyst() {
  return catalystInstance;
}
