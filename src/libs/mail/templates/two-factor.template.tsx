import { Html } from "@react-email/html";
import * as React from "react";
import {
  Body,
  Container,
  Heading,
  Tailwind,
  Text,
} from "@react-email/components";

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body className="max-w-2xl min-w-[400px] mx-auto bg-white border border-gray-200 font-sans text-gray-900">
          <Heading className="text-lg text-left text-black">
            Two-Factor Authentication
          </Heading>
          <Text className="mt-8 text-base p-0">Hi there,</Text>
          <Text className="text-base py-1">
            Here is your one-time verification code to proceed:
          </Text>
          <Container className="w-full text-2xl font-bold tracking-widest bg-gray-100 text-center rounded-lg py-5 my-6">
            <strong>{token}</strong>
          </Container>
          <Text className="text-base">
            Please note, this code will expire in 15 minutes. If the code
            expires, you will need to request a new one.
          </Text>
          <Text className="mt-6 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} VETRA. All rights reserved.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
