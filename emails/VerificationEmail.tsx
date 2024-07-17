import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from "@react-email/components";

interface VerificationEmail {
  username: string;
  otp: string;
}

const EmailTemplate: React.FC<VerificationEmail> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Body>
        <Container>
          <Section>
            <Heading>Hi {username},</Heading>
            <Text>Your OTP code is: {otp}</Text>
            <Text>
              Please use this code to complete your authentication process.
            </Text>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
