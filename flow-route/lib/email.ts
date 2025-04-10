// This is a simulated email service
// In a real application, you would use a service like SendGrid, Mailgun, etc.

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // In development, we'll just log the email
  console.log(`
    --------------------------------
    To: ${to}
    Subject: ${subject}
    
    ${html}
    --------------------------------
  `);
  
  // In production, you would use a real email service
  // Example with SendGrid:
  // const msg = {
  //   to,
  //   from: 'your-verified-sender@example.com',
  //   subject,
  //   html,
  // };
  // await sgMail.send(msg);
  
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return { success: true };
}
