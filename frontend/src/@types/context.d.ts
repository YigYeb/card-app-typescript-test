export interface Entry {
  id?: string;
  title: string;
  description: string;
  scheduled_for: Date | string;
  created_at: Date | string;
}
export type EntryContextType = {
  entries: Entry[];
  saveEntry: (entry: Entry) => void;
  updateEntry: (id: string, entryData: Entry) => void;
  deleteEntry: (id: string) => void;
};
