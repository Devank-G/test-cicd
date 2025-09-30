'use server';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
});

export async function sendEmail(formData) {
  const { to, subject, htmlContent } = formData;

  function htmlToFormattedText(html) {
    // Prevent ReDoS by limiting input size
    if (html.length > 10000) {
      html = html.substring(0, 10000);
    }

    return html
      .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2: $1') // link as text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]*>/g, '') // strip all tags - fixed regex
      .replace(/\n{3,}/g, '\n\n') // reduce too many newlines
      .trim();
  }

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlContent,
        },
        Text: {
          Charset: 'UTF-8',
          Data: htmlToFormattedText(htmlContent), // Convert HTML to plain text
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'buzz@techlanz.com', //  verified email
  };

  try {
    await sesClient.send(new SendEmailCommand(params));
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Failed to send email' };
  }
}
