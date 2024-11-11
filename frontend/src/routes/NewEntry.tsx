import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function NewEntry() {
  const emptyEntry: Entry = { title: "", description: "", scheduled_for: new Date(), created_at: new Date() };
  const { saveEntry } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };
  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    saveEntry(newEntry);
    setNewEntry(emptyEntry);
  };
  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-neutral-500 p-8 rounded-md">
      <div className="flex flex-col justify-center space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-black dark:text-white">
          Title
        </label>
        <input
          className="p-3 rounded-md"
          type="text"
          placeholder="Title"
          name="title"
          value={newEntry.title}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-black dark:text-white">
          Description
        </label>
        <textarea
          className="p-3 rounded-md"
          placeholder="Description"
          name="description"
          value={newEntry.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <label htmlFor="scheduled_for" className="text-sm font-medium text-black dark:text-white">
          Scheduled For
        </label>
        <input
          className="p-3 rounded-md"
          type="date"
          name="scheduled_for"
          value={new Date(newEntry.scheduled_for).toISOString().split("T")[0]}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <label htmlFor="created_at" className="text-sm font-medium text-black dark:text-white">
          Created At
        </label>
        <input
          className="p-3 rounded-md"
          type="date"
          name="created_at"
          value={new Date(newEntry.created_at).toISOString().split("T")[0]}
          onChange={handleInputChange}
        />
      </div>  
      <button
        onClick={(e) => {
          handleSend(e);
        }}
        className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md"
      >
        Create
      </button>
    </section>
  );
}
