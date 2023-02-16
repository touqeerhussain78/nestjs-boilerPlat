import axios, { AxiosResponse, AxiosError } from 'axios';
import { HttpStatus, HttpException } from '@nestjs/common';
import { stringify } from 'querystring';

export const sendSMS = async (to: string, body: string) => {
  let res = {};
  await axios({
    method: 'post',
    url: `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    headers: {
      Authorization: `Basic ${process.env.TWILIO_AUTH_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: stringify({
      To: to,
      MessagingServiceSid: process.env.TWILIO_MESSAGE_ID,
      Body: body,
    }),
  })
    .then((response: AxiosResponse) => {
      res = response.data;
    })
    .catch((error: AxiosError) => {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    });

  return res;
};
