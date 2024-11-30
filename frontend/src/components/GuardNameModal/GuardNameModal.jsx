import React, { useState } from 'react';
import { Input } from "../Ui/Input/Input";
import { Button } from "../Ui/Button/Botton";

const GuardNameModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-medium mb-4">Enter Guard Name</h3>
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => {
              onSubmit(name);
              setName('');
            }}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuardNameModal;