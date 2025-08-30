import { contacts, leads, downloads, type Contact, type InsertContact, type Lead, type InsertLead, type Download, type InsertDownload } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContactById(id: string): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;

  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadById(id: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;

  // Downloads
  createDownload(download: InsertDownload): Promise<Download>;
  getDownloadById(id: string): Promise<Download | undefined>;
  getDownloads(): Promise<Download[]>;
}

export class DatabaseStorage implements IStorage {
  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  // Leads
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  // Downloads
  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db
      .insert(downloads)
      .values(insertDownload)
      .returning();
    return download;
  }

  async getDownloadById(id: string): Promise<Download | undefined> {
    const [download] = await db.select().from(downloads).where(eq(downloads.id, id));
    return download || undefined;
  }

  async getDownloads(): Promise<Download[]> {
    return await db.select().from(downloads);
  }
}

export const storage = new DatabaseStorage();
