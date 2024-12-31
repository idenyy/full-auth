import { Html } from "@react-email/html";
import * as React from "react";
import { Body, Heading, Link, Tailwind, Text } from "@react-email/components";

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const confirmLink = `${domain}/auth/reset-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="bg-white text-black font-sans">
          <Heading className="text-2xl font-bold mb-4">Reset Password</Heading>
          <Text className="mb-4 text-sm">Hi there,</Text>
          <Text className="mb-4 text-sm">
            We heard that you lost your password. Sorry about that! But don’t
            worry! You can use the following button to reset your password:
          </Text>
          <Link
            className="text-base text-center text-white py-2 px-7 bg-black rounded-full inline-block"
            href={confirmLink}
          >
            Reset password
          </Link>
          <Text className="mb-4 text-sm">
            This link is only active for the next 1 hour. Once the link expires,
            you will need to request a new one.
          </Text>
          <Text className="text-gray-500">
            &copy; {new Date().getFullYear()} VETRA. All rights reserved.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
