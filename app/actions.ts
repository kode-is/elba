"use server";

import { sendContact } from "@/lib/email/send-contact";
import type { ContactPayload } from "@/lib/email/contact";
import type { ContactResult } from "@/lib/email/send-contact";

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  return sendContact(payload);
}
