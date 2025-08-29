import { type Contact, type InsertContact, type Lead, type InsertLead, type Download, type InsertDownload } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private contacts: Map<string, Contact>;
  private leads: Map<string, Lead>;
  private downloads: Map<string, Download>;

  constructor() {
    this.contacts = new Map();
    this.leads = new Map();
    this.downloads = new Map();
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      created_at: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Leads
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      ...insertLead,
      id,
      created_at: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  // Downloads
  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const download: Download = {
      ...insertDownload,
      id,
      created_at: new Date(),
    };
    this.downloads.set(id, download);
    return download;
  }

  async getDownloadById(id: string): Promise<Download | undefined> {
    return this.downloads.get(id);
  }

  async getDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values());
  }
}

export const storage = new MemStorage();
