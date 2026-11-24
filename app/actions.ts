"use server";

import { sendContact } from "@/lib/email/send-contact";
import { sendApplication } from "@/lib/email/send-application";
import type { ContactPayload } from "@/lib/email/contact";
import type { ContactResult } from "@/lib/email/send-contact";
import type { ApplicationPayload } from "@/lib/email/application";
import type { ApplicationResult } from "@/lib/email/send-application";

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  return sendContact(payload);
}

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationResult> {
  return sendApplication(payload);
}
