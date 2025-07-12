import axios from '../axios';

interface CreateStripeCheckoutSessionBundleResponse {
  checkoutSessionId: string;
}

export async function createStripeCheckoutSessionBundle(bundleId: string) {
  const response = await axios.post<CreateStripeCheckoutSessionBundleResponse>(
    `/stripe/create-checkout-session/bundle/${bundleId}`
  );
  return response.data;
}

export async function createStripeCheckoutSessionCoinPackage(
  coinPackageId: string
) {
  const response = await axios.post<CreateStripeCheckoutSessionBundleResponse>(
    `/stripe/create-checkout-session/coinPackage/${coinPackageId}`
  );
  return response.data;
}
