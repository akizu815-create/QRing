/** Reference adapter only. NOT imported by the official site; requires confirmed app success hooks. */
export function createCompletionReporter({ send, storage, canTrack = () => false }) {
  function report(name, receipt, firstAccount) {
    try { if (!canTrack()) return {status:'tracking_not_ready'}; } catch { return {status:'tracking_not_ready'}; }
    if (!receipt || receipt.businessSuccess !== true || (firstAccount && receipt.registrationKind !== 'first_account')) return { status:'ignored' };
    // Locally generated random UUID, retained for this business operation. Never an account/QR identifier.
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(receipt.attemptToken || '')) return {status:'invalid_attempt'};
    const key = `qring-completion-v1:${name}:${receipt.attemptToken}`;
    try {
      if (!storage || typeof send !== 'function') return {status:'unavailable'};
      if (storage.getItem(key)) return {status:'duplicate'};
      // Reserve before dispatch, including unknown transport outcomes. No automatic retry/double send.
      storage.setItem(key,'reserved');
      if(storage.getItem(key)!=='reserved') return {status:'storage_unavailable'};
    } catch {return {status:'storage_unavailable'};}
    try {
      send(name, firstAccount ? {method:'web'} : {});
      return {status:'queued'}; // Client queue only, NOT proof that GA4 received the event.
    } catch {return {status:'transport_unknown'};}
  }
  return {
    contactCompleted(receipt) {return report('generate_lead',receipt,false);},
    accountCreated(receipt) {return report('sign_up',receipt,true);}
  };
}
