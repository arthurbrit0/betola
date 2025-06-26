import { IEmailSender } from '@betola/core';

export class ConsoleEmailSender implements IEmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log('--- Email Sent ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:');
    console.log(body);
    console.log('------------------');
  }
} 