// Sends the contact form through Web3Forms. The site is static (GitHub Pages), so the
// message goes straight from the browser to Web3Forms, which emails it to the inbox the
// access key was created for. Returns 'success' or the name of the message to show.
export const web3formsUrl = 'https://api.web3forms.com/submit';

export async function sendEnquiry({ data, language, strings, fetchImpl = fetch, timeout = 20000 }) {
  // A filled honeypot means a bot: report success and send nothing.
  if (data.website) return 'success';
  if (!strings.formKey) return 'unavailable';
  try {
    const response = await fetchImpl(web3formsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: strings.formKey,
        subject: strings.subject,
        from_name: 'Velnovara Group website',
        name: data.name,
        email: data.email,
        message: data.message,
        language,
        botcheck: ''
      }),
      signal: AbortSignal.timeout(timeout)
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.success === true) return 'success';
    // The browser has already checked the fields, so other failures are setup or service problems.
    return response.status === 429 ? 'rate' : 'error';
  } catch {
    return 'error';
  }
}
