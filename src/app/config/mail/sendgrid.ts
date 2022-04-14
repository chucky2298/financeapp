import Sendgrid from '@sendgrid/mail';

import config from '../var/development';

Sendgrid.setApiKey(config.mailServiceApiKey);

/**
 * Creates and sends an email.
 * 
 * @param from
 * @param to
 * @param subject
 * @param html: Email content formatted as HTML
 * @param attachments: Attachments
 */

export const sendEmail = (params) => {
  return new Promise(() => {
    const body = {
      ...params,
      from: {
        email: params.from || config.mailServiceSender,
        name: config.appName
      },
    };

    if (params.attachments) {
      body.attachments = params.attachments;
    }

    Sendgrid.send(body);
  });
};