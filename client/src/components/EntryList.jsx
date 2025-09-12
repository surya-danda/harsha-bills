import React from 'react';
import EntryItem from './EntryItem';

const EntryList = ({ entries, department }) => {
  const filteredEntries = entries.filter(entry => entry.department === department);

  if (filteredEntries.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No entries yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl">{department} Entries ({filteredEntries.length})</h3>
      {filteredEntries.map(entry => (
        <EntryItem key={entry._id} entry={entry} />
      ))}
    </div>
  );
};

export default EntryList;